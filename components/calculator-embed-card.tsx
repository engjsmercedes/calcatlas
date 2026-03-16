"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import type { CalculatorDefinition } from "@/data/calculators";
import { siteConfig } from "@/lib/site";

function buildEmbedUrl(slug: string, options: {
  showTitle: boolean;
  compact: boolean;
  showPoweredBy: boolean;
  showActions: boolean;
  showExamples: boolean;
  showComparison: boolean;
  showResults: boolean;
  showInsights: boolean;
  showCharts: boolean;
  showTables: boolean;
}) {
  const params = new URLSearchParams();

  if (!options.showTitle) {
    params.set("title", "0");
  }
  if (options.compact) {
    params.set("compact", "1");
  }
  if (!options.showPoweredBy) {
    params.set("powered", "0");
  }
  if (!options.showActions) {
    params.set("actions", "0");
  }
  if (!options.showExamples) {
    params.set("examples", "0");
  }
  if (!options.showComparison) {
    params.set("compare", "0");
  }
  if (!options.showResults) {
    params.set("results", "0");
  }
  if (!options.showInsights) {
    params.set("insights", "0");
  }
  if (!options.showCharts) {
    params.set("charts", "0");
  }
  if (!options.showTables) {
    params.set("tables", "0");
  }

  const query = params.toString();
  return `${siteConfig.url}/embed/${slug}${query ? `?${query}` : ""}`;
}

export function CalculatorEmbedCard({ calculator }: { calculator: CalculatorDefinition }) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  const [compact, setCompact] = useState(false);
  const [showPoweredBy, setShowPoweredBy] = useState(true);
  const [showActions, setShowActions] = useState(true);
  const [showExamples, setShowExamples] = useState(true);
  const [showComparison, setShowComparison] = useState(true);
  const [showResults, setShowResults] = useState(true);
  const [showInsights, setShowInsights] = useState(true);
  const [showCharts, setShowCharts] = useState(true);
  const [showTables, setShowTables] = useState(true);

  const embedUrl = useMemo(
    () =>
      buildEmbedUrl(calculator.slug, {
        showTitle,
        compact,
        showPoweredBy,
        showActions,
        showExamples,
        showComparison,
        showResults,
        showInsights,
        showCharts,
        showTables
      }),
    [calculator.slug, compact, showActions, showCharts, showComparison, showExamples, showInsights, showPoweredBy, showResults, showTables, showTitle]
  );

  const embedCode = useMemo(
    () => `<iframe src="${embedUrl}" title="${calculator.title}" width="100%" height="980" style="border:0;overflow:hidden;border-radius:24px;" loading="lazy"></iframe>`,
    [calculator.title, embedUrl]
  );

  const handleCopy = async () => {
    await navigator.clipboard.writeText(embedCode);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section aria-labelledby="embed-calculator" className="space-y-5">
      <div className="space-y-2">
        <span className="section-label">Embed</span>
        <h2 id="embed-calculator" className="font-display text-3xl font-semibold">
          Embed this calculator on another site
        </h2>
        <p className="max-w-3xl text-sm leading-7 text-muted">
          Choose which sections to include, then copy the hosted iframe without moving the calculation logic into another codebase.
        </p>
      </div>
      <div className="surface space-y-5 p-6 md:p-8">
        <div className="flex items-center justify-between gap-3 rounded-3xl border border-border bg-slate-50/80 px-4 py-3 dark:bg-slate-950/30">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">Embed options</p>
            <p className="text-sm text-muted">Starts collapsed. Expand only when you want to customize the iframe.</p>
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsExpanded((value) => !value)}
            aria-expanded={isExpanded}
            aria-controls="embed-options-panel"
          >
            {isExpanded ? "Collapse options" : "Expand options"}
          </Button>
        </div>
        {isExpanded ? (
          <div id="embed-options-panel" className="space-y-5">
            <div className="grid gap-3 text-sm text-slate-700 dark:text-slate-200 md:grid-cols-2 xl:grid-cols-3">
              <label className="flex items-center gap-2"><input checked={showTitle} onChange={(event) => setShowTitle(event.target.checked)} type="checkbox" className="h-4 w-4 accent-cyan-600" />Show calculator title</label>
              <label className="flex items-center gap-2"><input checked={compact} onChange={(event) => setCompact(event.target.checked)} type="checkbox" className="h-4 w-4 accent-cyan-600" />Compact embed mode</label>
              <label className="flex items-center gap-2"><input checked={showPoweredBy} onChange={(event) => setShowPoweredBy(event.target.checked)} type="checkbox" className="h-4 w-4 accent-cyan-600" />Show powered by link</label>
              <label className="flex items-center gap-2"><input checked={showActions} onChange={(event) => setShowActions(event.target.checked)} type="checkbox" className="h-4 w-4 accent-cyan-600" />Show action buttons</label>
              <label className="flex items-center gap-2"><input checked={showExamples} onChange={(event) => setShowExamples(event.target.checked)} type="checkbox" className="h-4 w-4 accent-cyan-600" />Show examples and presets</label>
              <label className="flex items-center gap-2"><input checked={showComparison} onChange={(event) => setShowComparison(event.target.checked)} type="checkbox" className="h-4 w-4 accent-cyan-600" />Show comparison tools</label>
              <label className="flex items-center gap-2"><input checked={showResults} onChange={(event) => setShowResults(event.target.checked)} type="checkbox" className="h-4 w-4 accent-cyan-600" />Show result cards</label>
              <label className="flex items-center gap-2"><input checked={showInsights} onChange={(event) => setShowInsights(event.target.checked)} type="checkbox" className="h-4 w-4 accent-cyan-600" />Show insight notes</label>
              <label className="flex items-center gap-2"><input checked={showCharts} onChange={(event) => setShowCharts(event.target.checked)} type="checkbox" className="h-4 w-4 accent-cyan-600" />Show charts and graphs</label>
              <label className="flex items-center gap-2"><input checked={showTables} onChange={(event) => setShowTables(event.target.checked)} type="checkbox" className="h-4 w-4 accent-cyan-600" />Show data tables</label>
            </div>
            <div className="rounded-3xl border border-border bg-slate-50/80 p-4 dark:bg-slate-950/30">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Embed URL</p>
              <p className="mt-2 break-all text-sm leading-7">{embedUrl}</p>
            </div>
            <div className="rounded-3xl border border-border bg-slate-950 p-4 text-slate-100">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Iframe code</p>
              <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-all text-xs leading-6">{embedCode}</pre>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button type="button" variant="primary" onClick={handleCopy}>{copied ? "Embed code copied" : "Copy embed code"}</Button>
              <Button type="button" variant="secondary" onClick={() => window.open(embedUrl, "_blank", "noopener,noreferrer")}>Open embed preview</Button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
