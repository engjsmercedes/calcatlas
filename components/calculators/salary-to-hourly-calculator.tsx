"use client";

import { useMemo, useState } from "react";

import { InputField } from "@/components/ui/input-field";
import { PillTabs } from "@/components/ui/pill-tabs";
import { ResultCard } from "@/components/ui/result-card";
import { SelectField } from "@/components/ui/select-field";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import {
  type FilingStatus,
  type SalaryMode,
  type TaxCountry,
  type UsState,
  countryOptions,
  estimateSalary,
  filingStatusOptions,
  usStateOptions
} from "@/lib/calculators/salary";
import { formatCurrency, formatPercent, parseNumberInput } from "@/lib/utils";

import { CalculatorActions, ComparisonControls, DecisionSummaryPanel, EmptyCalculatorState, InsightPanel } from "./shared";

const initialState = {
  mode: "salary-to-hourly",
  annualSalary: "175000",
  hourlyRate: "",
  hoursPerWeek: "40",
  weeksPerYear: "50",
  country: "us",
  state: "ca",
  filingStatus: "single",
  retirementPercent: "6",
  preTaxDeductionsAnnual: "4200",
  postTaxDeductionsAnnual: "1200",
  bonusAnnual: "10000"
};

export function SalaryToHourlyCalculator() {
  const [comparisonEnabled, setComparisonEnabled] = useState(false);
  const [comparisonState, setComparisonState] = useState(initialState);
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({
    initialState,
    keys: [
      "mode",
      "annualSalary",
      "hourlyRate",
      "hoursPerWeek",
      "weeksPerYear",
      "country",
      "state",
      "filingStatus",
      "retirementPercent",
      "preTaxDeductionsAnnual",
      "postTaxDeductionsAnnual",
      "bonusAnnual"
    ]
  });

  const result = useMemo(
    () =>
      estimateSalary({
        mode: state.mode as SalaryMode,
        annualSalary: parseNumberInput(state.annualSalary) || 0,
        hourlyRate: parseNumberInput(state.hourlyRate) || 0,
        hoursPerWeek: parseNumberInput(state.hoursPerWeek) || 0,
        weeksPerYear: parseNumberInput(state.weeksPerYear) || 0,
        country: state.country as TaxCountry,
        state: state.state as UsState,
        filingStatus: state.filingStatus as FilingStatus,
        retirementPercent: parseNumberInput(state.retirementPercent) || 0,
        preTaxDeductionsAnnual: parseNumberInput(state.preTaxDeductionsAnnual) || 0,
        postTaxDeductionsAnnual: parseNumberInput(state.postTaxDeductionsAnnual) || 0,
        bonusAnnual: parseNumberInput(state.bonusAnnual) || 0
      }),
    [state]
  );

  const comparisonResult = useMemo(
    () =>
      comparisonEnabled
        ? estimateSalary({
            mode: comparisonState.mode as SalaryMode,
            annualSalary: parseNumberInput(comparisonState.annualSalary) || 0,
            hourlyRate: parseNumberInput(comparisonState.hourlyRate) || 0,
            hoursPerWeek: parseNumberInput(comparisonState.hoursPerWeek) || 0,
            weeksPerYear: parseNumberInput(comparisonState.weeksPerYear) || 0,
            country: comparisonState.country as TaxCountry,
            state: comparisonState.state as UsState,
            filingStatus: comparisonState.filingStatus as FilingStatus,
            retirementPercent: parseNumberInput(comparisonState.retirementPercent) || 0,
            preTaxDeductionsAnnual: parseNumberInput(comparisonState.preTaxDeductionsAnnual) || 0,
            postTaxDeductionsAnnual: parseNumberInput(comparisonState.postTaxDeductionsAnnual) || 0,
            bonusAnnual: parseNumberInput(comparisonState.bonusAnnual) || 0
          })
        : undefined,
    [comparisonEnabled, comparisonState]
  );

  const breakdownSegments = result
    ? [
        { label: "Net pay", value: result.net.annual, color: "bg-emerald-300" },
        { label: "Federal", value: result.deductions.federal, color: "bg-sky-300" },
        { label: "State", value: result.deductions.state, color: "bg-cyan-400" },
        { label: "Payroll", value: result.deductions.payroll, color: "bg-amber-300" },
        { label: "Retirement", value: result.deductions.retirement, color: "bg-violet-300" },
        { label: "Other deductions", value: result.deductions.preTax + result.deductions.postTax, color: "bg-slate-300" }
      ].filter((segment) => segment.value > 0)
    : [];

  const grossAnnualInput = state.mode === "salary-to-hourly" ? parseNumberInput(state.annualSalary) || 0 : undefined;
  const hourlyInput = state.mode === "hourly-to-salary" ? parseNumberInput(state.hourlyRate) || 0 : undefined;

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="surface p-6 md:p-8">
          <div className="space-y-6">
            <div className="space-y-4">
              <PillTabs
                options={[
                  { label: "Salary to hourly", value: "salary-to-hourly" },
                  { label: "Hourly to salary", value: "hourly-to-salary" }
                ]}
                value={state.mode as SalaryMode}
                onChange={(mode) => setState((current) => ({ ...current, mode }))}
              />
              <p className="text-sm leading-7">
                Start with gross pay, then layer in country, state, filing status, retirement, and other deductions to estimate take-home pay instead of only gross conversion.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {state.mode === "salary-to-hourly" ? (
                <InputField
                  label="Annual salary"
                  prefix="$"
                  hint="Gross base pay"
                  value={state.annualSalary}
                  onChange={(event) => setState((current) => ({ ...current, annualSalary: event.target.value }))}
                />
              ) : (
                <InputField
                  label="Hourly rate"
                  prefix="$"
                  hint="Gross hourly pay"
                  value={state.hourlyRate}
                  onChange={(event) => setState((current) => ({ ...current, hourlyRate: event.target.value }))}
                />
              )}
              <InputField
                label="Annual bonus"
                prefix="$"
                hint="Optional"
                value={state.bonusAnnual}
                onChange={(event) => setState((current) => ({ ...current, bonusAnnual: event.target.value }))}
              />
              <InputField
                label="Hours per week"
                value={state.hoursPerWeek}
                onChange={(event) => setState((current) => ({ ...current, hoursPerWeek: event.target.value }))}
              />
              <InputField
                label="Weeks per year"
                hint="50 or 52 is common"
                value={state.weeksPerYear}
                onChange={(event) => setState((current) => ({ ...current, weeksPerYear: event.target.value }))}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField
                label="Country"
                value={state.country}
                onChange={(event) =>
                  setState((current) => ({
                    ...current,
                    country: event.target.value,
                    state: event.target.value === "us" ? current.state : "none"
                  }))
                }
              >
                {countryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </SelectField>
              <SelectField
                label="Filing status"
                value={state.filingStatus}
                onChange={(event) => setState((current) => ({ ...current, filingStatus: event.target.value }))}
              >
                {filingStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </SelectField>
              <SelectField
                label="State"
                hint={state.country === "us" ? "All US states and DC included" : "US state estimates apply only when country is United States"}
                value={state.country === "us" ? state.state : "none"}
                disabled={state.country !== "us"}
                onChange={(event) => setState((current) => ({ ...current, state: event.target.value }))}
              >
                {usStateOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </SelectField>
              <InputField
                label="Retirement contribution"
                hint="Percent of gross pay"
                value={state.retirementPercent}
                onChange={(event) => setState((current) => ({ ...current, retirementPercent: event.target.value }))}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <InputField
                label="Pre-tax deductions"
                prefix="$"
                hint="Insurance, HSA, commuter"
                value={state.preTaxDeductionsAnnual}
                onChange={(event) => setState((current) => ({ ...current, preTaxDeductionsAnnual: event.target.value }))}
              />
              <InputField
                label="Post-tax deductions"
                prefix="$"
                hint="Union dues, garnishments, etc."
                value={state.postTaxDeductionsAnnual}
                onChange={(event) => setState((current) => ({ ...current, postTaxDeductionsAnnual: event.target.value }))}
              />
            </div>

            <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
            <ComparisonControls
              enabled={comparisonEnabled}
              onEnable={() => {
                setComparisonEnabled(true);
                setComparisonState(state);
              }}
              onDisable={() => setComparisonEnabled(false)}
              onCopyCurrent={() => setComparisonState(state)}
              title="Compare two compensation setups"
              body="Compare offers, freelance rates, or tax and deduction assumptions without replacing the main scenario or losing the shareable URL."
            />
            {comparisonEnabled ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField
                  label="Compare mode"
                  value={comparisonState.mode}
                  onChange={(event) => setComparisonState((current) => ({ ...current, mode: event.target.value }))}
                >
                  <option value="salary-to-hourly">Salary to hourly</option>
                  <option value="hourly-to-salary">Hourly to salary</option>
                </SelectField>
                {comparisonState.mode === "salary-to-hourly" ? (
                  <InputField
                    label="Compare annual salary"
                    prefix="$"
                    value={comparisonState.annualSalary}
                    onChange={(event) => setComparisonState((current) => ({ ...current, annualSalary: event.target.value }))}
                  />
                ) : (
                  <InputField
                    label="Compare hourly rate"
                    prefix="$"
                    value={comparisonState.hourlyRate}
                    onChange={(event) => setComparisonState((current) => ({ ...current, hourlyRate: event.target.value }))}
                  />
                )}
                <InputField label="Compare annual bonus" prefix="$" value={comparisonState.bonusAnnual} onChange={(event) => setComparisonState((current) => ({ ...current, bonusAnnual: event.target.value }))} />
                <InputField label="Compare hours per week" value={comparisonState.hoursPerWeek} onChange={(event) => setComparisonState((current) => ({ ...current, hoursPerWeek: event.target.value }))} />
                <InputField label="Compare weeks per year" value={comparisonState.weeksPerYear} onChange={(event) => setComparisonState((current) => ({ ...current, weeksPerYear: event.target.value }))} />
                <SelectField label="Compare country" value={comparisonState.country} onChange={(event) => setComparisonState((current) => ({ ...current, country: event.target.value, state: event.target.value === "us" ? current.state : "none" }))}>
                  {countryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </SelectField>
                <SelectField label="Compare filing status" value={comparisonState.filingStatus} onChange={(event) => setComparisonState((current) => ({ ...current, filingStatus: event.target.value }))}>
                  {filingStatusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </SelectField>
                <SelectField label="Compare state" value={comparisonState.country === "us" ? comparisonState.state : "none"} disabled={comparisonState.country !== "us"} onChange={(event) => setComparisonState((current) => ({ ...current, state: event.target.value }))}>
                  {usStateOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </SelectField>
                <InputField label="Compare retirement %" value={comparisonState.retirementPercent} onChange={(event) => setComparisonState((current) => ({ ...current, retirementPercent: event.target.value }))} />
                <InputField label="Compare pre-tax deductions" prefix="$" value={comparisonState.preTaxDeductionsAnnual} onChange={(event) => setComparisonState((current) => ({ ...current, preTaxDeductionsAnnual: event.target.value }))} />
                <InputField label="Compare post-tax deductions" prefix="$" value={comparisonState.postTaxDeductionsAnnual} onChange={(event) => setComparisonState((current) => ({ ...current, postTaxDeductionsAnnual: event.target.value }))} />
              </div>
            ) : null}
          </div>
        </div>

        <div className="space-y-4">
          {!result ? (
            <EmptyCalculatorState
              title="Set your compensation assumptions"
              body="Add gross pay, schedule, and deductions to estimate hourly value and take-home pay. The more realistic the inputs, the more useful the comparison becomes."
            />
          ) : (
            <>
              <div className="surface space-y-5 p-6 md:p-8">
                <div>
                  <p className="section-label">Take-home estimate</p>
                  <h3 className="mt-4 text-3xl font-semibold">{formatCurrency(result.net.monthly)} / month</h3>
                  <p className="mt-2 text-sm leading-7">
                    Estimated net pay after taxes and deductions. Gross annual compensation is {formatCurrency(result.gross.annual)}, and estimated total deductions are {formatCurrency(result.deductions.total)}.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <ResultCard label="Net hourly" value={`${formatCurrency(result.net.hourly)}/hr`} tone="success" />
                  <ResultCard label="Net monthly" value={formatCurrency(result.net.monthly)} tone="success" />
                  <ResultCard label="Net annual" value={formatCurrency(result.net.annual)} />
                  <ResultCard label="Effective tax rate" value={formatPercent(result.effectiveTaxRate * 100)} />
                </div>
              </div>

              <div className="surface space-y-5 p-6 md:p-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="section-label">Comp breakdown</p>
                    <h3 className="mt-4 text-2xl font-semibold">Where the paycheck goes</h3>
                  </div>
                  <p className="text-sm text-muted">Gross: {formatCurrency(result.gross.annual)}</p>
                </div>

                <div className="overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div className="flex h-5 w-full">
                    {breakdownSegments.map((segment) => (
                      <div
                        key={segment.label}
                        className={segment.color}
                        style={{ width: `${(segment.value / result.gross.annual) * 100}%` }}
                        title={`${segment.label}: ${formatCurrency(segment.value)}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {breakdownSegments.map((segment) => (
                    <div key={segment.label} className="flex items-center justify-between rounded-2xl border border-border px-4 py-3 text-sm">
                      <div className="flex items-center gap-3">
                        <span className={`h-3 w-3 rounded-full ${segment.color}`} />
                        <span className="font-medium text-slate-900 dark:text-white">{segment.label}</span>
                      </div>
                      <span className="text-muted">{formatCurrency(segment.value)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <ResultCard label="Gross weekly" value={formatCurrency(result.gross.weekly)} />
                <ResultCard label="Gross monthly" value={formatCurrency(result.gross.monthly)} />
                <ResultCard label="Federal tax" value={formatCurrency(result.deductions.federal)} />
                <ResultCard label="State tax" value={formatCurrency(result.deductions.state)} />
                <ResultCard label="Payroll tax" value={formatCurrency(result.deductions.payroll)} />
                <ResultCard label="Retirement + other" value={formatCurrency(result.deductions.retirement + result.deductions.preTax + result.deductions.postTax)} />
              </div>

              <InsightPanel
                title="Useful context"
                body={
                  state.mode === "salary-to-hourly"
                    ? `${formatCurrency(grossAnnualInput || 0)} in gross salary translates to about ${formatCurrency(result.gross.hourly)} per hour before deductions and about ${formatCurrency(result.net.hourly)} per hour after estimated taxes and deductions. ${result.marginalContext}`
                    : `${formatCurrency(hourlyInput || 0)} per hour can turn into roughly ${formatCurrency(result.gross.annual)} gross annual pay and ${formatCurrency(result.net.annual)} estimated take-home pay with the selected assumptions. ${result.marginalContext}`
                }
              />
              {comparisonEnabled && comparisonResult ? (
                <div className="surface space-y-4 p-6 md:p-8">
                  <div>
                    <p className="section-label">Comparison summary</p>
                    <h3 className="mt-4 text-2xl font-semibold">How the second compensation setup compares</h3>
                    <p className="mt-2 text-sm leading-7">
                      The comparison scenario changes monthly take-home by {formatCurrency(comparisonResult.net.monthly - result.net.monthly)}, annual take-home by {formatCurrency(comparisonResult.net.annual - result.net.annual)}, and net hourly pay by {formatCurrency(comparisonResult.net.hourly - result.net.hourly)}.
                    </p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <ResultCard label="Scenario B net monthly" value={formatCurrency(comparisonResult.net.monthly)} />
                    <ResultCard label="Monthly delta" value={formatCurrency(comparisonResult.net.monthly - result.net.monthly)} tone={comparisonResult.net.monthly >= result.net.monthly ? "success" : "default"} />
                    <ResultCard label="Scenario B net annual" value={formatCurrency(comparisonResult.net.annual)} />
                    <ResultCard label="Annual delta" value={formatCurrency(comparisonResult.net.annual - result.net.annual)} tone={comparisonResult.net.annual >= result.net.annual ? "success" : "default"} />
                    <ResultCard label="Scenario B net hourly" value={`${formatCurrency(comparisonResult.net.hourly)}/hr`} />
                    <ResultCard label="Effective tax rate delta" value={formatPercent((comparisonResult.effectiveTaxRate - result.effectiveTaxRate) * 100)} tone={comparisonResult.effectiveTaxRate <= result.effectiveTaxRate ? "success" : "default"} />
                  </div>
                  <DecisionSummaryPanel calculator="Salary calculator" body={comparisonResult.net.monthly > result.net.monthly && comparisonResult.effectiveTaxRate <= result.effectiveTaxRate ? `Scenario B is the stronger compensation package because it improves monthly take-home without making the tax burden less efficient.` : comparisonResult.net.monthly > result.net.monthly ? `Scenario B puts more money in your pocket each month, but check whether the gain depends on tradeoffs like longer hours, fewer weeks off, or lighter retirement saving.` : comparisonResult.effectiveTaxRate < result.effectiveTaxRate ? `Scenario B is more tax-efficient, but it does not clearly beat the primary setup on actual take-home pay. Keep it only if the structure matters more than monthly cash.` : `The primary compensation setup remains the better all-around option because Scenario B does not improve usable take-home pay enough to justify switching.`} />
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}





