import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Loader2, Sparkles, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChatInterfaceProps } from '@/types';
import { MarkdownRenderer } from '@/components/chatbot/MarkdownRenderer';

export function ChatInterface({ messages, chatbot, isLoading, selectedIds, onSendMessage, placeholder = 'Type your message...', showSources = false }: ChatInterfaceProps) {

    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            onSendMessage(input.trim(), selectedIds, chatbot?.tone, chatbot?.enableMemory);
            setInput('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="w-16 h-16 rounded-2xl bg-orange-500/20 flex items-center justify-center mb-4">
                            <Sparkles className="w-8 h-8 text-orange-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">
                            Start a conversation
                        </h3>
                        <p className="text-gray-500 max-w-sm">
                            Send a message to test your chatbot's responses and behavior.
                        </p>
                    </div>
                )}

                <AnimatePresence initial={false}>
                    {messages.map((message, index) => (
                        <motion.div key={message.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2, delay: index * 0.01 }} className={cn('flex gap-3', message.role === 'user' ? 'justify-end items-end' : 'justify-start items-end')}>
                            {message.role === 'assistant' && (
                                <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center shrink-0">
                                    <Sparkles className="w-4 h-4 text-orange-500" />
                                </div>
                            )}
                            <div className={cn('max-w-[80%] rounded-2xl px-4 py-3', message.role === 'user' ? 'bg-orange-600 text-white rounded-br-md' : 'bg-gray-800 text-foreground rounded-bl-md')}>
                                {/* <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                    {message.content}
                                </p> */}
                                <MarkdownRenderer content={message.content} />
                                {/* {showSources && message.metadata?.sources && message.metadata.sources.length > 0 && (
                                    <div className="mt-2 pt-2 border-t border-gray-500/50">
                                        <p className="text-xs text-gray-400">
                                            Sources:
                                            {message.metadata.sources.map((x) => {
                                                return <Badge className='bg-gray-600 text-gray-300 ml-2' key={x}>{x}</Badge>
                                            })}
                                        </p>
                                    </div>
                                )} */}
                            </div>
                            {message.role === 'user' && (
                                <div className="w-8 h-8 rounded-lg bg-gray-400/20 flex items-center justify-center shrink-0">
                                    <User className="w-4 h-4 text-white" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isLoading && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-orange-500" />
                        </div>
                        <div className="bg-gray-800 rounded-2xl rounded-bl-md px-4 py-3">
                            <div className="flex gap-1">
                                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="w-2 h-2 rounded-full bg-gray-600" />
                                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 rounded-full bg-gray-600" />
                                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 rounded-full bg-gray-600" />
                            </div>
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-700 p-4">
                <form onSubmit={handleSubmit} className="flex gap-3">
                    <div className="flex-1 relative">
                        <textarea ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder={placeholder} rows={1} className="w-full resize-none hide-scrollbar bg-gray-800 selection:bg-orange-500 border-none outline-none rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-shadow" style={{ minHeight: '48px', maxHeight: '120px' }} />
                    </div>
                    <Button type="submit" size="icon" className="h-12 w-12 rounded-xl bg-orange-500 hover:bg-orange-600 text-white transition-colors duration-100 cursor-pointer" disabled={!input.trim() || isLoading}>
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Send className="w-5 h-5" />
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
}