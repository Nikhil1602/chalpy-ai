"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from 'react-toastify';
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <SessionProvider>
                {children}
                <ToastContainer />
            </SessionProvider>
        </QueryClientProvider>
    );
}
