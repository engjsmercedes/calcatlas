import { amortizedMonthlyPayment } from "./borrowing";
import { round } from "@/lib/utils";

export interface SimpleInterestInputs {
  principal: number;
  annualRate: number;
  years: number;
}

export interface SimpleInterestResult {
  interestEarned: number;
  futureValue: number;
  annualInterest: number;
  monthlyAverageInterest: number;
}

export interface BreakEvenInputs {
  fixedCosts: number;
  pricePerUnit: number;
  variableCostPerUnit: number;
  targetProfit?: number;
}

export interface BreakEvenResult {
  contributionMarginPerUnit: number;
  contributionMarginRatio: number;
  breakEvenUnits: number;
  breakEvenRevenue: number;
  unitsForTargetProfit: number;
  revenueForTargetProfit: number;
}

export interface CommissionInputs {
  salesAmount: number;
  commissionRate: number;
  basePay?: number;
  bonusThreshold?: number;
  bonusAmount?: number;
}

export interface CommissionResult {
  commission: number;
  totalPay: number;
  effectiveRate: number;
  bonusEarned: number;
  salesToNextBonus: number;
}

export interface MortgageAffordabilityInputs {
  annualIncome: number;
  monthlyDebts: number;
  downPayment: number;
  mortgageRate: number;
  loanTermYears: number;
  propertyTaxRate: number;
  insuranceAnnual: number;
}

export interface MortgageAffordabilityResult {
  maxHousingPayment: number;
  maxLoanAmount: number;
  maxHomePrice: number;
  frontEndLimit: number;
  backEndLimit: number;
  estimatedTaxesAndInsurance: number;
}

export interface DebtPayoffInputs {
  balance: number;
  annualRate: number;
  monthlyPayment: number;
  extraPaymentMonthly?: number;
}

export interface DebtPayoffResult {
  payoffPossible: boolean;
  minimumPaymentToReduceBalance: number;
  payoffMonths: number;
  acceleratedMonths: number;
  interestPaid: number;
  acceleratedInterest: number;
  interestSaved: number;
  totalPaid: number;
  acceleratedTotalPaid: number;
  monthsSaved: number;
}

function simulateDebt(balance: number, annualRate: number, monthlyPayment: number) {
  const monthlyRate = annualRate / 100 / 12;
  const minimumPaymentToReduceBalance = balance * monthlyRate + 1;

  if (monthlyPayment <= balance * monthlyRate) {
    return {
      payoffPossible: false,
      minimumPaymentToReduceBalance,
      months: 0,
      interestPaid: 0,
      totalPaid: 0
    };
  }

  let remaining = balance;
  let month = 0;
  let interestPaid = 0;
  let totalPaid = 0;

  while (remaining > 0.01 && month < 1200) {
    month += 1;
    const interest = annualRate === 0 ? 0 : remaining * monthlyRate;
    const payment = Math.min(remaining + interest, monthlyPayment);
    remaining = Math.max(0, remaining + interest - payment);
    interestPaid += interest;
    totalPaid += payment;
  }

  return {
    payoffPossible: true,
    minimumPaymentToReduceBalance,
    months: month,
    interestPaid,
    totalPaid
  };
}

export function calculateSimpleInterest(inputs: SimpleInterestInputs): SimpleInterestResult | undefined {
  const { principal, annualRate, years } = inputs;
  if (principal <= 0 || annualRate < 0 || years <= 0) {
    return undefined;
  }

  const interestEarned = principal * (annualRate / 100) * years;
  const futureValue = principal + interestEarned;

  return {
    interestEarned: round(interestEarned),
    futureValue: round(futureValue),
    annualInterest: round(interestEarned / years),
    monthlyAverageInterest: round(interestEarned / (years * 12))
  };
}

export function calculateBreakEven(inputs: BreakEvenInputs): BreakEvenResult | undefined {
  const { fixedCosts, pricePerUnit, variableCostPerUnit, targetProfit = 0 } = inputs;
  if (fixedCosts < 0 || pricePerUnit <= 0 || variableCostPerUnit < 0 || targetProfit < 0) {
    return undefined;
  }

  const contributionMarginPerUnit = pricePerUnit - variableCostPerUnit;
  if (contributionMarginPerUnit <= 0) {
    return undefined;
  }

  const breakEvenUnits = fixedCosts / contributionMarginPerUnit;
  const unitsForTargetProfit = (fixedCosts + targetProfit) / contributionMarginPerUnit;

  return {
    contributionMarginPerUnit: round(contributionMarginPerUnit),
    contributionMarginRatio: round((contributionMarginPerUnit / pricePerUnit) * 100),
    breakEvenUnits: round(breakEvenUnits, 1),
    breakEvenRevenue: round(breakEvenUnits * pricePerUnit),
    unitsForTargetProfit: round(unitsForTargetProfit, 1),
    revenueForTargetProfit: round(unitsForTargetProfit * pricePerUnit)
  };
}

export function calculateCommission(inputs: CommissionInputs): CommissionResult | undefined {
  const { salesAmount, commissionRate, basePay = 0, bonusThreshold = 0, bonusAmount = 0 } = inputs;
  if (salesAmount < 0 || commissionRate < 0 || basePay < 0 || bonusThreshold < 0 || bonusAmount < 0) {
    return undefined;
  }

  const commission = salesAmount * (commissionRate / 100);
  const bonusEarned = salesAmount >= bonusThreshold && bonusThreshold > 0 ? bonusAmount : 0;
  const totalPay = basePay + commission + bonusEarned;
  const salesToNextBonus = bonusThreshold > 0 && salesAmount < bonusThreshold ? bonusThreshold - salesAmount : 0;

  return {
    commission: round(commission),
    totalPay: round(totalPay),
    effectiveRate: salesAmount > 0 ? round((commission / salesAmount) * 100, 2) : 0,
    bonusEarned: round(bonusEarned),
    salesToNextBonus: round(salesToNextBonus)
  };
}

export function calculateMortgageAffordability(inputs: MortgageAffordabilityInputs): MortgageAffordabilityResult | undefined {
  const { annualIncome, monthlyDebts, downPayment, mortgageRate, loanTermYears, propertyTaxRate, insuranceAnnual } = inputs;
  if (annualIncome <= 0 || monthlyDebts < 0 || downPayment < 0 || mortgageRate < 0 || loanTermYears <= 0 || propertyTaxRate < 0 || insuranceAnnual < 0) {
    return undefined;
  }

  const grossMonthlyIncome = annualIncome / 12;
  const frontEndLimit = grossMonthlyIncome * 0.28;
  const backEndLimit = Math.max(0, grossMonthlyIncome * 0.36 - monthlyDebts);
  const maxHousingPayment = Math.max(0, Math.min(frontEndLimit, backEndLimit));
  if (maxHousingPayment <= 0) {
    return undefined;
  }

  let low = 0;
  let high = Math.max(100000, annualIncome * 8);
  let bestHomePrice = 0;

  for (let i = 0; i < 80; i += 1) {
    const homePrice = (low + high) / 2;
    const loanAmount = Math.max(0, homePrice - downPayment);
    const monthlyPi = amortizedMonthlyPayment(loanAmount, mortgageRate, Math.round(loanTermYears * 12));
    const monthlyTaxes = homePrice * (propertyTaxRate / 100) / 12;
    const monthlyTotal = monthlyPi + monthlyTaxes + insuranceAnnual / 12;

    if (monthlyTotal <= maxHousingPayment) {
      bestHomePrice = homePrice;
      low = homePrice;
    } else {
      high = homePrice;
    }
  }

  const maxLoanAmount = Math.max(0, bestHomePrice - downPayment);
  const estimatedTaxesAndInsurance = bestHomePrice * (propertyTaxRate / 100) / 12 + insuranceAnnual / 12;

  return {
    maxHousingPayment: round(maxHousingPayment),
    maxLoanAmount: round(maxLoanAmount),
    maxHomePrice: round(bestHomePrice),
    frontEndLimit: round(frontEndLimit),
    backEndLimit: round(backEndLimit),
    estimatedTaxesAndInsurance: round(estimatedTaxesAndInsurance)
  };
}

export function calculateDebtPayoff(inputs: DebtPayoffInputs): DebtPayoffResult | undefined {
  const { balance, annualRate, monthlyPayment, extraPaymentMonthly = 0 } = inputs;
  if (balance <= 0 || annualRate < 0 || monthlyPayment <= 0 || extraPaymentMonthly < 0) {
    return undefined;
  }

  const standard = simulateDebt(balance, annualRate, monthlyPayment);
  if (!standard.payoffPossible) {
    return {
      payoffPossible: false,
      minimumPaymentToReduceBalance: round(standard.minimumPaymentToReduceBalance),
      payoffMonths: 0,
      acceleratedMonths: 0,
      interestPaid: 0,
      acceleratedInterest: 0,
      interestSaved: 0,
      totalPaid: 0,
      acceleratedTotalPaid: 0,
      monthsSaved: 0
    };
  }

  const accelerated = simulateDebt(balance, annualRate, monthlyPayment + extraPaymentMonthly);

  return {
    payoffPossible: true,
    minimumPaymentToReduceBalance: round(standard.minimumPaymentToReduceBalance),
    payoffMonths: standard.months,
    acceleratedMonths: accelerated.months,
    interestPaid: round(standard.interestPaid),
    acceleratedInterest: round(accelerated.interestPaid),
    interestSaved: round(standard.interestPaid - accelerated.interestPaid),
    totalPaid: round(standard.totalPaid),
    acceleratedTotalPaid: round(accelerated.totalPaid),
    monthsSaved: Math.max(0, standard.months - accelerated.months)
  };
}
