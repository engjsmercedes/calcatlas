"use client";

import { useMemo } from "react";

import { InputField } from "@/components/ui/input-field";
import { ResultCard } from "@/components/ui/result-card";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { calculateCommission } from "@/lib/calculators/expansion";
import { formatCurrency, formatPercent, parseNumberInput } from "@/lib/utils";

import { CalculatorActions, EmptyCalculatorState, ExamplePresetList, InsightPanel } from "./shared";

const initialState = {
  salesAmount: "24000",
  commissionRate: "8",
  basePay: "",
  bonusThreshold: "30000",
  bonusAmount: "1000"
};

export function CommissionCalculator() {
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({
    initialState,
    keys: ["salesAmount", "commissionRate", "basePay", "bonusThreshold", "bonusAmount"]
  });

  const salesAmount = parseNumberInput(state.salesAmount);
  const commissionRate = parseNumberInput(state.commissionRate);
  const basePay = parseNumberInput(state.basePay) ?? 0;
  const bonusThreshold = parseNumberInput(state.bonusThreshold) ?? 0;
  const bonusAmount = parseNumberInput(state.bonusAmount) ?? 0;

  const result = useMemo(() => {
    if (salesAmount === undefined || commissionRate === undefined) {
      return undefined;
    }
    return calculateCommission({ salesAmount, commissionRate, basePay, bonusThreshold, bonusAmount });
  }, [basePay, bonusAmount, bonusThreshold, commissionRate, salesAmount]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-4">
        <div className="surface p-6 md:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField label="Sales amount" prefix="$" value={state.salesAmount} onChange={(event) => setState((current) => ({ ...current, salesAmount: event.target.value }))} />
            <InputField label="Commission rate" hint="Percent" value={state.commissionRate} onChange={(event) => setState((current) => ({ ...current, commissionRate: event.target.value }))} />
            <InputField label="Base pay" prefix="$" value={state.basePay} onChange={(event) => setState((current) => ({ ...current, basePay: event.target.value }))} />
            <InputField label="Bonus threshold" prefix="$" value={state.bonusThreshold} onChange={(event) => setState((current) => ({ ...current, bonusThreshold: event.target.value }))} />
            <InputField label="Bonus amount" prefix="$" value={state.bonusAmount} onChange={(event) => setState((current) => ({ ...current, bonusAmount: event.target.value }))} />
          </div>
          <div className="mt-6">
            <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
          </div>
        </div>
        <ExamplePresetList
          title="Try an example"
          body="Use presets to compare a standard commission month against a month that crosses the bonus threshold."
          items={[
            { label: "Below bonus target", description: "$24,000 in sales at 8% commission with a $30,000 bonus threshold.", onApply: () => setState(initialState) },
            { label: "Above bonus target", description: "$36,000 in sales at 8% commission with a $1,000 threshold bonus.", onApply: () => setState({ salesAmount: "36000", commissionRate: "8", basePay: "0", bonusThreshold: "30000", bonusAmount: "1000" }) }
          ]}
        />
      </div>
      <div className="space-y-4">
        {!result ? (
          <EmptyCalculatorState title="Enter sales and commission assumptions" body="Use the sales amount and commission rate to estimate payout, then optionally add base pay and a threshold bonus for a fuller compensation picture." />
        ) : (
          <>
            <div className="surface space-y-4 p-6 md:p-8">
              <div>
                <p className="section-label">Commission result</p>
                <h3 className="mt-4 text-3xl font-semibold">{formatCurrency(result.totalPay)}</h3>
                <p className="mt-2 text-sm leading-7">
                  {formatCurrency(salesAmount ?? 0)} in sales at {commissionRate}% generates {formatCurrency(result.commission)} in commission{result.bonusEarned > 0 ? ` plus a ${formatCurrency(result.bonusEarned)} bonus` : ""}.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <ResultCard label="Commission" value={formatCurrency(result.commission)} tone="success" />
                <ResultCard label="Total pay" value={formatCurrency(result.totalPay)} />
                <ResultCard label="Effective rate" value={formatPercent(result.effectiveRate)} />
                <ResultCard label="Bonus earned" value={formatCurrency(result.bonusEarned)} />
                <ResultCard label="Sales to next bonus" value={formatCurrency(result.salesToNextBonus)} />
              </div>
            </div>
            <InsightPanel title="Comp plan context" body="Commission plans are easiest to judge when the variable pay, threshold bonuses, and base pay are all visible at once. That helps salespeople compare plans that look similar on headline rate alone." />
          </>
        )}
      </div>
    </div>
  );
}

