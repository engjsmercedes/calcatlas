"use client";

import { ConversionCalculator } from "./conversion-calculator";

export function WeightConverter() {
  return (
    <ConversionCalculator
      category="weight"
      title="Weight"
      presets={[
        { label: "Body weight", description: "Convert 170 pounds into kilograms.", value: "170", fromUnit: "pound", toUnit: "kilogram" },
        { label: "Shipping weight", description: "Convert 25 kilograms into pounds.", value: "25", fromUnit: "kilogram", toUnit: "pound" }
      ]}
    />
  );
}
