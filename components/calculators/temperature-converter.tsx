"use client";

import { ConversionCalculator } from "./conversion-calculator";

export function TemperatureConverter() {
  return (
    <ConversionCalculator
      category="temperature"
      title="Temperature"
      presets={[
        { label: "Weather conversion", description: "Convert 72 F into Celsius.", value: "72", fromUnit: "fahrenheit", toUnit: "celsius" },
        { label: "Oven setting", description: "Convert 180 C into Fahrenheit.", value: "180", fromUnit: "celsius", toUnit: "fahrenheit" }
      ]}
    />
  );
}
