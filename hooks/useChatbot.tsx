"use client";

import { useState, useCallback } from 'react';
import { Chatbot, ThemeConfig, UseChatbotOptions } from '@/types';
import { defaultGuardrails, defaultTheme } from '@/lib/constants';
import useToast from './useToast';
import axios from 'axios';

const formSchema: Partial<Chatbot> = {
    id: "",
    name: "",
    description: "",
    role: "",
    systemPrompt: "You are a helpful AI assistant. Answer questions accurately and helpfully.",
    tone: "professional",
    enableMemory: true,
    guardrails: defaultGuardrails,
    knowledge: [],
    configuration: defaultTheme,
    provider: "groq",
    model: "llama-3.1-8b-instant",
    apiKey: process.env.GROQ_API_KEY as string,
}

export default function useChatbot(workspaceId: string = "") {

    const [chatbots, setChatbots] = useState<Chatbot[]>([]);
    const [isChatbotsLoading, setChatbotsLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState<Partial<Chatbot>>(structuredClone(formSchema));
    const { showToast } = useToast();

    const getAllChatbots = async () => {

        try {

            setChatbotsLoading(true);
            const resp = await axios.get(`/api/chatbots?workspaceId=${workspaceId}`);
            const result = resp.data;

            setChatbots(result);

        } catch (err) {

            console.error("Enable to fetch all chatbots: ", err);

        } finally {

            setChatbotsLoading(false);

        }

    }

    const addChatbot = async (chatbot: Chatbot) => {

        try {

            setChatbotsLoading(true);

            const resp = await axios.post(`/api/chatbots?workspaceId=${workspaceId}`, chatbot);
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

    };

    const updateChatbot = async (id: string, updates: Partial<Chatbot>, selectedGuardrailIds: string[], selectedKnowledgeIds: Set<string>) => {

        try {

            setChatbotsLoading(true);
            let updatedChatbot = chatbots.filter(x => x.id === id).map(bot => ({ ...bot, ...updates, updatedAt: new Date() }))[0];
            updatedChatbot = {
                ...updatedChatbot,
                guardrailIds: selectedGuardrailIds || [],
                knowledgeIds: Array.from(selectedKnowledgeIds)
            }

            const resp = await axios.put(`/api/chatbots/${id}?workspaceId=${workspaceId}`, updatedChatbot);
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

            const resp = await axios.delete(`/api/chatbots/${id}?workspaceId=${workspaceId}`);
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

    const fetchBot = async (id: string, cb: (data: any) => void) => {

        try {

            setChatbotsLoading(true);
            const res = await axios.get(`/api/chatbots/${id}?workspaceId=${workspaceId}`);
            const data = res.data;

            setFormData({ ...data, guardrails: data.guardrailLinks || [], knowledge: data.knowledgeLinks || [] })
            cb(data);

        } catch (e) {

            console.log(e);
            showToast("Failed in fetching chatbot", "error");

        } finally {

            setChatbotsLoading(false);

        }

    }

    const handleSaveAdd = async ({ selectedGuardrailIds, selectedKnowledgeIds }: { selectedGuardrailIds: string[], selectedKnowledgeIds: Set<string> }) => {

        if (!formData.name) { showToast('Please provide a name', 'error'); return; }

        const newBot: any = {
            name: formData.name,
            description: formData.description || '',
            role: formData.role || 'Assistant',
            systemPrompt: formData.systemPrompt || '',
            tone: formData.tone || 'professional',
            enableMemory: formData.enableMemory ?? true,
            guardrailIds: selectedGuardrailIds || [],
            workspaceId: 'workspace-1',
            configuration: formData.configuration as ThemeConfig,
            provider: formData.provider,
            model: formData.model,
            apiKey: formData.apiKey,
            knowledgeIds: Array.from(selectedKnowledgeIds)
        };

        addChatbot(newBot);
        showToast('Chatbot created successfully!', 'success');

        await getAllChatbots();

    };

    const handleSaveUpdate = async ({ id, selectedGuardrailIds, selectedKnowledgeIds }: { id: string, selectedGuardrailIds: string[], selectedKnowledgeIds: Set<string> }) => {

        updateChatbot(id as string ?? null, formData, selectedGuardrailIds, selectedKnowledgeIds);
        showToast('Changes saved successfully!', 'success');
        await getAllChatbots();

    }

    const resetForm = () => {
        setFormData(structuredClone(formSchema))
    }

    return {
        chatbots,
        getAllChatbots,
        addChatbot,
        fetchBot,
        resetForm,
        updateChatbot,
        deleteChatbot,
        getChatbot,
        handleSaveAdd,
        handleSaveUpdate,
        isChatbotsLoading,
        formData,
        setFormData,
    };

}