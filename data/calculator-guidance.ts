import type { CalculatorSlug } from "@/data/calculators";

export interface CalculatorGuidance {
  considerations: string[];
  tips: string[];
  assumptions: string[];
}

const calculatorGuidance: Partial<Record<CalculatorSlug, CalculatorGuidance>> = {
  "mortgage-calculator": {
    considerations: [
      "Focus on the full monthly housing cost, not just principal and interest. Taxes, insurance, HOA dues, PMI, and maintenance all affect whether the payment stays comfortable.",
      "A payment that technically fits a lender guideline can still feel tight once savings goals, childcare, commuting, or irregular expenses are included."
    ],
    tips: [
      "Keep an emergency fund separate from the down payment so the purchase does not wipe out your cash buffer on day one.",
      "Compare a shorter term, a larger down payment, and extra monthly payments side by side before deciding which lever saves the most interest."
    ],
    assumptions: [
      "The calculator assumes a fixed-rate amortizing loan unless you intentionally model a different payment pattern through the inputs.",
      "Property tax, insurance, HOA, PMI, and extra payments are treated as planning inputs and do not attempt to reflect lender-specific escrow rules."
    ]
  },
  "mortgage-affordability-calculator": {
    considerations: [
      "Affordability is not just about approval. The better question is whether the payment still leaves room for savings, repairs, and lifestyle flexibility.",
      "Existing debt can shrink the realistic home price range faster than most buyers expect, especially when rates are elevated."
    ],
    tips: [
      "Test the same scenario with a lower target housing payment than the maximum result to see what a safer budget looks like.",
      "Use the output as a search-range anchor, then run the matching down payment and mortgage calculators before making offers."
    ],
    assumptions: [
      "Affordability guidance is based on ratio-style planning assumptions rather than lender-specific underwriting standards.",
      "The result does not include every ownership cost, such as maintenance, utilities, moving costs, or future tax reassessments."
    ]
  },
  "loan-calculator": {
    considerations: [
      "Monthly payment and total interest move in opposite directions. A lower payment often means carrying the debt for longer and paying much more overall.",
      "If you already know the payment you can handle, solving for the rate or term can show what kind of loan structure actually fits the budget."
    ],
    tips: [
      "Treat the solved payment as the starting point, then compare a shorter term or extra-payment plan to see how much interest can be cut.",
      "If the implied rate looks unusually high, check the total fees and dealer add-ons behind the loan instead of assuming the payment is normal."
    ],
    assumptions: [
      "This calculator models a standard amortizing loan with fixed payments.",
      "Taxes, fees, and optional insurance products should be modeled separately unless they are financed into the balance."
    ]
  },
  "rent-vs-buy-calculator": {
    considerations: [
      "The break-even year matters more than the first-year payment. Buying often looks worse early and improves only if you stay long enough.",
      "Flexibility, relocation risk, maintenance responsibility, and liquidity can matter as much as the modeled cash outcome."
    ],
    tips: [
      "Change the expected years in the home first. That single assumption usually has one of the biggest effects on the decision.",
      "Run a conservative version with lower home appreciation and higher maintenance to stress-test whether buying still wins."
    ],
    assumptions: [
      "The model uses user-entered assumptions for appreciation, rent growth, and ownership costs rather than forecasting the market.",
      "Results are planning estimates and should not be treated as tax, legal, or real-estate advice."
    ]
  },
  "compound-interest-calculator": {
    considerations: [
      "Time and contribution rate usually matter more than small compounding-frequency differences, especially early on.",
      "A scenario with a lower return but higher monthly contribution can outperform a higher-return plan that never gets funded consistently."
    ],
    tips: [
      "Test what happens when you add just $50 or $100 more per month. That often changes the long-term result more than tweaking the compounding setting.",
      "Use comparison mode to separate return assumptions from contribution discipline so you can see which variable is doing the real work."
    ],
    assumptions: [
      "The model assumes a steady annual return and regular contribution pattern, which real markets rarely deliver in a straight line.",
      "Compounding frequency changes the math around return accrual, but it does not remove volatility or investment risk."
    ]
  },
  "debt-payoff-calculator": {
    considerations: [
      "Small payment increases can meaningfully reduce payoff time when the balance carries a high rate for years.",
      "A payoff plan only works if the balance stops growing, so new charges or fees can erase the progress the schedule suggests."
    ],
    tips: [
      "Try one scenario with the current payment and one with a slightly higher payment to see the real interest savings before cutting other budget items.",
      "If the payoff horizon still feels too long, compare the result with debt consolidation or avalanche-style prioritization instead of just paying more blindly."
    ],
    assumptions: [
      "The schedule assumes a fixed rate and consistent payment behavior throughout the payoff period.",
      "It does not model penalty APR changes, promotional balances, or missed-payment fees unless you approximate them manually."
    ]
  },
  "tax-calculator": {
    considerations: [
      "Tax estimates are most useful for planning ranges, not exact paycheck predictions. Withholding, credits, and deductions can shift the real result.",
      "Small differences in filing status, retirement contributions, or state assumptions can materially change take-home pay."
    ],
    tips: [
      "Run one conservative case and one optimistic case so you can budget with a range instead of anchoring to a single exact-looking output.",
      "Use the result alongside the take-home paycheck and salary calculators when comparing offers, raises, or side-income scenarios."
    ],
    assumptions: [
      "The calculator uses simplified tax assumptions rather than full tax-preparation logic.",
      "Local taxes, credits, itemized deductions, and employer-specific payroll settings may not be fully represented."
    ]
  },
  "take-home-paycheck-calculator": {
    considerations: [
      "Gross pay can be misleading. The number that affects budgeting, rent limits, and savings decisions is the net amount per check.",
      "Pay frequency can make two similar jobs feel very different in monthly cash flow even when annual salary is unchanged."
    ],
    tips: [
      "Compare two scenarios with different retirement contributions so you can see the real tradeoff between today’s paycheck and long-term savings.",
      "If you are evaluating an offer, pair this output with a budget or housing calculator instead of looking at paycheck size in isolation."
    ],
    assumptions: [
      "Take-home estimates use simplified tax logic and cannot reproduce every payroll system exactly.",
      "Benefits, garnishments, reimbursements, bonuses, and irregular deductions may need to be modeled separately."
    ]
  },
  "salary-to-hourly-calculator": {
    considerations: [
      "Hourly equivalence is useful for comparison, but total compensation can still differ materially once benefits, bonus structure, and paid time off are considered.",
      "A higher annual salary is not always the better offer if taxes, commuting, unpaid overtime, or fewer benefits reduce the real value."
    ],
    tips: [
      "Compare both annual and take-home outcomes when reviewing job offers instead of focusing only on the hourly conversion.",
      "Adjust work hours and paid weeks carefully if the role includes unpaid time off, irregular overtime, or contractor-style scheduling."
    ],
    assumptions: [
      "The conversion assumes the entered hours and weeks worked are representative of the actual job.",
      "Taxes and deductions are estimates and should not be treated as payroll advice."
    ]
  },
  "bmi-calculator": {
    considerations: [
      "BMI is a quick screening metric, not a direct body-fat measurement. Athletic builds, older adults, and some body types can look less typical in BMI than in real health context.",
      "The category label is more useful when combined with other indicators such as waist measurements, body-fat estimates, labs, or clinician guidance."
    ],
    tips: [
      "Use the BMI result together with the body fat, calorie, or ideal weight calculators if you want a more complete planning picture.",
      "Track the trend over time rather than overreacting to one isolated BMI value."
    ],
    assumptions: [
      "BMI is calculated strictly from height and weight.",
      "Age, sex, and activity level matter for interpretation, but they do not change the raw BMI formula itself."
    ]
  },
  "calorie-needs-calculator": {
    considerations: [
      "The result is a starting point, not a guarantee. Real calorie needs shift with activity, recovery, body composition, and adherence.",
      "A target that looks mathematically correct can still be too aggressive if it is not sustainable for your appetite, schedule, or training load."
    ],
    tips: [
      "Run a maintenance case first, then compare it with a slower cut or smaller surplus before choosing a goal calorie target.",
      "Watch body-weight trends and energy levels for a few weeks, then adjust the intake instead of assuming the first estimate is perfect."
    ],
    assumptions: [
      "The estimate uses standard BMR and activity-multiplier formulas rather than direct metabolic testing.",
      "Activity level affects the output substantially, so inaccurate activity selection can shift the calorie target more than expected."
    ]
  }
};

export function getCalculatorGuidance(slug: CalculatorSlug): CalculatorGuidance | null {
  return calculatorGuidance[slug] ?? null;
}

