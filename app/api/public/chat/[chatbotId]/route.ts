import { handleChat, Tone } from "@/lib/chat-handler";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {

    const { chatbotId, message, workspaceId } = await req.json();

    if (!chatbotId) {
        return new Response("Missing chatbotId", { status: 400 });
    }

    const chatbot = await prisma.chatbot.findUnique({
        where: { id: chatbotId, workspaceId: workspaceId },
        include: {
            knowledgeLinks: true,
            guardrailLinks: {
                include: {
                    guardrail: true
                }
            }
        }
    });

    console.log("==================================>")
    console.log(chatbot);
    console.log("==================================>")

    if (!chatbot) {
        return new Response("Bot not found", { status: 404 });
    }

    // Extract knowledgeIds
    const knowledgeIds = chatbot.knowledgeLinks.map(k => k.fileId);

    return handleChat({
        message: message,
        workspaceId: chatbot.workspaceId,
        knowledgeIds: knowledgeIds,
        provider: chatbot.provider,
        model: chatbot.model,
        apiKey: chatbot.apiKey as string,
        tone: chatbot?.tone as Tone,
        enabledMemory: chatbot.enableMemory,
        history: []
    });

}