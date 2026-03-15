export interface RoiInputs {
  initial?: number;
  finalValue?: number;
  gain?: number;
  years?: number;
}

export interface RoiResult {
  initial: number;
  finalValue: number;
  gain: number;
  roi: number;
  annualized?: number;
  solvedBy: string;
  error?: string;
}

const tolerance = 0.02;

function nearlyEqual(a: number | undefined, b: number, allowedDifference = tolerance) {
  return a === undefined || Math.abs(a - b) <= allowedDifference;
}

function complete(initial: number, finalValue: number, solvedBy: string, years?: number): RoiResult | undefined {
  if (initial <= 0 || finalValue < 0) {
    return undefined;
  }

  const gain = finalValue - initial;
  const roi = (gain / initial) * 100;
  const annualized = years && years > 0 && finalValue > 0 ? (Math.pow(finalValue / initial, 1 / years) - 1) * 100 : undefined;

  return {
    initial,
    finalValue,
    gain,
    roi,
    annualized,
    solvedBy
  };
}

export function calculateRoi({ initial, finalValue, gain, years }: RoiInputs): RoiResult | undefined {
  const candidates = [
    initial !== undefined && finalValue !== undefined ? complete(initial, finalValue, "initial and final value", years) : undefined,
    initial !== undefined && gain !== undefined ? complete(initial, initial + gain, "initial and gain/loss", years) : undefined,
    finalValue !== undefined && gain !== undefined ? complete(finalValue - gain, finalValue, "final value and gain/loss", years) : undefined
  ].filter(Boolean) as RoiResult[];

  if (candidates.length === 0) {
    return undefined;
  }

  const consistent = candidates.find((candidate) => (
    nearlyEqual(initial, candidate.initial) &&
    nearlyEqual(finalValue, candidate.finalValue) &&
    nearlyEqual(gain, candidate.gain)
  ));

  if (consistent) {
    return consistent;
  }

  return {
    initial: 0,
    finalValue: 0,
    gain: 0,
    roi: 0,
    solvedBy: "conflicting inputs",
    error: "These inputs conflict with each other. Clear one field or enter any two compatible ROI values."
  } satisfies RoiResult;
}
