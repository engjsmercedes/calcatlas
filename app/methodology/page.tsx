import type { Metadata } from "next";
import Link from "next/link";

import { StaticPageShell } from "@/components/static-page-shell";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Methodology",
  description:
    "Review the main formulas, assumptions, and methods used across Calc Atlas calculators in finance, health, business, income, and everyday categories.",
  path: "/methodology"
});

const sections = [
  {
    title: "Health methodology",
    items: [
      { label: "BMI Calculator", href: "/bmi-calculator", text: "Uses the standard BMI equation: weight in kilograms divided by height in meters squared, along with standard BMI category thresholds and a healthy BMI range for height-based weight estimates." },
      { label: "Calorie Needs Calculator", href: "/calorie-needs-calculator", text: "Uses the Mifflin-St Jeor equation to estimate basal metabolic rate and applies common activity multipliers to estimate maintenance calories, then adjusts targets for weight loss or gain." },
      { label: "Body Fat Calculator", href: "/body-fat-calculator", text: "Uses the U.S. Navy circumference method with the required body measurements for men and women." }
    ]
  },
  {
    title: "Finance methodology",
    items: [
      { label: "Compound Interest Calculator", href: "/compound-interest-calculator", text: "Projects balance growth using recurring contributions, annual rate assumptions, and a selected compounding frequency based on standard future value math." },
      { label: "ROI Calculator", href: "/roi-calculator", text: "Calculates gain or loss relative to the initial amount invested, with annualized ROI used when a holding period is available." },
      { label: "Mortgage Calculator", href: "/mortgage-calculator", text: "Uses a standard amortizing loan formula for principal and interest, then layers in optional property tax, insurance, and HOA costs for a fuller monthly estimate." }
    ]
  },
  {
    title: "Business and income methodology",
    items: [
      { label: "Margin Calculator", href: "/margin-calculator", text: "Separates margin from markup so users can solve for price, cost, profit, or percentage inputs without mixing the two formulas." },
      { label: "Salary to Hourly Calculator", href: "/salary-to-hourly-calculator", text: "Converts annual salary and hourly pay based on hours per week and weeks worked per year, then layers in simplified tax and deduction assumptions for take-home pay estimates." }
    ]
  },
  {
    title: "Everyday methodology",
    items: [
      { label: "Percentage Calculator", href: "/percentage-calculator", text: "Covers percentage of a number, what percent one number is of another, and percentage increase or decrease using standard percentage math." }
    ]
  }
];

export default function MethodologyPage() {
  return (
    <StaticPageShell
      eyebrow="Methodology"
      title="How Calc Atlas calculators work"
      intro="This page summarizes the formulas, assumptions, and calculation logic used across the site. The aim is not to turn every calculator into a math paper, but to make the core methods transparent enough that users can understand what a result is based on."
    >
      {sections.map((section) => (
        <section key={section.title} className="surface p-6 md:p-8">
          <h2 className="font-display text-3xl font-semibold">{section.title}</h2>
          <div className="mt-5 space-y-5">
            {section.items.map((item) => (
              <article key={item.label} className="border-t border-border/80 pt-5 first:border-t-0 first:pt-0">
                <h3 className="text-xl font-semibold">
                  <Link href={item.href} className="transition hover:text-accent">
                    {item.label}
                  </Link>
                </h3>
                <p className="mt-2 text-sm leading-7 md:text-base">{item.text}</p>
              </article>
            ))}
          </div>
        </section>
      ))}
    </StaticPageShell>
  );
}
