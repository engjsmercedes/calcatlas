"use client";

import { useMemo } from "react";

import { InputField } from "@/components/ui/input-field";
import { ResultCard } from "@/components/ui/result-card";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { calculateOneRepMax } from "@/lib/calculators/health";
import { formatNumber, parseNumberInput } from "@/lib/utils";

import { CalculatorActions, EmptyCalculatorState, InsightPanel } from "./shared";

const initialState = {
  weight: "225",
  reps: "5"
};

export function OneRepMaxCalculator() {
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({
    initialState,
    keys: ["weight", "reps"]
  });

  const result = useMemo(() => calculateOneRepMax(parseNumberInput(state.weight) || 0, parseNumberInput(state.reps) || 0), [state]);

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="surface p-6 md:p-8 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField label="Weight lifted" value={state.weight} onChange={(event) => setState((current) => ({ ...current, weight: event.target.value }))} />
            <InputField label="Reps completed" value={state.reps} onChange={(event) => setState((current) => ({ ...current, reps: event.target.value }))} />
          </div>
          <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
        </div>
        <div className="space-y-4">
          {!result ? <EmptyCalculatorState title="Enter a working set" body="Use a weight and reps from a recent hard set to estimate your one-rep max and nearby training loads." /> : (
            <>
              <div className="surface p-6 md:p-8 space-y-4">
                <div>
                  <p className="section-label">Strength estimate</p>
                  <h3 className="mt-4 text-3xl font-semibold">{formatNumber(result.oneRepMax)} estimated 1RM</h3>
                  <p className="mt-2 text-sm leading-7">This uses the Epley formula, which works best when the rep set is challenging and performed with good technique.</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <ResultCard label="Estimated 1RM" value={formatNumber(result.oneRepMax)} tone="success" />
                  <ResultCard label="Working set" value={`${state.weight} x ${state.reps}`} />
                </div>
              </div>
              <div className="surface p-6 md:p-8 space-y-4">
                <h3 className="text-xl font-semibold">Estimated weights for 2-10 reps</h3>
                <div className="grid gap-3 sm:grid-cols-3">
                  {result.repTable.map((item) => <ResultCard key={item.reps} label={`${item.reps} reps`} value={formatNumber(item.estimatedWeight)} />)}
                </div>
              </div>
              <InsightPanel title="Programming note" body="Use the estimate to guide training loads, but do not treat it as exact. Bar speed, fatigue, and technique all influence what you can actually lift on a given day." />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
