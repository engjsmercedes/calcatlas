"use client";

import { useMemo } from "react";

import { InputField } from "@/components/ui/input-field";
import { PillTabs } from "@/components/ui/pill-tabs";
import { ResultCard } from "@/components/ui/result-card";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { calculateStepsToCalories } from "@/lib/calculators/health";
import { formatNumber, parseNumberInput } from "@/lib/utils";

import { CalculatorActions, EmptyCalculatorState, ExamplePresetList, InsightPanel } from "./shared";

const initialState = {
  unitSystem: "imperial",
  steps: "10000",
  weightLb: "170",
  weightKg: "77",
  heightFeet: "5",
  heightInches: "10",
  heightCm: "178"
};

export function StepsToCaloriesCalculator() {
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({
    initialState,
    keys: ["unitSystem", "steps", "weightLb", "weightKg", "heightFeet", "heightInches", "heightCm"]
  });

  const result = useMemo(() =>
    calculateStepsToCalories({
      unitSystem: state.unitSystem as any,
      steps: parseNumberInput(state.steps) || 0,
      weightLb: parseNumberInput(state.weightLb),
      weightKg: parseNumberInput(state.weightKg),
      heightFeet: parseNumberInput(state.heightFeet),
      heightInches: parseNumberInput(state.heightInches),
      heightCm: parseNumberInput(state.heightCm)
    }),
  [state]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-4">
        <div className="surface space-y-5 p-6 md:p-8">
          <PillTabs
            options={[{ label: "Imperial", value: "imperial" }, { label: "Metric", value: "metric" }]}
            value={state.unitSystem as any}
            onChange={(unitSystem) => setState((current) => ({ ...current, unitSystem }))}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField label="Steps" value={state.steps} onChange={(event) => setState((current) => ({ ...current, steps: event.target.value }))} />
            {state.unitSystem === "imperial" ? (
              <>
                <InputField label="Weight (lb)" value={state.weightLb} onChange={(event) => setState((current) => ({ ...current, weightLb: event.target.value }))} />
                <InputField label="Height (feet)" value={state.heightFeet} onChange={(event) => setState((current) => ({ ...current, heightFeet: event.target.value }))} />
                <InputField label="Height (inches)" value={state.heightInches} onChange={(event) => setState((current) => ({ ...current, heightInches: event.target.value }))} />
              </>
            ) : (
              <>
                <InputField label="Weight (kg)" value={state.weightKg} onChange={(event) => setState((current) => ({ ...current, weightKg: event.target.value }))} />
                <InputField label="Height (cm)" value={state.heightCm} onChange={(event) => setState((current) => ({ ...current, heightCm: event.target.value }))} />
              </>
            )}
          </div>
          <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
        </div>
        <ExamplePresetList
          title="Try an example"
          body="Use a preset daily-step total to compare a typical target against a higher-volume walking day. Height helps estimate stride length, which improves the distance estimate behind calories burned."
          items={[
            {
              label: "10,000-step day",
              description: "A common daily step target with average adult body size inputs.",
              onApply: () => setState({ unitSystem: "imperial", steps: "10000", weightLb: "170", weightKg: "77", heightFeet: "5", heightInches: "10", heightCm: "178" })
            },
            {
              label: "15,000-step day",
              description: "A more active walking day that shows how distance and calorie burn scale with steps.",
              onApply: () => setState({ unitSystem: "imperial", steps: "15000", weightLb: "170", weightKg: "77", heightFeet: "5", heightInches: "10", heightCm: "178" })
            }
          ]}
        />
      </div>
      <div className="space-y-4">
        {!result ? (
          <EmptyCalculatorState title="Enter steps and body size" body="Steps plus body size are enough to estimate walking distance and a rough calories-burned figure from that distance." />
        ) : (
          <>
            <div className="surface space-y-4 p-6 md:p-8">
              <div>
                <p className="section-label">Calories estimate</p>
                <h3 className="mt-4 text-3xl font-semibold">{formatNumber(result.calories)} kcal</h3>
                <p className="mt-2 text-sm leading-7">That step count works out to about {formatNumber(result.distanceMiles, 2)} miles or {formatNumber(result.distanceKilometers, 2)} km using your estimated stride length.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <ResultCard label="Calories burned" value={`${formatNumber(result.calories)} kcal`} tone="success" />
                <ResultCard label="Estimated distance" value={`${formatNumber(result.distanceMiles, 2)} mi`} />
                <ResultCard label="Stride length" value={`${formatNumber(result.strideInches, 1)} in`} />
              </div>
            </div>
            <InsightPanel title="Estimate note" body="This is a walking-based estimate, not a lab measurement. Terrain, pace, body composition, and efficiency all change the real calorie burn, so the result is best used for daily tracking context rather than exact accounting." />
          </>
        )}
      </div>
    </div>
  );
}
