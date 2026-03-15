"use client";

import { ConversionCalculator } from "./conversion-calculator";

export function LengthConverter() {
  return (
    <ConversionCalculator
      category="length"
      title="Length"
      presets={[
        { label: "Trip distance", description: "Convert 5 miles into kilometers.", value: "5", fromUnit: "mile", toUnit: "kilometer" },
        { label: "Room width", description: "Convert 12 feet into meters.", value: "12", fromUnit: "foot", toUnit: "meter" }
      ]}
    />
  );
}
