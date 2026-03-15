import type { CalculatorDefinition, CalculatorSlug } from "@/data/calculators";

export interface SubtopicHubDefinition {
  slug: string;
  title: string;
  shortDescription: string;
  intro: string;
  guide: string;
  searchTerms: string[];
  slugs: CalculatorSlug[];
}

export const subtopicHubs: SubtopicHubDefinition[] = [
  {
    slug: "loan-calculators",
    title: "Loan Calculators",
    shortDescription: "Mortgage, personal loan, auto loan, payoff, and affordability calculators grouped into one borrowing hub.",
    intro: "This loan calculator hub groups the borrowing tools people usually need together: mortgage planning, personal loans, auto financing, debt payoff, and affordability checks.",
    guide: "The goal is to keep loan decisions inside one crawlable cluster so users can move from a payment estimate into payoff speed, debt ratios, down payment planning, and rent-versus-buy tradeoffs without going back to search.",
    searchTerms: ["loan calculators", "borrowing calculators", "mortgage and loan tools", "debt payoff calculators"],
    slugs: ["mortgage-calculator", "loan-calculator", "auto-loan-calculator", "credit-card-payoff-calculator", "debt-to-income-calculator", "down-payment-calculator", "rent-vs-buy-calculator"]
  },
  {
    slug: "investing-calculators",
    title: "Investing and Savings Calculators",
    shortDescription: "Return, compounding, savings-goal, inflation, and net-worth calculators for long-term planning.",
    intro: "This investing and savings hub brings together the calculators people use to plan growth, compare return scenarios, and keep long-term money goals realistic.",
    guide: "These tools are most useful when used together. Return and compounding explain growth, savings-goal planning turns that into a timeline, inflation keeps the assumptions realistic, and net worth gives the broader context behind the numbers.",
    searchTerms: ["investing calculators", "savings calculators", "compound interest tools", "inflation and ROI calculators"],
    slugs: ["roi-calculator", "compound-interest-calculator", "savings-goal-calculator", "inflation-calculator", "net-worth-calculator"]
  },
  {
    slug: "tax-and-income-calculators",
    title: "Tax and Income Calculators",
    shortDescription: "Salary, take-home pay, and tax estimators grouped for compensation and budgeting decisions.",
    intro: "This tax and income hub is for users comparing offers, checking take-home pay, and planning around taxes rather than looking at gross income in isolation.",
    guide: "Compensation decisions are rarely about one number. Grouping salary conversion, tax estimates, and related planning tools makes it easier to compare gross pay against actual usable income and downstream housing affordability.",
    searchTerms: ["tax calculators", "income calculators", "salary and take-home pay calculators", "paycheck planning tools"],
    slugs: ["salary-to-hourly-calculator", "tax-calculator", "debt-to-income-calculator", "mortgage-calculator"]
  }
];

export function getSubtopicHub(slug: string) {
  return subtopicHubs.find((hub) => hub.slug === slug);
}

export function getSubtopicCalculators(hub: SubtopicHubDefinition, calculators: CalculatorDefinition[]) {
  const map = new Map(calculators.map((calculator) => [calculator.slug, calculator]));
  return hub.slugs.map((slug) => map.get(slug)).filter(Boolean) as CalculatorDefinition[];
}
