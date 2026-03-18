import {
  calculatorCategoryDetails,
  calculators,
  calculatorMap,
  getRelatedCalculators,
  type CalculatorDefinition,
  type CalculatorSlug
} from "@/data/calculators";
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

const stopWords = new Set([
  "a",
  "an",
  "and",
  "are",
  "at",
  "be",
  "by",
  "for",
  "from",
  "get",
  "help",
  "how",
  "i",
  "im",
  "i'm",
  "in",
  "is",
  "it",
  "me",
  "my",
  "of",
  "on",
  "or",
  "the",
  "this",
  "to",
  "want",
  "with"
]);

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function tokenize(value: string) {
  return normalizeText(value)
    .split(" ")
    .filter((token) => token.length > 2 && !stopWords.has(token));
}

function phraseScore(query: string, text: string, weight: number) {
  if (!query || !text) {
    return 0;
  }

  return text.includes(query) ? weight : 0;
}

function tokenScore(tokens: string[], text: string, weight: number) {
  if (tokens.length === 0 || !text) {
    return 0;
  }

  return tokens.reduce((sum, token) => sum + (text.includes(token) ? weight : 0), 0);
}

function scoreIntent(query: string, tokens: string[], intent: CalculatorGuideIntent) {
  const keywordText = normalizeText(intent.keywords.join(" "));
  return phraseScore(query, keywordText, 8) + tokenScore(tokens, keywordText, 4);
}

function scoreCalculator(query: string, tokens: string[], calculator: CalculatorDefinition) {
  const title = normalizeText(calculator.title);
  const shortDescription = normalizeText(calculator.shortDescription);
  const searchTerms = normalizeText(calculator.searchTerms.join(" "));
  const examples = normalizeText(calculator.examples.map((example) => `${example.title} ${example.description} ${example.outcome}`).join(" "));
  const detail = normalizeText(`${calculator.intro} ${calculator.detail}`);
  const features = normalizeText(calculator.features.join(" "));
  const category = normalizeText(calculator.category);

  return (
    phraseScore(query, title, 14) +
    tokenScore(tokens, title, 6) +
    phraseScore(query, searchTerms, 12) +
    tokenScore(tokens, searchTerms, 5) +
    phraseScore(query, shortDescription, 8) +
    tokenScore(tokens, shortDescription, 3) +
    tokenScore(tokens, examples, 2) +
    tokenScore(tokens, detail, 1) +
    tokenScore(tokens, features, 1) +
    tokenScore(tokens, category, 1)
  );
}

function getIntentMatch(query: string, tokens: string[]) {
  let bestIntent: CalculatorGuideIntent | null = null;
  let bestScore = 0;

  for (const intent of calculatorGuideIntents) {
    const score = scoreIntent(query, tokens, intent);
    if (score > bestScore) {
      bestIntent = intent;
      bestScore = score;
    }
  }

  return bestScore >= 4 ? bestIntent : null;
}

function getHubScore(query: string, tokens: string[], slugSet: Set<CalculatorSlug>) {
  return subtopicHubs
    .map((hub) => {
      const matchedCount = hub.slugs.filter((slug) => slugSet.has(slug)).length;
      const hubText = normalizeText(`${hub.title} ${hub.shortDescription} ${hub.intro} ${hub.guide} ${hub.searchTerms.join(" ")}`);
      const score = matchedCount * 5 + phraseScore(query, hubText, 5) + tokenScore(tokens, hubText, 2);
      return { hub, score };
    })
    .sort((a, b) => b.score - a.score)[0];
}

function uniqueCalculators(items: CalculatorDefinition[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.slug)) {
      return false;
    }
    seen.add(item.slug);
    return true;
  });
}

export function buildCalculatorGuideResult(input: string) {
  const query = normalizeText(input);
  const tokens = tokenize(input);
  const matchedIntent = getIntentMatch(query, tokens);

  const scored = calculators
    .map((calculator) => ({ calculator, score: scoreCalculator(query, tokens, calculator) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  const topDirect = scored.slice(0, 4).map((item) => item.calculator);

  const intentCalculators = matchedIntent
    ? matchedIntent.calculatorSlugs
        .map((slug) => calculatorMap[slug])
        .filter((calculator): calculator is CalculatorDefinition => Boolean(calculator))
    : [];

  const relatedCalculators = uniqueCalculators(
    [...intentCalculators, ...topDirect]
      .slice(0, 3)
      .flatMap((calculator) => getRelatedCalculators(calculator.related).slice(0, 2))
  );

  const recommendedCalculators = uniqueCalculators([...intentCalculators, ...topDirect, ...relatedCalculators]).slice(0, 5);
  const slugSet = new Set(recommendedCalculators.map((calculator) => calculator.slug));
  const bestHub = matchedIntent?.hubSlug
    ? subtopicHubs.find((hub) => hub.slug === matchedIntent.hubSlug) ?? null
    : getHubScore(query, tokens, slugSet)?.score ? getHubScore(query, tokens, slugSet).hub : null;

  const leadCalculator = recommendedCalculators[0] ?? null;
  const title = matchedIntent?.title || leadCalculator?.title || "Suggested calculators";
  const summary = matchedIntent?.fallbackSummary ||
    (leadCalculator
      ? `${leadCalculator.title} looks like the closest match, and the related tools below cover the next decisions people usually make after that first calculation.`
      : "Describe the real decision in plain language and Calc Atlas will route you into the right calculators and related tools.");

  const followUp = matchedIntent?.followUp ||
    (leadCalculator
      ? `Start with ${leadCalculator.title}, then use the related calculators to pressure-test the scenario from a second angle.`
      : "Examples: I am buying a home, I want to pay off debt, I am comparing job offers, I want to grow my savings, or I need to convert units.");

  const promptExamples = matchedIntent?.promptExamples || calculatorGuideIntents.flatMap((intent) => intent.promptExamples).slice(0, 6);
  const categoryDetail = leadCalculator ? calculatorCategoryDetails[leadCalculator.category] : null;

  return {
    title,
    summary,
    followUp,
    recommendedCalculators,
    recommendedHub: bestHub,
    promptExamples,
    intentId: matchedIntent?.id ?? null,
    leadCategory: categoryDetail ?? null
  };
}
