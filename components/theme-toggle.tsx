"use client";

import { useTheme } from "@/lib/hooks/use-theme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="button-base border border-border bg-panel text-sm text-text hover:border-accent hover:text-accent"
      aria-label="Toggle color theme"
    >
      {theme === "dark" ? "Light mode" : "Dark mode"}
    </button>
  );
}
