"use client";

import { useMemo } from "react";

import { InputField } from "@/components/ui/input-field";
import { ResultCard } from "@/components/ui/result-card";
import { SelectField } from "@/components/ui/select-field";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { calculateTdee } from "@/lib/calculators/health";
import { formatNumber, parseNumberInput } from "@/lib/utils";

import { CalculatorActions, EmptyCalculatorState, ExamplePresetList, InsightPanel } from "./shared";

const initialState = {
  age: "32",
  sex: "male",
  heightCm: "180",
  weightKg: "82",
  activityLevel: "moderate",
  goal: "maintain"
};

export function TdeeCalculator() {
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({
    initialState,
    keys: ["age", "sex", "heightCm", "weightKg", "activityLevel", "goal"]
  });

  const age = parseNumberInput(state.age);
  const heightCm = parseNumberInput(state.heightCm);
  const weightKg = parseNumberInput(state.weightKg);

  const result = useMemo(() => {
    if (age === undefined || heightCm === undefined || weightKg === undefined) {
      return undefined;
    }

    return calculateTdee({
      age,
      sex: state.sex as "male" | "female",
      heightCm,
      weightKg,
      activityLevel: state.activityLevel as any,
      goal: state.goal as any
    });
  }, [age, heightCm, weightKg, state.sex, state.activityLevel, state.goal]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-4">
        <div className="surface space-y-5 p-6 md:p-8">
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
        <ExamplePresetList
          title="Try an example"
          body="Use a preset to compare how activity level changes total daily energy expenditure even when height and weight stay the same."
          items={[
            {
              label: "Desk-job baseline",
              description: "Sedentary 32-year-old male at 180 cm and 82 kg. Useful for a low-activity maintenance estimate.",
              onApply: () => setState({ age: "32", sex: "male", heightCm: "180", weightKg: "82", activityLevel: "sedentary", goal: "maintain" })
            },
            {
              label: "Training week",
              description: "Same body size but active. Good for seeing how much TDEE can move with higher weekly training volume.",
              onApply: () => setState({ age: "32", sex: "male", heightCm: "180", weightKg: "82", activityLevel: "active", goal: "maintain" })
            }
          ]}
        />
      </div>
      <div className="space-y-4">
        {!result ? (
          <EmptyCalculatorState title="Add body size and activity" body="TDEE needs age, sex, height, weight, and activity level because activity multiplier has a major effect on the daily calorie estimate." />
        ) : (
          <>
            <div className="surface space-y-4 p-6 md:p-8">
              <div>
                <p className="section-label">TDEE estimate</p>
                <h3 className="mt-4 text-3xl font-semibold">{formatNumber(result.tdee)} kcal/day</h3>
                <p className="mt-2 text-sm leading-7">At an activity multiplier of {result.activityMultiplier.toFixed(3)}, your estimated total daily energy expenditure is about {formatNumber(result.tdee)} calories per day.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <ResultCard label="TDEE" value={`${formatNumber(result.tdee)} kcal`} tone="success" />
                <ResultCard label="BMR" value={`${formatNumber(result.bmr)} kcal`} />
                <ResultCard label="Goal target" value={`${formatNumber(result.targetCalories)} kcal`} />
                <ResultCard label="Activity multiplier" value={result.activityMultiplier.toFixed(3)} />
              </div>
            </div>
            <InsightPanel title="How to use TDEE" body="TDEE is a planning baseline, not a permanent truth. If your body weight or training volume changes, the estimate should move too. Use the result as a starting calorie target, then adjust based on real progress." />
          </>
        )}
      </div>
    </div>
  );
}
