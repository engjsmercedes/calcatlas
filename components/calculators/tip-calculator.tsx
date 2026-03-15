"use client";

import { useMemo } from "react";

import { InputField } from "@/components/ui/input-field";
import { ResultCard } from "@/components/ui/result-card";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { calculateTip } from "@/lib/calculators/planning";
import { formatCurrency, parseNumberInput } from "@/lib/utils";

import { CalculatorActions, EmptyCalculatorState, InsightPanel } from "./shared";

const initialState = {
  billAmount: "84",
  tipPercent: "18",
  splitCount: "2"
};

export function TipCalculator() {
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({
    initialState,
    keys: ["billAmount", "tipPercent", "splitCount"]
  });

  const result = useMemo(
    () =>
      calculateTip({
        billAmount: parseNumberInput(state.billAmount) || 0,
        tipPercent: parseNumberInput(state.tipPercent) || 0,
        splitCount: parseNumberInput(state.splitCount) || 0
      }),
    [state]
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="surface p-6 md:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField label="Bill amount" prefix="$" value={state.billAmount} onChange={(event) => setState((current) => ({ ...current, billAmount: event.target.value }))} />
          <InputField label="Tip percent" hint="Percent" value={state.tipPercent} onChange={(event) => setState((current) => ({ ...current, tipPercent: event.target.value }))} />
          <InputField label="Split between" hint="People" value={state.splitCount} onChange={(event) => setState((current) => ({ ...current, splitCount: event.target.value }))} />
        </div>
        <div className="mt-6">
          <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
        </div>
      </div>
      <div className="space-y-4">
        {!result ? (
          <EmptyCalculatorState title="Enter the bill details" body="Add the bill amount, tip percentage, and group size to calculate the tip, total, and per-person split instantly." />
        ) : (
          <>
            <div className="surface space-y-4 p-6 md:p-8">
              <div>
                <p className="section-label">Tip result</p>
                <h3 className="mt-4 text-3xl font-semibold">{formatCurrency(result.totalAmount)}</h3>
                <p className="mt-2 text-sm leading-7">
                  That includes a tip of {formatCurrency(result.tipAmount)} on a bill of {formatCurrency(parseNumberInput(state.billAmount) || 0)}.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <ResultCard label="Tip amount" value={formatCurrency(result.tipAmount)} tone="success" />
                <ResultCard label="Total bill" value={formatCurrency(result.totalAmount)} />
                <ResultCard label="Per person" value={formatCurrency(result.perPerson)} />
              </div>
            </div>
            <InsightPanel title="Useful context" body={`Splitting the total after tip gives a cleaner view of what each person owes. That makes this calculator useful for quick dining decisions on mobile as well as larger group checks.`} />
          </>
        )}
      </div>
    </div>
  );
}
