"use client";

import { calculatorMap } from "@/data/calculators";
import { useRecentCalculators } from "@/lib/hooks/use-recent-calculators";

import { CalculatorCard } from "../calculator-card";

export function RecentlyUsed() {
  const recent = useRecentCalculators();

  if (recent.length === 0) {
    return (
      <div className="surface p-6 text-sm text-muted">
        Recently used calculators appear here after you open a tool.
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {recent.map((slug) => {
        const calculator = calculatorMap[slug];
        return calculator ? <CalculatorCard key={slug} calculator={calculator} /> : null;
      })}
    </div>
  );
}
