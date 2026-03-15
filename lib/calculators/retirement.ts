import { amortizedMonthlyPayment, solveAnnualRateFromPayment } from "./borrowing";

export interface RetirementProjectionPoint {
  age: number;
  balance: number;
  contributions: number;
}

export interface RetirementCalculatorInputs {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  monthlyContribution: number;
  annualReturn: number;
  withdrawalRate: number;
}

export interface RetirementCalculatorResult {
  futureBalance: number;
  totalContributions: number;
  investmentGrowth: number;
  estimatedAnnualIncome: number;
  estimatedMonthlyIncome: number;
  yearsUntilRetirement: number;
  points: RetirementProjectionPoint[];
}

export interface FourOhOneKInputs {
  currentAge: number;
  retirementAge: number;
  currentBalance: number;
  annualSalary: number;
  employeeContributionPercent: number;
  employerMatchPercent: number;
  employerMatchCapPercent: number;
  annualRaise: number;
  annualReturn: number;
}

export interface FourOhOneKResult {
  futureBalance: number;
  totalEmployeeContributions: number;
  totalEmployerContributions: number;
  totalContributions: number;
  investmentGrowth: number;
  firstYearEmployeeContribution: number;
  firstYearEmployerMatch: number;
  estimatedAnnualIncome: number;
  estimatedMonthlyIncome: number;
  points: RetirementProjectionPoint[];
}

export interface RefinanceInputs {
  currentBalance: number;
  currentRate: number;
  currentYearsLeft: number;
  newRate: number;
  newTermYears: number;
  closingCosts: number;
}

export interface RefinancePoint {
  year: number;
  currentBalance: number;
  refinanceBalance: number;
}

export interface RefinanceResult {
  currentMonthlyPayment: number;
  newMonthlyPayment: number;
  monthlySavings: number;
  currentRemainingInterest: number;
  refinanceInterest: number;
  lifetimeSavings: number;
  breakEvenMonths?: number;
  totalRefinanceCost: number;
  points: RefinancePoint[];
}

export interface AprInputs {
  loanAmount: number;
  fees: number;
  monthlyPayment: number;
  years: number;
}

export interface AprResult {
  apr: number;
  amountFinanced: number;
  totalPaid: number;
  financeCharge: number;
  monthlyPayment: number;
}

export interface StudentLoanInputs {
  amount: number;
  annualRate: number;
  years: number;
  extraPaymentMonthly?: number;
}

export interface StudentLoanPoint {
  year: number;
  standardBalance: number;
  acceleratedBalance: number;
}

export interface StudentLoanResult {
  monthlyPayment: number;
  totalInterest: number;
  totalPaid: number;
  payoffMonths: number;
  acceleratedMonthlyPayment: number;
  acceleratedInterest: number;
  acceleratedTotalPaid: number;
  acceleratedPayoffMonths: number;
  interestSaved: number;
  monthsSaved: number;
  standardPoints: StudentLoanPoint[];
  acceleratedPoints: StudentLoanPoint[];
}

function round(value: number, decimals = 2) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function buildRetirementProjection(
  startAge: number,
  endAge: number,
  currentBalance: number,
  monthlyContribution: number,
  annualReturn: number
) {
  const years = Math.max(0, endAge - startAge);
  const monthlyRate = annualReturn / 100 / 12;
  let balance = currentBalance;
  let contributions = currentBalance;
  const points: RetirementProjectionPoint[] = [{ age: startAge, balance: round(balance), contributions: round(contributions) }];

  for (let year = 1; year <= years; year += 1) {
    for (let month = 0; month < 12; month += 1) {
      balance = balance * (1 + monthlyRate) + monthlyContribution;
      contributions += monthlyContribution;
    }

    points.push({
      age: startAge + year,
      balance: round(balance),
      contributions: round(contributions)
    });
  }

  return {
    futureBalance: round(balance),
    totalContributions: round(contributions),
    investmentGrowth: round(balance - contributions),
    yearsUntilRetirement: years,
    points
  };
}

export function calculateRetirement(inputs: RetirementCalculatorInputs): RetirementCalculatorResult | undefined {
  const { currentAge, retirementAge, currentSavings, monthlyContribution, annualReturn, withdrawalRate } = inputs;

  if (
    currentAge <= 0 ||
    retirementAge <= currentAge ||
    currentSavings < 0 ||
    monthlyContribution < 0 ||
    annualReturn < 0 ||
    withdrawalRate <= 0
  ) {
    return undefined;
  }

  const projection = buildRetirementProjection(currentAge, retirementAge, currentSavings, monthlyContribution, annualReturn);
  const estimatedAnnualIncome = projection.futureBalance * (withdrawalRate / 100);

  return {
    ...projection,
    estimatedAnnualIncome: round(estimatedAnnualIncome),
    estimatedMonthlyIncome: round(estimatedAnnualIncome / 12)
  };
}

export function calculate401k(inputs: FourOhOneKInputs): FourOhOneKResult | undefined {
  const {
    currentAge,
    retirementAge,
    currentBalance,
    annualSalary,
    employeeContributionPercent,
    employerMatchPercent,
    employerMatchCapPercent,
    annualRaise,
    annualReturn
  } = inputs;

  if (
    currentAge <= 0 ||
    retirementAge <= currentAge ||
    currentBalance < 0 ||
    annualSalary <= 0 ||
    employeeContributionPercent < 0 ||
    employerMatchPercent < 0 ||
    employerMatchCapPercent < 0 ||
    annualRaise < 0 ||
    annualReturn < 0
  ) {
    return undefined;
  }

  let salary = annualSalary;
  let balance = currentBalance;
  let totalEmployeeContributions = 0;
  let totalEmployerContributions = 0;
  const years = retirementAge - currentAge;
  const points: RetirementProjectionPoint[] = [{ age: currentAge, balance: round(balance), contributions: round(currentBalance) }];
  const monthlyRate = annualReturn / 100 / 12;

  let firstYearEmployeeContribution = 0;
  let firstYearEmployerMatch = 0;

  for (let year = 1; year <= years; year += 1) {
    const annualEmployeeContribution = salary * (employeeContributionPercent / 100);
    const matchedPercent = Math.min(employeeContributionPercent, employerMatchCapPercent);
    const annualEmployerContribution = salary * (matchedPercent / 100) * (employerMatchPercent / 100);

    if (year === 1) {
      firstYearEmployeeContribution = annualEmployeeContribution;
      firstYearEmployerMatch = annualEmployerContribution;
    }

    totalEmployeeContributions += annualEmployeeContribution;
    totalEmployerContributions += annualEmployerContribution;

    const monthlyContribution = (annualEmployeeContribution + annualEmployerContribution) / 12;

    for (let month = 0; month < 12; month += 1) {
      balance = balance * (1 + monthlyRate) + monthlyContribution;
    }

    points.push({
      age: currentAge + year,
      balance: round(balance),
      contributions: round(currentBalance + totalEmployeeContributions + totalEmployerContributions)
    });

    salary *= 1 + annualRaise / 100;
  }

  const totalContributions = currentBalance + totalEmployeeContributions + totalEmployerContributions;
  const estimatedAnnualIncome = balance * 0.04;

  return {
    futureBalance: round(balance),
    totalEmployeeContributions: round(totalEmployeeContributions),
    totalEmployerContributions: round(totalEmployerContributions),
    totalContributions: round(totalContributions),
    investmentGrowth: round(balance - totalContributions),
    firstYearEmployeeContribution: round(firstYearEmployeeContribution),
    firstYearEmployerMatch: round(firstYearEmployerMatch),
    estimatedAnnualIncome: round(estimatedAnnualIncome),
    estimatedMonthlyIncome: round(estimatedAnnualIncome / 12),
    points
  };
}

function simulateFixedLoan(principal: number, annualRate: number, scheduledPayment: number) {
  const monthlyRate = annualRate / 100 / 12;
  let balance = principal;
  let month = 0;
  let totalInterest = 0;
  const balances = [principal];

  while (balance > 0.01 && month < 1200) {
    month += 1;
    const interest = monthlyRate === 0 ? 0 : balance * monthlyRate;
    const payment = Math.min(balance + interest, scheduledPayment);
    balance = Math.max(0, balance + interest - payment);
    totalInterest += interest;
    balances.push(round(balance));
  }

  return {
    months: month,
    totalInterest: round(totalInterest),
    totalPaid: round(principal + totalInterest),
    balances
  };
}

function buildLoanComparisonPoints(currentBalances: number[], refinanceBalances: number[]) {
  const maxLength = Math.max(currentBalances.length, refinanceBalances.length);
  const points: RefinancePoint[] = [];

  for (let month = 0; month < maxLength; month += 12) {
    points.push({
      year: month / 12,
      currentBalance: currentBalances[Math.min(month, currentBalances.length - 1)] ?? 0,
      refinanceBalance: refinanceBalances[Math.min(month, refinanceBalances.length - 1)] ?? 0
    });
  }

  const lastMonth = maxLength - 1;
  if (lastMonth > 0 && lastMonth % 12 !== 0) {
    points.push({
      year: round(lastMonth / 12, 1),
      currentBalance: currentBalances[currentBalances.length - 1] ?? 0,
      refinanceBalance: refinanceBalances[refinanceBalances.length - 1] ?? 0
    });
  }

  return points;
}

export function calculateRefinance(inputs: RefinanceInputs): RefinanceResult | undefined {
  const { currentBalance, currentRate, currentYearsLeft, newRate, newTermYears, closingCosts } = inputs;

  if (
    currentBalance <= 0 ||
    currentRate < 0 ||
    currentYearsLeft <= 0 ||
    newRate < 0 ||
    newTermYears <= 0 ||
    closingCosts < 0
  ) {
    return undefined;
  }

  const currentMonths = Math.round(currentYearsLeft * 12);
  const newMonths = Math.round(newTermYears * 12);
  const currentMonthlyPayment = amortizedMonthlyPayment(currentBalance, currentRate, currentMonths);
  const newMonthlyPayment = amortizedMonthlyPayment(currentBalance, newRate, newMonths);
  const currentSchedule = simulateFixedLoan(currentBalance, currentRate, currentMonthlyPayment);
  const refinanceSchedule = simulateFixedLoan(currentBalance, newRate, newMonthlyPayment);
  const monthlySavings = round(currentMonthlyPayment - newMonthlyPayment);
  const totalRefinanceCost = round(refinanceSchedule.totalInterest + closingCosts);
  const lifetimeSavings = round(currentSchedule.totalInterest - totalRefinanceCost);
  const breakEvenMonths = monthlySavings > 0 ? Math.ceil(closingCosts / monthlySavings) : undefined;

  return {
    currentMonthlyPayment: round(currentMonthlyPayment),
    newMonthlyPayment: round(newMonthlyPayment),
    monthlySavings,
    currentRemainingInterest: currentSchedule.totalInterest,
    refinanceInterest: refinanceSchedule.totalInterest,
    lifetimeSavings,
    breakEvenMonths,
    totalRefinanceCost,
    points: buildLoanComparisonPoints(currentSchedule.balances, refinanceSchedule.balances)
  };
}

export function calculateApr(inputs: AprInputs): AprResult | undefined {
  const { loanAmount, fees, monthlyPayment, years } = inputs;

  if (loanAmount <= 0 || fees < 0 || monthlyPayment <= 0 || years <= 0 || fees >= loanAmount) {
    return undefined;
  }

  const amountFinanced = loanAmount - fees;
  const apr = solveAnnualRateFromPayment(amountFinanced, monthlyPayment, Math.round(years * 12));

  if (apr === undefined) {
    return undefined;
  }

  const totalPaid = monthlyPayment * Math.round(years * 12);
  const financeCharge = totalPaid - amountFinanced;

  return {
    apr: round(apr, 3),
    amountFinanced: round(amountFinanced),
    totalPaid: round(totalPaid),
    financeCharge: round(financeCharge),
    monthlyPayment: round(monthlyPayment)
  };
}

function buildStudentLoanPoints(standardBalances: number[], acceleratedBalances: number[]) {
  const points: StudentLoanPoint[] = [];
  const maxLength = Math.max(standardBalances.length, acceleratedBalances.length);

  for (let month = 0; month < maxLength; month += 12) {
    points.push({
      year: month / 12,
      standardBalance: standardBalances[Math.min(month, standardBalances.length - 1)] ?? 0,
      acceleratedBalance: acceleratedBalances[Math.min(month, acceleratedBalances.length - 1)] ?? 0
    });
  }

  const lastMonth = maxLength - 1;
  if (lastMonth > 0 && lastMonth % 12 !== 0) {
    points.push({
      year: round(lastMonth / 12, 1),
      standardBalance: standardBalances[standardBalances.length - 1] ?? 0,
      acceleratedBalance: acceleratedBalances[acceleratedBalances.length - 1] ?? 0
    });
  }

  return points;
}

export function calculateStudentLoan(inputs: StudentLoanInputs): StudentLoanResult | undefined {
  const { amount, annualRate, years, extraPaymentMonthly = 0 } = inputs;

  if (amount <= 0 || annualRate < 0 || years <= 0 || extraPaymentMonthly < 0) {
    return undefined;
  }

  const months = Math.round(years * 12);
  const monthlyPayment = amortizedMonthlyPayment(amount, annualRate, months);
  const standard = simulateFixedLoan(amount, annualRate, monthlyPayment);
  const accelerated = simulateFixedLoan(amount, annualRate, monthlyPayment + extraPaymentMonthly);

  return {
    monthlyPayment: round(monthlyPayment),
    totalInterest: standard.totalInterest,
    totalPaid: standard.totalPaid,
    payoffMonths: standard.months,
    acceleratedMonthlyPayment: round(monthlyPayment + extraPaymentMonthly),
    acceleratedInterest: accelerated.totalInterest,
    acceleratedTotalPaid: accelerated.totalPaid,
    acceleratedPayoffMonths: accelerated.months,
    interestSaved: round(standard.totalInterest - accelerated.totalInterest),
    monthsSaved: Math.max(0, standard.months - accelerated.months),
    standardPoints: buildStudentLoanPoints(standard.balances, accelerated.balances),
    acceleratedPoints: buildStudentLoanPoints(standard.balances, accelerated.balances)
  };
}
