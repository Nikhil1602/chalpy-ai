import { embeddings } from "@/lib/embeddings";
import { prisma } from "@/lib/prisma";
import { generateAIResponse } from "@/lib/ai-router";
import { NextResponse } from "next/server";
import { ChatHandlePropTypes, Tone } from "@/types";
import { ALLOWED_TONES } from "./constants";

function estimateTokens(text: string) {
    return Math.ceil(text.length / 4);
}

export async function handleChat({ message, workspaceId, knowledgeIds, provider = "groq", model = "llama-3.1-8b-instant", apiKey = "cx3xxxx2342S4r", tone, enabledMemory, history = [] }: ChatHandlePropTypes) {

    if (!message) {
        return new Response("Missing message", { status: 400 });
    }

    if (!knowledgeIds || knowledgeIds.length === 0) {
        return NextResponse.json({ message: "No knowledge base selected for this chatbot." }, { status: 400 });
    }

    const finalTone: Tone = ALLOWED_TONES.includes(tone as Tone)
        ? (tone as Tone)
        : "professional";

    const finalEnabledMemory = Boolean(enabledMemory);

    const toneInstructionMap: Record<Tone, string> = {
        professional: "Respond in a clear, concise, and professional manner.",
        casual: "Respond in a relaxed and conversational tone.",
        friendly: "Respond in a warm, friendly, and helpful tone.",
        formal: "Respond in a formal and structured manner."
    };

    const toneInstruction = toneInstructionMap[finalTone];

    /*
      VECTOR SEARCH
    */
    const queryVector = await embeddings.embedQuery(message);
    const vectorString = `[${queryVector.join(",")}]`;

    const ids = knowledgeIds.map((id) => `'${id}'`).join(",");

    const chunks = await prisma.$queryRawUnsafe<any[]>(`
        SELECT content, "fileId", embedding::vector <-> '${vectorString}'::vector < 0.8 AS distance
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

    const context = chunks.map((c) => c.content).join("\n\n");

    /*
      Tone + Memory Instructions
    */

    const memoryInstruction = finalEnabledMemory
        ? "Maintain conversational context if applicable."
        : "Do not rely on past conversation.";

    const systemPrompt = `
        You are an AI assistant that answers ONLY using the provided knowledge base.

        ${toneInstruction}
        ${memoryInstruction}

        Rules:
        - Only answer using the context below.
        - If the answer is explicitly present, return it.
        - If it can be logically inferred, you may answer.
        - If not found, say:
        "I cannot answer this because it is outside the knowledge base."
        - Do NOT hallucinate.

        Knowledge Base Context:
        ${context}
    `;

    const supportedProviders = ["chatgpt", "groq", "meta", "deepseek", "mistral", "gemini", "claude"];

    if (!supportedProviders.includes(provider)) {
        return new Response("Unsupported provider", { status: 400 });
    }

    const completion = await generateAIResponse({
        provider,
        model,
        apiKey,
        systemPrompt,
        message,
        history: finalEnabledMemory ? history : []
    });

    const { stream: aiStream, append, getFullResponse } = completion;

    // console.log("=========================================>")
    // console.log({ aiStream, append });
    // console.log("=========================================>")

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        async start(controller) {
            for await (const chunk of aiStream as any) {
                let token = "";

                if (provider === "gemini") token = chunk.text();
                else if (provider === "claude") token = chunk.delta?.text || "";
                else token = chunk.choices?.[0]?.delta?.content || "";

                if (token) {
                    append(token);
                    controller.enqueue(encoder.encode(token));
                }

            }

            const fullResponse = getFullResponse();

            const promptTokens = estimateTokens(message);
            const completionTokens = estimateTokens(fullResponse);
            const totalTokens = promptTokens + completionTokens;

            controller.enqueue(
                encoder.encode(
                    `\n__META__${JSON.stringify({
                        promptTokens,
                        completionTokens,
                        totalTokens
                    })}`
                )
            );

            controller.close();
        },
    });

    return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8" } });

}