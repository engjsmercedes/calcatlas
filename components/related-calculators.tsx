import Link from "next/link";

import type { CalculatorDefinition } from "@/data/calculators";

import { CalculatorCard } from "./calculator-card";

export function RelatedCalculators({ calculators }: { calculators: CalculatorDefinition[] }) {
  if (calculators.length === 0) {
    return (
      <div className="surface p-6 text-sm leading-7 text-muted">
        Explore the full calculator library to keep comparing adjacent finance, health, business, income, and everyday tools.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {calculators.map((calculator) => (
          <CalculatorCard key={calculator.slug} calculator={calculator} />
        ))}
      </div>
      <Link href="/calculators" className="inline-flex text-sm font-medium text-accent transition hover:text-cyan-700">
        Browse the full calculator library
      </Link>
    </div>
  );
}
