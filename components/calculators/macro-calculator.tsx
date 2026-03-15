"use client";

import { useMemo } from "react";

import { InputField } from "@/components/ui/input-field";
import { ResultCard } from "@/components/ui/result-card";
import { SelectField } from "@/components/ui/select-field";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { calculateMacros } from "@/lib/calculators/health";
import { formatNumber, parseNumberInput } from "@/lib/utils";

import { CalculatorActions, EmptyCalculatorState, InsightPanel } from "./shared";

const initialState = {
  age: "30",
  sex: "male",
  heightCm: "178",
  weightKg: "77",
  activityLevel: "moderate",
  goal: "maintenance",
  style: "balanced"
};

export function MacroCalculator() {
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({
    initialState,
    keys: ["age", "sex", "heightCm", "weightKg", "activityLevel", "goal", "style"]
  });

  const result = useMemo(
    () =>
      calculateMacros({
        age: parseNumberInput(state.age) || 0,
        sex: state.sex as any,
        heightCm: parseNumberInput(state.heightCm) || 0,
        weightKg: parseNumberInput(state.weightKg) || 0,
        activityLevel: state.activityLevel as any,
        goal: state.goal as any,
        style: state.style as any
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
            <option value="fat-loss">Fat loss</option>
            <option value="maintenance">Maintenance</option>
            <option value="muscle-gain">Muscle gain</option>
          </SelectField>
          <SelectField label="Macro style" value={state.style} onChange={(event) => setState((current) => ({ ...current, style: event.target.value }))}>
            <option value="balanced">Balanced</option>
            <option value="higher-protein">Higher protein</option>
            <option value="lower-carb">Lower carb</option>
          </SelectField>
        </div>
        <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
      </div>
      <div className="space-y-4">
        {!result ? <EmptyCalculatorState title="Add body stats" body="Macros build on an estimated calorie target, which is why age, size, sex, and activity level all matter here." /> : (
          <>
            <div className="surface p-6 md:p-8 space-y-4">
              <div>
                <p className="section-label">Macro target</p>
                <h3 className="mt-4 text-3xl font-semibold">{formatNumber(result.calories)} kcal/day</h3>
                <p className="mt-2 text-sm leading-7">Maintenance calories are about {formatNumber(result.maintenanceCalories)} per day before goal and macro-style adjustments.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <ResultCard label="Protein" value={`${formatNumber(result.proteinGrams)} g`} tone="success" />
                <ResultCard label="Carbs" value={`${formatNumber(result.carbsGrams)} g`} />
                <ResultCard label="Fat" value={`${formatNumber(result.fatGrams)} g`} />
                <ResultCard label="Calories" value={`${formatNumber(result.calories)} kcal`} />
              </div>
            </div>
            <InsightPanel title="Practical use" body="This macro split gives you a useful starting point for meal planning. If training performance, hunger, or recovery feels off, adjust the macro style instead of only changing calories." />
          </>
        )}
      </div>
    </div>
  );
}
