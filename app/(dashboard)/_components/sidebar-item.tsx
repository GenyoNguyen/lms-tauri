"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface SidebarItemProps {
    icon: LucideIcon;
    label: string;
    href: string;
    isDark?: boolean; // Thêm isDark vào SidebarItemProps
}

export const SidebarItem = ({
    icon: Icon,
    label,
    href,
    isDark = false // Mặc định là false nếu không truyền vào
}: SidebarItemProps) => {
    const pathname = usePathname();
    const router = useRouter();

    const isActive =
        (pathname === "/" && href === "/") ||
        pathname === href ||
        pathname?.startsWith(`${href}/`);

    const onClick = () => {
        router.push(href);
    };

    return (
        <>
            <style jsx global>{`
                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(-10px); }
                    to { opacity: 1; transform: translateX(0); }
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
                    background: ${isDark ? 'linear-gradient(to right, #1e293b, #334155)' : 'linear-gradient(to right, #0ea5e9, #38bdf8)'};
                    opacity: 0;
                    z-index: -1;
                    transition: opacity 0.3s ease;
                }

                .sidebar-item:hover::before {
                    opacity: ${isDark ? 0.1 : 0.08};
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
                    "sidebar-item w-full flex items-center gap-x-2 text-sm font-[500] pl-6 pr-3",
                    "transition-all duration-300",
                    isDark ? "text-slate-400 hover:text-slate-300" : "text-slate-500 hover:text-slate-600",
                    isActive && (isDark ? "text-sky-400" : "text-sky-700")
                )}
            >
                <div className="flex items-center gap-x-2 py-4 relative">
                    <Icon
                        size={22}
                        className={cn(
                            "icon transition-colors duration-300",
                            isDark ? "text-slate-400" : "text-slate-500",
                            isActive && (isDark ? "text-sky-400" : "text-sky-700")
                        )}
                    />
                    <span className="label whitespace-nowrap">
                        {label}
                    </span>

                    {isActive && (
                        <span
                            className={`absolute -left-2 -right-2 top-0 bottom-0 rounded-sm -z-10 ${isDark ? "#060524" : "bg-sky-50/50"}`}
                        />
                    )}
                </div>

                {/* Active indicator */}
                <div
                    className={cn(
                        "active-indicator ml-auto w-[3px] h-12 rounded-l-full",
                        isActive ? `${isDark ? "bg-gradient-to-b from-sky-500 to-sky-400" : "bg-gradient-to-b from-sky-600 to-sky-400"} active-pulse` : "opacity-0"
                    )}
                />
            </button>
        </>
    );
}
