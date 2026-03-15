export type RoiMode = "final-value" | "gain-loss";

export interface RoiInputs {
  initial: number;
  finalValue: number;
  years?: number;
}

export interface RoiResult {
  gain: number;
  roi: number;
  annualized?: number;
}

export function calculateRoi({ initial, finalValue, years }: RoiInputs): RoiResult | undefined {
  if (initial <= 0 || finalValue < 0) {
    return undefined;
  }

  const gain = finalValue - initial;
  const roi = (gain / initial) * 100;
  const annualized = years && years > 0 && finalValue > 0 ? (Math.pow(finalValue / initial, 1 / years) - 1) * 100 : undefined;

  return {
    gain,
    roi,
    annualized
  };
}
