import type { CalculatorCategory, CalculatorDefinition, CalculatorSlug } from "@/data/calculators";

export const lifeDecisionCalculatorSlugs = [
  "quit-job-calculator",
  "move-calculator",
  "get-married-calculator",
  "have-kids-calculator",
  "buy-a-house-readiness-calculator",
  "start-a-business-calculator",
  "go-back-to-school-calculator",
  "job-offer-calculator",
  "break-up-calculator",
  "retire-early-calculator"
] as const;

export type LifeDecisionCalculatorSlug = (typeof lifeDecisionCalculatorSlugs)[number];
export type DecisionFactorDimension = "practical" | "emotional" | "risk";

export interface DecisionFactorDefinition {
  id: string;
  label: string;
  description: string;
  dimension: DecisionFactorDimension;
}

export interface DecisionPresetDefinition {
  label: string;
  description: string;
  values: Record<string, string>;
}

export interface DecisionCalculatorConfig {
  slug: LifeDecisionCalculatorSlug;
  title: string;
  category: CalculatorCategory;
  optionALabel: string;
  optionBLabel: string;
  optionAHint: string;
  optionBHint: string;
  prompt: string;
  emptyStateTitle: string;
  emptyStateBody: string;
  insight: string;
  caution: string;
  searchTerms: string[];
  related: CalculatorSlug[];
  factors: DecisionFactorDefinition[];
  presets: DecisionPresetDefinition[];
}

type FactorSeed = [string, string, string, DecisionFactorDimension];

function preset(values: Record<string, [number, number, number]>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(values).flatMap(([id, [a, b, weight]]) => [
      [`${id}A`, `${a}`],
      [`${id}B`, `${b}`],
      [`${id}Weight`, `${weight}`]
    ])
  );
}

function factors(items: FactorSeed[]): DecisionFactorDefinition[] {
  return items.map(([id, label, description, dimension]) => ({ id, label, description, dimension }));
}

const configs = {
  "quit-job-calculator": {
    title: "Should I Quit My Job Calculator",
    category: "Income",
    optionALabel: "Quit this job",
    optionBLabel: "Stay for now",
    optionAHint: "Rate how well quitting serves each factor.",
    optionBHint: "Rate how well staying serves each factor.",
    prompt: "Score leaving versus staying across money, growth, burnout, and risk.",
    emptyStateTitle: "Build the job decision",
    emptyStateBody: "Set factor scores for quitting versus staying to see which path is stronger overall.",
    insight: "This works best when you score the current reality, not the best-case story for either option.",
    caution: "If the main issue is safety, harassment, discrimination, or severe burnout, use this as planning support rather than the final decision-maker.",
    searchTerms: ["should i quit my job calculator", "quit job decision tool", "leave job or stay calculator"],
    related: ["job-offer-calculator", "take-home-paycheck-calculator", "budget-calculator"],
    factors: factors([
      ["compensation", "Compensation", "Pay, benefits, and realistic income outlook.", "practical"],
      ["growth", "Career growth", "Skill growth and long-term upside.", "practical"],
      ["manager", "Manager and team", "Support, trust, and environment quality.", "emotional"],
      ["flexibility", "Flexibility", "Remote options, hours, and commute fit.", "practical"],
      ["stress", "Stress level", "Daily anxiety, dread, and emotional drag.", "emotional"],
      ["burnout", "Burnout risk", "Whether staying creates real recovery risk.", "risk"],
      ["runway", "Financial runway", "Savings buffer if you leave.", "risk"],
      ["jobmarket", "Job market confidence", "Chance of landing a better role soon.", "risk"]
    ]),
    presets: [
      { label: "Burned out but prepared", description: "High stress, real runway, better upside outside.", values: preset({ compensation: [6, 5, 4], growth: [8, 3, 5], manager: [8, 2, 5], flexibility: [7, 4, 4], stress: [9, 2, 5], burnout: [8, 2, 5], runway: [8, 6, 5], jobmarket: [7, 5, 4] }) },
      { label: "Need more runway", description: "The job is poor, but the exit plan is still thin.", values: preset({ compensation: [5, 6, 4], growth: [7, 4, 4], manager: [7, 3, 4], flexibility: [6, 5, 3], stress: [8, 3, 5], burnout: [7, 3, 5], runway: [3, 8, 5], jobmarket: [4, 6, 4] }) }
    ]
  },
  "move-calculator": {
    title: "Should I Move Calculator",
    category: "Everyday",
    optionALabel: "Make the move",
    optionBLabel: "Stay put",
    optionAHint: "Rate how well moving serves each factor.",
    optionBHint: "Rate how well staying serves each factor.",
    prompt: "Compare relocation upside against disruption, support loss, and practical risk.",
    emptyStateTitle: "Build the move decision",
    emptyStateBody: "Score the case for moving versus staying so the result reflects lifestyle upside and disruption risk.",
    insight: "Relocation decisions usually hinge on only a few variables, so the most important weights matter more than chasing a perfect total.",
    caution: "If the move is tied to immigration, legal custody, or medical care, use this as a reflection tool alongside professional advice.",
    searchTerms: ["should i move calculator", "move or stay calculator", "relocation decision calculator"],
    related: ["job-offer-calculator", "budget-calculator", "rent-vs-buy-calculator"],
    factors: factors([
      ["cost", "Cost of living", "Housing, taxes, transportation, and daily affordability.", "practical"],
      ["income", "Income upside", "Expected pay and future earnings.", "practical"],
      ["support", "Support system", "Family, friends, and practical backup.", "emotional"],
      ["fit", "Lifestyle fit", "Weather, pace, values, and day-to-day fit.", "emotional"],
      ["safety", "Safety", "Neighborhood comfort and stability.", "risk"],
      ["housing", "Housing quality", "What you can realistically afford and enjoy.", "practical"],
      ["career", "Career network", "Access to stronger opportunity.", "risk"],
      ["stress", "Transition stress", "The cost of uprooting everything.", "risk"]
    ]),
    presets: [
      { label: "Fresh start city", description: "Lifestyle and career fit improve, support gets weaker.", values: preset({ cost: [6, 7, 4], income: [8, 5, 4], support: [5, 8, 5], fit: [9, 5, 4], safety: [7, 6, 4], housing: [7, 5, 4], career: [8, 5, 4], stress: [4, 8, 3] }) },
      { label: "Move looks shaky", description: "Exciting move, but social and practical stability drop.", values: preset({ cost: [4, 8, 5], income: [6, 5, 4], support: [3, 9, 5], fit: [7, 5, 3], safety: [5, 7, 4], housing: [4, 7, 4], career: [6, 5, 3], stress: [3, 8, 4] }) }
    ]
  },
  "get-married-calculator": {
    title: "Should I Get Married Calculator",
    category: "Everyday",
    optionALabel: "Get married soon",
    optionBLabel: "Wait longer",
    optionAHint: "Rate how well marrying now fits each factor.",
    optionBHint: "Rate how well waiting fits each factor.",
    prompt: "Turn relationship readiness into a clearer conversation about alignment, trust, and timing.",
    emptyStateTitle: "Build the marriage decision",
    emptyStateBody: "Score marrying now versus waiting so you can see whether the relationship is truly ready.",
    insight: "This tool is strongest when both people answer the factors separately and compare where confidence diverges.",
    caution: "If there is coercion, abuse, or fear, slow down and prioritize safety.",
    searchTerms: ["should i get married calculator", "marriage readiness calculator", "marriage decision calculator"],
    related: ["have-kids-calculator", "break-up-calculator", "budget-calculator"],
    factors: factors([
      ["values", "Shared values", "Core beliefs and life design.", "emotional"],
      ["conflict", "Conflict repair", "How well you recover from hard conversations.", "risk"],
      ["trust", "Trust", "Reliability, honesty, and emotional safety.", "risk"],
      ["money", "Financial readiness", "Debt, planning style, and money transparency.", "practical"],
      ["goals", "Future goals", "Kids, location, career, and lifestyle alignment.", "practical"],
      ["family", "Family dynamics", "Pressure, boundaries, and external friction.", "risk"],
      ["joy", "Emotional connection", "Affection, friendship, and ease together.", "emotional"],
      ["timing", "Timing fit", "Whether life circumstances support a stable transition.", "practical"]
    ]),
    presets: [
      { label: "Strong foundation", description: "High trust and few unresolved structural issues.", values: preset({ values: [9, 6, 5], conflict: [8, 5, 5], trust: [9, 5, 5], money: [7, 6, 4], goals: [8, 5, 5], family: [7, 6, 3], joy: [9, 5, 5], timing: [8, 6, 4] }) },
      { label: "Good relationship, bad timing", description: "Healthy relationship, but money and logistics need time.", values: preset({ values: [8, 7, 5], conflict: [6, 7, 4], trust: [8, 7, 5], money: [4, 8, 5], goals: [6, 8, 5], family: [5, 7, 4], joy: [8, 7, 5], timing: [4, 9, 5] }) }
    ]
  },
  "have-kids-calculator": {
    title: "Should We Have Kids Calculator",
    category: "Everyday",
    optionALabel: "Have kids soon",
    optionBLabel: "Wait longer",
    optionAHint: "Rate how well having kids soon fits each factor.",
    optionBHint: "Rate how well waiting fits each factor.",
    prompt: "Score readiness across desire, support, money, and relationship stability.",
    emptyStateTitle: "Build the kids decision",
    emptyStateBody: "Set your factor scores to compare having kids soon versus waiting for more stability.",
    insight: "The useful signal is not just desire. Readiness usually depends on whether support, time, and money can absorb the load.",
    caution: "Fertility and health can carry medical urgency. Use this as structured reflection, not a medical recommendation.",
    searchTerms: ["should we have kids calculator", "have kids decision calculator", "parenthood readiness calculator"],
    related: ["get-married-calculator", "budget-calculator", "move-calculator"],
    factors: factors([
      ["desire", "Desire for kids", "How durable the desire really is.", "emotional"],
      ["relationship", "Relationship stability", "Trust and teamwork under stress.", "risk"],
      ["support", "Support system", "Family help and practical backup.", "risk"],
      ["money", "Financial capacity", "Cash flow and room for child-related costs.", "practical"],
      ["housing", "Housing fit", "Whether the current setup works for the next stage.", "practical"],
      ["health", "Health and timing", "Physical health and reproductive considerations.", "risk"],
      ["career", "Career flexibility", "Parental leave and workload fit.", "practical"],
      ["bandwidth", "Mental bandwidth", "Energy and patience for a large identity shift.", "emotional"]
    ]),
    presets: [
      { label: "Ready and supported", description: "Strong desire, stable partnership, enough practical support.", values: preset({ desire: [9, 4, 5], relationship: [8, 6, 5], support: [8, 5, 5], money: [7, 6, 4], housing: [8, 5, 4], health: [8, 6, 5], career: [7, 6, 3], bandwidth: [7, 6, 4] }) },
      { label: "Want kids, not yet", description: "High desire, but too many practical gaps for now.", values: preset({ desire: [8, 7, 5], relationship: [6, 8, 5], support: [4, 8, 4], money: [3, 9, 5], housing: [4, 8, 4], health: [6, 7, 5], career: [4, 8, 4], bandwidth: [4, 8, 5] }) }
    ]
  },
  "buy-a-house-readiness-calculator": {
    title: "Should I Buy a House Calculator",
    category: "Finance",
    optionALabel: "Buy a house",
    optionBLabel: "Keep waiting",
    optionAHint: "Rate how well buying now fits each factor.",
    optionBHint: "Rate how well waiting fits each factor.",
    prompt: "Go beyond mortgage math and score whether ownership actually fits your life.",
    emptyStateTitle: "Build the homebuying decision",
    emptyStateBody: "Score buying now versus waiting so the result reflects readiness, not just lender approval.",
    insight: "House decisions often look good on paper before maintenance risk, mobility, and cash-reserve strain are fully priced in.",
    caution: "Use this with the mortgage, affordability, and rent-vs-buy calculators. This tool measures readiness, not a lender decision.",
    searchTerms: ["should i buy a house calculator", "home buying readiness calculator", "buy house now or wait calculator"],
    related: ["mortgage-affordability-calculator", "mortgage-calculator", "rent-vs-buy-calculator"],
    factors: factors([
      ["stability", "Location stability", "How likely you are to stay long enough.", "risk"],
      ["cash", "Cash reserves", "Down payment, closing costs, and emergency buffer.", "risk"],
      ["payment", "Payment comfort", "Whether the monthly cost fits comfortably.", "practical"],
      ["maintenance", "Maintenance tolerance", "Ability to handle repairs and ownership friction.", "practical"],
      ["mobility", "Need for mobility", "Whether near-term flexibility still matters.", "risk"],
      ["ownership", "Ownership preference", "How much owning truly matters to you.", "emotional"],
      ["market", "Market confidence", "Comfort with prices, rates, and local conditions.", "risk"],
      ["space", "Current housing fit", "Whether the current setup is becoming a poor fit.", "emotional"]
    ]),
    presets: [
      { label: "Ready buyer", description: "Strong savings, stable timeline, real desire to own.", values: preset({ stability: [9, 4, 5], cash: [8, 5, 5], payment: [7, 6, 5], maintenance: [7, 6, 3], mobility: [8, 4, 4], ownership: [9, 4, 4], market: [7, 6, 3], space: [8, 5, 3] }) },
      { label: "Approval is not readiness", description: "Possible to buy, but cash and flexibility still favor waiting.", values: preset({ stability: [5, 8, 5], cash: [4, 9, 5], payment: [5, 8, 5], maintenance: [4, 7, 3], mobility: [3, 9, 4], ownership: [8, 5, 3], market: [4, 7, 3], space: [6, 6, 2] }) }
    ]
  },
  "start-a-business-calculator": {
    title: "Should I Start a Business Calculator",
    category: "Business",
    optionALabel: "Start the business",
    optionBLabel: "Validate more first",
    optionAHint: "Rate how well launching now fits each factor.",
    optionBHint: "Rate how well validating more fits each factor.",
    prompt: "Compare entrepreneurial upside against runway, proof of demand, and execution risk.",
    emptyStateTitle: "Build the business decision",
    emptyStateBody: "Score launching now versus validating more first so the result reflects ambition and execution reality.",
    insight: "Most bad launches are not caused by weak motivation. They fail because runway, proof, or focus was overestimated.",
    caution: "If the decision affects investors, employees, or heavy personal debt, pair this with a concrete financial plan.",
    searchTerms: ["should i start a business calculator", "business readiness calculator", "launch now or wait calculator"],
    related: ["break-even-calculator", "roi-calculator", "budget-calculator"],
    factors: factors([
      ["runway", "Financial runway", "Months of cash buffer if revenue is slow.", "risk"],
      ["proof", "Market proof", "Evidence that customers want the offer.", "risk"],
      ["skills", "Execution capability", "Sales, product, and operations strength.", "practical"],
      ["time", "Time capacity", "Whether you have the focus and hours.", "practical"],
      ["desire", "Founder motivation", "How durable the internal drive really is.", "emotional"],
      ["support", "Support system", "Whether the people affected by the risk support it.", "emotional"],
      ["debt", "Debt pressure", "How much fixed obligation reduces survivability.", "risk"],
      ["upside", "Strategic upside", "Why this opportunity beats keeping it on the side.", "practical"]
    ]),
    presets: [
      { label: "Validated and ready", description: "Demand is visible and the runway is good enough to launch.", values: preset({ runway: [8, 6, 5], proof: [9, 5, 5], skills: [8, 6, 4], time: [7, 6, 4], desire: [9, 5, 4], support: [8, 6, 4], debt: [7, 7, 4], upside: [9, 4, 5] }) },
      { label: "Excited but early", description: "You want it badly, but the business still needs proof and more buffer.", values: preset({ runway: [3, 9, 5], proof: [2, 9, 5], skills: [5, 7, 4], time: [4, 8, 4], desire: [9, 5, 4], support: [5, 7, 3], debt: [3, 9, 5], upside: [7, 6, 4] }) }
    ]
  },
  "go-back-to-school-calculator": {
    title: "Should I Go Back to School Calculator",
    category: "Income",
    optionALabel: "Go back to school",
    optionBLabel: "Hold off for now",
    optionAHint: "Rate how well school now fits each factor.",
    optionBHint: "Rate how well waiting fits each factor.",
    prompt: "Compare the career return, debt load, and life disruption behind another credential.",
    emptyStateTitle: "Build the school decision",
    emptyStateBody: "Score going back to school versus waiting so the result reflects both upside and disruption.",
    insight: "Education decisions improve when the path to payoff is concrete. Vague upside and high debt usually deserve a lower score.",
    caution: "Use this with actual program cost and earnings assumptions. This tool reflects readiness, not a guaranteed ROI.",
    searchTerms: ["should i go back to school calculator", "education decision calculator", "school readiness calculator"],
    related: ["salary-to-hourly-calculator", "tax-calculator", "job-offer-calculator"],
    factors: factors([
      ["career", "Career payoff", "Whether the credential opens materially better work.", "practical"],
      ["debt", "Debt tolerance", "How survivable the tuition burden would be.", "risk"],
      ["interest", "Real interest", "Whether you genuinely want the work, not just the idea.", "emotional"],
      ["time", "Time capacity", "Bandwidth to study without breaking the rest of life.", "risk"],
      ["income", "Lost-income impact", "Opportunity cost of stepping back from current earnings.", "practical"],
      ["urgency", "Need for the credential", "How necessary school really is for the next move.", "practical"],
      ["support", "Support system", "Childcare, partner support, and logistics.", "risk"],
      ["stamina", "Energy and focus", "Whether you can take on a long cognitive load right now.", "emotional"]
    ]),
    presets: [
      { label: "Clear credential payoff", description: "A degree or license is genuinely required for a better path.", values: preset({ career: [9, 4, 5], debt: [7, 6, 5], interest: [8, 6, 4], time: [7, 6, 4], income: [6, 7, 4], urgency: [9, 4, 5], support: [8, 6, 4], stamina: [7, 6, 3] }) },
      { label: "Dream is real, timing is off", description: "You want the path, but the debt and time tradeoffs still argue for waiting.", values: preset({ career: [7, 6, 4], debt: [3, 9, 5], interest: [9, 6, 4], time: [3, 9, 5], income: [4, 8, 4], urgency: [5, 7, 4], support: [4, 8, 4], stamina: [5, 7, 3] }) }
    ]
  },
  "job-offer-calculator": {
    title: "Should I Take This Job Offer Calculator",
    category: "Income",
    optionALabel: "Take the offer",
    optionBLabel: "Stay in current role",
    optionAHint: "Rate how well taking the offer fits each factor.",
    optionBHint: "Rate how well staying fits each factor.",
    prompt: "Compare compensation, growth, stress, and hidden tradeoffs so an offer is judged on the whole package.",
    emptyStateTitle: "Build the offer comparison",
    emptyStateBody: "Score taking the offer versus staying where you are so the result reflects what actually changes in daily life.",
    insight: "Offer decisions get distorted when salary dominates the whole score. Growth, manager quality, and stress should carry real weight too.",
    caution: "If you have multiple offers, use comparison mode to test how sensitive the decision is to one or two assumptions.",
    searchTerms: ["should i take this job offer calculator", "job offer decision calculator", "job offer comparison tool"],
    related: ["quit-job-calculator", "salary-to-hourly-calculator", "take-home-paycheck-calculator"],
    factors: factors([
      ["pay", "Total compensation", "Salary, bonus, equity, benefits, and reliable upside.", "practical"],
      ["takehome", "Take-home improvement", "What actually changes after taxes and costs.", "practical"],
      ["manager", "Manager quality", "Whether the new team is likely to develop you well.", "emotional"],
      ["growth", "Career growth", "Learning curve, visibility, and long-term path.", "practical"],
      ["flexibility", "Flexibility", "Remote work, schedule control, and time autonomy.", "emotional"],
      ["stress", "Stress and pace", "Expected strain and intensity.", "risk"],
      ["mission", "Mission alignment", "Whether the work feels meaningful enough to sustain effort.", "emotional"],
      ["risk", "Company stability", "Layoff risk and team churn.", "risk"]
    ]),
    presets: [
      { label: "Offer is better", description: "The new role wins on growth and pay without adding major downside.", values: preset({ pay: [9, 5, 5], takehome: [8, 5, 4], manager: [8, 5, 5], growth: [9, 5, 5], flexibility: [7, 6, 3], stress: [6, 6, 4], mission: [8, 5, 3], risk: [7, 6, 4] }) },
      { label: "Money up, quality down", description: "The offer pays more, but hidden costs make staying competitive.", values: preset({ pay: [8, 5, 5], takehome: [6, 5, 4], manager: [4, 8, 5], growth: [6, 7, 4], flexibility: [3, 9, 4], stress: [3, 8, 5], mission: [5, 7, 3], risk: [4, 7, 4] }) }
    ]
  },
  "break-up-calculator": {
    title: "Should I Break Up Calculator",
    category: "Everyday",
    optionALabel: "End the relationship",
    optionBLabel: "Keep working on it",
    optionAHint: "Rate how well ending the relationship fits each factor.",
    optionBHint: "Rate how well staying and working fits each factor.",
    prompt: "Turn a messy relationship question into a clearer review of trust, safety, future fit, and repair effort.",
    emptyStateTitle: "Build the relationship decision",
    emptyStateBody: "Score breaking up versus staying so the result reflects the whole pattern, not just one recent fight.",
    insight: "This is most useful when you score recurring patterns. Single great days and single terrible days both distort the decision.",
    caution: "If you feel unsafe, controlled, or afraid, treat safety as the priority. This tool should not soften obvious red flags.",
    searchTerms: ["should i break up calculator", "relationship decision calculator", "break up or stay tool"],
    related: ["get-married-calculator", "have-kids-calculator", "move-calculator"],
    factors: factors([
      ["trust", "Trust", "Reliability, honesty, and whether reality matches words.", "risk"],
      ["safety", "Emotional safety", "Whether you feel calm, respected, and able to be honest.", "risk"],
      ["communication", "Communication quality", "How conflict is handled and whether repair happens.", "practical"],
      ["future", "Future alignment", "Shared direction on commitment, money, and lifestyle.", "practical"],
      ["joy", "Daily joy", "Friendship, affection, and how the relationship feels to live inside.", "emotional"],
      ["repair", "Willingness to repair", "Whether both people are genuinely doing the work.", "risk"],
      ["support", "Support outside the relationship", "Whether you have emotional and practical support if you leave.", "risk"],
      ["clarity", "Inner clarity", "Whether deep down you already know the answer.", "emotional"]
    ]),
    presets: [
      { label: "Patterns are broken", description: "Trust and safety are weak enough that leaving is likely healthier.", values: preset({ trust: [9, 2, 5], safety: [9, 2, 5], communication: [8, 3, 4], future: [8, 3, 5], joy: [7, 3, 4], repair: [8, 2, 5], support: [7, 5, 4], clarity: [9, 3, 5] }) },
      { label: "Hard season, not over", description: "The relationship is strained, but repair still looks plausible.", values: preset({ trust: [4, 8, 5], safety: [5, 8, 5], communication: [5, 7, 4], future: [5, 7, 4], joy: [4, 7, 4], repair: [4, 8, 5], support: [6, 6, 3], clarity: [5, 7, 4] }) }
    ]
  },
  "retire-early-calculator": {
    title: "Should I Retire Early Calculator",
    category: "Finance",
    optionALabel: "Retire early",
    optionBLabel: "Keep working longer",
    optionAHint: "Rate how well retiring early fits each factor.",
    optionBHint: "Rate how well working longer fits each factor.",
    prompt: "Score the financial and identity tradeoffs behind early retirement instead of focusing on one savings number.",
    emptyStateTitle: "Build the retirement decision",
    emptyStateBody: "Score retiring early versus working longer so the result reflects both financial durability and lifestyle readiness.",
    insight: "Early retirement often fails emotionally before it fails mathematically. Purpose, healthcare, and spending discipline matter a lot.",
    caution: "Use this with your retirement projections. This tool reflects readiness and risk tolerance, not a withdrawal-rate calculation.",
    searchTerms: ["should i retire early calculator", "early retirement readiness calculator", "retire now or later calculator"],
    related: ["retirement-calculator", "net-worth-calculator", "inflation-calculator"],
    factors: factors([
      ["assets", "Asset readiness", "Whether your savings and investments look strong enough.", "practical"],
      ["spending", "Spending confidence", "How stable your spending is and whether it is tested honestly.", "risk"],
      ["healthcare", "Healthcare plan", "Coverage quality and affordability.", "risk"],
      ["purpose", "Sense of purpose", "Whether life after work has enough structure and meaning.", "emotional"],
      ["flexincome", "Flex income options", "Ability to work part-time or consult if needed.", "risk"],
      ["burnout", "Work burnout", "Whether staying longer materially harms wellbeing.", "emotional"],
      ["family", "Family readiness", "Whether the people affected by the change are aligned.", "emotional"],
      ["market", "Market-risk comfort", "Ability to tolerate volatility without panicking.", "risk"]
    ]),
    presets: [
      { label: "Financially and emotionally ready", description: "Savings, purpose, and optional income all support leaving work early.", values: preset({ assets: [9, 6, 5], spending: [8, 6, 5], healthcare: [7, 6, 5], purpose: [8, 5, 4], flexincome: [8, 6, 4], burnout: [9, 3, 4], family: [8, 6, 4], market: [7, 6, 4] }) },
      { label: "Money close, life not ready", description: "The math looks near, but the identity and risk picture still needs work.", values: preset({ assets: [7, 7, 5], spending: [5, 8, 5], healthcare: [4, 8, 5], purpose: [3, 8, 4], flexincome: [4, 8, 4], burnout: [7, 5, 3], family: [5, 7, 4], market: [4, 8, 5] }) }
    ]
  }
} as const;

export const decisionCalculatorConfigs = Object.fromEntries(
  Object.entries(configs).map(([slug, config]) => [slug, { ...config, slug }])
) as unknown as Record<LifeDecisionCalculatorSlug, DecisionCalculatorConfig>;

function makeFaqs(config: DecisionCalculatorConfig): CalculatorDefinition["faqs"] {
  return [
    {
      question: `How does ${config.title.toLowerCase()} work?`,
      answer: `It asks you to score ${config.optionALabel.toLowerCase()} versus ${config.optionBLabel.toLowerCase()} across weighted factors so the tradeoff is easier to see in one place.`
    },
    {
      question: "What should I pay the most attention to?",
      answer: `The highest-weight factors usually matter most. If those scores point in one direction, the decision often becomes clearer even when the overall result is close.`
    },
    {
      question: "Is this final advice?",
      answer: "No. It is a structured reflection tool that helps organize the decision and expose the biggest risks before you act."
    }
  ];
}

function makeExamples(config: DecisionCalculatorConfig): CalculatorDefinition["examples"] {
  return config.presets.slice(0, 2).map((presetItem) => ({
    title: presetItem.label,
    description: presetItem.description,
    outcome: `Use this preset as a starting point, then adjust the factor scores so the result matches your real situation.`
  }));
}

export const lifeDecisionCalculators: CalculatorDefinition[] = lifeDecisionCalculatorSlugs.map((slug) => {
  const config = decisionCalculatorConfigs[slug];
  const factorLabels = config.factors.slice(0, 3).map((factor) => factor.label.toLowerCase()).join(", ");

  return {
    slug,
    title: config.title,
    shortDescription: `${config.optionALabel} versus ${config.optionBLabel} across ${factorLabels}, and the biggest life-decision risks.`,
    intro: `${config.title} helps you compare two major paths in a more structured way than a gut check alone.`,
    detail: `${config.prompt} Score both options across weighted practical, emotional, and risk factors, then review the live recommendation, strongest signals, and comparison summary.`,
    category: config.category,
    searchTerms: config.searchTerms,
    features: ["Weighted decision factors", "Practical, emotional, and risk scoring", "Comparison mode for alternate scenarios"],
    faqs: makeFaqs(config),
    examples: makeExamples(config),
    related: config.related
  };
});



