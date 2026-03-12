import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {

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

}