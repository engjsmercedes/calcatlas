"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useEmbedOptions } from "@/components/embed-options";
import { Button } from "@/components/ui/button";

const SAVED_SCENARIO_LIMIT = 6;

type SavedScenario = {
  id: string;
  name: string;
  url: string;
};

type DecisionVerdictTone = "success" | "caution" | "neutral";

const verdictToneClasses: Record<DecisionVerdictTone, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200",
  caution: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200",
  neutral: "border-border bg-slate-50 text-slate-700 dark:bg-slate-950/40 dark:text-slate-200"
};

export function CalculatorActions({
  onReset,
  onShare,
  hasActiveValues
}: {
  onReset: () => void;
  onShare: () => Promise<void>;
  hasActiveValues: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>([]);
  const { showActions } = useEmbedOptions();
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) {
      return;
    }

    try {
      const stored = window.localStorage.getItem(`calc-atlas-scenarios:${pathname}`);
      setSavedScenarios(stored ? (JSON.parse(stored) as SavedScenario[]) : []);
    } catch {
      setSavedScenarios([]);
    }
  }, [pathname]);

  const handleShare = async () => {
    await onShare();
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const persistSavedScenarios = (items: SavedScenario[]) => {
    setSavedScenarios(items);
    window.localStorage.setItem(`calc-atlas-scenarios:${pathname}`, JSON.stringify(items));
  };

  const handleSaveScenario = () => {
    const defaultName = `Scenario ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
    const name = window.prompt("Name this scenario", defaultName)?.trim();

    if (!name) {
      return;
    }

    const nextScenario: SavedScenario = {
      id: `${Date.now()}`,
      name,
      url: window.location.href
    };

    const nextItems = [nextScenario, ...savedScenarios.filter((item) => item.url !== nextScenario.url)].slice(0, SAVED_SCENARIO_LIMIT);
    persistSavedScenarios(nextItems);
  };

  const handleDeleteScenario = (id: string) => {
    persistSavedScenarios(savedScenarios.filter((item) => item.id !== id));
  };

  if (!showActions) {
    return null;
  }

  return (
    <div className="print-hidden space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="primary" type="button" onClick={handleShare} disabled={!hasActiveValues}>
          {copied ? "Link copied" : "Copy share link"}
        </Button>
        <Button variant="secondary" type="button" onClick={handleSaveScenario} disabled={!hasActiveValues}>
          Save scenario
        </Button>
        <Button variant="secondary" type="button" onClick={() => window.print()} disabled={!hasActiveValues}>
          Print result
        </Button>
        <Button variant="ghost" type="button" onClick={onReset}>
          Clear all
        </Button>
      </div>
      {savedScenarios.length ? (
        <div className="rounded-2xl border border-border bg-slate-50/80 p-4 dark:bg-slate-950/30">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-950 dark:text-white">Saved scenarios</p>
            <p className="text-xs text-muted">Stored locally for this calculator.</p>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {savedScenarios.map((scenario) => (
              <div key={scenario.id} className="flex items-center gap-2 rounded-full border border-border bg-white px-3 py-2 dark:bg-slate-950/60">
                <button type="button" onClick={() => (window.location.href = scenario.url)} className="text-sm font-medium text-slate-950 transition hover:text-accent dark:text-white">
                  {scenario.name}
                </button>
                <button type="button" onClick={() => handleDeleteScenario(scenario.id)} className="text-xs text-muted transition hover:text-accent" aria-label={`Delete ${scenario.name}`}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function EmptyCalculatorState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-white/40 p-6 dark:bg-slate-950/20">
      <p className="text-base font-semibold text-slate-950 dark:text-white">{title}</p>
      <p className="mt-2 text-sm leading-7">{body}</p>
    </div>
  );
}

export function InsightPanel({ title, body }: { title: string; body: string }) {
  const { showInsights } = useEmbedOptions();

  if (!showInsights) {
    return null;
  }

  return (
    <div className="rounded-3xl border border-accent/15 bg-accent-soft p-5">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">{title}</p>
      <p className="mt-2 text-sm leading-7 text-slate-700 dark:text-slate-200">{body}</p>
    </div>
  );
}

export function ExamplePresetList({
  title,
  body,
  items
}: {
  title: string;
  body: string;
  items: Array<{
    label: string;
    description: string;
    onApply: () => void;
  }>;
}) {
  const { showExamples } = useEmbedOptions();

  if (!showExamples) {
    return null;
  }

  return (
    <div className="rounded-3xl border border-border bg-slate-50/80 p-5 dark:bg-slate-950/30">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">{title}</p>
      <p className="mt-2 text-sm leading-7 text-slate-700 dark:text-slate-200">{body}</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {items.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={item.onApply}
            className="rounded-2xl border border-border bg-white px-4 py-4 text-left transition hover:border-accent hover:bg-accent-soft dark:bg-slate-950/60"
          >
            <p className="text-sm font-semibold text-slate-950 dark:text-white">{item.label}</p>
            <p className="mt-1 text-sm leading-6 text-muted">{item.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

export function DecisionSummaryPanel({
  body,
  calculator,
  aiPrompt,
  verdict,
  highlights = [],
  exportTitle
}: {
  body: string;
  calculator?: string;
  aiPrompt?: string;
  verdict?: {
    label: string;
    tone: DecisionVerdictTone;
  };
  highlights?: string[];
  exportTitle?: string;
}) {
  const [aiBody, setAiBody] = useState<string | null>(null);
  const [aiStatus, setAiStatus] = useState<"idle" | "ready" | "unavailable" | "error">("idle");
  const [isLoading, setIsLoading] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");
  const { showComparison } = useEmbedOptions();
  const effectivePrompt = (aiPrompt ?? body).trim();
  const effectiveBody = aiBody || body;
  const exportSummary = [
    exportTitle ?? calculator ?? "Comparison summary",
    verdict ? `Verdict: ${verdict.label}` : null,
    highlights.length ? `Highlights:\n- ${highlights.join("\n- ")}` : null,
    `Summary:\n${effectiveBody}`
  ]
    .filter(Boolean)
    .join("\n\n");

  useEffect(() => {
    let isMounted = true;

    if (!showComparison || !calculator || !effectivePrompt) {
      setAiBody(null);
      setAiStatus("idle");
      return;
    }

    setIsLoading(true);

    fetch("/api/decision-summary", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        calculator,
        prompt: effectivePrompt
      })
    })
      .then(async (response) => {
        if (!response.ok) {
          return null;
        }

        const data = (await response.json()) as { summary?: string; status?: "ready" | "unavailable" | "error" };
        return {
          summary: data.summary?.trim() || null,
          status: data.status ?? "ready"
        };
      })
      .then((result) => {
        if (!isMounted) {
          return;
        }

        setAiBody(result?.summary ?? null);
        setAiStatus(result?.status ?? "unavailable");
      })
      .catch(() => {
        if (isMounted) {
          setAiBody(null);
          setAiStatus("error");
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [calculator, effectivePrompt, showComparison]);

  if (!showComparison) {
    return null;
  }

  const handleCopySummary = async () => {
    await navigator.clipboard.writeText(exportSummary);
    setCopyState("copied");
    window.setTimeout(() => setCopyState("idle"), 1800);
  };

  const handleDownloadSummary = () => {
    const blob = new Blob([exportSummary], { type: "text/plain;charset=utf-8" });
    const href = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.download = `${(exportTitle ?? calculator ?? "comparison-summary").toLowerCase().replace(/[^a-z0-9]+/g, "-")}.txt`;
    anchor.click();
    URL.revokeObjectURL(href);
  };

  return (
    <div className="rounded-3xl border border-accent/15 bg-accent-soft/70 p-5">
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">{aiBody ? "AI decision summary" : "Decision summary"}</p>
        {verdict ? <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${verdictToneClasses[verdict.tone]}`}>{verdict.label}</span> : null}
      </div>
      <p className="mt-2 text-sm leading-7 text-slate-700 dark:text-slate-200">{effectiveBody}</p>
      {highlights.length ? (
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {highlights.map((highlight) => (
            <div key={highlight} className="rounded-2xl border border-accent/10 bg-white/70 px-4 py-3 text-sm leading-6 text-slate-700 dark:bg-slate-950/40 dark:text-slate-200">
              {highlight}
            </div>
          ))}
        </div>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-3">
        <Button type="button" variant="secondary" onClick={handleCopySummary}>
          {copyState === "copied" ? "Summary copied" : "Copy summary"}
        </Button>
        <Button type="button" variant="ghost" onClick={handleDownloadSummary}>
          Export summary
        </Button>
      </div>
      {isLoading ? <p className="mt-2 text-xs leading-6 text-muted">Generating a more tailored summary...</p> : null}
      {!isLoading && aiStatus === "ready" && aiBody ? <p className="mt-2 text-xs leading-6 text-muted">AI is active for this comparison.</p> : null}
      {!isLoading && aiStatus === "unavailable" ? (
        <p className="mt-2 text-xs leading-6 text-muted">AI summary is unavailable right now, so this section is using the built-in calculator guidance instead.</p>
      ) : null}
      {!isLoading && aiStatus === "error" ? (
        <p className="mt-2 text-xs leading-6 text-muted">AI summary could not be generated for this comparison, so the built-in guidance is shown instead.</p>
      ) : null}
    </div>
  );
}

export function ComparisonControls({
  enabled,
  onEnable,
  onDisable,
  onCopyCurrent,
  title,
  body
}: {
  enabled: boolean;
  onEnable: () => void;
  onDisable: () => void;
  onCopyCurrent: () => void;
  title: string;
  body: string;
}) {
  const { showComparison } = useEmbedOptions();

  if (!showComparison) {
    return null;
  }

  return (
    <div className="rounded-3xl border border-border bg-slate-50/80 p-5 dark:bg-slate-950/30">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">{title}</p>
      <p className="mt-2 text-sm leading-7 text-slate-700 dark:text-slate-200">{body}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {!enabled ? (
          <Button type="button" variant="secondary" onClick={onEnable}>
            Add comparison
          </Button>
        ) : (
          <>
            <Button type="button" variant="secondary" onClick={onCopyCurrent}>
              Copy current into comparison
            </Button>
            <Button type="button" variant="ghost" onClick={onDisable}>
              Remove comparison
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
