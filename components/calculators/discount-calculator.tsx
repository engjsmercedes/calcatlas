"use client";

import { useMemo } from "react";

import { InputField } from "@/components/ui/input-field";
import { ResultCard } from "@/components/ui/result-card";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { calculateDiscount } from "@/lib/calculators/planning";
import { formatCurrency, formatPercent, parseNumberInput } from "@/lib/utils";

import { CalculatorActions, EmptyCalculatorState, InsightPanel } from "./shared";

const initialState = {
  originalPrice: "120",
  discountPercent: "25",
  extraPercentOff: "10"
};

export function DiscountCalculator() {
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({
    initialState,
    keys: ["originalPrice", "discountPercent", "extraPercentOff"]
  });

  const result = useMemo(
    () =>
      calculateDiscount({
        originalPrice: parseNumberInput(state.originalPrice) || 0,
        discountPercent: parseNumberInput(state.discountPercent) || 0,
        extraPercentOff: parseNumberInput(state.extraPercentOff) || 0
      }),
    [state]
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="surface p-6 md:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField label="Original price" prefix="$" value={state.originalPrice} onChange={(event) => setState((current) => ({ ...current, originalPrice: event.target.value }))} />
          <InputField label="Discount" hint="Percent" value={state.discountPercent} onChange={(event) => setState((current) => ({ ...current, discountPercent: event.target.value }))} />
          <InputField label="Extra off" hint="Percent after sale" value={state.extraPercentOff} onChange={(event) => setState((current) => ({ ...current, extraPercentOff: event.target.value }))} />
        </div>
        <div className="mt-6">
          <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
        </div>
      </div>
      <div className="space-y-4">
        {!result ? (
          <EmptyCalculatorState title="Enter the sale price inputs" body="Add the original price and discount to calculate sale price, savings, and the effective discount after stacked offers." />
        ) : (
          <>
            <div className="surface space-y-4 p-6 md:p-8">
              <div>
                <p className="section-label">Discount result</p>
                <h3 className="mt-4 text-3xl font-semibold">{formatCurrency(result.salePrice)}</h3>
                <p className="mt-2 text-sm leading-7">
                  You save {formatCurrency(result.savings)} versus the original price, which works out to an effective discount of {formatPercent(result.effectiveDiscount)}.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <ResultCard label="Sale price" value={formatCurrency(result.salePrice)} tone="success" />
                <ResultCard label="Savings" value={formatCurrency(result.savings)} />
                <ResultCard label="Effective discount" value={formatPercent(result.effectiveDiscount)} />
              </div>
            </div>
            <InsightPanel title="Useful context" body={`Stacked discounts do not add together directly. A 25% discount plus another 10% off the sale price is less than 35% off the original price, which is why the effective discount view matters.`} />
          </>
        )}
      </div>
    </div>
  );
}
