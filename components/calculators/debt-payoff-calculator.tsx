"use client";

import { useMemo } from "react";

import { InputField } from "@/components/ui/input-field";
import { ResultCard } from "@/components/ui/result-card";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { calculateDebtPayoff } from "@/lib/calculators/expansion";
import { formatCurrency, parseNumberInput } from "@/lib/utils";

import { CalculatorActions, EmptyCalculatorState, ExamplePresetList, InsightPanel } from "./shared";

const initialState = {
  balance: "18000",
  annualRate: "10",
  monthlyPayment: "450",
  extraPaymentMonthly: "150"
};

function formatMonths(months: number) {
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (years === 0) return `${remainingMonths} months`;
  if (remainingMonths === 0) return `${years} years`;
  return `${years} years ${remainingMonths} months`;
}

export function DebtPayoffCalculator() {
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({
    initialState,
    keys: ["balance", "annualRate", "monthlyPayment", "extraPaymentMonthly"]
  });

  const balance = parseNumberInput(state.balance);
  const annualRate = parseNumberInput(state.annualRate);
  const monthlyPayment = parseNumberInput(state.monthlyPayment);
  const extraPaymentMonthly = parseNumberInput(state.extraPaymentMonthly) ?? 0;

  const result = useMemo(() => {
    if (balance === undefined || annualRate === undefined || monthlyPayment === undefined) {
      return undefined;
    }
    return calculateDebtPayoff({ balance, annualRate, monthlyPayment, extraPaymentMonthly });
  }, [annualRate, balance, extraPaymentMonthly, monthlyPayment]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-4">
        <div className="surface p-6 md:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField label="Total debt balance" prefix="$" value={state.balance} onChange={(event) => setState((current) => ({ ...current, balance: event.target.value }))} />
            <InputField label="Interest rate" hint="Annual %" value={state.annualRate} onChange={(event) => setState((current) => ({ ...current, annualRate: event.target.value }))} />
            <InputField label="Monthly payment" prefix="$" value={state.monthlyPayment} onChange={(event) => setState((current) => ({ ...current, monthlyPayment: event.target.value }))} />
            <InputField label="Extra payment" prefix="$" hint="Monthly" value={state.extraPaymentMonthly} onChange={(event) => setState((current) => ({ ...current, extraPaymentMonthly: event.target.value }))} />
          </div>
          <div className="mt-6">
            <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
          </div>
        </div>
        <ExamplePresetList
          title="Try an example"
          body="Use presets to compare a standard payoff plan against a more aggressive schedule with extra monthly cash flow directed to debt."
          items={[
            { label: "Base payoff plan", description: "$18,000 balance at 10% with a $450 payment and $150 extra.", onApply: () => setState(initialState) },
            { label: "Lower payment pressure", description: "$18,000 balance at 10% with a $350 payment and no extra.", onApply: () => setState({ balance: "18000", annualRate: "10", monthlyPayment: "350", extraPaymentMonthly: "0" }) }
          ]}
        />
      </div>
      <div className="space-y-4">
        {!result ? (
          <EmptyCalculatorState title="Enter debt, rate, and payment" body="This page estimates payoff speed and total interest for a single debt balance or a simplified combined debt target." />
        ) : !result.payoffPossible ? (
          <EmptyCalculatorState title="Payment too low to reduce the balance" body={`At this rate, you need to pay more than ${formatCurrency(result.minimumPaymentToReduceBalance)} each month to stop the balance from growing.`} />
        ) : (
          <>
            <div className="surface space-y-4 p-6 md:p-8">
              <div>
                <p className="section-label">Debt payoff plan</p>
                <h3 className="mt-4 text-3xl font-semibold">{formatMonths(result.payoffMonths)}</h3>
                <p className="mt-2 text-sm leading-7">
                  Paying {formatCurrency(monthlyPayment ?? 0)} per month would retire the balance in about {formatMonths(result.payoffMonths)} and cost about {formatCurrency(result.interestPaid)} in interest.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <ResultCard label="Payoff time" value={formatMonths(result.payoffMonths)} tone="success" />
                <ResultCard label="Interest paid" value={formatCurrency(result.interestPaid)} />
                <ResultCard label="Total paid" value={formatCurrency(result.totalPaid)} />
                <ResultCard label="Minimum to reduce balance" value={formatCurrency(result.minimumPaymentToReduceBalance)} />
              </div>
            </div>
            <div className="surface space-y-4 p-6 md:p-8">
              <div>
                <p className="section-label">With extra payment</p>
                <h3 className="mt-4 text-2xl font-semibold">{formatMonths(result.acceleratedMonths)}</h3>
                <p className="mt-2 text-sm leading-7">
                  Adding {formatCurrency(extraPaymentMonthly)} per month could save about {formatCurrency(result.interestSaved)} and shorten payoff by {formatMonths(result.monthsSaved)}.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <ResultCard label="Accelerated payoff" value={formatMonths(result.acceleratedMonths)} tone="success" />
                <ResultCard label="Accelerated interest" value={formatCurrency(result.acceleratedInterest)} />
                <ResultCard label="Interest saved" value={formatCurrency(result.interestSaved)} />
                <ResultCard label="Months saved" value={formatMonths(result.monthsSaved)} />
              </div>
            </div>
            <InsightPanel title="Debt strategy note" body="A debt payoff calculator becomes more useful when it shows the payoff-time and interest tradeoff at the same time. That helps users decide whether an extra monthly payment is worth the cash-flow sacrifice." />
          </>
        )}
      </div>
    </div>
  );
}
