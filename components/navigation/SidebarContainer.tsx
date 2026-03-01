import { Separator } from "../ui/separator";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar"
import AppSidebar from "./AppSidebar";
import ThemeToggle from "./ThemeToggle"

export default function SidebarContainer({ children }: Readonly<{ children: React.ReactNode }>) {

    return (
        <SidebarProvider>
            <AppSidebar />
            {/* <ThemeToggle /> */}
            <main className="flex-1 p-4">
                <SidebarTrigger />
                {/* <Separator className="my-7 bg-gray-800" /> */}
                <div className="p-2 mt-10">
                    {children}
                </div>
            </main>
        </SidebarProvider>
    );

}