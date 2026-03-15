export type TaxFilingStatus = "single" | "married";
export type TaxState =
  | "none"
  | "al"
  | "ak"
  | "az"
  | "ar"
  | "ca"
  | "co"
  | "ct"
  | "de"
  | "dc"
  | "fl"
  | "ga"
  | "hi"
  | "id"
  | "il"
  | "in"
  | "ia"
  | "ks"
  | "ky"
  | "la"
  | "me"
  | "md"
  | "ma"
  | "mi"
  | "mn"
  | "ms"
  | "mo"
  | "mt"
  | "ne"
  | "nv"
  | "nh"
  | "nj"
  | "nm"
  | "ny"
  | "nc"
  | "nd"
  | "oh"
  | "ok"
  | "or"
  | "pa"
  | "ri"
  | "sc"
  | "sd"
  | "tn"
  | "tx"
  | "ut"
  | "vt"
  | "va"
  | "wa"
  | "wv"
  | "wi"
  | "wy";

export interface TaxEstimateInputs {
  annualIncome: number;
  filingStatus: TaxFilingStatus;
  state: TaxState;
  preTaxDeductions: number;
  postTaxDeductions: number;
}

export interface TaxEstimateResult {
  taxableIncome: number;
  federalTax: number;
  stateTax: number;
  payrollTax: number;
  totalTax: number;
  totalDeductions: number;
  netAnnual: number;
  netMonthly: number;
  netBiweekly: number;
  effectiveTaxRate: number;
}

export interface NetWorthInputs {
  cash: number;
  investments: number;
  retirement: number;
  property: number;
  otherAssets: number;
  mortgage: number;
  loans: number;
  creditCards: number;
  otherLiabilities: number;
}

export interface NetWorthResult {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  debtToAssetRatio: number;
}

export interface AgeCalculatorResult {
  years: number;
  months: number;
  days: number;
  totalMonths: number;
  totalWeeks: number;
  totalDays: number;
  daysUntilBirthday: number;
}

export interface DateDifferenceResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalMonths: number;
}

export interface TimeDurationResult {
  totalMinutes: number;
  hours: number;
  minutes: number;
  decimalHours: number;
}

const usFederalBrackets = {
  single: [
    { upTo: 11600, rate: 0.1 },
    { upTo: 47150, rate: 0.12 },
    { upTo: 100525, rate: 0.22 },
    { upTo: 191950, rate: 0.24 },
    { upTo: 243725, rate: 0.32 },
    { upTo: 609350, rate: 0.35 },
    { upTo: Number.POSITIVE_INFINITY, rate: 0.37 }
  ],
  married: [
    { upTo: 23200, rate: 0.1 },
    { upTo: 94300, rate: 0.12 },
    { upTo: 201050, rate: 0.22 },
    { upTo: 383900, rate: 0.24 },
    { upTo: 487450, rate: 0.32 },
    { upTo: 731200, rate: 0.35 },
    { upTo: Number.POSITIVE_INFINITY, rate: 0.37 }
  ]
};

const usStandardDeduction = {
  single: 14600,
  married: 29200
};

const stateTaxRates: Record<TaxState, number> = {
  none: 0,
  al: 0.05,
  ak: 0,
  az: 0.025,
  ar: 0.045,
  ca: 0.093,
  co: 0.044,
  ct: 0.05,
  de: 0.052,
  dc: 0.06,
  fl: 0,
  ga: 0.0539,
  hi: 0.0825,
  id: 0.058,
  il: 0.0495,
  in: 0.0305,
  ia: 0.057,
  ks: 0.052,
  ky: 0.04,
  la: 0.03,
  me: 0.065,
  md: 0.05,
  ma: 0.05,
  mi: 0.0425,
  mn: 0.068,
  ms: 0.047,
  mo: 0.048,
  mt: 0.059,
  ne: 0.058,
  nv: 0,
  nh: 0,
  nj: 0.057,
  nm: 0.049,
  ny: 0.065,
  nc: 0.0475,
  nd: 0.022,
  oh: 0.035,
  ok: 0.04,
  or: 0.08,
  pa: 0.0307,
  ri: 0.0475,
  sc: 0.064,
  sd: 0,
  tn: 0,
  tx: 0,
  ut: 0.0485,
  vt: 0.066,
  va: 0.0525,
  wa: 0,
  wv: 0.0512,
  wi: 0.053,
  wy: 0
};

export const taxStateOptions: Array<{ value: TaxState; label: string }> = [
  { value: "none", label: "No state selected" },
  { value: "al", label: "Alabama" },
  { value: "ak", label: "Alaska" },
  { value: "az", label: "Arizona" },
  { value: "ar", label: "Arkansas" },
  { value: "ca", label: "California" },
  { value: "co", label: "Colorado" },
  { value: "ct", label: "Connecticut" },
  { value: "de", label: "Delaware" },
  { value: "dc", label: "District of Columbia" },
  { value: "fl", label: "Florida" },
  { value: "ga", label: "Georgia" },
  { value: "hi", label: "Hawaii" },
  { value: "id", label: "Idaho" },
  { value: "il", label: "Illinois" },
  { value: "in", label: "Indiana" },
  { value: "ia", label: "Iowa" },
  { value: "ks", label: "Kansas" },
  { value: "ky", label: "Kentucky" },
  { value: "la", label: "Louisiana" },
  { value: "me", label: "Maine" },
  { value: "md", label: "Maryland" },
  { value: "ma", label: "Massachusetts" },
  { value: "mi", label: "Michigan" },
  { value: "mn", label: "Minnesota" },
  { value: "ms", label: "Mississippi" },
  { value: "mo", label: "Missouri" },
  { value: "mt", label: "Montana" },
  { value: "ne", label: "Nebraska" },
  { value: "nv", label: "Nevada" },
  { value: "nh", label: "New Hampshire" },
  { value: "nj", label: "New Jersey" },
  { value: "nm", label: "New Mexico" },
  { value: "ny", label: "New York" },
  { value: "nc", label: "North Carolina" },
  { value: "nd", label: "North Dakota" },
  { value: "oh", label: "Ohio" },
  { value: "ok", label: "Oklahoma" },
  { value: "or", label: "Oregon" },
  { value: "pa", label: "Pennsylvania" },
  { value: "ri", label: "Rhode Island" },
  { value: "sc", label: "South Carolina" },
  { value: "sd", label: "South Dakota" },
  { value: "tn", label: "Tennessee" },
  { value: "tx", label: "Texas" },
  { value: "ut", label: "Utah" },
  { value: "vt", label: "Vermont" },
  { value: "va", label: "Virginia" },
  { value: "wa", label: "Washington" },
  { value: "wv", label: "West Virginia" },
  { value: "wi", label: "Wisconsin" },
  { value: "wy", label: "Wyoming" }
];

export const taxFilingStatusOptions: Array<{ value: TaxFilingStatus; label: string }> = [
  { value: "single", label: "Single" },
  { value: "married", label: "Married filing jointly" }
];

function round(value: number, decimals = 2) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function calculateProgressiveTax(income: number, brackets: Array<{ upTo: number; rate: number }>) {
  let remaining = income;
  let previousCap = 0;
  let tax = 0;

  for (const bracket of brackets) {
    if (remaining <= 0) {
      break;
    }

    const taxableAtRate = Math.min(remaining, bracket.upTo - previousCap);
    tax += taxableAtRate * bracket.rate;
    remaining -= taxableAtRate;
    previousCap = bracket.upTo;
  }

  return tax;
}

export function calculateTaxEstimate(inputs: TaxEstimateInputs): TaxEstimateResult | undefined {
  const { annualIncome, filingStatus, state, preTaxDeductions, postTaxDeductions } = inputs;

  if (annualIncome <= 0 || preTaxDeductions < 0 || postTaxDeductions < 0) {
    return undefined;
  }

  const taxableIncome = Math.max(0, annualIncome - preTaxDeductions);
  const adjustedFederalIncome = Math.max(0, taxableIncome - usStandardDeduction[filingStatus]);
  const federalTax = calculateProgressiveTax(adjustedFederalIncome, usFederalBrackets[filingStatus]);
  const payrollTax = annualIncome * 0.0765;
  const stateTax = taxableIncome * stateTaxRates[state];
  const totalTax = federalTax + payrollTax + stateTax;
  const totalDeductions = totalTax + preTaxDeductions + postTaxDeductions;
  const netAnnual = Math.max(0, annualIncome - totalDeductions);

  return {
    taxableIncome: round(taxableIncome),
    federalTax: round(federalTax),
    stateTax: round(stateTax),
    payrollTax: round(payrollTax),
    totalTax: round(totalTax),
    totalDeductions: round(totalDeductions),
    netAnnual: round(netAnnual),
    netMonthly: round(netAnnual / 12),
    netBiweekly: round(netAnnual / 26),
    effectiveTaxRate: annualIncome === 0 ? 0 : round(totalTax / annualIncome, 4)
  };
}

export function calculateNetWorth(inputs: NetWorthInputs): NetWorthResult | undefined {
  const values = Object.values(inputs);
  if (values.some((value) => value < 0)) {
    return undefined;
  }

  const totalAssets = inputs.cash + inputs.investments + inputs.retirement + inputs.property + inputs.otherAssets;
  const totalLiabilities = inputs.mortgage + inputs.loans + inputs.creditCards + inputs.otherLiabilities;
  const netWorth = totalAssets - totalLiabilities;

  return {
    totalAssets: round(totalAssets),
    totalLiabilities: round(totalLiabilities),
    netWorth: round(netWorth),
    debtToAssetRatio: totalAssets === 0 ? 0 : round(totalLiabilities / totalAssets, 4)
  };
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function diffCalendar(start: Date, end: Date) {
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
    days += prevMonth.getDate();
    months -= 1;
  }

  if (months < 0) {
    months += 12;
    years -= 1;
  }

  return { years, months, days };
}

export function calculateAgeFromDates(birthDateValue: string, compareDateValue: string): AgeCalculatorResult | undefined {
  if (!birthDateValue || !compareDateValue) {
    return undefined;
  }

  const birthDate = startOfDay(new Date(birthDateValue));
  const compareDate = startOfDay(new Date(compareDateValue));

  if (Number.isNaN(birthDate.getTime()) || Number.isNaN(compareDate.getTime()) || birthDate > compareDate) {
    return undefined;
  }

  const diffMs = compareDate.getTime() - birthDate.getTime();
  const totalDays = Math.floor(diffMs / 86400000);
  const totalWeeks = round(totalDays / 7, 1);
  const totalMonths = (compareDate.getFullYear() - birthDate.getFullYear()) * 12 + compareDate.getMonth() - birthDate.getMonth() - (compareDate.getDate() < birthDate.getDate() ? 1 : 0);
  const { years, months, days } = diffCalendar(birthDate, compareDate);
  const nextBirthdayYear =
    compareDate.getMonth() > birthDate.getMonth() ||
    (compareDate.getMonth() === birthDate.getMonth() && compareDate.getDate() >= birthDate.getDate())
      ? compareDate.getFullYear() + 1
      : compareDate.getFullYear();
  const nextBirthday = startOfDay(new Date(nextBirthdayYear, birthDate.getMonth(), birthDate.getDate()));
  const daysUntilBirthday = Math.floor((nextBirthday.getTime() - compareDate.getTime()) / 86400000);

  return {
    years,
    months,
    days,
    totalMonths,
    totalWeeks,
    totalDays,
    daysUntilBirthday
  };
}

export function calculateDateDifference(startDateValue: string, endDateValue: string, includeEndDate = false): DateDifferenceResult | undefined {
  if (!startDateValue || !endDateValue) {
    return undefined;
  }

  let startDate = startOfDay(new Date(startDateValue));
  let endDate = startOfDay(new Date(endDateValue));

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return undefined;
  }

  if (endDate < startDate) {
    const swap = startDate;
    startDate = endDate;
    endDate = swap;
  }

  if (includeEndDate) {
    endDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() + 1);
  }

  const diffMs = endDate.getTime() - startDate.getTime();
  const totalDays = Math.floor(diffMs / 86400000);
  const { years, months, days } = diffCalendar(startDate, endDate);

  return {
    years,
    months,
    days,
    totalDays,
    totalWeeks: round(totalDays / 7, 1),
    totalMonths: round(totalDays / 30.44, 1)
  };
}

function parseTimeToMinutes(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  if ([hours, minutes].some((part) => Number.isNaN(part))) {
    return undefined;
  }
  return hours * 60 + minutes;
}

export function calculateTimeDuration(startTime: string, endTime: string, breakMinutes: number): TimeDurationResult | undefined {
  const startMinutes = parseTimeToMinutes(startTime);
  const endMinutes = parseTimeToMinutes(endTime);

  if (startMinutes === undefined || endMinutes === undefined || breakMinutes < 0) {
    return undefined;
  }

  let totalMinutes = endMinutes - startMinutes;
  if (totalMinutes < 0) {
    totalMinutes += 24 * 60;
  }

  totalMinutes -= breakMinutes;

  if (totalMinutes < 0) {
    return undefined;
  }

  return {
    totalMinutes,
    hours: Math.floor(totalMinutes / 60),
    minutes: totalMinutes % 60,
    decimalHours: round(totalMinutes / 60, 2)
  };
}
