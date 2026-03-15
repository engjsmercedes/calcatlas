"use client";

import { useMemo } from "react";

import { InputField } from "@/components/ui/input-field";
import { ResultCard } from "@/components/ui/result-card";
import { SelectField } from "@/components/ui/select-field";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import {
  calculateTaxEstimate,
  taxFilingStatusOptions,
  taxStateOptions
} from "@/lib/calculators/essentials";
import { formatCurrency, formatPercent, parseNumberInput } from "@/lib/utils";

import { CalculatorActions, EmptyCalculatorState, ExamplePresetList, InsightPanel } from "./shared";

const initialState = {
  annualIncome: "95000",
  filingStatus: "single",
  state: "ca",
  preTaxDeductions: "5000",
  postTaxDeductions: "1200"
};

export function TaxCalculator() {
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({
    initialState,
    keys: ["annualIncome", "filingStatus", "state", "preTaxDeductions", "postTaxDeductions"]
  });

  const result = useMemo(
    () =>
      calculateTaxEstimate({
        annualIncome: parseNumberInput(state.annualIncome) || 0,
        filingStatus: state.filingStatus === "married" ? "married" : "single",
        state: (state.state || "none") as (typeof taxStateOptions)[number]["value"],
        preTaxDeductions: parseNumberInput(state.preTaxDeductions) || 0,
        postTaxDeductions: parseNumberInput(state.postTaxDeductions) || 0
      }),
    [state]
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-4">
        <div className="surface p-6 md:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField label="Annual income" prefix="$" value={state.annualIncome} onChange={(event) => setState((current) => ({ ...current, annualIncome: event.target.value }))} />
            <SelectField label="Filing status" value={state.filingStatus} onChange={(event) => setState((current) => ({ ...current, filingStatus: event.target.value }))}>
              {taxFilingStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </SelectField>
            <SelectField label="State" hint="US estimate" value={state.state} onChange={(event) => setState((current) => ({ ...current, state: event.target.value }))}>
              {taxStateOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </SelectField>
            <InputField label="Pre-tax deductions" prefix="$" value={state.preTaxDeductions} onChange={(event) => setState((current) => ({ ...current, preTaxDeductions: event.target.value }))} />
            <InputField label="Post-tax deductions" prefix="$" value={state.postTaxDeductions} onChange={(event) => setState((current) => ({ ...current, postTaxDeductions: event.target.value }))} />
          </div>
          <div className="mt-6">
            <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
          </div>
        </div>
        <ExamplePresetList
          title="Try an example"
          body="Use presets to compare different income and filing scenarios without re-entering the whole tax setup."
          items={[
            {
              label: "Single filer in California",
              description: "$95,000 income with $5,000 pre-tax deductions and $1,200 post-tax deductions.",
              onApply: () =>
                setState({
                  annualIncome: "95000",
                  filingStatus: "single",
                  state: "ca",
                  preTaxDeductions: "5000",
                  postTaxDeductions: "1200"
                })
            },
            {
              label: "Married filer in Texas",
              description: "$140,000 income with no state income tax and moderate deductions to compare take-home pay.",
              onApply: () =>
                setState({
                  annualIncome: "140000",
                  filingStatus: "married",
                  state: "tx",
                  preTaxDeductions: "8000",
                  postTaxDeductions: "2400"
                })
            }
          ]}
        />
      </div>
      <div className="space-y-4">
        {!result ? (
          <EmptyCalculatorState title="Enter income details" body="Add annual income, filing status, and deduction assumptions to estimate annual taxes and take-home pay." />
        ) : (
          <>
            <div className="surface space-y-4 p-6 md:p-8">
              <div>
                <p className="section-label">Take-home estimate</p>
                <h3 className="mt-4 text-3xl font-semibold">{formatCurrency(result.netAnnual)} / year</h3>
                <p className="mt-2 text-sm leading-7">
                  Estimated net pay is {formatCurrency(result.netMonthly)} per month after federal, payroll, and selected-state taxes plus the deductions entered above.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <ResultCard label="Net annual" value={formatCurrency(result.netAnnual)} tone="success" />
                <ResultCard label="Net monthly" value={formatCurrency(result.netMonthly)} />
                <ResultCard label="Total tax" value={formatCurrency(result.totalTax)} />
                <ResultCard label="Effective tax rate" value={formatPercent(result.effectiveTaxRate * 100)} />
                <ResultCard label="Federal tax" value={formatCurrency(result.federalTax)} />
                <ResultCard label="State + payroll" value={formatCurrency(result.stateTax + result.payrollTax)} />
              </div>
            </div>
            <InsightPanel title="Planning note" body="This is a simplified US tax estimate, not payroll software. It is best used for budgeting, salary comparison, and rough take-home planning before more exact withholding details are available." />
          </>
        )}
      </div>
    </div>
  );
}
