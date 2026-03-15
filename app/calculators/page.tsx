import type { Metadata } from "next";

import { CalculatorCard } from "@/components/calculator-card";
import { StructuredData } from "@/components/structured-data";
import { calculatorCategories, calculators } from "@/data/calculators";
import { createCalculatorIndexSchemas, createMetadata } from "@/lib/seo";

const groupedCalculators = calculatorCategories.map((category) => ({
  category,
  items: calculators.filter((calculator) => calculator.category === category)
}));

export const metadata: Metadata = createMetadata({
  title: "All Calculators",
  description:
    "Browse every calculator on Calc Atlas across finance, business, income, health, and everyday categories.",
  path: "/calculators",
  keywords: ["all calculators", "calculator index", "finance calculators", "health calculators"]
});

export default function CalculatorsPage() {
  return (
    <>
      <StructuredData data={createCalculatorIndexSchemas()} />
      <section className="page-shell py-10 md:py-16">
        <div className="space-y-4">
          <span className="section-label">Calculator index</span>
          <h1 className="font-display text-4xl font-semibold md:text-5xl">Browse every calculator</h1>
          <p className="max-w-3xl text-base leading-8 md:text-lg">
            This calculator library is organized by category so users and search engines can navigate the full set of tools from a single hub. Each calculator has its own dedicated page with live results, examples, FAQs, and related links.
          </p>
        </div>
      </section>
      <section className="page-shell pb-16 md:pb-24">
        <div className="space-y-12">
          {groupedCalculators.map(({ category, items }) => (
            <section key={category} aria-labelledby={`${category.toLowerCase()}-calculators`} className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-2">
                  <span className="section-label">{category}</span>
                  <h2 id={`${category.toLowerCase()}-calculators`} className="text-2xl font-semibold">
                    {category} calculators
                  </h2>
                </div>
                <span className="text-sm text-muted">{items.length} tools</span>
              </div>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {items.map((calculator) => (
                  <CalculatorCard key={calculator.slug} calculator={calculator} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </>
  );
}
