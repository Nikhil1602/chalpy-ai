import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/* CREATE GUARDRAIL */
export async function POST(req: Request) {

    try {

        const body = await req.json();
        const { name, description } = body;

        const { searchParams } = new URL(req.url);
        const workspaceId = searchParams.get("workspaceId");

        if (!name) {
            return new NextResponse("Guardrail name is required", { status: 400 });
        }

        if (!workspaceId) {
            return new NextResponse("workspace id is missing", { status: 400 });
        }

        const guardrail = await prisma.guardrail.create({
            data: {
                name,
                description,
                workspaceId: workspaceId
            }
        });

        return NextResponse.json(guardrail);

    } catch (error) {

        console.error("Create guardrail error:", error);
        return new NextResponse("Failed to create guardrail", { status: 500 });

    }

}

/* GET ALL GUARDRAILS */
export async function GET(req: Request) {

    try {

        const { searchParams } = new URL(req.url);
        const workspaceId = searchParams.get("workspaceId");

        if (!workspaceId) {
            return new NextResponse("workspace id is missing", { status: 400 });
        }

        const guardrails = await prisma.guardrail.findMany({
            where: { workspaceId: workspaceId },
            orderBy: {
                createdAt: "desc"
            }
        });

        return NextResponse.json(guardrails);

    } catch (error) {

        console.error("Fetch guardrails error:", error);
        return new NextResponse("Failed to fetch guardrails", { status: 500 });

    }

}