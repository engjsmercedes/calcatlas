import type { DecisionCalculatorConfig, DecisionFactorDimension } from "@/data/life-decision-config";

export interface DecisionFactorInput {
  optionA: number;
  optionB: number;
  weight: number;
}

interface DimensionTotals {
  weight: number;
  optionA: number;
  optionB: number;
}

export interface DecisionOutcome {
  optionAScore: number;
  optionBScore: number;
  optionAPractical: number;
  optionBPractical: number;
  optionAEmotional: number;
  optionBEmotional: number;
  optionARisk: number;
  optionBRisk: number;
  recommendation: "A" | "B" | "tie";
  recommendedLabel: string;
  gap: number;
  confidenceLabel: string;
  verdictLabel: string;
  verdictTone: "success" | "caution" | "neutral";
  strongestFactors: string[];
  cautionFactors: string[];
}

function average(total: DimensionTotals, side: "optionA" | "optionB") {
  if (!total.weight) {
    return 0;
  }

  return total[side] / total.weight;
}

function emptyTotals(): DimensionTotals {
  return { weight: 0, optionA: 0, optionB: 0 };
}

function getDimensionTotals(config: DecisionCalculatorConfig, inputs: Record<string, DecisionFactorInput>, dimension: DecisionFactorDimension) {
  return config.factors.reduce((totals, factor) => {
    if (factor.dimension !== dimension) {
      return totals;
    }

    const input = inputs[factor.id];
    totals.weight += input.weight;
    totals.optionA += input.optionA * input.weight;
    totals.optionB += input.optionB * input.weight;
    return totals;
  }, emptyTotals());
}

export function calculateDecisionOutcome(
  config: DecisionCalculatorConfig,
  inputs: Record<string, DecisionFactorInput>
): DecisionOutcome {
  const overall = config.factors.reduce(
    (totals, factor) => {
      const input = inputs[factor.id];
      totals.weight += input.weight;
      totals.optionA += input.optionA * input.weight;
      totals.optionB += input.optionB * input.weight;
      return totals;
    },
    emptyTotals()
  );

  const practical = getDimensionTotals(config, inputs, "practical");
  const emotional = getDimensionTotals(config, inputs, "emotional");
  const risk = getDimensionTotals(config, inputs, "risk");

  const optionAScore = average(overall, "optionA");
  const optionBScore = average(overall, "optionB");
  const gap = optionAScore - optionBScore;
  const recommendation = gap > 0.2 ? "A" : gap < -0.2 ? "B" : "tie";
  const recommendedLabel = recommendation === "A" ? config.optionALabel : recommendation === "B" ? config.optionBLabel : "Close call";
  const absoluteGap = Math.abs(gap);
  const confidenceLabel = absoluteGap >= 1.25 ? "High confidence" : absoluteGap >= 0.6 ? "Moderate confidence" : "Low confidence";
  const verdictLabel = recommendation === "tie" ? "Close call" : `${recommendedLabel} leads`;
  const strongestFactors = config.factors
    .map((factor) => {
      const input = inputs[factor.id];
      const direction = input.optionA - input.optionB;
      return {
        label: factor.label,
        weight: input.weight,
        swing: recommendation === "A" ? direction : recommendation === "B" ? -direction : Math.abs(direction)
      };
    })
    .sort((left, right) => right.swing * right.weight - left.swing * left.weight)
    .filter((item) => item.swing > 0.5)
    .slice(0, 3)
    .map((item) => item.label);

  const cautionFactors = config.factors
    .filter((factor) => factor.dimension === "risk")
    .filter((factor) => {
      const input = inputs[factor.id];
      const score = recommendation === "A" ? input.optionA : recommendation === "B" ? input.optionB : Math.max(input.optionA, input.optionB);
      return score < 6 && input.weight >= 4;
    })
    .slice(0, 3)
    .map((factor) => factor.label);

  const recommendedRisk = recommendation === "A" ? average(risk, "optionA") : recommendation === "B" ? average(risk, "optionB") : Math.max(average(risk, "optionA"), average(risk, "optionB"));
  const verdictTone = recommendation === "tie" ? "neutral" : recommendedRisk < 5.5 ? "caution" : "success";

  return {
    optionAScore,
    optionBScore,
    optionAPractical: average(practical, "optionA"),
    optionBPractical: average(practical, "optionB"),
    optionAEmotional: average(emotional, "optionA"),
    optionBEmotional: average(emotional, "optionB"),
    optionARisk: average(risk, "optionA"),
    optionBRisk: average(risk, "optionB"),
    recommendation,
    recommendedLabel,
    gap,
    confidenceLabel,
    verdictLabel,
    verdictTone,
    strongestFactors,
    cautionFactors
  };
}

