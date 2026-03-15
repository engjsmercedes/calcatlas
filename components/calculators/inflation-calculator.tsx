"use client";

import { useMemo } from "react";

import { InputField } from "@/components/ui/input-field";
import { LineChart } from "@/components/ui/line-chart";
import { ResultCard } from "@/components/ui/result-card";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { calculateInflation } from "@/lib/calculators/planning";
import { formatCurrency, parseNumberInput } from "@/lib/utils";

import { CalculatorActions, EmptyCalculatorState, InsightPanel } from "./shared";

const initialState = {
  amount: "1000",
  annualInflationRate: "3",
  years: "10"
};

export function InflationCalculator() {
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({
    initialState,
    keys: ["amount", "annualInflationRate", "years"]
  });

  const result = useMemo(
    () =>
      calculateInflation({
        amount: parseNumberInput(state.amount) || 0,
        annualInflationRate: parseNumberInput(state.annualInflationRate) || 0,
        years: parseNumberInput(state.years) || 0
      }),
    [state]
  );

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="surface p-6 md:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField label="Today's amount" prefix="$" value={state.amount} onChange={(event) => setState((current) => ({ ...current, amount: event.target.value }))} />
            <InputField label="Inflation rate" hint="Annual %" value={state.annualInflationRate} onChange={(event) => setState((current) => ({ ...current, annualInflationRate: event.target.value }))} />
            <InputField label="Years" value={state.years} onChange={(event) => setState((current) => ({ ...current, years: event.target.value }))} />
          </div>
          <div className="mt-6">
            <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
          </div>
        </div>
        <div className="space-y-4">
          {!result ? (
            <EmptyCalculatorState title="Set the inflation scenario" body="Enter a current amount, inflation rate, and time horizon to estimate the future cost of the same spending power." />
          ) : (
            <>
              <div className="surface space-y-4 p-6 md:p-8">
                <div>
                  <p className="section-label">Inflation estimate</p>
                  <h3 className="mt-4 text-3xl font-semibold">{formatCurrency(result.futureCost)}</h3>
                  <p className="mt-2 text-sm leading-7">
                    What costs {formatCurrency(parseNumberInput(state.amount) || 0)} today could cost about {formatCurrency(result.futureCost)} in {state.years} years at {state.annualInflationRate}% annual inflation.
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <ResultCard label="Future cost" value={formatCurrency(result.futureCost)} tone="success" />
                  <ResultCard label="Price increase" value={formatCurrency(result.lostPurchasingPower)} />
                  <ResultCard label="Real value of today's amount" value={formatCurrency(result.realValueOfTodayAmount)} />
                </div>
              </div>
              <InsightPanel title="Useful context" body={`Inflation does not need to look dramatic in one year to matter over a decade. This is why long-term planning, salary growth, and investment returns need to be judged against purchasing power, not just nominal dollars.`} />
            </>
          )}
        </div>
      </div>
      {result ? (
        <LineChart
          labels={result.points.map((point) => point.year)}
          series={[
            { label: "Future cost", color: "#0891b2", values: result.points.map((point) => point.futureValue) },
            { label: "Purchasing power", color: "#f59e0b", values: result.points.map((point) => point.purchasingPower) }
          ]}
        />
      ) : null}
    </div>
  );
}
