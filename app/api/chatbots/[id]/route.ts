import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/* GET CHATBOT BY ID */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {

    try {

        const { searchParams } = new URL(req.url);
        const workspaceId = searchParams.get("workspaceId");
        const { id } = await params;

        if (!id || !workspaceId) {
            return new Response("Missing required params", { status: 400 });
        }

        const chatbot = await prisma.chatbot.findUnique({
            where: { id: id, workspaceId: workspaceId },
            include: {
                configuration: {
                    include: {
                        launcher: true
                    }
                },
                knowledgeLinks: true,
                guardrailLinks: {
                    include: {
                        guardrail: true
                    }
                }
            }
        });

        const allKnowledge = await prisma.knowledgeFile.findMany({
            where: { workspaceId }
        });

        const allGuardrails = await prisma.guardrail.findMany({
            where: { workspaceId: workspaceId },
            orderBy: {
                createdAt: "desc"
            }
        });

        const enabledIds = new Set(chatbot?.guardrailLinks.map(g => g.guardrailId));

        const enabledKnowledgeIds = new Set(chatbot?.knowledgeLinks.map(k => k.fileId));

        const guardrails = allGuardrails.map(g => ({
            ...g,
            enabled: enabledIds.has(g.id)
        }));

        const knowledge = allKnowledge.map(k => ({
            ...k,
            enabled: enabledKnowledgeIds.has(k.id)
        }));

        const modifiedChatbot = {
            ...chatbot,
            guardrails,
            knowledge
        }

        if (!chatbot) {
            return new NextResponse("Chatbot not found", { status: 404 });
        }

        return NextResponse.json(modifiedChatbot);

    } catch (error) {

        console.error("Fetch chatbot error:", error);
        return new NextResponse("Failed to fetch chatbot", { status: 500 });

    }

}

/* UPDATE CHATBOT */
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {

    try {

        const body = await req.json();
        const { id } = await params;

        const { name, description, role, systemPrompt, tone, enableMemory, aiModel, knowledgeIds = [], guardrailIds = [], configuration } = body;
        const { provider, model, apiKey } = aiModel || {};

        const { searchParams } = new URL(req.url);
        const workspaceId = searchParams.get("workspaceId");

        if (!id || !workspaceId) {
            return new Response("Missing required params", { status: 400 });
        }

        /* validate files */
        const validFiles = await prisma.knowledgeFile.findMany({
            where: {
                id: { in: knowledgeIds },
                workspaceId: workspaceId
            },
            select: { id: true }
        });

        const validIds = validFiles.map(f => f.id);

        const validGuardrails = await prisma.guardrail.findMany({
            where: {
                id: { in: guardrailIds }
            },
            select: { id: true }
        });

        const validGuardrailIds = validGuardrails.map(g => g.id);

        let configId = configuration?.id;

        if (configId) {

            await prisma.configuration.update({
                where: { id: configId },
                data: {
                    status: configuration?.status ?? "draft",
                    backgroundColor: configuration?.backgroundColor,
                    gradient: configuration?.gradient,
                    gradientFrom: configuration?.gradientFrom,
                    gradientTo: configuration?.gradientTo,
                    textColor: configuration?.textColor,
                    borderRadius: configuration?.borderRadius,
                    fontFamily: configuration?.fontFamily,
                    logoUrl: configuration?.logoUrl,
                    position: configuration?.position,
                    accentColor: configuration?.accentColor,
                    headerColor: configuration?.headerColor,

                    launcher: configuration?.launcher ? {
                        upsert: {
                            create: {
                                backgroundColor: configuration.launcher?.backgroundColor,
                                borderRadius: configuration.launcher?.borderRadius,
                                padding: configuration.launcher?.padding,
                                icon: configuration.launcher?.icon,
                                logoUrl: configuration.launcher?.logoUrl,
                                size: configuration.launcher?.size,
                            },
                            update: {
                                backgroundColor: configuration.launcher?.backgroundColor,
                                borderRadius: configuration.launcher?.borderRadius,
                                padding: configuration.launcher?.padding,
                                icon: configuration.launcher?.icon,
                                logoUrl: configuration.launcher?.logoUrl,
                                size: configuration.launcher?.size,
                            }
                        }
                    } : undefined
                }
            });

        }

        const chatbot = await prisma.chatbot.update({

            where: { id: id },

            data: {
                name,
                description,
                role,
                systemPrompt,
                tone,
                enableMemory,
                workspaceId,
                provider,
                model,
                apiKey,

                configurationId: configId,

                /* reset knowledge links */
                knowledgeLinks: {
                    deleteMany: {},
                    create: validIds.map(id => ({
                        fileId: id
                    }))
                },

                guardrailLinks: {
                    deleteMany: {},
                    create: validGuardrailIds.map(id => ({
                        guardrailId: id
                    }))
                }

            },

            include: {
                configuration: {
                    include: {
                        launcher: true
                    }
                }
            },

        });

        return NextResponse.json(chatbot);

    } catch (error) {
        console.error("Update chatbot error:", error);
        return new NextResponse("Failed to update chatbot", { status: 500 });
    }

}

/* DELETE CHATBOT */
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {

    try {

        const { searchParams } = new URL(req.url);
        const workspaceId = searchParams.get("workspaceId");
        const { id } = await params;

        if (!id || !workspaceId) {
            return new Response("Missing required params", { status: 400 });
        }

        const chatbot = await prisma.chatbot.findFirst({
            where: { id: id, workspaceId: workspaceId },
            select: { id: true, configurationId: true }
        });

        if (!chatbot) {
            return new Response("Chatbot not found", { status: 404 });
        }

        const configId = chatbot.configurationId;

        await prisma.chatbot.delete({
            where: { id }
        });

        if (configId) {

            await prisma.launcherConfig.deleteMany({
                where: { configurationId: configId }
            });

            await prisma.configuration.deleteMany({
                where: { id: configId }
            });

        }

        return NextResponse.json({ success: true, id: chatbot.id });

    } catch (error) {

        console.error("Delete chatbot error:", error);
        return new NextResponse("Failed to delete chatbot", { status: 500 });

    }

}