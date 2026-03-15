import Link from "next/link";

import type { CalculatorDefinition } from "@/data/calculators";

import { CalculatorCard } from "./calculator-card";

export function RelatedCalculators({ calculators }: { calculators: CalculatorDefinition[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {calculators.map((calculator) => (
        <CalculatorCard key={calculator.slug} calculator={calculator} />
      ))}
      {calculators.length === 0 ? (
        <Link href="/" className="surface p-6 text-sm text-muted">
          Explore the full calculator library.
        </Link>
      ) : null}
    </div>
  );
}
