import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { AIModel, AIPlatform, AIModelStepProps } from '@/types';
import { cn } from '@/lib/utils';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';

const aiPlatforms: AIPlatform[] = [
    {
        id: 'chatgpt',
        name: 'ChatGPT',
        provider: 'OpenAI',
        description: 'GPT-4o, GPT-4.1',
        iconSrc: '/chatgpt-icon.png',
        models: [
            { value: 'gpt-4o', label: 'GPT-4o' },
            { value: 'gpt-4.1', label: 'GPT-4.1' },
            { value: 'gpt-4.1-mini', label: 'GPT-4.1 Mini' },
            { value: 'gpt-4', label: 'GPT-4' },
            { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
        ],
    },
    {
        id: 'gemini',
        name: 'Gemini',
        provider: 'Google',
        description: 'Gemini 1.5',
        iconSrc: '/google-gemini-icon.png',
        models: [
            { value: 'gemini-3-deep-think', label: 'Gemini 3 Deep Think' },
            { value: 'gemini-3-pro', label: 'Gemini 3 Flash' },
            { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
            { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
            { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash' },
        ],
    },
    {
        id: 'claude',
        name: 'Claude',
        provider: 'Anthropic',
        description: 'Claude 3.5',
        iconSrc: '/claude-ai-icon.png',
        models: [
            { value: 'claude-4.5-haiku', label: 'Claude 4.5 Haiku' },
            { value: 'claude-4.5-opus', label: 'Claude 4.5 Opus' },
            { value: 'claude-4-sonnet', label: 'Claude 4 Sonnet' },
            { value: 'claude-3.5-haiku', label: 'Claude 3.5 Haiku' },
            { value: 'claude-3-5-sonnet', label: 'Claude 3.5 Sonnet' },
        ],
    },
    {
        id: 'meta',
        name: 'Llama',
        provider: 'Meta',
        description: 'Llama 3',
        iconSrc: '/meta-ai-icon.png',
        models: [
            { value: 'llama-4-maverick', label: 'Llama 4 Maverick' },
            { value: 'llama-3.3-70b', label: 'Llama 3.3 70B' },
            { value: 'llama-3.2-1b', label: 'Llama 3.2 1B' },
        ],
    },
    {
        id: 'deepseek',
        name: 'DeepSeek',
        provider: 'DeepSeek',
        description: 'DeepSeek R1, DeepSeek V3',
        iconSrc: '/deepseek-icon.png',
        models: [
            { value: 'deepseek-r1', label: 'DeepSeek-R1' },
            { value: 'deepseek-v3', label: 'DeepSeek-V3' },
        ],
    },
    {
        id: 'grok',
        name: 'Grok',
        provider: 'X AI',
        description: 'Grok 1.5',
        iconSrc: '/grok-icon.png',
        models: [
            { value: 'grok-1', label: 'Grok-1' },
            { value: 'grok-1.5', label: 'Grok-1.5' },
            { value: 'grok-3', label: 'Grok-3' },
            { value: 'grok-3-mini', label: 'Grok-3 Mini' },
        ],
    },
    {
        id: 'mistral',
        name: 'Mistral',
        provider: 'Mistral AI',
        description: 'Mistral Large',
        iconSrc: '/mistral-ai-icon.png',
        models: [
            { value: 'mistral-large', label: 'Mistral Large' },
            { value: 'mistral-medium', label: 'Mistral Medium' },
            { value: 'mistral-small', label: 'Mistral Small' },
        ],
    }
]

export function AIModelStep({ config, onChange }: AIModelStepProps) {

    const [showKey, setShowKey] = React.useState(false);
    const [selectedPlatform, setSelectedPlatform] = useState<AIModel>('chatgpt')
    const [selectedModel, setSelectedModel] = useState<string>('gpt-4o');

    const activePlatform = aiPlatforms.find(p => p.id === selectedPlatform);

    const handleModelSelection = (model: any) => {

        setSelectedPlatform(model.id)

        const platform = aiPlatforms.find(p => p.id === model.id)

        if (platform) {
            setSelectedModel(platform.models[0].value) // auto select first model
        }

        onChange({ ...config, model: model.id });

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
                            <motion.button key={model.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => handleModelSelection(model)} className={cn('relative w-[180px] h-[180px] flex items-center flex-col justify-center p-4 cursor-pointer rounded-xl border-2 text-left transition-all duration-200', config.model === model.id ? 'border-orange-500 bg-orange-500/5 shadow-lg shadow-orange-500/10' : 'border-border hover:border-orange-500/40 hover:bg-muted/50')}>
                                {config.model === model.id && (
                                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-orange-500" />
                                )}
                                <img src={model.iconSrc} alt={model.name} width={50} height={50} className="w-8 h-8 mb-2" />
                                <p className="font-semibold text-foreground">{model.name}</p>
                                <span className="text-xs bg-orange-500/50 px-2 py-1 rounded-full text-muted-foreground mt-0.5">{model.provider}</span>
                            </motion.button>
                        ))}
                    </div>
                    <div className='mt-5'>
                        <Label className='mb-2'>Chooose model</Label>
                        <Select value={selectedModel} onValueChange={(val) => setSelectedModel(val)}>
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
                        Enter your API key for {aiPlatforms.find(m => m.id === config.model)?.name || 'the selected model'}.
                        Your key is stored securely and never shared.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Label>API Key</Label>
                        <div className="relative">
                            <Input type={showKey ? 'text' : 'password'} placeholder={`Enter your ${aiPlatforms.find(m => m.id === config.model)?.provider} API key...`} value={config.apiKey} onChange={(e) => onChange({ ...config, apiKey: e.target.value })} className="pr-10 font-mono text-sm" />
                            <button type="button" onClick={() => setShowKey(!showKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-foreground transition-colors">
                                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        <p className="text-xs text-gray-500">
                            {config.model === 'chatgpt' && <span>Get your API key frome <Link className='text-blue-500' href="https://platform.openai.com/api-keys" target="_blank">platform.openai.com</Link></span>}
                            {config.model === 'claude' && <span>Get your API key from <Link className='text-blue-500' href="https://platform.claude.com/settings/keys" target="_blank">platform.claude.com</Link></span>}
                            {config.model === 'gemini' && <span>Get your API key from <Link className='text-blue-500' href="https://aistudio.google.com/api-keys" target="_blank">aistudio.google.com</Link></span>}
                            {config.model === 'meta' && <span>Get your API key from <Link className='text-blue-500' href="https://llama.developer.meta.com/docs/api-keys" target="_blank">llama.developer.meta.com</Link></span>}
                            {config.model === 'grok' && <span>Get your API key from <Link className='text-blue-500' href="https://console.x.ai/" target="_blank">console.x.ai</Link></span>}
                            {config.model === 'mistral' && <span>Get your API key from <Link className='text-blue-500' href="https://admin.mistral.ai/organization/api-keys" target="_blank">admin.mistral.ai</Link></span>}
                            {config.model === 'deepseek' && <span>Get your API key from <Link className='text-blue-500' href="https://platform.deepseek.com/api_keys" target="_blank">platform.deepseek.com</Link></span>}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}