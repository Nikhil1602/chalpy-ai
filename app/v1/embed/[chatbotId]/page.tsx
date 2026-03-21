"use client";

import { ChatWidget } from "@/components/chatbot/ChatWidget";
import { useWorkspace } from "@/store/WorkspaceContext";
import { useParams, useSearchParams } from "next/navigation";

export default function EmbedPage() {

    const { chatbotId } = useParams();
    const { currentWorkspace } = useWorkspace();
    const searchParams = useSearchParams();

    const bg = searchParams.get("bg");

    return (
        <div id={`embed-widget-container-${chatbotId}`} style={{ height: "100vh", width: "100%", background: bg ?? "transparent" }}>
            <ChatWidget chatbotId={chatbotId as string} workspaceId={currentWorkspace?.id as string ?? ""} />
        </div>
    );
}