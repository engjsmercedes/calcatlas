"use client";

import { useMemo } from "react";

import { InputField } from "@/components/ui/input-field";
import { LineChart } from "@/components/ui/line-chart";
import { ResultCard } from "@/components/ui/result-card";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { calculateRetirement } from "@/lib/calculators/retirement";
import { formatCurrency, formatNumber, parseNumberInput } from "@/lib/utils";

import { CalculatorActions, EmptyCalculatorState, ExamplePresetList, InsightPanel } from "./shared";

const initialState = {
  currentAge: "35",
  retirementAge: "67",
  currentSavings: "85000",
  monthlyContribution: "900",
  annualReturn: "7",
  withdrawalRate: "4"
};

export function RetirementCalculator() {
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({
    initialState,
    keys: ["currentAge", "retirementAge", "currentSavings", "monthlyContribution", "annualReturn", "withdrawalRate"]
  });

  const currentAge = parseNumberInput(state.currentAge);
  const retirementAge = parseNumberInput(state.retirementAge);
  const currentSavings = parseNumberInput(state.currentSavings);
  const monthlyContribution = parseNumberInput(state.monthlyContribution);
  const annualReturn = parseNumberInput(state.annualReturn);
  const withdrawalRate = parseNumberInput(state.withdrawalRate);

  const result = useMemo(() => {
    if (
      currentAge === undefined ||
      retirementAge === undefined ||
      currentSavings === undefined ||
      monthlyContribution === undefined ||
      annualReturn === undefined ||
      withdrawalRate === undefined
    ) {
      return undefined;
    }

    return calculateRetirement({
      currentAge,
      retirementAge,
      currentSavings,
      monthlyContribution,
      annualReturn,
      withdrawalRate
    });
  }, [annualReturn, currentAge, currentSavings, monthlyContribution, retirementAge, withdrawalRate]);

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          <div className="surface p-6 md:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField label="Current age" value={state.currentAge} onChange={(event) => setState((current) => ({ ...current, currentAge: event.target.value }))} />
              <InputField label="Retirement age" value={state.retirementAge} onChange={(event) => setState((current) => ({ ...current, retirementAge: event.target.value }))} />
              <InputField label="Current savings" prefix="$" value={state.currentSavings} onChange={(event) => setState((current) => ({ ...current, currentSavings: event.target.value }))} />
              <InputField label="Monthly contribution" prefix="$" value={state.monthlyContribution} onChange={(event) => setState((current) => ({ ...current, monthlyContribution: event.target.value }))} />
              <InputField label="Annual return" hint="Expected yearly %" value={state.annualReturn} onChange={(event) => setState((current) => ({ ...current, annualReturn: event.target.value }))} />
              <InputField label="Withdrawal rate" hint="Planning %" value={state.withdrawalRate} onChange={(event) => setState((current) => ({ ...current, withdrawalRate: event.target.value }))} />
            </div>
            <div className="mt-6">
              <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
            </div>
          </div>
          <ExamplePresetList
            title="Try an example"
            body="Use presets to compare a steady mid-career plan against a later start that needs higher contributions."
            items={[
              {
                label: "Steady long-term plan",
                description: "Age 35 to 67, $85,000 saved, $900 per month, 7% return, 4% withdrawal rate.",
                onApply: () => setState(initialState)
              },
              {
                label: "Later start catch-up",
                description: "Age 45 to 67, $60,000 saved, $1,500 per month, 7% return, 4% withdrawal rate.",
                onApply: () =>
                  setState({
                    currentAge: "45",
                    retirementAge: "67",
                    currentSavings: "60000",
                    monthlyContribution: "1500",
                    annualReturn: "7",
                    withdrawalRate: "4"
                  })
              }
            ]}
          />
        </div>
        <div className="space-y-4">
          {!result ? (
            <EmptyCalculatorState title="Set the retirement timeline" body="Enter your age, target retirement age, savings balance, and contribution plan to project a retirement pot and a rough withdrawal amount." />
          ) : (
            <>
              <div className="surface space-y-4 p-6 md:p-8">
                <div>
                  <p className="section-label">Retirement projection</p>
                  <h3 className="mt-4 text-3xl font-semibold">{formatCurrency(result.futureBalance)}</h3>
                  <p className="mt-2 text-sm leading-7">
                    In about {result.yearsUntilRetirement} years, this plan could grow to {formatCurrency(result.futureBalance)} and support roughly {formatCurrency(result.estimatedAnnualIncome)} per year using a {state.withdrawalRate}% withdrawal rate.
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <ResultCard label="Future balance" value={formatCurrency(result.futureBalance)} tone="success" />
                  <ResultCard label="Annual retirement income" value={formatCurrency(result.estimatedAnnualIncome)} />
                  <ResultCard label="Monthly retirement income" value={formatCurrency(result.estimatedMonthlyIncome)} />
                  <ResultCard label="Total contributions" value={formatCurrency(result.totalContributions)} />
                  <ResultCard label="Investment growth" value={formatCurrency(result.investmentGrowth)} />
                  <ResultCard label="Years until retirement" value={`${result.yearsUntilRetirement}`} />
                </div>
              </div>
              <InsightPanel title="Planning note" body="Retirement projections are highly sensitive to time horizon, return assumptions, and contribution consistency. The withdrawal-rate estimate is a planning shortcut, not a guarantee of sustainable income." />
            </>
          )}
        </div>
      </div>
      {result ? (
        <LineChart
          labels={result.points.map((point) => point.age)}
          series={[
            { label: "Projected balance", color: "#0891b2", values: result.points.map((point) => point.balance) },
            { label: "Total contributions", color: "#94a3b8", values: result.points.map((point) => point.contributions) }
          ]}
        />
      ) : null}
    </div>
  );
}
