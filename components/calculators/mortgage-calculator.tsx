"use client";

import { useMemo } from "react";

import { InputField } from "@/components/ui/input-field";
import { LineChart } from "@/components/ui/line-chart";
import { ResultCard } from "@/components/ui/result-card";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { calculateMortgage } from "@/lib/calculators/mortgage";
import { formatCurrency, parseNumberInput } from "@/lib/utils";

import { CalculatorActions, EmptyCalculatorState, InsightPanel } from "./shared";

const initialState = {
  loanAmount: "400000",
  annualRate: "6.5",
  years: "30",
  propertyTaxAnnual: "4800",
  insuranceAnnual: "1800",
  hoaMonthly: "0"
};

export function MortgageCalculator() {
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({
    initialState,
    keys: ["loanAmount", "annualRate", "years", "propertyTaxAnnual", "insuranceAnnual", "hoaMonthly"]
  });

  const result = useMemo(
    () =>
      calculateMortgage({
        loanAmount: parseNumberInput(state.loanAmount) || 0,
        annualRate: parseNumberInput(state.annualRate) || 0,
        years: parseNumberInput(state.years) || 0,
        propertyTaxAnnual: parseNumberInput(state.propertyTaxAnnual) || 0,
        insuranceAnnual: parseNumberInput(state.insuranceAnnual) || 0,
        hoaMonthly: parseNumberInput(state.hoaMonthly) || 0
      }),
    [state]
  );

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="surface p-6 md:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField
              label="Loan amount"
              prefix="$"
              value={state.loanAmount}
              onChange={(event) => setState((current) => ({ ...current, loanAmount: event.target.value }))}
            />
            <InputField
              label="Interest rate"
              hint="Annual %"
              value={state.annualRate}
              onChange={(event) => setState((current) => ({ ...current, annualRate: event.target.value }))}
            />
            <InputField
              label="Loan term"
              hint="Years"
              value={state.years}
              onChange={(event) => setState((current) => ({ ...current, years: event.target.value }))}
            />
            <InputField
              label="Property tax"
              hint="Annual"
              prefix="$"
              value={state.propertyTaxAnnual}
              onChange={(event) => setState((current) => ({ ...current, propertyTaxAnnual: event.target.value }))}
            />
            <InputField
              label="Home insurance"
              hint="Annual"
              prefix="$"
              value={state.insuranceAnnual}
              onChange={(event) => setState((current) => ({ ...current, insuranceAnnual: event.target.value }))}
            />
            <InputField
              label="HOA dues"
              hint="Monthly"
              prefix="$"
              value={state.hoaMonthly}
              onChange={(event) => setState((current) => ({ ...current, hoaMonthly: event.target.value }))}
            />
          </div>
          <div className="mt-6">
            <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
          </div>
        </div>
        <div className="space-y-4">
          {!result ? (
            <EmptyCalculatorState
              title="Enter your mortgage details"
              body="Add the loan amount, rate, and loan term to estimate monthly payment, total interest, and the long-term cost of the loan."
            />
          ) : (
            <>
              <div className="surface space-y-4 p-6 md:p-8">
                <div>
                  <p className="section-label">Mortgage payment</p>
                  <h3 className="mt-4 text-2xl font-semibold">{formatCurrency(result.totalMonthlyPayment)} / month</h3>
                  <p className="mt-2 text-sm leading-7">
                    Principal and interest come to {formatCurrency(result.monthlyPrincipalInterest)} per month before taxes, insurance, and HOA are added.
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <ResultCard label="Total monthly payment" value={formatCurrency(result.totalMonthlyPayment)} tone="success" />
                  <ResultCard label="Principal + interest" value={formatCurrency(result.monthlyPrincipalInterest)} />
                  <ResultCard label="Total interest" value={formatCurrency(result.totalInterest)} />
                  <ResultCard label="Total paid over loan" value={formatCurrency(result.totalPaid)} />
                </div>
              </div>
              <InsightPanel
                title="Payment insight"
                body={`On a ${state.years}-year loan, the interest cost alone adds up to ${formatCurrency(result.totalInterest)}. This helps show how rate and term choices change the real cost of the home.`}
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
              label: "Remaining balance",
              color: "#0891b2",
              values: result.points.map((point) => point.remainingBalance)
            },
            {
              label: "Cumulative interest paid",
              color: "#f59e0b",
              values: result.points.map((point) => point.cumulativeInterest)
            }
          ]}
        />
      ) : null}
    </div>
  );
}
