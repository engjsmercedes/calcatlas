"use client";

import { useMemo } from "react";

import { InputField } from "@/components/ui/input-field";
import { PillTabs } from "@/components/ui/pill-tabs";
import { ResultCard } from "@/components/ui/result-card";
import { SelectField } from "@/components/ui/select-field";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { calculateBodyFat } from "@/lib/calculators/health";
import { formatNumber, parseNumberInput } from "@/lib/utils";

import { CalculatorActions, EmptyCalculatorState, InsightPanel } from "./shared";

const initialState = {
  unitSystem: "imperial",
  sex: "male",
  heightInches: "70",
  neckInches: "15",
  waistInches: "34",
  hipsInches: "38",
  heightCm: "178",
  neckCm: "38",
  waistCm: "86",
  hipsCm: "96"
};

export function BodyFatCalculator() {
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({
    initialState,
    keys: ["unitSystem", "sex", "heightInches", "neckInches", "waistInches", "hipsInches", "heightCm", "neckCm", "waistCm", "hipsCm"]
  });

  const result = useMemo(
    () =>
      calculateBodyFat({
        unitSystem: state.unitSystem as "imperial" | "metric",
        sex: state.sex as "male" | "female",
        heightInches: parseNumberInput(state.heightInches),
        neckInches: parseNumberInput(state.neckInches),
        waistInches: parseNumberInput(state.waistInches),
        hipsInches: parseNumberInput(state.hipsInches),
        heightCm: parseNumberInput(state.heightCm),
        neckCm: parseNumberInput(state.neckCm),
        waistCm: parseNumberInput(state.waistCm),
        hipsCm: parseNumberInput(state.hipsCm)
      }),
    [state]
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="surface p-6 md:p-8 space-y-5">
        <div className="flex flex-wrap gap-3">
          <PillTabs options={[{ label: "Imperial", value: "imperial" }, { label: "Metric", value: "metric" }]} value={state.unitSystem as any} onChange={(unitSystem) => setState((current) => ({ ...current, unitSystem }))} />
          <PillTabs options={[{ label: "Male", value: "male" }, { label: "Female", value: "female" }]} value={state.sex as any} onChange={(sex) => setState((current) => ({ ...current, sex }))} />
        </div>
        {state.unitSystem === "imperial" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField label="Height (inches)" value={state.heightInches} onChange={(event) => setState((current) => ({ ...current, heightInches: event.target.value }))} />
            <InputField label="Neck (inches)" value={state.neckInches} onChange={(event) => setState((current) => ({ ...current, neckInches: event.target.value }))} />
            <InputField label="Waist (inches)" value={state.waistInches} onChange={(event) => setState((current) => ({ ...current, waistInches: event.target.value }))} />
            {state.sex === "female" ? <InputField label="Hips (inches)" value={state.hipsInches} onChange={(event) => setState((current) => ({ ...current, hipsInches: event.target.value }))} /> : null}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField label="Height (cm)" value={state.heightCm} onChange={(event) => setState((current) => ({ ...current, heightCm: event.target.value }))} />
            <InputField label="Neck (cm)" value={state.neckCm} onChange={(event) => setState((current) => ({ ...current, neckCm: event.target.value }))} />
            <InputField label="Waist (cm)" value={state.waistCm} onChange={(event) => setState((current) => ({ ...current, waistCm: event.target.value }))} />
            {state.sex === "female" ? <InputField label="Hips (cm)" value={state.hipsCm} onChange={(event) => setState((current) => ({ ...current, hipsCm: event.target.value }))} /> : null}
          </div>
        )}
        <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
      </div>
      <div className="space-y-4">
        {!result ? <EmptyCalculatorState title="Add measurements" body="The U.S. Navy body fat estimate uses height, neck, waist, and hips for women." /> : (
          <>
            <div className="surface p-6 md:p-8 space-y-4">
              <div>
                <p className="section-label">Body fat estimate</p>
                <h3 className="mt-4 text-3xl font-semibold">{formatNumber(result.bodyFat)}%</h3>
                <p className="mt-2 text-sm leading-7">Estimated body fat category: <strong>{result.category}</strong>.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <ResultCard label="Body fat" value={`${formatNumber(result.bodyFat)}%`} tone="success" />
                <ResultCard label="Category" value={result.category} />
              </div>
            </div>
            <InsightPanel title="Interpretation" body="This method is a convenient estimate based on circumference measurements. It is more useful for trend tracking than for treating a single reading as exact." />
          </>
        )}
      </div>
    </div>
  );
}
