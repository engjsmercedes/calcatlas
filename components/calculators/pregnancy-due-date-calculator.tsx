"use client";

import { useMemo } from "react";

import { InputField } from "@/components/ui/input-field";
import { PillTabs } from "@/components/ui/pill-tabs";
import { ResultCard } from "@/components/ui/result-card";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { calculatePregnancyDueDate } from "@/lib/calculators/health";

import { CalculatorActions, EmptyCalculatorState, ExamplePresetList, InsightPanel } from "./shared";

const initialState = {
  mode: "last-period",
  referenceDate: "2026-03-01",
  cycleLength: "28"
};

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function PregnancyDueDateCalculator() {
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({
    initialState,
    keys: ["mode", "referenceDate", "cycleLength"]
  });

  const result = useMemo(() => {
    return calculatePregnancyDueDate({
      mode: state.mode as any,
      referenceDate: state.referenceDate,
      cycleLength: Number(state.cycleLength) || 28
    });
  }, [state.mode, state.referenceDate, state.cycleLength]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-4">
        <div className="surface space-y-5 p-6 md:p-8">
          <PillTabs
            options={[
              { label: "Last period", value: "last-period" },
              { label: "Conception date", value: "conception" }
            ]}
            value={state.mode as any}
            onChange={(mode) => setState((current) => ({ ...current, mode }))}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField
              label={state.mode === "last-period" ? "First day of last period" : "Conception date"}
              type="date"
              value={state.referenceDate}
              onChange={(event) => setState((current) => ({ ...current, referenceDate: event.target.value }))}
            />
            <InputField
              label="Cycle length"
              hint="Only used for last-period mode"
              value={state.cycleLength}
              onChange={(event) => setState((current) => ({ ...current, cycleLength: event.target.value }))}
            />
          </div>
          <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
        </div>
        <ExamplePresetList
          title="Try an example"
          body="Use a preset pregnancy timeline to compare a standard 28-day cycle against a conception-date estimate."
          items={[
            {
              label: "Standard cycle",
              description: "Use the first day of the last period with a 28-day cycle for the most common estimate path.",
              onApply: () => setState({ mode: "last-period", referenceDate: "2026-03-01", cycleLength: "28" })
            },
            {
              label: "Known conception date",
              description: "Use a conception date when that reference point is clearer than the last menstrual period.",
              onApply: () => setState({ mode: "conception", referenceDate: "2026-03-15", cycleLength: "28" })
            }
          ]}
        />
      </div>
      <div className="space-y-4">
        {!result ? (
          <EmptyCalculatorState title="Enter a pregnancy reference date" body="Use either the first day of the last period or a conception date to estimate the due date and nearby fertility timing." />
        ) : (
          <>
            <div className="surface space-y-4 p-6 md:p-8">
              <div>
                <p className="section-label">Due date estimate</p>
                <h3 className="mt-4 text-3xl font-semibold">{formatDate(result.dueDate)}</h3>
                <p className="mt-2 text-sm leading-7">This estimate is based on {state.mode === "last-period" ? "the first day of the last period" : "the conception date"} and should be treated as a planning date, not a clinical diagnosis.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <ResultCard label="Estimated due date" value={formatDate(result.dueDate)} tone="success" />
                <ResultCard label="Estimated ovulation" value={formatDate(result.ovulationDate)} />
                <ResultCard label="Fertile window start" value={formatDate(result.fertileStart)} />
                <ResultCard label="Estimated current week" value={`Week ${result.currentWeek}`} />
              </div>
            </div>
            <InsightPanel title="Medical note" body="Pregnancy dating is often refined with ultrasound and clinical review. This calculator is useful for early planning, appointment timing, and personal context, but it should not replace guidance from a clinician." />
          </>
        )}
      </div>
    </div>
  );
}
