import type { Metadata } from "next";

import { StaticPageShell } from "@/components/static-page-shell";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Sources",
  description:
    "Browse public sources and common references that inform the formulas, ranges, and classifications used across Calc Atlas calculators.",
  path: "/sources"
});

const sourceGroups = [
  {
    title: "Health references",
    items: [
      { name: "Centers for Disease Control and Prevention (CDC)", href: "https://www.cdc.gov/bmi/", note: "BMI categories and general BMI guidance." },
      { name: "National Institutes of Health (NIH)", href: "https://www.nhlbi.nih.gov/health/educational/lose_wt/BMI/bmicalc.htm", note: "BMI background and weight-status framing." },
      { name: "Mifflin-St Jeor equation", href: "https://pubmed.ncbi.nlm.nih.gov/2305711/", note: "Widely used resting energy expenditure equation." },
      { name: "U.S. Navy body fat method", href: "https://www.omnicalculator.com/health/navy-body-fat", note: "Common circumference-based body-fat estimation reference." }
    ]
  },
  {
    title: "Finance and business references",
    items: [
      { name: "Standard compound interest formulas", href: "https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator", note: "Common future-value and compounding math conventions." },
      { name: "ROI and percentage return conventions", href: "https://www.investopedia.com/terms/r/returnoninvestment.asp", note: "General return-on-investment framing and definitions." },
      { name: "Loan amortization formulas", href: "https://www.consumerfinance.gov/owning-a-home/explore-rates/", note: "Common mortgage payment structure and terminology." }
    ]
  },
  {
    title: "General calculator references",
    items: [
      { name: "Common percentage math", href: "https://www.mathsisfun.com/percentage.html", note: "Reference for standard percentage operations used by general tools." },
      { name: "Nutrition and protein guidance", href: "https://www.nutrition.gov/topics/basic-nutrition", note: "General public nutrition reference context." }
    ]
  }
];

export default function SourcesPage() {
  return (
    <StaticPageShell
      eyebrow="Sources"
      title="Sources and references"
      intro="Calc Atlas uses commonly accepted formulas, public health references, and standard financial math conventions where possible. This page highlights the kinds of source material that inform classifications, ranges, and calculator logic."
    >
      {sourceGroups.map((group) => (
        <section key={group.title} className="surface p-6 md:p-8">
          <h2 className="font-display text-3xl font-semibold">{group.title}</h2>
          <div className="mt-5 space-y-5">
            {group.items.map((item) => (
              <article key={item.name} className="border-t border-border/80 pt-5 first:border-t-0 first:pt-0">
                <h3 className="text-xl font-semibold">
                  <a href={item.href} target="_blank" rel="noreferrer" className="transition hover:text-accent">
                    {item.name}
                  </a>
                </h3>
                <p className="mt-2 text-sm leading-7 md:text-base">{item.note}</p>
              </article>
            ))}
          </div>
        </section>
      ))}
    </StaticPageShell>
  );
}
