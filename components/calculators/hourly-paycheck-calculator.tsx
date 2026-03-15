"use client";

import { useMemo } from "react";

import { InputField } from "@/components/ui/input-field";
import { ResultCard } from "@/components/ui/result-card";
import { SelectField } from "@/components/ui/select-field";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { formatCurrency, formatPercent, parseNumberInput } from "@/lib/utils";
import {
  type FilingStatus,
  type TaxCountry,
  type UsState,
  countryOptions,
  filingStatusOptions,
  usStateOptions
} from "@/lib/calculators/salary";
import {
  calculateHourlyPaycheck,
  practicalPayFrequencyOptions,
  type PracticalPayFrequency
} from "@/lib/calculators/practical";

import { CalculatorActions, EmptyCalculatorState, ExamplePresetList, InsightPanel } from "./shared";

const initialState = {
  hourlyRate: "28",
  regularHoursPerWeek: "40",
  overtimeHoursPerWeek: "5",
  overtimeMultiplier: "1.5",
  payFrequency: "biweekly",
  country: "us",
  state: "tx",
  filingStatus: "single",
  retirementPercent: "4",
  preTaxDeductionsAnnual: "2400",
  postTaxDeductionsAnnual: "800",
  bonusAnnual: "0"
};

export function HourlyPaycheckCalculator() {
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({
    initialState,
    keys: ["hourlyRate", "regularHoursPerWeek", "overtimeHoursPerWeek", "overtimeMultiplier", "payFrequency", "country", "state", "filingStatus", "retirementPercent", "preTaxDeductionsAnnual", "postTaxDeductionsAnnual", "bonusAnnual"]
  });

  const result = useMemo(() => {
    const hourlyRate = parseNumberInput(state.hourlyRate);
    const regularHoursPerWeek = parseNumberInput(state.regularHoursPerWeek);
    const overtimeHoursPerWeek = parseNumberInput(state.overtimeHoursPerWeek);
    const overtimeMultiplier = parseNumberInput(state.overtimeMultiplier);
    const retirementPercent = parseNumberInput(state.retirementPercent);
    const preTaxDeductionsAnnual = parseNumberInput(state.preTaxDeductionsAnnual);
    const postTaxDeductionsAnnual = parseNumberInput(state.postTaxDeductionsAnnual);
    const bonusAnnual = parseNumberInput(state.bonusAnnual) ?? 0;

    if (
      hourlyRate === undefined ||
      regularHoursPerWeek === undefined ||
      overtimeHoursPerWeek === undefined ||
      overtimeMultiplier === undefined ||
      retirementPercent === undefined ||
      preTaxDeductionsAnnual === undefined ||
      postTaxDeductionsAnnual === undefined
    ) {
      return undefined;
    }

    return calculateHourlyPaycheck({
      hourlyRate,
      regularHoursPerWeek,
      overtimeHoursPerWeek,
      overtimeMultiplier,
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

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-4">
        <div className="surface p-6 md:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField label="Hourly rate" prefix="$" value={state.hourlyRate} onChange={(event) => setState((current) => ({ ...current, hourlyRate: event.target.value }))} />
            <SelectField label="Pay frequency" value={state.payFrequency} onChange={(event) => setState((current) => ({ ...current, payFrequency: event.target.value }))}>
              {practicalPayFrequencyOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </SelectField>
            <InputField label="Regular hours per week" value={state.regularHoursPerWeek} onChange={(event) => setState((current) => ({ ...current, regularHoursPerWeek: event.target.value }))} />
            <InputField label="Overtime hours per week" value={state.overtimeHoursPerWeek} onChange={(event) => setState((current) => ({ ...current, overtimeHoursPerWeek: event.target.value }))} />
            <InputField label="Overtime multiplier" hint="Usually 1.5" value={state.overtimeMultiplier} onChange={(event) => setState((current) => ({ ...current, overtimeMultiplier: event.target.value }))} />
            <InputField label="Annual bonus" prefix="$" hint="Optional" value={state.bonusAnnual} onChange={(event) => setState((current) => ({ ...current, bonusAnnual: event.target.value }))} />
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
          body="Use presets to compare a standard hourly schedule against one with meaningful overtime." 
          items={[
            { label: "Hourly + small overtime", description: "$28 per hour, 40 regular hours, 5 overtime hours, biweekly pay.", onApply: () => setState(initialState) },
            { label: "Heavy overtime schedule", description: "$32 per hour, 40 regular hours, 12 overtime hours, weekly pay.", onApply: () => setState({ hourlyRate: "32", regularHoursPerWeek: "40", overtimeHoursPerWeek: "12", overtimeMultiplier: "1.5", payFrequency: "weekly", country: "us", state: "ca", filingStatus: "single", retirementPercent: "6", preTaxDeductionsAnnual: "3600", postTaxDeductionsAnnual: "1200", bonusAnnual: "0" }) }
          ]}
        />
      </div>
      <div className="space-y-4">
        {!result ? (
          <EmptyCalculatorState title="Set your hourly pay assumptions" body="Enter hourly rate, regular hours, and overtime to estimate gross and take-home pay per paycheck." />
        ) : (
          <>
            <div className="surface space-y-4 p-6 md:p-8">
              <div>
                <p className="section-label">Hourly paycheck</p>
                <h3 className="mt-4 text-3xl font-semibold">{formatCurrency(result.netPerPaycheck)} / paycheck</h3>
                <p className="mt-2 text-sm leading-7">Weekly gross pay comes to about {formatCurrency(result.weeklyGrossPay)}, including {formatCurrency(result.overtimeWeeklyPay)} from overtime. Net annual pay is estimated at {formatCurrency(result.netAnnual)}.</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <ResultCard label="Net paycheck" value={formatCurrency(result.netPerPaycheck)} tone="success" />
                <ResultCard label="Gross paycheck" value={formatCurrency(result.grossPerPaycheck)} />
                <ResultCard label="Weekly gross pay" value={formatCurrency(result.weeklyGrossPay)} />
                <ResultCard label="Overtime share" value={formatPercent(result.overtimeShare)} />
                <ResultCard label="Annual taxes" value={formatCurrency(result.totalTax)} />
                <ResultCard label="Effective tax rate" value={formatPercent(result.effectiveTaxRate)} />
              </div>
            </div>
            <InsightPanel title="Why this matters" body="Hourly jobs often look different once overtime, taxes, and deductions are included. Seeing gross shift pay and estimated take-home pay together makes job comparisons and weekly planning more realistic." />
          </>
        )}
      </div>
    </div>
  );
}
