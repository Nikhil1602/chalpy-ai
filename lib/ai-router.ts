import OpenAI from "openai"
import Groq from "groq-sdk"
import Anthropic from "@anthropic-ai/sdk"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function generateAIResponse({ provider, model, apiKey, systemPrompt, message }: any) {

    if (provider === "chatgpt") {

        const openai = new OpenAI({ apiKey })

        return openai.chat.completions.create({
            model,
            stream: true,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
            ]
        })

    }

    if (provider === "groq") {

        const groq = new Groq({ apiKey })

        return groq.chat.completions.create({
            model,
            stream: true,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
            ],
        })

    }

    if (provider === "meta") {

        const meta = new OpenAI({
            apiKey,
            baseURL: "https://openrouter.ai/api/v1"
        });

        return meta.chat.completions.create({
            model,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
            ],
            stream: true
        })

    }

    if (provider === "deepseek") {

        const deepseek = new OpenAI({
            apiKey,
            baseURL: "https://api.deepseek.com"
        });

        return deepseek.chat.completions.create({
            model,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
            ],
            stream: true
        });

    }

    if (provider === "mistral") {

        const mistral = new OpenAI({
            apiKey,
            baseURL: "https://api.mistral.ai/v1"
        });

        return mistral.chat.completions.create({
            model,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
            ],
            stream: true
        });

    }

    if (provider === "gemini") {

        const genAI = new GoogleGenerativeAI(apiKey);

        const geminiModel = genAI.getGenerativeModel({ model });

        return geminiModel.generateContentStream(`${systemPrompt}\n\nUser: ${message}`);

    }

    if (provider === "claude") {

        const anthropic = new Anthropic({ apiKey });

        return anthropic.messages.stream({
            model,
            system: systemPrompt,
            max_tokens: 1024,
            messages: [{ role: "user", content: message }]
        });

    }

    throw new Error("Unsupported provider");

}