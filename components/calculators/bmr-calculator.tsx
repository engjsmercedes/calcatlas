"use client";

import { useMemo } from "react";

import { InputField } from "@/components/ui/input-field";
import { PillTabs } from "@/components/ui/pill-tabs";
import { ResultCard } from "@/components/ui/result-card";
import { SelectField } from "@/components/ui/select-field";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { calculateCalorieNeeds, feetAndInchesToTotalInches, inchesToCentimeters, poundsToKilograms, type Sex, type UnitSystem } from "@/lib/calculators/health";
import { formatNumber, parseNumberInput } from "@/lib/utils";

import { CalculatorActions, EmptyCalculatorState, ExamplePresetList, InsightPanel } from "./shared";

const initialState = {
  unitSystem: "imperial",
  sex: "male",
  age: "35",
  heightFeet: "5",
  heightInches: "10",
  heightCm: "178",
  weightLb: "180",
  weightKg: "81.6"
};

export function BmrCalculator() {
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({
    initialState,
    keys: ["unitSystem", "sex", "age", "heightFeet", "heightInches", "heightCm", "weightLb", "weightKg"]
  });

  const age = parseNumberInput(state.age);
  const heightCm = state.unitSystem === "metric"
    ? parseNumberInput(state.heightCm)
    : (() => {
        const feet = parseNumberInput(state.heightFeet);
        const inches = parseNumberInput(state.heightInches);
        if (feet === undefined || inches === undefined) return undefined;
        return inchesToCentimeters(feetAndInchesToTotalInches(feet, inches));
      })();
  const weightKg = state.unitSystem === "metric"
    ? parseNumberInput(state.weightKg)
    : (() => {
        const weightLb = parseNumberInput(state.weightLb);
        return weightLb === undefined ? undefined : poundsToKilograms(weightLb);
      })();

  const result = useMemo(() => {
    if (age === undefined || heightCm === undefined || weightKg === undefined) {
      return undefined;
    }
    return calculateCalorieNeeds({ age, sex: state.sex as Sex, heightCm, weightKg, activityLevel: "sedentary", goal: "maintain" });
  }, [age, heightCm, state.sex, weightKg]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-4">
        <div className="surface p-6 md:p-8">
          <div className="space-y-6">
            <PillTabs
              options={[{ label: "Imperial", value: "imperial" }, { label: "Metric", value: "metric" }]}
              value={state.unitSystem as UnitSystem}
              onChange={(value) => setState((current) => ({ ...current, unitSystem: value }))}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField label="Sex" value={state.sex} onChange={(event) => setState((current) => ({ ...current, sex: event.target.value }))}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </SelectField>
              <InputField label="Age" value={state.age} onChange={(event) => setState((current) => ({ ...current, age: event.target.value }))} />
              {state.unitSystem === "imperial" ? (
                <>
                  <InputField label="Height (feet)" value={state.heightFeet} onChange={(event) => setState((current) => ({ ...current, heightFeet: event.target.value }))} />
                  <InputField label="Height (inches)" value={state.heightInches} onChange={(event) => setState((current) => ({ ...current, heightInches: event.target.value }))} />
                  <InputField label="Weight (lb)" value={state.weightLb} onChange={(event) => setState((current) => ({ ...current, weightLb: event.target.value }))} />
                </>
              ) : (
                <>
                  <InputField label="Height (cm)" value={state.heightCm} onChange={(event) => setState((current) => ({ ...current, heightCm: event.target.value }))} />
                  <InputField label="Weight (kg)" value={state.weightKg} onChange={(event) => setState((current) => ({ ...current, weightKg: event.target.value }))} />
                </>
              )}
            </div>
            <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
          </div>
        </div>
        <ExamplePresetList
          title="Try an example"
          body="Use presets to compare BMR for different body sizes and see how the resting-energy estimate shifts even before activity is added."
          items={[
            { label: "Moderate build", description: "35-year-old male, 5 ft 10 in, 180 lb.", onApply: () => setState(initialState) },
            { label: "Metric example", description: "29-year-old female, 165 cm, 62 kg.", onApply: () => setState({ unitSystem: "metric", sex: "female", age: "29", heightFeet: "", heightInches: "", heightCm: "165", weightLb: "", weightKg: "62" }) }
          ]}
        />
      </div>
      <div className="space-y-4">
        {!result ? (
          <EmptyCalculatorState title="Enter body size and age" body="BMR depends on age, sex, height, and weight. Activity level does not change BMR itself; it changes TDEE and calorie planning after the resting estimate is calculated." />
        ) : (
          <>
            <div className="surface space-y-4 p-6 md:p-8">
              <div>
                <p className="section-label">BMR result</p>
                <h3 className="mt-4 text-3xl font-semibold">{formatNumber(result.bmr, 0)} calories/day</h3>
                <p className="mt-2 text-sm leading-7">
                  This is the estimated number of calories your body would burn at complete rest. A sedentary maintenance estimate would be around {formatNumber(result.maintenance, 0)} calories per day.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <ResultCard label="BMR" value={`${formatNumber(result.bmr, 0)} cal`} tone="success" />
                <ResultCard label="Sedentary maintenance" value={`${formatNumber(result.maintenance, 0)} cal`} />
                <ResultCard label="Estimated lose target" value={`${formatNumber(result.lose, 0)} cal`} />
                <ResultCard label="Estimated gain target" value={`${formatNumber(result.gain, 0)} cal`} />
              </div>
            </div>
            <InsightPanel title="Useful context" body="BMR is a resting estimate, not a daily living estimate. If you want a better full-day calorie target, the TDEE and Calorie calculators layer activity level and goal onto this baseline." />
          </>
        )}
      </div>
    </div>
  );
}
