"use client";

import { useMemo } from "react";

import { InputField } from "@/components/ui/input-field";
import { LineChart } from "@/components/ui/line-chart";
import { ResultCard } from "@/components/ui/result-card";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { calculate401k } from "@/lib/calculators/retirement";
import { formatCurrency, parseNumberInput } from "@/lib/utils";

import { CalculatorActions, EmptyCalculatorState, ExamplePresetList, InsightPanel } from "./shared";

const initialState = {
  currentAge: "32",
  retirementAge: "67",
  currentBalance: "45000",
  annualSalary: "95000",
  employeeContributionPercent: "10",
  employerMatchPercent: "100",
  employerMatchCapPercent: "4",
  annualRaise: "3",
  annualReturn: "7"
};

export function FourOhOneKCalculator() {
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({
    initialState,
    keys: ["currentAge", "retirementAge", "currentBalance", "annualSalary", "employeeContributionPercent", "employerMatchPercent", "employerMatchCapPercent", "annualRaise", "annualReturn"]
  });

  const currentAge = parseNumberInput(state.currentAge);
  const retirementAge = parseNumberInput(state.retirementAge);
  const currentBalance = parseNumberInput(state.currentBalance);
  const annualSalary = parseNumberInput(state.annualSalary);
  const employeeContributionPercent = parseNumberInput(state.employeeContributionPercent);
  const employerMatchPercent = parseNumberInput(state.employerMatchPercent);
  const employerMatchCapPercent = parseNumberInput(state.employerMatchCapPercent);
  const annualRaise = parseNumberInput(state.annualRaise);
  const annualReturn = parseNumberInput(state.annualReturn);

  const result = useMemo(() => {
    if (
      currentAge === undefined ||
      retirementAge === undefined ||
      currentBalance === undefined ||
      annualSalary === undefined ||
      employeeContributionPercent === undefined ||
      employerMatchPercent === undefined ||
      employerMatchCapPercent === undefined ||
      annualRaise === undefined ||
      annualReturn === undefined
    ) {
      return undefined;
    }

    return calculate401k({
      currentAge,
      retirementAge,
      currentBalance,
      annualSalary,
      employeeContributionPercent,
      employerMatchPercent,
      employerMatchCapPercent,
      annualRaise,
      annualReturn
    });
  }, [annualRaise, annualReturn, annualSalary, currentAge, currentBalance, employeeContributionPercent, employerMatchCapPercent, employerMatchPercent, retirementAge]);

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          <div className="surface p-6 md:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField label="Current age" value={state.currentAge} onChange={(event) => setState((current) => ({ ...current, currentAge: event.target.value }))} />
              <InputField label="Retirement age" value={state.retirementAge} onChange={(event) => setState((current) => ({ ...current, retirementAge: event.target.value }))} />
              <InputField label="Current 401(k) balance" prefix="$" value={state.currentBalance} onChange={(event) => setState((current) => ({ ...current, currentBalance: event.target.value }))} />
              <InputField label="Annual salary" prefix="$" value={state.annualSalary} onChange={(event) => setState((current) => ({ ...current, annualSalary: event.target.value }))} />
              <InputField label="Employee contribution" hint="Percent of pay" value={state.employeeContributionPercent} onChange={(event) => setState((current) => ({ ...current, employeeContributionPercent: event.target.value }))} />
              <InputField label="Employer match" hint="Percent matched" value={state.employerMatchPercent} onChange={(event) => setState((current) => ({ ...current, employerMatchPercent: event.target.value }))} />
              <InputField label="Match cap" hint="Percent of pay" value={state.employerMatchCapPercent} onChange={(event) => setState((current) => ({ ...current, employerMatchCapPercent: event.target.value }))} />
              <InputField label="Annual raise" hint="Percent" value={state.annualRaise} onChange={(event) => setState((current) => ({ ...current, annualRaise: event.target.value }))} />
              <InputField label="Annual return" hint="Expected yearly %" value={state.annualReturn} onChange={(event) => setState((current) => ({ ...current, annualReturn: event.target.value }))} />
            </div>
            <div className="mt-6">
              <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
            </div>
          </div>
          <ExamplePresetList
            title="Try an example"
            body="Use presets to compare a modest contribution with a stronger savings rate and employer match." 
            items={[
              {
                label: "Standard match plan",
                description: "Age 32, $95,000 salary, 10% employee contribution, 100% match up to 4%, 7% return.",
                onApply: () => setState(initialState)
              },
              {
                label: "Higher savings rate",
                description: "Age 40, $120,000 salary, 15% employee contribution, 50% match up to 6%, 7% return.",
                onApply: () =>
                  setState({
                    currentAge: "40",
                    retirementAge: "67",
                    currentBalance: "140000",
                    annualSalary: "120000",
                    employeeContributionPercent: "15",
                    employerMatchPercent: "50",
                    employerMatchCapPercent: "6",
                    annualRaise: "3",
                    annualReturn: "7"
                  })
              }
            ]}
          />
        </div>
        <div className="space-y-4">
          {!result ? (
            <EmptyCalculatorState title="Set the 401(k) assumptions" body="Enter your age, salary, contribution rate, employer match, and growth assumptions to project the account value at retirement." />
          ) : (
            <>
              <div className="surface space-y-4 p-6 md:p-8">
                <div>
                  <p className="section-label">401(k) projection</p>
                  <h3 className="mt-4 text-3xl font-semibold">{formatCurrency(result.futureBalance)}</h3>
                  <p className="mt-2 text-sm leading-7">
                    Your first-year contribution is about {formatCurrency(result.firstYearEmployeeContribution)} and the employer match adds about {formatCurrency(result.firstYearEmployerMatch)} based on the current plan settings.
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <ResultCard label="Future balance" value={formatCurrency(result.futureBalance)} tone="success" />
                  <ResultCard label="Employee contributions" value={formatCurrency(result.totalEmployeeContributions)} />
                  <ResultCard label="Employer contributions" value={formatCurrency(result.totalEmployerContributions)} />
                  <ResultCard label="Investment growth" value={formatCurrency(result.investmentGrowth)} />
                  <ResultCard label="Estimated annual income" value={formatCurrency(result.estimatedAnnualIncome)} />
                  <ResultCard label="Estimated monthly income" value={formatCurrency(result.estimatedMonthlyIncome)} />
                </div>
              </div>
              <InsightPanel title="Match insight" body="Employer match is one of the highest-value parts of a workplace retirement plan. If you are contributing below the match cap, even a small increase can change the long-term projection meaningfully." />
            </>
          )}
        </div>
      </div>
      {result ? (
        <LineChart
          labels={result.points.map((point) => point.age)}
          series={[
            { label: "401(k) balance", color: "#0891b2", values: result.points.map((point) => point.balance) },
            { label: "Total contributions", color: "#94a3b8", values: result.points.map((point) => point.contributions) }
          ]}
        />
      ) : null}
    </div>
  );
}
