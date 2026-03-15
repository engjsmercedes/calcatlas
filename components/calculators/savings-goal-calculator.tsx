"use client";

import { useMemo, useState } from "react";

import { InputField } from "@/components/ui/input-field";
import { LineChart } from "@/components/ui/line-chart";
import { ResultCard } from "@/components/ui/result-card";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { calculateSavingsGoal } from "@/lib/calculators/planning";
import { formatCurrency, parseNumberInput } from "@/lib/utils";

import { CalculatorActions, ComparisonControls, DecisionSummaryPanel, EmptyCalculatorState, ExamplePresetList, InsightPanel } from "./shared";

const initialState = {
  currentSavings: "15000",
  targetAmount: "100000",
  monthlyContribution: "850",
  annualRate: "5.5"
};

export function SavingsGoalCalculator() {
  const [comparisonEnabled, setComparisonEnabled] = useState(false);
  const [comparisonState, setComparisonState] = useState(initialState);
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

  const comparisonResult = useMemo(
    () =>
      comparisonEnabled
        ? calculateSavingsGoal({
            currentSavings: parseNumberInput(comparisonState.currentSavings) || 0,
            targetAmount: parseNumberInput(comparisonState.targetAmount) || 0,
            monthlyContribution: parseNumberInput(comparisonState.monthlyContribution) || 0,
            annualRate: parseNumberInput(comparisonState.annualRate) || 0
          })
        : undefined,
    [comparisonEnabled, comparisonState]
  );

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
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
          <ComparisonControls
            enabled={comparisonEnabled}
            onEnable={() => {
              setComparisonEnabled(true);
              setComparisonState(state);
            }}
            onDisable={() => setComparisonEnabled(false)}
            onCopyCurrent={() => setComparisonState(state)}
            title="Compare two savings plans"
            body="Compare contribution levels and return assumptions to see which plan reaches the goal faster."
          />
          {comparisonEnabled ? (
            <div className="surface p-6 md:p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <InputField label="Compare current savings" prefix="$" value={comparisonState.currentSavings} onChange={(event) => setComparisonState((current) => ({ ...current, currentSavings: event.target.value }))} />
                <InputField label="Compare target amount" prefix="$" value={comparisonState.targetAmount} onChange={(event) => setComparisonState((current) => ({ ...current, targetAmount: event.target.value }))} />
                <InputField label="Compare monthly contribution" prefix="$" value={comparisonState.monthlyContribution} onChange={(event) => setComparisonState((current) => ({ ...current, monthlyContribution: event.target.value }))} />
                <InputField label="Compare annual return" hint="Percent" value={comparisonState.annualRate} onChange={(event) => setComparisonState((current) => ({ ...current, annualRate: event.target.value }))} />
              </div>
            </div>
          ) : null}
        </div>
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
              <InsightPanel title="Useful context" body="This goal becomes easier to reach when time and contributions work together. Even a moderate rate of return can replace a meaningful amount of the monthly saving you would otherwise need without growth." />
              {comparisonEnabled && comparisonResult ? (
                <div className="surface space-y-4 p-6 md:p-8">
                  <div>
                    <p className="section-label">Comparison summary</p>
                    <h3 className="mt-4 text-2xl font-semibold">How the second plan changes the timeline</h3>
                    <p className="mt-2 text-sm leading-7">
                      The comparison plan changes time to goal by {comparisonResult.monthsToGoal - result.monthsToGoal} months and projected interest by {formatCurrency(comparisonResult.interestEarned - result.interestEarned)}.
                    </p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <ResultCard label="Scenario B time to goal" value={`${comparisonResult.monthsToGoal} months`} />
                    <ResultCard label="Timeline delta" value={`${comparisonResult.monthsToGoal - result.monthsToGoal} months`} tone={comparisonResult.monthsToGoal <= result.monthsToGoal ? "success" : "default"} />
                    <ResultCard label="Scenario B projected interest" value={formatCurrency(comparisonResult.interestEarned)} />
                    <ResultCard label="Interest delta" value={formatCurrency(comparisonResult.interestEarned - result.interestEarned)} tone={comparisonResult.interestEarned >= result.interestEarned ? "success" : "default"} />
                  </div>`r`n                  <DecisionSummaryPanel body={comparisonResult.monthsToGoal <= result.monthsToGoal && comparisonResult.interestEarned >= result.interestEarned ? `Scenario B is the stronger savings plan because it reaches the goal sooner and still compounds more interest along the way.` : comparisonResult.monthsToGoal <= result.monthsToGoal ? `Scenario B gets to the goal faster, but part of the speed comes from contributing more cash. It is the better fit only if the higher saving rate is sustainable.` : comparisonResult.interestEarned >= result.interestEarned ? `Scenario B compounds more interest, but it takes longer to hit the target. It is better when efficiency matters more than hitting the goal on the earliest timeline.` : `The primary plan remains the more balanced route to the goal because Scenario B does not improve the timeline-versus-contribution tradeoff enough.`} />
                </div>
              ) : null}
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


