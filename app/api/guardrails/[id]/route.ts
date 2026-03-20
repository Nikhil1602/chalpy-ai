import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/* GET GUARDRAIL BY ID */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {

    try {

        const { searchParams } = new URL(req.url);
        const workspaceId = searchParams.get("workspaceId");
        const { id } = await params;

        if (!id || !workspaceId) {
            return new Response("Missing required params", { status: 400 });
        }

        const guardrail = await prisma.guardrail.findUnique({
            where: { id: id, workspaceId: workspaceId }
        });

        if (!guardrail) {
            return new NextResponse("Guardrail not found", { status: 404 });
        }

        return NextResponse.json(guardrail);

    } catch (error) {

        console.error("Fetch guardrail error:", error);
        return new NextResponse("Failed to fetch guardrail", { status: 500 });

    }

}

/* PUT GUARDRAIL BY ID */
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {

    try {

        const { id } = await params;

        const { searchParams } = new URL(req.url);
        const workspaceId = searchParams.get("workspaceId");

        if (!id || !workspaceId) {
            return new Response("Missing required params", { status: 400 });
        }

        const body = await req.json();
        const { name, description } = body;

        if (!name && !description) {
            return new Response("Nothing to update", { status: 400 });
        }

        const updatedGuardrail = await prisma.guardrail.update({
            where: {
                id: id
            },
            data: {
                name,
                description
            }
        });

        return NextResponse.json(updatedGuardrail);

    } catch (error) {

        console.error("Update guardrail error:", error);
        return new NextResponse("Failed to update guardrail", { status: 500 });

    }
}

/* DELETE GUARDRAIL */
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {

    try {

        const { searchParams } = new URL(req.url);
        const workspaceId = searchParams.get("workspaceId");
        const { id } = await params;

        if (!id || !workspaceId) {
            return new Response("Missing required params", { status: 400 });
        }

        const data = await prisma.guardrail.delete({
            where: { id: id, workspaceId: workspaceId }
        });

        return NextResponse.json({ success: true, id: data.id });

    } catch (error) {

        console.error("Delete guardrail error:", error);
        return new NextResponse("Failed to delete guardrail", { status: 500 });

    }

}