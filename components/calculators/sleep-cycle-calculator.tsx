"use client";

import { useMemo } from "react";

import { InputField } from "@/components/ui/input-field";
import { PillTabs } from "@/components/ui/pill-tabs";
import { ResultCard } from "@/components/ui/result-card";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { calculateSleepCycle } from "@/lib/calculators/health";

import { CalculatorActions, EmptyCalculatorState, InsightPanel } from "./shared";

const initialState = {
  mode: "bedtime",
  time: "22:30",
  cycles: "5"
};

export function SleepCycleCalculator() {
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({
    initialState,
    keys: ["mode", "time", "cycles"]
  });

  const result = useMemo(
    () => calculateSleepCycle({ mode: state.mode as any, time: state.time, cycles: Number(state.cycles) || 0 }),
    [state]
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="surface p-6 md:p-8 space-y-5">
        <PillTabs options={[{ label: "Bedtime", value: "bedtime" }, { label: "Wake time", value: "wake-time" }]} value={state.mode as any} onChange={(mode) => setState((current) => ({ ...current, mode }))} />
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField label={state.mode === "bedtime" ? "Go to bed at" : "Need to wake at"} type="time" value={state.time} onChange={(event) => setState((current) => ({ ...current, time: event.target.value }))} />
          <InputField label="Desired sleep cycles" value={state.cycles} onChange={(event) => setState((current) => ({ ...current, cycles: event.target.value }))} />
        </div>
        <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
      </div>
      <div className="space-y-4">
        {!result ? <EmptyCalculatorState title="Choose a time" body="Pick either a bedtime or wake-up time and the calculator will show surrounding cycle-friendly options." /> : (
          <>
            <div className="surface p-6 md:p-8 space-y-4">
              <div>
                <p className="section-label">Sleep timing</p>
                <h3 className="mt-4 text-3xl font-semibold">{result.recommendations[1]}</h3>
                <p className="mt-2 text-sm leading-7">Recommendations assume roughly {result.cycleLengthMinutes}-minute sleep cycles and about {result.bufferMinutes} minutes to fall asleep.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {result.recommendations.map((time, index) => <ResultCard key={time + index} label={`Option ${index + 1}`} value={time} tone={index === 1 ? "success" : "default"} />)}
              </div>
            </div>
            <InsightPanel title="Sleep note" body="This does not replace sleep hygiene or total sleep duration, but waking at the end of a sleep cycle can feel smoother than waking mid-cycle." />
          </>
        )}
      </div>
    </div>
  );
}
