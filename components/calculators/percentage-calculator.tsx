"use client";

import { useMemo } from "react";

import { InputField } from "@/components/ui/input-field";
import { PillTabs } from "@/components/ui/pill-tabs";
import { ResultCard } from "@/components/ui/result-card";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import {
  PercentageMode,
  calculatePercentOf,
  calculatePercentageChange,
  calculatePercentageOf
} from "@/lib/calculators/percentage";
import { formatNumber, formatPercent, parseNumberInput } from "@/lib/utils";

import { CalculatorActions, EmptyCalculatorState, InsightPanel } from "./shared";

const initialState = {
  mode: "of-number",
  percent: "",
  base: "",
  part: "",
  total: "",
  from: "",
  to: ""
};

export function PercentageCalculator() {
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({
    initialState,
    keys: ["mode", "percent", "base", "part", "total", "from", "to"]
  });

  const result = useMemo(() => {
    const mode = state.mode as PercentageMode;

    if (mode === "of-number") {
      const percent = parseNumberInput(state.percent);
      const base = parseNumberInput(state.base);
      if (percent === undefined || base === undefined) {
        return undefined;
      }

      const value = calculatePercentageOf(percent, base);
      return {
        title: `${formatPercent(percent)} of ${formatNumber(base)}`,
        summary: `${formatPercent(percent)} of ${formatNumber(base)} is ${formatNumber(value)}.`,
        cards: [
          { label: "Result", value: formatNumber(value), tone: "success" as const },
          { label: "Percent", value: formatPercent(percent) },
          { label: "Base number", value: formatNumber(base) }
        ],
        insight: "This is useful for discounts, tax estimates, tips, and any quick share-based calculation where the base number stays fixed."
      };
    }

    if (mode === "percent-of") {
      const part = parseNumberInput(state.part);
      const total = parseNumberInput(state.total);
      if (part === undefined || total === undefined) {
        return undefined;
      }

      const value = calculatePercentOf(part, total);
      if (value === undefined) {
        return {
          error: "The total cannot be zero in percent-of mode."
        };
      }

      return {
        title: `${formatNumber(part)} as a share of ${formatNumber(total)}`,
        summary: `${formatNumber(part)} is ${formatPercent(value)} of ${formatNumber(total)}.`,
        cards: [
          { label: "Percent", value: formatPercent(value), tone: "success" as const },
          { label: "Part", value: formatNumber(part) },
          { label: "Total", value: formatNumber(total) }
        ],
        insight: 'Use this view when you need completion rates, conversion rates, or any "what percent is X of Y" answer.'
      };
    }

    const from = parseNumberInput(state.from);
    const to = parseNumberInput(state.to);
    if (from === undefined || to === undefined) {
      return undefined;
    }

    const value = calculatePercentageChange(from, to);
    if (value === undefined) {
      return {
        error: "The starting value cannot be zero when you calculate percentage change."
      };
    }

    return {
      title: `Change from ${formatNumber(from)} to ${formatNumber(to)}`,
      summary: `The change is ${formatNumber(value.difference)} which equals ${formatPercent(value.percentage)}.`,
      cards: [
        {
          label: value.percentage >= 0 ? "Increase" : "Decrease",
          value: formatPercent(value.percentage),
          tone: value.percentage >= 0 ? ("success" as const) : ("warning" as const)
        },
        { label: "Difference", value: formatNumber(value.difference) },
        { label: "Ending value", value: formatNumber(to) }
      ],
      insight: "Percentage change is especially helpful for revenue growth, price changes, traffic swings, and performance reporting."
    };
  }, [state]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="surface p-6 md:p-8">
        <div className="space-y-4">
          <PillTabs
            options={[
              { label: "Of a number", value: "of-number" },
              { label: "Percent of", value: "percent-of" },
              { label: "Increase or decrease", value: "change" }
            ]}
            value={state.mode as PercentageMode}
            onChange={(mode) => setState((current) => ({ ...current, mode }))}
          />
          {state.mode === "of-number" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField
                label="Percentage"
                hint="Example: 18"
                value={state.percent}
                onChange={(event) => setState((current) => ({ ...current, percent: event.target.value }))}
              />
              <InputField
                label="Number"
                hint="Base value"
                value={state.base}
                onChange={(event) => setState((current) => ({ ...current, base: event.target.value }))}
              />
            </div>
          ) : null}
          {state.mode === "percent-of" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField
                label="Part"
                hint="Measured amount"
                value={state.part}
                onChange={(event) => setState((current) => ({ ...current, part: event.target.value }))}
              />
              <InputField
                label="Total"
                hint="Whole amount"
                value={state.total}
                onChange={(event) => setState((current) => ({ ...current, total: event.target.value }))}
              />
            </div>
          ) : null}
          {state.mode === "change" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField
                label="Starting value"
                hint="Original number"
                value={state.from}
                onChange={(event) => setState((current) => ({ ...current, from: event.target.value }))}
              />
              <InputField
                label="Ending value"
                hint="New number"
                value={state.to}
                onChange={(event) => setState((current) => ({ ...current, to: event.target.value }))}
              />
            </div>
          ) : null}
          <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
        </div>
      </div>
      <div className="space-y-4">
        {!result ? (
          <EmptyCalculatorState
            title="Start with two values"
            body="Choose the percentage mode you need, then fill in the fields. Results update instantly without clicking a button."
          />
        ) : "error" in result ? (
          <EmptyCalculatorState title="Check your inputs" body={result.error ?? "Check the values and try again."} />
        ) : (
          <>
            <div className="surface space-y-4 p-6 md:p-8">
              <div>
                <p className="section-label">Live result</p>
                <h3 className="mt-4 text-2xl font-semibold">{result.title}</h3>
                <p className="mt-2 text-sm leading-7">{result.summary}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {result.cards.map((card) => (
                  <ResultCard key={card.label} label={card.label} value={card.value} tone={card.tone} />
                ))}
              </div>
            </div>
            <InsightPanel title="Quick insight" body={result.insight} />
          </>
        )}
      </div>
    </div>
  );
}

