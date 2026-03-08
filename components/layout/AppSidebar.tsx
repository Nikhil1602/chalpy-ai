"use client"

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Settings, LayoutDashboard, Bot, ShieldCheck, BookOpen } from "lucide-react";
import { Separator } from '@/components/ui/separator';
import { usePathname } from 'next/navigation';
import Link from "next/link";
import Image from 'next/image';
import { useWorkspace } from "@/store/WorkspaceContext";

export default function AppSidebar() {

    const pathname = usePathname();
    const { currentWorkspace } = useWorkspace();

    const menuItems = [
        { id: 'menu-item-1', title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { id: 'menu-item-2', title: "Chatbot", href: "/chatbot", icon: Bot },
        { id: 'menu-item-3', title: "Guardrails", href: "/guardrails", icon: ShieldCheck },
        { id: 'menu-item-4', title: "Knowledge Base", href: "/knowledge-base", icon: BookOpen },
        { id: 'menu-item-5', title: "Settings", href: "/settings", icon: Settings },
    ];

    return (
        <Sidebar collapsible='icon' className="group">
            <SidebarContent>

                <div className="p-2 py-5 flex items-center transition-all">
                    <div className='w-full flex gap-4 items-center'>
                        <Image src="/logo.png" alt="Chalpy AI Logo" width={30} height={30} />
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