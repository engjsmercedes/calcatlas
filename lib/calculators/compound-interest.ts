export type ContributionFrequency = "monthly" | "quarterly" | "annually";
export type CompoundingFrequency = "annually" | "quarterly" | "monthly" | "daily";

export interface CompoundInterestInputs {
  initialAmount: number;
  contributionAmount: number;
  contributionFrequency: ContributionFrequency;
  annualRate: number;
  years: number;
  compoundingFrequency: CompoundingFrequency;
}

export interface CompoundInterestPoint {
  year: number;
  balance: number;
  contributions: number;
}

export interface CompoundInterestResult {
  finalBalance: number;
  totalContributions: number;
  totalInterest: number;
  points: CompoundInterestPoint[];
}

const compoundingPeriods: Record<CompoundingFrequency, number> = {
  annually: 1,
  quarterly: 4,
  monthly: 12,
  daily: 365
};

const contributionMonths: Record<ContributionFrequency, number> = {
  monthly: 1,
  quarterly: 3,
  annually: 12
};

export function calculateCompoundInterest(inputs: CompoundInterestInputs): CompoundInterestResult | undefined {
  const { initialAmount, contributionAmount, contributionFrequency, annualRate, years, compoundingFrequency } = inputs;

  if (initialAmount < 0 || contributionAmount < 0 || annualRate < 0 || years <= 0) {
    return undefined;
  }

  const totalMonths = Math.round(years * 12);
  if (totalMonths <= 0) {
    return undefined;
  }

  const monthlyRate = Math.pow(1 + annualRate / 100 / compoundingPeriods[compoundingFrequency], compoundingPeriods[compoundingFrequency] / 12) - 1;
  const interval = contributionMonths[contributionFrequency];

  let balance = initialAmount;
  let recurringContributions = 0;
  const points: CompoundInterestPoint[] = [{ year: 0, balance: initialAmount, contributions: initialAmount }];

  for (let month = 1; month <= totalMonths; month += 1) {
    balance *= 1 + monthlyRate;

    if (month % interval === 0) {
      balance += contributionAmount;
      recurringContributions += contributionAmount;
    }

    if (month % 12 === 0 || month === totalMonths) {
      points.push({
        year: month / 12,
        balance,
        contributions: initialAmount + recurringContributions
      });
    }
  }

  const totalContributions = initialAmount + recurringContributions;

  return {
    finalBalance: balance,
    totalContributions,
    totalInterest: balance - totalContributions,
    points
  };
}
