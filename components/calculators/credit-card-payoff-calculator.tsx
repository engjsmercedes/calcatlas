"use client";

import { useMemo } from "react";

import { InputField } from "@/components/ui/input-field";
import { ResultCard } from "@/components/ui/result-card";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { calculateCreditCardPayoff } from "@/lib/calculators/borrowing";
import { formatCurrency, parseNumberInput } from "@/lib/utils";

import { CalculatorActions, EmptyCalculatorState, InsightPanel } from "./shared";

const initialState = {
  balance: "8000",
  annualRate: "22",
  monthlyPayment: "250",
  extraPaymentMonthly: "75"
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

export function CreditCardPayoffCalculator() {
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({
    initialState,
    keys: ["balance", "annualRate", "monthlyPayment", "extraPaymentMonthly"]
  });

  const result = useMemo(
    () =>
      calculateCreditCardPayoff({
        balance: parseNumberInput(state.balance) || 0,
        annualRate: parseNumberInput(state.annualRate) || 0,
        monthlyPayment: parseNumberInput(state.monthlyPayment) || 0,
        extraPaymentMonthly: parseNumberInput(state.extraPaymentMonthly) || 0
      }),
    [state]
  );

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="surface p-6 md:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField label="Card balance" prefix="$" value={state.balance} onChange={(event) => setState((current) => ({ ...current, balance: event.target.value }))} />
            <InputField label="APR" hint="Annual %" value={state.annualRate} onChange={(event) => setState((current) => ({ ...current, annualRate: event.target.value }))} />
            <InputField label="Monthly payment" prefix="$" value={state.monthlyPayment} onChange={(event) => setState((current) => ({ ...current, monthlyPayment: event.target.value }))} />
            <InputField label="Extra payment" prefix="$" hint="Monthly" value={state.extraPaymentMonthly} onChange={(event) => setState((current) => ({ ...current, extraPaymentMonthly: event.target.value }))} />
          </div>
          <div className="mt-6">
            <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
          </div>
        </div>
        <div className="space-y-4">
          {!result ? (
            <EmptyCalculatorState title="Enter your payoff plan" body="Add the current balance, APR, and payment amount to estimate payoff time, total interest, and the impact of paying extra each month." />
          ) : !result.payoffPossible ? (
            <div className="space-y-4">
              <EmptyCalculatorState title="Payment too low to reduce the balance" body={`At this APR, you need to pay more than ${formatCurrency(result.minimumPaymentToReduceBalance)} per month to stop the balance from growing.`} />
            </div>
          ) : (
            <>
              <div className="surface space-y-4 p-6 md:p-8">
                <div>
                  <p className="section-label">Base payoff plan</p>
                  <h3 className="mt-4 text-3xl font-semibold">{formatMonths(result.standardMonths)}</h3>
                  <p className="mt-2 text-sm leading-7">
                    Paying {formatCurrency(parseNumberInput(state.monthlyPayment) || 0)} per month would cost about {formatCurrency(result.standardInterest)} in interest before the balance reaches zero.
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <ResultCard label="Payoff time" value={formatMonths(result.standardMonths)} tone="success" />
                  <ResultCard label="Interest paid" value={formatCurrency(result.standardInterest)} />
                  <ResultCard label="Total paid" value={formatCurrency(result.totalPaidStandard)} />
                  <ResultCard label="Minimum to reduce balance" value={formatCurrency(result.minimumPaymentToReduceBalance)} />
                </div>
              </div>
              <div className="surface space-y-4 p-6 md:p-8">
                <div>
                  <p className="section-label">With extra payment</p>
                  <h3 className="mt-4 text-2xl font-semibold">{formatMonths(result.acceleratedMonths)}</h3>
                  <p className="mt-2 text-sm leading-7">
                    Adding {formatCurrency(parseNumberInput(state.extraPaymentMonthly) || 0)} per month could save {formatCurrency(result.interestSaved)} in interest and shorten payoff by {formatMonths(result.monthsSaved)}.
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <ResultCard label="Accelerated payoff" value={formatMonths(result.acceleratedMonths)} tone="success" />
                  <ResultCard label="Interest with extra" value={formatCurrency(result.acceleratedInterest)} />
                  <ResultCard label="Interest saved" value={formatCurrency(result.interestSaved)} />
                  <ResultCard label="Months saved" value={formatMonths(result.monthsSaved)} />
                </div>
              </div>
              <InsightPanel title="Useful context" body={`High APR debt responds quickly to extra payments because each extra dollar goes straight toward principal after interest. That makes credit card payoff one of the clearest places where small monthly changes can have an outsized effect.`} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
