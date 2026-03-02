"use client"

import { ChatbotCard } from '@/components/chatbot/ChatbotCard';
import { PageHeader } from '@/components/layout/PageHeader';
import SidebarContainer from '@/components/layout/SidebarContainer';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { useWorkspace } from '@/store/WorkspaceContext';
import { Bot, Plus } from 'lucide-react';
import Link from 'next/link';

const Chatbot = () => {

    const { chatbots, deleteChatbot } = useWorkspace();

    return (
        <SidebarContainer>

            <PageHeader title="Chatbots" description="Manage and configure your AI chatbots">
                <Link href="/chatbot/new">
                    <Button className="bg-orange-500 text-white cursor-pointer hover:bg-orange-600">
                        <Plus className="w-4 h-4 mr-2" />
                        New Chatbot
                    </Button>
                </Link>
            </PageHeader>

            {chatbots.length === 0 ? (
                <EmptyState icon={Bot} title="No chatbots yet" description="Create your first chatbot to start engaging with your users through intelligent conversations."
                    action={
                        <Link href="/chatbot/new">
                            <Button className="bg-orange-500 text-white cursor-pointer hover:bg-orange-600">
                                <Plus className="w-4 h-4 mr-2" />
                                Create Chatbot
                            </Button>
                        </Link>
                    }
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {chatbots.map((chatbot, index) => (
                        <ChatbotCard deleteChatbot={deleteChatbot} key={chatbot.id} chatbot={chatbot} index={index} />
                    ))}
                </div>
            )}

        </SidebarContainer>
    );

}

export default Chatbot