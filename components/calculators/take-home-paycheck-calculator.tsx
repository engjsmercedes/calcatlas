"use client";

import { useMemo, useState } from "react";

import { InputField } from "@/components/ui/input-field";
import { ResultCard } from "@/components/ui/result-card";
import { SelectField } from "@/components/ui/select-field";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { formatCurrency, formatPercent, parseNumberInput } from "@/lib/utils";
import { type FilingStatus, type TaxCountry, type UsState, countryOptions, filingStatusOptions, usStateOptions } from "@/lib/calculators/salary";
import { calculateTakeHomePaycheck, practicalPayFrequencyOptions, type PracticalPayFrequency } from "@/lib/calculators/practical";

import { CalculatorActions, ComparisonControls, DecisionSummaryPanel, EmptyCalculatorState, ExamplePresetList, InsightPanel } from "./shared";

const initialState = {
  annualSalary: "95000",
  payFrequency: "biweekly",
  country: "us",
  state: "ca",
  filingStatus: "single",
  retirementPercent: "6",
  preTaxDeductionsAnnual: "4200",
  postTaxDeductionsAnnual: "1200",
  bonusAnnual: "5000"
};

export function TakeHomePaycheckCalculator() {
  const [comparisonEnabled, setComparisonEnabled] = useState(false);
  const [comparisonState, setComparisonState] = useState(initialState);
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({
    initialState,
    keys: ["annualSalary", "payFrequency", "country", "state", "filingStatus", "retirementPercent", "preTaxDeductionsAnnual", "postTaxDeductionsAnnual", "bonusAnnual"]
  });

  const result = useMemo(() => {
    const annualSalary = parseNumberInput(state.annualSalary);
    const retirementPercent = parseNumberInput(state.retirementPercent);
    const preTaxDeductionsAnnual = parseNumberInput(state.preTaxDeductionsAnnual);
    const postTaxDeductionsAnnual = parseNumberInput(state.postTaxDeductionsAnnual);
    const bonusAnnual = parseNumberInput(state.bonusAnnual) ?? 0;

    if (annualSalary === undefined || retirementPercent === undefined || preTaxDeductionsAnnual === undefined || postTaxDeductionsAnnual === undefined) {
      return undefined;
    }

    return calculateTakeHomePaycheck({
      annualSalary,
      payFrequency: state.payFrequency as PracticalPayFrequency,
      country: state.country as TaxCountry,
      state: state.state as UsState,
      filingStatus: state.filingStatus as FilingStatus,
      retirementPercent,
      preTaxDeductionsAnnual,
      postTaxDeductionsAnnual,
      bonusAnnual
    });
  }, [state]);

  const comparisonResult = useMemo(() => {
    if (!comparisonEnabled) return undefined;
    const annualSalary = parseNumberInput(comparisonState.annualSalary);
    const retirementPercent = parseNumberInput(comparisonState.retirementPercent);
    const preTaxDeductionsAnnual = parseNumberInput(comparisonState.preTaxDeductionsAnnual);
    const postTaxDeductionsAnnual = parseNumberInput(comparisonState.postTaxDeductionsAnnual);
    const bonusAnnual = parseNumberInput(comparisonState.bonusAnnual) ?? 0;
    if (annualSalary === undefined || retirementPercent === undefined || preTaxDeductionsAnnual === undefined || postTaxDeductionsAnnual === undefined) return undefined;
    return calculateTakeHomePaycheck({
      annualSalary,
      payFrequency: comparisonState.payFrequency as PracticalPayFrequency,
      country: comparisonState.country as TaxCountry,
      state: comparisonState.state as UsState,
      filingStatus: comparisonState.filingStatus as FilingStatus,
      retirementPercent,
      preTaxDeductionsAnnual,
      postTaxDeductionsAnnual,
      bonusAnnual
    });
  }, [comparisonEnabled, comparisonState]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-4">
        <div className="surface p-6 md:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField label="Annual salary" prefix="$" value={state.annualSalary} onChange={(event) => setState((current) => ({ ...current, annualSalary: event.target.value }))} />
            <SelectField label="Pay frequency" value={state.payFrequency} onChange={(event) => setState((current) => ({ ...current, payFrequency: event.target.value }))}>
              {practicalPayFrequencyOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </SelectField>
            <SelectField label="Country" value={state.country} onChange={(event) => setState((current) => ({ ...current, country: event.target.value, state: event.target.value === "us" ? current.state : "none" }))}>
              {countryOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </SelectField>
            <SelectField label="Filing status" value={state.filingStatus} onChange={(event) => setState((current) => ({ ...current, filingStatus: event.target.value }))}>
              {filingStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </SelectField>
            <SelectField label="State" hint={state.country === "us" ? "US estimate" : "US only"} value={state.country === "us" ? state.state : "none"} disabled={state.country !== "us"} onChange={(event) => setState((current) => ({ ...current, state: event.target.value }))}>
              {usStateOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </SelectField>
            <InputField label="Annual bonus" prefix="$" hint="Optional" value={state.bonusAnnual} onChange={(event) => setState((current) => ({ ...current, bonusAnnual: event.target.value }))} />
            <InputField label="Retirement contribution" hint="Percent" value={state.retirementPercent} onChange={(event) => setState((current) => ({ ...current, retirementPercent: event.target.value }))} />
            <InputField label="Pre-tax deductions" prefix="$" value={state.preTaxDeductionsAnnual} onChange={(event) => setState((current) => ({ ...current, preTaxDeductionsAnnual: event.target.value }))} />
            <InputField label="Post-tax deductions" prefix="$" value={state.postTaxDeductionsAnnual} onChange={(event) => setState((current) => ({ ...current, postTaxDeductionsAnnual: event.target.value }))} />
          </div>
          <div className="mt-6">
            <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
          </div>
        </div>
        <ExamplePresetList
          title="Try an example"
          body="Use presets to compare a California paycheck against a no-state-income-tax scenario."
          items={[
            { label: "Biweekly salary in California", description: "$95,000 salary, biweekly pay, retirement savings, and standard deductions.", onApply: () => setState(initialState) },
            { label: "Monthly pay in Texas", description: "$120,000 salary, monthly pay, no state income tax, and moderate deductions.", onApply: () => setState({ annualSalary: "120000", payFrequency: "monthly", country: "us", state: "tx", filingStatus: "single", retirementPercent: "8", preTaxDeductionsAnnual: "6000", postTaxDeductionsAnnual: "1800", bonusAnnual: "10000" }) }
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
          title="Compare two paycheck setups"
          body="Compare how pay frequency, state, deductions, and retirement choices change the actual paycheck."
        />
        {comparisonEnabled ? (
          <div className="surface p-6 md:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField label="Compare annual salary" prefix="$" value={comparisonState.annualSalary} onChange={(event) => setComparisonState((current) => ({ ...current, annualSalary: event.target.value }))} />
              <SelectField label="Compare pay frequency" value={comparisonState.payFrequency} onChange={(event) => setComparisonState((current) => ({ ...current, payFrequency: event.target.value }))}>
                {practicalPayFrequencyOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </SelectField>
              <SelectField label="Compare country" value={comparisonState.country} onChange={(event) => setComparisonState((current) => ({ ...current, country: event.target.value, state: event.target.value === "us" ? current.state : "none" }))}>
                {countryOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </SelectField>
              <SelectField label="Compare filing status" value={comparisonState.filingStatus} onChange={(event) => setComparisonState((current) => ({ ...current, filingStatus: event.target.value }))}>
                {filingStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </SelectField>
              <SelectField label="Compare state" value={comparisonState.country === "us" ? comparisonState.state : "none"} disabled={comparisonState.country !== "us"} onChange={(event) => setComparisonState((current) => ({ ...current, state: event.target.value }))}>
                {usStateOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </SelectField>
              <InputField label="Compare annual bonus" prefix="$" value={comparisonState.bonusAnnual} onChange={(event) => setComparisonState((current) => ({ ...current, bonusAnnual: event.target.value }))} />
              <InputField label="Compare retirement %" value={comparisonState.retirementPercent} onChange={(event) => setComparisonState((current) => ({ ...current, retirementPercent: event.target.value }))} />
              <InputField label="Compare pre-tax deductions" prefix="$" value={comparisonState.preTaxDeductionsAnnual} onChange={(event) => setComparisonState((current) => ({ ...current, preTaxDeductionsAnnual: event.target.value }))} />
              <InputField label="Compare post-tax deductions" prefix="$" value={comparisonState.postTaxDeductionsAnnual} onChange={(event) => setComparisonState((current) => ({ ...current, postTaxDeductionsAnnual: event.target.value }))} />
            </div>
          </div>
        ) : null}
      </div>
      <div className="space-y-4">
        {!result ? (
          <EmptyCalculatorState title="Add salary and pay frequency" body="Enter annual pay, deductions, and tax assumptions to estimate gross and take-home pay per paycheck." />
        ) : (
          <>
            <div className="surface space-y-4 p-6 md:p-8">
              <div>
                <p className="section-label">Take-home paycheck</p>
                <h3 className="mt-4 text-3xl font-semibold">{formatCurrency(result.netPerPaycheck)} / paycheck</h3>
                <p className="mt-2 text-sm leading-7">Gross pay is about {formatCurrency(result.grossPerPaycheck)} per paycheck before taxes and deductions. Estimated total annual deductions come to {formatCurrency(result.totalDeductions)}.</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <ResultCard label="Net paycheck" value={formatCurrency(result.netPerPaycheck)} tone="success" />
                <ResultCard label="Gross paycheck" value={formatCurrency(result.grossPerPaycheck)} />
                <ResultCard label="Net annual" value={formatCurrency(result.netAnnual)} />
                <ResultCard label="Effective tax rate" value={formatPercent(result.effectiveTaxRate)} />
                <ResultCard label="Annual taxes" value={formatCurrency(result.totalTax)} />
                <ResultCard label="Annual deductions" value={formatCurrency(result.totalDeductions)} />
              </div>
            </div>
            <InsightPanel title="Planning note" body="Take-home pay matters more than headline salary when comparing offers or planning rent, debt payments, and savings. The same gross salary can feel very different after taxes, retirement contributions, and deductions." />
            {comparisonEnabled && comparisonResult ? (
              <div className="surface space-y-4 p-6 md:p-8">
                <div>
                  <p className="section-label">Comparison summary</p>
                  <h3 className="mt-4 text-2xl font-semibold">How the second paycheck setup compares</h3>
                  <p className="mt-2 text-sm leading-7">The comparison setup changes take-home pay by {formatCurrency(comparisonResult.netPerPaycheck - result.netPerPaycheck)} per paycheck, annual net pay by {formatCurrency(comparisonResult.netAnnual - result.netAnnual)}, and effective tax rate by {formatPercent(comparisonResult.effectiveTaxRate - result.effectiveTaxRate)}.</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <ResultCard label="Scenario B net paycheck" value={formatCurrency(comparisonResult.netPerPaycheck)} />
                  <ResultCard label="Paycheck delta" value={formatCurrency(comparisonResult.netPerPaycheck - result.netPerPaycheck)} tone={comparisonResult.netPerPaycheck >= result.netPerPaycheck ? "success" : "default"} />
                  <ResultCard label="Scenario B net annual" value={formatCurrency(comparisonResult.netAnnual)} />
                  <ResultCard label="Annual delta" value={formatCurrency(comparisonResult.netAnnual - result.netAnnual)} tone={comparisonResult.netAnnual >= result.netAnnual ? "success" : "default"} />
                </div>
                <DecisionSummaryPanel calculator="Take-home paycheck calculator" body={comparisonResult.netPerPaycheck > result.netPerPaycheck && comparisonResult.effectiveTaxRate <= result.effectiveTaxRate ? `Scenario B gives the stronger paycheck outcome because more money reaches you each pay cycle without raising the effective tax drag.` : comparisonResult.netPerPaycheck > result.netPerPaycheck ? `Scenario B improves per-paycheck cash flow, but review whether the gain comes from lower retirement saving or lighter deductions rather than a better compensation structure.` : comparisonResult.effectiveTaxRate < result.effectiveTaxRate ? `Scenario B is slightly more tax-efficient, but it does not clearly beat the primary setup on spendable paycheck cash. Keep it only if tax efficiency is the main goal.` : `The primary paycheck setup remains the more balanced option because Scenario B does not put more usable cash in your pocket.`} />
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}





