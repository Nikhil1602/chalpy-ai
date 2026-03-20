"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Chatbot, GuardrailRule, Workspace, WorkspaceContextType } from '@/types';
import { defaultAIModel, defaultTheme } from '@/lib/constants';
import { useKnowledgeBase } from '@/hooks';
import axios from 'axios';

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
    createdAt: new Date(),
};

const defaultGuardrails: GuardrailRule[] = [
    { id: 'g1', name: 'No harmful content', description: 'Prevents generation of harmful or offensive content', enabled: true },
    { id: 'g2', name: 'Stay on topic', description: 'Keeps conversations focused on the intended purpose', enabled: true },
    { id: 'g3', name: 'No personal data collection', description: 'Avoids collecting sensitive personal information', enabled: false },
    { id: 'g4', name: 'Fact-checking', description: 'Warns users when providing uncertain information', enabled: false },
];

// const mockChatbots: Chatbot[] = [
//     {
//         id: 'bot-1',
//         name: 'Customer Support',
//         description: 'Handles customer inquiries 24/7',
//         systemPrompt: 'You are a helpful customer support agent...',
//         tone: 'professional',
//         role: 'Support Agent',
//         enableMemory: true,
//         guardrails: [
//             { id: 'g1', name: 'No harmful content', description: 'Prevents harmful responses', enabled: true },
//             { id: 'g2', name: 'Stay on topic', description: 'Keeps conversations focused', enabled: true },
//         ],
//         createdAt: new Date('2024-01-15'),
//         updatedAt: new Date('2024-02-01'),
//         status: 'active',
//         workspaceId: 'workspace-1',
//         theme: defaultTheme,
//         aiModel: defaultAIModel,
//         knowledgeIds: []
//     },
//     {
//         id: 'bot-2',
//         name: 'Sales Assistant',
//         description: 'Helps qualify leads and answer product questions',
//         systemPrompt: 'You are a knowledgeable sales assistant...',
//         tone: 'friendly',
//         role: 'Sales Rep',
//         enableMemory: true,
//         guardrails: [],
//         createdAt: new Date('2024-01-20'),
//         updatedAt: new Date('2024-01-25'),
//         status: 'draft',
//         workspaceId: 'workspace-1',
//         theme: defaultTheme,
//         aiModel: defaultAIModel,
//         knowledgeIds: []
//     },
// ];

export function WorkspaceProvider({ children }: { children: ReactNode }) {

    const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(mockWorkspace);
    const [chatbots, setChatbots] = useState<Chatbot[]>([]);
    const [isChatbotsLoading, setChatbotsLoading] = useState<boolean>(false);
    const [isGuardrailLoading, setGuardrailLoading] = useState<Boolean>(false);
    const [guardrails, setGuardrails] = useState<GuardrailRule[] | []>([]);
    const knowledgeBase = useKnowledgeBase(currentWorkspace?.id);

    const getAllChatbots = async () => {

        try {

            setChatbotsLoading(true);
            const resp = await axios.get(`/api/chatbots?workspaceId=${currentWorkspace?.id}`);
            const result = resp.data;

            setChatbots(result);

        } catch (err) {

            console.error("Enable to fetch all chatbots: ", err);

        } finally {

            setChatbotsLoading(false);

        }

    }

    const getAllGuardrails = async () => {

        try {

            setGuardrailLoading(true);
            const resp = await axios.get(`/api/guardrails?workspaceId=${currentWorkspace?.id}`);
            const result = resp.data;

            if (result.length)
                setGuardrails(result);

        } catch (err) {

            console.error("Enable to fetch all chatbots: ", err);

        } finally {

            setGuardrailLoading(false);

        }

    }

    useEffect(() => {

        currentWorkspace?.id !== "" && getAllGuardrails();
        currentWorkspace?.id !== "" && getAllChatbots();

    }, []);

    const addChatbot = async (chatbot: Chatbot) => {

        try {

            setChatbotsLoading(true);

            const resp = await axios.post(`/api/chatbots?workspaceId=${currentWorkspace?.id}`, chatbot);
            const result = resp.data;

            if (result) {
                setChatbots(prev => [...prev, chatbot]);
            }

            return result;

        } catch (err) {

            console.error("Enable to fetch all chatbots: ", err);

        } finally {

            await getAllChatbots();
            setChatbotsLoading(false);

        }

        return null;

        // console.log(chatbot);
        // setChatbots(prev => [...prev, chatbot]);

    };

    const updateChatbot = async (id: string, updates: Partial<Chatbot>, selectedGuardrailIds: string[], selectedKnowledgeIds: Set<string>) => {

        try {

            console.log({ selectedKnowledgeIds, selectedGuardrailIds })

            setChatbotsLoading(true);
            let updatedChatbot = chatbots.filter(x => x.id === id).map(bot => ({ ...bot, ...updates, updatedAt: new Date() }))[0];
            updatedChatbot = {
                ...updatedChatbot,
                guardrailIds: selectedGuardrailIds || [],
                knowledgeIds: Array.from(selectedKnowledgeIds)
            }

            const resp = await axios.put(`/api/chatbots/${id}?workspaceId=${currentWorkspace?.id}`, updatedChatbot);
            const result = resp.data;

            return result;

        } catch (err) {

            console.error("Enable to fetch all chatbots: ", err);

        } finally {

            await getAllChatbots();

            setChatbotsLoading(false);

        }
        // setChatbots(prev => prev.map(bot => (bot.id === id ? { ...bot, ...updates, updatedAt: new Date() } : bot)));
    };

    const deleteChatbot = async (id: string) => {

        try {

            setChatbotsLoading(true);

            const resp = await axios.delete(`/api/chatbots/${id}?workspaceId=${currentWorkspace?.id}`);
            const result = resp.data;

            if (result.id) {
                setChatbots(prev => prev.filter(bot => bot.id !== result.id));
            }

        } catch (err) {

            console.error("Enable to fetch all chatbots: ", err);

        } finally {

            await getAllChatbots();
            setChatbotsLoading(false);

        }

        // setChatbots(prev => prev.filter(bot => bot.id !== id));
    };

    const getChatbot = (id: string) => {
        const existingBot = chatbots.find(bot => bot.id === id);
        return existingBot;
    };

    const addGuardrail = async (rule: Omit<GuardrailRule, 'id' | 'enabled'>) => {

        try {

            setGuardrailLoading(true);

            const reqBody = {
                name: rule.name,
                description: rule.description
            };

            const resp = await axios.post(`/api/guardrails?workspaceId=${currentWorkspace?.id}`, reqBody);
            const result = resp.data;

            if (result) {
                setGuardrails(prev => [...prev, result]);
            }

        } catch (err) {

            console.error("Enable to fetch all chatbots: ", err);

        } finally {

            setGuardrailLoading(false);

        }

    };

    const updateGuardrail = async (id: string, updates: Partial<GuardrailRule>) => {

        try {

            setGuardrailLoading(true);

            const resp = await axios.put(`/api/guardrails/${id}?workspaceId=${currentWorkspace?.id}`, updates);
            const result = resp.data;

            if (result) {
                setGuardrails(prev => prev.map(r => (r.id === id ? { ...r, ...result } : r)));
            }

        } catch (err) {

            console.error("Enable to fetch all chatbots: ", err);

        } finally {

            setGuardrailLoading(false);

        }

    };

    const deleteGuardrail = async (id: string) => {

        try {

            setGuardrailLoading(true);

            const resp = await axios.delete(`/api/guardrails/${id}?workspaceId=${currentWorkspace?.id}`);
            const result = resp.data;

            if (result.id) {
                setGuardrails(prev => prev.filter(r => r.id !== result.id));
            }

        } catch (err) {

            console.error("Enable to delete guardrail: ", err);

        } finally {

            setGuardrailLoading(false);

        }

    };

    return (
        <WorkspaceContext.Provider value={{ currentWorkspace, chatbots, isChatbotsLoading, getAllChatbots, isGuardrailLoading, setCurrentWorkspace, addChatbot, updateChatbot, deleteChatbot, getChatbot, guardrails, addGuardrail, updateGuardrail, deleteGuardrail, ...knowledgeBase }}>
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