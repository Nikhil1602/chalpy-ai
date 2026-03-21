import OpenAI from "openai"
import Groq from "groq-sdk"
import Anthropic from "@anthropic-ai/sdk"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function generateAIResponse({ provider, model, apiKey, systemPrompt, message, history = [] }: any) {

    let fullResponse = "";

    const wrapStream = async (stream: any) => {
        return {
            stream,
            getFullResponse: () => fullResponse,
            append: (text: string) => {
                fullResponse += text;
            }
        }
    }

    if (provider === "chatgpt") {

        const openai = new OpenAI({ apiKey })

        const stream = await openai.chat.completions.create({
            model,
            stream: true,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
            ]
        });

        return wrapStream(stream);

    }

    if (provider === "groq") {

        const groq = new Groq({ apiKey })

        const stream = await groq.chat.completions.create({
            model,
            stream: true,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
            ],
        });

        return wrapStream(stream);

    }

    if (provider === "meta") {

        const meta = new OpenAI({
            apiKey,
            baseURL: "https://openrouter.ai/api/v1"
        });

        const stream = await meta.chat.completions.create({
            model,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
            ],
            stream: true
        });

        return wrapStream(stream);

    }

    if (provider === "deepseek") {

        const deepseek = new OpenAI({
            apiKey,
            baseURL: "https://api.deepseek.com"
        });

        const stream = await deepseek.chat.completions.create({
            model,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
            ],
            stream: true
        });

        return wrapStream(stream);

    }

    if (provider === "mistral") {

        const mistral = new OpenAI({
            apiKey,
            baseURL: "https://api.mistral.ai/v1"
        });

        const stream = await mistral.chat.completions.create({
            model,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
            ],
            stream: true
        });

        return wrapStream(stream);

    }

    if (provider === "gemini") {

        const genAI = new GoogleGenerativeAI(apiKey);

        const geminiModel = genAI.getGenerativeModel({ model });

        const stream = await geminiModel.generateContentStream(`${systemPrompt}\n\nUser: ${message}`);

        return wrapStream(stream);

    }

    if (provider === "claude") {

        const anthropic = new Anthropic({ apiKey });

        const stream = await anthropic.messages.stream({
            model,
            system: systemPrompt,
            max_tokens: 1024,
            messages: [{ role: "user", content: message }]
        });

        return wrapStream(stream);

    }

    throw new Error("Unsupported provider");

}