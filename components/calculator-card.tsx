import Link from "next/link";

import type { CalculatorDefinition } from "@/data/calculators";

export function CalculatorCard({ calculator }: { calculator: CalculatorDefinition }) {
  return (
    <Link
      href={`/${calculator.slug}`}
      className="group surface flex h-full flex-col justify-between p-6 transition hover:-translate-y-1 hover:shadow-glow"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            {calculator.category}
          </span>
          <span className="text-xs font-medium text-muted">Start calculating</span>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-slate-950 transition group-hover:text-accent dark:text-white">
            {calculator.title}
          </h3>
          <p className="text-sm leading-6">{calculator.shortDescription}</p>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-2 text-xs text-muted">
        {calculator.features.map((feature) => (
          <span key={feature} className="rounded-full border border-border px-3 py-1">
            {feature}
          </span>
        ))}
      </div>
    </Link>
  );
}
