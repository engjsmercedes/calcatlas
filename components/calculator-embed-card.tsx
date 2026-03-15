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

  const query = params.toString();
  return `${siteConfig.url}/embed/${slug}${query ? `?${query}` : ""}`;
}

export function CalculatorEmbedCard({ calculator }: { calculator: CalculatorDefinition }) {
  const [copied, setCopied] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  const [compact, setCompact] = useState(false);
  const [showPoweredBy, setShowPoweredBy] = useState(true);
  const [showActions, setShowActions] = useState(true);
  const [showExamples, setShowExamples] = useState(true);
  const [showComparison, setShowComparison] = useState(true);

  const embedUrl = useMemo(
    () =>
      buildEmbedUrl(calculator.slug, {
        showTitle,
        compact,
        showPoweredBy,
        showActions,
        showExamples,
        showComparison
      }),
    [calculator.slug, compact, showActions, showComparison, showExamples, showPoweredBy, showTitle]
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
          Use the hosted embed to place this tool on a blog, landing page, or resource hub without copying the logic into another codebase.
        </p>
      </div>
      <div className="surface space-y-5 p-6 md:p-8">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3 text-sm text-slate-700 dark:text-slate-200">
          <label className="flex items-center gap-2">
            <input checked={showTitle} onChange={(event) => setShowTitle(event.target.checked)} type="checkbox" className="h-4 w-4 accent-cyan-600" />
            Show calculator title
          </label>
          <label className="flex items-center gap-2">
            <input checked={compact} onChange={(event) => setCompact(event.target.checked)} type="checkbox" className="h-4 w-4 accent-cyan-600" />
            Compact embed mode
          </label>
          <label className="flex items-center gap-2">
            <input checked={showPoweredBy} onChange={(event) => setShowPoweredBy(event.target.checked)} type="checkbox" className="h-4 w-4 accent-cyan-600" />
            Show powered by link
          </label>
          <label className="flex items-center gap-2">
            <input checked={showActions} onChange={(event) => setShowActions(event.target.checked)} type="checkbox" className="h-4 w-4 accent-cyan-600" />
            Show action buttons
          </label>
          <label className="flex items-center gap-2">
            <input checked={showExamples} onChange={(event) => setShowExamples(event.target.checked)} type="checkbox" className="h-4 w-4 accent-cyan-600" />
            Show examples and presets
          </label>
          <label className="flex items-center gap-2">
            <input checked={showComparison} onChange={(event) => setShowComparison(event.target.checked)} type="checkbox" className="h-4 w-4 accent-cyan-600" />
            Show comparison tools
          </label>
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
          <Button type="button" variant="primary" onClick={handleCopy}>
            {copied ? "Embed code copied" : "Copy embed code"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => window.open(embedUrl, "_blank", "noopener,noreferrer")}>
            Open embed preview
          </Button>
        </div>
      </div>
    </section>
  );
}
