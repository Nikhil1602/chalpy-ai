"use client"

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Settings, LayoutDashboard, Bot, History, PencilRuler, BookOpenText } from "lucide-react";
import { Separator } from '@/components/ui/separator';
import { usePathname } from 'next/navigation';
import Link from "next/link";
import Image from 'next/image';

export default function AppSidebar() {

    const pathname = usePathname();

    const menuItems = [
        { id: 'menu-item-1', title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { id: 'menu-item-2', title: "Chatbot", href: "/chatbot", icon: Bot },
        { id: 'menu-item-3', title: "Knowledge Base", href: "/knowledge-base", icon: BookOpenText },
        { id: 'menu-item-4', title: "History", href: "/history", icon: History },
        { id: 'menu-item-5', title: "Customization", href: "/customization", icon: PencilRuler },
        { id: 'menu-item-6', title: "Settings", href: "/settings", icon: Settings },
    ];

    return (
        <Sidebar collapsible='icon' className="group">
            <SidebarContent>

                <div className="p-2 py-5 rounded-lg flex items-center transition-all">
                    <div className='bg-orange-500/10 w-full rounded-lg flex gap-4 items-center p-2'>
                        <Image src="/logo.png" alt="Chalpy AI Logo" width={30} height={30} />
                        <span className="text-orange-500 font-medium text-sm group-data-[collapsible=icon]:hidden truncate">
                            Chalpy AI
                        </span>
                    </div>
                </div>

                <Separator className="bg-gray-800" />

                {/* Navigation Group */}
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>

                    <SidebarGroupContent>
                        <SidebarMenu>

                            {menuItems.map((item) => {

                                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

                                return (
                                    <SidebarMenuItem key={item.id} data-active={isActive}>
                                        <SidebarMenuButton asChild tooltip={item.title} isActive={isActive}
                                            className="
                                                data-[active=true]:bg-orange-500/10
                                                data-[active=true]:text-orange-500
                                                transition-colors
                                            "
                                        >
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