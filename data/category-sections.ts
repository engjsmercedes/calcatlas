import type { CalculatorCategory, CalculatorDefinition, CalculatorSlug } from "@/data/calculators";

interface CategorySectionDefinition {
  title: string;
  description: string;
  slugs: CalculatorSlug[];
}

export const categorySections: Record<CalculatorCategory, CategorySectionDefinition[]> = {
  Finance: [
    {
      title: "Home buying and housing",
      description: "Mortgage planning, affordability, and rent-versus-buy decisions.",
      slugs: ["mortgage-calculator", "mortgage-affordability-calculator", "down-payment-calculator", "debt-to-income-calculator", "rent-vs-buy-calculator"]
    },
    {
      title: "Debt and borrowing",
      description: "Loan, auto loan, and credit payoff tools for financing decisions.",
      slugs: ["loan-calculator", "interest-calculator", "auto-loan-calculator", "credit-card-payoff-calculator", "debt-payoff-calculator", "tax-calculator"]
    },
    {
      title: "Investing and savings",
      description: "Return, compounding, savings goals, inflation, and net-worth planning.",
      slugs: ["roi-calculator", "investment-calculator", "compound-interest-calculator", "retirement-calculator", "savings-calculator", "inflation-calculator", "net-worth-calculator"]
    }
  ],
  Business: [
    {
      title: "Pricing and profitability",
      description: "Quick unit-economics tools for margins, markup, and return decisions.",
      slugs: ["margin-calculator", "markup-calculator", "break-even-calculator", "commission-calculator", "sales-tax-calculator", "budget-calculator"]
    }
  ],
  Income: [
    {
      title: "Compensation and take-home pay",
      description: "Tools for salary comparisons, tax estimates, and pay planning.",
      slugs: ["salary-calculator", "salary-to-hourly-calculator", "take-home-paycheck-calculator", "hourly-paycheck-calculator", "overtime-calculator"]
    }
  ],
  Health: [
    {
      title: "Body composition",
      description: "Weight, BMI, body-fat, and healthy-range screening tools.",
      slugs: ["bmi-calculator", "bmr-calculator", "body-fat-calculator", "ideal-weight-calculator"]
    },
    {
      title: "Nutrition and hydration",
      description: "Calorie, TDEE, macro, protein, and water-intake planning tools.",
      slugs: ["calorie-calculator", "calorie-needs-calculator", "tdee-calculator", "macro-calculator", "protein-intake-calculator", "water-intake-calculator"]
    },
    {
      title: "Recovery and performance",
      description: "Sleep, running, heart-rate, steps, and strength calculators for repeat training use.",
      slugs: ["sleep-cycle-calculator", "running-pace-calculator", "heart-rate-zone-calculator", "steps-to-calories-calculator", "one-rep-max-calculator"]
    },
    {
      title: "Cycle and pregnancy planning",
      description: "Ovulation and due-date estimates for timing and planning context.",
      slugs: ["pregnancy-due-date-calculator", "ovulation-calculator"]
    }
  ],
  Everyday: [
    {
      title: "Percentages and shopping",
      description: "Fast everyday math for discounts, tips, and percentages.",
      slugs: ["percentage-calculator", "discount-calculator", "tip-calculator"]
    },
    {
      title: "Date and time",
      description: "Age, date-gap, time-duration, and cross-time-zone tools for planning and schedules.",
      slugs: ["age-calculator", "date-difference-calculator", "time-duration-calculator", "time-zone-converter"]
    },
    {
      title: "Converters and units",
      description: "Fast everyday converters for length, weight, speed, temperature, and mixed unit checks.",
      slugs: ["unit-converter", "length-converter", "weight-converter", "speed-converter", "temperature-converter"]
    }
  ]
};

export function buildCategorySections(category: CalculatorCategory, calculators: CalculatorDefinition[]) {
  const map = new Map(calculators.map((calculator) => [calculator.slug, calculator]));

  return categorySections[category]
    .map((section) => ({
      ...section,
      calculators: section.slugs.map((slug) => map.get(slug)).filter(Boolean) as CalculatorDefinition[]
    }))
    .filter((section) => section.calculators.length > 0);
}
