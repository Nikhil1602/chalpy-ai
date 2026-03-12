import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {

    try {

        const { fileIds } = await req.json();
        const ids = fileIds ?? [];

        if (!ids.length) {

            return NextResponse.json(
                { success: false, error: "MISSING_FILE_IDS" },
                { status: 400 }
            );

        }

        const files = await prisma.knowledgeFile.findMany({
            where: { id: { in: ids } }
        });

        if (!files.length) {

            return NextResponse.json(
                { success: false, error: "FILES_NOT_FOUND" },
                { status: 404 }
            )

        }

        const paths = files.map(f => f.path);
        const { error } = await supabase.storage.from("knowledge-base").remove(paths);

        if (error) {

            console.log(error.message);
            return NextResponse.json(
                { success: false, error: error.message },
                { status: 500 }
            );

        }

        await prisma.chunk.deleteMany({
            where: { fileId: { in: ids } }
        });

        await prisma.knowledgeFile.deleteMany({
            where: { id: { in: ids } }
        });

        return NextResponse.json({
            success: true,
            deleted: paths,
            message: "File(s) deleted successfully",
        });

    } catch (error) {

        console.error("Delete error:", error);

        return NextResponse.json(
            { success: false, error: "DELETE_FAILED" },
            { status: 500 }
        );

    }

}