"use client";

import { useMemo } from "react";

import { InputField } from "@/components/ui/input-field";
import { ResultCard } from "@/components/ui/result-card";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { calculateOvertime } from "@/lib/calculators/practical";
import { formatCurrency, parseNumberInput } from "@/lib/utils";

import { CalculatorActions, EmptyCalculatorState, ExamplePresetList, InsightPanel } from "./shared";

const initialState = {
  hourlyRate: "25",
  regularHours: "40",
  overtimeHours: "8",
  overtimeMultiplier: "1.5"
};

export function OvertimeCalculator() {
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({
    initialState,
    keys: ["hourlyRate", "regularHours", "overtimeHours", "overtimeMultiplier"]
  });

  const result = useMemo(() => {
    const hourlyRate = parseNumberInput(state.hourlyRate);
    const regularHours = parseNumberInput(state.regularHours);
    const overtimeHours = parseNumberInput(state.overtimeHours);
    const overtimeMultiplier = parseNumberInput(state.overtimeMultiplier);

    if (
      hourlyRate === undefined ||
      regularHours === undefined ||
      overtimeHours === undefined ||
      overtimeMultiplier === undefined
    ) {
      return undefined;
    }

    return calculateOvertime({ hourlyRate, regularHours, overtimeHours, overtimeMultiplier });
  }, [state]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-4">
        <div className="surface p-6 md:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField label="Hourly rate" prefix="$" value={state.hourlyRate} onChange={(event) => setState((current) => ({ ...current, hourlyRate: event.target.value }))} />
            <InputField label="Regular hours" value={state.regularHours} onChange={(event) => setState((current) => ({ ...current, regularHours: event.target.value }))} />
            <InputField label="Overtime hours" value={state.overtimeHours} onChange={(event) => setState((current) => ({ ...current, overtimeHours: event.target.value }))} />
            <InputField label="Overtime multiplier" hint="Usually 1.5 or 2" value={state.overtimeMultiplier} onChange={(event) => setState((current) => ({ ...current, overtimeMultiplier: event.target.value }))} />
          </div>
          <div className="mt-6">
            <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
          </div>
        </div>
        <ExamplePresetList
          title="Try an example"
          body="Use presets to compare standard overtime against double-time shifts." 
          items={[
            { label: "Time-and-a-half week", description: "$25/hour, 40 regular hours, 8 overtime hours at 1.5x.", onApply: () => setState(initialState) },
            { label: "Double-time shift", description: "$30/hour, 40 regular hours, 10 overtime hours at 2x.", onApply: () => setState({ hourlyRate: "30", regularHours: "40", overtimeHours: "10", overtimeMultiplier: "2" }) }
          ]}
        />
      </div>
      <div className="space-y-4">
        {!result ? (
          <EmptyCalculatorState title="Enter hourly pay details" body="Add hourly rate and overtime assumptions to estimate total gross pay and the extra earnings created by overtime." />
        ) : (
          <>
            <div className="surface space-y-4 p-6 md:p-8">
              <div>
                <p className="section-label">Overtime pay</p>
                <h3 className="mt-4 text-3xl font-semibold">{formatCurrency(result.totalPay)} total</h3>
                <p className="mt-2 text-sm leading-7">Regular pay is {formatCurrency(result.regularPay)}, overtime adds {formatCurrency(result.overtimePay)}, and the overtime rate comes to {formatCurrency(result.overtimeRate)} per hour.</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <ResultCard label="Regular pay" value={formatCurrency(result.regularPay)} tone="success" />
                <ResultCard label="Overtime pay" value={formatCurrency(result.overtimePay)} />
                <ResultCard label="Total pay" value={formatCurrency(result.totalPay)} />
                <ResultCard label="Overtime rate" value={`${formatCurrency(result.overtimeRate)}/hr`} />
                <ResultCard label="Extra earned from premium" value={formatCurrency(result.extraEarned)} />
                <ResultCard label="Blended hourly rate" value={`${formatCurrency(result.blendedHourlyRate)}/hr`} />
              </div>
            </div>
            <InsightPanel title="Shift planning" body="Overtime pay often looks straightforward until you compare the premium earned above standard hourly pay. This makes it easier to judge whether extra hours meaningfully change the paycheck." />
          </>
        )}
      </div>
    </div>
  );
}
