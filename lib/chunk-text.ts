import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters"

export async function chunkText(text: string) {

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 600,
    chunkOverlap: 120,
    separators: [
      "\n\n",
      "\n",
      ". ",
      " "
    ]
  })

  const docs = await splitter.createDocuments([text])

  return docs.map((d) => d.pageContent);

}