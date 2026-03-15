"use client";

import { useMemo } from "react";

import { InputField } from "@/components/ui/input-field";
import { ResultCard } from "@/components/ui/result-card";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { calculateOvulation } from "@/lib/calculators/health";

import { CalculatorActions, EmptyCalculatorState, ExamplePresetList, InsightPanel } from "./shared";

const initialState = {
  lastPeriodDate: "2026-03-01",
  cycleLength: "28"
};

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function OvulationCalculator() {
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({
    initialState,
    keys: ["lastPeriodDate", "cycleLength"]
  });

  const result = useMemo(() => calculateOvulation({ lastPeriodDate: state.lastPeriodDate, cycleLength: Number(state.cycleLength) || 28 }), [state.lastPeriodDate, state.cycleLength]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-4">
        <div className="surface space-y-5 p-6 md:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField label="First day of last period" type="date" value={state.lastPeriodDate} onChange={(event) => setState((current) => ({ ...current, lastPeriodDate: event.target.value }))} />
            <InputField label="Cycle length" value={state.cycleLength} onChange={(event) => setState((current) => ({ ...current, cycleLength: event.target.value }))} />
          </div>
          <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
        </div>
        <ExamplePresetList
          title="Try an example"
          body="Use a common cycle example to see how ovulation date and fertile window estimates move as cycle length changes."
          items={[
            {
              label: "28-day cycle",
              description: "A common baseline cycle length used for fertility planning estimates.",
              onApply: () => setState({ lastPeriodDate: "2026-03-01", cycleLength: "28" })
            },
            {
              label: "32-day cycle",
              description: "A longer cycle pushes ovulation later, which shifts the likely fertile window too.",
              onApply: () => setState({ lastPeriodDate: "2026-03-01", cycleLength: "32" })
            }
          ]}
        />
      </div>
      <div className="space-y-4">
        {!result ? (
          <EmptyCalculatorState title="Enter a period date and cycle length" body="This estimate uses the first day of the last period and a cycle-length assumption to estimate ovulation and the fertile window." />
        ) : (
          <>
            <div className="surface space-y-4 p-6 md:p-8">
              <div>
                <p className="section-label">Ovulation estimate</p>
                <h3 className="mt-4 text-3xl font-semibold">{formatDate(result.ovulationDate)}</h3>
                <p className="mt-2 text-sm leading-7">The likely fertile window runs from about {formatDate(result.fertileStart)} to {formatDate(result.fertileEnd)} based on the cycle length entered.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <ResultCard label="Estimated ovulation" value={formatDate(result.ovulationDate)} tone="success" />
                <ResultCard label="Fertile window start" value={formatDate(result.fertileStart)} />
                <ResultCard label="Fertile window end" value={formatDate(result.fertileEnd)} />
                <ResultCard label="Next period estimate" value={formatDate(result.nextPeriod)} />
              </div>
            </div>
            <InsightPanel title="Fertility note" body="Ovulation estimates are only a starting point. Real cycles can vary month to month, so this is best used for general timing context rather than exact medical prediction." />
          </>
        )}
      </div>
    </div>
  );
}
