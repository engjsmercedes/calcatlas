"use client";

import { useMemo, useState } from "react";

import { InputField } from "@/components/ui/input-field";
import { LineChart } from "@/components/ui/line-chart";
import { PillTabs } from "@/components/ui/pill-tabs";
import { ResultCard } from "@/components/ui/result-card";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { calculateMortgage, solveMortgageAnnualRate } from "@/lib/calculators/mortgage";
import { formatCurrency, formatNumber, parseNumberInput } from "@/lib/utils";

import { CalculatorActions, EmptyCalculatorState, ExamplePresetList, InsightPanel } from "./shared";

const initialState = {
  mode: "solve-payment",
  loanAmount: "400000",
  annualRate: "6.5",
  targetPrincipalInterest: "2528.27",
  years: "30",
  propertyTaxAnnual: "4800",
  insuranceAnnual: "1800",
  hoaMonthly: "0",
  pmiMonthly: "0",
  extraMonthlyPayment: "0"
};

export function MortgageCalculator() {
  const [scheduleView, setScheduleView] = useState<"annual" | "monthly">("annual");
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({
    initialState,
    keys: ["mode", "loanAmount", "annualRate", "targetPrincipalInterest", "years", "propertyTaxAnnual", "insuranceAnnual", "hoaMonthly", "pmiMonthly", "extraMonthlyPayment"]
  });

  const mode = state.mode === "solve-rate" ? "solve-rate" : "solve-payment";
  const loanAmount = parseNumberInput(state.loanAmount);
  const annualRate = parseNumberInput(state.annualRate);
  const targetPrincipalInterest = parseNumberInput(state.targetPrincipalInterest);
  const years = parseNumberInput(state.years);
  const propertyTaxAnnual = parseNumberInput(state.propertyTaxAnnual) ?? 0;
  const insuranceAnnual = parseNumberInput(state.insuranceAnnual) ?? 0;
  const hoaMonthly = parseNumberInput(state.hoaMonthly) ?? 0;
  const pmiMonthly = parseNumberInput(state.pmiMonthly) ?? 0;
  const extraMonthlyPayment = parseNumberInput(state.extraMonthlyPayment) ?? 0;

  const solvedAnnualRate = useMemo(() => {
    if (mode !== "solve-rate" || loanAmount === undefined || years === undefined || targetPrincipalInterest === undefined) {
      return undefined;
    }

    return solveMortgageAnnualRate(loanAmount, targetPrincipalInterest, years);
  }, [loanAmount, mode, targetPrincipalInterest, years]);

  const effectiveAnnualRate = mode === "solve-rate" ? solvedAnnualRate : annualRate;

  const result = useMemo(() => {
    if (loanAmount === undefined || years === undefined || effectiveAnnualRate === undefined) {
      return undefined;
    }

    return calculateMortgage({
      loanAmount,
      annualRate: effectiveAnnualRate,
      years,
      propertyTaxAnnual,
      insuranceAnnual,
      hoaMonthly,
      pmiMonthly,
      extraMonthlyPayment
    });
  }, [effectiveAnnualRate, extraMonthlyPayment, hoaMonthly, insuranceAnnual, loanAmount, pmiMonthly, propertyTaxAnnual, years]);

  const showImpossibleRate = mode === "solve-rate" && loanAmount !== undefined && years !== undefined && targetPrincipalInterest !== undefined && solvedAnnualRate === undefined;

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
              <InputField label="Loan amount" prefix="$" value={state.loanAmount} onChange={(event) => setState((current) => ({ ...current, loanAmount: event.target.value }))} />
              {mode === "solve-payment" ? (
                <InputField label="Interest rate" hint="Annual %" value={state.annualRate} onChange={(event) => setState((current) => ({ ...current, annualRate: event.target.value }))} />
              ) : (
                <InputField
                  label="Target principal + interest"
                  hint="Monthly core payment"
                  prefix="$"
                  value={state.targetPrincipalInterest}
                  onChange={(event) => setState((current) => ({ ...current, targetPrincipalInterest: event.target.value }))}
                />
              )}
              <InputField label="Loan term" hint="Years" value={state.years} onChange={(event) => setState((current) => ({ ...current, years: event.target.value }))} />
              <InputField label="Property tax" hint="Annual" prefix="$" value={state.propertyTaxAnnual} onChange={(event) => setState((current) => ({ ...current, propertyTaxAnnual: event.target.value }))} />
              <InputField label="Home insurance" hint="Annual" prefix="$" value={state.insuranceAnnual} onChange={(event) => setState((current) => ({ ...current, insuranceAnnual: event.target.value }))} />
              <InputField label="HOA dues" hint="Monthly" prefix="$" value={state.hoaMonthly} onChange={(event) => setState((current) => ({ ...current, hoaMonthly: event.target.value }))} />
              <InputField label="PMI" hint="Monthly" prefix="$" value={state.pmiMonthly} onChange={(event) => setState((current) => ({ ...current, pmiMonthly: event.target.value }))} />
              <InputField label="Extra payment" hint="Monthly" prefix="$" value={state.extraMonthlyPayment} onChange={(event) => setState((current) => ({ ...current, extraMonthlyPayment: event.target.value }))} />
            </div>
            <p className="mt-4 text-sm leading-7 text-muted">
              {mode === "solve-rate"
                ? "Use the principal-and-interest payment if you want the calculator to back into the implied rate. Taxes, insurance, HOA, PMI, and extra payment sit on top of that core payment."
                : "Enter loan amount, rate, and term to estimate the mortgage payment. Leave optional housing costs at zero if they do not apply."}
            </p>
            <div className="mt-6">
              <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
            </div>
          </div>
          <ExamplePresetList
            title="Try an example"
            body="Use a preset scenario to compare a standard mortgage against an aggressive payoff plan or back into the implied rate from a target payment."
            items={[
              {
                label: "Standard 30-year loan",
                description: "$400,000 at 6.5% for 30 years with taxes and insurance but no extra payment.",
                onApply: () =>
                  setState({
                    mode: "solve-payment",
                    loanAmount: "400000",
                    annualRate: "6.5",
                    targetPrincipalInterest: "2528.27",
                    years: "30",
                    propertyTaxAnnual: "4800",
                    insuranceAnnual: "1800",
                    hoaMonthly: "0",
                    pmiMonthly: "0",
                    extraMonthlyPayment: "0"
                  })
              },
              {
                label: "Faster payoff scenario",
                description: "Same mortgage with an extra $300 monthly principal payment to reduce interest over time.",
                onApply: () =>
                  setState({
                    mode: "solve-payment",
                    loanAmount: "400000",
                    annualRate: "6.5",
                    targetPrincipalInterest: "2528.27",
                    years: "30",
                    propertyTaxAnnual: "4800",
                    insuranceAnnual: "1800",
                    hoaMonthly: "0",
                    pmiMonthly: "0",
                    extraMonthlyPayment: "300"
                  })
              },
              {
                label: "Solve rate from payment",
                description: "Back into the implied rate for a $400,000 loan over 30 years with a $2,528 principal-and-interest payment.",
                onApply: () =>
                  setState({
                    mode: "solve-rate",
                    loanAmount: "400000",
                    annualRate: "",
                    targetPrincipalInterest: "2528.27",
                    years: "30",
                    propertyTaxAnnual: "4800",
                    insuranceAnnual: "1800",
                    hoaMonthly: "0",
                    pmiMonthly: "0",
                    extraMonthlyPayment: "0"
                  })
              }
            ]}
          />
        </div>
        <div className="space-y-4">
          {showImpossibleRate ? (
            <EmptyCalculatorState
              title="Payment is too low for this loan"
              body="That principal-and-interest payment is below the zero-interest baseline for this loan amount and term, so there is no valid positive rate to solve for."
            />
          ) : !result ? (
            <EmptyCalculatorState
              title={mode === "solve-rate" ? "Enter loan amount, payment, and term" : "Enter your mortgage details"}
              body={
                mode === "solve-rate"
                  ? "Add the loan amount, target principal-and-interest payment, and loan term to estimate the implied mortgage rate before taxes and insurance are added."
                  : "Add the loan amount, rate, and loan term to estimate monthly payment, total interest, and the long-term cost of the loan."
              }
            />
          ) : (
            <>
              <div className="surface space-y-4 p-6 md:p-8">
                <div>
                  <p className="section-label">Mortgage payment</p>
                  <h3 className="mt-4 text-2xl font-semibold">{formatCurrency(result.totalMonthlyPayment)} / month</h3>
                  <p className="mt-2 text-sm leading-7">
                    {mode === "solve-rate"
                      ? `A principal-and-interest payment of ${formatCurrency(result.monthlyPrincipalInterest)} implies about ${formatNumber(effectiveAnnualRate ?? 0, 3)}% annual interest over ${state.years} years before taxes, insurance, HOA, PMI, and extra payment are added.`
                      : `Principal and interest come to ${formatCurrency(result.monthlyPrincipalInterest)} per month before taxes, insurance, HOA, PMI, and any extra payment are added.`}
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <ResultCard label="Total monthly payment" value={formatCurrency(result.totalMonthlyPayment)} tone="success" />
                  <ResultCard label={mode === "solve-rate" ? "Solved interest rate" : "Interest rate"} value={`${formatNumber(effectiveAnnualRate ?? 0, 3)}%`} />
                  <ResultCard label="Principal + interest" value={formatCurrency(result.monthlyPrincipalInterest)} />
                  <ResultCard label="Total interest" value={formatCurrency(result.totalInterest)} />
                  <ResultCard label="Total paid over loan" value={formatCurrency(result.totalPaid)} />
                  <ResultCard label="Payoff time" value={`${formatNumber(result.payoffMonths / 12, 1)} years`} />
                  <ResultCard label="Interest saved with extra" value={formatCurrency(result.interestSavedWithExtra)} />
                </div>
              </div>
              <InsightPanel
                title="Payment insight"
                body={
                  mode === "solve-rate"
                    ? `Given this loan amount and term, a principal-and-interest payment of ${formatCurrency(result.monthlyPrincipalInterest)} points to an implied rate of about ${formatNumber(effectiveAnnualRate ?? 0, 3)}%. That helps you reverse-engineer a quoted payment before the side housing costs are layered on top.`
                    : `On this ${state.years}-year mortgage, the interest cost alone adds up to ${formatCurrency(result.totalInterest)}. Adding extra monthly principal can shorten payoff and save about ${formatCurrency(result.interestSavedWithExtra)} in interest.`
                }
              />
            </>
          )}
        </div>
      </div>
      {result ? (
        <>
          <LineChart
            labels={result.points.map((point) => point.year)}
            series={[
              { label: "Remaining balance", color: "#0891b2", values: result.points.map((point) => point.remainingBalance) },
              { label: "Cumulative interest paid", color: "#f59e0b", values: result.points.map((point) => point.cumulativeInterest) }
            ]}
          />
          <div className="surface space-y-5 p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="section-label">Amortization schedule</p>
                <h3 className="mt-3 text-2xl font-semibold">See how principal and interest change over time</h3>
              </div>
              <PillTabs
                options={[
                  { label: "Annual schedule", value: "annual" },
                  { label: "Monthly schedule", value: "monthly" }
                ]}
                value={scheduleView}
                onChange={setScheduleView}
              />
            </div>
            <div className="overflow-x-auto rounded-3xl border border-border">
              <table className="min-w-full divide-y divide-border text-sm">
                <thead className="bg-slate-50/80 dark:bg-slate-900/40">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">{scheduleView === "annual" ? "Year" : "Payment"}</th>
                    <th className="px-4 py-3 text-left font-semibold">Payment</th>
                    <th className="px-4 py-3 text-left font-semibold">Principal</th>
                    <th className="px-4 py-3 text-left font-semibold">Interest</th>
                    <th className="px-4 py-3 text-left font-semibold">Extra</th>
                    <th className="px-4 py-3 text-left font-semibold">Ending balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {scheduleView === "annual"
                    ? result.yearlySchedule.map((row) => (
                        <tr key={`y-${row.year}`}>
                          <td className="px-4 py-3">{row.year}</td>
                          <td className="px-4 py-3">{formatCurrency(row.payment)}</td>
                          <td className="px-4 py-3">{formatCurrency(row.principal)}</td>
                          <td className="px-4 py-3">{formatCurrency(row.interest)}</td>
                          <td className="px-4 py-3">{formatCurrency(row.extraPayment)}</td>
                          <td className="px-4 py-3">{formatCurrency(row.endingBalance)}</td>
                        </tr>
                      ))
                    : result.monthlySchedule.map((row) => (
                        <tr key={`m-${row.paymentNumber}`}>
                          <td className="px-4 py-3">{row.paymentNumber}</td>
                          <td className="px-4 py-3">{formatCurrency(row.payment)}</td>
                          <td className="px-4 py-3">{formatCurrency(row.principal)}</td>
                          <td className="px-4 py-3">{formatCurrency(row.interest)}</td>
                          <td className="px-4 py-3">{formatCurrency(row.extraPayment)}</td>
                          <td className="px-4 py-3">{formatCurrency(row.endingBalance)}</td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
