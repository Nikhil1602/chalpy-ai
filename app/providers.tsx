"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from 'react-toastify';
import { useState } from "react";
import { WorkspaceProvider } from "@/store/WorkspaceContext";
import { AuthProvider } from "@/store/AuthContext";

export function Providers({ children }: { children: React.ReactNode }) {

    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <WorkspaceProvider>
                    <TooltipProvider>
                        <SessionProvider>
                            {children}
                            <ToastContainer />
                        </SessionProvider>
                    </TooltipProvider>
                </WorkspaceProvider>
            </AuthProvider>
        </QueryClientProvider>
    );

}
