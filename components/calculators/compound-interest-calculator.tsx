"use client";

import { useMemo } from "react";

import { InputField } from "@/components/ui/input-field";
import { LineChart } from "@/components/ui/line-chart";
import { ResultCard } from "@/components/ui/result-card";
import { SelectField } from "@/components/ui/select-field";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { calculateCompoundInterest } from "@/lib/calculators/compound-interest";
import { formatCurrency, parseNumberInput } from "@/lib/utils";

import { CalculatorActions, EmptyCalculatorState, ExamplePresetList, InsightPanel } from "./shared";

const initialState = {
  initialAmount: "10000",
  contributionAmount: "500",
  contributionFrequency: "monthly",
  annualRate: "7",
  years: "20",
  compoundingFrequency: "monthly"
};

export function CompoundInterestCalculator() {
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({
    initialState,
    keys: [
      "initialAmount",
      "contributionAmount",
      "contributionFrequency",
      "annualRate",
      "years",
      "compoundingFrequency"
    ]
  });

  const result = useMemo(
    () =>
      calculateCompoundInterest({
        initialAmount: parseNumberInput(state.initialAmount) || 0,
        contributionAmount: parseNumberInput(state.contributionAmount) || 0,
        contributionFrequency: state.contributionFrequency as "monthly" | "quarterly" | "annually",
        annualRate: parseNumberInput(state.annualRate) || 0,
        years: parseNumberInput(state.years) || 0,
        compoundingFrequency: state.compoundingFrequency as "annually" | "quarterly" | "monthly" | "daily"
      }),
    [state]
  );

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          <div className="surface p-6 md:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField
                label="Initial amount"
                prefix="$"
                value={state.initialAmount}
                onChange={(event) => setState((current) => ({ ...current, initialAmount: event.target.value }))}
              />
              <InputField
                label="Contribution amount"
                prefix="$"
                value={state.contributionAmount}
                onChange={(event) => setState((current) => ({ ...current, contributionAmount: event.target.value }))}
              />
              <SelectField
                label="Contribution frequency"
                value={state.contributionFrequency}
                onChange={(event) => setState((current) => ({ ...current, contributionFrequency: event.target.value }))}
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annually">Annually</option>
              </SelectField>
              <InputField
                label="Annual rate"
                hint="Expected yearly return %"
                value={state.annualRate}
                onChange={(event) => setState((current) => ({ ...current, annualRate: event.target.value }))}
              />
              <InputField
                label="Years"
                hint="Projection length"
                value={state.years}
                onChange={(event) => setState((current) => ({ ...current, years: event.target.value }))}
              />
              <SelectField
                label="Compounding frequency"
                hint="Short timelines usually change only a little"
                value={state.compoundingFrequency}
                onChange={(event) => setState((current) => ({ ...current, compoundingFrequency: event.target.value }))}
              >
                <option value="annually">Annually</option>
                <option value="quarterly">Quarterly</option>
                <option value="monthly">Monthly</option>
                <option value="daily">Daily</option>
              </SelectField>
            </div>
            <div className="mt-6 space-y-4">
              <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
              <InsightPanel
                title="How compounding frequency works"
                body="Compounding frequency controls how often returns get added back into the balance. Over short periods, or when most money is contributed gradually across the year, the difference between annual, monthly, and daily compounding is usually small. It becomes more noticeable over longer timelines, larger balances, and higher rates."
              />
            </div>
          </div>
          <ExamplePresetList
            title="Try an example"
            body="Use a preset scenario to see how time horizon and compounding assumptions change the outcome in practice."
            items={[
              {
                label: "Short-term savings",
                description: "$1,000 upfront, $500 monthly, 7% for 1 year. Good for seeing why compounding frequency barely moves on short timelines.",
                onApply: () =>
                  setState({
                    initialAmount: "1000",
                    contributionAmount: "500",
                    contributionFrequency: "monthly",
                    annualRate: "7",
                    years: "1",
                    compoundingFrequency: "annually"
                  })
              },
              {
                label: "Long-term investing",
                description: "$10,000 upfront, $500 monthly, 7% for 20 years. Better for seeing how compounding and time start to matter together.",
                onApply: () =>
                  setState({
                    initialAmount: "10000",
                    contributionAmount: "500",
                    contributionFrequency: "monthly",
                    annualRate: "7",
                    years: "20",
                    compoundingFrequency: "monthly"
                  })
              }
            ]}
          />
        </div>
        <div className="space-y-4">
          {!result ? (
            <EmptyCalculatorState
              title="Add the core inputs"
              body="Start with your initial amount, expected rate, contribution plan, and time horizon. The calculator will project the balance instantly."
            />
          ) : (
            <>
              <div className="surface space-y-4 p-6 md:p-8">
                <div>
                  <p className="section-label">Future value</p>
                  <h3 className="mt-4 text-2xl font-semibold">{formatCurrency(result.finalBalance)}</h3>
                  <p className="mt-2 text-sm leading-7">
                    Over {state.years} years, total contributions of {formatCurrency(result.totalContributions)} could grow into {formatCurrency(result.finalBalance)} based on the inputs above.
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <ResultCard label="Final balance" value={formatCurrency(result.finalBalance)} tone="success" />
                  <ResultCard label="Total contributions" value={formatCurrency(result.totalContributions)} />
                  <ResultCard label="Total interest" value={formatCurrency(result.totalInterest)} />
                </div>
              </div>
              <InsightPanel
                title="Growth insight"
                body={`If you invest ${formatCurrency(parseNumberInput(state.contributionAmount) || 0)} ${state.contributionFrequency} at ${state.annualRate}% annually, your balance could reach ${formatCurrency(result.finalBalance)} in ${state.years} years. The chart also compares growth against cash contributed.`}
              />
            </>
          )}
        </div>
      </div>
      {result ? (
        <LineChart
          labels={result.points.map((point) => point.year)}
          series={[
            {
              label: "Projected balance",
              color: "#0891b2",
              values: result.points.map((point) => point.balance)
            },
            {
              label: "Total cash invested",
              color: "#94a3b8",
              values: result.points.map((point) => point.contributions)
            }
          ]}
        />
      ) : null}
    </div>
  );
}
