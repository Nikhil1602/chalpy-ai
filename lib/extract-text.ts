import pdf from "pdf-parse-new"
import mammoth from "mammoth"
import { parse } from "csv-parse/sync"

const TXT_FILE = "text/plain";
const DOCX_FILE = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const CSV_FILE = "text/csv";
const MD_FILE = "text/markdown";

export async function extractText(file: File) {

    const buffer = Buffer.from(await file.arrayBuffer());

    if (file.type === "application/pdf") {
        const data = await pdf(buffer);
        return data.text;
    }

    if (file.type === DOCX_FILE) {
        const result = await mammoth.extractRawText({ buffer });
        return result.value;
    }

    if (file.type === TXT_FILE) {
        return buffer.toString("utf-8");
    }

    if (file.type === MD_FILE || file.name.endsWith(".md")) {
        return buffer.toString("utf-8")
    }

    if (file.type === CSV_FILE || file.name.endsWith(".csv")) {

        const records = parse(buffer);

        return records.map((row: any) => row.join(" ")).join("\n");

    }

    throw new Error("Unsupported file type");

}