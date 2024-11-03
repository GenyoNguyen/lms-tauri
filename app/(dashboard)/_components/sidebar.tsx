"use client";

import React from 'react';
import { Logo } from "./logo";
import { SidebarRoutes } from "./sidebar-routes";

export const Sidebar = () => {
    return (
        <>
            <style jsx global>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                .sidebar-container {
                    animation: fadeIn 0.3s ease-out;
                }

                /* Custom scrollbar styles */
                .custom-scrollbar::-webkit-scrollbar {
                    width: 5px;
                }

                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e5e7eb;
                    border-radius: 20px;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #d1d5db;
                }

                /* Hover effect for logo container */
                .logo-container {
                    position: relative;
                    isolation: isolate;
                }

                .logo-container::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(to right, transparent, #f3f4f6, transparent);
                    opacity: 0;
                    z-index: -1;
                    transition: opacity 0.3s ease;
                }

                .logo-container:hover::after {
                    opacity: 1;
                }
            `}</style>

            <div className="sidebar-container h-full flex flex-col bg-white border-r border-gray-100 shadow-sm transition-all duration-300 ease-in-out hover:shadow-md">
                {/* Logo section */}
                <div className="logo-container p-6 border-b border-gray-100 transition-transform duration-300 hover:scale-[1.02]">
                    <Logo />
                </div>

                {/* Routes section */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="py-2">
                        <SidebarRoutes />
                    </div>
                </div>

                {/* Gradient overlay */}
                <div 
                    className="h-8 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none absolute bottom-0 left-0 right-0 z-10" 
                    style={{
                        maskImage: 'linear-gradient(to top, white, transparent)'
                    }}
                />
            </div>
        </>
    );
};