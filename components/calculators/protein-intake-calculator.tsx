"use client";

import { useMemo } from "react";

import { InputField } from "@/components/ui/input-field";
import { PillTabs } from "@/components/ui/pill-tabs";
import { ResultCard } from "@/components/ui/result-card";
import { SelectField } from "@/components/ui/select-field";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { calculateProteinIntake } from "@/lib/calculators/health";
import { formatNumber, parseNumberInput } from "@/lib/utils";

import { CalculatorActions, EmptyCalculatorState, InsightPanel } from "./shared";

const initialState = {
  unitSystem: "imperial",
  weightLb: "170",
  weightKg: "77",
  activityLevel: "moderate",
  goal: "general"
};

export function ProteinIntakeCalculator() {
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({
    initialState,
    keys: ["unitSystem", "weightLb", "weightKg", "activityLevel", "goal"]
  });

  const result = useMemo(
    () =>
      calculateProteinIntake({
        unitSystem: state.unitSystem as any,
        weightLb: parseNumberInput(state.weightLb),
        weightKg: parseNumberInput(state.weightKg),
        activityLevel: state.activityLevel as any,
        goal: state.goal as any
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
          <SelectField label="Goal" value={state.goal} onChange={(event) => setState((current) => ({ ...current, goal: event.target.value }))}>
            <option value="general">General health</option>
            <option value="fat-loss">Fat loss</option>
            <option value="muscle-gain">Muscle gain</option>
          </SelectField>
        </div>
        <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
      </div>
      <div className="space-y-4">
        {!result ? <EmptyCalculatorState title="Enter body weight" body="Weight is the main driver here. Activity level and goal help narrow the range to something more useful." /> : (
          <>
            <div className="surface p-6 md:p-8 space-y-4">
              <div>
                <p className="section-label">Protein target</p>
                <h3 className="mt-4 text-3xl font-semibold">{formatNumber(result.target)} g / day</h3>
                <p className="mt-2 text-sm leading-7">A practical recommendation range is about {formatNumber(result.min)} to {formatNumber(result.max)} grams per day.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <ResultCard label="Target" value={`${formatNumber(result.target)} g`} tone="success" />
                <ResultCard label="Low end" value={`${formatNumber(result.min)} g`} />
                <ResultCard label="High end" value={`${formatNumber(result.max)} g`} />
              </div>
            </div>
            <InsightPanel title="Recommendation" body="Hitting the middle of the range consistently usually matters more than chasing a perfect number. If muscle gain or dieting recovery is the priority, leaning toward the upper half is usually more useful." />
          </>
        )}
      </div>
    </div>
  );
}
