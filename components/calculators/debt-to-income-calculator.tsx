"use client";

import { useMemo } from "react";

import { InputField } from "@/components/ui/input-field";
import { ResultCard } from "@/components/ui/result-card";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { calculateDebtToIncome } from "@/lib/calculators/borrowing";
import { formatCurrency, formatPercent, parseNumberInput } from "@/lib/utils";

import { CalculatorActions, EmptyCalculatorState, InsightPanel } from "./shared";

const initialState = {
  grossMonthlyIncome: "8500",
  housingPayment: "2200",
  carLoans: "450",
  studentLoans: "250",
  creditCards: "150",
  personalLoans: "",
  otherDebts: ""
};

export function DebtToIncomeCalculator() {
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({
    initialState,
    keys: ["grossMonthlyIncome", "housingPayment", "carLoans", "studentLoans", "creditCards", "personalLoans", "otherDebts"]
  });

  const result = useMemo(
    () =>
      calculateDebtToIncome({
        grossMonthlyIncome: parseNumberInput(state.grossMonthlyIncome) || 0,
        housingPayment: parseNumberInput(state.housingPayment) || 0,
        carLoans: parseNumberInput(state.carLoans) || 0,
        studentLoans: parseNumberInput(state.studentLoans) || 0,
        creditCards: parseNumberInput(state.creditCards) || 0,
        personalLoans: parseNumberInput(state.personalLoans) || 0,
        otherDebts: parseNumberInput(state.otherDebts) || 0
      }),
    [state]
  );

  const tone = result?.riskBand === "healthy" ? "success" : result?.riskBand === "watch" ? "warning" : "default";

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="surface p-6 md:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField label="Gross monthly income" prefix="$" value={state.grossMonthlyIncome} onChange={(event) => setState((current) => ({ ...current, grossMonthlyIncome: event.target.value }))} />
            <InputField label="Housing payment" prefix="$" hint="Rent or mortgage" value={state.housingPayment} onChange={(event) => setState((current) => ({ ...current, housingPayment: event.target.value }))} />
            <InputField label="Car loans" prefix="$" value={state.carLoans} onChange={(event) => setState((current) => ({ ...current, carLoans: event.target.value }))} />
            <InputField label="Student loans" prefix="$" value={state.studentLoans} onChange={(event) => setState((current) => ({ ...current, studentLoans: event.target.value }))} />
            <InputField label="Credit cards" prefix="$" value={state.creditCards} onChange={(event) => setState((current) => ({ ...current, creditCards: event.target.value }))} />
            <InputField label="Personal loans" prefix="$" value={state.personalLoans} onChange={(event) => setState((current) => ({ ...current, personalLoans: event.target.value }))} />
            <InputField label="Other debt" prefix="$" value={state.otherDebts} onChange={(event) => setState((current) => ({ ...current, otherDebts: event.target.value }))} />
          </div>
          <div className="mt-6">
            <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
          </div>
        </div>
        <div className="space-y-4">
          {!result ? (
            <EmptyCalculatorState title="Add income and debt" body="Enter gross monthly income and recurring debt payments to calculate front-end and back-end debt-to-income ratios." />
          ) : (
            <>
              <div className="surface space-y-4 p-6 md:p-8">
                <div>
                  <p className="section-label">Debt-to-income</p>
                  <h3 className="mt-4 text-3xl font-semibold">{formatPercent(result.backEndRatio * 100)}</h3>
                  <p className="mt-2 text-sm leading-7">
                    Total recurring monthly debt is {formatCurrency(result.totalMonthlyDebt)} against gross monthly income of {formatCurrency(result.grossMonthlyIncome)}.
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <ResultCard label="Front-end ratio" value={formatPercent(result.frontEndRatio * 100)} tone={tone} />
                  <ResultCard label="Back-end ratio" value={formatPercent(result.backEndRatio * 100)} tone={tone} />
                  <ResultCard label="Total monthly debt" value={formatCurrency(result.totalMonthlyDebt)} />
                  <ResultCard label="Non-housing debt" value={formatCurrency(result.nonHousingDebt)} />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <ResultCard label="Housing by 28% rule" value={formatCurrency(result.recommendedHousingBy28Rule)} tone="success" />
                <ResultCard label="Housing by 36% rule" value={formatCurrency(result.recommendedHousingBy36Rule)} tone="success" />
              </div>
              <InsightPanel title="Useful context" body={result.guidance} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

