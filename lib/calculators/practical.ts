export type PracticalPayFrequency = "weekly" | "biweekly" | "semimonthly" | "monthly";

import { round } from "@/lib/utils";

import {
  estimateSalary,
  type FilingStatus,
  type TaxCountry,
  type UsState
} from "./salary";

export const practicalPayFrequencyOptions: Array<{ value: PracticalPayFrequency; label: string; periods: number }> = [
  { value: "weekly", label: "Weekly", periods: 52 },
  { value: "biweekly", label: "Biweekly", periods: 26 },
  { value: "semimonthly", label: "Semi-monthly", periods: 24 },
  { value: "monthly", label: "Monthly", periods: 12 }
];

function getPeriodsPerYear(payFrequency: PracticalPayFrequency) {
  return practicalPayFrequencyOptions.find((option) => option.value === payFrequency)?.periods ?? 26;
}

export interface TakeHomePaycheckInputs {
  annualSalary: number;
  payFrequency: PracticalPayFrequency;
  country: TaxCountry;
  state: UsState;
  filingStatus: FilingStatus;
  retirementPercent: number;
  preTaxDeductionsAnnual: number;
  postTaxDeductionsAnnual: number;
  bonusAnnual: number;
}

export interface TakeHomePaycheckResult {
  grossAnnual: number;
  grossPerPaycheck: number;
  netAnnual: number;
  netPerPaycheck: number;
  totalTax: number;
  totalDeductions: number;
  effectiveTaxRate: number;
}

export interface HourlyPaycheckInputs {
  hourlyRate: number;
  regularHoursPerWeek: number;
  overtimeHoursPerWeek: number;
  overtimeMultiplier: number;
  payFrequency: PracticalPayFrequency;
  country: TaxCountry;
  state: UsState;
  filingStatus: FilingStatus;
  retirementPercent: number;
  preTaxDeductionsAnnual: number;
  postTaxDeductionsAnnual: number;
  bonusAnnual: number;
}

export interface HourlyPaycheckResult extends TakeHomePaycheckResult {
  regularWeeklyPay: number;
  overtimeWeeklyPay: number;
  weeklyGrossPay: number;
  overtimeShare: number;
}

export interface OvertimeInputs {
  hourlyRate: number;
  regularHours: number;
  overtimeHours: number;
  overtimeMultiplier: number;
}

export interface OvertimeResult {
  regularPay: number;
  overtimeRate: number;
  overtimePay: number;
  totalPay: number;
  blendedHourlyRate: number;
  extraEarned: number;
}

export interface SalesTaxInputs {
  amount: number;
  taxRate: number;
  mode: "add" | "extract";
}

export interface SalesTaxResult {
  subtotal: number;
  taxAmount: number;
  total: number;
  effectiveTaxRate: number;
}

export interface BudgetInputs {
  monthlyIncome: number;
  housing: number;
  utilities: number;
  groceries: number;
  transportation: number;
  debt: number;
  savings: number;
  insurance: number;
  entertainment: number;
  other: number;
}

export interface BudgetResult {
  totalExpenses: number;
  leftover: number;
  housingRatio: number;
  savingsRate: number;
  essentialSpending: number;
  flexibleSpending: number;
  essentialRatio: number;
}

export function calculateTakeHomePaycheck(inputs: TakeHomePaycheckInputs): TakeHomePaycheckResult | undefined {
  const {
    annualSalary,
    payFrequency,
    country,
    state,
    filingStatus,
    retirementPercent,
    preTaxDeductionsAnnual,
    postTaxDeductionsAnnual,
    bonusAnnual
  } = inputs;

  if (
    annualSalary <= 0 ||
    retirementPercent < 0 ||
    retirementPercent > 100 ||
    preTaxDeductionsAnnual < 0 ||
    postTaxDeductionsAnnual < 0 ||
    bonusAnnual < 0
  ) {
    return undefined;
  }

  const salaryEstimate = estimateSalary({
    mode: "salary-to-hourly",
    annualSalary,
    hourlyRate: 0,
    hoursPerWeek: 40,
    weeksPerYear: 52,
    country,
    state,
    filingStatus,
    retirementPercent,
    preTaxDeductionsAnnual,
    postTaxDeductionsAnnual,
    bonusAnnual
  });

  if (!salaryEstimate) {
    return undefined;
  }

  const periods = getPeriodsPerYear(payFrequency);

  return {
    grossAnnual: round(salaryEstimate.gross.annual),
    grossPerPaycheck: round(salaryEstimate.gross.annual / periods),
    netAnnual: round(salaryEstimate.net.annual),
    netPerPaycheck: round(salaryEstimate.net.annual / periods),
    totalTax: round(
      salaryEstimate.deductions.federal + salaryEstimate.deductions.state + salaryEstimate.deductions.payroll
    ),
    totalDeductions: round(salaryEstimate.deductions.total),
    effectiveTaxRate: round(salaryEstimate.effectiveTaxRate * 100, 2)
  };
}

export function calculateHourlyPaycheck(inputs: HourlyPaycheckInputs): HourlyPaycheckResult | undefined {
  const {
    hourlyRate,
    regularHoursPerWeek,
    overtimeHoursPerWeek,
    overtimeMultiplier,
    payFrequency,
    country,
    state,
    filingStatus,
    retirementPercent,
    preTaxDeductionsAnnual,
    postTaxDeductionsAnnual,
    bonusAnnual
  } = inputs;

  if (
    hourlyRate <= 0 ||
    regularHoursPerWeek < 0 ||
    overtimeHoursPerWeek < 0 ||
    overtimeMultiplier < 1 ||
    regularHoursPerWeek + overtimeHoursPerWeek <= 0
  ) {
    return undefined;
  }

  const regularWeeklyPay = hourlyRate * regularHoursPerWeek;
  const overtimeRate = hourlyRate * overtimeMultiplier;
  const overtimeWeeklyPay = overtimeRate * overtimeHoursPerWeek;
  const weeklyGrossPay = regularWeeklyPay + overtimeWeeklyPay;
  const annualSalary = weeklyGrossPay * 52;

  const paycheck = calculateTakeHomePaycheck({
    annualSalary,
    payFrequency,
    country,
    state,
    filingStatus,
    retirementPercent,
    preTaxDeductionsAnnual,
    postTaxDeductionsAnnual,
    bonusAnnual
  });

  if (!paycheck) {
    return undefined;
  }

  return {
    ...paycheck,
    regularWeeklyPay: round(regularWeeklyPay),
    overtimeWeeklyPay: round(overtimeWeeklyPay),
    weeklyGrossPay: round(weeklyGrossPay),
    overtimeShare: weeklyGrossPay === 0 ? 0 : round((overtimeWeeklyPay / weeklyGrossPay) * 100, 2)
  };
}

export function calculateOvertime(inputs: OvertimeInputs): OvertimeResult | undefined {
  const { hourlyRate, regularHours, overtimeHours, overtimeMultiplier } = inputs;

  if (hourlyRate <= 0 || regularHours < 0 || overtimeHours < 0 || overtimeMultiplier < 1) {
    return undefined;
  }

  const regularPay = hourlyRate * regularHours;
  const overtimeRate = hourlyRate * overtimeMultiplier;
  const overtimePay = overtimeRate * overtimeHours;
  const totalHours = regularHours + overtimeHours;
  const totalPay = regularPay + overtimePay;

  return {
    regularPay: round(regularPay),
    overtimeRate: round(overtimeRate),
    overtimePay: round(overtimePay),
    totalPay: round(totalPay),
    blendedHourlyRate: totalHours === 0 ? 0 : round(totalPay / totalHours, 2),
    extraEarned: round(overtimePay - hourlyRate * overtimeHours)
  };
}

export function calculateSalesTax(inputs: SalesTaxInputs): SalesTaxResult | undefined {
  const { amount, taxRate, mode } = inputs;

  if (amount < 0 || taxRate < 0) {
    return undefined;
  }

  if (mode === "add") {
    const taxAmount = amount * (taxRate / 100);
    return {
      subtotal: round(amount),
      taxAmount: round(taxAmount),
      total: round(amount + taxAmount),
      effectiveTaxRate: round(taxRate, 2)
    };
  }

  const subtotal = amount / (1 + taxRate / 100);
  const taxAmount = amount - subtotal;
  return {
    subtotal: round(subtotal),
    taxAmount: round(taxAmount),
    total: round(amount),
    effectiveTaxRate: round(taxRate, 2)
  };
}

export function calculateBudget(inputs: BudgetInputs): BudgetResult | undefined {
  const values = Object.values(inputs);
  if (values.some((value) => value < 0) || inputs.monthlyIncome <= 0) {
    return undefined;
  }

  const essentialSpending =
    inputs.housing +
    inputs.utilities +
    inputs.groceries +
    inputs.transportation +
    inputs.debt +
    inputs.insurance;
  const flexibleSpending = inputs.savings + inputs.entertainment + inputs.other;
  const totalExpenses = essentialSpending + flexibleSpending;
  const leftover = inputs.monthlyIncome - totalExpenses;

  return {
    totalExpenses: round(totalExpenses),
    leftover: round(leftover),
    housingRatio: round((inputs.housing / inputs.monthlyIncome) * 100, 2),
    savingsRate: round((inputs.savings / inputs.monthlyIncome) * 100, 2),
    essentialSpending: round(essentialSpending),
    flexibleSpending: round(flexibleSpending),
    essentialRatio: round((essentialSpending / inputs.monthlyIncome) * 100, 2)
  };
}
