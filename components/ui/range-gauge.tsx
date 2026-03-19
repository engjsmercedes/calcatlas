import { formatNumber } from "@/lib/utils";

interface RangeGaugeSegment {
  label: string;
  displayLabel?: string;
  max: number;
  color: string;
}

export function RangeGauge({
  value,
  min,
  max,
  title,
  segments,
  centerLabel,
  unitLabel
}: {
  value: number;
  min: number;
  max: number;
  title?: string;
  segments: RangeGaugeSegment[];
  centerLabel: string;
  unitLabel?: string;
}) {
  const clamped = Math.min(Math.max(value, min), max);
  const position = ((clamped - min) / Math.max(max - min, 1)) * 100;
  let previousMax = min;

  return (
    <div className="surface p-5 md:p-6">
      {title ? <p className="section-label mb-4">{title}</p> : null}
      <div className="space-y-5">
        <div className="text-center">
          <div className="text-5xl font-semibold tracking-tight text-slate-950 dark:text-white">{centerLabel}</div>
          {unitLabel ? <p className="mt-2 text-sm text-muted">{unitLabel}</p> : null}
        </div>
        <div className="relative px-1 pt-12">
          <div className="absolute top-0 -translate-x-1/2" style={{ left: `${position}%` }}>
            <div className="rounded-2xl border border-border bg-white px-3 py-2 text-sm font-semibold shadow-card dark:bg-slate-950">
              {centerLabel}
            </div>
            <div className="mx-auto -mt-2 h-4 w-4 rotate-45 border-b border-r border-border bg-white dark:bg-slate-950" />
          </div>
          <div className="overflow-hidden rounded-full border border-border bg-slate-100 dark:bg-slate-900">
            <div className="flex h-14">
              {segments.map((segment) => {
                const start = previousMax;
                const width = ((segment.max - start) / Math.max(max - min, 1)) * 100;
                previousMax = segment.max;
                return (
                  <div
                    key={segment.label}
                    aria-hidden="true"
                    style={{
                      width: `${width}%`,
                      backgroundColor: segment.color
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-muted">
          <span>{formatNumber(min)}</span>
          <span>{formatNumber(max)}</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs text-muted">
          {segments.map((segment) => (
            <div key={segment.label} className="flex items-center justify-center gap-2 rounded-full border border-border px-3 py-2 text-center">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: segment.color }} />
              <span>{segment.displayLabel ?? segment.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
