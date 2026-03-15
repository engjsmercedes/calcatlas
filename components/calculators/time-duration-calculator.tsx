"use client";

import { useMemo } from "react";

import { InputField } from "@/components/ui/input-field";
import { ResultCard } from "@/components/ui/result-card";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { calculateTimeDuration } from "@/lib/calculators/essentials";
import { formatNumber, parseNumberInput } from "@/lib/utils";

import { CalculatorActions, EmptyCalculatorState, InsightPanel } from "./shared";

const initialState = {
  startTime: "09:00",
  endTime: "17:30",
  breakMinutes: "30"
};

export function TimeDurationCalculator() {
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({
    initialState,
    keys: ["startTime", "endTime", "breakMinutes"]
  });

  const result = useMemo(
    () => calculateTimeDuration(state.startTime, state.endTime, parseNumberInput(state.breakMinutes) || 0),
    [state]
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="surface p-6 md:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-900 dark:text-white">Start time</span>
            <input type="time" className="input-base" value={state.startTime} onChange={(event) => setState((current) => ({ ...current, startTime: event.target.value }))} />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-slate-900 dark:text-white">End time</span>
            <input type="time" className="input-base" value={state.endTime} onChange={(event) => setState((current) => ({ ...current, endTime: event.target.value }))} />
          </label>
          <InputField label="Break time" hint="Minutes" value={state.breakMinutes} onChange={(event) => setState((current) => ({ ...current, breakMinutes: event.target.value }))} />
        </div>
        <div className="mt-6">
          <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
        </div>
      </div>
      <div className="space-y-4">
        {!result ? (
          <EmptyCalculatorState title="Enter the time range" body="Choose a start time, end time, and optional break to measure total working time or elapsed duration." />
        ) : (
          <>
            <div className="surface space-y-4 p-6 md:p-8">
              <div>
                <p className="section-label">Time duration</p>
                <h3 className="mt-4 text-3xl font-semibold">{result.hours}h {result.minutes}m</h3>
                <p className="mt-2 text-sm leading-7">
                  After subtracting the break, the total duration comes to {result.hours} hours and {result.minutes} minutes, or {formatNumber(result.decimalHours, 2)} decimal hours.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <ResultCard label="Hours and minutes" value={`${result.hours}h ${result.minutes}m`} tone="success" />
                <ResultCard label="Decimal hours" value={formatNumber(result.decimalHours, 2)} />
                <ResultCard label="Total minutes" value={formatNumber(result.totalMinutes, 0)} />
              </div>
            </div>
            <InsightPanel title="Useful context" body="If the end time is earlier than the start time, the calculator treats it as an overnight shift. That makes it useful for both work schedules and general elapsed-time planning." />
          </>
        )}
      </div>
    </div>
  );
}
