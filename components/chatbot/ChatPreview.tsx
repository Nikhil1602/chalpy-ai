import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, X, MessageSquare, Sparkles, Headphones, HelpCircle } from 'lucide-react';
import { LauncherIcon, ChatPreviewProps } from '@/types';
import { defaultLauncher } from '@/lib/constants';

const sampleMessages = [
    { role: 'assistant' as const, text: 'Hi there! 👋 How can I help you today?' },
    { role: 'user' as const, text: 'What services do you offer?' },
    { role: 'assistant' as const, text: 'We offer a wide range of AI-powered solutions including chatbot creation, knowledge management, and more!' },
];

const launcherIconMap: Record<LauncherIcon, React.ReactNode> = {
    message: <MessageSquare className="w-6 h-6" />,
    bot: <Bot className="w-6 h-6" />,
    sparkles: <Sparkles className="w-6 h-6" />,
    headphones: <Headphones className="w-6 h-6" />,
    help: <HelpCircle className="w-6 h-6" />,
};

export function ChatPreview({ theme, botName }: ChatPreviewProps) {

    const [isOpen, setIsOpen] = useState(true);
    const launcher = theme.launcher || defaultLauncher;

    const headerBg = theme.gradient !== 'none' ? theme.gradient : theme.headerColor;

    const positionClasses: Record<string, string> = {
        'bottom-right': 'bottom-4 right-4',
        'bottom-left': 'bottom-4 left-4',
        'top-right': 'top-4 right-4',
        'top-left': 'top-4 left-4',
    };

    const renderLauncherContent = () => {
        if (launcher.logoUrl) {
            return <img src={launcher.logoUrl} alt="Bot" className={`w-${launcher.padding} h-${launcher.padding} rounded-full object-contain`} />;
        }
        return launcherIconMap[launcher.icon] || <MessageSquare className="w-6 h-6" />;
    };

    return (
        <div className="relative w-full h-[420px] sm:h-[480px] checkerboard overflow-hidden" style={{ fontFamily: theme.fontFamily }}>
            {/* Floating launcher button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => setIsOpen(true)} className={`absolute ${positionClasses[theme.position]} shadow-xl cursor-pointer flex items-center justify-center text-white z-10`} style={{ background: launcher.backgroundColor, borderRadius: `${launcher.borderRadius}%`, width: launcher.size, height: launcher.size, padding: launcher.padding ?? 8 }}>
                        {renderLauncherContent()}
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} transition={{ type: 'spring', bounce: 0.3, duration: 0.5 }} className={`absolute ${positionClasses[theme.position]} w-[280px] sm:w-[320px] shadow-2xl overflow-hidden flex flex-col`} style={{ borderRadius: theme.borderRadius, maxHeight: '400px' }}>
                        {/* Header */}
                        <div className="px-3 sm:px-4 py-3 flex items-center justify-between text-white shrink-0 border-b-none" style={{ background: headerBg }}>
                            <div className="flex items-center gap-2">
                                {theme.logoUrl ? (
                                    <img src={theme.logoUrl} alt="Logo" className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-contain bg-white/20 p-0.5" />
                                ) : (
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 flex items-center justify-center">
                                        <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    </div>
                                )}
                                <div>
                                    <p className="font-semibold text-xs sm:text-sm leading-tight">{botName || 'My Chatbot'}</p>
                                    <p className="text-[10px] sm:text-xs opacity-80">Online</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 cursor-pointer rounded-full p-1 transition-colors">
                                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 p-2.5 sm:p-3 space-y-2.5 overflow-y-auto" style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}>
                            {sampleMessages.map((msg, i) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className="max-w-[80%] px-2.5 py-1.5 sm:px-3 sm:py-2 text-[11px] sm:text-xs leading-relaxed" style={{ borderRadius: theme.borderRadius * 0.75, backgroundColor: msg.role === 'user' ? theme.accentColor : (theme.backgroundColor === '#ffffff' ? '#f3f4f6' : 'rgba(255,255,255,0.1)'), color: msg.role === 'user' ? '#ffffff' : theme.textColor }}>
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}
                            {/* Typing indicator */}
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="flex gap-1 px-3 py-2 w-fit" style={{ borderRadius: theme.borderRadius * 0.75, backgroundColor: theme.backgroundColor === '#ffffff' ? '#f3f4f6' : 'rgba(255,255,255,0.1)' }}>
                                {[0, 1, 2].map((i) => (
                                    <motion.span key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.accentColor }} animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }} />
                                ))}
                            </motion.div>
                        </div>

                        {/* Input */}
                        <div className="px-2.5 sm:px-3 py-2 border-t flex items-center gap-2 shrink-0" style={{ backgroundColor: theme.backgroundColor, borderColor: theme.backgroundColor === '#ffffff' ? '#e5e7eb' : 'rgba(255,255,255,0.2)' }}>
                            <input placeholder="Type a message..." className="flex-1 text-[11px] sm:text-xs bg-transparent outline-none placeholder:opacity-50" style={{ color: theme.textColor }} readOnly />
                            <button className="w-6 h-6 sm:w-7 sm:h-7 rounded-full cursor-pointer flex items-center justify-center text-white shrink-0" style={{ backgroundColor: theme.accentColor }}>
                                <Send className="w-3 h-3" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}