"use client";

import { useMemo } from "react";

import { InputField } from "@/components/ui/input-field";
import { ResultCard } from "@/components/ui/result-card";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { calculateRoi } from "@/lib/calculators/roi";
import { formatCurrency, formatPercent, parseNumberInput } from "@/lib/utils";

import { CalculatorActions, EmptyCalculatorState, InsightPanel } from "./shared";

const initialState = {
  initial: "",
  finalValue: "",
  gainLoss: "",
  years: ""
};

export function RoiCalculator() {
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({
    initialState,
    keys: ["initial", "finalValue", "gainLoss", "years"]
  });

  const result = useMemo(
    () =>
      calculateRoi({
        initial: parseNumberInput(state.initial),
        finalValue: parseNumberInput(state.finalValue),
        gain: parseNumberInput(state.gainLoss),
        years: parseNumberInput(state.years) || undefined
      }),
    [state]
  );

  const solvedField = result && !result.error ? result.solvedField : undefined;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="surface p-6 md:p-8">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField label="Initial investment" hint="Starting amount" tooltip="Your starting cash outlay or investment basis." prefix="$" highlighted={solvedField === "initial"} value={state.initial} onChange={(event) => setState((current) => ({ ...current, initial: event.target.value }))} />
            <InputField label="Final value" hint="Ending amount" tooltip="Ending value after growth or loss." prefix="$" highlighted={solvedField === "finalValue"} value={state.finalValue} onChange={(event) => setState((current) => ({ ...current, finalValue: event.target.value }))} />
            <InputField label="Gain or loss" hint="Use a negative number for a loss" tooltip="Absolute change between the initial investment and final value." prefix="$" highlighted={solvedField === "gain"} value={state.gainLoss} onChange={(event) => setState((current) => ({ ...current, gainLoss: event.target.value }))} />
            <InputField label="Years held" hint="Optional for annualized ROI" tooltip="Holding period used to annualize the return." value={state.years} onChange={(event) => setState((current) => ({ ...current, years: event.target.value }))} />
          </div>
          <p className="text-sm leading-7">
            Enter any two compatible ROI fields. The calculator will solve the missing value and check whether additional fields agree with each other.
          </p>
          <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
        </div>
      </div>
      <div className="space-y-4">
        {!result ? (
          <EmptyCalculatorState
            title="Enter two ROI inputs"
            body="For example: initial and final value, initial and gain/loss, or final value and gain/loss. Add years held if you want the annualized view."
          />
        ) : result.error ? (
          <EmptyCalculatorState title="Inputs conflict" body={result.error} />
        ) : (
          <>
            <div className="surface space-y-4 p-6 md:p-8">
              <div>
                <p className="section-label">Return summary</p>
                <h3 className="mt-4 text-2xl font-semibold">{formatPercent(result.roi)} ROI</h3>
                <p className="mt-2 text-sm leading-7">
                  Solved from {result.solvedBy}, this investment moves from {formatCurrency(result.initial)} to {formatCurrency(result.finalValue)}, creating a {result.gain >= 0 ? "gain" : "loss"} of {formatCurrency(result.gain)}.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <ResultCard label="Initial investment" value={formatCurrency(result.initial)} />
                <ResultCard label="Final value" value={formatCurrency(result.finalValue)} tone="success" />
                <ResultCard label="Gain or loss" value={formatCurrency(result.gain)} tone={result.gain >= 0 ? "success" : "warning"} />
                <ResultCard label="ROI" value={formatPercent(result.roi)} />
                {result.annualized !== undefined ? <ResultCard label="Annualized ROI" value={formatPercent(result.annualized)} /> : null}
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