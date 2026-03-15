import { solveAnnualRateFromPayment } from "@/lib/calculators/borrowing";

export interface MortgageInputs {
  loanAmount: number;
  annualRate: number;
  years: number;
  propertyTaxAnnual?: number;
  insuranceAnnual?: number;
  hoaMonthly?: number;
  pmiMonthly?: number;
  extraMonthlyPayment?: number;
}

export interface MortgagePoint {
  year: number;
  remainingBalance: number;
  cumulativeInterest: number;
}

export interface MortgageScheduleRow {
  paymentNumber: number;
  year: number;
  month: number;
  payment: number;
  principal: number;
  interest: number;
  extraPayment: number;
  endingBalance: number;
}

export interface MortgageYearRow {
  year: number;
  payment: number;
  principal: number;
  interest: number;
  extraPayment: number;
  endingBalance: number;
}

export interface MortgageResult {
  monthlyPrincipalInterest: number;
  totalMonthlyPayment: number;
  totalInterest: number;
  totalPaid: number;
  payoffMonths: number;
  interestSavedWithExtra: number;
  points: MortgagePoint[];
  monthlySchedule: MortgageScheduleRow[];
  yearlySchedule: MortgageYearRow[];
}

function round(value: number, decimals = 2) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function baseMonthlyPayment(principal: number, annualRate: number, numberOfPayments: number) {
  const monthlyRate = annualRate / 100 / 12;
  return monthlyRate === 0
    ? principal / numberOfPayments
    : (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
}

function buildSchedule(loanAmount: number, annualRate: number, years: number, extraMonthlyPayment = 0) {
  const monthlyRate = annualRate / 100 / 12;
  const numberOfPayments = Math.round(years * 12);
  const monthlyPrincipalInterest = baseMonthlyPayment(loanAmount, annualRate, numberOfPayments);

  let remainingBalance = loanAmount;
  let cumulativeInterest = 0;
  let paymentNumber = 0;
  const points: MortgagePoint[] = [{ year: 0, remainingBalance: loanAmount, cumulativeInterest: 0 }];
  const monthlySchedule: MortgageScheduleRow[] = [];
  const yearlyMap = new Map<number, MortgageYearRow>();

  while (remainingBalance > 0.01 && paymentNumber < numberOfPayments + 600) {
    paymentNumber += 1;
    const interestPaid = monthlyRate === 0 ? 0 : remainingBalance * monthlyRate;
    const scheduledPrincipal = Math.max(0, monthlyPrincipalInterest - interestPaid);
    const actualPrincipal = Math.min(remainingBalance, scheduledPrincipal + extraMonthlyPayment);
    const appliedExtra = Math.max(0, actualPrincipal - scheduledPrincipal);
    const payment = interestPaid + actualPrincipal;
    remainingBalance = Math.max(0, remainingBalance - actualPrincipal);
    cumulativeInterest += interestPaid;

    const row: MortgageScheduleRow = {
      paymentNumber,
      year: Math.ceil(paymentNumber / 12),
      month: ((paymentNumber - 1) % 12) + 1,
      payment: round(payment),
      principal: round(actualPrincipal),
      interest: round(interestPaid),
      extraPayment: round(appliedExtra),
      endingBalance: round(remainingBalance)
    };
    monthlySchedule.push(row);

    const yearly = yearlyMap.get(row.year) || {
      year: row.year,
      payment: 0,
      principal: 0,
      interest: 0,
      extraPayment: 0,
      endingBalance: row.endingBalance
    };
    yearly.payment += row.payment;
    yearly.principal += row.principal;
    yearly.interest += row.interest;
    yearly.extraPayment += row.extraPayment;
    yearly.endingBalance = row.endingBalance;
    yearlyMap.set(row.year, yearly);

    if (paymentNumber % 12 === 0 || remainingBalance <= 0.01) {
      points.push({
        year: round(paymentNumber / 12, 1),
        remainingBalance: round(remainingBalance),
        cumulativeInterest: round(cumulativeInterest)
      });
    }
  }

  const yearlySchedule = Array.from(yearlyMap.values()).map((row) => ({
    ...row,
    payment: round(row.payment),
    principal: round(row.principal),
    interest: round(row.interest),
    extraPayment: round(row.extraPayment),
    endingBalance: round(row.endingBalance)
  }));

  return {
    monthlyPrincipalInterest: round(monthlyPrincipalInterest),
    totalInterest: round(cumulativeInterest),
    payoffMonths: paymentNumber,
    points,
    monthlySchedule,
    yearlySchedule
  };
}

export function solveMortgageAnnualRate(loanAmount: number, monthlyPrincipalInterest: number, years: number) {
  return solveAnnualRateFromPayment(loanAmount, monthlyPrincipalInterest, Math.round(years * 12));
}

export function calculateMortgage(inputs: MortgageInputs): MortgageResult | undefined {
  const {
    loanAmount,
    annualRate,
    years,
    propertyTaxAnnual = 0,
    insuranceAnnual = 0,
    hoaMonthly = 0,
    pmiMonthly = 0,
    extraMonthlyPayment = 0
  } = inputs;

  if (
    loanAmount <= 0 ||
    annualRate < 0 ||
    years <= 0 ||
    propertyTaxAnnual < 0 ||
    insuranceAnnual < 0 ||
    hoaMonthly < 0 ||
    pmiMonthly < 0 ||
    extraMonthlyPayment < 0
  ) {
    return undefined;
  }

  const scheduled = buildSchedule(loanAmount, annualRate, years, extraMonthlyPayment);
  const baseline = extraMonthlyPayment > 0 ? buildSchedule(loanAmount, annualRate, years, 0) : scheduled;
  const totalMonthlyPayment =
    scheduled.monthlyPrincipalInterest + propertyTaxAnnual / 12 + insuranceAnnual / 12 + hoaMonthly + pmiMonthly + extraMonthlyPayment;
  const totalPaid =
    scheduled.monthlySchedule.reduce((sum, row) => sum + row.payment, 0) +
    propertyTaxAnnual * (scheduled.payoffMonths / 12) +
    insuranceAnnual * (scheduled.payoffMonths / 12) +
    (hoaMonthly + pmiMonthly) * scheduled.payoffMonths;

  return {
    monthlyPrincipalInterest: scheduled.monthlyPrincipalInterest,
    totalMonthlyPayment: round(totalMonthlyPayment),
    totalInterest: scheduled.totalInterest,
    totalPaid: round(totalPaid),
    payoffMonths: scheduled.payoffMonths,
    interestSavedWithExtra: round(Math.max(0, baseline.totalInterest - scheduled.totalInterest)),
    points: scheduled.points,
    monthlySchedule: scheduled.monthlySchedule,
    yearlySchedule: scheduled.yearlySchedule
  };
}
