"use client";

import { useMemo } from "react";

import { SelectField } from "@/components/ui/select-field";
import { useShareableCalculatorState } from "@/lib/hooks/use-shareable-calculator-state";
import type { ConversionCategoryKey } from "@/lib/calculators/conversions";

import { ConversionCalculator } from "./conversion-calculator";

const presetMap: Record<ConversionCategoryKey, Array<{ label: string; description: string; value: string; fromUnit: string; toUnit: string }>> = {
  length: [
    { label: "Road distance", description: "Convert 5 miles into kilometers.", value: "5", fromUnit: "mile", toUnit: "kilometer" },
    { label: "Room dimension", description: "Convert 12 feet into meters.", value: "12", fromUnit: "foot", toUnit: "meter" }
  ],
  weight: [
    { label: "Body weight", description: "Convert 170 pounds into kilograms.", value: "170", fromUnit: "pound", toUnit: "kilogram" },
    { label: "Recipe conversion", description: "Convert 500 grams into pounds.", value: "500", fromUnit: "gram", toUnit: "pound" }
  ],
  speed: [
    { label: "Highway speed", description: "Convert 60 mph into km/h.", value: "60", fromUnit: "mph", toUnit: "kph" },
    { label: "Running pace speed", description: "Convert 5 m/s into mph.", value: "5", fromUnit: "mps", toUnit: "mph" }
  ],
  temperature: [
    { label: "Weather check", description: "Convert 72 F into Celsius.", value: "72", fromUnit: "fahrenheit", toUnit: "celsius" },
    { label: "Science use", description: "Convert 300 Kelvin into Fahrenheit.", value: "300", fromUnit: "kelvin", toUnit: "fahrenheit" }
  ]
};

export function UnitConverter() {
  const { state, setState } = useShareableCalculatorState({
    initialState: { category: "length" },
    keys: ["category"]
  });

  const category = useMemo(() => {
    const value = state.category as ConversionCategoryKey;
    return ["length", "weight", "speed", "temperature"].includes(value) ? value : "length";
  }, [state.category]);

  return (
    <div className="space-y-4">
      <div className="surface p-6 md:p-8">
        <div className="max-w-sm">
          <SelectField label="Conversion type" value={category} onChange={(event) => setState({ category: event.target.value })}>
            <option value="length">Length</option>
            <option value="weight">Weight</option>
            <option value="speed">Speed</option>
            <option value="temperature">Temperature</option>
          </SelectField>
        </div>
      </div>
      <ConversionCalculator category={category} title="Unit" presets={presetMap[category]} />
    </div>
  );
}
