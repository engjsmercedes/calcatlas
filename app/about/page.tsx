import type { Metadata } from "next";

import { StaticPageShell } from "@/components/static-page-shell";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "About",
  description:
    "Learn what Calc Atlas is, who the calculators are for, and how the library covers finance, health, business, income, and everyday decisions.",
  path: "/about"
});

const categories = [
  {
    title: "Finance",
    description: "Mortgage, ROI, and compound interest tools help users model long-term financial decisions with clearer context and faster comparison."
  },
  {
    title: "Health",
    description: "BMI, calories, body fat, hydration, macros, sleep, running, and strength calculators turn common wellness questions into practical estimates."
  },
  {
    title: "Business",
    description: "Pricing and margin tools support operators who need quick answers without losing the logic behind the numbers."
  },
  {
    title: "Income",
    description: "Compensation calculators help users compare salaries, hourly rates, tax assumptions, and deductions in a more realistic way."
  },
  {
    title: "Everyday",
    description: "General-purpose math tools cover the quick percentage and utility calculations people search for every day."
  }
];

export default function AboutPage() {
  return (
    <StaticPageShell
      eyebrow="About"
      title="About Calc Atlas"
      intro="Calc Atlas is a calculator website built to turn high-intent searches into fast, useful answers. The goal is simple: make practical calculators easier to use, easier to understand, and easier to trust."
    >
      <section className="surface p-6 md:p-8">
        <h2 className="font-display text-3xl font-semibold">Why this site exists</h2>
        <p className="mt-4 text-sm leading-7 md:text-base">
          Many calculator websites answer the right question with the wrong experience. They often feel crowded, dated, or hard to interpret. Calc Atlas is designed as a cleaner alternative: lightweight pages, live results, readable explanations, and a structure that can expand into a larger calculator library without sacrificing quality.
        </p>
        <p className="mt-4 text-sm leading-7 md:text-base">
          The site is built for people making real decisions, whether that means comparing job offers, estimating hydration targets, planning a mortgage payment, or checking pricing margins. Every page is meant to reduce friction between a search query and a usable answer.
        </p>
      </section>
      <section className="space-y-5">
        <div className="space-y-2">
          <span className="section-label">Categories</span>
          <h2 className="font-display text-3xl font-semibold">What the calculator library covers</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <article key={category.title} className="surface p-6">
              <h3 className="text-xl font-semibold">{category.title}</h3>
              <p className="mt-3 text-sm leading-7">{category.description}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="surface p-6 md:p-8">
        <h2 className="font-display text-3xl font-semibold">What we are trying to make easier</h2>
        <p className="mt-4 text-sm leading-7 md:text-base">
          The purpose of Calc Atlas is not to overwhelm users with every possible input. It is to make useful calculators simple, accessible, and transparent enough that people can act on the result with better context. That means clearer labels, polished output, and methodology pages that explain where the numbers come from.
        </p>
      </section>
    </StaticPageShell>
  );
}
