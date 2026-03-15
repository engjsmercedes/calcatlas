export type PercentageMode = "of-number" | "percent-of" | "change";

export function calculatePercentageOf(percent: number, base: number) {
  return (percent / 100) * base;
}

export function calculatePercentOf(part: number, total: number) {
  if (total === 0) {
    return undefined;
  }

  return (part / total) * 100;
}

export function calculatePercentageChange(from: number, to: number) {
  if (from === 0) {
    return undefined;
  }

  const difference = to - from;
  return {
    difference,
    percentage: (difference / from) * 100
  };
}
