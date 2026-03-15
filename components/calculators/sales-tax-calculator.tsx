"use client";

import { useMemo } from "react";

import { InputField } from "@/components/ui/input-field";
import { PillTabs } from "@/components/ui/pill-tabs";
import { ResultCard } from "@/components/ui/result-card";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { calculateSalesTax } from "@/lib/calculators/practical";
import { formatCurrency, formatPercent, parseNumberInput } from "@/lib/utils";

import { CalculatorActions, EmptyCalculatorState, ExamplePresetList, InsightPanel } from "./shared";

const initialState = {
  mode: "add",
  amount: "120",
  taxRate: "8.25"
};

export function SalesTaxCalculator() {
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({
    initialState,
    keys: ["mode", "amount", "taxRate"]
  });

  const result = useMemo(() => {
    const amount = parseNumberInput(state.amount);
    const taxRate = parseNumberInput(state.taxRate);
    if (amount === undefined || taxRate === undefined) {
      return undefined;
    }
    return calculateSalesTax({ amount, taxRate, mode: state.mode === "extract" ? "extract" : "add" });
  }, [state]);

  const amountLabel = state.mode === "add" ? "Pre-tax amount" : "Total amount";

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-4">
        <div className="surface p-6 md:p-8">
          <div className="space-y-6">
            <PillTabs
              options={[{ label: "Add tax", value: "add" }, { label: "Extract tax", value: "extract" }]}
              value={state.mode}
              onChange={(mode) => setState((current) => ({ ...current, mode }))}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField label={amountLabel} prefix="$" value={state.amount} onChange={(event) => setState((current) => ({ ...current, amount: event.target.value }))} />
              <InputField label="Sales tax rate" hint="Percent" value={state.taxRate} onChange={(event) => setState((current) => ({ ...current, taxRate: event.target.value }))} />
            </div>
            <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
          </div>
        </div>
        <ExamplePresetList
          title="Try an example"
          body="Use presets to compare adding tax to a purchase against extracting tax from a total receipt." 
          items={[
            { label: "Add 8.25% tax", description: "Apply 8.25% sales tax to a $120 purchase.", onApply: () => setState(initialState) },
            { label: "Extract tax from total", description: "Work backward from a $216 total that already includes 7.5% sales tax.", onApply: () => setState({ mode: "extract", amount: "216", taxRate: "7.5" }) }
          ]}
        />
      </div>
      <div className="space-y-4">
        {!result ? (
          <EmptyCalculatorState title="Enter amount and tax rate" body="Add a pre-tax amount to calculate sales tax, or switch modes to extract the tax amount from a total that already includes tax." />
        ) : (
          <>
            <div className="surface space-y-4 p-6 md:p-8">
              <div>
                <p className="section-label">Sales tax result</p>
                <h3 className="mt-4 text-3xl font-semibold">{formatCurrency(result.total)}</h3>
                <p className="mt-2 text-sm leading-7">Tax amount is {formatCurrency(result.taxAmount)} at an effective sales tax rate of {formatPercent(result.effectiveTaxRate)}.</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <ResultCard label="Subtotal" value={formatCurrency(result.subtotal)} tone="success" />
                <ResultCard label="Tax amount" value={formatCurrency(result.taxAmount)} />
                <ResultCard label="Total" value={formatCurrency(result.total)} />
                <ResultCard label="Tax rate" value={formatPercent(result.effectiveTaxRate)} />
              </div>
            </div>
            <InsightPanel title="Checkout context" body="Sales tax can change whether a deal still fits the budget, especially on larger purchases. Extract mode is useful when you only have the final receipt total and want to know the untaxed price." />
          </>
        )}
      </div>
    </div>
  );
}
