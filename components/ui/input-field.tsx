import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  prefix?: string;
  tooltip?: string;
  highlighted?: boolean;
}

function FieldLabel({ label, hint, tooltip }: { label: string; hint?: string; tooltip?: string }) {
  const tooltipText = tooltip ?? `Enter ${label.toLowerCase()}${hint ? `. ${hint}` : ""}`;

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-slate-900 dark:text-white">{label}</span>
        <span
          className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-border text-[11px] font-semibold text-muted"
          title={tooltipText}
          aria-label={tooltipText}
        >
          ?
        </span>
      </div>
      {hint ? <span className="text-xs text-muted">{hint}</span> : null}
    </div>
  );
}

export function InputField({ label, hint, prefix, tooltip, highlighted, className, ...props }: InputFieldProps) {
  const inputClassName = cn(
    "input-base",
    highlighted ? "border-accent bg-accent-soft/60 ring-1 ring-accent/25" : undefined,
    className
  );

  return (
    <label className="block space-y-2">
      <FieldLabel label={label} hint={hint} tooltip={tooltip} />
      {prefix ? (
        <div
          className={cn(
            "flex h-12 overflow-hidden rounded-2xl border border-border bg-white/90 shadow-sm transition focus-within:border-accent focus-within:bg-white dark:bg-slate-950/40 dark:focus-within:bg-slate-950/60",
            highlighted ? "border-accent bg-accent-soft/60 ring-1 ring-accent/25 focus-within:bg-accent-soft/70 dark:bg-accent-soft/20" : undefined
          )}
        >
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
          className={inputClassName}
          inputMode="decimal"
          {...props}
        />
      )}
    </label>
  );
}
