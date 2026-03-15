"use client";

import { useMemo } from "react";

import { InputField } from "@/components/ui/input-field";
import { PillTabs } from "@/components/ui/pill-tabs";
import { ResultCard } from "@/components/ui/result-card";
import { SelectField } from "@/components/ui/select-field";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { calculateRunningPace } from "@/lib/calculators/health";
import { formatNumber } from "@/lib/utils";

import { CalculatorActions, EmptyCalculatorState, InsightPanel } from "./shared";

const initialState = {
  mode: "time-to-pace",
  distance: "5",
  distanceUnit: "kilometers",
  hours: "0",
  minutes: "25",
  seconds: "0",
  paceMinutes: "8",
  paceSeconds: "0"
};

export function RunningPaceCalculator() {
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({
    initialState,
    keys: ["mode", "distance", "distanceUnit", "hours", "minutes", "seconds", "paceMinutes", "paceSeconds"]
  });

  const result = useMemo(
    () =>
      calculateRunningPace({
        mode: state.mode as any,
        distance: Number(state.distance) || 0,
        distanceUnit: state.distanceUnit as any,
        hours: Number(state.hours) || 0,
        minutes: Number(state.minutes) || 0,
        seconds: Number(state.seconds) || 0,
        paceMinutes: Number(state.paceMinutes) || 0,
        paceSeconds: Number(state.paceSeconds) || 0
      }),
    [state]
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="surface p-6 md:p-8 space-y-5">
        <PillTabs options={[{ label: "Time to pace", value: "time-to-pace" }, { label: "Pace to time", value: "pace-to-time" }]} value={state.mode as any} onChange={(mode) => setState((current) => ({ ...current, mode }))} />
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField label="Distance" value={state.distance} onChange={(event) => setState((current) => ({ ...current, distance: event.target.value }))} />
          <SelectField label="Distance unit" value={state.distanceUnit} onChange={(event) => setState((current) => ({ ...current, distanceUnit: event.target.value }))}>
            <option value="kilometers">Kilometers</option>
            <option value="miles">Miles</option>
          </SelectField>
          {state.mode === "time-to-pace" ? (
            <>
              <InputField label="Hours" value={state.hours} onChange={(event) => setState((current) => ({ ...current, hours: event.target.value }))} />
              <InputField label="Minutes" value={state.minutes} onChange={(event) => setState((current) => ({ ...current, minutes: event.target.value }))} />
              <InputField label="Seconds" value={state.seconds} onChange={(event) => setState((current) => ({ ...current, seconds: event.target.value }))} />
            </>
          ) : (
            <>
              <InputField label="Pace minutes" value={state.paceMinutes} onChange={(event) => setState((current) => ({ ...current, paceMinutes: event.target.value }))} />
              <InputField label="Pace seconds" value={state.paceSeconds} onChange={(event) => setState((current) => ({ ...current, paceSeconds: event.target.value }))} />
            </>
          )}
        </div>
        <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
      </div>
      <div className="space-y-4">
        {!result ? <EmptyCalculatorState title="Add a distance and time" body="You can work forward from a finish time or backward from a target pace." /> : (
          <>
            <div className="surface p-6 md:p-8 space-y-4">
              <div>
                <p className="section-label">Pace result</p>
                <h3 className="mt-4 text-3xl font-semibold">{result.pacePerMile} / mile</h3>
                <p className="mt-2 text-sm leading-7">That also works out to {result.pacePerKilometer} per kilometer and a finish time of {result.finishTime}.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <ResultCard label="Pace per mile" value={result.pacePerMile} tone="success" />
                <ResultCard label="Pace per km" value={result.pacePerKilometer} />
                <ResultCard label="Speed mph" value={formatNumber(result.speedMph)} />
                <ResultCard label="Speed kph" value={formatNumber(result.speedKph)} />
              </div>
            </div>
            <InsightPanel title="Training use" body="Pace is easier to apply in workouts, while speed helps compare efforts across treadmill, bike, and mixed cardio contexts." />
          </>
        )}
      </div>
    </div>
  );
}
