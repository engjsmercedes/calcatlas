import { formatNumber } from "@/lib/utils";

interface LineChartSeries {
  label: string;
  color: string;
  values: number[];
}

export function LineChart({
  labels,
  series
}: {
  labels: number[];
  series: LineChartSeries[];
}) {
  const width = 680;
  const height = 320;
  const padding = 32;
  const flattened = series.flatMap((item) => item.values);
  const maxValue = Math.max(...flattened, 1);

  const createPath = (values: number[]) =>
    values
      .map((value, index) => {
        const x = padding + (index / Math.max(values.length - 1, 1)) * (width - padding * 2);
        const y = height - padding - (value / maxValue) * (height - padding * 2);
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");

  return (
    <div className="surface overflow-hidden p-5">
      <div className="mb-4 flex flex-wrap items-center gap-4">
        {series.map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-sm text-muted">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            {item.label}
          </div>
        ))}
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
        {[0, 0.25, 0.5, 0.75, 1].map((stop) => {
          const y = height - padding - stop * (height - padding * 2);
          return (
            <g key={stop}>
              <line x1={padding} x2={width - padding} y1={y} y2={y} stroke="currentColor" className="text-slate-200 dark:text-slate-700" />
              <text x={6} y={y + 4} className="fill-slate-400 text-[11px]">
                {formatNumber(maxValue * stop)}
              </text>
            </g>
          );
        })}
        {labels.map((label, index) => {
          const x = padding + (index / Math.max(labels.length - 1, 1)) * (width - padding * 2);
          return (
            <text key={label} x={x} y={height - 8} textAnchor="middle" className="fill-slate-400 text-[11px]">
              Y{label}
            </text>
          );
        })}
        {series.map((item) => (
          <path
            key={item.label}
            d={createPath(item.values)}
            fill="none"
            stroke={item.color}
            strokeWidth="3"
            strokeLinecap="round"
          />
        ))}
      </svg>
    </div>
  );
}
