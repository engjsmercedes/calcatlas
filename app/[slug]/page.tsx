import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CalculatorRenderer } from "@/components/calculators/calculator-renderer";
import { RelatedCalculators } from "@/components/related-calculators";
import { StructuredData } from "@/components/structured-data";
import { FaqList } from "@/components/ui/faq-list";
import { calculators, getCalculator, getRelatedCalculators } from "@/data/calculators";
import {
  createCalculatorMetadata,
  createCalculatorSchemas,
  getCalculatorLead,
  getCalculatorResultExplanation
} from "@/lib/seo";

export function generateStaticParams() {
  return calculators.map((calculator) => ({ slug: calculator.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const calculator = getCalculator(params.slug);
  return calculator ? createCalculatorMetadata(calculator) : {};
}

export default function CalculatorPage({ params }: { params: { slug: string } }) {
  const calculator = getCalculator(params.slug);

  if (!calculator) {
    notFound();
  }

  const related = getRelatedCalculators(calculator.related);
  const resultExplanation = getCalculatorResultExplanation(calculator);
  const calculatorLead = getCalculatorLead(calculator);

  return (
    <>
      <StructuredData data={createCalculatorSchemas(calculator)} />
      <section className="page-shell py-10 md:py-14">
        <div className="space-y-8">
          <div className="space-y-4">
            <Link href="/calculators" className="text-sm font-medium text-accent">
              Back to all calculators
            </Link>
            <span className="section-label">{calculator.category}</span>
            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
              <div className="space-y-4">
                <h1 className="font-display text-4xl font-semibold md:text-5xl">{calculator.title}</h1>
                <p className="max-w-3xl text-base leading-8 md:text-lg">{calculator.intro}</p>
                <p className="max-w-3xl text-sm leading-7 md:text-base">{calculatorLead}</p>
              </div>
              <div className="surface p-6">
                <p className="text-sm leading-7">{calculator.detail}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {calculator.features.map((feature) => (
                    <span key={feature} className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <section aria-labelledby="about-calculator" className="space-y-4">
            <div className="space-y-2">
              <span className="section-label">About the calculator</span>
              <h2 id="about-calculator" className="font-display text-3xl font-semibold">
                Understand what this tool measures
              </h2>
            </div>
            <div className="surface p-6 md:p-8">
              <p className="max-w-4xl text-sm leading-7 md:text-base">{calculator.detail}</p>
            </div>
          </section>
          <section aria-labelledby="use-calculator" className="space-y-4">
            <div className="space-y-2">
              <span className="section-label">Use the calculator</span>
              <h2 id="use-calculator" className="font-display text-3xl font-semibold">
                Enter your numbers and review the live output
              </h2>
            </div>
            <Suspense fallback={<div className="surface p-6 text-sm text-muted md:p-8">Loading calculator...</div>}>
              <CalculatorRenderer slug={calculator.slug} />
            </Suspense>
          </section>
        </div>
      </section>
      <section className="page-shell pb-10 md:pb-14">
        <div className="grid gap-8 lg:grid-cols-2">
          <section aria-labelledby="result-explanation" className="space-y-5">
            <div className="space-y-2">
              <span className="section-label">Result explanation</span>
              <h2 id="result-explanation" className="font-display text-3xl font-semibold">
                What the result means
              </h2>
            </div>
            <div className="surface p-6 md:p-8">
              <p className="text-sm leading-7 md:text-base">{resultExplanation}</p>
            </div>
          </section>
          <section aria-labelledby="examples" className="space-y-5">
            <div className="space-y-2">
              <span className="section-label">Examples</span>
              <h2 id="examples" className="font-display text-3xl font-semibold">
                How people use this calculator
              </h2>
            </div>
            <div className="space-y-4">
              {calculator.examples.map((example) => (
                <div key={example.title} className="surface p-6">
                  <h3 className="text-xl font-semibold">{example.title}</h3>
                  <p className="mt-2 text-sm leading-7">{example.description}</p>
                  <p className="mt-3 text-sm font-medium text-slate-900 dark:text-white">{example.outcome}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
      <section className="page-shell pb-10 md:pb-14">
        <section aria-labelledby="faq" className="space-y-5">
          <div className="space-y-2">
            <span className="section-label">FAQ</span>
            <h2 id="faq" className="font-display text-3xl font-semibold">
              Common questions
            </h2>
          </div>
          <FaqList items={calculator.faqs} />
        </section>
      </section>
      <section className="page-shell pb-16 md:pb-24">
        <section aria-labelledby="related-calculators" className="space-y-5">
          <div className="space-y-2">
            <span className="section-label">Related calculators</span>
            <h2 id="related-calculators" className="font-display text-3xl font-semibold">
              Explore nearby tools
            </h2>
          </div>
          <RelatedCalculators calculators={related} />
        </section>
      </section>
    </>
  );
}
