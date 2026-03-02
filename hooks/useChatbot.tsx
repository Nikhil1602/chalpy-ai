import { useState, useCallback } from 'react';
import { Message } from '@/types';

interface UseChatbotOptions {
    chatbotId: string;
    onMessage?: (message: Message) => void;
}

export default function useChatbot({ chatbotId, onMessage }: UseChatbotOptions) {

    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sendMessage = useCallback(async (content: string) => {

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

            // Simulate AI response with streaming effect
            await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

            const responses = [
                "I understand your question. Let me help you with that. Based on the information available, I can provide a detailed response that addresses your concerns.",
                "That's a great question! Here's what I found in the knowledge base that might help you understand this topic better.",
                "Thanks for reaching out! I've analyzed your query and here's my recommendation based on best practices and our documentation.",
                "I'd be happy to assist with that. Let me break this down into clear steps for you to follow.",
            ];

            const assistantMessage: Message = {
                id: `msg-${Date.now() + 1}`,
                role: 'assistant',
                content: responses[Math.floor(Math.random() * responses.length)],
                timestamp: new Date(),
                metadata: {
                    sources: ['knowledge-doc-1', 'knowledge-doc-2'],
                    tokensUsed: Math.floor(Math.random() * 500) + 100,
                },
            };

            setMessages(prev => [...prev, assistantMessage]);
            onMessage?.(assistantMessage);

        } catch (err) {
            setError('Failed to get response. Please try again.');
        } finally {
            setIsLoading(false);
        }

    }, [chatbotId, onMessage]);

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