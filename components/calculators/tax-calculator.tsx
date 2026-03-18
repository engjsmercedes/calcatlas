"use client";

import { useMemo, useState } from "react";

import { InputField } from "@/components/ui/input-field";
import { ResultCard } from "@/components/ui/result-card";
import { SelectField } from "@/components/ui/select-field";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { calculateTaxEstimate, taxFilingStatusOptions, taxStateOptions } from "@/lib/calculators/essentials";
import { formatCurrency, formatPercent, parseNumberInput } from "@/lib/utils";

import { CalculatorActions, ComparisonControls, DecisionSummaryPanel, EmptyCalculatorState, ExamplePresetList, InsightPanel } from "./shared";

const initialState = {
  annualIncome: "95000",
  filingStatus: "single",
  state: "ca",
  preTaxDeductions: "5000",
  postTaxDeductions: "1200"
};

export function TaxCalculator() {
  const [comparisonEnabled, setComparisonEnabled] = useState(false);
  const [comparisonState, setComparisonState] = useState(initialState);
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

  const comparisonResult = useMemo(
    () =>
      comparisonEnabled
        ? calculateTaxEstimate({
            annualIncome: parseNumberInput(comparisonState.annualIncome) || 0,
            filingStatus: comparisonState.filingStatus === "married" ? "married" : "single",
            state: (comparisonState.state || "none") as (typeof taxStateOptions)[number]["value"],
            preTaxDeductions: parseNumberInput(comparisonState.preTaxDeductions) || 0,
            postTaxDeductions: parseNumberInput(comparisonState.postTaxDeductions) || 0
          })
        : undefined,
    [comparisonEnabled, comparisonState]
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-4">
        <div className="surface p-6 md:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField label="Annual income" prefix="$" tooltip="Estimated gross annual income before taxes and deductions." value={state.annualIncome} onChange={(event) => setState((current) => ({ ...current, annualIncome: event.target.value }))} />
            <SelectField label="Filing status" tooltip="Tax filing assumption used for the estimate, such as single or married." value={state.filingStatus} onChange={(event) => setState((current) => ({ ...current, filingStatus: event.target.value }))}>
              {taxFilingStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </SelectField>
            <SelectField label="State" hint="US estimate" tooltip="State-level tax assumption. This is a planning estimate, not full state return preparation." value={state.state} onChange={(event) => setState((current) => ({ ...current, state: event.target.value }))}>
              {taxStateOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </SelectField>
            <InputField label="Pre-tax deductions" prefix="$" tooltip="Amounts removed before income tax, such as retirement contributions or certain benefits." value={state.preTaxDeductions} onChange={(event) => setState((current) => ({ ...current, preTaxDeductions: event.target.value }))} />
            <InputField label="Post-tax deductions" prefix="$" tooltip="Amounts deducted after taxes, such as union dues or other after-tax payroll items." value={state.postTaxDeductions} onChange={(event) => setState((current) => ({ ...current, postTaxDeductions: event.target.value }))} />
          </div>
          <div className="mt-6">
            <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
          </div>
        </div>
        <ExamplePresetList
          title="Try an example"
          body="Use presets to compare different income and filing scenarios without re-entering the whole tax setup."
          items={[
            { label: "Single filer in California", description: "$95,000 income with $5,000 pre-tax deductions and $1,200 post-tax deductions.", onApply: () => setState({ annualIncome: "95000", filingStatus: "single", state: "ca", preTaxDeductions: "5000", postTaxDeductions: "1200" }) },
            { label: "Married filer in Texas", description: "$140,000 income with no state income tax and moderate deductions to compare take-home pay.", onApply: () => setState({ annualIncome: "140000", filingStatus: "married", state: "tx", preTaxDeductions: "8000", postTaxDeductions: "2400" }) }
          ]}
        />
        <ComparisonControls
          enabled={comparisonEnabled}
          onEnable={() => {
            setComparisonEnabled(true);
            setComparisonState(state);
          }}
          onDisable={() => setComparisonEnabled(false)}
          onCopyCurrent={() => setComparisonState(state)}
          title="Compare two tax setups"
          body="Compare income, filing status, state, and deductions to see how take-home pay and tax burden shift."
        />
        {comparisonEnabled ? (
          <div className="surface p-6 md:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField label="Compare annual income" prefix="$" value={comparisonState.annualIncome} onChange={(event) => setComparisonState((current) => ({ ...current, annualIncome: event.target.value }))} />
              <SelectField label="Compare filing status" value={comparisonState.filingStatus} onChange={(event) => setComparisonState((current) => ({ ...current, filingStatus: event.target.value }))}>
                {taxFilingStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </SelectField>
              <SelectField label="Compare state" value={comparisonState.state} onChange={(event) => setComparisonState((current) => ({ ...current, state: event.target.value }))}>
                {taxStateOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </SelectField>
              <InputField label="Compare pre-tax deductions" prefix="$" value={comparisonState.preTaxDeductions} onChange={(event) => setComparisonState((current) => ({ ...current, preTaxDeductions: event.target.value }))} />
              <InputField label="Compare post-tax deductions" prefix="$" value={comparisonState.postTaxDeductions} onChange={(event) => setComparisonState((current) => ({ ...current, postTaxDeductions: event.target.value }))} />
            </div>
          </div>
        ) : null}
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
                <p className="mt-2 text-sm leading-7">Estimated net pay is {formatCurrency(result.netMonthly)} per month after federal, payroll, and selected-state taxes plus the deductions entered above.</p>
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
            {comparisonEnabled && comparisonResult ? (
              <div className="surface space-y-4 p-6 md:p-8">
                <div>
                  <p className="section-label">Comparison summary</p>
                  <h3 className="mt-4 text-2xl font-semibold">How the second tax setup compares</h3>
                  <p className="mt-2 text-sm leading-7">The comparison scenario changes annual take-home by {formatCurrency(comparisonResult.netAnnual - result.netAnnual)}, total tax by {formatCurrency(comparisonResult.totalTax - result.totalTax)}, and effective tax rate by {formatPercent((comparisonResult.effectiveTaxRate - result.effectiveTaxRate) * 100)}.</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <ResultCard label="Scenario B net annual" value={formatCurrency(comparisonResult.netAnnual)} />
                  <ResultCard label="Net annual delta" value={formatCurrency(comparisonResult.netAnnual - result.netAnnual)} tone={comparisonResult.netAnnual >= result.netAnnual ? "success" : "default"} />
                  <ResultCard label="Scenario B total tax" value={formatCurrency(comparisonResult.totalTax)} />
                  <ResultCard label="Tax delta" value={formatCurrency(comparisonResult.totalTax - result.totalTax)} tone={comparisonResult.totalTax <= result.totalTax ? "success" : "default"} />
                </div>
                <DecisionSummaryPanel
                  calculator="Tax calculator"
                  exportTitle="Tax comparison summary"
                  verdict={comparisonResult.netAnnual > result.netAnnual && comparisonResult.totalTax <= result.totalTax ? { label: "Scenario B wins", tone: "success" } : comparisonResult.netAnnual > result.netAnnual ? { label: "Higher take-home tradeoff", tone: "caution" } : comparisonResult.totalTax < result.totalTax ? { label: "Lower tax tradeoff", tone: "neutral" } : { label: "Scenario A wins", tone: "success" }}
                  highlights={[
                    `Net annual delta: ${formatCurrency(comparisonResult.netAnnual - result.netAnnual)}`,
                    `Tax delta: ${formatCurrency(comparisonResult.totalTax - result.totalTax)}`,
                    `Effective rate delta: ${formatPercent((comparisonResult.effectiveTaxRate - result.effectiveTaxRate) * 100)}`
                  ]}
                  body={comparisonResult.netAnnual > result.netAnnual && comparisonResult.totalTax <= result.totalTax ? `Scenario B is cleaner financially because it leaves more take-home pay while not increasing total tax drag.` : comparisonResult.netAnnual > result.netAnnual ? `Scenario B improves take-home pay, but part of the gain may come from different deduction assumptions rather than pure tax efficiency. Check whether the inputs still match your real situation.` : comparisonResult.totalTax < result.totalTax ? `Scenario B lowers total tax burden, but the after-tax result is not clearly better once deductions are included. It is useful mainly if your goal is tax efficiency, not maximum spendable income.` : `The primary setup remains stronger because Scenario B does not improve after-tax income or tax efficiency enough to justify switching assumptions.`}
                />
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}







