"use client";

import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "button-base disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" && "bg-accent text-white hover:bg-cyan-700 dark:text-slate-950",
        variant === "secondary" && "border border-border bg-panel text-text hover:border-accent hover:text-accent",
        variant === "ghost" && "text-muted hover:text-accent",
        className
      )}
      {...props}
    />
  );
}
