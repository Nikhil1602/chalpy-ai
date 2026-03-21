"use client";

import { GuardrailRule } from '@/types';
import { useEffect, useState } from 'react'
import axios from 'axios';
import useToast from './useToast';

const useGuardrails = (workspaceId: string = "") => {

    const [isGuardrailLoading, setGuardrailLoading] = useState<Boolean>(false);
    const [guardrails, setGuardrails] = useState<GuardrailRule[] | []>([]);
    const { showToast } = useToast();

    const getAllGuardrails = async () => {

        try {

            setGuardrailLoading(true);
            const resp = await axios.get(`/api/guardrails?workspaceId=${workspaceId}`);
            const result = resp.data;

            if (result.length)
                setGuardrails(result);

        } catch (err) {

            console.error("Enable to fetch all guardrails: ", err);
            showToast("Unable to fetch all guardrails", "error");

        } finally {

            setGuardrailLoading(false);

        }

    }

    useEffect(() => {
        workspaceId !== "" && getAllGuardrails();
    }, []);

    const addGuardrail = async (rule: Omit<GuardrailRule, 'id' | 'enabled'>) => {

        try {

            setGuardrailLoading(true);

            const reqBody = {
                name: rule.name,
                description: rule.description
            };

            const resp = await axios.post(`/api/guardrails?workspaceId=${workspaceId}`, reqBody);
            const result = resp.data;

            if (result) {
                setGuardrails(prev => [...prev, result]);
            }

        } catch (err) {

            console.log(err);
            showToast("Unable to add guardrail", "error");

        } finally {

            setGuardrailLoading(false);

        }

    };

    const updateGuardrail = async (id: string, updates: Partial<GuardrailRule>) => {

        try {

            setGuardrailLoading(true);

            const resp = await axios.put(`/api/guardrails/${id}?workspaceId=${workspaceId}`, updates);
            const result = resp.data;

            if (result) {
                setGuardrails(prev => prev.map(r => (r.id === id ? { ...r, ...result } : r)));
            }

        } catch (err) {

            console.error("Enable to update guardrail: ", err);
            showToast("Unable to update guardrail", "error");

        } finally {

            setGuardrailLoading(false);

        }

    };

    const deleteGuardrail = async (id: string) => {

        try {

            setGuardrailLoading(true);

            const resp = await axios.delete(`/api/guardrails/${id}?workspaceId=${workspaceId}`);
            const result = resp.data;

            if (result.id) {
                setGuardrails(prev => prev.filter(r => r.id !== result.id));
            }

        } catch (err) {

            console.error("Enable to delete guardrail: ", err);
            showToast("Unable to delete guardrail", "error");

        } finally {

            setGuardrailLoading(false);

        }

    };

    return { isGuardrailLoading, guardrails, getAllGuardrails, addGuardrail, updateGuardrail, deleteGuardrail }

}

export default useGuardrails