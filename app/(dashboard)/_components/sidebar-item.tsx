"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface SidebarItemProps {
    icon: LucideIcon;
    label: string;
    href: string;
}

export const SidebarItem = ({
    icon: Icon,
    label,
    href
}: SidebarItemProps) => {
    const pathname = usePathname();
    const router = useRouter();

    const isActive =
        (pathname === "/" && href === "/") ||
        pathname === href ||
        pathname?.startsWith(`${href}/`);

    const onClick = () => {
        router.push(href);
    }

    return (
        <>
            <style jsx global>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                .sidebar-item {
                    animation: slideIn 0.3s ease-out;
                    position: relative;
                    isolation: isolate;
                }

                .sidebar-item::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(to right, #0ea5e9, #38bdf8);
                    opacity: 0;
                    z-index: -1;
                    transition: opacity 0.3s ease;
                }

                .sidebar-item:hover::before {
                    opacity: 0.08;
                }

                .sidebar-item .icon {
                    transition: transform 0.3s ease;
                }

                .sidebar-item:hover .icon {
                    transform: scale(1.1);
                }

                .sidebar-item .label {
                    transition: transform 0.3s ease;
                }

                .sidebar-item:hover .label {
                    transform: translateX(4px);
                }

                .active-indicator {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .sidebar-item:hover .active-indicator {
                    transform: scaleY(0.7);
                }

                @keyframes pulseActive {
                    0% { opacity: 0.8; }
                    50% { opacity: 1; }
                    100% { opacity: 0.8; }
                }

                .active-pulse {
                    animation: pulseActive 2s ease-in-out infinite;
                }
            `}</style>

            <button
                onClick={onClick}
                type="button"
                className={cn(
                    "sidebar-item w-full flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 pr-3",
                    "transition-all duration-300",
                    "hover:text-slate-600",
                    isActive && "text-sky-700 hover:text-sky-700"
                )}
            >
                <div className="flex items-center gap-x-2 py-4 relative">
                    <Icon
                        size={22}
                        className={cn(
                            "icon text-slate-500 transition-colors duration-300",
                            isActive && "text-sky-700"
                        )}
                    />
                    <span className="label whitespace-nowrap">
                        {label}
                    </span>
                    
                    {isActive && (
                        <span className="absolute -left-2 -right-2 top-0 bottom-0 bg-sky-50/50 rounded-sm -z-10" />
                    )}
                </div>

                {/* Active indicator */}
                <div className={cn(
                    "active-indicator ml-auto w-[3px] h-12 rounded-l-full",
                    isActive ? "bg-gradient-to-b from-sky-600 to-sky-400 active-pulse" : "opacity-0",
                )}>
                </div>
            </button>
        </>
    )
}