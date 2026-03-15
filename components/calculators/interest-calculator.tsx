"use client";

import { useMemo } from "react";

import { InputField } from "@/components/ui/input-field";
import { ResultCard } from "@/components/ui/result-card";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { calculateSimpleInterest } from "@/lib/calculators/expansion";
import { formatCurrency, parseNumberInput } from "@/lib/utils";

import { CalculatorActions, EmptyCalculatorState, ExamplePresetList, InsightPanel } from "./shared";

const initialState = {
  principal: "10000",
  annualRate: "5",
  years: "3"
};

export function InterestCalculator() {
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({
    initialState,
    keys: ["principal", "annualRate", "years"]
  });

  const principal = parseNumberInput(state.principal);
  const annualRate = parseNumberInput(state.annualRate);
  const years = parseNumberInput(state.years);

  const result = useMemo(() => {
    if (principal === undefined || annualRate === undefined || years === undefined) {
      return undefined;
    }
    return calculateSimpleInterest({ principal, annualRate, years });
  }, [annualRate, principal, years]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-4">
        <div className="surface p-6 md:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField label="Principal" prefix="$" value={state.principal} onChange={(event) => setState((current) => ({ ...current, principal: event.target.value }))} />
            <InputField label="Annual rate" hint="Percent" value={state.annualRate} onChange={(event) => setState((current) => ({ ...current, annualRate: event.target.value }))} />
            <InputField label="Years" value={state.years} onChange={(event) => setState((current) => ({ ...current, years: event.target.value }))} />
          </div>
          <div className="mt-6">
            <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
          </div>
        </div>
        <ExamplePresetList
          title="Try an example"
          body="Use a preset to compare a short certificate-style term against a longer simple-interest planning scenario."
          items={[
            {
              label: "Short-term savings",
              description: "$10,000 at 5% for 3 years.",
              onApply: () => setState(initialState)
            },
            {
              label: "Longer horizon",
              description: "$25,000 at 6.5% for 7 years.",
              onApply: () => setState({ principal: "25000", annualRate: "6.5", years: "7" })
            }
          ]}
        />
      </div>
      <div className="space-y-4">
        {!result ? (
          <EmptyCalculatorState title="Enter principal, rate, and time" body="This page uses simple interest, so it is best for rough fixed-rate estimates where interest does not compound into the principal each period." />
        ) : (
          <>
            <div className="surface space-y-4 p-6 md:p-8">
              <div>
                <p className="section-label">Interest result</p>
                <h3 className="mt-4 text-3xl font-semibold">{formatCurrency(result.futureValue)}</h3>
                <p className="mt-2 text-sm leading-7">
                  Over {state.years} years, {formatCurrency(principal ?? 0)} at {state.annualRate}% simple interest would earn about {formatCurrency(result.interestEarned)}.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <ResultCard label="Interest earned" value={formatCurrency(result.interestEarned)} tone="success" />
                <ResultCard label="Final amount" value={formatCurrency(result.futureValue)} />
                <ResultCard label="Average annual interest" value={formatCurrency(result.annualInterest)} />
                <ResultCard label="Average monthly interest" value={formatCurrency(result.monthlyAverageInterest)} />
              </div>
            </div>
            <InsightPanel title="Simple vs compound" body="Simple interest applies the rate to the starting principal only. If you need recurring contributions or growth on previous gains, the compound interest and investment calculators are better fits." />
          </>
        )}
      </div>
    </div>
  );
}
