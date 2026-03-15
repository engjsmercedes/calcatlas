"use client";

import { useMemo } from "react";

import { InputField } from "@/components/ui/input-field";
import { ResultCard } from "@/components/ui/result-card";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { calculateHeartRateZones } from "@/lib/calculators/health";

import { CalculatorActions, EmptyCalculatorState, ExamplePresetList, InsightPanel } from "./shared";

const initialState = {
  age: "35",
  restingHeartRate: "60"
};

export function HeartRateZoneCalculator() {
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({
    initialState,
    keys: ["age", "restingHeartRate"]
  });

  const result = useMemo(() => calculateHeartRateZones({ age: Number(state.age) || 0, restingHeartRate: Number(state.restingHeartRate) || undefined }), [state.age, state.restingHeartRate]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-4">
        <div className="surface space-y-5 p-6 md:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField label="Age" value={state.age} onChange={(event) => setState((current) => ({ ...current, age: event.target.value }))} />
            <InputField label="Resting heart rate" hint="Optional for Karvonen method" value={state.restingHeartRate} onChange={(event) => setState((current) => ({ ...current, restingHeartRate: event.target.value }))} />
          </div>
          <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
        </div>
        <ExamplePresetList
          title="Try an example"
          body="Use a preset to compare a percent-of-max estimate against a more individualized version that includes resting heart rate."
          items={[
            {
              label: "Percent-max baseline",
              description: "Age only. Good for a simple zone estimate when you do not track resting heart rate.",
              onApply: () => setState({ age: "35", restingHeartRate: "" })
            },
            {
              label: "Karvonen style",
              description: "Age plus resting heart rate. Useful when you want zones based on heart-rate reserve.",
              onApply: () => setState({ age: "35", restingHeartRate: "58" })
            }
          ]}
        />
      </div>
      <div className="space-y-4">
        {!result ? (
          <EmptyCalculatorState title="Enter at least your age" body="Age is enough to estimate max heart rate. Adding resting heart rate creates a more personalized zone range using heart-rate reserve." />
        ) : (
          <>
            <div className="surface space-y-4 p-6 md:p-8">
              <div>
                <p className="section-label">Heart-rate zones</p>
                <h3 className="mt-4 text-3xl font-semibold">Max HR about {result.maxHeartRate} bpm</h3>
                <p className="mt-2 text-sm leading-7">This zone chart uses the {result.method === "karvonen" ? "Karvonen heart-rate reserve" : "percent of max heart rate"} method.</p>
              </div>
              <div className="grid gap-3">
                {result.zones.map((zone) => (
                  <div key={zone.label} className={`rounded-2xl border p-4 ${zone.label === "Zone 2" ? "border-emerald-200 bg-emerald-50/80" : "border-border bg-white/60 dark:bg-slate-950/40"}`}>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-slate-950 dark:text-white">{zone.label}</p>
                      <p className="text-sm font-semibold text-slate-950 dark:text-white">{zone.minBpm}-{zone.maxBpm} bpm</p>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-muted">{zone.purpose}</p>
                  </div>
                ))}
              </div>
            </div>
            <InsightPanel title="Training use" body="Most easy endurance work happens in the lower zones, while threshold and interval sessions sit in the upper zones. If you use a watch or chest strap, these ranges are easier to apply than a single max-heart-rate number." />
          </>
        )}
      </div>
    </div>
  );
}
