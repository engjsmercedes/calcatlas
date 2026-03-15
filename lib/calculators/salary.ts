export type SalaryMode = "salary-to-hourly" | "hourly-to-salary";
export type TaxCountry = "us" | "canada" | "uk";
export type FilingStatus = "single" | "married";
export type UsState =
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

export interface SalaryBreakdown {
  hourly: number;
  weekly: number;
  biweekly: number;
  monthly: number;
  annual: number;
}

export interface SalaryEstimatorInputs {
  mode: SalaryMode;
  annualSalary: number;
  hourlyRate: number;
  hoursPerWeek: number;
  weeksPerYear: number;
  country: TaxCountry;
  state: UsState;
  filingStatus: FilingStatus;
  preTaxDeductionsAnnual: number;
  postTaxDeductionsAnnual: number;
  retirementPercent: number;
  bonusAnnual: number;
}

export interface DeductionBreakdown {
  federal: number;
  state: number;
  payroll: number;
  retirement: number;
  preTax: number;
  postTax: number;
  total: number;
}

export interface SalaryEstimatorResult {
  gross: SalaryBreakdown;
  net: SalaryBreakdown;
  deductions: DeductionBreakdown;
  effectiveTaxRate: number;
  marginalContext: string;
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

const stateTaxRates: Record<UsState, number> = {
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

const countryBaseRates: Record<TaxCountry, { income: number; payroll: number }> = {
  us: { income: 0, payroll: 0 },
  canada: { income: 0.205, payroll: 0.058 },
  uk: { income: 0.2, payroll: 0.08 }
};

export const countryOptions: Array<{ value: TaxCountry; label: string }> = [
  { value: "us", label: "United States" },
  { value: "canada", label: "Canada" },
  { value: "uk", label: "United Kingdom" }
];

export const filingStatusOptions: Array<{ value: FilingStatus; label: string }> = [
  { value: "single", label: "Single" },
  { value: "married", label: "Married filing jointly" }
];

export const usStateOptions: Array<{ value: UsState; label: string }> = [
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

export function salaryToHourly(annualSalary: number, hoursPerWeek: number, weeksPerYear: number): SalaryBreakdown | undefined {
  if (annualSalary < 0 || hoursPerWeek <= 0 || weeksPerYear <= 0) {
    return undefined;
  }

  const hourly = annualSalary / (hoursPerWeek * weeksPerYear);
  return buildBreakdown(hourly, hoursPerWeek, weeksPerYear);
}

export function hourlyToSalary(hourlyRate: number, hoursPerWeek: number, weeksPerYear: number): SalaryBreakdown | undefined {
  if (hourlyRate < 0 || hoursPerWeek <= 0 || weeksPerYear <= 0) {
    return undefined;
  }

  return buildBreakdown(hourlyRate, hoursPerWeek, weeksPerYear);
}

export function estimateSalary(inputs: SalaryEstimatorInputs): SalaryEstimatorResult | undefined {
  const {
    mode,
    annualSalary,
    hourlyRate,
    hoursPerWeek,
    weeksPerYear,
    country,
    state,
    filingStatus,
    preTaxDeductionsAnnual,
    postTaxDeductionsAnnual,
    retirementPercent,
    bonusAnnual
  } = inputs;

  if (
    hoursPerWeek <= 0 ||
    weeksPerYear <= 0 ||
    preTaxDeductionsAnnual < 0 ||
    postTaxDeductionsAnnual < 0 ||
    retirementPercent < 0 ||
    retirementPercent > 100 ||
    bonusAnnual < 0
  ) {
    return undefined;
  }

  const baseGross =
    mode === "salary-to-hourly"
      ? salaryToHourly(annualSalary, hoursPerWeek, weeksPerYear)
      : hourlyToSalary(hourlyRate, hoursPerWeek, weeksPerYear);

  if (!baseGross) {
    return undefined;
  }

  const grossAnnual = baseGross.annual + bonusAnnual;
  const grossHourly = grossAnnual / (hoursPerWeek * weeksPerYear);
  const gross = buildBreakdown(grossHourly, hoursPerWeek, weeksPerYear);
  const retirement = grossAnnual * (retirementPercent / 100);
  const taxableIncome = Math.max(0, grossAnnual - retirement - preTaxDeductionsAnnual);

  let federal = 0;
  let payroll = 0;
  let stateTax = 0;
  let marginalContext = "Estimated using the selected tax assumptions.";

  if (country === "us") {
    const adjustedFederalIncome = Math.max(0, taxableIncome - usStandardDeduction[filingStatus]);
    federal = calculateProgressiveTax(adjustedFederalIncome, usFederalBrackets[filingStatus]);
    payroll = grossAnnual * 0.0765;
    stateTax = taxableIncome * stateTaxRates[state];
    const stateLabel = usStateOptions.find((option) => option.value === state)?.label || "selected state";
    marginalContext = `Federal tax is estimated with ${filingStatus === "single" ? "single" : "married"} US brackets and ${stateLabel} state tax assumptions.`;
  } else {
    federal = taxableIncome * countryBaseRates[country].income;
    payroll = grossAnnual * countryBaseRates[country].payroll;
    stateTax = 0;
    marginalContext = `This is a simplified ${country === "canada" ? "Canada" : "UK"} estimate using blended income and payroll tax assumptions.`;
  }

  const totalDeductions = federal + payroll + stateTax + retirement + preTaxDeductionsAnnual + postTaxDeductionsAnnual;
  const netAnnual = Math.max(0, grossAnnual - totalDeductions);
  const netHourly = netAnnual / (hoursPerWeek * weeksPerYear);
  const net = buildBreakdown(netHourly, hoursPerWeek, weeksPerYear);

  return {
    gross,
    net,
    deductions: {
      federal,
      state: stateTax,
      payroll,
      retirement,
      preTax: preTaxDeductionsAnnual,
      postTax: postTaxDeductionsAnnual,
      total: totalDeductions
    },
    effectiveTaxRate: grossAnnual === 0 ? 0 : (federal + stateTax + payroll) / grossAnnual,
    marginalContext
  };
}

function buildBreakdown(hourly: number, hoursPerWeek: number, weeksPerYear: number): SalaryBreakdown {
  const annual = hourly * hoursPerWeek * weeksPerYear;
  return {
    hourly,
    weekly: hourly * hoursPerWeek,
    biweekly: hourly * hoursPerWeek * 2,
    monthly: annual / 12,
    annual
  };
}

function calculateProgressiveTax(income: number, brackets: Array<{ upTo: number; rate: number }>) {
  let previousCap = 0;
  let tax = 0;

  for (const bracket of brackets) {
    if (income <= previousCap) {
      break;
    }

    const taxableSlice = Math.min(income, bracket.upTo) - previousCap;
    tax += taxableSlice * bracket.rate;
    previousCap = bracket.upTo;
  }

  return tax;
}
