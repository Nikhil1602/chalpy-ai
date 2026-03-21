"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { AIModelStepProps, AIProvider } from '@/types';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { aiPlatforms } from '@/lib/constants';
import Image from 'next/image';

export function AIModelStep({ formData, setFormData }: AIModelStepProps) {

    const [showKey, setShowKey] = React.useState(false);
    const [selectedPlatform, setSelectedPlatform] = useState<AIProvider>('groq')
    const [selectedModel, setSelectedModel] = useState<string>('llama-3.1-8b-instant');

    const activePlatform = aiPlatforms.find(p => p.id === selectedPlatform);

    const handleModelSelection = (model: any) => {

        setSelectedPlatform(model.id)

        const platform = aiPlatforms.find(p => p.id === model.id)

        if (platform) {
            setSelectedModel(platform.models[0].value) // auto select first model
        }

        setFormData({ ...formData, provider: model.id })

    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        Select AI Model
                    </CardTitle>
                    <CardDescription className='text-gray-500'>Choose the AI model that will power your chatbot</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap w-full gap-3">
                        {aiPlatforms.map((model) => (
                            <motion.button key={model.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => handleModelSelection(model)} className={cn('relative w-[180px] h-[180px] flex items-center flex-col justify-center p-4 cursor-pointer rounded-xl border-2 text-left transition-all duration-200', formData.provider === model.id ? 'border-orange-500 bg-orange-500/5 shadow-lg shadow-orange-500/10' : 'border-border hover:border-orange-500/40 hover:bg-muted/50')}>
                                {formData.provider === model.id && (
                                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-orange-500" />
                                )}
                                <Image src={model.iconSrc} alt={model.name} width={50} height={50} className="w-8 h-8 mb-2" />
                                <p className="font-semibold text-foreground">{model.name}</p>
                                <span className="text-xs bg-orange-500/50 px-2 py-1 rounded-full text-muted-foreground mt-0.5">{model.provider}</span>
                            </motion.button>
                        ))}
                    </div>
                    <div className='mt-5'>
                        <Label className='mb-2'>Chooose model</Label>
                        <Select value={selectedModel} onValueChange={(val) => { setSelectedModel(val); setFormData({ ...formData, model: val }) }}>
                            <SelectTrigger className="h-9 w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {activePlatform?.models.map((model) => (
                                    <SelectItem key={model.value} value={model.value}>
                                        {model.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>API Key</CardTitle>
                    <CardDescription className='text-gray-500'>
                        Enter your API key for {aiPlatforms.find(m => m.id === formData.provider)?.name || 'the selected model'}.
                        Your key is stored securely and never shared.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Label>API Key</Label>
                        <div className="relative">
                            <Input type={showKey ? 'text' : 'password'} placeholder={`Enter your ${aiPlatforms.find(m => m.id === formData.provider)?.provider} API key...`} value={formData.apiKey} onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })} className="pr-10 font-mono text-sm" />
                            <button type="button" onClick={() => setShowKey(!showKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-foreground transition-colors">
                                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        <p className="text-xs text-gray-500">
                            {formData.provider === 'chatgpt' && <span>Get your API key frome <Link className='text-blue-500' href="https://platform.openai.com/api-keys" target="_blank">platform.openai.com</Link></span>}
                            {formData.provider === 'claude' && <span>Get your API key from <Link className='text-blue-500' href="https://platform.claude.com/settings/keys" target="_blank">platform.claude.com</Link></span>}
                            {formData.provider === 'gemini' && <span>Get your API key from <Link className='text-blue-500' href="https://aistudio.google.com/api-keys" target="_blank">aistudio.google.com</Link></span>}
                            {formData.provider === 'meta' && <span>Get your API key from <Link className='text-blue-500' href="https://llama.developer.meta.com/docs/api-keys" target="_blank">llama.developer.meta.com</Link></span>}
                            {formData.provider === 'groq' && <span>Get your API key from <Link className='text-blue-500' href="https://console.x.ai/" target="_blank">console.x.ai</Link></span>}
                            {formData.provider === 'mistral' && <span>Get your API key from <Link className='text-blue-500' href="https://admin.mistral.ai/organization/api-keys" target="_blank">admin.mistral.ai</Link></span>}
                            {formData.provider === 'deepseek' && <span>Get your API key from <Link className='text-blue-500' href="https://platform.deepseek.com/api_keys" target="_blank">platform.deepseek.com</Link></span>}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}