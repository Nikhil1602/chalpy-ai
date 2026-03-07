"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import { Chatbot, Workspace, WorkspaceContextType } from '@/types';
import { defaultAIModel, defaultTheme } from '@/lib/constants';

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

// Mock data
const mockWorkspace: Workspace = {
    id: 'workspace-1',
    name: 'My Workspace',
    slug: 'my-workspace',
    ownerId: 'user-1',
    members: [
        {
            id: 'member-1',
            userId: 'user-1',
            email: 'demo@botforge.ai',
            name: 'Demo User',
            role: 'owner',
        },
    ],
    plan: 'pro',
    createdAt: new Date(),
};

const mockChatbots: Chatbot[] = [
    {
        id: 'bot-1',
        name: 'Customer Support',
        description: 'Handles customer inquiries 24/7',
        systemPrompt: 'You are a helpful customer support agent...',
        tone: 'professional',
        role: 'Support Agent',
        enableMemory: true,
        guardrails: [
            { id: 'g1', name: 'No harmful content', description: 'Prevents harmful responses', enabled: true },
            { id: 'g2', name: 'Stay on topic', description: 'Keeps conversations focused', enabled: true },
        ],
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-02-01'),
        status: 'active',
        workspaceId: 'workspace-1',
        theme: defaultTheme,
        aiModel: defaultAIModel,
    },
    {
        id: 'bot-2',
        name: 'Sales Assistant',
        description: 'Helps qualify leads and answer product questions',
        systemPrompt: 'You are a knowledgeable sales assistant...',
        tone: 'friendly',
        role: 'Sales Rep',
        enableMemory: true,
        guardrails: [],
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-25'),
        status: 'draft',
        workspaceId: 'workspace-1',
        theme: defaultTheme,
        aiModel: defaultAIModel,
    },
];

export function WorkspaceProvider({ children }: { children: ReactNode }) {

    const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(mockWorkspace);
    const [chatbots, setChatbots] = useState<Chatbot[]>(mockChatbots);

    const addChatbot = (chatbot: Chatbot) => {
        setChatbots(prev => [...prev, chatbot]);
    };

    const updateChatbot = (id: string, updates: Partial<Chatbot>) => {
        setChatbots(prev => prev.map(bot => (bot.id === id ? { ...bot, ...updates, updatedAt: new Date() } : bot)));
    };

    const deleteChatbot = (id: string) => {
        setChatbots(prev => prev.filter(bot => bot.id !== id));
    };

    const getChatbot = (id: string) => {
        return chatbots.find(bot => bot.id === id);
    };

    return (
        <WorkspaceContext.Provider value={{ currentWorkspace, chatbots, setCurrentWorkspace, addChatbot, updateChatbot, deleteChatbot, getChatbot }}>
            {children}
        </WorkspaceContext.Provider>
    );
}

export function useWorkspace() {

    const context = useContext(WorkspaceContext);

    if (context === undefined) {
        throw new Error('useWorkspace must be used within a WorkspaceProvider');
    }

    return context;

}