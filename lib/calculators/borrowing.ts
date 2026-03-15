export interface LoanInputs {
  amount: number;
  annualRate: number;
  years: number;
  extraPaymentMonthly?: number;
}

export interface LoanPoint {
  year: number;
  remainingBalance: number;
}

export interface LoanResult {
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
  standardPoints: LoanPoint[];
  acceleratedPoints: LoanPoint[];
}

export interface AutoLoanInputs {
  vehiclePrice: number;
  downPayment: number;
  tradeInValue: number;
  salesTaxRate: number;
  fees: number;
  annualRate: number;
  years: number;
}

export interface AutoLoanTermOption {
  months: number;
  payment: number;
  totalInterest: number;
}

export interface AutoLoanResult {
  amountFinanced: number;
  cashDueAtSigning: number;
  monthlyPayment: number;
  totalInterest: number;
  totalLoanCost: number;
  loanToValue: number;
  termComparisons: AutoLoanTermOption[];
  points: LoanPoint[];
}

export interface CreditCardPayoffInputs {
  balance: number;
  annualRate: number;
  monthlyPayment: number;
  extraPaymentMonthly?: number;
}

export interface CreditCardPoint {
  month: number;
  standardBalance: number;
  acceleratedBalance: number;
}

export interface CreditCardPayoffResult {
  payoffPossible: boolean;
  minimumPaymentToReduceBalance: number;
  standardMonths: number;
  acceleratedMonths: number;
  standardInterest: number;
  acceleratedInterest: number;
  interestSaved: number;
  monthsSaved: number;
  totalPaidStandard: number;
  totalPaidAccelerated: number;
  points: CreditCardPoint[];
}

export interface DebtToIncomeInputs {
  grossMonthlyIncome: number;
  housingPayment: number;
  carLoans: number;
  studentLoans: number;
  creditCards: number;
  personalLoans: number;
  otherDebts: number;
}

export interface DebtToIncomeResult {
  grossMonthlyIncome: number;
  totalMonthlyDebt: number;
  frontEndRatio: number;
  backEndRatio: number;
  nonHousingDebt: number;
  recommendedHousingBy28Rule: number;
  recommendedHousingBy36Rule: number;
  riskBand: "healthy" | "watch" | "high";
  guidance: string;
}

export interface RentVsBuyInputs {
  homePrice: number;
  downPayment: number;
  mortgageRate: number;
  loanTermYears: number;
  monthlyRent: number;
  yearsInHome: number;
  annualHomeAppreciation: number;
  annualRentIncrease: number;
  propertyTaxRate: number;
  maintenanceRate: number;
  closingCostsRate: number;
  sellingCostsRate: number;
}

export interface RentVsBuyPoint {
  year: number;
  rentCost: number;
  buyNetCost: number;
}

export interface RentVsBuyResult {
  monthlyOwnershipCost: number;
  totalRentCost: number;
  totalBuyCashOutflow: number;
  estimatedHomeValue: number;
  estimatedEquityAfterSale: number;
  buyNetCost: number;
  difference: number;
  betterOption: "rent" | "buy" | "tie";
  breakEvenYear?: number;
  points: RentVsBuyPoint[];
}

export function amortizedMonthlyPayment(principal: number, annualRate: number, months: number) {
  const monthlyRate = annualRate / 100 / 12;

  if (months <= 0) {
    return 0;
  }

  if (monthlyRate === 0) {
    return principal / months;
  }

  return (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
}

export function solveAnnualRateFromPayment(principal: number, monthlyPayment: number, months: number) {
  if (principal <= 0 || monthlyPayment <= 0 || months <= 0) {
    return undefined;
  }

  const zeroRatePayment = principal / months;

  if (monthlyPayment < zeroRatePayment - 0.01) {
    return undefined;
  }

  if (Math.abs(monthlyPayment - zeroRatePayment) <= 0.01) {
    return 0;
  }

  let low = 0;
  let high = 12;

  while (amortizedMonthlyPayment(principal, high, months) < monthlyPayment && high < 1024) {
    high *= 2;
  }

  if (amortizedMonthlyPayment(principal, high, months) < monthlyPayment) {
    return undefined;
  }

  for (let iteration = 0; iteration < 80; iteration += 1) {
    const mid = (low + high) / 2;
    const paymentAtMid = amortizedMonthlyPayment(principal, mid, months);

    if (paymentAtMid < monthlyPayment) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return high;
}

function buildAnnualPoints(history: number[]) {
  const points: LoanPoint[] = [{ year: 0, remainingBalance: history[0] ?? 0 }];

  for (let month = 12; month < history.length; month += 12) {
    points.push({
      year: month / 12,
      remainingBalance: history[month]
    });
  }

  if (history.length > 1) {
    points.push({
      year: (history.length - 1) / 12,
      remainingBalance: history[history.length - 1]
    });
  }

  return dedupePoints(points);
}

function dedupePoints(points: LoanPoint[]) {
  return points.filter((point, index) => index === 0 || point.year !== points[index - 1].year);
}

function simulateAmortizedLoan(principal: number, annualRate: number, scheduledPayment: number, extraPayment: number) {
  const monthlyRate = annualRate / 100 / 12;
  let balance = principal;
  let month = 0;
  let interestPaid = 0;
  let totalPaid = 0;
  const balances = [principal];

  while (balance > 0.01 && month < 1200) {
    month += 1;
    const interest = monthlyRate === 0 ? 0 : balance * monthlyRate;
    const payment = Math.min(balance + interest, scheduledPayment + extraPayment);
    const principalPaid = payment - interest;

    balance = Math.max(0, balance - principalPaid);
    interestPaid += interest;
    totalPaid += payment;
    balances.push(balance);
  }

  return {
    months: month,
    interestPaid,
    totalPaid,
    balances
  };
}

export function calculateLoan(inputs: LoanInputs): LoanResult | undefined {
  const { amount, annualRate, years, extraPaymentMonthly = 0 } = inputs;

  if (amount <= 0 || annualRate < 0 || years <= 0 || extraPaymentMonthly < 0) {
    return undefined;
  }

  const months = Math.round(years * 12);
  const monthlyPayment = amortizedMonthlyPayment(amount, annualRate, months);
  const standard = simulateAmortizedLoan(amount, annualRate, monthlyPayment, 0);
  const accelerated = simulateAmortizedLoan(amount, annualRate, monthlyPayment, extraPaymentMonthly);

  return {
    monthlyPayment,
    totalInterest: standard.interestPaid,
    totalPaid: standard.totalPaid,
    payoffMonths: standard.months,
    acceleratedMonthlyPayment: monthlyPayment + extraPaymentMonthly,
    acceleratedInterest: accelerated.interestPaid,
    acceleratedTotalPaid: accelerated.totalPaid,
    acceleratedPayoffMonths: accelerated.months,
    interestSaved: standard.interestPaid - accelerated.interestPaid,
    monthsSaved: standard.months - accelerated.months,
    standardPoints: buildAnnualPoints(standard.balances),
    acceleratedPoints: buildAnnualPoints(accelerated.balances)
  };
}

export function calculateAutoLoan(inputs: AutoLoanInputs): AutoLoanResult | undefined {
  const { vehiclePrice, downPayment, tradeInValue, salesTaxRate, fees, annualRate, years } = inputs;

  if (
    vehiclePrice <= 0 ||
    downPayment < 0 ||
    tradeInValue < 0 ||
    salesTaxRate < 0 ||
    fees < 0 ||
    annualRate < 0 ||
    years <= 0
  ) {
    return undefined;
  }

  const taxablePrice = Math.max(0, vehiclePrice - tradeInValue);
  const amountFinanced = Math.max(0, taxablePrice + taxablePrice * (salesTaxRate / 100) + fees - downPayment);
  const cashDueAtSigning = downPayment + fees;
  const baseLoan = calculateLoan({ amount: amountFinanced, annualRate, years });

  if (!baseLoan) {
    return undefined;
  }

  const termComparisons = [48, 60, 72].map((termMonths) => {
    const payment = amortizedMonthlyPayment(amountFinanced, annualRate, termMonths);
    const totalInterest = payment * termMonths - amountFinanced;

    return {
      months: termMonths,
      payment,
      totalInterest
    };
  });

  return {
    amountFinanced,
    cashDueAtSigning,
    monthlyPayment: baseLoan.monthlyPayment,
    totalInterest: baseLoan.totalInterest,
    totalLoanCost: amountFinanced + baseLoan.totalInterest + cashDueAtSigning,
    loanToValue: vehiclePrice === 0 ? 0 : amountFinanced / vehiclePrice,
    termComparisons,
    points: baseLoan.standardPoints
  };
}

function simulateCreditCard(balance: number, annualRate: number, monthlyPayment: number, extraPayment: number) {
  const monthlyRate = annualRate / 100 / 12;
  const minimumPaymentToReduceBalance = balance * monthlyRate + 1;

  if (monthlyPayment <= balance * monthlyRate) {
    return {
      payoffPossible: false,
      minimumPaymentToReduceBalance,
      months: 0,
      interestPaid: 0,
      totalPaid: 0,
      balances: [balance]
    };
  }

  let remaining = balance;
  let month = 0;
  let interestPaid = 0;
  let totalPaid = 0;
  const balances = [balance];

  while (remaining > 0.01 && month < 1200) {
    month += 1;
    const interest = remaining * monthlyRate;
    const payment = Math.min(remaining + interest, monthlyPayment + extraPayment);
    remaining = Math.max(0, remaining + interest - payment);
    interestPaid += interest;
    totalPaid += payment;
    balances.push(remaining);
  }

  return {
    payoffPossible: true,
    minimumPaymentToReduceBalance,
    months: month,
    interestPaid,
    totalPaid,
    balances
  };
}

export function calculateCreditCardPayoff(inputs: CreditCardPayoffInputs): CreditCardPayoffResult | undefined {
  const { balance, annualRate, monthlyPayment, extraPaymentMonthly = 0 } = inputs;

  if (balance <= 0 || annualRate < 0 || monthlyPayment <= 0 || extraPaymentMonthly < 0) {
    return undefined;
  }

  const standard = simulateCreditCard(balance, annualRate, monthlyPayment, 0);
  const accelerated = simulateCreditCard(balance, annualRate, monthlyPayment, extraPaymentMonthly);

  if (!standard.payoffPossible) {
    return {
      payoffPossible: false,
      minimumPaymentToReduceBalance: standard.minimumPaymentToReduceBalance,
      standardMonths: 0,
      acceleratedMonths: 0,
      standardInterest: 0,
      acceleratedInterest: 0,
      interestSaved: 0,
      monthsSaved: 0,
      totalPaidStandard: 0,
      totalPaidAccelerated: 0,
      points: [{ month: 0, standardBalance: balance, acceleratedBalance: balance }]
    };
  }

  const maxMonths = Math.max(standard.balances.length, accelerated.balances.length);
  const points: CreditCardPoint[] = [];

  for (let month = 0; month < maxMonths; month += 1) {
    if (month === 0 || month % 3 === 0 || month === maxMonths - 1) {
      points.push({
        month,
        standardBalance: standard.balances[Math.min(month, standard.balances.length - 1)],
        acceleratedBalance: accelerated.balances[Math.min(month, accelerated.balances.length - 1)]
      });
    }
  }

  return {
    payoffPossible: true,
    minimumPaymentToReduceBalance: standard.minimumPaymentToReduceBalance,
    standardMonths: standard.months,
    acceleratedMonths: accelerated.months,
    standardInterest: standard.interestPaid,
    acceleratedInterest: accelerated.interestPaid,
    interestSaved: standard.interestPaid - accelerated.interestPaid,
    monthsSaved: standard.months - accelerated.months,
    totalPaidStandard: standard.totalPaid,
    totalPaidAccelerated: accelerated.totalPaid,
    points
  };
}

export function calculateDebtToIncome(inputs: DebtToIncomeInputs): DebtToIncomeResult | undefined {
  const { grossMonthlyIncome, housingPayment, carLoans, studentLoans, creditCards, personalLoans, otherDebts } = inputs;

  if (
    grossMonthlyIncome <= 0 ||
    housingPayment < 0 ||
    carLoans < 0 ||
    studentLoans < 0 ||
    creditCards < 0 ||
    personalLoans < 0 ||
    otherDebts < 0
  ) {
    return undefined;
  }

  const nonHousingDebt = carLoans + studentLoans + creditCards + personalLoans + otherDebts;
  const totalMonthlyDebt = housingPayment + nonHousingDebt;
  const frontEndRatio = housingPayment / grossMonthlyIncome;
  const backEndRatio = totalMonthlyDebt / grossMonthlyIncome;
  const recommendedHousingBy28Rule = grossMonthlyIncome * 0.28;
  const recommendedHousingBy36Rule = Math.max(0, grossMonthlyIncome * 0.36 - nonHousingDebt);

  let riskBand: DebtToIncomeResult["riskBand"] = "healthy";
  let guidance = "Your debt load is within commonly used underwriting ranges, which gives you more breathing room for future borrowing and savings goals.";

  if (backEndRatio > 0.5 || frontEndRatio > 0.36) {
    riskBand = "high";
    guidance = "Your current debt-to-income profile is on the heavy side. Lenders may view this as riskier, and it may be worth reducing debt or increasing income before adding more monthly obligations.";
  } else if (backEndRatio > 0.43 || frontEndRatio > 0.31) {
    riskBand = "watch";
    guidance = "Your ratios are still workable in some situations, but they are getting tight. A small change in income or expenses could affect borrowing flexibility.";
  }

  return {
    grossMonthlyIncome,
    totalMonthlyDebt,
    frontEndRatio,
    backEndRatio,
    nonHousingDebt,
    recommendedHousingBy28Rule,
    recommendedHousingBy36Rule,
    riskBand,
    guidance
  };
}

function remainingBalanceAfterMonths(principal: number, annualRate: number, monthlyPayment: number, monthsElapsed: number) {
  const monthlyRate = annualRate / 100 / 12;
  let balance = principal;

  for (let month = 0; month < monthsElapsed; month += 1) {
    const interest = monthlyRate === 0 ? 0 : balance * monthlyRate;
    const principalPaid = monthlyPayment - interest;
    balance = Math.max(0, balance - principalPaid);
  }

  return balance;
}

export function calculateRentVsBuy(inputs: RentVsBuyInputs): RentVsBuyResult | undefined {
  const {
    homePrice,
    downPayment,
    mortgageRate,
    loanTermYears,
    monthlyRent,
    yearsInHome,
    annualHomeAppreciation,
    annualRentIncrease,
    propertyTaxRate,
    maintenanceRate,
    closingCostsRate,
    sellingCostsRate
  } = inputs;

  if (
    homePrice <= 0 ||
    downPayment < 0 ||
    mortgageRate < 0 ||
    loanTermYears <= 0 ||
    monthlyRent <= 0 ||
    yearsInHome <= 0 ||
    annualHomeAppreciation < 0 ||
    annualRentIncrease < 0 ||
    propertyTaxRate < 0 ||
    maintenanceRate < 0 ||
    closingCostsRate < 0 ||
    sellingCostsRate < 0
  ) {
    return undefined;
  }

  const principal = Math.max(0, homePrice - downPayment);
  const monthlyPayment = amortizedMonthlyPayment(principal, mortgageRate, Math.round(loanTermYears * 12));
  const monthlyPropertyTax = homePrice * (propertyTaxRate / 100) / 12;
  const monthlyMaintenance = homePrice * (maintenanceRate / 100) / 12;
  const monthlyOwnershipCost = monthlyPayment + monthlyPropertyTax + monthlyMaintenance;
  const closingCosts = homePrice * (closingCostsRate / 100);
  const holdMonths = Math.round(yearsInHome * 12);

  let totalRentCost = 0;
  let rentPoints: RentVsBuyPoint[] = [];

  for (let month = 1; month <= holdMonths; month += 1) {
    const yearIndex = Math.floor((month - 1) / 12);
    const adjustedRent = monthlyRent * Math.pow(1 + annualRentIncrease / 100, yearIndex);
    totalRentCost += adjustedRent;

    if (month % 12 === 0 || month === holdMonths) {
      const yearsHeld = month / 12;
      const buyCashOutflow = downPayment + closingCosts + monthlyOwnershipCost * month;
      const futureValue = homePrice * Math.pow(1 + annualHomeAppreciation / 100, yearsHeld);
      const remainingBalance = remainingBalanceAfterMonths(principal, mortgageRate, monthlyPayment, month);
      const sellingCosts = futureValue * (sellingCostsRate / 100);
      const equityAfterSale = Math.max(0, futureValue - remainingBalance - sellingCosts);

      rentPoints.push({
        year: yearsHeld,
        rentCost: totalRentCost,
        buyNetCost: buyCashOutflow - equityAfterSale
      });
    }
  }

  const estimatedHomeValue = homePrice * Math.pow(1 + annualHomeAppreciation / 100, yearsInHome);
  const sellingCosts = estimatedHomeValue * (sellingCostsRate / 100);
  const remainingBalance = remainingBalanceAfterMonths(principal, mortgageRate, monthlyPayment, holdMonths);
  const estimatedEquityAfterSale = Math.max(0, estimatedHomeValue - remainingBalance - sellingCosts);
  const totalBuyCashOutflow = downPayment + closingCosts + monthlyOwnershipCost * holdMonths;
  const buyNetCost = totalBuyCashOutflow - estimatedEquityAfterSale;
  const difference = Math.abs(totalRentCost - buyNetCost);
  const betterOption =
    Math.abs(totalRentCost - buyNetCost) < 250 ? "tie" : totalRentCost < buyNetCost ? "rent" : "buy";

  const breakEvenPoint = rentPoints.find((point) => point.buyNetCost <= point.rentCost);

  return {
    monthlyOwnershipCost,
    totalRentCost,
    totalBuyCashOutflow,
    estimatedHomeValue,
    estimatedEquityAfterSale,
    buyNetCost,
    difference,
    betterOption,
    breakEvenYear: breakEvenPoint?.year,
    points: [{ year: 0, rentCost: 0, buyNetCost: downPayment + closingCosts }, ...rentPoints]
  };
}
