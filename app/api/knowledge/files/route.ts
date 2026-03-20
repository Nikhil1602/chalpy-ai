import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {

    try {

        const { searchParams } = new URL(req.url);
        const workspaceId = searchParams.get("workspaceId");

        if (!workspaceId) {
            return NextResponse.json({ error: "Missing workspaceId" }, { status: 400 });
        }

        const files = await prisma.knowledgeFile.findMany({
            where: { workspaceId },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({
            success: true,
            files
        });

    } catch (error) {

        console.error("Get Knowledge base error:", error);

        return new Response("Get knowledge base failed", { status: 500 });

    }

}

export async function POST(req: Request) {

    try {

        const { searchParams } = new URL(req.url);
        const { knowledgeIds } = await req.json();
        const workspaceId = searchParams.get("workspaceId");

        if (!workspaceId) {
            return NextResponse.json({ error: "Missing workspaceId" }, { status: 400 });
        }

        if (!knowledgeIds || knowledgeIds.length === 0) {
            return NextResponse.json({ error: "Kindly pass the knowledge base ids for this chatbot." }, { status: 400 });
        }

        const files = await prisma.knowledgeFile.findMany({
            where: {
                id: {
                    in: knowledgeIds
                }
            },
            select: {
                id: true,
                name: true,
                path: true,
                createdAt: true
            }
        });

        if (!files || files.length === 0) {
            return new Response(
                "No knowledge base found for this chatbot.",
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            files
        });

    } catch (error) {


        console.error("Get Knowledge base by ids error:", error);

        return new Response("Get knowledge base by ids failed", { status: 500 });

    }

}