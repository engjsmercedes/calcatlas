"use client";

import { useMemo } from "react";

import { InputField } from "@/components/ui/input-field";
import { ResultCard } from "@/components/ui/result-card";
import { SelectField } from "@/components/ui/select-field";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { calculateCalorieNeeds } from "@/lib/calculators/health";
import { formatNumber, parseNumberInput } from "@/lib/utils";

import { CalculatorActions, EmptyCalculatorState, InsightPanel } from "./shared";

const initialState = {
  age: "30",
  sex: "male",
  heightCm: "178",
  weightKg: "77",
  activityLevel: "moderate",
  goal: "maintain"
};

export function CalorieNeedsCalculator() {
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({
    initialState,
    keys: ["age", "sex", "heightCm", "weightKg", "activityLevel", "goal"]
  });

  const result = useMemo(
    () =>
      calculateCalorieNeeds({
        age: parseNumberInput(state.age) || 0,
        sex: state.sex as "male" | "female",
        heightCm: parseNumberInput(state.heightCm) || 0,
        weightKg: parseNumberInput(state.weightKg) || 0,
        activityLevel: state.activityLevel as any,
        goal: state.goal as any
      }),
    [state]
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="surface p-6 md:p-8 space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField label="Age" value={state.age} onChange={(event) => setState((current) => ({ ...current, age: event.target.value }))} />
          <SelectField label="Gender" value={state.sex} onChange={(event) => setState((current) => ({ ...current, sex: event.target.value }))}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </SelectField>
          <InputField label="Height (cm)" value={state.heightCm} onChange={(event) => setState((current) => ({ ...current, heightCm: event.target.value }))} />
          <InputField label="Weight (kg)" value={state.weightKg} onChange={(event) => setState((current) => ({ ...current, weightKg: event.target.value }))} />
          <SelectField label="Activity level" value={state.activityLevel} onChange={(event) => setState((current) => ({ ...current, activityLevel: event.target.value }))}>
            <option value="sedentary">Sedentary</option>
            <option value="light">Lightly active</option>
            <option value="moderate">Moderately active</option>
            <option value="active">Active</option>
            <option value="very-active">Very active</option>
          </SelectField>
          <SelectField label="Goal" value={state.goal} onChange={(event) => setState((current) => ({ ...current, goal: event.target.value }))}>
            <option value="maintain">Maintain</option>
            <option value="lose">Lose</option>
            <option value="gain">Gain</option>
          </SelectField>
        </div>
        <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
      </div>
      <div className="space-y-4">
        {!result ? <EmptyCalculatorState title="Add the basics" body="Age, sex, height, weight, and activity level are enough to estimate maintenance calories with the Mifflin-St Jeor equation." /> : (
          <>
            <div className="surface p-6 md:p-8 space-y-4">
              <div>
                <p className="section-label">Calorie target</p>
                <h3 className="mt-4 text-3xl font-semibold">{formatNumber(state.goal === "lose" ? result.lose : state.goal === "gain" ? result.gain : result.maintenance)} kcal/day</h3>
                <p className="mt-2 text-sm leading-7">Maintenance is about {formatNumber(result.maintenance)} calories per day based on your current body size and activity level.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <ResultCard label="Maintenance" value={`${formatNumber(result.maintenance)} kcal`} tone="success" />
                <ResultCard label="Weight loss" value={`${formatNumber(result.lose)} kcal`} />
                <ResultCard label="Weight gain" value={`${formatNumber(result.gain)} kcal`} />
                <ResultCard label="Estimated BMR" value={`${formatNumber(result.bmr)} kcal`} />
              </div>
            </div>
            <InsightPanel title="Formula note" body="This estimate uses the Mifflin-St Jeor formula for BMR and standard activity multipliers. It is a strong planning baseline, then real-world progress should guide adjustments." />
          </>
        )}
      </div>
    </div>
  );
}
