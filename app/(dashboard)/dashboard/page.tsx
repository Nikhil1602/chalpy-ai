"use client"

import { MetricChart, StatCard } from "@/components/charts";
import { ChatbotCard } from "@/components/chatbot/ChatbotCard";
import { PageHeader } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Plus, Bot, MessageSquare, Users, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { useWorkspace } from "@/store/WorkspaceContext";
import SidebarContainer from "@/components/layout/SidebarContainer";
import Link from "next/link";

const Dashboard = () => {

    const { chatbots, deleteChatbot } = useWorkspace();

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

            <PageHeader title="Dashboard" description="Overview of your chatbot performance">
                <Link href="/chatbot/new">
                    <Button className="bg-orange-500 text-white cursor-pointer hover:bg-orange-600">
                        <Plus className="w-4 h-4 mr-2" />
                        New Chatbot
                    </Button>
                </Link>
            </PageHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Chatbots" value={chatbots.length} change="+2 this month" changeType="positive" icon={Bot} index={0} />
                <StatCard title="Total Messages" value="12.4k" change="+18% from last week" changeType="positive" icon={MessageSquare} index={1} />
                <StatCard title="Active Users" value="843" change="+5% from last week" changeType="positive" icon={Users} index={2} />
                <StatCard title="Response Rate" value="94%" change="-2% from last week" changeType="negative" icon={TrendingUp} index={3} />
            </div>

            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <MetricChart title="Messages This Week" data={mockChartData} type="area" />
                <MetricChart title="Conversations by Day" data={mockChartData.map(d => ({ ...d, value: Math.floor(d.value / 3) }))} type="bar" />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-foreground">Your Chatbots</h2>
                    <Link href="/chatbot">
                        <Button className="cursor-pointer text-white hover:underline hover:text-orange-600" size="sm">
                            View all
                        </Button>
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {chatbots.slice(0, 4).map((chatbot, index) => (
                        <ChatbotCard deleteChatbot={deleteChatbot} key={chatbot.id} chatbot={chatbot} index={index} />
                    ))}
                </div>
            </motion.div>

        </SidebarContainer>
    );

}

export default Dashboard