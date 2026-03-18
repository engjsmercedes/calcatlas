"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import type { CalculatorDefinition } from "@/data/calculators";

type FinderResponse = {
  title: string;
  summary: string;
  fallbackSummary: string;
  followUp: string;
  aiStatus: "ready" | "unavailable" | "error";
  promptExamples: string[];
  recommendedCalculators: Array<{
    slug: string;
    title: string;
    shortDescription: string;
    category: string;
    href: string;
  }>;
  recommendedHub: {
    slug: string;
    title: string;
    shortDescription: string;
    href: string;
  } | null;
};

const starterPrompts = [
  "I'm buying a home",
  "I want to pay off debt",
  "I'm comparing job offers",
  "I want to grow my savings"
];

export function HomeSearch({ calculators }: { calculators: CalculatorDefinition[] }) {
  const [mode, setMode] = useState<"search" | "finder">("search");
  const [query, setQuery] = useState("");
  const [finderQuery, setFinderQuery] = useState("");
  const [finderResult, setFinderResult] = useState<FinderResponse | null>(null);
  const [finderStatus, setFinderStatus] = useState<"idle" | "loading" | "error">("idle");
  const deferredQuery = useDeferredValue(query);

  const results = useMemo(() => {
    const normalized = deferredQuery.trim().toLowerCase();
    if (!normalized) {
      return calculators;
    }

    return calculators.filter((calculator) =>
      [calculator.title, calculator.shortDescription, calculator.category, ...calculator.searchTerms]
        .join(" ")
        .toLowerCase()
        .includes(normalized)
    );
  }, [calculators, deferredQuery]);

  const runFinder = async (message: string) => {
    const trimmed = message.trim();
    if (!trimmed) {
      return;
    }

    setFinderQuery(trimmed);
    setFinderStatus("loading");

    try {
      const response = await fetch("/api/calculator-guide", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: trimmed })
      });

      if (!response.ok) {
        throw new Error("Guide request failed");
      }

      const data = (await response.json()) as FinderResponse;
      setFinderResult(data);
      setFinderStatus("idle");
    } catch {
      setFinderResult(null);
      setFinderStatus("error");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setMode("search")}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            mode === "search" ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "border border-border bg-white/80 text-muted dark:bg-slate-950/50"
          }`}
        >
          Search calculators
        </button>
        <button
          type="button"
          onClick={() => setMode("finder")}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            mode === "finder" ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "border border-border bg-white/80 text-muted dark:bg-slate-950/50"
          }`}
        >
          Smart calculator finder
        </button>
      </div>

      {mode === "search" ? (
        <>
          <label className="block">
            <span className="sr-only">Search calculators</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="input-base h-14 rounded-full bg-white px-5 text-base text-slate-950 shadow-card placeholder:text-slate-500 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400"
              placeholder="Search by task, formula, or calculator name"
            />
          </label>
          <div className="surface max-h-72 overflow-y-auto p-2 dark:bg-slate-900">
            <div className="grid gap-2">
              {results.map((calculator) => (
                <Link
                  key={calculator.slug}
                  href={`/${calculator.slug}`}
                  className="rounded-2xl px-4 py-3 transition hover:bg-accent-soft dark:hover:bg-slate-800"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-950 dark:text-white">{calculator.title}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{calculator.shortDescription}</p>
                    </div>
                    <span className="text-xs font-medium uppercase tracking-[0.18em] text-accent">
                      {calculator.category}
                    </span>
                  </div>
                </Link>
              ))}
              {results.length === 0 ? (
                <div className="rounded-2xl px-4 py-6 text-sm text-muted">
                  No matching calculators yet. Try describing the decision instead of the formula.
                </div>
              ) : null}
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-4">
          <div className="rounded-3xl border border-border bg-white/85 p-4 shadow-card dark:bg-slate-900">
            <label className="block">
              <span className="sr-only">Describe your goal</span>
              <textarea
                value={finderQuery}
                onChange={(event) => setFinderQuery(event.target.value)}
                rows={3}
                className="input-base min-h-[112px] rounded-3xl px-5 py-4 text-base text-slate-950 shadow-none dark:bg-slate-800 dark:text-slate-100"
                placeholder="Describe the decision in plain language, like 'I'm buying a home' or 'I want to pay off debt.'"
              />
            </label>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button type="button" variant="primary" onClick={() => runFinder(finderQuery)} disabled={!finderQuery.trim() || finderStatus === "loading"}>
                {finderStatus === "loading" ? "Finding calculators..." : "Find the right calculators"}
              </Button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {(finderResult?.promptExamples?.length ? finderResult.promptExamples : starterPrompts).map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => runFinder(prompt)}
                  className="rounded-full border border-border bg-white px-3 py-2 text-sm text-slate-700 transition hover:border-accent hover:text-accent dark:bg-slate-950/60 dark:text-slate-200"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <div className="surface p-5 dark:bg-slate-900">
            {finderStatus === "error" ? (
              <div className="space-y-2">
                <p className="text-lg font-semibold text-slate-950 dark:text-white">Finder unavailable</p>
                <p className="text-sm leading-7 text-muted">The smart finder could not respond right now. Try again or use the calculator search instead.</p>
              </div>
            ) : finderResult ? (
              <div className="space-y-5">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{finderResult.title}</p>
                  <p className="text-base leading-7 text-slate-700 dark:text-slate-200">{finderResult.summary}</p>
                  <p className="text-sm leading-7 text-muted">{finderResult.followUp}</p>
                  {finderResult.aiStatus === "ready" ? (
                    <p className="text-xs leading-6 text-muted">AI is active for this recommendation.</p>
                  ) : null}
                </div>
                {finderResult.recommendedHub ? (
                  <Link href={finderResult.recommendedHub.href} className="block rounded-2xl border border-accent/20 bg-accent-soft px-4 py-4 transition hover:border-accent dark:bg-slate-800">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Suggested hub</p>
                    <p className="mt-1 font-semibold text-slate-950 dark:text-white">{finderResult.recommendedHub.title}</p>
                    <p className="mt-1 text-sm leading-6 text-muted">{finderResult.recommendedHub.shortDescription}</p>
                  </Link>
                ) : null}
                <div className="grid gap-2">
                  {finderResult.recommendedCalculators.map((calculator) => (
                    <Link
                      key={calculator.slug}
                      href={calculator.href}
                      className="rounded-2xl border border-border px-4 py-3 transition hover:border-accent hover:bg-accent-soft dark:hover:bg-slate-800"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-slate-950 dark:text-white">{calculator.title}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-300">{calculator.shortDescription}</p>
                        </div>
                        <span className="text-xs font-medium uppercase tracking-[0.18em] text-accent">{calculator.category}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-lg font-semibold text-slate-950 dark:text-white">Tell Calc Atlas what you are trying to do</p>
                <p className="text-sm leading-7 text-muted">Describe the decision, not the formula. The finder will route you into the right calculators and, when available, a matching hub page.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
