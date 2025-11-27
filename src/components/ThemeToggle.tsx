"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as "light" | "dark" | null;
    if (stored) {
      setTheme(stored);
      document.documentElement.classList.toggle("dark", stored === "dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
      document.documentElement.classList.toggle("dark", prefersDark);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  };

  return (
    <div className="fixed top-[100px] right-0 z-50 flex flex-col items-center gap-1">
      <button
        onClick={toggleTheme}
        className="w-10 h-20 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-l-full flex items-center justify-center rotate-90 hover:opacity-80 transition"
        aria-label="Toggle Theme"
      >
        {theme === "light" ? "🌞" : "🌙"}
      </button>
    </div>
  );
}
