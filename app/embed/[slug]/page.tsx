import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CalculatorRenderer } from "@/components/calculators/calculator-renderer";
import { EmbedOptionsProvider } from "@/components/embed-options";
import { calculators, getCalculator } from "@/data/calculators";
import { absoluteUrl, createMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return calculators.map((calculator) => ({ slug: calculator.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const calculator = getCalculator(params.slug);

  if (!calculator) {
    return {};
  }

  return {
    ...createMetadata({
      title: `${calculator.title} Embed`,
      description: `Embedded ${calculator.title.toLowerCase()} powered by Calc Atlas.`,
      path: `/embed/${calculator.slug}`
    }),
    robots: {
      index: false,
      follow: true
    }
  };
}

export default function EmbedCalculatorPage({
  params,
  searchParams
}: {
  params: { slug: string };
  searchParams?: {
    title?: string;
    compact?: string;
    powered?: string;
    actions?: string;
    examples?: string;
    compare?: string;
    results?: string;
    insights?: string;
    charts?: string;
    tables?: string;
  };
}) {
  const calculator = getCalculator(params.slug);

  if (!calculator) {
    notFound();
  }

  const showTitle = searchParams?.title !== "0";
  const compact = searchParams?.compact === "1";
  const showPoweredBy = searchParams?.powered !== "0";
  const showActions = searchParams?.actions !== "0";
  const showExamples = searchParams?.examples !== "0";
  const showComparison = searchParams?.compare !== "0";
  const showResults = searchParams?.results !== "0";
  const showInsights = searchParams?.insights !== "0";
  const showCharts = searchParams?.charts !== "0";
  const showTables = searchParams?.tables !== "0";

  return (
    <EmbedOptionsProvider
      value={{
        showActions,
        showExamples,
        showComparison,
        showResults,
        showInsights,
        showCharts,
        showTables
      }}
    >
      <div className="min-h-screen bg-transparent px-3 py-3 md:px-4 md:py-4">
        <div
          className={`mx-auto max-w-6xl rounded-[32px] border border-border bg-white/95 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.12)] dark:bg-slate-950/95 ${
            compact ? "md:p-5" : "md:p-8"
          }`}
        >
          {showTitle ? (
            <div className="mb-6 space-y-3">
              <span className="section-label">Embedded calculator</span>
              <div className="space-y-2">
                <h1 className="font-display text-3xl font-semibold md:text-4xl">{calculator.title}</h1>
                <p className="max-w-3xl text-sm leading-7 text-muted">{calculator.shortDescription}</p>
              </div>
            </div>
          ) : null}
          <Suspense fallback={<div className="surface p-6 text-sm text-muted md:p-8">Loading calculator...</div>}>
            <CalculatorRenderer slug={calculator.slug} embedded />
          </Suspense>
          {showPoweredBy ? (
            <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border pt-4 text-xs leading-6 text-muted">
              <span>Powered by Calc Atlas</span>
              <Link
                href={absoluteUrl(`/${calculator.slug}`)}
                className="font-medium text-accent"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open full calculator
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </EmbedOptionsProvider>
  );
}
