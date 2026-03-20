import { useState, useCallback } from 'react';
import { Message, UseChatbotOptions } from '@/types';
import { useWorkspace } from '@/store/WorkspaceContext';

export default function useChatbot({ chatbotId }: UseChatbotOptions) {

    const [messages, setMessages] = useState<Message[]>([]);
    const { currentWorkspace } = useWorkspace();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sendMessage = useCallback(async (content: string, selectedIds: string[]) => {

        const userMessage: Message = {
            id: `msg-${Date.now()}`,
            role: 'user',
            content,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        setError(null);

        try {

            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: content,
                    chatbotId,
                    workspaceId: currentWorkspace?.id,
                    knowledgeIds: [...selectedIds],
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

            let created = false;

            while (true) {

                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value || new Uint8Array());

                if (!created) {
                    created = true;
                    setMessages(prev => [...prev, assistantMessage]);
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

            setIsLoading(false);

        }

    }, [chatbotId]);

    const clearMessages = useCallback(() => {

        setMessages([]);
        setError(null);

    }, []);

    return {
        messages,
        isLoading,
        error,
        sendMessage,
        clearMessages,
    };
}