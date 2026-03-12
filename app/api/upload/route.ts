import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { supabase } from "@/lib/supabase"

const ALLOWED_TYPES = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "text/csv",
    "text/markdown",
]

export async function POST(req: Request) {

    try {

        const formData = await req.formData()

        const files = formData.getAll("files") as File[]
        const workspaceId = formData.get("workspaceId") as string

        if (!files || files.length === 0) {
            return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
        }

        const uploadedFiles = []

        for (const file of files) {

            if (!ALLOWED_TYPES.includes(file.type)) {
                return NextResponse.json({ error: `Unsupported file type: ${file.type}` }, { status: 400 });
            }

            const filePath = `${workspaceId}/${Date.now()}-${file.name}`;

            const { error: uploadError } = await supabase.storage.from("knowledge-base").upload(filePath, file);

            if (uploadError) {

                console.error(uploadError)
                return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });

            }

            const savedFile = await prisma.knowledgeFile.create({
                data: {
                    name: file.name,
                    path: filePath,
                    size: file.size,
                    type: file.type,
                    workspaceId,
                    status: "processing",
                },
            });

            uploadedFiles.push(savedFile);

            /*
              Trigger indexing pipeline
              This runs extraction -> chunking -> embeddings -> vector storage
            */

            console.log("====================> ", savedFile);

            await fetch(`http://localhost:3000/api/index-document`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fileId: savedFile.id,
                    filePath,
                    workspaceId,
                }),
            }).catch((err) => {
                console.error("Indexing trigger failed:", err)
            });
        }

        return NextResponse.json({ success: true, files: uploadedFiles });

    } catch (error) {

        console.error("Upload error:", error)

        return NextResponse.json({ error: "File upload failed" }, { status: 500 });

    }
}