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
    slugs: ["mortgage-calculator", "mortgage-affordability-calculator", "loan-calculator", "interest-calculator", "auto-loan-calculator", "credit-card-payoff-calculator", "debt-payoff-calculator", "debt-to-income-calculator", "down-payment-calculator", "rent-vs-buy-calculator"]
  },
  {
    slug: "investing-calculators",
    title: "Investing and Savings Calculators",
    shortDescription: "Return, compounding, savings-goal, inflation, and net-worth calculators for long-term planning.",
    intro: "This investing and savings hub brings together the calculators people use to plan growth, compare return scenarios, and keep long-term money goals realistic.",
    guide: "These tools are most useful when used together. Return and compounding explain growth, savings-goal planning turns that into a timeline, inflation keeps the assumptions realistic, and net worth gives the broader context behind the numbers.",
    searchTerms: ["investing calculators", "savings calculators", "compound interest tools", "inflation and ROI calculators"],
    slugs: ["roi-calculator", "investment-calculator", "compound-interest-calculator", "retirement-calculator", "savings-calculator", "inflation-calculator", "net-worth-calculator"]
  },
  {
    slug: "tax-and-income-calculators",
    title: "Tax and Income Calculators",
    shortDescription: "Salary, take-home pay, and tax estimators grouped for compensation and budgeting decisions.",
    intro: "This tax and income hub is for users comparing offers, checking take-home pay, and planning around taxes rather than looking at gross income in isolation.",
    guide: "Compensation decisions are rarely about one number. Grouping salary conversion, tax estimates, and related planning tools makes it easier to compare gross pay against actual usable income and downstream housing affordability.",
    searchTerms: ["tax calculators", "income calculators", "salary and take-home pay calculators", "paycheck planning tools"],
    slugs: ["salary-calculator", "salary-to-hourly-calculator", "take-home-paycheck-calculator", "hourly-paycheck-calculator", "overtime-calculator", "tax-calculator", "sales-tax-calculator", "budget-calculator", "debt-to-income-calculator", "mortgage-affordability-calculator", "mortgage-calculator"]
  },
  {
    slug: "date-and-time-calculators",
    title: "Date and Time Calculators",
    shortDescription: "Age, date-difference, duration, and time-zone tools grouped for schedules and planning.",
    intro: "This date and time calculator hub pulls together the pages people use for birthdays, deadlines, elapsed time, and cross-time-zone planning.",
    guide: "These are high-repeat-use utility tools. Grouping them together helps users move from one scheduling or date-counting question into the next without leaving the same problem cluster.",
    searchTerms: ["date calculators", "time calculators", "date and time tools", "age and time difference calculators"],
    slugs: ["age-calculator", "date-difference-calculator", "time-duration-calculator", "time-zone-converter"]
  },
  {
    slug: "conversion-calculators",
    title: "Conversion Calculators",
    shortDescription: "Unit, speed, length, weight, and temperature converters grouped into one utility hub.",
    intro: "This conversion hub groups the calculators people use when they need to switch between measurement systems quickly on mobile or desktop.",
    guide: "Converters work best as a cluster because users often move between adjacent unit tasks during the same session, from temperature and weight to length and speed comparisons.",
    searchTerms: ["conversion calculators", "unit converters", "measurement converters", "speed and temperature converters"],
    slugs: ["unit-converter", "length-converter", "weight-converter", "speed-converter", "temperature-converter"]
  },
  {
    slug: "pregnancy-and-fertility-calculators",
    title: "Pregnancy and Fertility Calculators",
    shortDescription: "Due-date and ovulation calculators grouped for pregnancy timing and cycle planning.",
    intro: "This pregnancy and fertility hub groups cycle-based timing tools so users can move between ovulation timing and due-date estimates from one page cluster.",
    guide: "These tools are most useful when treated as planning estimates rather than clinical answers. Grouping them helps users compare cycle timing, fertile windows, and pregnancy-date assumptions more clearly.",
    searchTerms: ["pregnancy calculators", "fertility calculators", "due date calculator", "ovulation calculator"],
    slugs: ["pregnancy-due-date-calculator", "ovulation-calculator"]
  },
  {
    slug: "fitness-performance-calculators",
    title: "Fitness Performance Calculators",
    shortDescription: "Running, heart-rate, steps, sleep, and strength tools grouped for repeat training use.",
    intro: "This fitness performance hub brings together the calculators people use to plan training intensity, recovery, pace, and daily movement.",
    guide: "These tools are more useful together than in isolation. Pace, heart-rate zones, steps, sleep timing, and strength estimates all become easier to apply when users can move through the same training cluster in one session.",
    searchTerms: ["fitness calculators", "running calculators", "heart rate zone calculator", "training tools"],
    slugs: ["running-pace-calculator", "heart-rate-zone-calculator", "steps-to-calories-calculator", "sleep-cycle-calculator", "one-rep-max-calculator"]
  }
];

export function getSubtopicHub(slug: string) {
  return subtopicHubs.find((hub) => hub.slug === slug);
}

export function getSubtopicCalculators(hub: SubtopicHubDefinition, calculators: CalculatorDefinition[]) {
  const map = new Map(calculators.map((calculator) => [calculator.slug, calculator]));
  return hub.slugs.map((slug) => map.get(slug)).filter(Boolean) as CalculatorDefinition[];
}
