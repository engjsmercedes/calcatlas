"use client";

import { useMemo } from "react";

import { ResultCard } from "@/components/ui/result-card";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { calculateAgeFromDates } from "@/lib/calculators/essentials";
import { formatNumber } from "@/lib/utils";

import { CalculatorActions, EmptyCalculatorState, InsightPanel } from "./shared";

const today = new Date().toISOString().slice(0, 10);
const initialState = {
  birthDate: "1990-06-15",
  compareDate: today
};

function NativeFieldLabel({ label, tooltip }: { label: string; tooltip: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-semibold text-slate-900 dark:text-white">{label}</span>
      <span
        className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-border text-[11px] font-semibold text-muted"
        title={tooltip}
        aria-label={tooltip}
      >
        ?
      </span>
    </div>
  );
}

export function AgeCalculator() {
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({
    initialState,
    keys: ["birthDate", "compareDate"]
  });

  const result = useMemo(() => calculateAgeFromDates(state.birthDate, state.compareDate), [state]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="surface p-6 md:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-2">
            <NativeFieldLabel label="Birth date" tooltip="Date of birth used as the starting point for the age calculation." />
            <input type="date" className="input-base" value={state.birthDate} onChange={(event) => setState((current) => ({ ...current, birthDate: event.target.value }))} />
          </label>
          <label className="block space-y-2">
            <NativeFieldLabel label="Age on date" tooltip="Date you want to measure age against, usually today or a future eligibility date." />
            <input type="date" className="input-base" value={state.compareDate} onChange={(event) => setState((current) => ({ ...current, compareDate: event.target.value }))} />
          </label>
        </div>
        <div className="mt-6">
          <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
        </div>
      </div>
      <div className="space-y-4">
        {!result ? (
          <EmptyCalculatorState title="Enter the date range" body="Choose a birth date and comparison date to calculate exact age in years, months, days, and total days lived." />
        ) : (
          <>
            <div className="surface space-y-4 p-6 md:p-8">
              <div>
                <p className="section-label">Exact age</p>
                <h3 className="mt-4 text-3xl font-semibold">{result.years} years, {result.months} months</h3>
                <p className="mt-2 text-sm leading-7">
                  On the selected date, the age comes out to {result.years} years, {result.months} months, and {result.days} days, with {formatNumber(result.totalDays, 0)} total days lived.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <ResultCard label="Years" value={String(result.years)} tone="success" />
                <ResultCard label="Total months" value={formatNumber(result.totalMonths, 0)} />
                <ResultCard label="Total weeks" value={formatNumber(result.totalWeeks, 1)} />
                <ResultCard label="Days to next birthday" value={formatNumber(result.daysUntilBirthday, 0)} />
              </div>
            </div>
            <InsightPanel title="Useful context" body="Age can be expressed a few different ways depending on the task. Exact years help with forms and eligibility checks, while total days or weeks can be more useful for milestone planning and comparisons." />
          </>
        )}
      </div>
    </div>
  );
}
