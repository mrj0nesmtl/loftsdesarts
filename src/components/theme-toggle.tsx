"use client";

import { useTheme } from "@/lib/theme-provider";
import { SunIcon, MoonIcon } from "@/components/icons";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
    </button>
  );
} 