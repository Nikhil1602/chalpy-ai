import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from "@/components/layout/AppSidebar";

export default function SidebarContainer({ children }: Readonly<{ children: React.ReactNode }>) {

    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="flex-1 p-4">
                <SidebarTrigger />
                <div className="p-2 mt-10">
                    {children}
                </div>
            </main>
        </SidebarProvider>
    );

}