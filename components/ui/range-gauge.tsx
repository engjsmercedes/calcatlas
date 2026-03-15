import { cn, formatNumber } from "@/lib/utils";

interface RangeGaugeSegment {
  label: string;
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
  const width = 320;
  const height = 200;
  const centerX = width / 2;
  const centerY = 168;
  const outerRadius = 120;
  const innerRadius = 74;
  const clamped = Math.min(Math.max(value, min), max);
  const fraction = (clamped - min) / Math.max(max - min, 1);
  const angle = Math.PI * (1 - fraction);
  const needleLength = outerRadius - 10;
  const needleX = centerX + Math.cos(angle - Math.PI) * needleLength;
  const needleY = centerY + Math.sin(angle - Math.PI) * needleLength;

  let segmentStart = Math.PI;
  const arcs = segments.map((segment) => {
    const segmentFraction = (segment.max - min) / Math.max(max - min, 1);
    const segmentEnd = Math.PI * (1 - segmentFraction);
    const startX = centerX + Math.cos(segmentStart) * outerRadius;
    const startY = centerY + Math.sin(segmentStart) * outerRadius;
    const endX = centerX + Math.cos(segmentEnd) * outerRadius;
    const endY = centerY + Math.sin(segmentEnd) * outerRadius;
    const innerStartX = centerX + Math.cos(segmentStart) * innerRadius;
    const innerStartY = centerY + Math.sin(segmentStart) * innerRadius;
    const innerEndX = centerX + Math.cos(segmentEnd) * innerRadius;
    const innerEndY = centerY + Math.sin(segmentEnd) * innerRadius;
    const largeArcFlag = segmentStart - segmentEnd > Math.PI ? 1 : 0;
    const path = [
      `M ${startX} ${startY}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 0 ${endX} ${endY}`,
      `L ${innerEndX} ${innerEndY}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${innerStartX} ${innerStartY}`,
      "Z"
    ].join(" ");
    const midAngle = (segmentStart + segmentEnd) / 2;
    const labelX = centerX + Math.cos(midAngle) * (outerRadius + 18);
    const labelY = centerY + Math.sin(midAngle) * (outerRadius + 18);
    segmentStart = segmentEnd;
    return { ...segment, path, labelX, labelY };
  });

  return (
    <div className="surface p-5">
      {title ? <p className="section-label mb-4">{title}</p> : null}
      <svg viewBox={`0 0 ${width} ${height}`} className="mx-auto w-full max-w-[20rem] overflow-visible">
        {arcs.map((segment) => (
          <path key={segment.label} d={segment.path} fill={segment.color} opacity={0.95} />
        ))}
        {arcs.map((segment) => (
          <text
            key={`${segment.label}-text`}
            x={segment.labelX}
            y={segment.labelY}
            textAnchor="middle"
            className={cn("fill-slate-600 text-[11px] font-semibold dark:fill-slate-300")}
          >
            {segment.label}
          </text>
        ))}
        <line x1={centerX} y1={centerY} x2={needleX} y2={needleY} stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
        <circle cx={centerX} cy={centerY} r="8" fill="#0f172a" />
        <text x={centerX} y={132} textAnchor="middle" className="fill-slate-950 text-[34px] font-semibold dark:fill-white">
          {centerLabel}
        </text>
        {unitLabel ? (
          <text x={centerX} y={150} textAnchor="middle" className="fill-slate-500 text-[12px] dark:fill-slate-400">
            {unitLabel}
          </text>
        ) : null}
      </svg>
      <div className="mt-3 flex items-center justify-between text-xs text-muted">
        <span>{formatNumber(min)}</span>
        <span>{formatNumber(max)}</span>
      </div>
    </div>
  );
}
