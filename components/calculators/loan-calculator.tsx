"use client";

import { useMemo } from "react";

import { InputField } from "@/components/ui/input-field";
import { LineChart } from "@/components/ui/line-chart";
import { PillTabs } from "@/components/ui/pill-tabs";
import { ResultCard } from "@/components/ui/result-card";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { calculateLoan, solveAnnualRateFromPayment } from "@/lib/calculators/borrowing";
import { formatCurrency, formatNumber, parseNumberInput } from "@/lib/utils";

import { CalculatorActions, EmptyCalculatorState, ExamplePresetList, InsightPanel } from "./shared";

const initialState = {
  mode: "solve-payment",
  amount: "25000",
  annualRate: "7.2",
  targetMonthlyPayment: "497.97",
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
    keys: ["mode", "amount", "annualRate", "targetMonthlyPayment", "years", "extraPaymentMonthly"]
  });

  const mode = state.mode === "solve-rate" ? "solve-rate" : "solve-payment";
  const amount = parseNumberInput(state.amount);
  const annualRate = parseNumberInput(state.annualRate);
  const targetMonthlyPayment = parseNumberInput(state.targetMonthlyPayment);
  const years = parseNumberInput(state.years);
  const extraPaymentMonthly = parseNumberInput(state.extraPaymentMonthly) ?? 0;

  const solvedAnnualRate = useMemo(() => {
    if (mode !== "solve-rate" || amount === undefined || years === undefined || targetMonthlyPayment === undefined) {
      return undefined;
    }

    return solveAnnualRateFromPayment(amount, targetMonthlyPayment, Math.round(years * 12));
  }, [amount, mode, targetMonthlyPayment, years]);

  const effectiveAnnualRate = mode === "solve-rate" ? solvedAnnualRate : annualRate;

  const result = useMemo(() => {
    if (amount === undefined || years === undefined || effectiveAnnualRate === undefined) {
      return undefined;
    }

    return calculateLoan({
      amount,
      annualRate: effectiveAnnualRate,
      years,
      extraPaymentMonthly
    });
  }, [amount, effectiveAnnualRate, extraPaymentMonthly, years]);

  const showImpossibleRate = mode === "solve-rate" && amount !== undefined && years !== undefined && targetMonthlyPayment !== undefined && solvedAnnualRate === undefined;

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          <div className="surface p-6 md:p-8">
            <div className="mb-6">
              <PillTabs
                options={[
                  { label: "Solve payment", value: "solve-payment" },
                  { label: "Solve rate", value: "solve-rate" }
                ]}
                value={mode}
                onChange={(nextMode) => setState((current) => ({ ...current, mode: nextMode }))}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField label="Loan amount" prefix="$" value={state.amount} onChange={(event) => setState((current) => ({ ...current, amount: event.target.value }))} />
              {mode === "solve-payment" ? (
                <InputField label="Interest rate" hint="Annual %" value={state.annualRate} onChange={(event) => setState((current) => ({ ...current, annualRate: event.target.value }))} />
              ) : (
                <InputField
                  label="Target monthly payment"
                  prefix="$"
                  hint="Base payment before extras"
                  value={state.targetMonthlyPayment}
                  onChange={(event) => setState((current) => ({ ...current, targetMonthlyPayment: event.target.value }))}
                />
              )}
              <InputField label="Loan term" hint="Years" value={state.years} onChange={(event) => setState((current) => ({ ...current, years: event.target.value }))} />
              <InputField label="Extra payment" prefix="$" hint="Monthly" value={state.extraPaymentMonthly} onChange={(event) => setState((current) => ({ ...current, extraPaymentMonthly: event.target.value }))} />
            </div>
            <p className="mt-4 text-sm leading-7 text-muted">
              {mode === "solve-rate"
                ? "Use the base scheduled payment if you want the calculator to back into the implied annual rate. Extra payment is handled separately as an accelerated payoff choice."
                : "Enter the amount, annual rate, and term to estimate the standard payment, total interest, and the effect of paying extra each month."}
            </p>
            <div className="mt-6">
              <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
            </div>
          </div>
          <ExamplePresetList
            title="Try an example"
            body="Use a preset to compare a standard repayment plan against a faster payoff scenario or solve the implied rate from a target payment."
            items={[
              {
                label: "Standard personal loan",
                description: "$25,000 at 7.2% over 5 years with no extra monthly payment.",
                onApply: () =>
                  setState({
                    mode: "solve-payment",
                    amount: "25000",
                    annualRate: "7.2",
                    targetMonthlyPayment: "497.97",
                    years: "5",
                    extraPaymentMonthly: "0"
                  })
              },
              {
                label: "Accelerated payoff",
                description: "Same loan with an extra $100 monthly payment to cut interest and shorten payoff.",
                onApply: () =>
                  setState({
                    mode: "solve-payment",
                    amount: "25000",
                    annualRate: "7.2",
                    targetMonthlyPayment: "497.97",
                    years: "5",
                    extraPaymentMonthly: "100"
                  })
              },
              {
                label: "Solve rate from payment",
                description: "Back into the implied rate for a $25,000 loan over 5 years with a $497.97 scheduled monthly payment.",
                onApply: () =>
                  setState({
                    mode: "solve-rate",
                    amount: "25000",
                    annualRate: "",
                    targetMonthlyPayment: "497.97",
                    years: "5",
                    extraPaymentMonthly: "0"
                  })
              }
            ]}
          />
        </div>
        <div className="space-y-4">
          {showImpossibleRate ? (
            <EmptyCalculatorState
              title="Payment is too low for this loan"
              body="That monthly payment is below the zero-interest baseline for this loan amount and term, so there is no valid positive rate to solve for."
            />
          ) : !result ? (
            <EmptyCalculatorState
              title={mode === "solve-rate" ? "Enter amount, payment, and term" : "Enter loan basics"}
              body={
                mode === "solve-rate"
                  ? "Add the loan amount, target monthly payment, and term to estimate the implied annual rate."
                  : "Add the balance, rate, and term to estimate payment, lifetime interest, and how extra monthly payments can accelerate payoff."
              }
            />
          ) : (
            <>
              <div className="surface space-y-4 p-6 md:p-8">
                <div>
                  <p className="section-label">Loan summary</p>
                  <h3 className="mt-4 text-3xl font-semibold">{formatCurrency(result.monthlyPayment)} / month</h3>
                  <p className="mt-2 text-sm leading-7">
                    {mode === "solve-rate"
                      ? `A ${formatCurrency(result.monthlyPayment)} scheduled payment over ${state.years} years implies about ${formatNumber(effectiveAnnualRate ?? 0, 3)}% annual interest before any extra principal is added.`
                      : `At ${state.annualRate}% over ${state.years} years, this loan would cost about ${formatCurrency(result.totalInterest)} in interest without any extra payments.`}
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <ResultCard label="Monthly payment" value={formatCurrency(result.monthlyPayment)} tone="success" />
                  <ResultCard label={mode === "solve-rate" ? "Solved interest rate" : "Interest rate"} value={`${formatNumber(effectiveAnnualRate ?? 0, 3)}%`} />
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
                    Adding {formatCurrency(extraPaymentMonthly)} per month could cut about {formatMonths(result.monthsSaved)} off the payoff schedule and save {formatCurrency(result.interestSaved)} in interest.
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <ResultCard label="Accelerated payoff" value={formatMonths(result.acceleratedPayoffMonths)} tone="success" />
                  <ResultCard label="Interest with extra" value={formatCurrency(result.acceleratedInterest)} />
                  <ResultCard label="Interest saved" value={formatCurrency(result.interestSaved)} />
                  <ResultCard label="Months saved" value={formatNumber(result.monthsSaved, 0)} />
                </div>
              </div>
              <InsightPanel
                title="Useful context"
                body={
                  mode === "solve-rate"
                    ? `Reverse-solving the rate is useful when you only know the loan amount, term, and quoted payment. It gives you a cleaner way to compare offers before extra payments are layered in.`
                    : `Extra principal payments matter most early in the loan, when interest takes up a bigger share of each payment. Even a modest recurring extra payment can shorten the term more than many borrowers expect.`
                }
              />
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
