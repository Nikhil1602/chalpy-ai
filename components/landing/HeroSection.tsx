"use client"

import { motion } from "motion/react";
import { ArrowRight, Check, Play, Sparkles } from "lucide-react";
import Link from "next/link";

const HeroSection = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
            {/* Background effects */}
            <div className="absolute inset-0 hero-glow" />
            <div className="absolute inset-0 dot-pattern opacity-30" />
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-orange-500/5 blur-[120px] animate-pulse-glow" />

            <div className="container relative z-10 mx-auto px-4 md:px-8 py-20 md:py-32">
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto">

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6"
                    >
                        <Sparkles className="w-4 h-4 text-orange-500" />
                        <span className="text-sm">AI-Powered Chatbot Generator</span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6"
                    >
                        Build <span className="gradient-text">AI Chatbots</span> powered by  <span className="gradient-text">your Data</span> and <span className="gradient-text">Model</span>.
                    </motion.h1>

                    {/* Subheadline */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.25 }}
                        className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10"
                    >
                        Connect your AI model, train it on your content, and deploy a chatbot
                        that matches your brand — no coding required.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex flex-col sm:flex-row items-center gap-4"
                    >
                        <Link
                            href="#cta"
                            className="group flex items-center gap-2 rounded-xl bg-orange-500 px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 glow-md"
                        >
                            Get Started Free
                            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                        </Link>
                        <Link
                            href="#demo"
                            className="group flex items-center gap-2 rounded-xl border border-gray-700 px-8 py-3.5 text-sm font-medium text-foreground transition-all hover:bg-gray-800"
                        >
                            <Play size={14} className="text-orange-500" />
                            View Demo
                        </Link>
                    </motion.div>
                </div>

                {/* Hero Visual — Mock UI */}
                <motion.div
                    initial={{ opacity: 0, y: 60, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.9, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="mt-20 max-w-5xl mx-auto"
                >
                    <div className="bg-gray-900/50 border border-gray-500/50 glow-lg p-1 rounded-2xl">
                        <div className="rounded-xl bg-card overflow-hidden">
                            {/* Toolbar */}
                            <div className="flex items-center gap-2 border-b border-gray-500/50 px-4 py-3">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500/60" />
                                    <div className="w-3 h-3 rounded-full bg-orange-400/60" />
                                    <div className="w-3 h-3 rounded-full bg-orange-500/60" />
                                </div>
                            </div>

                            {/* Dashboard Mock */}
                            <div className="grid md:grid-cols-3 gap-0 min-h-[340px]">
                                {/* Sidebar */}
                                <div className="border-r border-gray-500/30 p-4 space-y-4">
                                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">AI Model</div>
                                    <div className="border border-gray-500/50 p-3 space-y-2 rounded-xl">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-orange-500" />
                                            <span className="text-sm font-medium text-foreground"> OpenAI GPT-4o</span>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-50">
                                            <div className="w-2 h-2 rounded-full bg-gray-500" />
                                            <span className="text-sm text-gray-400">Anthropic Claude</span>
                                        </div>
                                    </div>

                                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-4 mb-3">API Key</div>
                                    <div className="border border-gray-500/50 p-3 rounded-xl">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-8 rounded-md bg-gray-800 flex items-center px-3">
                                                <span className="text-xs font-mono text-gray-400">sk-••••••••••••3kF9</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 mt-2">
                                            <div className="w-3 h-3 rounded-full bg-orange-500/20 flex items-center justify-center">
                                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                            </div>
                                            <span className="text-[10px] text-orange-500">Encrypted & Secure</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Center - Chat Preview */}
                                <div className="p-4 space-y-3">
                                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Chat Preview</div>
                                    <div className="relative h-full space-y-3">
                                        <div className="space-y-3">
                                            <div className="flex justify-end">
                                                <div className="rounded-xl rounded-br-sm bg-orange-500/10 border border-orange-500/20 px-4 py-2 max-w-[85%]">
                                                    <span className="text-sm text-foreground">How do I reset my password?</span>
                                                </div>
                                            </div>
                                            <div className="flex justify-start">
                                                <div className="rounded-xl rounded-bl-sm bg-gray-800 px-4 py-2 max-w-[85%]">
                                                    <span className="text-sm text-gray-300">To reset your password, go to Settings → Account → Security. Click "Change Password" and follow the prompts.</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="relative bottom-0 md:absolute md:bottom-8 left-0 right-0 flex items-center gap-2 border border-gray-500/50 rounded-lg px-3 py-2">
                                            <span className="text-sm text-gray-400 flex-1">Type a message...</span>
                                            <div className="w-7 h-7 rounded-md bg-orange-500 flex items-center justify-center">
                                                <ArrowRight size={14} className="text-primary-foreground" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right - Customization */}
                                <div className="border-l border-gray-500/30 p-4 space-y-3 hidden md:block">
                                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Customize</div>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-400">Primary Color</span>
                                            <div className="flex gap-1.5">
                                                <div className="w-5 h-5 rounded-full bg-orange-500 ring-2 ring-orange-500/30" />
                                                <div className="w-5 h-5 rounded-full bg-orange-400" />
                                                <div className="w-5 h-5 rounded-full bg-red-600" />
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-400">Font</span>
                                            <span className="text-xs text-foreground font-medium">Poppins</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-400">Position</span>
                                            <span className="text-xs text-foreground font-medium">Bottom Right</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-400">Border Radius</span>
                                            <div className="w-20 h-1.5 rounded-full bg-gray-800 overflow-hidden">
                                                <div className="w-3/4 h-full bg-orange-500 rounded-full" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;
