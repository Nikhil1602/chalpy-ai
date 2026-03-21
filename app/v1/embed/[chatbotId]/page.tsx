"use client";

import { ChatWidget } from "@/components/chatbot/ChatWidget";
import { isValidColor } from "@/lib/constants";
import { useWorkspace } from "@/store/WorkspaceContext";
import { useParams, useSearchParams } from "next/navigation";

export default function EmbedPage() {

    const { chatbotId } = useParams();
    const { currentWorkspace } = useWorkspace();
    const searchParams = useSearchParams();

    const bg = searchParams.get("bg");
    const safeBg = isValidColor(bg) ? bg : "transparent"

    return (
        <div id={`embed-widget-container-${chatbotId}`} style={{ height: "100vh", width: "100%", background: safeBg ?? "transparent" }}>
            <ChatWidget chatbotId={chatbotId as string} workspaceId={currentWorkspace?.id as string ?? ""} />
        </div>
    );
}