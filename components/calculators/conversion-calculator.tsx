"use client";

import { useMemo } from "react";

import { SelectField } from "@/components/ui/select-field";
import { InputField } from "@/components/ui/input-field";
import { ResultCard } from "@/components/ui/result-card";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import { convertValue, getConversionCategory, type ConversionCategoryKey } from "@/lib/calculators/conversions";
import { formatNumber, parseNumberInput } from "@/lib/utils";

import { CalculatorActions, EmptyCalculatorState, ExamplePresetList, InsightPanel } from "./shared";

const defaultStateByCategory: Record<ConversionCategoryKey, { value: string; fromUnit: string; toUnit: string }> = {
  length: { value: "5", fromUnit: "mile", toUnit: "kilometer" },
  weight: { value: "170", fromUnit: "pound", toUnit: "kilogram" },
  speed: { value: "60", fromUnit: "mph", toUnit: "kph" },
  temperature: { value: "72", fromUnit: "fahrenheit", toUnit: "celsius" }
};

export function ConversionCalculator({
  category,
  title,
  presets
}: {
  category: ConversionCategoryKey;
  title: string;
  presets: Array<{ label: string; description: string; value: string; fromUnit: string; toUnit: string }>;
}) {
  const defaults = defaultStateByCategory[category];
  const definition = getConversionCategory(category);
  const { state, setState, hasActiveValues, copyShareLink, reset } = useShareableCalculatorState({
    initialState: defaults,
    keys: ["value", "fromUnit", "toUnit"]
  });

  const numericValue = parseNumberInput(state.value);

  const converted = useMemo(() => {
    if (numericValue === undefined) {
      return undefined;
    }

    return convertValue(category, numericValue, state.fromUnit, state.toUnit);
  }, [category, numericValue, state.fromUnit, state.toUnit]);

  const fromUnit = definition.units.find((unit) => unit.value === state.fromUnit);
  const toUnit = definition.units.find((unit) => unit.value === state.toUnit);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-4">
        <div className="surface p-6 md:p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField label="Value" value={state.value} onChange={(event) => setState((current) => ({ ...current, value: event.target.value }))} />
            <div className="grid gap-4 sm:grid-cols-2 sm:col-span-2">
              <SelectField label="From unit" value={state.fromUnit} onChange={(event) => setState((current) => ({ ...current, fromUnit: event.target.value }))}>
                {definition.units.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </SelectField>
              <SelectField label="To unit" value={state.toUnit} onChange={(event) => setState((current) => ({ ...current, toUnit: event.target.value }))}>
                {definition.units.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </SelectField>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-muted">
            Enter a value and choose the source and target units. Results update instantly and the selected conversion stays in the URL for sharing.
          </p>
          <div className="mt-6">
            <CalculatorActions onReset={reset} onShare={copyShareLink} hasActiveValues={hasActiveValues} />
          </div>
        </div>
        <ExamplePresetList
          title="Try an example"
          body={`Use a preset ${title.toLowerCase()} conversion to test common unit changes without typing the full scenario.`}
          items={presets.map((preset) => ({
            label: preset.label,
            description: preset.description,
            onApply: () => setState({ value: preset.value, fromUnit: preset.fromUnit, toUnit: preset.toUnit })
          }))}
        />
      </div>
      <div className="space-y-4">
        {converted === undefined || !fromUnit || !toUnit ? (
          <EmptyCalculatorState title={`Enter a ${title.toLowerCase()} value`} body={`Add a numeric value and pick two ${title.toLowerCase()} units to convert between them instantly.`} />
        ) : (
          <>
            <div className="surface space-y-4 p-6 md:p-8">
              <div>
                <p className="section-label">Converted value</p>
                <h3 className="mt-4 text-3xl font-semibold">
                  {formatNumber(converted, 6)} {toUnit.shortLabel}
                </h3>
                <p className="mt-2 text-sm leading-7">
                  {formatNumber(numericValue ?? 0, 6)} {fromUnit.shortLabel} equals {formatNumber(converted, 6)} {toUnit.shortLabel}.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <ResultCard label="From" value={`${formatNumber(numericValue ?? 0, 6)} ${fromUnit.shortLabel}`} />
                <ResultCard label="To" value={`${formatNumber(converted, 6)} ${toUnit.shortLabel}`} tone="success" />
              </div>
            </div>
            <InsightPanel title="Conversion context" body={definition.description} />
          </>
        )}
      </div>
    </div>
  );
}
