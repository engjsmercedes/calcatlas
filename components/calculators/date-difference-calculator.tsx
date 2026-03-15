"use client";

import { useMemo } from "react";

import { ResultCard } from "@/components/ui/result-card";
import { SelectField } from "@/components/ui/select-field";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { calculateDateDifference } from "@/lib/calculators/essentials";
import { formatNumber } from "@/lib/utils";

import { CalculatorActions, EmptyCalculatorState, InsightPanel } from "./shared";

const initialState = {
  startDate: "2026-01-01",
  endDate: "2026-12-31",
  includeEndDate: "no"
};

export function DateDifferenceCalculator() {
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({
    initialState,
    keys: ["startDate", "endDate", "includeEndDate"]
  });

  const result = useMemo(
    () => calculateDateDifference(state.startDate, state.endDate, state.includeEndDate === "yes"),
    [state]
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="surface p-6 md:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-900 dark:text-white">Start date</span>
            <input type="date" className="input-base" value={state.startDate} onChange={(event) => setState((current) => ({ ...current, startDate: event.target.value }))} />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-900 dark:text-white">End date</span>
            <input type="date" className="input-base" value={state.endDate} onChange={(event) => setState((current) => ({ ...current, endDate: event.target.value }))} />
          </label>
          <SelectField label="Count the end date?" value={state.includeEndDate} onChange={(event) => setState((current) => ({ ...current, includeEndDate: event.target.value }))}>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </SelectField>
        </div>
        <div className="mt-6">
          <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
        </div>
      </div>
      <div className="space-y-4">
        {!result ? (
          <EmptyCalculatorState title="Choose two dates" body="Add a start date and end date to measure the calendar gap in days, weeks, months, and a years-months-days breakdown." />
        ) : (
          <>
            <div className="surface space-y-4 p-6 md:p-8">
              <div>
                <p className="section-label">Date difference</p>
                <h3 className="mt-4 text-3xl font-semibold">{result.totalDays} days</h3>
                <p className="mt-2 text-sm leading-7">
                  The gap comes to {result.years} years, {result.months} months, and {result.days} days, with total lengths shown below for quick planning.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <ResultCard label="Total days" value={formatNumber(result.totalDays, 0)} tone="success" />
                <ResultCard label="Total weeks" value={formatNumber(result.totalWeeks, 1)} />
                <ResultCard label="Total months" value={formatNumber(result.totalMonths, 1)} />
                <ResultCard label="Calendar breakdown" value={`${result.years}y ${result.months}m ${result.days}d`} />
              </div>
            </div>
            <InsightPanel title="Useful context" body="Calendar differences and total-day differences are both useful, but they answer slightly different questions. Calendar breakdown is better for anniversaries and age-style comparisons, while total days and weeks are easier for planning timelines." />
          </>
        )}
      </div>
    </div>
  );
}
