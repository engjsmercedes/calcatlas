import type { Metadata } from "next";
import Link from "next/link";

import { AdSlotPlaceholder } from "@/components/ad-slot-placeholder";
import { CalculatorCard } from "@/components/calculator-card";
import { HomeSearch } from "@/components/home/home-search";
import { RecentlyUsed } from "@/components/home/recently-used";
import { StructuredData } from "@/components/structured-data";
import { calculatorCategoryDetails, calculators } from "@/data/calculators";
import { subtopicHubs } from "@/data/subtopic-hubs";
import { createMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

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
  title: `${siteConfig.name} | Online Calculator Library`,
  description: siteConfig.description,
  path: "/",
  keywords: ["calculator website", "online calculators", "finance calculators", "life decision calculators", "chance calculators"]
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
        <div className="surface overflow-hidden bg-hero-grid p-8 text-slate-950 dark:text-slate-950 md:p-12">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-6">
              <span className="section-label">High-intent calculator library</span>
              <div className="space-y-4">
                <h1 className="font-display max-w-3xl text-4xl font-semibold leading-tight text-slate-950 dark:text-slate-950 md:text-6xl">
                  Online calculators that feel like a product, not a spreadsheet.
                </h1>
                <p className="max-w-2xl text-base leading-8 text-slate-700 dark:text-slate-700 md:text-lg">
                  Calc Atlas helps users move from search to answer quickly with clean interfaces, live updates, shareable results, and SEO-friendly pages built for scale.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-muted">
                <span className="rounded-full border border-border bg-white/85 px-4 py-2 text-slate-700 dark:bg-slate-950/10 dark:text-slate-700">{calculators.length} calculators live</span>
                <span className="rounded-full border border-border bg-white/85 px-4 py-2 text-slate-700 dark:bg-slate-950/10 dark:text-slate-700">Shareable URLs</span>
                <span className="rounded-full border border-border bg-white/85 px-4 py-2 text-slate-700 dark:bg-slate-950/10 dark:text-slate-700">Fast static-friendly pages</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/#categories" className="button-base bg-accent text-white hover:bg-cyan-700 dark:text-slate-950">
                  Start calculating
                </Link>
                <Link href="/calculators" className="button-base border border-border bg-panel text-text hover:border-accent hover:text-accent dark:bg-slate-950/80 dark:text-white">
                  Browse all calculators
                </Link>
              </div>
              <div className="flex flex-wrap gap-2 pt-1 text-sm">
                {groupedCalculators.map(({ category, details, items }) => (
                  <Link
                    key={category}
                    href={`/${details.slug}`}
                    className="rounded-full border border-border bg-white/85 px-4 py-2 text-slate-700 transition hover:border-accent hover:text-accent dark:bg-slate-950/10 dark:text-slate-700"
                  >
                    {category} ({items.length})
                  </Link>
                ))}
                {lifeDecisionHub ? (
                  <Link
                    href={`/${lifeDecisionHub.slug}`}
                    className="rounded-full border border-accent/30 bg-accent-soft px-4 py-2 text-accent transition hover:border-accent"
                  >
                    Life decisions ({lifeDecisionHub.slugs.length})
                  </Link>
                ) : null}
              </div>
            </div>
            <HomeSearch calculators={calculators} />
          </div>
        </div>
      </section>
      <section className="page-shell pb-8 md:pb-12">
        <AdSlotPlaceholder label="Homepage ad slot" format="Leaderboard or responsive display" />
      </section>
      {lifeDecisionHub ? (
        <section className="page-shell pb-8 md:pb-12">
          <div className="surface p-6 md:p-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="space-y-2">
                <span className="section-label">New cluster</span>
                <h2 className="text-2xl font-semibold">{lifeDecisionHub.title}</h2>
                <p className="max-w-3xl text-sm leading-7 text-muted">{lifeDecisionHub.shortDescription}</p>
              </div>
              <Link href={`/${lifeDecisionHub.slug}`} className="font-medium text-accent">
                Browse life decision hub
              </Link>
            </div>
            <div className="mt-5 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {lifeDecisionCalculators.slice(0, 6).map((calculator) => (
                <CalculatorCard key={calculator.slug} calculator={calculator} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
      <section className="page-shell pb-8 md:pb-12">
        <div className="surface p-6 md:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="section-label">Popular clusters</span>
              <h2 className="text-2xl font-semibold">Go straight into the biggest decision paths</h2>
              <p className="max-w-3xl text-sm leading-7 text-muted">These subtopic hubs group the calculators people usually need together for borrowing, investing, take-home-pay planning, and major life decisions.</p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            {subtopicHubs.map((hub) => (
              <Link
                key={hub.slug}
                href={`/${hub.slug}`}
                className="rounded-full border border-border bg-white/85 px-4 py-2 text-sm text-slate-700 transition hover:border-accent hover:text-accent dark:bg-slate-800 dark:text-slate-200"
              >
                {hub.title}
              </Link>
            ))}
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
      <section className="page-shell pb-8 md:pb-12">
        <AdSlotPlaceholder label="Mid-page ad slot" format="In-content responsive display" />
      </section>
      <section id="categories" className="page-shell pb-16 md:pb-24">
        <div className="mb-8 space-y-3">
          <span className="section-label">Categories</span>
          <h2 className="font-display text-3xl font-semibold">Browse every calculator category</h2>
          <p className="max-w-2xl text-sm leading-7">
            Calc Atlas groups calculators by the broad decision areas people search most often, then adds focused hubs for deeper clusters like major life decisions.
          </p>
        </div>
        <div className="space-y-12">
          {groupedCalculators.map(({ category, details, items }) => (
            <div id={category.toLowerCase()} key={category} className="space-y-5 scroll-mt-24">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <Link href={`/${details.slug}`} className="text-2xl font-semibold transition hover:text-accent">
                    {category}
                  </Link>
                  <p className="max-w-2xl text-sm leading-7 text-muted">{details.shortDescription}</p>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted">
                  <span>{items.length} calculators</span>
                  <Link href={`/${details.slug}`} className="font-medium text-accent">
                    Browse {category.toLowerCase()} hub
                  </Link>
                </div>
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

