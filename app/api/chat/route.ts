import { embeddings } from "@/lib/embeddings";
import { prisma } from "@/lib/prisma";
import { generateAIResponse } from "@/lib/ai-router";

export const runtime = "nodejs";

export async function POST(req: Request) {

    try {

        const reqData = await req.json();
        const { message, workspaceId, knowledgeIds } = reqData;
        const { provider = "groq", model = "llama-3.1-8b-instant", apiKey = process.env.GROQ_API_KEY } = reqData;

        if (!message) {
            return new Response("Missing message", { status: 400 });
        }

        if (!knowledgeIds || knowledgeIds.length === 0) {
            return new Response(
                "No knowledge base selected for this chatbot.",
                { status: 400 }
            );
        }

        /*
          VECTOR SEARCH (RAG)
        */

        const queryVector = await embeddings.embedQuery(message);
        const vectorString = `[${queryVector.join(",")}]`;

        const ids = knowledgeIds.map((id: string) => `'${id}'`).join(",");

        const chunks = await prisma.$queryRawUnsafe<any[]>(`
            SELECT content, "fileId", embedding::vector <-> '${vectorString}'::vector AS distance
            FROM "Chunk"
            WHERE "workspaceId" = '${workspaceId}'
            AND "fileId" IN (${ids})
            ORDER BY distance
            LIMIT 10
        `);

        if (!chunks || chunks.length === 0) {

            return new Response(
                "I can only answer questions related to the documents attached to this chatbot.",
                { headers: { "Content-Type": "text/plain" } }
            );

        }

        const context = chunks.map(c => c.content).join("\n\n");

        const systemPrompt = `
            You are an AI assistant that answers ONLY using the provided knowledge base.

            Rules:
            - Only answer using the context below.
            - If the answer cannot be found in the context, respond with:
            "I cannot answer this because it is outside the knowledge base."
            - Do NOT use outside knowledge.
            - Do NOT guess or fabricate information.

            Knowledge Base Context:
            ${context}
        `;

        const supportedProviders = ["chatgpt", "groq", "meta", "deepseek", "mistral", "gemini", "claude"];

        if (!supportedProviders.includes(provider)) {
            return new Response("Unsupported provider", { status: 400 });
        }

        let completion = await generateAIResponse({ provider, model, apiKey, systemPrompt, message });

        const encoder = new TextEncoder();

        const stream = new ReadableStream({
            async start(controller) {

                for await (const chunk of completion as any) {

                    let token = "";

                    if (provider === "gemini") {
                        token = chunk.text();
                    }

                    else if (provider === "claude") {
                        token = chunk.delta?.text || "";
                    }

                    else {
                        token = chunk.choices?.[0]?.delta?.content || "";
                    }

                    controller.enqueue(encoder.encode(token));

                }

                controller.close();

            }
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8"
            }
        });

    }

    catch (error) {

        console.error("Chat error:", error);

        return new Response("Chat failed", { status: 500 });

    }

}