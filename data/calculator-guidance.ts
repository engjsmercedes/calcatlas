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
  "credit-card-payoff-calculator": {
    considerations: [
      "Minimum payments can make balances linger far longer than most borrowers expect, especially once the rate is high.",
      "Extra payment capacity matters more when it is sustainable every month than when it is aggressive for only a few cycles."
    ],
    tips: [
      "Test one realistic payment and one stretch payment so you can see whether the interest savings justify a tighter monthly budget.",
      "If payoff still looks too slow, compare the result with debt consolidation or a broader debt-payoff strategy instead of only adjusting the number upward."
    ],
    assumptions: [
      "The estimate assumes a fixed interest rate and stable payment behavior over time.",
      "New charges, promotional transfers, and changing card terms can make the real payoff path differ from the schedule shown."
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
  "savings-goal-calculator": {
    considerations: [
      "Contribution consistency usually matters more than finding the perfect return assumption for a savings target.",
      "A goal that looks achievable on paper can still slip if contributions are irregular or if the expected return is too optimistic."
    ],
    tips: [
      "Try increasing the monthly savings amount before increasing the assumed return rate. The first change is usually more controllable in real life.",
      "Use one conservative scenario and one optimistic scenario so you can plan with a range instead of only one target date."
    ],
    assumptions: [
      "The timeline estimate assumes contributions and growth happen consistently throughout the projection.",
      "Market returns, cash-flow interruptions, and fees can all change the real path to the goal."
    ]
  },
  "inflation-calculator": {
    considerations: [
      "Inflation planning is less about precision and more about understanding how future costs can drift away from today’s numbers.",
      "A low-looking inflation rate can still have a large effect when the time horizon is long."
    ],
    tips: [
      "Test both a moderate inflation rate and a more conservative higher rate if the result affects retirement or long-term budgeting decisions.",
      "Use the output next to savings or retirement calculators so future-dollar goals are not anchored to today’s purchasing power."
    ],
    assumptions: [
      "The calculator assumes a steady inflation rate over the chosen period.",
      "Real-world inflation changes over time and can differ materially across categories such as housing, healthcare, and food."
    ]
  },
  "roi-calculator": {
    considerations: [
      "A high total ROI can still be weak if it took too many years to earn it. Time horizon matters when comparing opportunities.",
      "ROI becomes much easier to misuse when fees, ongoing operating costs, or taxes are left out of the gain calculation."
    ],
    tips: [
      "Add years held whenever possible so annualized ROI can be compared more fairly against other options.",
      "Use one version with all-in costs and one with only headline costs if you want to see how sensitive the return is to hidden drag."
    ],
    assumptions: [
      "ROI is based on the entered initial amount, final value, and optional holding period only.",
      "The calculator does not infer taxes, inflation, or risk unless you adjust the inputs to account for them."
    ]
  },
  "percentage-calculator": {
    considerations: [
      "The right mode matters. 'Percent of' and 'percentage change' answer different questions even when the same numbers are involved.",
      "Small input mistakes can create very different percentages, so it helps to restate the question in words before trusting the result."
    ],
    tips: [
      "Use the percentage-change mode for growth or decline, not the percent-of mode. That keeps reporting and comparisons consistent.",
      "If the result feels off, check whether the base number should be the original value, the total, or the ending value."
    ],
    assumptions: [
      "The calculator is doing direct percentage math without adding business or finance-specific context.",
      "Interpretation still depends on the situation, especially when the same inputs could describe a share, a rate, or a change over time."
    ]
  },
  "discount-calculator": {
    considerations: [
      "A larger discount percentage does not always mean the better deal if the starting prices are very different.",
      "The amount you save in dollars is often more useful than the percent-off headline when comparing real purchases."
    ],
    tips: [
      "Compare the final price and total savings side by side instead of focusing only on the sale percentage.",
      "If you are choosing between multiple promotions, calculate each one from the original price instead of estimating mentally."
    ],
    assumptions: [
      "The calculator assumes a simple percent discount from the original price.",
      "Stacked coupons, taxes, and shipping charges need to be handled separately if they affect the real checkout total."
    ]
  },
  "tip-calculator": {
    considerations: [
      "The social context matters as much as the math. Group size, service quality, and local norms can all change the right tip decision.",
      "A small change in tip rate can look minor in percentage terms but still move the total noticeably on larger bills."
    ],
    tips: [
      "Use the split view before paying so the group agrees on the same total instead of solving different numbers separately.",
      "If you tip on the pre-tax subtotal, make sure the bill amount you enter matches that choice."
    ],
    assumptions: [
      "The calculator applies the selected tip percentage directly to the entered bill amount.",
      "Taxes, fees, and service charges are only reflected if they are already included in the bill number you enter."
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
  "bmr-calculator": {
    considerations: [
      "BMR is not a maintenance-calorie target. It is a resting baseline before activity is layered on.",
      "A strong BMR estimate can still lead to a poor plan if activity level and real-world movement are guessed badly afterward."
    ],
    tips: [
      "Use BMR as a baseline, then move to TDEE or calorie planning if you actually need a daily eating target.",
      "If the result seems unusually low or high, double-check units before changing the interpretation."
    ],
    assumptions: [
      "The calculator uses a standard predictive formula rather than direct metabolic testing.",
      "It estimates energy needs at rest, not the calories required to maintain weight during everyday activity."
    ]
  },
  "body-fat-calculator": {
    considerations: [
      "Body-fat estimates can be more informative than BMI for some people, but tape measurements still depend on good measurement technique.",
      "Changes over time are often more useful than one single estimated percentage."
    ],
    tips: [
      "Measure at the same time of day and use the same tape placement if you want the trend to mean anything.",
      "Pair the result with waist, weight, and performance changes instead of reacting to one body-fat estimate in isolation."
    ],
    assumptions: [
      "The estimate uses formula-based body-fat methods and not a direct scan such as DEXA.",
      "Tape placement errors and body-shape differences can move the result more than users expect."
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
  },
  "unit-converter": {
    considerations: [
      "Unit mistakes create big downstream errors, especially when the converted number gets reused in financial, health, or engineering decisions.",
      "The result is only as useful as the category and source unit you choose, so slow down and verify the direction of conversion."
    ],
    tips: [
      "Convert once, then paste the result into the next calculator instead of repeatedly re-entering mixed units.",
      "If a converted number looks wildly off, check whether the input belongs to length, weight, speed, or temperature before assuming the math is wrong."
    ],
    assumptions: [
      "The converter applies direct unit ratios and standard temperature formulas.",
      "Rounding can make displayed values look slightly different from exact internal ratios on longer decimals."
    ]
  },
  "age-calculator": {
    considerations: [
      "Age questions can mean different things: exact years, total months, or total days. The context determines which result matters.",
      "Small date-entry mistakes are easy to miss, especially around month/day formatting."
    ],
    tips: [
      "Use the exact birth date when the result affects eligibility, deadlines, or official forms.",
      "If the answer is for planning, compare years and total months rather than relying on a single rounded value."
    ],
    assumptions: [
      "The calculator uses calendar date differences, not rough year approximations.",
      "Timezone and time-of-day are not part of the age calculation unless you manually build them into the dates."
    ]
  },
  "time-duration-calculator": {
    considerations: [
      "Time-duration math gets confusing when breaks, overnight spans, or mixed start/end assumptions are involved.",
      "The right answer depends on whether you want pure elapsed time or paid working time after breaks."
    ],
    tips: [
      "Check the overnight option or end time carefully if the duration crosses midnight.",
      "Use the break field deliberately so the result reflects actual working or travel time rather than raw elapsed time."
    ],
    assumptions: [
      "The calculator treats the entered start time, end time, and optional break as direct duration inputs.",
      "It does not infer overtime rules, schedules, or calendar dates unless you enter those details elsewhere."
    ]
  }
};

export function getCalculatorGuidance(slug: CalculatorSlug): CalculatorGuidance | null {
  return calculatorGuidance[slug] ?? null;
}
