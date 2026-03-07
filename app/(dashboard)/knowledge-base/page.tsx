"use client"

import { PageHeader } from '@/components/layout/PageHeader';
import SidebarContainer from '@/components/layout/SidebarContainer';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const KnowledgeBase = () => {
    return (
        <SidebarContainer>
            <PageHeader title="Knowledge Base" description="Manage documents and content for your chatbots">
                <Button className="bg-orange-500 text-white cursor-pointer hover:bg-orange-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Upload Document
                </Button>
            </PageHeader>
        </SidebarContainer>
    )
}

export default KnowledgeBase