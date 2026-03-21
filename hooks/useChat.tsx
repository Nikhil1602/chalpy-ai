"use client";

import { Chatbot, Message } from '@/types';
import { useCallback, useState } from 'react';

const initialChats: Message[] = [
    {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: 'Hi there! 👋 How can I help you today?',
        timestamp: new Date()
    }
]

const useChat = (chatbotId: string, workspaceId: string) => {

    const [messages, setMessages] = useState<Message[]>(structuredClone(initialChats));
    const [isMsgLoading, setIsMsgLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [tokens, setTokens] = useState<{
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    } | null>(null);

    const sendMessage = useCallback(async (content: string, selectedIds: string[], tone: Chatbot["tone"] = "professional", enabledMemory: boolean = true) => {

        const userMessage: Message = {
            id: `msg-${Date.now()}`,
            role: 'user',
            content,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setIsMsgLoading(true);
        setError(null);

        try {

            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: content,
                    chatbotId,
                    workspaceId: workspaceId,
                    knowledgeIds: [...selectedIds],
                    tone: tone,
                    enabledMemory: enabledMemory,
                    history: messages,
                })
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || "Request failed");
            }

            if (!response.body) {
                throw new Error("No response stream");
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            const assistantId = `msg-${Date.now() + 1}`;

            const assistantMessage: Message = {
                id: assistantId,
                role: "assistant",
                content: "",
                timestamp: new Date(),
            }

            // let created = false;

            // while (true) {

            //     const { done, value } = await reader.read();
            //     if (done) break;

            //     const chunk = decoder.decode(value || new Uint8Array());

            //     if (!created) {
            //         created = true;
            //         setMessages(prev => [...prev, assistantMessage]);
            //     }

            //     assistantMessage.content += chunk;

            //     setMessages(prev =>
            //         prev.map(msg => msg.id === assistantId ? { ...msg, content: assistantMessage.content } : msg)
            //     );
            // }

            let buffer = "";
            let created = false;

            while (true) {

                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value || new Uint8Array());
                buffer += chunk;

                if (!created) {
                    created = true;
                    setMessages(prev => [...prev, assistantMessage]);
                }

                // ✅ Check if META exists
                if (buffer.includes("__META__")) {

                    const [textPart, metaPart] = buffer.split("__META__");

                    // Update message ONLY with text
                    assistantMessage.content = textPart;

                    setMessages(prev =>
                        prev.map(msg =>
                            msg.id === assistantId
                                ? { ...msg, content: textPart }
                                : msg
                        )
                    );

                    try {
                        const meta = JSON.parse(metaPart);
                        setTokens(meta); // 🎯 store tokens
                    } catch (e) {
                        console.error("Failed to parse META:", e);
                    }

                    buffer = ""; // clear buffer
                    continue;
                }

                // Normal streaming text
                assistantMessage.content += chunk;

                setMessages(prev =>
                    prev.map(msg =>
                        msg.id === assistantId
                            ? { ...msg, content: assistantMessage.content }
                            : msg
                    )
                );
            }

        } catch (err) {

            console.log(err);
            setMessages(prev => [
                ...prev,
                {
                    id: `msg-${Date.now()}`,
                    role: "assistant",
                    content: "Sorry, something went wrong while generating the response.",
                    timestamp: new Date()
                }
            ]);
            setError('Failed to get response. Please try again.');

        } finally {

            setIsMsgLoading(false);

        }

    }, [chatbotId]);

    const sendMessageEmbed = useCallback(async (content: string) => {

        const userMessage: Message = {
            id: `msg-${Date.now()}`,
            role: 'user',
            content,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setIsMsgLoading(true);
        setError(null);

        try {

            const response = await fetch(`/api/public/chat/${chatbotId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: content,
                    chatbotId,
                    workspaceId: workspaceId,
                    history: messages,
                })
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || "Request failed");
            }

            if (!response.body) {
                throw new Error("No response stream");
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            const assistantId = `msg-${Date.now() + 1}`;

            const assistantMessage: Message = {
                id: assistantId,
                role: "assistant",
                content: "",
                timestamp: new Date(),
            }

            // let created = false;

            // while (true) {

            //     const { done, value } = await reader.read();
            //     if (done) break;

            //     const chunk = decoder.decode(value || new Uint8Array());

            //     if (!created) {
            //         created = true;
            //         setMessages(prev => [...prev, assistantMessage]);
            //     }

            //     assistantMessage.content += chunk;

            //     setMessages(prev =>
            //         prev.map(msg => msg.id === assistantId ? { ...msg, content: assistantMessage.content } : msg)
            //     );
            // }

            let created = false;
            let buffer = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value || new Uint8Array());
                buffer += chunk;

                if (!created) {
                    created = true;
                    setMessages(prev => [...prev, assistantMessage]);
                }

                // ✅ Check if META exists
                if (buffer.includes("__META__")) {

                    const [textPart, metaPart] = buffer.split("__META__");

                    // Update message ONLY with text
                    assistantMessage.content = textPart;

                    setMessages(prev =>
                        prev.map(msg =>
                            msg.id === assistantId
                                ? { ...msg, content: textPart }
                                : msg
                        )
                    );

                    try {
                        const meta = JSON.parse(metaPart);
                        setTokens(meta); // 🎯 store tokens
                    } catch (e) {
                        console.error("Failed to parse META:", e);
                    }

                    buffer = ""; // clear buffer
                    continue;
                }

                assistantMessage.content += chunk;

                setMessages(prev =>
                    prev.map(msg => msg.id === assistantId ? { ...msg, content: assistantMessage.content } : msg)
                );
            }

        } catch (err) {

            console.log(err);
            setMessages(prev => [
                ...prev,
                {
                    id: `msg-${Date.now()}`,
                    role: "assistant",
                    content: "Sorry, something went wrong while generating the response.",
                    timestamp: new Date()
                }
            ]);
            setError('Failed to get response. Please try again.');

        } finally {

            setIsMsgLoading(false);

        }

    }, [chatbotId]);

    const clearMessages = useCallback(() => {

        setMessages([]);
        setError(null);

    }, []);

    return { messages, isMsgLoading, tokens, error, sendMessage, sendMessageEmbed, clearMessages };

}

export default useChat