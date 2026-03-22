import PDFParser from "pdf2json";
import mammoth from "mammoth"
import { parse } from "csv-parse/sync"
import { cleanPdfText, safeDecode } from "./constants";

const TXT_FILE = "text/plain";
const DOCX_FILE = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const CSV_FILE = "text/csv";
const MD_FILE = "text/markdown";
const PDF_FILE = "application/pdf";

export async function extractText(file: File) {

    // console.log("===========================================>")
    // console.log(file.type);
    // console.log("===========================================>");

    const buffer = Buffer.from(await file.arrayBuffer());

    if (file.type === PDF_FILE) {
        return new Promise((resolve, reject) => {
            const pdfParser = new PDFParser();
            pdfParser.on("pdfParser_dataError", reject);
            pdfParser.on("pdfParser_dataReady", (pdfData) => {
                const text = pdfData.Pages.map(page =>
                    page.Texts.map(text =>
                        text.R.map(r => safeDecode(r.T)).join("")
                    ).join(" ")
                ).join("\n");
                resolve(cleanPdfText(text));
            });
            pdfParser.parseBuffer(buffer);
        });
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