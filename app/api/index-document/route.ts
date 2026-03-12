import { extractText } from "@/lib/extract-text"
import { chunkText } from "@/lib/chunk-text"
import { embeddings } from "@/lib/embeddings"
import { supabase } from "@/lib/supabase"
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

export const runtime = "nodejs"

export async function POST(req: Request) {

    try {

        const { fileId, filePath, workspaceId } = await req.json();

        const fileRecord = await prisma.knowledgeFile.findUnique({
            where: { id: fileId }
        });

        if (!fileRecord) {
            return NextResponse.json({ error: "File not found!" }, { status: 404 });
        }

        const { data, error } = await supabase.storage
            .from("knowledge-base")
            .download(filePath);

        if (error || !data) {
            throw new Error("Failed to download file from storage");
        }

        const file = new File([data as Blob], filePath, { type: (data as Blob).type });

        const text = await extractText(file);

        const chunks = await chunkText(text as string);

        const vectors = await embeddings.embedDocuments(chunks);

        const rows = chunks.map((chunk, i) => ({
            id: randomUUID(),
            content: chunk,
            embedding: vectors[i],
            workspaceId: workspaceId,
            fileId: fileId
        }));

        await prisma.$executeRawUnsafe(`
            INSERT INTO "Chunk"
            ("id","content","embedding","workspaceId","fileId")
            VALUES
            ${rows.map(r =>
            `('${r.id}',
                '${r.content.replace(/'/g, "''")}',
                '[${r.embedding.join(",")}]'::vector,
                '${r.workspaceId}',
                '${r.fileId}')`
        ).join(",")}`);

        await prisma.knowledgeFile.update({
            where: { id: fileId },
            data: { status: "ready" }
        });

        // return NextResponse.json({ success: true, chunks: [] });
        return NextResponse.json({ success: true, chunks: chunks.length });

    } catch (error) {

        console.log("Indexing failed: ", error);
        return NextResponse.json({ error: "Indexing failed" }, { status: 500 });

    }


}