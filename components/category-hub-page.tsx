import Link from "next/link";

import { CalculatorCard } from "@/components/calculator-card";
import type { CalculatorCategoryDefinition, CalculatorDefinition } from "@/data/calculators";

export function CategoryHubPage({
  category,
  calculators,
  categoryLinks
}: {
  category: CalculatorCategoryDefinition;
  calculators: CalculatorDefinition[];
  categoryLinks: CalculatorCategoryDefinition[];
}) {
  return (
    <>
      <section className="page-shell py-10 md:py-16">
        <div className="surface bg-hero-grid p-8 md:p-12">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div className="space-y-4">
              <Link href="/calculators" className="text-sm font-medium text-accent">
                Back to all calculators
              </Link>
              <span className="section-label">{category.category}</span>
              <h1 className="font-display text-4xl font-semibold md:text-5xl">{category.title}</h1>
              <p className="max-w-3xl text-base leading-8 md:text-lg">{category.intro}</p>
              <p className="max-w-3xl text-sm leading-7 md:text-base">{category.guide}</p>
              <div className="flex flex-wrap gap-3 text-sm text-muted">
                <span className="rounded-full border border-border bg-white/70 px-4 py-2">{calculators.length} calculators</span>
                <span className="rounded-full border border-border bg-white/70 px-4 py-2">Shareable result URLs</span>
                <span className="rounded-full border border-border bg-white/70 px-4 py-2">Guide-style explanations</span>
              </div>
            </div>
            <div className="surface p-6">
              <p className="section-label">Explore categories</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {categoryLinks.map((link) => (
                  <Link
                    key={link.slug}
                    href={`/${link.slug}`}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      link.slug === category.slug
                        ? "border-accent bg-accent-soft text-accent"
                        : "border-border text-muted hover:border-accent hover:text-accent"
                    }`}
                  >
                    {link.category}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="page-shell pb-8 md:pb-12">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="surface p-6">
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">What this cluster covers</h2>
            <p className="mt-3 text-sm leading-7">{category.shortDescription}</p>
          </div>
          <div className="surface p-6">
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Why it is useful</h2>
            <p className="mt-3 text-sm leading-7">
              Calc Atlas category hubs group related calculators so users can move from one question into the next nearby tool without starting their search over.
            </p>
          </div>
          <div className="surface p-6">
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Best way to use it</h2>
            <p className="mt-3 text-sm leading-7">
              Open the calculator that matches the first decision you need to make, then use the related links on each page to keep moving through the same topic cluster.
            </p>
          </div>
        </div>
      </section>
      <section className="page-shell pb-16 md:pb-24">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="section-label">{category.category} tools</span>
            <h2 className="font-display text-3xl font-semibold">Browse calculators in this category</h2>
          </div>
          <Link href="/calculators" className="text-sm font-medium text-accent">
            View full calculator index
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {calculators.map((calculator) => (
            <CalculatorCard key={calculator.slug} calculator={calculator} />
          ))}
        </div>
      </section>
    </>
  );
}
