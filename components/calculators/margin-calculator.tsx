"use client";

import { useMemo } from "react";

import { InputField } from "@/components/ui/input-field";
import { ResultCard } from "@/components/ui/result-card";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { solveMargin } from "@/lib/calculators/margin";
import { formatCurrency, formatPercent, parseNumberInput } from "@/lib/utils";

import { CalculatorActions, EmptyCalculatorState, InsightPanel } from "./shared";

const initialState = {
  cost: "",
  price: "",
  profit: "",
  margin: "",
  markup: ""
};

export function MarginCalculator() {
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({
    initialState,
    keys: ["cost", "price", "profit", "margin", "markup"]
  });

  const result = useMemo(
    () =>
      solveMargin({
        cost: parseNumberInput(state.cost),
        price: parseNumberInput(state.price),
        profit: parseNumberInput(state.profit),
        margin: parseNumberInput(state.margin),
        markup: parseNumberInput(state.markup)
      }),
    [state]
  );

  const solvedField = result && !result.error ? result.solvedField : undefined;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="surface p-6 md:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField label="Cost" hint="Unit cost" tooltip="Your unit cost before markup or margin is added." prefix="$" highlighted={solvedField === "cost"} value={state.cost} onChange={(event) => setState((current) => ({ ...current, cost: event.target.value }))} />
          <InputField label="Selling price" hint="Customer price" tooltip="Final customer price before taxes and fees." prefix="$" highlighted={solvedField === "price"} value={state.price} onChange={(event) => setState((current) => ({ ...current, price: event.target.value }))} />
          <InputField label="Profit" hint="Absolute profit" tooltip="Absolute profit in dollars, equal to price minus cost." prefix="$" highlighted={solvedField === "profit"} value={state.profit} onChange={(event) => setState((current) => ({ ...current, profit: event.target.value }))} />
          <InputField label="Margin" hint="Gross margin %" tooltip="Gross margin percentage based on selling price." highlighted={solvedField === "margin"} value={state.margin} onChange={(event) => setState((current) => ({ ...current, margin: event.target.value }))} />
          <InputField label="Markup" hint="Markup %" tooltip="Markup percentage based on cost." highlighted={solvedField === "markup"} value={state.markup} onChange={(event) => setState((current) => ({ ...current, markup: event.target.value }))} />
        </div>
        <p className="mt-4 text-sm leading-7">
          Enter any two compatible fields, or leave just one field blank if the others agree. The calculator will solve the missing values and flag contradictory combinations.
        </p>
        <div className="mt-6">
          <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
        </div>
      </div>
      <div className="space-y-4">
        {!result ? (
          <EmptyCalculatorState
            title="Enter compatible inputs"
            body="For example: cost and selling price, cost and margin, or selling price and markup. You can also leave one field blank if the rest agree with each other."
          />
        ) : result.error ? (
          <EmptyCalculatorState title="Inputs conflict" body={result.error} />
        ) : (
          <>
            <div className="surface space-y-4 p-6 md:p-8">
              <div>
                <p className="section-label">Pricing view</p>
                <h3 className="mt-4 text-2xl font-semibold">Solved from {result.solvedBy}</h3>
                <p className="mt-2 text-sm leading-7">
                  This scenario yields a selling price of {formatCurrency(result.price)}, profit of {formatCurrency(result.profit)}, margin of {formatPercent(result.margin)}, and markup of {formatPercent(result.markup)}.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <ResultCard label="Cost" value={formatCurrency(result.cost)} />
                <ResultCard label="Selling price" value={formatCurrency(result.price)} tone="success" />
                <ResultCard label="Profit" value={formatCurrency(result.profit)} />
                <ResultCard label="Margin" value={formatPercent(result.margin)} />
                <ResultCard label="Markup" value={formatPercent(result.markup)} />
              </div>
            </div>
            <InsightPanel title="Pricing insight" body={`If your cost is ${formatCurrency(result.cost)}, every sale at ${formatCurrency(result.price)} contributes ${formatCurrency(result.profit)} before overhead. Margin helps compare against revenue, while markup helps plan from cost.`} />
          </>
        )}
      </div>
    </div>
  );
}