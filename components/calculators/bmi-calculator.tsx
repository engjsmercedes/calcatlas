"use client";

import { useMemo } from "react";

import { InputField } from "@/components/ui/input-field";
import { PillTabs } from "@/components/ui/pill-tabs";
import { RangeGauge } from "@/components/ui/range-gauge";
import { ResultCard } from "@/components/ui/result-card";
import { SelectField } from "@/components/ui/select-field";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { calculateBmi } from "@/lib/calculators/health";
import { formatNumber, parseNumberInput } from "@/lib/utils";

import { CalculatorActions, EmptyCalculatorState, ExamplePresetList, InsightPanel } from "./shared";

const initialState = {
  unitSystem: "imperial",
  heightFeet: "5",
  heightInches: "10",
  heightCm: "178",
  weightLb: "170",
  weightKg: "77",
  age: "",
  sex: "male"
};

export function BmiCalculator() {
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({
    initialState,
    keys: ["unitSystem", "heightFeet", "heightInches", "heightCm", "weightLb", "weightKg", "age", "sex"]
  });

  const result = useMemo(
    () =>
      calculateBmi({
        unitSystem: state.unitSystem as "imperial" | "metric",
        heightFeet: parseNumberInput(state.heightFeet),
        heightInches: parseNumberInput(state.heightInches),
        heightCm: parseNumberInput(state.heightCm),
        weightLb: parseNumberInput(state.weightLb),
        weightKg: parseNumberInput(state.weightKg)
      }),
    [state]
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-4">
        <div className="surface space-y-5 p-6 md:p-8">
          <PillTabs
            options={[
              { label: "Imperial", value: "imperial" },
              { label: "Metric", value: "metric" }
            ]}
            value={state.unitSystem as "imperial" | "metric"}
            onChange={(unitSystem) => setState((current) => ({ ...current, unitSystem }))}
          />
          {state.unitSystem === "imperial" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField label="Height (feet)" value={state.heightFeet} onChange={(event) => setState((current) => ({ ...current, heightFeet: event.target.value }))} />
              <InputField label="Height (inches)" value={state.heightInches} onChange={(event) => setState((current) => ({ ...current, heightInches: event.target.value }))} />
              <InputField label="Weight (lb)" value={state.weightLb} onChange={(event) => setState((current) => ({ ...current, weightLb: event.target.value }))} />
              <InputField label="Age" hint="Optional" value={state.age} onChange={(event) => setState((current) => ({ ...current, age: event.target.value }))} />
              <SelectField label="Gender" value={state.sex} onChange={(event) => setState((current) => ({ ...current, sex: event.target.value }))}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </SelectField>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField label="Height (cm)" value={state.heightCm} onChange={(event) => setState((current) => ({ ...current, heightCm: event.target.value }))} />
              <InputField label="Weight (kg)" value={state.weightKg} onChange={(event) => setState((current) => ({ ...current, weightKg: event.target.value }))} />
              <InputField label="Age" hint="Optional" value={state.age} onChange={(event) => setState((current) => ({ ...current, age: event.target.value }))} />
              <SelectField label="Gender" value={state.sex} onChange={(event) => setState((current) => ({ ...current, sex: event.target.value }))}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </SelectField>
            </div>
          )}
          <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
        </div>
        <ExamplePresetList
          title="Try an example"
          body="Use a preset to see how BMI changes with different body-size scenarios. BMI itself uses only height and weight. Age, sex, and activity level can matter for interpretation, but they do not change the raw BMI formula."
          items={[
            {
              label: "Healthy-weight example",
              description: "5 ft 10 in, 170 lb. A quick example near the upper end of the healthy BMI range.",
              onApply: () =>
                setState({
                  unitSystem: "imperial",
                  heightFeet: "5",
                  heightInches: "10",
                  heightCm: "178",
                  weightLb: "170",
                  weightKg: "77",
                  age: "30",
                  sex: "male"
                })
            },
            {
              label: "Higher-BMI example",
              description: "5 ft 9 in, 212 lb. Useful for seeing how the category shifts when weight rises at the same general height.",
              onApply: () =>
                setState({
                  unitSystem: "imperial",
                  heightFeet: "5",
                  heightInches: "9",
                  heightCm: "175",
                  weightLb: "212",
                  weightKg: "96",
                  age: "45",
                  sex: "male"
                })
            }
          ]}
        />
      </div>
      <div className="space-y-4">
        {!result ? (
          <EmptyCalculatorState title="Enter height and weight" body="BMI needs only height and weight. Optional age and gender can help with interpretation, but the score itself is based on height and weight." />
        ) : (
          <>
            <RangeGauge
              title="BMI categories"
              value={result.bmi}
              min={15}
              max={40}
              centerLabel={formatNumber(result.bmi, 1)}
              unitLabel={result.category}
              segments={[
                { label: "Underweight", displayLabel: "Under", max: 18.5, color: "#3b82f6" },
                { label: "Healthy", max: 24.9, color: "#22c55e" },
                { label: "Overweight", displayLabel: "Over", max: 29.9, color: "#f59e0b" },
                { label: "Obese", max: 40, color: "#ef4444" }
              ]}
            />
            <div className="surface space-y-4 p-6 md:p-8">
              <div>
                <p className="section-label">BMI result</p>
                <h3 className="mt-4 text-3xl font-semibold">{formatNumber(result.bmi, 1)}</h3>
                <p className="mt-2 text-sm leading-7">This BMI falls into the <strong>{result.category}</strong> category based on standard adult BMI ranges.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <ResultCard label="BMI" value={formatNumber(result.bmi, 1)} tone="success" />
                <ResultCard label="Category" value={result.category} />
                <ResultCard label="Healthy range" value={`${formatNumber(result.healthyWeightRangeLb.min, 1)}-${formatNumber(result.healthyWeightRangeLb.max, 1)} lb`} />
              </div>
            </div>
            <InsightPanel title="Interpretation" body={`For this height, a healthy-weight range is about ${formatNumber(result.healthyWeightRangeKg.min, 1)} to ${formatNumber(result.healthyWeightRangeKg.max, 1)} kg. BMI is a quick screening tool, not a diagnosis, so body composition, muscle mass, age, and activity level still matter when interpreting the result.`} />
          </>
        )}
      </div>
    </div>
  );
}

