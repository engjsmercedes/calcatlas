import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  prefix?: string;
}

export function InputField({ label, hint, prefix, className, ...props }: InputFieldProps) {
  return (
    <label className="block space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-slate-900 dark:text-white">{label}</span>
        {hint ? <span className="text-xs text-muted">{hint}</span> : null}
      </div>
      {prefix ? (
        <div className="flex h-12 overflow-hidden rounded-2xl border border-border bg-white/90 shadow-sm transition focus-within:border-accent focus-within:bg-white dark:bg-slate-950/40 dark:focus-within:bg-slate-950/60">
          <span className="inline-flex w-14 items-center justify-center border-r border-border bg-slate-50 text-sm font-medium text-muted dark:bg-slate-900/50">
            {prefix}
          </span>
          <input
            className={cn(
              "h-full w-full border-0 bg-transparent px-4 text-sm outline-none ring-0 placeholder:text-slate-400",
              className
            )}
            inputMode="decimal"
            {...props}
          />
        </div>
      ) : (
        <input
          className={cn("input-base", className)}
          inputMode="decimal"
          {...props}
        />
      )}
    </label>
  );
}
