import type { Metadata } from "next";
import Link from "next/link";

import { AdSlotPlaceholder } from "@/components/ad-slot-placeholder";
import { CalculatorCard } from "@/components/calculator-card";
import { StructuredData } from "@/components/structured-data";
import { calculatorCategoryDetails, calculators } from "@/data/calculators";
import { subtopicHubs } from "@/data/subtopic-hubs";
import { createCalculatorIndexSchemas, createMetadata } from "@/lib/seo";

const allCategories = ["Finance", "Health", "Everyday", "Business", "Income", "Chance"] as const;

const groupedCalculators = allCategories.map((category) => ({
  category,
  details: calculatorCategoryDetails[category],
  items: calculators.filter((calculator) => calculator.category === category)
}));

const lifeDecisionHub = subtopicHubs.find((hub) => hub.slug === "life-decision-calculators");
const lifeDecisionCalculators = lifeDecisionHub
  ? calculators.filter((calculator) => lifeDecisionHub.slugs.includes(calculator.slug))
  : [];

export const metadata: Metadata = createMetadata({
  title: "All Calculators",
  description:
    "Browse every calculator on Calc Atlas across finance, health, everyday, business, income, chance, and major life-decision categories.",
  path: "/calculators",
  keywords: ["all calculators", "calculator index", "finance calculators", "life decision calculators", "chance calculators"]
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
      <section className="page-shell pb-8 md:pb-12">
        <div className="surface p-6 md:p-8">
          <div className="flex flex-wrap gap-3">
            {groupedCalculators.map(({ category, details, items }) => (
              <Link
                key={category}
                href={`/${details.slug}`}
                className="rounded-full border border-border px-4 py-2 text-sm text-muted transition hover:border-accent hover:text-accent"
              >
                {category} ({items.length})
              </Link>
            ))}
            {lifeDecisionHub ? (
              <Link
                href={`/${lifeDecisionHub.slug}`}
                className="rounded-full border border-accent/30 bg-accent-soft px-4 py-2 text-sm text-accent transition hover:border-accent"
              >
                Life decisions ({lifeDecisionHub.slugs.length})
              </Link>
            ) : null}
          </div>
        </div>
      </section>
      <section className="page-shell pb-8 md:pb-12">
        <AdSlotPlaceholder label="Index ad slot" format="Responsive display or leaderboard" />
      </section>
      {lifeDecisionHub ? (
        <section className="page-shell pb-8 md:pb-12">
          <div className="surface p-6 md:p-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="space-y-3">
                <span className="section-label">Featured cluster</span>
                <h2 className="text-2xl font-semibold">{lifeDecisionHub.title}</h2>
                <p className="max-w-3xl text-sm leading-7 text-muted">{lifeDecisionHub.shortDescription}</p>
              </div>
              <Link href={`/${lifeDecisionHub.slug}`} className="font-medium text-accent">
                Open life decision hub
              </Link>
            </div>
            <div className="mt-5 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {lifeDecisionCalculators.map((calculator) => (
                <CalculatorCard key={calculator.slug} calculator={calculator} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
      <section className="page-shell pb-8 md:pb-12">
        <div className="surface p-6 md:p-8">
          <div className="space-y-3">
            <span className="section-label">Popular clusters</span>
            <h2 className="text-2xl font-semibold">Browse the biggest problem-based calculator hubs</h2>
            <p className="max-w-3xl text-sm leading-7 text-muted">These subtopic hubs group the calculators people usually need together, such as borrowing, investing, take-home-pay planning, and major life decisions.</p>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            {subtopicHubs.map((hub) => (
              <Link
                key={hub.slug}
                href={`/${hub.slug}`}
                className="rounded-full border border-border px-4 py-2 text-sm text-muted transition hover:border-accent hover:text-accent"
              >
                {hub.title}
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="page-shell pb-16 md:pb-24">
        <div className="space-y-12">
          {groupedCalculators.map(({ category, details, items }) => (
            <section key={category} aria-labelledby={`${category.toLowerCase()}-calculators`} className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-2">
                  <span className="section-label">{category}</span>
                  <h2 id={`${category.toLowerCase()}-calculators`} className="text-2xl font-semibold">
                    {category} calculators
                  </h2>
                  <p className="max-w-2xl text-sm leading-7 text-muted">{details.shortDescription}</p>
                </div>
                <div className="text-right text-sm text-muted">
                  <p>{items.length} tools</p>
                  <Link href={`/${details.slug}`} className="font-medium text-accent">
                    Open category hub
                  </Link>
                </div>
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

