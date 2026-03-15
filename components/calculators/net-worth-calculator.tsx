"use client";

import { useMemo } from "react";

import { InputField } from "@/components/ui/input-field";
import { ResultCard } from "@/components/ui/result-card";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { calculateNetWorth } from "@/lib/calculators/essentials";
import { formatCurrency, formatPercent, parseNumberInput } from "@/lib/utils";

import { CalculatorActions, EmptyCalculatorState, InsightPanel } from "./shared";

const initialState = {
  cash: "18000",
  investments: "65000",
  retirement: "92000",
  property: "380000",
  otherAssets: "12000",
  mortgage: "240000",
  loans: "18000",
  creditCards: "4500",
  otherLiabilities: "0"
};

export function NetWorthCalculator() {
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({
    initialState,
    keys: ["cash", "investments", "retirement", "property", "otherAssets", "mortgage", "loans", "creditCards", "otherLiabilities"]
  });

  const result = useMemo(
    () =>
      calculateNetWorth({
        cash: parseNumberInput(state.cash) || 0,
        investments: parseNumberInput(state.investments) || 0,
        retirement: parseNumberInput(state.retirement) || 0,
        property: parseNumberInput(state.property) || 0,
        otherAssets: parseNumberInput(state.otherAssets) || 0,
        mortgage: parseNumberInput(state.mortgage) || 0,
        loans: parseNumberInput(state.loans) || 0,
        creditCards: parseNumberInput(state.creditCards) || 0,
        otherLiabilities: parseNumberInput(state.otherLiabilities) || 0
      }),
    [state]
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="surface p-6 md:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField label="Cash" prefix="$" value={state.cash} onChange={(event) => setState((current) => ({ ...current, cash: event.target.value }))} />
          <InputField label="Investments" prefix="$" value={state.investments} onChange={(event) => setState((current) => ({ ...current, investments: event.target.value }))} />
          <InputField label="Retirement" prefix="$" value={state.retirement} onChange={(event) => setState((current) => ({ ...current, retirement: event.target.value }))} />
          <InputField label="Property value" prefix="$" value={state.property} onChange={(event) => setState((current) => ({ ...current, property: event.target.value }))} />
          <InputField label="Other assets" prefix="$" value={state.otherAssets} onChange={(event) => setState((current) => ({ ...current, otherAssets: event.target.value }))} />
          <InputField label="Mortgage" prefix="$" value={state.mortgage} onChange={(event) => setState((current) => ({ ...current, mortgage: event.target.value }))} />
          <InputField label="Loans" prefix="$" value={state.loans} onChange={(event) => setState((current) => ({ ...current, loans: event.target.value }))} />
          <InputField label="Credit cards" prefix="$" value={state.creditCards} onChange={(event) => setState((current) => ({ ...current, creditCards: event.target.value }))} />
          <InputField label="Other liabilities" prefix="$" value={state.otherLiabilities} onChange={(event) => setState((current) => ({ ...current, otherLiabilities: event.target.value }))} />
        </div>
        <div className="mt-6">
          <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
        </div>
      </div>
      <div className="space-y-4">
        {!result ? (
          <EmptyCalculatorState title="Add assets and liabilities" body="Enter what you own and what you owe to estimate total assets, total liabilities, and net worth." />
        ) : (
          <>
            <div className="surface space-y-4 p-6 md:p-8">
              <div>
                <p className="section-label">Net worth snapshot</p>
                <h3 className="mt-4 text-3xl font-semibold">{formatCurrency(result.netWorth)}</h3>
                <p className="mt-2 text-sm leading-7">
                  Total assets come to {formatCurrency(result.totalAssets)} and total liabilities come to {formatCurrency(result.totalLiabilities)}, which leaves an estimated net worth of {formatCurrency(result.netWorth)}.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <ResultCard label="Net worth" value={formatCurrency(result.netWorth)} tone={result.netWorth >= 0 ? "success" : "warning"} />
                <ResultCard label="Assets" value={formatCurrency(result.totalAssets)} />
                <ResultCard label="Liabilities" value={formatCurrency(result.totalLiabilities)} />
                <ResultCard label="Debt to assets" value={formatPercent(result.debtToAssetRatio * 100)} />
              </div>
            </div>
            <InsightPanel title="Planning note" body="Net worth is best used as a trend, not a single score. Updating the same categories consistently over time makes the number much more useful for tracking progress." />
          </>
        )}
      </div>
    </div>
  );
}
