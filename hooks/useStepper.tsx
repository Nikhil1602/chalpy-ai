"use client";

import { Bot, MessageSquare, Upload, Code2, Shield, Brain } from 'lucide-react';
import { useCallback, useState } from 'react';
import useToast from './useToast';

const useStepper = ({ isNew, formData }: { isNew: boolean, formData: any }) => {

    const [currentStep, setCurrentStep] = useState<number>(0);
    const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set(isNew ? [] : [0, 1, 2, 3, 4, 5]));
    const { showToast } = useToast();
    const steps = [
        { id: 'general', label: 'General', icon: <Bot className="w-4 h-4" /> },
        { id: 'model', label: 'AI Model', icon: <Brain className="w-4 h-4" /> },
        { id: 'prompt', label: 'System Prompt', icon: <MessageSquare className="w-4 h-4" /> },
        { id: 'guardrails', label: 'Guardrails', icon: <Shield className="w-4 h-4" /> },
        { id: 'knowledge', label: 'Knowledge', icon: <Upload className="w-4 h-4" /> },
        { id: 'deploy', label: 'Deploy', icon: <Code2 className="w-4 h-4" /> },
    ];

    const validateStep = useCallback((step: number): string | null => {

        switch (step) {

            case 0:
                if (!formData.name?.trim()) return 'Please provide a name for your chatbot';
                if (!formData.role?.trim()) return 'Please provide a role for your chatbot';
                return null;
            case 1:
                if (!formData?.provider) return 'Please select an AI provider';
                if (!formData?.model) return 'Please select a model';
                if (!formData?.apiKey?.trim()) return 'Please enter an API key';
                return null;
            case 2:
                if (!formData.systemPrompt?.trim()) return 'Please provide a system prompt';
                return null;
            default:
                return null;

        }

    }, [formData]);

    const goNext = () => {

        const error = validateStep(currentStep);

        if (error) {
            showToast(error, 'error');
            return;
        }

        setCompletedSteps(prev => new Set([...prev, currentStep]));
        setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));

    };

    const goPrev = () => {
        setCurrentStep(prev => Math.max(prev - 1, 0));
    };

    const handleStepClick = (index: number) => {

        if (index < currentStep || completedSteps.has(index) || index === currentStep + 1) {
            if (index > currentStep) {
                const error = validateStep(currentStep);
                if (error) { showToast(error, 'error'); return; }
                setCompletedSteps(prev => new Set([...prev, currentStep]));
            }
            setCurrentStep(index);
        }

    };

    return { steps, goNext, goPrev, handleStepClick, currentStep, completedSteps }

}

export default useStepper