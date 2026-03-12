import { supabase } from "./supabase"
import { embeddings } from "./embeddings"

export async function searchKnowledge(query: string, workspaceId: string) {

    const vector = await embeddings.embedQuery(query)

    const { data } = await supabase.rpc("match_documents", {
        query_embedding: vector,
        workspace_id: workspaceId,
        match_count: 5
    })

    return data;

}