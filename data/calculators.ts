export type CalculatorSlug =
  | "percentage-calculator"
  | "margin-calculator"
  | "mortgage-calculator"
  | "roi-calculator"
  | "compound-interest-calculator"
  | "salary-to-hourly-calculator"
  | "bmi-calculator"
  | "calorie-needs-calculator"
  | "body-fat-calculator"
  | "water-intake-calculator"
  | "ideal-weight-calculator"
  | "macro-calculator"
  | "protein-intake-calculator"
  | "sleep-cycle-calculator"
  | "running-pace-calculator"
  | "one-rep-max-calculator";

export type CalculatorCategory = "Finance" | "Business" | "Income" | "Everyday" | "Health";

export interface CalculatorFaq {
  question: string;
  answer: string;
}

export interface CalculatorExample {
  title: string;
  description: string;
  outcome: string;
}

export interface CalculatorDefinition {
  slug: CalculatorSlug;
  title: string;
  shortDescription: string;
  intro: string;
  detail: string;
  category: CalculatorCategory;
  searchTerms: string[];
  features: string[];
  faqs: CalculatorFaq[];
  examples: CalculatorExample[];
  related: CalculatorSlug[];
}

export const calculators: CalculatorDefinition[] = [
  {
    slug: "percentage-calculator",
    title: "Percentage Calculator",
    shortDescription: "Handle percentage of a number, percent-of, and increase or decrease in one place.",
    intro: "Use this percentage calculator to answer the most common percentage questions without switching between different tools.",
    detail: "Choose a mode for percentage of a number, what percent one number is of another, or percentage change. Results update instantly and can be shared through the URL.",
    category: "Everyday",
    searchTerms: ["percent calculator", "percentage increase calculator", "what percent"],
    features: ["Three calculation modes", "Live result cards", "Shareable result URLs"],
    faqs: [
      { question: "How do I calculate a percentage of a number?", answer: "Multiply the number by the percentage as a decimal. This calculator does that instantly and shows the result in plain language." },
      { question: "How do I find what percent one number is of another?", answer: "Divide the first number by the second and multiply by 100. Enter the part and the total in percent-of mode." },
      { question: "How is percentage change calculated?", answer: "Percentage change is the difference between the new and original values, divided by the original value, multiplied by 100." }
    ],
    examples: [
      { title: "Tip calculation", description: "Find 18% of a $64 restaurant bill.", outcome: "18% of 64 is 11.52." },
      { title: "Traffic growth", description: "Measure a move from 8,000 monthly visits to 10,000.", outcome: "That is a 25% increase." }
    ],
    related: ["margin-calculator", "mortgage-calculator"]
  },
  {
    slug: "margin-calculator",
    title: "Margin Calculator",
    shortDescription: "Work backward from cost, price, margin, markup, or profit to plan healthier pricing.",
    intro: "This margin calculator helps you price products faster by solving the missing business metric when you already know two compatible inputs.",
    detail: "Enter any two compatible fields such as cost and margin or price and markup. The calculator derives selling price, profit, gross margin, and markup percentage in real time.",
    category: "Business",
    searchTerms: ["gross margin calculator", "markup calculator", "profit margin formula"],
    features: ["Solves missing pricing fields", "Margin and markup together", "Validation for impossible combinations"],
    faqs: [
      { question: "What is the difference between margin and markup?", answer: "Margin is profit divided by selling price. Markup is profit divided by cost. They describe the same profit from different reference points." },
      { question: "Can I calculate price from cost and target margin?", answer: "Yes. Enter cost and margin and the calculator will derive the selling price needed to hit that margin." },
      { question: "Why is my margin lower than my markup?", answer: "Margin uses selling price as the denominator, so it is usually lower than markup for the same product." }
    ],
    examples: [
      { title: "Retail pricing", description: "A product costs $40 and you want a 35% margin.", outcome: "You need a selling price of about $61.54." },
      { title: "Profit check", description: "An item costs $120 and sells for $180.", outcome: "Profit is $60, margin is 33.33%, and markup is 50%." }
    ],
    related: ["roi-calculator", "percentage-calculator"]
  },
  {
    slug: "mortgage-calculator",
    title: "Mortgage Calculator",
    shortDescription: "Estimate monthly mortgage payment, total interest, and long-term loan cost with taxes and insurance.",
    intro: "Use this mortgage calculator to estimate an all-in monthly payment and understand how much interest you could pay over the life of the loan.",
    detail: "Enter loan amount, mortgage rate, loan term, and optional property tax, insurance, and HOA costs. Results update live and include a chart showing balance payoff over time.",
    category: "Finance",
    searchTerms: ["home loan calculator", "monthly mortgage payment", "mortgage payment calculator"],
    features: ["Monthly payment estimate", "Taxes, insurance, and HOA", "Balance payoff chart"],
    faqs: [
      { question: "What is included in the mortgage payment?", answer: "This calculator shows principal and interest plus optional property tax, homeowners insurance, and HOA dues so you can estimate a fuller monthly payment." },
      { question: "Why is total interest so high on a 30-year mortgage?", answer: "Longer loan terms lower the monthly payment, but they usually increase the total interest paid because the balance stays outstanding for longer." },
      { question: "Can I use this for refinance comparisons?", answer: "Yes. Change the rate, term, or loan amount to compare how a refinance scenario affects monthly payment and total interest." }
    ],
    examples: [
      { title: "Home purchase planning", description: "Estimate payment on a $400,000 loan at 6.5% over 30 years with taxes and insurance.", outcome: "You can separate principal and interest from the full monthly housing payment." },
      { title: "Refinance check", description: "Compare a shorter term at a lower rate against the current mortgage.", outcome: "The monthly payment may rise while total interest drops significantly." }
    ],
    related: ["salary-to-hourly-calculator", "compound-interest-calculator"]
  },
  {
    slug: "roi-calculator",
    title: "ROI Calculator",
    shortDescription: "Estimate return on investment, gain or loss, and annualized ROI from a single screen.",
    intro: "Use this ROI calculator to measure whether a project, campaign, or investment is earning enough relative to what you put in.",
    detail: "Enter an initial investment and either a final value or a gain/loss amount. Add years held to estimate annualized ROI for cleaner comparisons across opportunities.",
    category: "Finance",
    searchTerms: ["return on investment calculator", "annualized roi", "investment return"],
    features: ["Final value or gain/loss mode", "Annualized ROI", "Plain-language insights"],
    faqs: [
      { question: "What does ROI mean?", answer: "ROI means return on investment. It compares your gain or loss to the original amount invested." },
      { question: "Why use annualized ROI?", answer: "Annualized ROI helps compare investments held for different lengths of time by converting returns into an average yearly rate." },
      { question: "Can ROI be negative?", answer: "Yes. If the final value is lower than the initial investment, your gain is negative and your ROI is negative too." }
    ],
    examples: [
      { title: "Campaign performance", description: "Spend $5,000 and generate $8,000 in value.", outcome: "Gain is $3,000 and ROI is 60%." },
      { title: "Three-year investment", description: "Invest $10,000 and end at $14,500 after 3 years.", outcome: "ROI is 45% and annualized ROI is about 13.18%." }
    ],
    related: ["compound-interest-calculator", "margin-calculator"]
  },
  {
    slug: "compound-interest-calculator",
    title: "Compound Interest Calculator",
    shortDescription: "Project long-term balance growth with recurring contributions and a clean visual chart.",
    intro: "This compound interest calculator shows how an initial balance and ongoing contributions could grow over time with compounding.",
    detail: "Model recurring contributions, adjust rate and compounding frequency, and compare projected balance against the cash you put in. The chart makes the growth curve easy to scan.",
    category: "Finance",
    searchTerms: ["investment growth calculator", "compound interest chart", "future value calculator"],
    features: ["Recurring contributions", "Growth chart", "Comparison against total cash invested"],
    faqs: [
      { question: "Why does compound interest matter?", answer: "Compound interest lets returns earn returns over time, which can meaningfully accelerate growth on long time horizons." },
      { question: "What is the difference between contributions and interest?", answer: "Contributions are the money you add yourself. Interest is the extra growth generated by the account or investment." },
      { question: "Does compounding frequency change the result?", answer: "Yes. More frequent compounding can slightly increase the final balance, especially over longer periods." }
    ],
    examples: [
      { title: "Retirement habit", description: "Start with $10,000, add $500 monthly, earn 7% for 20 years.", outcome: "The balance can grow far beyond total contributions because compounding keeps stacking." },
      { title: "Slow and steady", description: "Start with $2,500, add $100 monthly, earn 5% for 10 years.", outcome: "Even modest recurring contributions can add up once growth compounds." }
    ],
    related: ["roi-calculator", "mortgage-calculator"]
  },
  {
    slug: "salary-to-hourly-calculator",
    title: "Salary to Hourly Calculator",
    shortDescription: "Convert salary to hourly pay and estimate take-home pay with country, state, tax, and deduction assumptions.",
    intro: "This salary to hourly calculator now goes beyond gross conversion by helping you compare job offers using estimated take-home pay, taxes, and deductions.",
    detail: "Switch between salary-to-hourly and hourly-to-salary, then add country, US state tax assumptions, filing status, retirement contributions, bonus pay, and other deductions for a more realistic paycheck estimate.",
    category: "Income",
    searchTerms: ["salary to hourly", "hourly to salary", "take home pay calculator", "salary after tax calculator"],
    features: ["Gross and net pay views", "Country and state tax assumptions", "Deduction visualization"],
    faqs: [
      { question: "Does this calculator include taxes?", answer: "Yes. It now estimates take-home pay using country-level assumptions and optional US state tax assumptions, along with payroll taxes, retirement contributions, and other deductions." },
      { question: "Can I compare gross pay versus net pay?", answer: "Yes. The calculator shows gross and net hourly, monthly, and annual pay so you can compare offers more realistically." },
      { question: "Are the tax estimates exact?", answer: "No calculator can replace payroll or tax software for exact withholding. This tool is designed for high-quality planning estimates so job, freelance, and relocation decisions are easier." }
    ],
    examples: [
      { title: "Job offer comparison", description: "Compare a $175,000 salary in California with bonus, retirement contributions, and insurance deductions.", outcome: "You can see both gross hourly value and a much more realistic monthly take-home estimate." },
      { title: "Freelance rate planning", description: "Convert an hourly rate into annual gross pay, then pressure-test the result against deductions and tax assumptions.", outcome: "This makes it easier to spot whether an advertised rate actually supports your target take-home income." }
    ],
    related: ["mortgage-calculator", "compound-interest-calculator"]
  },
  {
    slug: "bmi-calculator",
    title: "BMI Calculator",
    shortDescription: "Calculate BMI, healthy-weight range, and a simple interpretation using imperial or metric units.",
    intro: "This BMI calculator gives you a fast body-mass index reading plus a healthy-weight range for your height.",
    detail: "Enter height and weight in imperial or metric units to calculate BMI instantly, see the standard BMI category, and view a healthy-weight range for the entered height.",
    category: "Health",
    searchTerms: ["body mass index", "healthy weight range", "bmi chart"],
    features: ["Imperial and metric", "Healthy-weight range", "Plain-language category"],
    faqs: [
      { question: "What does BMI measure?", answer: "BMI estimates body size relative to height and is commonly used as a screening tool for weight categories." },
      { question: "Does BMI account for muscle mass?", answer: "No. Very muscular people can have a higher BMI without having excess body fat, so BMI is best used as a general screening metric." },
      { question: "Why include a healthy-weight range?", answer: "It makes the result more actionable by showing the approximate weight range associated with a standard healthy BMI for your height." }
    ],
    examples: [
      { title: "Quick screening", description: "Check whether a height and weight combination falls into underweight, healthy, overweight, or obesity ranges.", outcome: "The calculator gives a BMI score plus a plain-language category." },
      { title: "Goal planning", description: "Estimate a healthy weight range for a given height.", outcome: "You get a practical target range instead of a single number." }
    ],
    related: ["ideal-weight-calculator", "body-fat-calculator"]
  },
  {
    slug: "calorie-needs-calculator",
    title: "Calorie Needs Calculator",
    shortDescription: "Estimate maintenance calories and suggested calorie targets for losing, maintaining, or gaining weight.",
    intro: "This calorie needs calculator estimates how many calories you likely need each day based on body size, age, sex, and activity.",
    detail: "Use the Mifflin-St Jeor formula and activity multipliers to estimate BMR, maintenance calories, and suggested daily calorie targets for fat loss or weight gain.",
    category: "Health",
    searchTerms: ["maintenance calories", "mifflin st jeor", "calorie calculator"],
    features: ["Maintenance estimate", "Weight-loss and gain targets", "BMR included"],
    faqs: [
      { question: "Which formula does this calculator use?", answer: "It uses the Mifflin-St Jeor equation for BMR, then applies standard activity multipliers to estimate maintenance calories." },
      { question: "Are the calorie targets exact?", answer: "No. They are high-quality estimates and should be refined based on body-weight trend, hunger, energy, and training performance." },
      { question: "Why show maintenance, loss, and gain together?", answer: "It helps users compare paths quickly instead of switching calculators for each goal." }
    ],
    examples: [
      { title: "Fat-loss planning", description: "Estimate a sustainable calorie target below maintenance.", outcome: "The calculator shows maintenance calories and a lower daily intake for weight loss." },
      { title: "Muscle-gain setup", description: "Estimate a moderate calorie surplus for growth.", outcome: "You get a maintenance baseline plus a practical gain target." }
    ],
    related: ["macro-calculator", "protein-intake-calculator"]
  },
  {
    slug: "body-fat-calculator",
    title: "Body Fat Calculator",
    shortDescription: "Estimate body fat percentage using the U.S. Navy method with imperial or metric measurements.",
    intro: "This body fat calculator estimates body fat percentage from simple body measurements and turns the result into a more useful category.",
    detail: "Use height, neck, waist, and hips for women to estimate body fat with the U.S. Navy formula. Results update live and include a plain-language interpretation.",
    category: "Health",
    searchTerms: ["navy body fat", "body fat percentage calculator", "waist neck formula"],
    features: ["U.S. Navy estimate", "Imperial and metric", "Category interpretation"],
    faqs: [
      { question: "How accurate is the body fat estimate?", answer: "It is a useful field estimate, especially for trend tracking, but it is not as precise as lab or scan-based measurements." },
      { question: "Why do women need a hip measurement?", answer: "The standard U.S. Navy formula uses hips for women to improve the estimate." },
      { question: "Should I compare this with BMI?", answer: "Yes. Body fat percentage adds context that BMI alone cannot provide, especially for people with more muscle mass." }
    ],
    examples: [
      { title: "Fitness progress", description: "Track changes in body-fat estimate over several weeks using repeated waist and neck measurements.", outcome: "The calculator can show whether measurements are moving in the right direction even when scale weight is slower to change." },
      { title: "Broader health check", description: "Pair body-fat estimate with BMI for a fuller snapshot.", outcome: "You get more context than relying on BMI alone." }
    ],
    related: ["bmi-calculator", "ideal-weight-calculator"]
  },
  {
    slug: "water-intake-calculator",
    title: "Water Intake Calculator",
    shortDescription: "Estimate a daily hydration target in liters, ounces, and cups using weight, activity, and climate.",
    intro: "This water intake calculator gives you a practical hydration target that adapts to weight, exercise, and hotter conditions.",
    detail: "Start with body weight, then adjust for activity and climate to estimate daily water needs in multiple units that are easy to use throughout the day.",
    category: "Health",
    searchTerms: ["daily water calculator", "hydration target", "ounces to liters water"],
    features: ["Liters, ounces, and cups", "Activity adjustment", "Climate adjustment"],
    faqs: [
      { question: "How much water should I drink a day?", answer: "That depends on body size, exercise, climate, and sweat rate. This calculator gives a useful daily baseline rather than a one-size-fits-all rule." },
      { question: "Does coffee or tea count?", answer: "They can contribute to fluid intake, but this calculator is designed to give a simple water-first target." },
      { question: "Should I drink more in heat or during training?", answer: "Yes. Higher sweat loss is one of the main reasons to increase intake above a basic baseline." }
    ],
    examples: [
      { title: "Office baseline", description: "Estimate a normal hydration target for a moderate climate and low training volume.", outcome: "The result can be translated into cups or bottles for easy daily use." },
      { title: "Summer training", description: "Increase the target for hotter weather and more activity.", outcome: "The calculator raises the recommendation to better reflect sweat loss." }
    ],
    related: ["calorie-needs-calculator", "protein-intake-calculator"]
  },
  {
    slug: "ideal-weight-calculator",
    title: "Ideal Weight Calculator",
    shortDescription: "Estimate ideal or healthy weight ranges from height using a clearly labeled formula and BMI range.",
    intro: "This ideal weight calculator gives you a single formula-based estimate and a broader healthy-weight range so the result is easier to use well.",
    detail: "Enter height in imperial or metric units to view an ideal-weight estimate using the Devine formula, plus a healthy BMI-based range shown in both metric and imperial units.",
    category: "Health",
    searchTerms: ["devine formula", "healthy weight calculator", "ideal body weight"],
    features: ["Imperial and metric", "Devine estimate", "Healthy-range context"],
    faqs: [
      { question: "What formula is used here?", answer: "This calculator uses the Devine formula for a classic ideal-weight estimate and also shows a healthy BMI-based range for context." },
      { question: "Why show a range instead of one number?", answer: "A range is more realistic and more useful than a single target, especially for different body shapes and activity levels." },
      { question: "Is ideal weight the same as best weight?", answer: "Not always. Performance, health markers, body composition, and how you feel matter more than hitting an exact formula number." }
    ],
    examples: [
      { title: "General planning", description: "Use height to estimate a realistic healthy-weight range.", outcome: "The tool provides both a formula estimate and a wider healthy range." },
      { title: "Metric and imperial comparison", description: "Check the same target range in pounds and kilograms.", outcome: "This helps users compare goals across different unit systems." }
    ],
    related: ["bmi-calculator", "body-fat-calculator"]
  },
  {
    slug: "macro-calculator",
    title: "Macro Calculator",
    shortDescription: "Estimate calories and daily protein, carb, and fat targets for fat loss, maintenance, or muscle gain.",
    intro: "This macro calculator turns calorie needs into a practical macro split so meal planning becomes easier and more goal-specific.",
    detail: "Use estimated calorie needs plus a macro style such as balanced, higher protein, or lower carb to generate a daily target for calories, protein, carbs, and fats.",
    category: "Health",
    searchTerms: ["macro split calculator", "protein carbs fat calculator", "macros for fat loss"],
    features: ["Goal-based calorie target", "Macro-style presets", "Protein, carbs, and fat grams"],
    faqs: [
      { question: "How are macros calculated?", answer: "Macros are derived from an estimated calorie target and a chosen ratio for protein, carbs, and fats." },
      { question: "Which macro style should I use?", answer: "Balanced is the safest default. Higher protein can help with satiety and muscle retention, while lower carb may suit some eating preferences." },
      { question: "Should I adjust macros over time?", answer: "Yes. If hunger, energy, training performance, or body-weight trend are off, adjust macros or calories based on real-world feedback." }
    ],
    examples: [
      { title: "Cutting phase", description: "Set calories and macros for fat loss.", outcome: "The calculator gives a lower calorie target and a macro split that supports satiety and lean-mass retention." },
      { title: "Muscle-gain setup", description: "Build a small surplus with a higher-protein style.", outcome: "You get a practical daily protein, carb, and fat target for a gaining phase." }
    ],
    related: ["calorie-needs-calculator", "protein-intake-calculator"]
  },
  {
    slug: "protein-intake-calculator",
    title: "Protein Intake Calculator",
    shortDescription: "Estimate a daily protein recommendation range based on body weight, activity level, and goal.",
    intro: "This protein calculator gives you a realistic daily range instead of a single generic number, which makes it easier to plan meals around your actual goal.",
    detail: "Choose body weight, training level, and goal to estimate a daily protein target range for general health, fat loss, or muscle gain.",
    category: "Health",
    searchTerms: ["protein calculator", "grams of protein per day", "protein for muscle gain"],
    features: ["Goal-based range", "Imperial and metric", "Clear daily target"],
    faqs: [
      { question: "How much protein do I need per day?", answer: "That depends on your body weight, training volume, and goal. This calculator adjusts the recommendation instead of using one generic daily value." },
      { question: "Why show a range instead of one exact number?", answer: "Because protein intake does not need to be exact every day to work well. A useful range is more practical for real meal planning." },
      { question: "Is more protein always better?", answer: "Not necessarily. Enough protein helps, but once you are in a good range, total calories, training, sleep, and consistency matter just as much." }
    ],
    examples: [
      { title: "Fat-loss dieting", description: "Estimate a higher protein target during a calorie deficit.", outcome: "The calculator raises the recommendation to better support satiety and muscle retention." },
      { title: "Active lifestyle", description: "Set a practical daily target for someone training multiple times per week.", outcome: "You get a daily range that is easier to hit consistently than a random rule of thumb." }
    ],
    related: ["macro-calculator", "calorie-needs-calculator"]
  },
  {
    slug: "sleep-cycle-calculator",
    title: "Sleep Cycle Calculator",
    shortDescription: "Estimate better bedtimes or wake-up times using average sleep-cycle timing.",
    intro: "This sleep cycle calculator helps you time sleep around full cycles so waking up can feel smoother and less abrupt.",
    detail: "Enter either a bedtime or a wake-up time and choose a cycle count. The calculator suggests surrounding times based on average 90-minute cycles and a short fall-asleep buffer.",
    category: "Health",
    searchTerms: ["sleep cycle timing", "best bedtime calculator", "wake up time calculator"],
    features: ["Bedtime or wake-time mode", "Multiple recommendations", "Simple cycle explanation"],
    faqs: [
      { question: "How long is a sleep cycle?", answer: "A sleep cycle is often estimated at about 90 minutes, though real cycles vary from person to person." },
      { question: "Why include a fall-asleep buffer?", answer: "Because most people do not fall asleep instantly, so adding a short buffer makes the recommendations more realistic." },
      { question: "Will this guarantee better sleep?", answer: "No. It is a timing aid, not a replacement for total sleep, consistency, or good sleep habits." }
    ],
    examples: [
      { title: "Early meeting", description: "Work backward from a fixed wake time to choose a better bedtime.", outcome: "The calculator suggests several bedtime options built around full cycles." },
      { title: "Evening planning", description: "Start with a bedtime and see likely wake-up windows.", outcome: "You get multiple cycle-friendly morning times instead of just one." }
    ],
    related: ["water-intake-calculator", "calorie-needs-calculator"]
  },
  {
    slug: "running-pace-calculator",
    title: "Running Pace Calculator",
    shortDescription: "Convert time and distance into pace, or reverse pace and distance into an estimated finish time.",
    intro: "This running pace calculator helps runners and walkers translate race times into training pace or plan a target finish from a chosen pace.",
    detail: "Enter distance and either total time or target pace to calculate pace per mile, pace per kilometer, average speed, and estimated finish time.",
    category: "Health",
    searchTerms: ["pace per mile calculator", "race pace calculator", "finish time predictor"],
    features: ["Forward and reverse mode", "Mile and kilometer pace", "Speed output"],
    faqs: [
      { question: "What is running pace?", answer: "Pace is the amount of time it takes to cover one mile or one kilometer. It is often more useful than speed for runners." },
      { question: "Why show both pace and speed?", answer: "Runners often think in pace, but speed is helpful for comparing efforts and treadmill settings." },
      { question: "Can I use this for walking too?", answer: "Yes. The math works the same for walking, hiking, and other distance-based movement." }
    ],
    examples: [
      { title: "5K pacing", description: "Convert a recent 5K time into pace per kilometer and pace per mile.", outcome: "The calculator turns a finish time into useful training numbers." },
      { title: "Race goal setting", description: "Work backward from a target pace to estimate finish time.", outcome: "You can see what a pace goal means over the full distance." }
    ],
    related: ["sleep-cycle-calculator", "water-intake-calculator"]
  },
  {
    slug: "one-rep-max-calculator",
    title: "One Rep Max Calculator",
    shortDescription: "Estimate one-rep max and nearby rep-range loads from a recent working set.",
    intro: "This one rep max calculator helps lifters estimate top strength and practical training loads from a challenging set.",
    detail: "Enter the weight lifted and reps completed to estimate one-rep max using the Epley formula, plus suggested equivalent weights for 2 through 10 reps.",
    category: "Health",
    searchTerms: ["1rm calculator", "epley formula", "strength max estimate"],
    features: ["Estimated 1RM", "Rep-range table", "Simple formula explanation"],
    faqs: [
      { question: "Which one-rep-max formula is used?", answer: "This calculator uses the Epley formula, one of the most common strength-estimation formulas for moderate rep ranges." },
      { question: "Is the one-rep-max estimate exact?", answer: "No. It is a useful estimate that can guide training, but fatigue, technique, and exercise selection all affect real-world max strength." },
      { question: "Why show 2-10 rep estimates too?", answer: "Because most training happens below a true max, so equivalent rep-range loads are often more useful than the 1RM number itself." }
    ],
    examples: [
      { title: "Programming a top set", description: "Estimate a likely one-rep max from a recent set of five.", outcome: "The calculator converts the working set into a useful strength estimate." },
      { title: "Building rep targets", description: "Use the rep table to pick approximate loads for higher-rep training.", outcome: "You get a fast reference for 2-10 rep estimates." }
    ],
    related: ["protein-intake-calculator", "macro-calculator"]
  }
];

export const calculatorMap = Object.fromEntries(calculators.map((calculator) => [calculator.slug, calculator])) as Record<CalculatorSlug, CalculatorDefinition>;

export const calculatorCategories: CalculatorCategory[] = ["Finance", "Business", "Income", "Health", "Everyday"];

export function getCalculator(slug: string) {
  return calculatorMap[slug as CalculatorSlug];
}

export function getRelatedCalculators(slugs: CalculatorSlug[]) {
  return slugs.map((slug) => calculatorMap[slug]).filter(Boolean);
}
