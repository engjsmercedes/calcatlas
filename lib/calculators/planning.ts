export interface SavingsGoalInputs {
  currentSavings: number;
  targetAmount: number;
  monthlyContribution: number;
  annualRate: number;
}

export interface SavingsGoalPoint {
  year: number;
  balance: number;
}

export interface SavingsGoalResult {
  monthsToGoal: number;
  yearsToGoal: number;
  totalContributions: number;
  interestEarned: number;
  monthlyRateNeededWithoutInterest: number;
  points: SavingsGoalPoint[];
}

export interface InflationInputs {
  amount: number;
  annualInflationRate: number;
  years: number;
}

export interface InflationPoint {
  year: number;
  futureValue: number;
  purchasingPower: number;
}

export interface InflationResult {
  futureCost: number;
  lostPurchasingPower: number;
  realValueOfTodayAmount: number;
  points: InflationPoint[];
}

export interface DownPaymentInputs {
  homePrice: number;
  downPaymentPercent: number;
  mortgageRate: number;
  loanTermYears: number;
  propertyTaxAnnual?: number;
  insuranceAnnual?: number;
}

export interface DownPaymentResult {
  downPaymentAmount: number;
  loanAmount: number;
  monthlyPrincipalInterest: number;
  estimatedMonthlyPayment: number;
  upfrontCashNeeded: number;
  loanToValue: number;
}

export interface TipInputs {
  billAmount: number;
  tipPercent: number;
  splitCount: number;
}

export interface TipResult {
  tipAmount: number;
  totalAmount: number;
  perPerson: number;
}

export interface DiscountInputs {
  originalPrice: number;
  discountPercent: number;
  extraPercentOff?: number;
}

export interface DiscountResult {
  salePrice: number;
  savings: number;
  effectiveDiscount: number;
}

function round(value: number, decimals = 2) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export function calculateSavingsGoal(inputs: SavingsGoalInputs): SavingsGoalResult | undefined {
  const { currentSavings, targetAmount, monthlyContribution, annualRate } = inputs;

  if (currentSavings < 0 || targetAmount <= 0 || monthlyContribution < 0 || annualRate < 0 || currentSavings >= targetAmount) {
    return undefined;
  }

  const monthlyRate = annualRate / 100 / 12;
  let balance = currentSavings;
  let month = 0;
  const points: SavingsGoalPoint[] = [{ year: 0, balance: currentSavings }];

  while (balance < targetAmount && month < 1200) {
    month += 1;
    balance = balance * (1 + monthlyRate) + monthlyContribution;

    if (month % 12 === 0 || balance >= targetAmount) {
      points.push({
        year: round(month / 12, 1),
        balance: round(balance)
      });
    }
  }

  const totalContributions = currentSavings + monthlyContribution * month;
  const interestEarned = balance - totalContributions;
  const monthlyRateNeededWithoutInterest = month > 0 ? (targetAmount - currentSavings) / month : 0;

  return {
    monthsToGoal: month,
    yearsToGoal: round(month / 12, 1),
    totalContributions: round(totalContributions),
    interestEarned: round(interestEarned),
    monthlyRateNeededWithoutInterest: round(monthlyRateNeededWithoutInterest),
    points
  };
}

export function calculateInflation(inputs: InflationInputs): InflationResult | undefined {
  const { amount, annualInflationRate, years } = inputs;

  if (amount <= 0 || annualInflationRate < 0 || years <= 0) {
    return undefined;
  }

  const futureCost = amount * Math.pow(1 + annualInflationRate / 100, years);
  const lostPurchasingPower = futureCost - amount;
  const realValueOfTodayAmount = amount / Math.pow(1 + annualInflationRate / 100, years);
  const points: InflationPoint[] = [];

  for (let year = 0; year <= Math.ceil(years); year += 1) {
    const futureValue = amount * Math.pow(1 + annualInflationRate / 100, year);
    const purchasingPower = amount / Math.pow(1 + annualInflationRate / 100, year);
    points.push({
      year,
      futureValue: round(futureValue),
      purchasingPower: round(purchasingPower)
    });
  }

  return {
    futureCost: round(futureCost),
    lostPurchasingPower: round(lostPurchasingPower),
    realValueOfTodayAmount: round(realValueOfTodayAmount),
    points
  };
}

function amortizedMonthlyPayment(principal: number, annualRate: number, months: number) {
  const monthlyRate = annualRate / 100 / 12;

  if (months <= 0) {
    return 0;
  }

  if (monthlyRate === 0) {
    return principal / months;
  }

  return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
}

export function calculateDownPayment(inputs: DownPaymentInputs): DownPaymentResult | undefined {
  const {
    homePrice,
    downPaymentPercent,
    mortgageRate,
    loanTermYears,
    propertyTaxAnnual = 0,
    insuranceAnnual = 0
  } = inputs;

  if (
    homePrice <= 0 ||
    downPaymentPercent < 0 ||
    downPaymentPercent >= 100 ||
    mortgageRate < 0 ||
    loanTermYears <= 0 ||
    propertyTaxAnnual < 0 ||
    insuranceAnnual < 0
  ) {
    return undefined;
  }

  const downPaymentAmount = homePrice * (downPaymentPercent / 100);
  const loanAmount = homePrice - downPaymentAmount;
  const monthlyPrincipalInterest = amortizedMonthlyPayment(loanAmount, mortgageRate, Math.round(loanTermYears * 12));
  const estimatedMonthlyPayment = monthlyPrincipalInterest + propertyTaxAnnual / 12 + insuranceAnnual / 12;

  return {
    downPaymentAmount: round(downPaymentAmount),
    loanAmount: round(loanAmount),
    monthlyPrincipalInterest: round(monthlyPrincipalInterest),
    estimatedMonthlyPayment: round(estimatedMonthlyPayment),
    upfrontCashNeeded: round(downPaymentAmount),
    loanToValue: round(loanAmount / homePrice, 4)
  };
}

export function calculateTip(inputs: TipInputs): TipResult | undefined {
  const { billAmount, tipPercent, splitCount } = inputs;

  if (billAmount <= 0 || tipPercent < 0 || splitCount <= 0) {
    return undefined;
  }

  const tipAmount = billAmount * (tipPercent / 100);
  const totalAmount = billAmount + tipAmount;

  return {
    tipAmount: round(tipAmount),
    totalAmount: round(totalAmount),
    perPerson: round(totalAmount / splitCount)
  };
}

export function calculateDiscount(inputs: DiscountInputs): DiscountResult | undefined {
  const { originalPrice, discountPercent, extraPercentOff = 0 } = inputs;

  if (originalPrice <= 0 || discountPercent < 0 || extraPercentOff < 0) {
    return undefined;
  }

  const firstDiscounted = originalPrice * (1 - discountPercent / 100);
  const salePrice = firstDiscounted * (1 - extraPercentOff / 100);
  const savings = originalPrice - salePrice;
  const effectiveDiscount = (savings / originalPrice) * 100;

  return {
    salePrice: round(salePrice),
    savings: round(savings),
    effectiveDiscount: round(effectiveDiscount)
  };
}
