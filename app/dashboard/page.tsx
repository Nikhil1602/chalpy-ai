"use client"

import { MetricChart } from "@/components/charts/MetricChart";
import { StatCard } from "@/components/charts/StatCard";
import { ChatbotCard } from "@/components/chatbot/ChatbotCard";
import { PageHeader } from "@/components/layout/PageHeader";
import SidebarContainer from "@/components/navigation/SidebarContainer";
import { Button } from "@/components/ui/button";
import { Plus, Bot, MessageSquare, Users, TrendingUp } from "lucide-react";
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

const Dashboard = () => {

    const chatbots: Chatbot[] = [
        {
            id: 'bot-1',
            name: 'Customer Support',
            description: 'Handles customer inquiries 24/7',
            systemPrompt: 'You are a helpful customer support agent...',
            tone: 'professional',
            role: 'Support Agent',
            enableMemory: true,
            guardrails: [
                { id: 'g1', name: 'No harmful content', description: 'Prevents harmful responses', enabled: true },
                { id: 'g2', name: 'Stay on topic', description: 'Keeps conversations focused', enabled: true },
            ],
            createdAt: new Date('2024-01-15'),
            updatedAt: new Date('2024-02-01'),
            status: 'active',
            workspaceId: 'workspace-1',
        },
        {
            id: 'bot-2',
            name: 'Sales Assistant',
            description: 'Helps qualify leads and answer product questions',
            systemPrompt: 'You are a knowledgeable sales assistant...',
            tone: 'friendly',
            role: 'Sales Rep',
            enableMemory: true,
            guardrails: [],
            createdAt: new Date('2024-01-20'),
            updatedAt: new Date('2024-01-25'),
            status: 'draft',
            workspaceId: 'workspace-1',
        },
    ];

    const mockChartData = [
        { date: 'Mon', value: 120 },
        { date: 'Tue', value: 180 },
        { date: 'Wed', value: 150 },
        { date: 'Thu', value: 220 },
        { date: 'Fri', value: 280 },
        { date: 'Sat', value: 200 },
        { date: 'Sun', value: 160 },
    ];

    return (
        <SidebarContainer>
            <PageHeader
                title="Dashboard"
                description="Overview of your chatbot performance"
            >
                <Link href="/chatbots/new">
                    <Button className="bg-orange-500 text-white cursor-pointer hover:bg-orange-600">
                        <Plus className="w-4 h-4 mr-2" />
                        New Chatbot
                    </Button>
                </Link>
            </PageHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Chatbots"
                    value={chatbots.length}
                    change="+2 this month"
                    changeType="positive"
                    icon={Bot}
                    index={0}
                />
                <StatCard
                    title="Total Messages"
                    value="12.4k"
                    change="+18% from last week"
                    changeType="positive"
                    icon={MessageSquare}
                    index={1}
                />
                <StatCard
                    title="Active Users"
                    value="843"
                    change="+5% from last week"
                    changeType="positive"
                    icon={Users}
                    index={2}
                />
                <StatCard
                    title="Response Rate"
                    value="94%"
                    change="-2% from last week"
                    changeType="negative"
                    icon={TrendingUp}
                    index={3}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <MetricChart
                    title="Messages This Week"
                    data={mockChartData}
                    type="area"
                />
                <MetricChart
                    title="Conversations by Day"
                    data={mockChartData.map(d => ({ ...d, value: Math.floor(d.value / 3) }))}
                    type="bar"
                />
            </div>

            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-foreground">Your Chatbots</h2>
                    <Link href="/chatbots">
                        <Button className="cursor-pointer text-white hover:underline hover:text-orange-600" size="sm">
                            View all
                        </Button>
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {chatbots.slice(0, 4).map((chatbot, index) => (
                        <ChatbotCard key={chatbot.id} chatbot={chatbot} index={index} />
                    ))}
                </div>
            </div>
        </SidebarContainer>
    );

}

export default Dashboard