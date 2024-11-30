// DashboardLayout.tsx
"use client";
import "./layout.css";
import { cn } from "@/lib/utils";
import { Navbar } from "./_components/navbar";
import { Sidebar } from "./_components/sidebar";
import { useState } from "react";
import { ThemeContext } from "./ThemeContext"; 
import MusicPlayer from "./music"; // Import MusicPlayer

const DashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isDark, setIsDark] = useState(false);

  const toggleDarkMode = () => setIsDark(!isDark);

  return (
    <ThemeContext.Provider value={{ isDark, toggleDarkMode }}>
      <div
        className={cn(
          "h-full",
          isDark ? "bg-gray-900 text-white" : "bg-white text-black"
        )}
      >
        {/* Navbar */}
        <div className="h-[80px] md:pl-56 fixed inset-y-0 w-full z-50">
          <Navbar isDark={isDark} />
        </div>

        {/* Sidebar */}
        <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
          <Sidebar isDark={isDark} />

          {/* Dark Mode Toggle */}
          <label
            htmlFor="theme"
            className="theme absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50"
          >
            <span className="theme__toggle-wrap">
              <input
                id="theme"
                className="theme__toggle"
                type="checkbox"
                role="switch"
                name="theme"
                checked={isDark}
                onChange={toggleDarkMode}
              />
              <span className="theme__fill"></span>
              <span className="theme__icon">
                {/* ...icon parts... */}
              </span>
            </span>
          </label>
        </div>

        {/* Music Player */}
        <MusicPlayer /> {/* Add the MusicPlayer component here */}

        {/* Main Content */}
        <main
          className={cn(
            "md:pl-56 pt-[80px] h-full",
            isDark && "bg-blue-1050 text-white"
          )}
        >
          {children}
        </main>
      </div>
    </ThemeContext.Provider>
  );
};

export default DashboardLayout;
