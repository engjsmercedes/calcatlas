export interface MortgageInputs {
  loanAmount: number;
  annualRate: number;
  years: number;
  propertyTaxAnnual?: number;
  insuranceAnnual?: number;
  hoaMonthly?: number;
}

export interface MortgagePoint {
  year: number;
  remainingBalance: number;
  cumulativeInterest: number;
}

export interface MortgageResult {
  monthlyPrincipalInterest: number;
  totalMonthlyPayment: number;
  totalInterest: number;
  totalPaid: number;
  points: MortgagePoint[];
}

export function calculateMortgage(inputs: MortgageInputs): MortgageResult | undefined {
  const {
    loanAmount,
    annualRate,
    years,
    propertyTaxAnnual = 0,
    insuranceAnnual = 0,
    hoaMonthly = 0
  } = inputs;

  if (loanAmount <= 0 || annualRate < 0 || years <= 0 || propertyTaxAnnual < 0 || insuranceAnnual < 0 || hoaMonthly < 0) {
    return undefined;
  }

  const monthlyRate = annualRate / 100 / 12;
  const numberOfPayments = Math.round(years * 12);

  const monthlyPrincipalInterest =
    monthlyRate === 0
      ? loanAmount / numberOfPayments
      : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  let remainingBalance = loanAmount;
  let cumulativeInterest = 0;
  const points: MortgagePoint[] = [{ year: 0, remainingBalance: loanAmount, cumulativeInterest: 0 }];

  for (let payment = 1; payment <= numberOfPayments; payment += 1) {
    const interestPaid = remainingBalance * monthlyRate;
    const principalPaid = monthlyPrincipalInterest - interestPaid;
    remainingBalance = Math.max(0, remainingBalance - principalPaid);
    cumulativeInterest += interestPaid;

    if (payment % 12 === 0 || payment === numberOfPayments) {
      points.push({
        year: payment / 12,
        remainingBalance,
        cumulativeInterest
      });
    }
  }

  const totalMonthlyPayment = monthlyPrincipalInterest + propertyTaxAnnual / 12 + insuranceAnnual / 12 + hoaMonthly;
  const totalPaid = monthlyPrincipalInterest * numberOfPayments + propertyTaxAnnual * years + insuranceAnnual * years + hoaMonthly * numberOfPayments;

  return {
    monthlyPrincipalInterest,
    totalMonthlyPayment,
    totalInterest: cumulativeInterest,
    totalPaid,
    points
  };
}
