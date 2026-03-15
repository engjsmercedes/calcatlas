"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { useEmbedOptions } from "@/components/embed-options";

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
  const { showActions } = useEmbedOptions();

  const handleShare = async () => {
    await onShare();
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  if (!showActions) {
    return null;
  }

  return (
    <div className="print-hidden flex flex-wrap items-center gap-3">
      <Button variant="primary" type="button" onClick={handleShare} disabled={!hasActiveValues}>
        {copied ? "Link copied" : "Copy share link"}
      </Button>
      <Button variant="secondary" type="button" onClick={() => window.print()} disabled={!hasActiveValues}>
        Print result
      </Button>
      <Button variant="ghost" type="button" onClick={onReset}>
        Clear all
      </Button>
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
  aiPrompt
}: {
  body: string;
  calculator?: string;
  aiPrompt?: string;
}) {
  const [aiBody, setAiBody] = useState<string | null>(null);
  const [aiStatus, setAiStatus] = useState<"idle" | "ready" | "unavailable" | "error">("idle");
  const [isLoading, setIsLoading] = useState(false);
  const { showComparison } = useEmbedOptions();
  const effectivePrompt = (aiPrompt ?? body).trim();

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

  return (
    <div className="rounded-3xl border border-accent/15 bg-accent-soft/70 p-5">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">{aiBody ? "AI decision summary" : "Decision summary"}</p>
      <p className="mt-2 text-sm leading-7 text-slate-700 dark:text-slate-200">{aiBody || body}</p>
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
