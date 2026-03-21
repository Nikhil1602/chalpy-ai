import { handleChat } from "@/lib/chat-handler";

export const runtime = "nodejs";

export async function POST(req: Request) {

    try {

        const reqData = await req.json();
        const { message, workspaceId, knowledgeIds, tone, enabledMemory, history = [] } = reqData;
        const { provider = "groq", model = "llama-3.1-8b-instant", apiKey = process.env.GROQ_API_KEY } = reqData;

        return handleChat({
            message: message,
            workspaceId: workspaceId,
            knowledgeIds: knowledgeIds,
            provider: provider,
            model: model,
            apiKey: apiKey,
            tone: tone,
            enabledMemory: enabledMemory,
            history: history
        })

    } catch (error) {

        console.error("Chat error:", error);

        return new Response("Chat failed", { status: 500 });

    }

}