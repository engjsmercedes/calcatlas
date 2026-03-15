"use client";

import { useMemo } from "react";

import { InputField } from "@/components/ui/input-field";
import { PillTabs } from "@/components/ui/pill-tabs";
import { ResultCard } from "@/components/ui/result-card";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { RoiMode, calculateRoi } from "@/lib/calculators/roi";
import { formatCurrency, formatPercent, parseNumberInput } from "@/lib/utils";

import { CalculatorActions, EmptyCalculatorState, InsightPanel } from "./shared";

const initialState = {
  mode: "final-value",
  initial: "",
  finalValue: "",
  gainLoss: "",
  years: ""
};

export function RoiCalculator() {
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({
    initialState,
    keys: ["mode", "initial", "finalValue", "gainLoss", "years"]
  });

  const result = useMemo(() => {
    const initial = parseNumberInput(state.initial);
    if (initial === undefined) {
      return undefined;
    }

    const years = parseNumberInput(state.years);
    const mode = state.mode as RoiMode;
    const resolvedFinalValue =
      mode === "final-value"
        ? parseNumberInput(state.finalValue)
        : (() => {
            const gainLoss = parseNumberInput(state.gainLoss);
            return gainLoss === undefined ? undefined : initial + gainLoss;
          })();

    if (resolvedFinalValue === undefined) {
      return undefined;
    }

    return calculateRoi({ initial, finalValue: resolvedFinalValue, years: years || undefined });
  }, [state]);

  const initial = parseNumberInput(state.initial);
  const displayFinalValue =
    initial !== undefined && state.mode === "gain-loss" && parseNumberInput(state.gainLoss) !== undefined
      ? initial + (parseNumberInput(state.gainLoss) || 0)
      : parseNumberInput(state.finalValue);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="surface p-6 md:p-8">
        <div className="space-y-4">
          <PillTabs
            options={[
              { label: "Final value", value: "final-value" },
              { label: "Gain or loss", value: "gain-loss" }
            ]}
            value={state.mode as RoiMode}
            onChange={(mode) => setState((current) => ({ ...current, mode }))}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField
              label="Initial investment"
              hint="Starting amount"
              prefix="$"
              value={state.initial}
              onChange={(event) => setState((current) => ({ ...current, initial: event.target.value }))}
            />
            {state.mode === "final-value" ? (
              <InputField
                label="Final value"
                hint="Ending amount"
                prefix="$"
                value={state.finalValue}
                onChange={(event) => setState((current) => ({ ...current, finalValue: event.target.value }))}
              />
            ) : (
              <InputField
                label="Gain or loss"
                hint="Use a negative number for a loss"
                prefix="$"
                value={state.gainLoss}
                onChange={(event) => setState((current) => ({ ...current, gainLoss: event.target.value }))}
              />
            )}
            <InputField
              label="Years held"
              hint="Optional for annualized ROI"
              value={state.years}
              onChange={(event) => setState((current) => ({ ...current, years: event.target.value }))}
            />
          </div>
          <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
        </div>
      </div>
      <div className="space-y-4">
        {!result ? (
          <EmptyCalculatorState
            title="Enter your investment inputs"
            body="Add the initial amount and either the final value or the gain/loss. Include years held if you want the annualized view."
          />
        ) : (
          <>
            <div className="surface space-y-4 p-6 md:p-8">
              <div>
                <p className="section-label">Return summary</p>
                <h3 className="mt-4 text-2xl font-semibold">{formatPercent(result.roi)} ROI</h3>
                <p className="mt-2 text-sm leading-7">
                  An initial investment of {formatCurrency(initial || 0)} grows to {formatCurrency(displayFinalValue || 0)}, creating a {result.gain >= 0 ? "gain" : "loss"} of {formatCurrency(result.gain)}.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <ResultCard label="Gain or loss" value={formatCurrency(result.gain)} tone={result.gain >= 0 ? "success" : "warning"} />
                <ResultCard label="ROI" value={formatPercent(result.roi)} />
                <ResultCard label="Final value" value={formatCurrency(displayFinalValue || 0)} />
                {result.annualized !== undefined ? (
                  <ResultCard label="Annualized ROI" value={formatPercent(result.annualized)} />
                ) : null}
              </div>
            </div>
            <InsightPanel
              title="Investment insight"
              body={
                result.annualized !== undefined
                  ? `Spread across the holding period, this works out to about ${formatPercent(result.annualized)} per year. That makes it easier to compare against other opportunities.`
                  : "ROI measures total return only. Add the holding period to compare this result more cleanly against alternatives with different timelines."
              }
            />
          </>
        )}
      </div>
    </div>
  );
}
