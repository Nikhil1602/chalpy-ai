import { motion } from 'motion/react';
import { Bot, MessageCircle, MessageSquare, MoreVertical, Play, Settings } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from "next/link";

export interface GuardrailRule {
    id: string;
    name: string;
    description: string;
    enabled: boolean;
}

export interface Chatbot {
    id: string;
    name: string;
    description: string;
    avatar?: string;
    systemPrompt: string;
    tone: 'professional' | 'friendly' | 'casual' | 'formal';
    role: string;
    enableMemory: boolean;
    guardrails: GuardrailRule[];
    createdAt: Date;
    updatedAt: Date;
    status: 'draft' | 'active' | 'paused';
    workspaceId: string;
}

interface ChatbotCardProps {
    chatbot: Chatbot;
    index: number;
}

export function ChatbotCard({ chatbot, index }: ChatbotCardProps) {

    const statusColors = {
        active: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        draft: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
        paused: 'bg-muted text-muted-foreground border-border',
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.1 }}>
            <Card className="group">
                <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center group-hover:shadow-glow transition-shadow">
                                <Bot className="w-6 h-6 text-orange-500" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground group-hover:text-orange-500 transition-colors">
                                    {chatbot.name}
                                </h3>
                                <p className="text-sm text-gray-500">{chatbot.role}</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="cursor-pointer bg-orange-500/20 hover:bg-orange-500/50 ">
                            <MoreVertical className="w-4 h-4" />
                        </Button>
                    </div>

                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                        {chatbot.description}
                    </p>

                    <div className="flex items-center gap-2 mb-4">
                        <Badge variant="outline" className={cn('capitalize', statusColors[chatbot.status])}>
                            {chatbot.status}
                        </Badge>
                        <Badge variant="outline" className={cn('capitalize border-orange-500', chatbot.tone === 'professional' ? 'border-blue-500' : chatbot.tone === 'friendly' ? 'border-green-500' : chatbot.tone === 'casual' ? 'border-yellow-500' : 'border-red-500')}>
                            {chatbot.tone}
                        </Badge>
                        {chatbot.enableMemory && <Badge className='border-orange-500' variant="outline">Memory</Badge>}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <MessageCircle className="w-4 h-4" />
                            <span>1.2k conversations</span>
                        </div>
                        <div className="flex gap-2">
                            <Link href={`/chatbots/${chatbot.id}/playground`}>
                                <Button className='cursor-pointer bg-orange-500 hover:bg-orange-600' variant="ghost" size="sm">
                                    <Play className="w-4 h-4 mr-1" />
                                    Test
                                </Button>
                            </Link>
                            <Link href={`/chatbots/${chatbot.id}`}>
                                <Button className='cursor-pointer bg-gray-700 hover:bg-gray-800' variant="ghost" size="sm">
                                    <Settings className="w-4 h-4 mr-1" />
                                    Edit
                                </Button>
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}