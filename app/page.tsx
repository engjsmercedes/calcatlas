import type { Metadata } from "next";
import Link from "next/link";

import { CalculatorCard } from "@/components/calculator-card";
import { HomeSearch } from "@/components/home/home-search";
import { RecentlyUsed } from "@/components/home/recently-used";
import { StructuredData } from "@/components/structured-data";
import { calculatorCategories, calculators } from "@/data/calculators";
import { createMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

const categoryDescriptions: Record<(typeof calculatorCategories)[number], string> = {
  Finance: "Home-buying, debt, investing, and savings tools for decisions that compound over time.",
  Business: "Pricing and profitability calculators for teams that need clean unit economics fast.",
  Income: "Compensation and take-home tools built for offers, planning, and job comparisons.",
  Health: "Body, nutrition, sleep, running, and strength calculators for repeat-use planning.",
  Everyday: "Fast utility calculators for discounts, tipping, and percentage-based everyday math."
};

const groupedCalculators = calculatorCategories.map((category) => ({
  category,
  description: categoryDescriptions[category],
  items: calculators.filter((calculator) => calculator.category === category)
}));

export const metadata: Metadata = createMetadata({
  title: `${siteConfig.name} | Online Calculator Library`,
  description: siteConfig.description,
  path: "/",
  keywords: ["calculator website", "online calculators", "finance calculators", "health calculators"]
});

export default function HomePage() {
  return (
    <>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${siteConfig.name} calculator library`,
          description: siteConfig.description,
          url: siteConfig.url
        }}
      />
      <section className="page-shell py-10 md:py-16">
        <div className="surface overflow-hidden bg-hero-grid p-8 md:p-12">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-6">
              <span className="section-label">High-intent calculator library</span>
              <div className="space-y-4">
                <h1 className="font-display max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">
                  Online calculators that feel like a product, not a spreadsheet.
                </h1>
                <p className="max-w-2xl text-base leading-8 md:text-lg">
                  Calc Atlas helps users move from search to answer quickly with clean interfaces, live updates, shareable results, and SEO-friendly pages built for scale.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-muted">
                <span className="rounded-full border border-border bg-white/70 px-4 py-2">{calculators.length} calculators live</span>
                <span className="rounded-full border border-border bg-white/70 px-4 py-2">Shareable URLs</span>
                <span className="rounded-full border border-border bg-white/70 px-4 py-2">Fast static-friendly pages</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/#categories" className="button-base bg-accent text-white hover:bg-cyan-700 dark:text-slate-950">
                  Start calculating
                </Link>
                <Link href="/calculators" className="button-base border border-border bg-panel text-text hover:border-accent hover:text-accent">
                  Browse all calculators
                </Link>
              </div>
              <div className="flex flex-wrap gap-2 pt-1 text-sm">
                {groupedCalculators.map(({ category, items }) => (
                  <Link
                    key={category}
                    href={`/#${category.toLowerCase()}`}
                    className="rounded-full border border-border bg-white/70 px-4 py-2 text-muted transition hover:border-accent hover:text-accent"
                  >
                    {category} ({items.length})
                  </Link>
                ))}
              </div>
            </div>
            <HomeSearch calculators={calculators} />
          </div>
        </div>
      </section>
      <section id="recently-used" className="page-shell pb-8 md:pb-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <span className="section-label">Recently used</span>
            <h2 className="font-display mt-4 text-3xl font-semibold">Pick up where you left off</h2>
          </div>
        </div>
        <RecentlyUsed />
      </section>
      <section id="categories" className="page-shell pb-16 md:pb-24">
        <div className="mb-8 space-y-3">
          <span className="section-label">Categories</span>
          <h2 className="font-display text-3xl font-semibold">Finance, business, income, health, and everyday math</h2>
          <p className="max-w-2xl text-sm leading-7">
            Calc Atlas groups calculators by the major decision areas people actually search for, making it easier to jump from one answer into the next related tool without losing context.
          </p>
        </div>
        <div className="space-y-12">
          {groupedCalculators.map(({ category, description, items }) => (
            <div id={category.toLowerCase()} key={category} className="space-y-5 scroll-mt-24">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="text-2xl font-semibold">{category}</h3>
                  <p className="max-w-2xl text-sm leading-7 text-muted">{description}</p>
                </div>
                <span className="text-sm text-muted">{items.length} calculators</span>
              </div>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {items.map((calculator) => (
                  <CalculatorCard key={calculator.slug} calculator={calculator} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
