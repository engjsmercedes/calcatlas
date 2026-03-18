export type AdSlotPlaceholderProps = {
  label?: string;
  format?: string;
  className?: string;
};

export function AdSlotPlaceholder({
  label = "Ad placement",
  format = "Responsive display slot",
  className = ""
}: AdSlotPlaceholderProps) {
  return (
    <aside
      aria-label={label}
      className={`surface border-dashed border-accent/20 bg-accent-soft/40 p-5 ${className}`.trim()}
    >
      <div className="space-y-2 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">{label}</p>
        <p className="text-sm font-medium text-slate-900 dark:text-white">{format}</p>
        <p className="mx-auto max-w-2xl text-xs leading-6 text-muted">
          Reserved space for a future Google Ads unit. Keeping the slot in the layout now reduces future page-shift when ads are enabled.
        </p>
      </div>
    </aside>
  );
}
