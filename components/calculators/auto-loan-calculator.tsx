"use client";

import { useMemo } from "react";

import { InputField } from "@/components/ui/input-field";
import { LineChart } from "@/components/ui/line-chart";
import { ResultCard } from "@/components/ui/result-card";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { calculateAutoLoan } from "@/lib/calculators/borrowing";
import { formatCurrency, formatPercent, parseNumberInput } from "@/lib/utils";

import { CalculatorActions, EmptyCalculatorState, InsightPanel } from "./shared";

const initialState = {
  vehiclePrice: "38000",
  downPayment: "5000",
  tradeInValue: "0",
  salesTaxRate: "7",
  fees: "900",
  annualRate: "6.4",
  years: "5"
};

export function AutoLoanCalculator() {
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({
    initialState,
    keys: ["vehiclePrice", "downPayment", "tradeInValue", "salesTaxRate", "fees", "annualRate", "years"]
  });

  const vehiclePrice = parseNumberInput(state.vehiclePrice);
  const downPayment = parseNumberInput(state.downPayment) ?? 0;
  const tradeInValue = parseNumberInput(state.tradeInValue) ?? 0;
  const salesTaxRate = parseNumberInput(state.salesTaxRate) ?? 0;
  const fees = parseNumberInput(state.fees) ?? 0;
  const annualRate = parseNumberInput(state.annualRate);
  const years = parseNumberInput(state.years);

  const result = useMemo(() => {
    if (vehiclePrice === undefined || annualRate === undefined || years === undefined) {
      return undefined;
    }

    return calculateAutoLoan({
      vehiclePrice,
      downPayment,
      tradeInValue,
      salesTaxRate,
      fees,
      annualRate,
      years
    });
  }, [annualRate, downPayment, fees, salesTaxRate, state, tradeInValue, vehiclePrice, years]);

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="surface p-6 md:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField label="Vehicle price" prefix="$" value={state.vehiclePrice} onChange={(event) => setState((current) => ({ ...current, vehiclePrice: event.target.value }))} />
            <InputField label="Down payment" prefix="$" value={state.downPayment} onChange={(event) => setState((current) => ({ ...current, downPayment: event.target.value }))} />
            <InputField label="Trade-in value" prefix="$" value={state.tradeInValue} onChange={(event) => setState((current) => ({ ...current, tradeInValue: event.target.value }))} />
            <InputField label="Sales tax" hint="Percent" value={state.salesTaxRate} onChange={(event) => setState((current) => ({ ...current, salesTaxRate: event.target.value }))} />
            <InputField label="Fees" prefix="$" hint="Title, doc, registration" value={state.fees} onChange={(event) => setState((current) => ({ ...current, fees: event.target.value }))} />
            <InputField label="Interest rate" hint="Annual %" value={state.annualRate} onChange={(event) => setState((current) => ({ ...current, annualRate: event.target.value }))} />
            <InputField label="Loan term" hint="Years" value={state.years} onChange={(event) => setState((current) => ({ ...current, years: event.target.value }))} />
          </div>
          <div className="mt-6">
            <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
          </div>
        </div>
        <div className="space-y-4">
          {!result ? (
            <EmptyCalculatorState title="Build the auto loan scenario" body="Enter the vehicle price, cash due, taxes, fees, and financing terms to estimate monthly payment and compare common auto-loan terms." />
          ) : (
            <>
              <div className="surface space-y-4 p-6 md:p-8">
                <div>
                  <p className="section-label">Auto loan estimate</p>
                  <h3 className="mt-4 text-3xl font-semibold">{formatCurrency(result.monthlyPayment)} / month</h3>
                  <p className="mt-2 text-sm leading-7">
                    You would finance about {formatCurrency(result.amountFinanced)} after tax, fees, and cash down. Estimated interest over the loan comes to {formatCurrency(result.totalInterest)}.
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <ResultCard label="Amount financed" value={formatCurrency(result.amountFinanced)} tone="success" />
                  <ResultCard label="Cash due at signing" value={formatCurrency(result.cashDueAtSigning)} />
                  <ResultCard label="Total interest" value={formatCurrency(result.totalInterest)} />
                  <ResultCard label="Loan-to-value" value={formatPercent(result.loanToValue * 100)} />
                </div>
              </div>
              <div className="surface space-y-4 p-6 md:p-8">
                <div>
                  <p className="section-label">Term comparison</p>
                  <h3 className="mt-4 text-2xl font-semibold">48, 60, and 72 month view</h3>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  {result.termComparisons.map((option) => (
                    <ResultCard key={option.months} label={`${option.months} months`} value={`${formatCurrency(option.payment)} / mo`} tone={option.months === 60 ? "success" : "default"} />
                  ))}
                </div>
              </div>
              <InsightPanel title="Useful context" body={`Longer auto loans reduce the monthly payment, but they also raise the total interest paid and can keep borrowers upside down for longer. Comparing 48, 60, and 72 months helps surface that tradeoff clearly.`} />
            </>
          )}
        </div>
      </div>
      {result ? (
        <LineChart labels={result.points.map((point) => point.year)} series={[{ label: "Remaining loan balance", color: "#0891b2", values: result.points.map((point) => point.remainingBalance) }]} />
      ) : null}
    </div>
  );
}

