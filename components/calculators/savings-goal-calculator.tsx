"use client";

import { useMemo } from "react";

import { InputField } from "@/components/ui/input-field";
import { LineChart } from "@/components/ui/line-chart";
import { ResultCard } from "@/components/ui/result-card";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { calculateSavingsGoal } from "@/lib/calculators/planning";
import { formatCurrency, formatNumber, parseNumberInput } from "@/lib/utils";

import { CalculatorActions, EmptyCalculatorState, ExamplePresetList, InsightPanel } from "./shared";

const initialState = {
  currentSavings: "15000",
  targetAmount: "100000",
  monthlyContribution: "850",
  annualRate: "5.5"
};

export function SavingsGoalCalculator() {
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({
    initialState,
    keys: ["currentSavings", "targetAmount", "monthlyContribution", "annualRate"]
  });

  const result = useMemo(
    () =>
      calculateSavingsGoal({
        currentSavings: parseNumberInput(state.currentSavings) || 0,
        targetAmount: parseNumberInput(state.targetAmount) || 0,
        monthlyContribution: parseNumberInput(state.monthlyContribution) || 0,
        annualRate: parseNumberInput(state.annualRate) || 0
      }),
    [state]
  );

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="surface p-6 md:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField label="Current savings" prefix="$" value={state.currentSavings} onChange={(event) => setState((current) => ({ ...current, currentSavings: event.target.value }))} />
            <InputField label="Target amount" prefix="$" value={state.targetAmount} onChange={(event) => setState((current) => ({ ...current, targetAmount: event.target.value }))} />
            <InputField label="Monthly contribution" prefix="$" value={state.monthlyContribution} onChange={(event) => setState((current) => ({ ...current, monthlyContribution: event.target.value }))} />
            <InputField label="Annual return" hint="Percent" value={state.annualRate} onChange={(event) => setState((current) => ({ ...current, annualRate: event.target.value }))} />
          </div>
          <div className="mt-6">
            <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
          </div>
        </div>
        <ExamplePresetList
          title="Try an example"
          body="Use presets to compare a more conservative emergency-fund plan against a more aggressive long-term savings push."
          items={[
            {
              label: "Emergency fund build",
              description: "$5,000 saved today, $15,000 target, and steady monthly deposits for a shorter-term goal.",
              onApply: () =>
                setState({
                  currentSavings: "5000",
                  targetAmount: "15000",
                  monthlyContribution: "500",
                  annualRate: "4"
                })
            },
            {
              label: "Six-figure goal",
              description: "$15,000 saved already with an $850 monthly contribution and moderate growth toward a larger target.",
              onApply: () =>
                setState({
                  currentSavings: "15000",
                  targetAmount: "100000",
                  monthlyContribution: "850",
                  annualRate: "5.5"
                })
            }
          ]}
        />
        <div className="space-y-4">
          {!result ? (
            <EmptyCalculatorState title="Set the savings target" body="Add current savings, the goal amount, monthly contributions, and an expected return to estimate how long it could take to get there." />
          ) : (
            <>
              <div className="surface space-y-4 p-6 md:p-8">
                <div>
                  <p className="section-label">Savings timeline</p>
                  <h3 className="mt-4 text-3xl font-semibold">{result.yearsToGoal} years</h3>
                  <p className="mt-2 text-sm leading-7">
                    At {state.annualRate}% annual growth with {formatCurrency(parseNumberInput(state.monthlyContribution) || 0)} contributed each month, the goal could be reached in about {result.monthsToGoal} months.
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <ResultCard label="Time to goal" value={`${result.monthsToGoal} months`} tone="success" />
                  <ResultCard label="Projected interest" value={formatCurrency(result.interestEarned)} />
                  <ResultCard label="Total contributions" value={formatCurrency(result.totalContributions)} />
                  <ResultCard label="Monthly needed with no growth" value={formatCurrency(result.monthlyRateNeededWithoutInterest)} />
                </div>
              </div>
              <InsightPanel title="Useful context" body={`This goal becomes easier to reach when time and contributions work together. Even a moderate rate of return can replace a meaningful amount of the monthly saving you would otherwise need without growth.`} />
            </>
          )}
        </div>
      </div>
      {result ? (
        <LineChart labels={result.points.map((point) => point.year)} series={[{ label: "Projected savings balance", color: "#0891b2", values: result.points.map((point) => point.balance) }]} />
      ) : null}
    </div>
  );
}
