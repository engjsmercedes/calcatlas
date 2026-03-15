"use client";

import { useMemo } from "react";

import { SelectField } from "@/components/ui/select-field";
import { InputField } from "@/components/ui/input-field";
import { ResultCard } from "@/components/ui/result-card";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { convertTimeZone, getCommonTimeZones } from "@/lib/calculators/conversions";

import { CalculatorActions, EmptyCalculatorState, ExamplePresetList, InsightPanel } from "./shared";

const zones = getCommonTimeZones();
const initialState = {
  dateTime: "2026-03-15T09:00",
  fromZone: "America/New_York",
  toZone: "Europe/London"
};

export function TimeZoneConverter() {
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({
    initialState,
    keys: ["dateTime", "fromZone", "toZone"]
  });

  const result = useMemo(() => convertTimeZone(state.dateTime, state.fromZone, state.toZone), [state.dateTime, state.fromZone, state.toZone]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-4">
        <div className="surface p-6 md:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField label="Date and time" type="datetime-local" value={state.dateTime} onChange={(event) => setState((current) => ({ ...current, dateTime: event.target.value }))} />
            <SelectField label="From time zone" value={state.fromZone} onChange={(event) => setState((current) => ({ ...current, fromZone: event.target.value }))}>
              {zones.map((zone) => (
                <option key={zone.value} value={zone.value}>
                  {zone.label}
                </option>
              ))}
            </SelectField>
            <SelectField label="To time zone" value={state.toZone} onChange={(event) => setState((current) => ({ ...current, toZone: event.target.value }))}>
              {zones.map((zone) => (
                <option key={zone.value} value={zone.value}>
                  {zone.label}
                </option>
              ))}
            </SelectField>
          </div>
          <p className="mt-4 text-sm leading-7 text-muted">
            Enter a local meeting or event time in the source zone to see the equivalent time in another city. The selected zones stay in the URL so the scenario can be shared.
          </p>
          <div className="mt-6">
            <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
          </div>
        </div>
        <ExamplePresetList
          title="Try an example"
          body="Use a preset meeting scenario to compare business hours across common global time zones."
          items={[
            {
              label: "New York to London",
              description: "See what a 9:00 AM New York meeting looks like in London.",
              onApply: () => setState({ dateTime: "2026-03-15T09:00", fromZone: "America/New_York", toZone: "Europe/London" })
            },
            {
              label: "California to India",
              description: "Convert an afternoon West Coast call into India Standard Time.",
              onApply: () => setState({ dateTime: "2026-03-15T15:30", fromZone: "America/Los_Angeles", toZone: "Asia/Kolkata" })
            }
          ]}
        />
      </div>
      <div className="space-y-4">
        {!result ? (
          <EmptyCalculatorState title="Enter a date, time, and two zones" body="Choose a local time and two time zones to see the converted meeting or event time instantly." />
        ) : (
          <>
            <div className="surface space-y-4 p-6 md:p-8">
              <div>
                <p className="section-label">Converted time</p>
                <h3 className="mt-4 text-3xl font-semibold">{result.toDisplay}</h3>
                <p className="mt-2 text-sm leading-7">The source time is {result.fromDisplay}. This lets you compare meetings and deadlines across regions without manual offset math.</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <ResultCard label="Source time" value={result.fromDisplay} />
                <ResultCard label="Converted time" value={result.toDisplay} tone="success" />
              </div>
            </div>
            <InsightPanel title="Time-zone context" body="Daylight-saving changes can shift meeting times seasonally, so using named time zones is more reliable than comparing fixed UTC offsets by hand." />
          </>
        )}
      </div>
    </div>
  );
}
