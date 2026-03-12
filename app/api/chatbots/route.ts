import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {

    try {

        const body = await req.json();

        const { name, description, role, systemPrompt, tone, enableMemory, status, workspaceId, aiModel, knowledgeIds } = body;
        const { provider, model, apiKey } = aiModel;

        if (!name || !workspaceId) {
            return new Response("Missing required fields", { status: 400 });
        }

        const validFiles = await prisma.knowledgeFile.findMany({
            where: {
                id: { in: knowledgeIds }
            },
            select: { id: true }
        });

        const validIds = validFiles.map(f => f.id);

        const chatbot = await prisma.chatbot.create({
            data: {
                name,
                workspaceId,
                provider,
                model,
                apiKey,
                createdAt: new Date(),

                knowledgeLinks: validIds.length
                    ? {
                        create: validIds.map(id => ({
                            fileId: id
                        }))
                    }
                    : undefined
            }
        });

        return Response.json(chatbot);

    } catch (error) {

        console.error("Create chatbot error:", error);
        return new Response("Failed to create chatbot", { status: 500 });

    }

}