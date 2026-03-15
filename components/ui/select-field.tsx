import type { SelectHTMLAttributes } from "react";

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  hint?: string;
}

export function SelectField({ label, hint, children, ...props }: SelectFieldProps) {
  return (
    <label className="block space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-slate-900 dark:text-white">{label}</span>
        {hint ? <span className="text-xs text-muted">{hint}</span> : null}
      </div>
      <select className="input-base appearance-none" {...props}>
        {children}
      </select>
    </label>
  );
}
