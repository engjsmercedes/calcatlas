"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";

import type { CalculatorDefinition } from "@/data/calculators";

export function HomeSearch({ calculators }: { calculators: CalculatorDefinition[] }) {
  const [query, setQuery] = useState("");
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

  return (
    <div className="space-y-4">
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
              No matching calculators yet. Add more tools later in the calculator registry.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
