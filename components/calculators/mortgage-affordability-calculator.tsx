"use client";

import { useMemo } from "react";

import { InputField } from "@/components/ui/input-field";
import { ResultCard } from "@/components/ui/result-card";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { calculateMortgageAffordability } from "@/lib/calculators/expansion";
import { formatCurrency, parseNumberInput } from "@/lib/utils";

import { CalculatorActions, EmptyCalculatorState, ExamplePresetList, InsightPanel } from "./shared";

const initialState = {
  annualIncome: "160000",
  monthlyDebts: "900",
  downPayment: "80000",
  mortgageRate: "6.25",
  loanTermYears: "30",
  propertyTaxRate: "1.2",
  insuranceAnnual: "1800"
};

export function MortgageAffordabilityCalculator() {
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({
    initialState,
    keys: ["annualIncome", "monthlyDebts", "downPayment", "mortgageRate", "loanTermYears", "propertyTaxRate", "insuranceAnnual"]
  });

  const annualIncome = parseNumberInput(state.annualIncome);
  const monthlyDebts = parseNumberInput(state.monthlyDebts);
  const downPayment = parseNumberInput(state.downPayment);
  const mortgageRate = parseNumberInput(state.mortgageRate);
  const loanTermYears = parseNumberInput(state.loanTermYears);
  const propertyTaxRate = parseNumberInput(state.propertyTaxRate);
  const insuranceAnnual = parseNumberInput(state.insuranceAnnual);

  const result = useMemo(() => {
    if ([annualIncome, monthlyDebts, downPayment, mortgageRate, loanTermYears, propertyTaxRate, insuranceAnnual].some((value) => value === undefined)) {
      return undefined;
    }

    return calculateMortgageAffordability({
      annualIncome: annualIncome as number,
      monthlyDebts: monthlyDebts as number,
      downPayment: downPayment as number,
      mortgageRate: mortgageRate as number,
      loanTermYears: loanTermYears as number,
      propertyTaxRate: propertyTaxRate as number,
      insuranceAnnual: insuranceAnnual as number
    });
  }, [annualIncome, insuranceAnnual, downPayment, loanTermYears, monthlyDebts, mortgageRate, propertyTaxRate]);

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          <div className="surface p-6 md:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField label="Annual income" prefix="$" value={state.annualIncome} onChange={(event) => setState((current) => ({ ...current, annualIncome: event.target.value }))} />
              <InputField label="Monthly debts" prefix="$" hint="Car, student, cards" value={state.monthlyDebts} onChange={(event) => setState((current) => ({ ...current, monthlyDebts: event.target.value }))} />
              <InputField label="Down payment" prefix="$" value={state.downPayment} onChange={(event) => setState((current) => ({ ...current, downPayment: event.target.value }))} />
              <InputField label="Mortgage rate" hint="Annual %" value={state.mortgageRate} onChange={(event) => setState((current) => ({ ...current, mortgageRate: event.target.value }))} />
              <InputField label="Loan term" hint="Years" value={state.loanTermYears} onChange={(event) => setState((current) => ({ ...current, loanTermYears: event.target.value }))} />
              <InputField label="Property tax rate" hint="Annual % of home value" value={state.propertyTaxRate} onChange={(event) => setState((current) => ({ ...current, propertyTaxRate: event.target.value }))} />
              <InputField label="Insurance" prefix="$" hint="Annual" value={state.insuranceAnnual} onChange={(event) => setState((current) => ({ ...current, insuranceAnnual: event.target.value }))} />
            </div>
            <div className="mt-6">
              <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
            </div>
          </div>
          <ExamplePresetList
            title="Try an example"
            body="Use presets to compare a stronger income/down-payment profile against a tighter budget where monthly debts reduce affordability."
            items={[
              { label: "Typical planning case", description: "$160,000 income, $900 monthly debts, $80,000 down payment, 6.25% rate.", onApply: () => setState(initialState) },
              { label: "Tighter budget", description: "$120,000 income, $1,500 monthly debts, $50,000 down payment, 6.5% rate.", onApply: () => setState({ annualIncome: "120000", monthlyDebts: "1500", downPayment: "50000", mortgageRate: "6.5", loanTermYears: "30", propertyTaxRate: "1.2", insuranceAnnual: "1800" }) }
            ]}
          />
        </div>
        <div className="space-y-4">
          {!result ? (
            <EmptyCalculatorState title="Enter income, debts, and financing assumptions" body="This estimate uses common 28/36-style affordability guardrails, so the result is a planning starting point rather than a lender quote." />
          ) : (
            <>
              <div className="surface space-y-4 p-6 md:p-8">
                <div>
                  <p className="section-label">Affordability estimate</p>
                  <h3 className="mt-4 text-3xl font-semibold">{formatCurrency(result.maxHomePrice)}</h3>
                  <p className="mt-2 text-sm leading-7">
                    With these assumptions, a home around {formatCurrency(result.maxHomePrice)} keeps the monthly housing payment near {formatCurrency(result.maxHousingPayment)} before lifestyle and cash-reserve considerations.
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <ResultCard label="Affordable home price" value={formatCurrency(result.maxHomePrice)} tone="success" />
                  <ResultCard label="Affordable loan amount" value={formatCurrency(result.maxLoanAmount)} />
                  <ResultCard label="Max housing payment" value={formatCurrency(result.maxHousingPayment)} />
                  <ResultCard label="Front-end limit" value={formatCurrency(result.frontEndLimit)} />
                  <ResultCard label="Back-end limit" value={formatCurrency(result.backEndLimit)} />
                  <ResultCard label="Taxes + insurance" value={formatCurrency(result.estimatedTaxesAndInsurance)} />
                </div>
              </div>
              <InsightPanel title="Important note" body="Affordability calculators are useful as guardrails, not approvals. Lenders also look at credit, reserves, property type, local taxes, and the difference between gross affordability and what still feels comfortable month to month." />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
