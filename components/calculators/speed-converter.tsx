"use client";

import { ConversionCalculator } from "./conversion-calculator";

export function SpeedConverter() {
  return (
    <ConversionCalculator
      category="speed"
      title="Speed"
      presets={[
        { label: "Highway speed", description: "Convert 60 mph into kilometers per hour.", value: "60", fromUnit: "mph", toUnit: "kph" },
        { label: "Sprint speed", description: "Convert 8 meters per second into miles per hour.", value: "8", fromUnit: "mps", toUnit: "mph" }
      ]}
    />
  );
}
