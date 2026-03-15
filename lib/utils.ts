export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function parseNumberInput(value: string) {
  const normalized = value
    .replace(/[$,%\s]/g, "")
    .replace(/,/g, "")
    .trim();

  if (!normalized) {
    return undefined;
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function formatNumber(value: number, maximumFractionDigits = 2) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits,
    minimumFractionDigits: value % 1 === 0 ? 0 : Math.min(2, maximumFractionDigits)
  }).format(value);
}

export function formatCurrency(value: number, maximumFractionDigits = 2) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits,
    minimumFractionDigits: 0
  }).format(value);
}

export function formatPercent(value: number, maximumFractionDigits = 2) {
  return `${formatNumber(value, maximumFractionDigits)}%`;
}

export function toQueryValue(value: string) {
  return value.trim();
}

export function round(value: number, decimals = 2) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

