import type { SelectHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  hint?: string;
  tooltip?: string;
  highlighted?: boolean;
}

export function SelectField({ label, hint, tooltip, highlighted, children, className, ...props }: SelectFieldProps) {
  const tooltipText = tooltip ?? `Select ${label.toLowerCase()}${hint ? `. ${hint}` : ""}`;

  return (
    <label className="block space-y-2">
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
      <select className={cn("input-base appearance-none", highlighted ? "border-accent bg-accent-soft/60 ring-1 ring-accent/25" : undefined, className)} {...props}>
        {children}
      </select>
    </label>
  );
}
