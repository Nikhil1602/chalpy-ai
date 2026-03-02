import { SidebarProvider, SidebarTrigger } from "../ui/sidebar"
import AppSidebar from "./AppSidebar";

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