import Link from "next/link";

import { CalculatorCard } from "@/components/calculator-card";
import type { CalculatorDefinition } from "@/data/calculators";
import type { SubtopicHubDefinition } from "@/data/subtopic-hubs";

export function SubtopicHubPage({
  hub,
  calculators,
  siblingHubs
}: {
  hub: SubtopicHubDefinition;
  calculators: CalculatorDefinition[];
  siblingHubs: SubtopicHubDefinition[];
}) {
  const featured = calculators.slice(0, Math.min(6, calculators.length));

  return (
    <>
      <section className="page-shell py-10 md:py-16">
        <div className="surface bg-hero-grid p-8 md:p-12">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div className="space-y-4">
              <Link href="/calculators" className="text-sm font-medium text-accent">
                Back to all calculators
              </Link>
              <span className="section-label">Cluster hub</span>
              <h1 className="font-display text-4xl font-semibold md:text-5xl">{hub.title}</h1>
              <p className="max-w-3xl text-base leading-8 md:text-lg">{hub.intro}</p>
              <p className="max-w-3xl text-sm leading-7 md:text-base">{hub.guide}</p>
              <div className="flex flex-wrap gap-3 text-sm text-muted">
                <span className="rounded-full border border-border bg-white/70 px-4 py-2">{calculators.length} calculators in this cluster</span>
                <span className="rounded-full border border-border bg-white/70 px-4 py-2">Internal-linking hub</span>
                <span className="rounded-full border border-border bg-white/70 px-4 py-2">Shareable result pages</span>
              </div>
            </div>
            <div className="surface p-6">
              <p className="section-label">Explore related hubs</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {siblingHubs.map((sibling) => (
                  <Link
                    key={sibling.slug}
                    href={`/${sibling.slug}`}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      sibling.slug === hub.slug ? "border-accent bg-accent-soft text-accent" : "border-border text-muted hover:border-accent hover:text-accent"
                    }`}
                  >
                    {sibling.title}
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
            <p className="mt-3 text-sm leading-7">{hub.shortDescription}</p>
          </div>
          <div className="surface p-6">
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">How to use it</h2>
            <p className="mt-3 text-sm leading-7">Start with the calculator closest to the first decision, then use related links to move into nearby affordability, payoff, savings, or tax questions without resetting the scenario.</p>
          </div>
          <div className="surface p-6">
            <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Why it helps SEO too</h2>
            <p className="mt-3 text-sm leading-7">Grouping calculators by problem type creates clearer topic clusters for search engines and a better browsing path for users comparing adjacent tools.</p>
          </div>
        </div>
      </section>
      <section className="page-shell pb-16 md:pb-24">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="section-label">Cluster tools</span>
            <h2 className="font-display text-3xl font-semibold">Use the main calculators in {hub.title.toLowerCase()}</h2>
          </div>
          <span className="text-sm text-muted">{calculators.length} tools</span>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featured.map((calculator) => (
            <CalculatorCard key={calculator.slug} calculator={calculator} />
          ))}
        </div>
        <div className="mt-10 rounded-3xl border border-border bg-slate-50/80 p-6 dark:bg-slate-950/30">
          <h3 className="text-xl font-semibold text-slate-950 dark:text-white">All calculators in this cluster</h3>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {calculators.map((calculator) => (
              <Link key={calculator.slug} href={`/${calculator.slug}`} className="text-sm font-medium text-accent transition hover:text-cyan-700">
                {calculator.title}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
