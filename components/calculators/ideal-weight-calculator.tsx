"use client";

import { useMemo } from "react";

import { InputField } from "@/components/ui/input-field";
import { PillTabs } from "@/components/ui/pill-tabs";
import { ResultCard } from "@/components/ui/result-card";
import { SelectField } from "@/components/ui/select-field";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { calculateIdealWeight } from "@/lib/calculators/health";
import { formatNumber, parseNumberInput } from "@/lib/utils";

import { CalculatorActions, EmptyCalculatorState, InsightPanel } from "./shared";

const initialState = {
  unitSystem: "imperial",
  sex: "male",
  heightFeet: "5",
  heightInches: "10",
  heightCm: "178"
};

export function IdealWeightCalculator() {
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({
    initialState,
    keys: ["unitSystem", "sex", "heightFeet", "heightInches", "heightCm"]
  });

  const result = useMemo(
    () =>
      calculateIdealWeight({
        unitSystem: state.unitSystem as any,
        sex: state.sex as any,
        heightFeet: parseNumberInput(state.heightFeet),
        heightInches: parseNumberInput(state.heightInches),
        heightCm: parseNumberInput(state.heightCm)
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
            <InputField label="Height (feet)" value={state.heightFeet} onChange={(event) => setState((current) => ({ ...current, heightFeet: event.target.value }))} />
            <InputField label="Height (inches)" value={state.heightInches} onChange={(event) => setState((current) => ({ ...current, heightInches: event.target.value }))} />
          </div>
        ) : (
          <InputField label="Height (cm)" value={state.heightCm} onChange={(event) => setState((current) => ({ ...current, heightCm: event.target.value }))} />
        )}
        <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
      </div>
      <div className="space-y-4">
        {!result ? <EmptyCalculatorState title="Enter your height" body="Ideal weight estimates need only height and sex. This version shows a single formula estimate plus a healthy BMI range." /> : (
          <>
            <div className="surface p-6 md:p-8 space-y-4">
              <div>
                <p className="section-label">Weight estimate</p>
                <h3 className="mt-4 text-3xl font-semibold">{formatNumber(result.devineLb)} lb</h3>
                <p className="mt-2 text-sm leading-7">Estimated ideal weight using the Devine formula, with a healthy BMI range shown alongside it.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <ResultCard label="Devine estimate" value={`${formatNumber(result.devineLb)} lb`} tone="success" />
                <ResultCard label="Healthy range" value={`${formatNumber(result.healthyRangeLb.min)}-${formatNumber(result.healthyRangeLb.max)} lb`} />
                <ResultCard label="Metric range" value={`${formatNumber(result.healthyRangeKg.min)}-${formatNumber(result.healthyRangeKg.max)} kg`} />
              </div>
            </div>
            <InsightPanel title="How to use it" body="Ideal weight formulas are best treated as reference points, not hard targets. Use them together with strength, energy, medical context, and body-composition goals." />
          </>
        )}
      </div>
    </div>
  );
}
