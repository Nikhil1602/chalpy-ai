import { NextResponse } from "next/server"
import { embeddings } from "@/lib/embeddings"
import { supabase } from "@/lib/supabase"

export async function POST(req: Request) {

    const { query, workspaceId } = await req.json();

    const queryEmbedding = await embeddings.embedQuery(query);

    const { data } = await supabase.rpc("match_documents", {
        query_embedding: queryEmbedding,
        match_threshold: 0.7,
        match_count: 5,
        workspace_id: workspaceId,
    });

    return NextResponse.json({ context: data });
}