"use client";

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'motion/react';
import { ArrowLeft, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { Badge } from '@/components/ui/badge';
import { useWorkspace } from '@/store/WorkspaceContext';
import { useChatbot } from '@/hooks';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SidebarContainer from '@/components/layout/SidebarContainer';

export default function Playground() {

    const { id } = useParams();
    const { getChatbot, selectedKnowledgeIds } = useWorkspace();
    const chatbot = getChatbot(id as string ?? '');
    const { messages, isLoading, sendMessage, clearMessages } = useChatbot({ chatbotId: id as string ?? '' });
    const router = useRouter();

    const [showDevMode, setShowDevMode] = useState(false);
    const [showPrompt, setShowPrompt] = useState(false);

    if (!chatbot) {
        return (
            <SidebarContainer>
                <div className="flex flex-col items-center justify-center h-[60vh]">
                    <h2 className="text-xl font-semibold text-foreground mb-2">Chatbot not found</h2>
                    <Link href="/chatbot">
                        <Button className='bg-gray-500 text-white'>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Chatbots
                        </Button>
                    </Link>
                </div>
            </SidebarContainer>
        );
    }

    return (
        <SidebarContainer>

            {/* Header */}
            <div className="flex items-center justify-between mb-6">

                <div className="flex items-center gap-4">
                    <Button onClick={() => router.back()} className='bg-gray-700 hover:bg-gray-800 transition-colors duration-100 cursor-pointer text-white' size="icon">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-foreground">{chatbot.name}</h1>
                            <Badge variant="outline" className="capitalize">{chatbot.status}</Badge>
                        </div>
                        <p className="text-gray-500">Playground - Test your chatbot</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">

                    <Button className='bg-indigo-600 hover:bg-indigo-700 transition-colors duration-100 cursor-pointer text-white' size="sm" onClick={clearMessages}>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset
                    </Button>

                </div>
            </div>

            {/* Main Content */}
            <div className="flex-col md:flex-row flex gap-5 h-[600px] w-full">

                {/* Chat Panel */}
                <Card className='w-full md:w-[60%]'>
                    <ChatInterface messages={messages} isLoading={isLoading} selectedIds={selectedKnowledgeIds} onSendMessage={sendMessage} placeholder="Type a message to test your chatbot..." showSources={showDevMode} />
                </Card>

                {/* Developer Panel */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4 w-full md:w-[40%]">
                    {/* System Prompt */}
                    <Card>
                        <CardHeader className="cursor-pointer" onClick={() => setShowPrompt(!showPrompt)}>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base">System Prompt</CardTitle>
                                {showPrompt ? (
                                    <ChevronUp className="w-5 h-5 text-gray-500" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-500" />
                                )}
                            </div>
                        </CardHeader>
                        {showPrompt && (
                            <CardContent>
                                <div className="bg-gray-800 selection:bg-orange-600 selection:text-white rounded-lg p-3 text-sm text-gray-400 font-mono max-h-[200px] overflow-y-auto">
                                    {chatbot.systemPrompt}
                                </div>
                            </CardContent>
                        )}
                    </Card>

                    {/* Configuration */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Configuration</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 bg-gray-900 py-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-200">Tone</span>
                                <span className="text-orange-500 px-2  rounded-full capitalize">{chatbot.tone}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-200">Memory</span>
                                <span className="bg-green-500 px-2 text-white rounded-full">{chatbot.enableMemory ? 'Enabled' : 'Disabled'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-200">Guardrails</span>
                                <span className="text-blue-500 px-2 rounded-full">{chatbot.guardrails.filter(g => g.enabled).length} active</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Last Message Stats */}
                    {messages.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Last Response</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-200">Tokens Used</span>
                                    <span className="bg-gray-800 px-2 font-medium rounded-full text-gray-300">
                                        {messages[messages.length - 1]?.metadata?.tokensUsed || '-'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-200">Sources</span>
                                    <span className="bg-gray-800 px-2 font-medium rounded-full text-gray-300">
                                        {messages[messages.length - 1]?.metadata?.sources?.length || 0}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </motion.div>

            </div>
        </SidebarContainer>
    );
}