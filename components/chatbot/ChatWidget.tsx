"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Bot, X, MessageSquare, Sparkles, Headphones, HelpCircle } from "lucide-react";
import { LauncherIcon, ThemeConfig } from "@/types";
import { useChat } from "@/hooks";
import { MarkdownRenderer } from "./MarkdownRenderer";
import axios from "axios";

const launcherIconMap: Record<LauncherIcon, React.ReactNode> = {
    message: <MessageSquare className="w-6 h-6" />,
    bot: <Bot className="w-6 h-6" />,
    sparkles: <Sparkles className="w-6 h-6" />,
    headphones: <Headphones className="w-6 h-6" />,
    help: <HelpCircle className="w-6 h-6" />,
};

export function ChatWidget({ chatbotId, workspaceId }: { chatbotId: string, workspaceId: string }) {

    const [isOpen, setIsOpen] = useState(true);
    const { messages, isMsgLoading, sendMessageEmbed } = useChat(chatbotId, workspaceId);
    const [input, setInput] = useState("");
    const [chatbot, setChatbot] = useState<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // ✅ Fetch chatbot config (theme + tone + etc)
    useEffect(() => {

        const loadBot = async () => {
            const res = await axios.get(`/api/chatbots/${chatbotId}?workspaceId=${workspaceId}`);
            const data = res.data;
            setChatbot(data);
        };

        loadBot();

    }, [chatbotId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const submitChat = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() && isMsgLoading) return;
        const msg = input;
        setInput("");
        await sendMessageEmbed(msg);
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submitChat(e);
        }
    };

    if (!chatbot) return null;

    const theme: ThemeConfig = chatbot.configuration;
    const launcher: ThemeConfig["launcher"] = chatbot.configuration.launcher;
    console.log(chatbot);

    if (!theme) return null;

    const renderLauncherContent = () => {
        if (launcher.logoUrl) {
            return <img src={launcher.logoUrl} alt="Bot" className={`w-${launcher.padding} h-${launcher.padding} rounded-full object-contain`} />;
        }
        return launcherIconMap[launcher.icon] || <MessageSquare className="w-6 h-6" />;
    };

    const positionClasses: Record<string, any> = {
        'bottom-right': 'bottom-4 right-4',
        'bottom-left': 'bottom-4 left-4',
        'top-right': 'top-4 right-4',
        'top-left': 'top-4 left-4',
    };

    const headerBg = theme.gradient !== 'none' ? theme.gradient : theme.headerColor;

    return (
        <div className="relative w-full h-screen">

            <AnimatePresence>
                {!isOpen && (
                    <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => setIsOpen(true)} className={`absolute ${positionClasses[theme.position]} shadow-xl cursor-pointer flex items-center justify-center text-white z-10`} style={{ background: launcher.backgroundColor, borderRadius: `${launcher.borderRadius}%`, width: launcher.size, height: launcher.size, padding: launcher.padding ?? 8 }}>
                        {renderLauncherContent()}
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: 'spring', bounce: 0.3, duration: 0.5 }}
                        className={`absolute ${positionClasses[theme.position]} w-[280px] sm:w-[320px] min-h-[400px] shadow-2xl overflow-hidden flex flex-col`} style={{ borderRadius: theme.borderRadius, maxHeight: '400px' }}
                    >

                        {/* Header */}
                        <div className="px-3 sm:px-4 py-3 flex items-center justify-between text-white shrink-0 border-b-none" style={{ background: headerBg, fontFamily: theme.fontFamily }}>
                            <div className="flex items-center gap-2">
                                {theme.logoUrl ? (
                                    <img src={theme.logoUrl} alt="Logo" className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-contain bg-white/20 p-0.5" />
                                ) : (
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 flex items-center justify-center">
                                        <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </div>
                                )}
                                <div>
                                    <p className="font-semibold text-xs sm:text-sm leading-tight">{chatbot.name || 'My Chatbot'}</p>
                                    <p className="text-[10px] sm:text-xs opacity-80">Online</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 cursor-pointer rounded-full p-1 transition-colors">
                                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 p-2.5 sm:p-3 space-y-2.5 overflow-y-auto" style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}>
                            {messages.map((msg, i) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className="max-w-[80%] px-2.5 py-1.5 sm:px-3 sm:py-2 text-[11px] sm:text-xs leading-relaxed" style={{ borderRadius: theme.borderRadius * 0.75, backgroundColor: msg.role === 'user' ? theme.accentColor : (theme.backgroundColor === '#ffffff' ? '#f3f4f6' : 'rgba(255,255,255,0.1)'), color: msg.role === 'user' ? '#ffffff' : theme.textColor }}>
                                        <MarkdownRenderer className="text-xs" content={msg.content} />
                                        {/* {msg.content} */}
                                    </div>
                                </motion.div>
                            ))}

                            {isMsgLoading && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="flex gap-1 px-3 py-2 w-fit" style={{ borderRadius: theme.borderRadius * 0.75, backgroundColor: theme.backgroundColor === '#ffffff' ? '#f3f4f6' : 'rgba(255,255,255,0.1)' }}>
                                {[0, 1, 2].map((i) => (
                                    <motion.span key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.accentColor }} animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }} />
                                ))}
                            </motion.div>}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="px-2.5 sm:px-3 py-2 border-t flex items-center gap-2 shrink-0" style={{ backgroundColor: theme.backgroundColor, borderColor: theme.backgroundColor === '#ffffff' ? '#e5e7eb' : 'rgba(255,255,255,0.2)' }}>
                            <input value={input} onKeyDown={handleKeyDown} onChange={(e) => setInput(e.target.value)} className="flex-1 text-[11px] sm:text-xs bg-transparent outline-none placeholder:opacity-50" style={{ color: theme.textColor }} placeholder="Type a message..." />
                            <button onClick={submitChat} className="w-6 h-6 sm:w-7 sm:h-7 rounded-full cursor-pointer flex items-center justify-center text-white shrink-0" style={{ backgroundColor: theme.accentColor }}>
                                <Send className="w-3 h-3" />
                            </button>
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}