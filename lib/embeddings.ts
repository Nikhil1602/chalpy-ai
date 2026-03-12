// embeddings.ts
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf"

export const embeddings = new HuggingFaceInferenceEmbeddings({
    apiKey: process.env.HUGGINGFACE_API_KEY!,
    model: "BAAI/bge-small-en-v1.5"
})

export async function createEmbedding(text: string) {
    const vector = await embeddings.embedQuery(text)
    return vector
}