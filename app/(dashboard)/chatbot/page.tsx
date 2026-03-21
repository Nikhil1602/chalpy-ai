"use client"

import { ChatbotCard } from '@/components/chatbot/ChatbotCard';
import { PageHeader } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { useWorkspace } from '@/store/WorkspaceContext';
import { Bot, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import SidebarContainer from '@/components/layout/SidebarContainer';
import Link from 'next/link';

const Chatbot = () => {

    const { chatbots, deleteChatbot, isChatbotsLoading, getAllChatbots } = useWorkspace();
    const router = useRouter();

    useEffect(() => {

        getAllChatbots();

    }, []);

    return (
        <SidebarContainer>

            <PageHeader title="Chatbots" description="Manage and configure your AI chatbots">
                <Button onClick={() => router.push("/chatbot/new")} disabled={isChatbotsLoading as boolean} className={`bg-orange-500 text-white ${isChatbotsLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-orange-600"}`}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Chatbot
                </Button>
            </PageHeader>

            {isChatbotsLoading
                ?
                <div className='flex flex-wrap gap-5 my-3'>
                    <Skeleton className='h-70 w-120 bg-gray-800' />
                    <Skeleton className='h-70 w-120 bg-gray-800' />
                    <Skeleton className='h-70 w-120 bg-gray-800' />
                </div>
                :
                <div>

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
                                <div key={chatbot.id}>
                                    <ChatbotCard deleteChatbot={deleteChatbot} chatbot={chatbot} index={index} />
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            }


        </SidebarContainer>
    );

}

export default Chatbot