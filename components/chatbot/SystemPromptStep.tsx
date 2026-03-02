import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'motion/react';
import { Plus, X } from 'lucide-react';

const personaTemplates = [
    { name: 'Customer Support', prompt: 'You are a friendly and efficient customer support agent. Always greet the user warmly, acknowledge their issue, and provide clear step-by-step solutions. If you cannot resolve the issue, escalate politely.' },
    { name: 'Sales Assistant', prompt: 'You are a knowledgeable sales assistant. Help users understand product features, compare options, and make informed decisions. Be persuasive but honest. Never pressure the user.' },
    { name: 'Technical Expert', prompt: 'You are a technical expert. Provide accurate, detailed technical explanations. Use code examples when relevant. Adapt your explanations to the user\'s apparent skill level.' },
    { name: 'Onboarding Guide', prompt: 'You are a friendly onboarding guide. Walk new users through setup and features step by step. Be patient, encouraging, and use simple language.' },
];

const constraintSuggestions = [
    'Never share or ask for personal information like passwords or credit card numbers.',
    'Always stay on topic and redirect off-topic conversations politely.',
    'If unsure about an answer, clearly state that you are not certain.',
    'Do not make promises about features, timelines, or pricing that are not confirmed.',
    'Respond in the same language the user is writing in.',
];

const responseFormats = [
    { name: 'Concise', instruction: 'Keep responses concise and under 3 sentences when possible.' },
    { name: 'Structured', instruction: 'Use bullet points and numbered lists for clarity. Break down complex answers into sections.' },
    { name: 'Conversational', instruction: 'Respond in a natural, conversational tone. Use casual language and occasional emojis.' },
    { name: 'Formal', instruction: 'Use formal language with proper grammar. Avoid contractions and slang.' },
];

interface SystemPromptStepProps {
    systemPrompt: string;
    onChange: (prompt: string) => void;
}

export function SystemPromptStep({ systemPrompt, onChange }: SystemPromptStepProps) {

    const [showPersona, setShowPersona] = useState(false);
    const [showConstraints, setShowConstraints] = useState(false);
    const [showFormat, setShowFormat] = useState(false);
    const [customConstraint, setCustomConstraint] = useState('');
    const [addedConstraints, setAddedConstraints] = useState<string[]>([]);

    const appendToPrompt = (text: string) => {
        onChange(systemPrompt ? `${systemPrompt}\n\n${text}` : text);
    };

    const addConstraint = (constraint: string) => {
        if (!addedConstraints.includes(constraint)) {
            setAddedConstraints([...addedConstraints, constraint]);
            appendToPrompt(`CONSTRAINT: ${constraint}`);
        }
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>System Prompt</CardTitle>
                    <CardDescription className='text-gray-500'>
                        Define how your chatbot should behave and respond to users
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Textarea className="min-h-[300px] font-mono text-sm" placeholder="You are a helpful AI assistant..." value={systemPrompt} onChange={(e) => onChange(e.target.value)} />
                    <div className="mt-4 flex flex-wrap gap-2">
                        <Badge variant="outline" className="cursor-pointer hover:bg-orange-500/10 hover:border-orange-500/40 transition-colors" onClick={() => setShowPersona(true)}>
                            <Plus className="w-3 h-3 mr-1" /> Add persona template
                        </Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-orange-500/10 hover:border-orange-500/40 transition-colors" onClick={() => setShowConstraints(true)}>
                            <Plus className="w-3 h-3 mr-1" /> Add constraints
                        </Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-primary/10 hover:border-orange-500/40 transition-colors" onClick={() => setShowFormat(true)}>
                            <Plus className="w-3 h-3 mr-1" /> Add response format
                        </Badge>
                    </div>

                    {/* Added constraints tags */}
                    {addedConstraints.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                            {addedConstraints.map((c, i) => (
                                <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-orange-500/10 text-orange-500">
                                    {c.slice(0, 40)}...
                                    <button onClick={() => { setAddedConstraints(addedConstraints.filter((_, idx) => idx !== i)); }}>
                                        <X className="w-3 h-3" />
                                    </button>
                                </motion.span>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Persona Template Dialog */}
            <Dialog open={showPersona} onOpenChange={setShowPersona}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Choose a Persona Template</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto hide-scrollbar">
                        {personaTemplates.map((tmpl) => (
                            <button key={tmpl.name} onClick={() => { onChange(tmpl.prompt); setShowPersona(false); }} className="w-full text-left cursor-pointer p-4 rounded-xl border border-gray-500 hover:border-orange-500/40 hover:bg-orange-500/5 transition-all">
                                <p className="font-semibold text-white">{tmpl.name}</p>
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{tmpl.prompt}</p>
                            </button>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Constraints Dialog */}
            <Dialog open={showConstraints} onOpenChange={setShowConstraints}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Add Constraints</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto hide-scrollbar">
                        {constraintSuggestions.map((c, i) => (
                            <button key={i} onClick={() => addConstraint(c)} disabled={addedConstraints.includes(c)} className="w-full cursor-pointer text-left p-3 rounded-lg border border-gray-500 hover:border-orange-500/40 hover:bg-orange-500/5 hover:text-orange-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed text-sm">
                                {c}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-2 mt-2">
                        <Input placeholder="Add custom constraint..." value={customConstraint} onChange={(e) => setCustomConstraint(e.target.value)} />
                        <Button size="sm" className='bg-orange-500 text-white hover:bg-orange-800 cursor-pointer p-4' onClick={() => { if (customConstraint.trim()) { addConstraint(customConstraint.trim()); setCustomConstraint(''); } }}>
                            Add
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Response Format Dialog */}
            <Dialog open={showFormat} onOpenChange={setShowFormat}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle className='text-white'>Choose Response Format</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                        {responseFormats.map((fmt) => (
                            <button key={fmt.name} onClick={() => { appendToPrompt(`RESPONSE FORMAT: ${fmt.instruction}`); setShowFormat(false); }} className="w-full cursor-pointer text-left p-4 rounded-xl border border-gray-700 hover:border-orange-500/40 hover:bg-orange-500/5 transition-all">
                                <p className="font-semibold text-white">{fmt.name}</p>
                                <p className="text-xs text-muted-foreground mt-1">{fmt.instruction}</p>
                            </button>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );

}