import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

    try {

        const body = await req.json();

        const { name, description, role, systemPrompt, tone, enableMemory, workspaceId, provider, model, apiKey, knowledgeIds, guardrailIds, configuration } = body;

        if (!name || !workspaceId) {
            return new Response("Missing required fields", { status: 400 });
        }

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

        const config = await prisma.configuration.create({
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
                    create: {
                        backgroundColor: configuration.launcher?.backgroundColor,
                        borderRadius: configuration.launcher?.borderRadius,
                        padding: configuration.launcher?.padding,
                        icon: configuration.launcher?.icon,
                        logoUrl: configuration.launcher?.logoUrl,
                        size: configuration.launcher?.size,
                    }
                } : undefined
            }
        });

        const chatbot = await prisma.chatbot.create({
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

                configurationId: config.id,

                knowledgeLinks: validIds.length
                    ? {
                        create: validIds.map(id => ({
                            fileId: id
                        }))
                    }
                    : undefined,

                guardrailLinks: validGuardrailIds.length
                    ? {
                        create: validGuardrailIds.map(id => ({
                            guardrailId: id
                        }))
                    } : undefined
            },
            include: {
                configuration: {
                    include: {
                        launcher: true
                    }
                }
            },
        });

        return Response.json(chatbot);

    } catch (error) {

        console.error("Create chatbot error:", error);
        return new Response("Failed to create chatbot", { status: 500 });

    }

}

/* GET CHATBOT BY WORKSPACEID */
export async function GET(req: Request) {

    try {

        const { searchParams } = new URL(req.url);
        const workspaceId = searchParams.get("workspaceId");

        if (!workspaceId) {
            return new Response("Missing required params", { status: 400 });
        }

        const chatbots = await prisma.chatbot.findMany({
            where: { workspaceId: workspaceId },
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

        const modifiedChatbots = chatbots.map(({ guardrailLinks, knowledgeLinks, ...rest }) => {

            const enabledIds = new Set(
                guardrailLinks.map(g => g.guardrailId)
            );

            const enabledKnowledgeIds = new Set(
                knowledgeLinks.map(k => k.fileId)
            );

            const guardrails = allGuardrails.map(g => ({
                ...g,
                enabled: enabledIds.has(g.id)
            }));

            const knowledge = allKnowledge.map(k => ({
                ...k,
                enabled: enabledKnowledgeIds.has(k.id)
            }));

            return {
                ...rest,
                guardrails,
                knowledge
            };

        });

        if (!chatbots) {
            return new NextResponse("Chatbot not found", { status: 404 });
        }

        return NextResponse.json(modifiedChatbots);

    } catch (error) {

        console.error("Fetch chatbot error:", error);
        return new NextResponse("Failed to fetch chatbot", { status: 500 });

    }

}