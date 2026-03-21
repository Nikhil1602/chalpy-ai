"use client";

import { ChatWidget } from "@/components/chatbot/ChatWidget";
import { useWorkspace } from "@/store/WorkspaceContext";
import { useParams } from "next/navigation";

export default function EmbedPage() {

    const { chatbotId } = useParams();
    const { currentWorkspace } = useWorkspace();

    return (
        <div className={`embed-widget-container-${chatbotId}`} style={{ height: "100vh", width: "100%" }}>
            <ChatWidget chatbotId={chatbotId as string} workspaceId={currentWorkspace?.id as string ?? ""} />
        </div>
    );
}