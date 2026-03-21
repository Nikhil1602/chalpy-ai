"use client"

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Separator } from '@/components/ui/separator';
import { usePathname } from 'next/navigation';
import Link from "next/link";
import { useWorkspace } from "@/store/WorkspaceContext";
import { menuItems } from "@/lib/constants";

export default function AppSidebar() {

    const pathname = usePathname();
    const { currentWorkspace } = useWorkspace();

    return (
        <Sidebar collapsible='icon' className="group">
            <SidebarContent>

                <div className="p-2 py-5 flex items-center transition-all">
                    <div className='w-full flex gap-4 items-center'>
                        <img src="/logo.png" alt="Chalpy AI Logo" width={30} height={30} />
                        <span className="text-orange-500 font-medium text-sm group-data-[collapsible=icon]:hidden truncate">
                            Chalpy AI
                        </span>
                    </div>
                </div>

                <Separator className="bg-gray-800" />

                <div className="my-1">
                    <div className="text-xs text-gray-500 ml-4">Workspace</div>
                    <div className="text-sm text-gray-300 ml-4 mt-1">{currentWorkspace?.name}</div>
                </div>

                <Separator className="bg-gray-800" />

                {/* Navigation Group */}
                <SidebarGroup>

                    <SidebarGroupLabel className="text-gray-500">Navigation</SidebarGroupLabel>

                    <SidebarGroupContent>
                        <SidebarMenu>

                            {menuItems.map((item) => {

                                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

                                return (
                                    <SidebarMenuItem key={item.id} data-active={isActive}>
                                        <SidebarMenuButton asChild tooltip={item.title} isActive={isActive} className="data-[active=true]:bg-orange-500/10 data-[active=true]:text-orange-500 transition-colors">
                                            <Link href={item.href}>
                                                <item.icon className="w-4 h-4" />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}

                        </SidebarMenu>
                    </SidebarGroupContent>

                </SidebarGroup>

            </SidebarContent>
        </Sidebar>
    );

}