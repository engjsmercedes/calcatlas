"use client";

import { useMemo } from "react";

import { InputField } from "@/components/ui/input-field";
import { ResultCard } from "@/components/ui/result-card";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { calculateBreakEven } from "@/lib/calculators/expansion";
import { formatCurrency, formatNumber, formatPercent, parseNumberInput } from "@/lib/utils";

import { CalculatorActions, EmptyCalculatorState, ExamplePresetList, InsightPanel } from "./shared";

const initialState = {
  fixedCosts: "18000",
  pricePerUnit: "125",
  variableCostPerUnit: "45",
  targetProfit: "10000"
};

export function BreakEvenCalculator() {
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({
    initialState,
    keys: ["fixedCosts", "pricePerUnit", "variableCostPerUnit", "targetProfit"]
  });

  const fixedCosts = parseNumberInput(state.fixedCosts);
  const pricePerUnit = parseNumberInput(state.pricePerUnit);
  const variableCostPerUnit = parseNumberInput(state.variableCostPerUnit);
  const targetProfit = parseNumberInput(state.targetProfit) ?? 0;

  const result = useMemo(() => {
    if (fixedCosts === undefined || pricePerUnit === undefined || variableCostPerUnit === undefined) {
      return undefined;
    }
    return calculateBreakEven({ fixedCosts, pricePerUnit, variableCostPerUnit, targetProfit });
  }, [fixedCosts, pricePerUnit, targetProfit, variableCostPerUnit]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-4">
        <div className="surface p-6 md:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField label="Fixed costs" prefix="$" value={state.fixedCosts} onChange={(event) => setState((current) => ({ ...current, fixedCosts: event.target.value }))} />
            <InputField label="Price per unit" prefix="$" value={state.pricePerUnit} onChange={(event) => setState((current) => ({ ...current, pricePerUnit: event.target.value }))} />
            <InputField label="Variable cost per unit" prefix="$" value={state.variableCostPerUnit} onChange={(event) => setState((current) => ({ ...current, variableCostPerUnit: event.target.value }))} />
            <InputField label="Target profit" prefix="$" value={state.targetProfit} onChange={(event) => setState((current) => ({ ...current, targetProfit: event.target.value }))} />
          </div>
          <div className="mt-6">
            <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
          </div>
        </div>
        <ExamplePresetList
          title="Try an example"
          body="Use presets to compare a higher-margin offer with a lower-margin offer that needs more volume to break even."
          items={[
            { label: "Standard offer", description: "$18,000 fixed costs, $125 price, $45 variable cost, $10,000 target profit.", onApply: () => setState(initialState) },
            { label: "Tighter margin", description: "$18,000 fixed costs, $95 price, $50 variable cost, $10,000 target profit.", onApply: () => setState({ fixedCosts: "18000", pricePerUnit: "95", variableCostPerUnit: "50", targetProfit: "10000" }) }
          ]}
        />
      </div>
      <div className="space-y-4">
        {!result ? (
          <EmptyCalculatorState title="Enter pricing and cost assumptions" body="Break-even math needs fixed costs, selling price, and variable cost per unit so the calculator can estimate the contribution margin and required sales volume." />
        ) : (
          <>
            <div className="surface space-y-4 p-6 md:p-8">
              <div>
                <p className="section-label">Break-even result</p>
                <h3 className="mt-4 text-3xl font-semibold">{formatNumber(result.breakEvenUnits, 1)} units</h3>
                <p className="mt-2 text-sm leading-7">
                  At {formatCurrency(pricePerUnit ?? 0)} per unit with {formatCurrency(variableCostPerUnit ?? 0)} in variable cost, you would need about {formatNumber(result.breakEvenUnits, 1)} units in sales to cover {formatCurrency(fixedCosts ?? 0)} in fixed costs.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <ResultCard label="Break-even units" value={formatNumber(result.breakEvenUnits, 1)} tone="success" />
                <ResultCard label="Break-even revenue" value={formatCurrency(result.breakEvenRevenue)} />
                <ResultCard label="Contribution margin" value={formatCurrency(result.contributionMarginPerUnit)} />
                <ResultCard label="Contribution margin %" value={formatPercent(result.contributionMarginRatio)} />
                <ResultCard label="Units for target profit" value={formatNumber(result.unitsForTargetProfit, 1)} />
                <ResultCard label="Revenue for target profit" value={formatCurrency(result.revenueForTargetProfit)} />
              </div>
            </div>
            <InsightPanel title="Pricing context" body="If contribution margin per unit is thin, break-even volume climbs quickly. That is why price changes, cost controls, and product mix can matter more than a small top-line growth assumption." />
          </>
        )}
      </div>
    </div>
  );
}
