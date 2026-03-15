"use client";

import { useMemo } from "react";

import { InputField } from "@/components/ui/input-field";
import { LineChart } from "@/components/ui/line-chart";
import { ResultCard } from "@/components/ui/result-card";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { calculateLoan } from "@/lib/calculators/borrowing";
import { formatCurrency, formatNumber, parseNumberInput } from "@/lib/utils";

import { CalculatorActions, EmptyCalculatorState, InsightPanel } from "./shared";

const initialState = {
  amount: "25000",
  annualRate: "7.2",
  years: "5",
  extraPaymentMonthly: "100"
};

function formatMonths(months: number) {
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (years === 0) {
    return `${remainingMonths} months`;
  }

  if (remainingMonths === 0) {
    return `${years} years`;
  }

  return `${years} years ${remainingMonths} months`;
}

export function LoanCalculator() {
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({
    initialState,
    keys: ["amount", "annualRate", "years", "extraPaymentMonthly"]
  });

  const result = useMemo(
    () =>
      calculateLoan({
        amount: parseNumberInput(state.amount) || 0,
        annualRate: parseNumberInput(state.annualRate) || 0,
        years: parseNumberInput(state.years) || 0,
        extraPaymentMonthly: parseNumberInput(state.extraPaymentMonthly) || 0
      }),
    [state]
  );

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="surface p-6 md:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField label="Loan amount" prefix="$" value={state.amount} onChange={(event) => setState((current) => ({ ...current, amount: event.target.value }))} />
            <InputField label="Interest rate" hint="Annual %" value={state.annualRate} onChange={(event) => setState((current) => ({ ...current, annualRate: event.target.value }))} />
            <InputField label="Loan term" hint="Years" value={state.years} onChange={(event) => setState((current) => ({ ...current, years: event.target.value }))} />
            <InputField label="Extra payment" prefix="$" hint="Monthly" value={state.extraPaymentMonthly} onChange={(event) => setState((current) => ({ ...current, extraPaymentMonthly: event.target.value }))} />
          </div>
          <div className="mt-6">
            <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
          </div>
        </div>
        <div className="space-y-4">
          {!result ? (
            <EmptyCalculatorState title="Enter loan basics" body="Add the balance, rate, and term to estimate payment, lifetime interest, and how extra monthly payments can accelerate payoff." />
          ) : (
            <>
              <div className="surface space-y-4 p-6 md:p-8">
                <div>
                  <p className="section-label">Loan summary</p>
                  <h3 className="mt-4 text-3xl font-semibold">{formatCurrency(result.monthlyPayment)} / month</h3>
                  <p className="mt-2 text-sm leading-7">
                    At {state.annualRate}% over {state.years} years, this loan would cost about {formatCurrency(result.totalInterest)} in interest without any extra payments.
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <ResultCard label="Monthly payment" value={formatCurrency(result.monthlyPayment)} tone="success" />
                  <ResultCard label="Total interest" value={formatCurrency(result.totalInterest)} />
                  <ResultCard label="Payoff time" value={formatMonths(result.payoffMonths)} />
                  <ResultCard label="Total paid" value={formatCurrency(result.totalPaid)} />
                </div>
              </div>
              <div className="surface space-y-4 p-6 md:p-8">
                <div>
                  <p className="section-label">Extra payment comparison</p>
                  <h3 className="mt-4 text-2xl font-semibold">{formatCurrency(result.acceleratedMonthlyPayment)} / month</h3>
                  <p className="mt-2 text-sm leading-7">
                    Adding {formatCurrency(parseNumberInput(state.extraPaymentMonthly) || 0)} per month could cut about {formatMonths(result.monthsSaved)} off the payoff schedule and save {formatCurrency(result.interestSaved)} in interest.
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <ResultCard label="Accelerated payoff" value={formatMonths(result.acceleratedPayoffMonths)} tone="success" />
                  <ResultCard label="Interest with extra" value={formatCurrency(result.acceleratedInterest)} />
                  <ResultCard label="Interest saved" value={formatCurrency(result.interestSaved)} />
                  <ResultCard label="Months saved" value={formatNumber(result.monthsSaved, 0)} />
                </div>
              </div>
              <InsightPanel title="Useful context" body={`Extra principal payments matter most early in the loan, when interest takes up a bigger share of each payment. Even a modest recurring extra payment can shorten the term more than many borrowers expect.`} />
            </>
          )}
        </div>
      </div>
      {result ? (
        <LineChart
          labels={result.standardPoints.map((point) => point.year)}
          series={[
            { label: "Standard balance", color: "#0891b2", values: result.standardPoints.map((point) => point.remainingBalance) },
            { label: "With extra payment", color: "#10b981", values: result.acceleratedPoints.map((point) => point.remainingBalance) }
          ]}
        />
      ) : null}
    </div>
  );
}
