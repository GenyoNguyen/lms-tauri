"use client";

import React from 'react';
import { BarChart, BotMessageSquare, Compass, Layout, List, BookUser, Presentation} from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { usePathname } from "next/navigation";
import './sidebar.css'; // Import CSS

const guestRoutes = [
    {
        icon: Layout,
        label: "Dashboard",
        href: "/"
    },
    {
        icon: Compass,
        label: "Browse",
        href: '/search'
    },
    {
        icon: BotMessageSquare,
        label: "Chatbot",
        href: "/chatbot"
    },
    {
        icon: BookUser,
        label: "Instruction",
        href: "/instruction"
    },
    {
        icon: Presentation,
        label: "WhiteBoard",
        href: "/board"
    }, 
    {
        icon: List,
        label: "PDF",
        href: "/pdf"
    }

];

const teacherRoutes = [
    {
        icon: List,
        label: "Courses",
        href: "/teacher/courses"
    },
    {
        icon: BarChart,
        label: "Analytics",
        href: "/teacher/analytics"
    },
];

export const SidebarRoutes = ({ isDark }: { isDark: boolean }) => { // Thêm isDark vào prop
    const pathname = usePathname();
    const isTeacherPage = pathname?.includes("teacher");
    const routes = isTeacherPage ? teacherRoutes : guestRoutes;

    return (
        <div className="flex flex-col w-full space-y-2">
            {routes.map((route, index) => (
                <div
                    key={route.href}
                    className="route-item"
                    style={{
                        animationDelay: `${index * 0.1}s`
                    }}
                >
                    <SidebarItem
                        icon={route.icon}
                        label={route.label}
                        href={route.href}
                        isDark={isDark} // Truyền isDark xuống SidebarItem
                    />
                </div>
            ))}
        </div>
    );
};
