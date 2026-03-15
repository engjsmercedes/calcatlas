"use client";

import { useMemo } from "react";

import { InputField } from "@/components/ui/input-field";
import { PillTabs } from "@/components/ui/pill-tabs";
import { ResultCard } from "@/components/ui/result-card";
import { SelectField } from "@/components/ui/select-field";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { calculateWaterIntake } from "@/lib/calculators/health";
import { formatNumber, parseNumberInput } from "@/lib/utils";

import { CalculatorActions, EmptyCalculatorState, InsightPanel } from "./shared";

const initialState = {
  unitSystem: "imperial",
  weightLb: "170",
  weightKg: "77",
  activityLevel: "moderate",
  climateAdjustment: "moderate"
};

export function WaterIntakeCalculator() {
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({
    initialState,
    keys: ["unitSystem", "weightLb", "weightKg", "activityLevel", "climateAdjustment"]
  });

  const result = useMemo(
    () =>
      calculateWaterIntake({
        unitSystem: state.unitSystem as any,
        weightLb: parseNumberInput(state.weightLb),
        weightKg: parseNumberInput(state.weightKg),
        activityLevel: state.activityLevel as any,
        climateAdjustment: state.climateAdjustment as any
      }),
    [state]
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="surface p-6 md:p-8 space-y-5">
        <PillTabs options={[{ label: "Imperial", value: "imperial" }, { label: "Metric", value: "metric" }]} value={state.unitSystem as any} onChange={(unitSystem) => setState((current) => ({ ...current, unitSystem }))} />
        <div className="grid gap-4 sm:grid-cols-2">
          {state.unitSystem === "imperial" ? <InputField label="Weight (lb)" value={state.weightLb} onChange={(event) => setState((current) => ({ ...current, weightLb: event.target.value }))} /> : <InputField label="Weight (kg)" value={state.weightKg} onChange={(event) => setState((current) => ({ ...current, weightKg: event.target.value }))} />}
          <SelectField label="Activity level" value={state.activityLevel} onChange={(event) => setState((current) => ({ ...current, activityLevel: event.target.value }))}>
            <option value="sedentary">Sedentary</option>
            <option value="light">Lightly active</option>
            <option value="moderate">Moderately active</option>
            <option value="active">Active</option>
            <option value="very-active">Very active</option>
          </SelectField>
          <SelectField label="Climate or sweat level" value={state.climateAdjustment} onChange={(event) => setState((current) => ({ ...current, climateAdjustment: event.target.value }))}>
            <option value="cool">Cool / low sweat</option>
            <option value="moderate">Moderate</option>
            <option value="hot">Hot / high sweat</option>
          </SelectField>
        </div>
        <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
      </div>
      <div className="space-y-4">
        {!result ? <EmptyCalculatorState title="Enter your weight" body="Water intake starts with body weight, then activity and climate help adjust the recommendation." /> : (
          <>
            <div className="surface p-6 md:p-8 space-y-4">
              <div>
                <p className="section-label">Hydration target</p>
                <h3 className="mt-4 text-3xl font-semibold">{formatNumber(result.liters)} L / day</h3>
                <p className="mt-2 text-sm leading-7">That is about {formatNumber(result.ounces)} fluid ounces or {formatNumber(result.cups)} cups each day.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <ResultCard label="Liters" value={`${formatNumber(result.liters)} L`} tone="success" />
                <ResultCard label="Ounces" value={`${formatNumber(result.ounces)} oz`} />
                <ResultCard label="Cups" value={`${formatNumber(result.cups)} cups`} />
              </div>
            </div>
            <InsightPanel title="Recommendation" body="This estimate gives you a practical starting point. Heat, exercise duration, caffeine, altitude, and medical guidance can all justify drinking more or less than the baseline." />
          </>
        )}
      </div>
    </div>
  );
}
