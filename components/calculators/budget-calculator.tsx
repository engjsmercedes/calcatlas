"use client";

import { useMemo } from "react";

import { InputField } from "@/components/ui/input-field";
import { ResultCard } from "@/components/ui/result-card";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { calculateBudget, type BudgetInputs } from "@/lib/calculators/practical";
import { formatCurrency, formatPercent, parseNumberInput } from "@/lib/utils";

import { CalculatorActions, EmptyCalculatorState, ExamplePresetList, InsightPanel } from "./shared";

const initialState = {
  monthlyIncome: "6200",
  housing: "1900",
  utilities: "350",
  groceries: "650",
  transportation: "450",
  debt: "400",
  savings: "700",
  insurance: "300",
  entertainment: "250",
  other: "300"
};

export function BudgetCalculator() {
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({
    initialState,
    keys: ["monthlyIncome", "housing", "utilities", "groceries", "transportation", "debt", "savings", "insurance", "entertainment", "other"]
  });

  const result = useMemo(() => {
    const parsed: BudgetInputs = {
      monthlyIncome: parseNumberInput(state.monthlyIncome) ?? Number.NaN,
      housing: parseNumberInput(state.housing) ?? Number.NaN,
      utilities: parseNumberInput(state.utilities) ?? Number.NaN,
      groceries: parseNumberInput(state.groceries) ?? Number.NaN,
      transportation: parseNumberInput(state.transportation) ?? Number.NaN,
      debt: parseNumberInput(state.debt) ?? Number.NaN,
      savings: parseNumberInput(state.savings) ?? Number.NaN,
      insurance: parseNumberInput(state.insurance) ?? Number.NaN,
      entertainment: parseNumberInput(state.entertainment) ?? Number.NaN,
      other: parseNumberInput(state.other) ?? Number.NaN
    };

    if (Object.values(parsed).some((value) => Number.isNaN(value))) {
      return undefined;
    }

    return calculateBudget(parsed);
  }, [state]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-4">
        <div className="surface p-6 md:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField label="Monthly income" prefix="$" value={state.monthlyIncome} onChange={(event) => setState((current) => ({ ...current, monthlyIncome: event.target.value }))} />
            <InputField label="Housing" prefix="$" value={state.housing} onChange={(event) => setState((current) => ({ ...current, housing: event.target.value }))} />
            <InputField label="Utilities" prefix="$" value={state.utilities} onChange={(event) => setState((current) => ({ ...current, utilities: event.target.value }))} />
            <InputField label="Groceries" prefix="$" value={state.groceries} onChange={(event) => setState((current) => ({ ...current, groceries: event.target.value }))} />
            <InputField label="Transportation" prefix="$" value={state.transportation} onChange={(event) => setState((current) => ({ ...current, transportation: event.target.value }))} />
            <InputField label="Debt payments" prefix="$" value={state.debt} onChange={(event) => setState((current) => ({ ...current, debt: event.target.value }))} />
            <InputField label="Savings" prefix="$" value={state.savings} onChange={(event) => setState((current) => ({ ...current, savings: event.target.value }))} />
            <InputField label="Insurance" prefix="$" value={state.insurance} onChange={(event) => setState((current) => ({ ...current, insurance: event.target.value }))} />
            <InputField label="Entertainment" prefix="$" value={state.entertainment} onChange={(event) => setState((current) => ({ ...current, entertainment: event.target.value }))} />
            <InputField label="Other" prefix="$" value={state.other} onChange={(event) => setState((current) => ({ ...current, other: event.target.value }))} />
          </div>
          <div className="mt-6">
            <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
          </div>
        </div>
        <ExamplePresetList
          title="Try an example"
          body="Use presets to compare a balanced budget against a tighter cash-flow month." 
          items={[
            { label: "Balanced monthly budget", description: "$6,200 income with savings and moderate fixed costs.", onApply: () => setState(initialState) },
            { label: "Tighter cash flow", description: "$4,800 income with higher housing and debt pressure.", onApply: () => setState({ monthlyIncome: "4800", housing: "1850", utilities: "300", groceries: "550", transportation: "420", debt: "650", savings: "250", insurance: "260", entertainment: "180", other: "240" }) }
          ]}
        />
      </div>
      <div className="space-y-4">
        {!result ? (
          <EmptyCalculatorState title="Add monthly income and expenses" body="Enter your monthly inflow and major spending buckets to estimate leftover cash flow and budget pressure." />
        ) : (
          <>
            <div className="surface space-y-4 p-6 md:p-8">
              <div>
                <p className="section-label">Monthly budget result</p>
                <h3 className="mt-4 text-3xl font-semibold">{formatCurrency(result.leftover)} left over</h3>
                <p className="mt-2 text-sm leading-7">Total monthly expenses come to {formatCurrency(result.totalExpenses)}. Housing uses {formatPercent(result.housingRatio)} of income and savings currently account for {formatPercent(result.savingsRate)}.</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <ResultCard label="Leftover cash flow" value={formatCurrency(result.leftover)} tone={result.leftover >= 0 ? "success" : "warning"} />
                <ResultCard label="Total expenses" value={formatCurrency(result.totalExpenses)} />
                <ResultCard label="Essential spending" value={formatCurrency(result.essentialSpending)} />
                <ResultCard label="Flexible spending" value={formatCurrency(result.flexibleSpending)} />
                <ResultCard label="Housing ratio" value={formatPercent(result.housingRatio)} />
                <ResultCard label="Savings rate" value={formatPercent(result.savingsRate)} />
              </div>
            </div>
            <InsightPanel title="Budget signal" body={result.leftover >= 0 ? "This plan leaves positive monthly cash flow, which creates room for irregular expenses or faster savings. The next question is whether housing and debt still leave enough flexibility." : "This plan is running negative monthly cash flow. The biggest levers are usually housing, debt payments, transport, or a savings target that needs to be phased in more gradually."} />
          </>
        )}
      </div>
    </div>
  );
}
