"use client";

import { useMemo } from "react";

import { InputField } from "@/components/ui/input-field";
import { ResultCard } from "@/components/ui/result-card";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { calculateDownPayment } from "@/lib/calculators/planning";
import { formatCurrency, formatPercent, parseNumberInput } from "@/lib/utils";

import { CalculatorActions, EmptyCalculatorState, InsightPanel } from "./shared";

const initialState = {
  homePrice: "500000",
  downPaymentPercent: "20",
  mortgageRate: "6.3",
  loanTermYears: "30",
  propertyTaxAnnual: "6000",
  insuranceAnnual: "1800"
};

export function DownPaymentCalculator() {
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({
    initialState,
    keys: ["homePrice", "downPaymentPercent", "mortgageRate", "loanTermYears", "propertyTaxAnnual", "insuranceAnnual"]
  });

  const homePrice = parseNumberInput(state.homePrice);
  const downPaymentPercent = parseNumberInput(state.downPaymentPercent);
  const mortgageRate = parseNumberInput(state.mortgageRate);
  const loanTermYears = parseNumberInput(state.loanTermYears);
  const propertyTaxAnnual = parseNumberInput(state.propertyTaxAnnual) ?? 0;
  const insuranceAnnual = parseNumberInput(state.insuranceAnnual) ?? 0;

  const result = useMemo(() => {
    if (homePrice === undefined || downPaymentPercent === undefined || mortgageRate === undefined || loanTermYears === undefined) {
      return undefined;
    }

    return calculateDownPayment({
      homePrice,
      downPaymentPercent,
      mortgageRate,
      loanTermYears,
      propertyTaxAnnual,
      insuranceAnnual
    });
  }, [downPaymentPercent, homePrice, insuranceAnnual, loanTermYears, mortgageRate, propertyTaxAnnual]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="surface p-6 md:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField label="Home price" prefix="$" value={state.homePrice} onChange={(event) => setState((current) => ({ ...current, homePrice: event.target.value }))} />
          <InputField label="Down payment" hint="Percent of price" value={state.downPaymentPercent} onChange={(event) => setState((current) => ({ ...current, downPaymentPercent: event.target.value }))} />
          <InputField label="Mortgage rate" hint="Annual %" value={state.mortgageRate} onChange={(event) => setState((current) => ({ ...current, mortgageRate: event.target.value }))} />
          <InputField label="Loan term" hint="Years" value={state.loanTermYears} onChange={(event) => setState((current) => ({ ...current, loanTermYears: event.target.value }))} />
          <InputField label="Property tax" prefix="$" hint="Annual" value={state.propertyTaxAnnual} onChange={(event) => setState((current) => ({ ...current, propertyTaxAnnual: event.target.value }))} />
          <InputField label="Insurance" prefix="$" hint="Annual" value={state.insuranceAnnual} onChange={(event) => setState((current) => ({ ...current, insuranceAnnual: event.target.value }))} />
        </div>
        <div className="mt-6">
          <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
        </div>
      </div>
      <div className="space-y-4">
        {!result ? (
          <EmptyCalculatorState title="Set the home purchase inputs" body="Enter the home price, down payment percentage, and mortgage assumptions to estimate the upfront cash needed and the resulting loan size." />
        ) : (
          <>
            <div className="surface space-y-4 p-6 md:p-8">
              <div>
                <p className="section-label">Down payment view</p>
                <h3 className="mt-4 text-3xl font-semibold">{formatCurrency(result.downPaymentAmount)}</h3>
                <p className="mt-2 text-sm leading-7">
                  A {state.downPaymentPercent}% down payment on {formatCurrency(homePrice ?? 0)} leaves a loan amount of {formatCurrency(result.loanAmount)}.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <ResultCard label="Down payment" value={formatCurrency(result.downPaymentAmount)} tone="success" />
                <ResultCard label="Loan amount" value={formatCurrency(result.loanAmount)} />
                <ResultCard label="Principal + interest" value={formatCurrency(result.monthlyPrincipalInterest)} />
                <ResultCard label="Estimated monthly payment" value={formatCurrency(result.estimatedMonthlyPayment)} />
              </div>
            </div>
            <InsightPanel title="Useful context" body={`Changing the down payment affects more than just upfront cash. It also changes the loan size, loan-to-value ratio, and the monthly housing payment that follows.`} />
            <ResultCard label="Loan-to-value" value={formatPercent(result.loanToValue * 100)} tone="success" />
          </>
        )}
      </div>
    </div>
  );
}

