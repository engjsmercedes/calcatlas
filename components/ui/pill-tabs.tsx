"use client";

import { cn } from "@/lib/utils";

export function PillTabs<T extends string>({
  options,
  value,
  onChange
}: {
  options: Array<{ label: string; value: T }>;
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="inline-flex rounded-full border border-border bg-white/80 p-1 dark:bg-slate-950/30">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={cn(
            "rounded-full px-4 py-2 text-sm font-semibold transition",
            value === option.value ? "bg-accent text-white dark:text-slate-950" : "text-muted hover:text-accent"
          )}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
