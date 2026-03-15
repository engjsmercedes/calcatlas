"use client";

import { useMemo, useState } from "react";

import { InputField } from "@/components/ui/input-field";
import { LineChart } from "@/components/ui/line-chart";
import { PillTabs } from "@/components/ui/pill-tabs";
import { ResultCard } from "@/components/ui/result-card";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { calculateMortgage } from "@/lib/calculators/mortgage";
import { formatCurrency, formatNumber, parseNumberInput } from "@/lib/utils";

import { CalculatorActions, EmptyCalculatorState, ExamplePresetList, InsightPanel } from "./shared";

const initialState = {
  loanAmount: "400000",
  annualRate: "6.5",
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
    keys: ["loanAmount", "annualRate", "years", "propertyTaxAnnual", "insuranceAnnual", "hoaMonthly", "pmiMonthly", "extraMonthlyPayment"]
  });

  const result = useMemo(
    () =>
      calculateMortgage({
        loanAmount: parseNumberInput(state.loanAmount) || 0,
        annualRate: parseNumberInput(state.annualRate) || 0,
        years: parseNumberInput(state.years) || 0,
        propertyTaxAnnual: parseNumberInput(state.propertyTaxAnnual) || 0,
        insuranceAnnual: parseNumberInput(state.insuranceAnnual) || 0,
        hoaMonthly: parseNumberInput(state.hoaMonthly) || 0,
        pmiMonthly: parseNumberInput(state.pmiMonthly) || 0,
        extraMonthlyPayment: parseNumberInput(state.extraMonthlyPayment) || 0
      }),
    [state]
  );

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          <div className="surface p-6 md:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField label="Loan amount" prefix="$" value={state.loanAmount} onChange={(event) => setState((current) => ({ ...current, loanAmount: event.target.value }))} />
              <InputField label="Interest rate" hint="Annual %" value={state.annualRate} onChange={(event) => setState((current) => ({ ...current, annualRate: event.target.value }))} />
              <InputField label="Loan term" hint="Years" value={state.years} onChange={(event) => setState((current) => ({ ...current, years: event.target.value }))} />
              <InputField label="Property tax" hint="Annual" prefix="$" value={state.propertyTaxAnnual} onChange={(event) => setState((current) => ({ ...current, propertyTaxAnnual: event.target.value }))} />
              <InputField label="Home insurance" hint="Annual" prefix="$" value={state.insuranceAnnual} onChange={(event) => setState((current) => ({ ...current, insuranceAnnual: event.target.value }))} />
              <InputField label="HOA dues" hint="Monthly" prefix="$" value={state.hoaMonthly} onChange={(event) => setState((current) => ({ ...current, hoaMonthly: event.target.value }))} />
              <InputField label="PMI" hint="Monthly" prefix="$" value={state.pmiMonthly} onChange={(event) => setState((current) => ({ ...current, pmiMonthly: event.target.value }))} />
              <InputField label="Extra payment" hint="Monthly" prefix="$" value={state.extraMonthlyPayment} onChange={(event) => setState((current) => ({ ...current, extraMonthlyPayment: event.target.value }))} />
            </div>
            <div className="mt-6">
              <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
            </div>
          </div>
          <ExamplePresetList
            title="Try an example"
            body="Use a preset scenario to compare a standard mortgage against a more aggressive payoff plan."
            items={[
              {
                label: "Standard 30-year loan",
                description: "$400,000 at 6.5% for 30 years with taxes and insurance but no extra payment.",
                onApply: () =>
                  setState({
                    loanAmount: "400000",
                    annualRate: "6.5",
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
                    loanAmount: "400000",
                    annualRate: "6.5",
                    years: "30",
                    propertyTaxAnnual: "4800",
                    insuranceAnnual: "1800",
                    hoaMonthly: "0",
                    pmiMonthly: "0",
                    extraMonthlyPayment: "300"
                  })
              }
            ]}
          />
        </div>
        <div className="space-y-4">
          {!result ? (
            <EmptyCalculatorState title="Enter your mortgage details" body="Add the loan amount, rate, and loan term to estimate monthly payment, total interest, and the long-term cost of the loan." />
          ) : (
            <>
              <div className="surface space-y-4 p-6 md:p-8">
                <div>
                  <p className="section-label">Mortgage payment</p>
                  <h3 className="mt-4 text-2xl font-semibold">{formatCurrency(result.totalMonthlyPayment)} / month</h3>
                  <p className="mt-2 text-sm leading-7">
                    Principal and interest come to {formatCurrency(result.monthlyPrincipalInterest)} per month before taxes, insurance, HOA, PMI, and any extra payment are added.
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <ResultCard label="Total monthly payment" value={formatCurrency(result.totalMonthlyPayment)} tone="success" />
                  <ResultCard label="Principal + interest" value={formatCurrency(result.monthlyPrincipalInterest)} />
                  <ResultCard label="Total interest" value={formatCurrency(result.totalInterest)} />
                  <ResultCard label="Total paid over loan" value={formatCurrency(result.totalPaid)} />
                  <ResultCard label="Payoff time" value={`${formatNumber(result.payoffMonths / 12, 1)} years`} />
                  <ResultCard label="Interest saved with extra" value={formatCurrency(result.interestSavedWithExtra)} />
                </div>
              </div>
              <InsightPanel title="Payment insight" body={`On this ${state.years}-year mortgage, the interest cost alone adds up to ${formatCurrency(result.totalInterest)}. Adding extra monthly principal can shorten payoff and save about ${formatCurrency(result.interestSavedWithExtra)} in interest.`} />
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
