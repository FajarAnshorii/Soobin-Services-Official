"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Home, User, Briefcase, FileText, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export const Component = () => {
  const [count, setCount] = useState(0);

  return (
    <div className={cn("flex flex-col items-center gap-4 p-4 rounded-lg")}>
      <h1 className="text-2xl font-bold mb-2">Component Example</h1>
      <h2 className="text-xl font-semibold">{count}</h2>
      <div className="flex gap-2">
        <button onClick={() => setCount((prev) => prev - 1)}>-</button>
        <button onClick={() => setCount((prev) => prev + 1)}>+</button>
      </div>
    </div>
  );
};

export interface NavItem {
  name: string;
  url: string;
  icon: React.ElementType;
}

export interface GlassmorphismNavBarProps {
  items?: NavItem[];
  className?: string;
  defaultTheme?: "light" | "dark";
  onThemeChange?: (theme: "light" | "dark") => void;
}

export function GlassmorphismNavBar({
  items = [
    { name: "Home", url: "#", icon: Home },
    { name: "About", url: "#", icon: User },
    { name: "Projects", url: "#", icon: Briefcase },
    { name: "Resume", url: "#", icon: FileText },
  ],
  className,
  defaultTheme = "light",
  onThemeChange,
}: GlassmorphismNavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0]?.name || "Home");
  const [theme, setTheme] = useState<"light" | "dark">(defaultTheme);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (typeof document !== "undefined") {
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    onThemeChange?.(newTheme);
  };

  return (
    <div
      className={cn(
        "fixed bottom-0 sm:top-0 left-1/2 -translate-x-1/2 z-50 mb-6 sm:pt-6",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center gap-3 py-1 px-1 rounded-full shadow-lg transition-all duration-300",
          theme === "dark"
            ? "bg-black/60 border border-white/10 backdrop-blur-xl"
            : "bg-white/80 border border-black/5 backdrop-blur-xl"
        )}
        style={{
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
        }}
      >
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;

          return (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={cn(
                "relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-all duration-300",
                theme === "dark"
                  ? "text-white/70 hover:text-white"
                  : "text-slate-700 hover:text-slate-900",
                isActive &&
                  (theme === "dark"
                    ? "bg-white/10 text-white"
                    : "bg-black/5 text-primary-800")
              )}
            >
              <span className="hidden md:inline">{item.name}</span>
              <span className="md:hidden">
                <Icon size={18} strokeWidth={2.5} />
              </span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className={cn(
                    "absolute inset-0 w-full rounded-full -z-10",
                    theme === "dark" ? "bg-primary-500/10" : "bg-primary-500/5"
                  )}
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div
                    className={cn(
                      "absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 rounded-t-full",
                      theme === "dark" ? "bg-primary-400" : "bg-primary-700"
                    )}
                  >
                    <div
                      className={cn(
                        "absolute w-12 h-6 rounded-full blur-md -top-2 -left-2",
                        theme === "dark" ? "bg-primary-400/30" : "bg-primary-600/20"
                      )}
                    />
                    <div
                      className={cn(
                        "absolute w-8 h-6 rounded-full blur-md -top-1",
                        theme === "dark" ? "bg-primary-400/30" : "bg-primary-600/20"
                      )}
                    />
                    <div
                      className={cn(
                        "absolute w-4 h-4 rounded-full blur-xs top-0 left-2",
                        theme === "dark" ? "bg-primary-400/30" : "bg-primary-600/20"
                      )}
                    />
                  </div>
                </motion.div>
              )}
            </button>
          );
        })}

        <div className="w-px h-6 bg-slate-200 dark:bg-white/10 mx-1" />

        <button
          onClick={toggleTheme}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={cn(
            "relative cursor-pointer p-2 rounded-full transition-all duration-300",
            theme === "dark"
              ? "text-white/70 hover:text-white hover:bg-white/10"
              : "text-slate-700 hover:text-primary-800 hover:bg-black/5"
          )}
          aria-label={
            theme === "light" ? "Switch to dark mode" : "Switch to light mode"
          }
        >
          <motion.div
            initial={false}
            animate={{
              scale: isHovered ? 1.1 : 1,
              rotate: theme === "dark" ? 180 : 0,
            }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
            }}
          >
            {theme === "light" ? (
              <Moon size={18} strokeWidth={2.5} />
            ) : (
              <Sun size={18} strokeWidth={2.5} />
            )}
          </motion.div>
        </button>
      </div>
    </div>
  );
}
