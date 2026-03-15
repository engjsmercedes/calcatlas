"use client";

import { useMemo } from "react";

import { InputField } from "@/components/ui/input-field";
import { LineChart } from "@/components/ui/line-chart";
import { ResultCard } from "@/components/ui/result-card";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { calculateRefinance } from "@/lib/calculators/retirement";
import { formatCurrency, formatNumber, parseNumberInput } from "@/lib/utils";

import { CalculatorActions, EmptyCalculatorState, ExamplePresetList, InsightPanel } from "./shared";

const initialState = {
  currentBalance: "340000",
  currentRate: "6.8",
  currentYearsLeft: "27",
  newRate: "5.9",
  newTermYears: "30",
  closingCosts: "4500"
};

export function RefinanceCalculator() {
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({
    initialState,
    keys: ["currentBalance", "currentRate", "currentYearsLeft", "newRate", "newTermYears", "closingCosts"]
  });

  const currentBalance = parseNumberInput(state.currentBalance);
  const currentRate = parseNumberInput(state.currentRate);
  const currentYearsLeft = parseNumberInput(state.currentYearsLeft);
  const newRate = parseNumberInput(state.newRate);
  const newTermYears = parseNumberInput(state.newTermYears);
  const closingCosts = parseNumberInput(state.closingCosts);

  const result = useMemo(() => {
    if (currentBalance === undefined || currentRate === undefined || currentYearsLeft === undefined || newRate === undefined || newTermYears === undefined || closingCosts === undefined) {
      return undefined;
    }

    return calculateRefinance({
      currentBalance,
      currentRate,
      currentYearsLeft,
      newRate,
      newTermYears,
      closingCosts
    });
  }, [closingCosts, currentBalance, currentRate, currentYearsLeft, newRate, newTermYears]);

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          <div className="surface p-6 md:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField label="Current loan balance" prefix="$" value={state.currentBalance} onChange={(event) => setState((current) => ({ ...current, currentBalance: event.target.value }))} />
              <InputField label="Current rate" hint="Annual %" value={state.currentRate} onChange={(event) => setState((current) => ({ ...current, currentRate: event.target.value }))} />
              <InputField label="Current years left" value={state.currentYearsLeft} onChange={(event) => setState((current) => ({ ...current, currentYearsLeft: event.target.value }))} />
              <InputField label="New rate" hint="Annual %" value={state.newRate} onChange={(event) => setState((current) => ({ ...current, newRate: event.target.value }))} />
              <InputField label="New term" hint="Years" value={state.newTermYears} onChange={(event) => setState((current) => ({ ...current, newTermYears: event.target.value }))} />
              <InputField label="Closing costs" prefix="$" value={state.closingCosts} onChange={(event) => setState((current) => ({ ...current, closingCosts: event.target.value }))} />
            </div>
            <div className="mt-6">
              <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
            </div>
          </div>
          <ExamplePresetList
            title="Try an example"
            body="Use presets to compare a standard rate-drop refinance with a shorter-term refinance that trades monthly savings for lower lifetime interest."
            items={[
              {
                label: "Lower payment refinance",
                description: "$340,000 balance, 6.8% current rate, refinance to 5.9% over 30 years with $4,500 closing costs.",
                onApply: () => setState(initialState)
              },
              {
                label: "Shorter-term refinance",
                description: "Same balance refinanced into a 20-year loan at 5.7% with $4,500 closing costs.",
                onApply: () =>
                  setState({
                    currentBalance: "340000",
                    currentRate: "6.8",
                    currentYearsLeft: "27",
                    newRate: "5.7",
                    newTermYears: "20",
                    closingCosts: "4500"
                  })
              }
            ]}
          />
        </div>
        <div className="space-y-4">
          {!result ? (
            <EmptyCalculatorState title="Enter current and new loan terms" body="Use the remaining balance, current loan details, and proposed refinance terms to estimate monthly savings, break-even timing, and lifetime savings." />
          ) : (
            <>
              <div className="surface space-y-4 p-6 md:p-8">
                <div>
                  <p className="section-label">Refinance comparison</p>
                  <h3 className="mt-4 text-3xl font-semibold">{formatCurrency(result.newMonthlyPayment)} / month</h3>
                  <p className="mt-2 text-sm leading-7">
                    The refinance changes the payment by {formatCurrency(Math.abs(result.monthlySavings))} per month and reaches break-even in about {result.breakEvenMonths ? `${result.breakEvenMonths} months` : "no break-even within this setup"}.
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <ResultCard label="Current payment" value={formatCurrency(result.currentMonthlyPayment)} />
                  <ResultCard label="New payment" value={formatCurrency(result.newMonthlyPayment)} tone="success" />
                  <ResultCard label="Monthly savings" value={formatCurrency(result.monthlySavings)} tone={result.monthlySavings >= 0 ? "success" : "warning"} />
                  <ResultCard label="Break-even" value={result.breakEvenMonths ? `${result.breakEvenMonths} months` : "No break-even"} />
                  <ResultCard label="Current remaining interest" value={formatCurrency(result.currentRemainingInterest)} />
                  <ResultCard label="Lifetime savings after costs" value={formatCurrency(result.lifetimeSavings)} tone={result.lifetimeSavings >= 0 ? "success" : "warning"} />
                </div>
              </div>
              <InsightPanel title="Refinance note" body="A refinance can lower the monthly payment and still cost more over time if the new term is much longer or the closing costs take too long to recover. Break-even timing is usually the first check worth making." />
            </>
          )}
        </div>
      </div>
      {result ? (
        <LineChart
          labels={result.points.map((point) => point.year)}
          series={[
            { label: "Current loan balance", color: "#94a3b8", values: result.points.map((point) => point.currentBalance) },
            { label: "Refinance balance", color: "#0891b2", values: result.points.map((point) => point.refinanceBalance) }
          ]}
        />
      ) : null}
    </div>
  );
}
