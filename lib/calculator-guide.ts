import { calculators, type CalculatorSlug } from "@/data/calculators";
import { subtopicHubs } from "@/data/subtopic-hubs";

export interface CalculatorGuideIntent {
  id: string;
  title: string;
  promptExamples: string[];
  keywords: string[];
  calculatorSlugs: CalculatorSlug[];
  hubSlug?: string;
  followUp: string;
  fallbackSummary: string;
}

export const calculatorGuideIntents: CalculatorGuideIntent[] = [
  {
    id: "home-buying",
    title: "Home buying",
    promptExamples: ["I'm buying a home", "Can I afford this house?", "Help me compare mortgage options"],
    keywords: ["home", "house", "mortgage", "buying", "down payment", "rent vs buy", "afford"],
    calculatorSlugs: ["mortgage-affordability-calculator", "down-payment-calculator", "mortgage-calculator", "rent-vs-buy-calculator"],
    hubSlug: "loan-calculators",
    followUp: "Start with affordability, then check the down payment, monthly payment, and rent-versus-buy tradeoff.",
    fallbackSummary: "For home buying, the most useful path is affordability first, then down payment, then the mortgage payment itself, then rent-versus-buy if you are still deciding whether to purchase."
  },
  {
    id: "debt-payoff",
    title: "Debt payoff",
    promptExamples: ["I want to pay off debt", "How do I clear my credit cards faster?", "Help me plan debt repayment"],
    keywords: ["debt", "credit card", "payoff", "repayment", "interest", "minimum payment"],
    calculatorSlugs: ["debt-payoff-calculator", "credit-card-payoff-calculator", "budget-calculator", "debt-to-income-calculator"],
    hubSlug: "loan-calculators",
    followUp: "Use the payoff calculators first, then pressure-test the monthly budget and debt-to-income impact.",
    fallbackSummary: "For debt payoff, start by modeling payoff time and interest cost, then check whether your budget supports a faster payment strategy and how that debt load affects your overall finances."
  },
  {
    id: "job-offer",
    title: "Job offer comparison",
    promptExamples: ["I'm comparing job offers", "What will I actually take home?", "Convert this salary to hourly"],
    keywords: ["job", "offer", "salary", "paycheck", "take home", "hourly", "overtime", "income"],
    calculatorSlugs: ["salary-calculator", "take-home-paycheck-calculator", "salary-to-hourly-calculator", "hourly-paycheck-calculator"],
    hubSlug: "tax-and-income-calculators",
    followUp: "Compare gross salary first, then translate it into take-home pay and hourly reality.",
    fallbackSummary: "For job decisions, compare gross compensation first, then convert it into realistic take-home pay and hourly value so you are not comparing offers on headline salary alone."
  },
  {
    id: "saving-investing",
    title: "Saving and investing",
    promptExamples: ["I want to grow my savings", "How much will my investments grow?", "Help me plan retirement"],
    keywords: ["save", "savings", "invest", "investment", "retire", "retirement", "compound", "inflation", "net worth"],
    calculatorSlugs: ["compound-interest-calculator", "savings-goal-calculator", "retirement-calculator", "inflation-calculator"],
    hubSlug: "investing-calculators",
    followUp: "Model growth first, then check the savings pace needed, then adjust for inflation and retirement timelines.",
    fallbackSummary: "For long-term saving and investing, start with compounding, then test the monthly savings pace needed to hit your target, and finally adjust for inflation or retirement timing."
  },
  {
    id: "weight-loss",
    title: "Weight loss planning",
    promptExamples: ["I want to lose weight", "How many calories should I eat?", "Help me estimate maintenance calories"],
    keywords: ["weight", "lose", "fat", "calorie", "protein", "bmi", "tdee", "macro"],
    calculatorSlugs: ["calorie-calculator", "tdee-calculator", "bmi-calculator", "protein-intake-calculator"],
    hubSlug: "health-calculators",
    followUp: "Estimate maintenance first, then set a calorie target, then use BMI and protein intake for extra context.",
    fallbackSummary: "For weight-loss planning, start with maintenance calories, then set a practical calorie target, and use BMI or protein intake as supporting context rather than the main decision."
  },
  {
    id: "pregnancy",
    title: "Pregnancy and fertility",
    promptExamples: ["When is my due date?", "Help me estimate ovulation", "I need fertility timing tools"],
    keywords: ["pregnancy", "due date", "ovulation", "fertility", "cycle", "period"],
    calculatorSlugs: ["pregnancy-due-date-calculator", "ovulation-calculator"],
    hubSlug: "pregnancy-and-fertility-calculators",
    followUp: "Use due date for pregnancy timeline estimates and ovulation for cycle-based planning.",
    fallbackSummary: "For pregnancy and fertility timing, use the due-date and ovulation tools together so cycle planning and pregnancy-date estimates stay in the same flow."
  },
  {
    id: "business-pricing",
    title: "Business pricing",
    promptExamples: ["How should I price this?", "What's my margin?", "Help me model commission and break-even"],
    keywords: ["business", "price", "pricing", "margin", "markup", "commission", "break even", "profit"],
    calculatorSlugs: ["margin-calculator", "markup-calculator", "break-even-calculator", "commission-calculator"],
    hubSlug: "business-calculators",
    followUp: "Start with margin or markup, then check break-even or commissions if the pricing decision affects revenue targets.",
    fallbackSummary: "For pricing decisions, start with margin and markup, then check break-even or commission impact so the final number works operationally, not just mathematically."
  },
  {
    id: "conversion",
    title: "Conversions and utility",
    promptExamples: ["Convert units for me", "I need a time-zone calculator", "Help with date and time math"],
    keywords: ["convert", "conversion", "unit", "length", "weight", "temperature", "speed", "time zone", "date", "duration"],
    calculatorSlugs: ["unit-converter", "time-zone-converter", "date-difference-calculator", "time-duration-calculator"],
    hubSlug: "conversion-calculators",
    followUp: "Choose the conversion tool first, then use date or time tools if the task is schedule-based instead of measurement-based.",
    fallbackSummary: "For utility tasks, pick the converter or date-and-time tool that matches the exact input type so you do not bounce between unrelated calculators."
  }
];

export function findCalculatorGuideIntent(input: string) {
  const normalized = input.trim().toLowerCase();
  if (!normalized) {
    return null;
  }

  let bestIntent: CalculatorGuideIntent | null = null;
  let bestScore = 0;

  for (const intent of calculatorGuideIntents) {
    const score = intent.keywords.reduce((sum, keyword) => sum + (normalized.includes(keyword) ? 1 : 0), 0);
    if (score > bestScore) {
      bestIntent = intent;
      bestScore = score;
    }
  }

  return bestScore > 0 ? bestIntent : null;
}

export function buildCalculatorGuideResult(input: string) {
  const intent = findCalculatorGuideIntent(input);
  const normalized = input.trim().toLowerCase();

  if (intent) {
    const recommendedCalculators = intent.calculatorSlugs
      .map((slug) => calculators.find((calculator) => calculator.slug === slug))
      .filter((calculator): calculator is typeof calculators[number] => Boolean(calculator));
    const hub = intent.hubSlug ? subtopicHubs.find((item) => item.slug === intent.hubSlug) : null;

    return {
      title: intent.title,
      summary: intent.fallbackSummary,
      followUp: intent.followUp,
      recommendedCalculators,
      recommendedHub: hub ?? null,
      promptExamples: intent.promptExamples,
      intentId: intent.id
    };
  }

  const recommendedCalculators = calculators
    .filter((calculator) =>
      [calculator.title, calculator.shortDescription, calculator.category, ...calculator.searchTerms]
        .join(" ")
        .toLowerCase()
        .includes(normalized)
    )
    .slice(0, 4);

  return {
    title: "Suggested calculators",
    summary:
      recommendedCalculators.length > 0
        ? "Here are the calculators that look closest to your request. Start with the best match, then use the related tools if the decision branches into budgeting, payoff, or planning."
        : "I could not match that cleanly to one path yet. Try describing the decision in plain language, such as buying a home, paying off debt, comparing job offers, or losing weight.",
    followUp:
      recommendedCalculators.length > 0
        ? "If none of these are quite right, try being more specific about the decision instead of the formula."
        : "Examples: I am buying a home, I want to pay off debt, I am comparing job offers, or I want to grow my savings.",
    recommendedCalculators,
    recommendedHub: null,
    promptExamples: calculatorGuideIntents.flatMap((intent) => intent.promptExamples).slice(0, 4),
    intentId: null
  };
}
