export type ConversionCategoryKey = "length" | "weight" | "temperature" | "speed";

export interface ConversionUnit {
  value: string;
  label: string;
  shortLabel: string;
}

export interface ConversionCategoryDefinition {
  key: ConversionCategoryKey;
  title: string;
  description: string;
  units: ConversionUnit[];
}

const linearCategories: Record<Exclude<ConversionCategoryKey, "temperature">, { title: string; description: string; units: Array<ConversionUnit & { factor: number }> }> = {
  length: {
    title: "Length",
    description: "Convert between metric and imperial distance units for travel, construction, and everyday measurements.",
    units: [
      { value: "millimeter", label: "Millimeters", shortLabel: "mm", factor: 0.001 },
      { value: "centimeter", label: "Centimeters", shortLabel: "cm", factor: 0.01 },
      { value: "meter", label: "Meters", shortLabel: "m", factor: 1 },
      { value: "kilometer", label: "Kilometers", shortLabel: "km", factor: 1000 },
      { value: "inch", label: "Inches", shortLabel: "in", factor: 0.0254 },
      { value: "foot", label: "Feet", shortLabel: "ft", factor: 0.3048 },
      { value: "yard", label: "Yards", shortLabel: "yd", factor: 0.9144 },
      { value: "mile", label: "Miles", shortLabel: "mi", factor: 1609.344 }
    ]
  },
  weight: {
    title: "Weight",
    description: "Convert body weight, shipping weight, and ingredient quantities between common metric and imperial units.",
    units: [
      { value: "gram", label: "Grams", shortLabel: "g", factor: 1 },
      { value: "kilogram", label: "Kilograms", shortLabel: "kg", factor: 1000 },
      { value: "ounce", label: "Ounces", shortLabel: "oz", factor: 28.349523125 },
      { value: "pound", label: "Pounds", shortLabel: "lb", factor: 453.59237 },
      { value: "stone", label: "Stone", shortLabel: "st", factor: 6350.29318 }
    ]
  },
  speed: {
    title: "Speed",
    description: "Convert between miles per hour, kilometers per hour, meters per second, knots, and feet per second.",
    units: [
      { value: "mph", label: "Miles per hour", shortLabel: "mph", factor: 0.44704 },
      { value: "kph", label: "Kilometers per hour", shortLabel: "km/h", factor: 0.2777777778 },
      { value: "mps", label: "Meters per second", shortLabel: "m/s", factor: 1 },
      { value: "fps", label: "Feet per second", shortLabel: "ft/s", factor: 0.3048 },
      { value: "knot", label: "Knots", shortLabel: "kn", factor: 0.514444 }
    ]
  }
};

const temperatureUnits: ConversionUnit[] = [
  { value: "celsius", label: "Celsius", shortLabel: "C" },
  { value: "fahrenheit", label: "Fahrenheit", shortLabel: "F" },
  { value: "kelvin", label: "Kelvin", shortLabel: "K" }
];

export const conversionCategories: Record<ConversionCategoryKey, ConversionCategoryDefinition> = {
  length: {
    key: "length",
    title: linearCategories.length.title,
    description: linearCategories.length.description,
    units: linearCategories.length.units.map(({ factor: _factor, ...unit }) => unit)
  },
  weight: {
    key: "weight",
    title: linearCategories.weight.title,
    description: linearCategories.weight.description,
    units: linearCategories.weight.units.map(({ factor: _factor, ...unit }) => unit)
  },
  speed: {
    key: "speed",
    title: linearCategories.speed.title,
    description: linearCategories.speed.description,
    units: linearCategories.speed.units.map(({ factor: _factor, ...unit }) => unit)
  },
  temperature: {
    key: "temperature",
    title: "Temperature",
    description: "Convert between Celsius, Fahrenheit, and Kelvin for weather, cooking, and science use cases.",
    units: temperatureUnits
  }
};

export function getConversionCategory(key: ConversionCategoryKey) {
  return conversionCategories[key];
}

export function convertValue(category: ConversionCategoryKey, value: number, fromUnit: string, toUnit: string) {
  if (category === "temperature") {
    return convertTemperature(value, fromUnit, toUnit);
  }

  const definition = linearCategories[category as Exclude<ConversionCategoryKey, "temperature">];
  const from = definition.units.find((unit) => unit.value === fromUnit);
  const to = definition.units.find((unit) => unit.value === toUnit);

  if (!from || !to) {
    return undefined;
  }

  return (value * from.factor) / to.factor;
}

function convertTemperature(value: number, fromUnit: string, toUnit: string) {
  const celsius =
    fromUnit === "celsius"
      ? value
      : fromUnit === "fahrenheit"
        ? (value - 32) * (5 / 9)
        : fromUnit === "kelvin"
          ? value - 273.15
          : undefined;

  if (celsius === undefined) {
    return undefined;
  }

  switch (toUnit) {
    case "celsius":
      return celsius;
    case "fahrenheit":
      return celsius * (9 / 5) + 32;
    case "kelvin":
      return celsius + 273.15;
    default:
      return undefined;
  }
}

export function getCommonTimeZones() {
  return [
    { value: "America/New_York", label: "New York (ET)" },
    { value: "America/Chicago", label: "Chicago (CT)" },
    { value: "America/Denver", label: "Denver (MT)" },
    { value: "America/Los_Angeles", label: "Los Angeles (PT)" },
    { value: "Europe/London", label: "London (UK)" },
    { value: "Europe/Paris", label: "Paris (CET)" },
    { value: "Asia/Dubai", label: "Dubai (GST)" },
    { value: "Asia/Kolkata", label: "India (IST)" },
    { value: "Asia/Singapore", label: "Singapore (SGT)" },
    { value: "Asia/Tokyo", label: "Tokyo (JST)" },
    { value: "Australia/Sydney", label: "Sydney (AEST/AEDT)" }
  ];
}

function getOffsetMinutes(date: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  const parts = formatter.formatToParts(date);
  const map = Object.fromEntries(parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value]));
  const zonedUtc = Date.UTC(Number(map.year), Number(map.month) - 1, Number(map.day), Number(map.hour), Number(map.minute), Number(map.second));
  return (zonedUtc - date.getTime()) / 60000;
}

export function convertTimeZone(localDateTime: string, fromZone: string, toZone: string) {
  if (!localDateTime || !fromZone || !toZone) {
    return undefined;
  }

  const [datePart, timePart] = localDateTime.split("T");
  if (!datePart || !timePart) {
    return undefined;
  }

  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  if ([year, month, day, hour, minute].some((value) => !Number.isFinite(value))) {
    return undefined;
  }

  const naiveUtc = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
  const fromOffset = getOffsetMinutes(naiveUtc, fromZone);
  const actualUtc = new Date(naiveUtc.getTime() - fromOffset * 60000);

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: toZone,
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short"
  });

  const fromFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: fromZone,
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short"
  });

  return {
    actualUtc,
    fromDisplay: fromFormatter.format(actualUtc),
    toDisplay: formatter.format(actualUtc)
  };
}
