"use client";

import React from 'react';
import { Logo } from "./logo";
import { SidebarRoutes } from "./sidebar-routes";

export const Sidebar = ({ isDark } : { isDark : boolean }) => {
    return (
        <>
            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .sidebar-container {
                    animation: fadeIn 0.3s ease-out;
                    background-color: ${isDark ? '#060524' : '#ffffff'}; /* Dark mode background */
                    border-color: ${isDark ? '#d1d5db' : '#e5e7eb'}; /* Dark mode border */
                    color: ${isDark ? '#f9fafb' : '#1f2937'}; /* Dark mode text */
                }

                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: ${isDark ? '#6b7280' : '#e5e7eb'};
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: ${isDark ? '#4b5563' : '#d1d5db'};
                }

                .logo-container::after {
                    background: ${isDark ? 'linear-gradient(to right, transparent, #1f2937, transparent)' : 'linear-gradient(to right, transparent, #f3f4f6, transparent)'};
                }
            `}</style>

            <div className={`sidebar-container h-full flex flex-col ${isDark ? 'shadow-md' : 'shadow-sm'}`}>
                <div className="logo-container p-6 border-b transition-transform duration-300 hover:scale-[1.02]">
                    <Logo isDark = {isDark}  />
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="py-2">
                        <SidebarRoutes isDark = {isDark}/>
                    </div>
                </div>

                <div 
                    className="h-8 pointer-events-none absolute bottom-0 left-0 right-0 z-10" 
                    style={{
                        background: isDark ? 'linear-gradient(to top, #1f2937, transparent)' : 'linear-gradient(to top, white, transparent)',
                        maskImage: 'linear-gradient(to top, white, transparent)'
                    }}
                />
            </div>
        </>
    );
};
