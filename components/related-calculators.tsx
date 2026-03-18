"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import type { CalculatorDefinition } from "@/data/calculators";

import { CalculatorCard } from "./calculator-card";

export function RelatedCalculators({
  calculators,
  currentCalculator
}: {
  calculators: CalculatorDefinition[];
  currentCalculator: CalculatorDefinition;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasScenarioState = Array.from(searchParams.keys()).some((key) => !key.startsWith("workflow"));
  const currentUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

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
        {calculators.map((calculator) => {
          const workflowParams = new URLSearchParams();
          workflowParams.set("workflowFrom", currentCalculator.slug);
          workflowParams.set("workflowTitle", currentCalculator.title);
          workflowParams.set("workflowReturn", currentUrl);

          return (
            <div key={calculator.slug} className="space-y-3">
              <CalculatorCard calculator={calculator} href={`/${calculator.slug}?${workflowParams.toString()}`} ctaLabel={hasScenarioState ? "Continue workflow" : "Start calculating"} />
              {hasScenarioState ? (
                <p className="px-2 text-xs leading-6 text-muted">
                  Opens {calculator.title} with a return link back to this saved scenario.
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
      <Link href="/calculators" className="inline-flex text-sm font-medium text-accent transition hover:text-cyan-700">
        Browse the full calculator library
      </Link>
    </div>
  );
}
