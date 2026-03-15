import type { Metadata } from "next";

import type { CalculatorCategoryDefinition, CalculatorDefinition, CalculatorSlug } from "@/data/calculators";

import { siteConfig } from "./site";

function normalizePath(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}

export function absoluteUrl(path: string) {
  return `${siteConfig.url}${normalizePath(path)}`;
}

export function createMetadata(options: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  type?: "website" | "article";
  imagePath?: string;
}) {
  const { title, description, path, keywords, type = "website", imagePath = "/opengraph-image" } = options;
  const canonical = absoluteUrl(path);
  const image = absoluteUrl(imagePath);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical
    },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url: canonical,
      siteName: siteConfig.name,
      type,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} social preview`
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.name}`,
      description,
      images: [image]
    }
  } satisfies Metadata;
}

export function createCalculatorMetadata(calculator: CalculatorDefinition) {
  return createMetadata({
    title: calculator.title,
    description: calculator.shortDescription,
    path: `/${calculator.slug}`,
    keywords: [...calculator.searchTerms, calculator.title, calculator.category],
    imagePath: `/${calculator.slug}/opengraph-image`
  });
}

const calculatorIntroExtensions: Record<CalculatorSlug, string> = {
  "percentage-calculator": "It is built for the common percentage tasks people search for most often, from quick discounts and tips to growth rates and percent-of comparisons. Instead of forcing users to jump between tools, the page keeps the main percentage workflows in one interface with live answers and plain-language context.",
  "discount-calculator": "The page is designed for quick shopping and retail decisions where users want the final sale price without doing multiple percent-off steps by hand. Showing effective discount makes it more useful than a one-step sale-price estimate.",
  "tip-calculator": "It is intentionally simple and fast so users can get a usable answer in a few seconds on mobile. Adding the split-per-person result makes it more practical for real restaurant and group-bill scenarios than a basic tip-only tool.",
  "margin-calculator": "The page is designed for operators, founders, and ecommerce teams who need to move quickly between margin and markup without mixing the two up. It helps turn pricing questions into clearer decisions by showing the business meaning behind the math, not just the raw output.",
  "mortgage-calculator": "For SEO and usability, the page focuses on the numbers people actually care about when comparing homes or refinance scenarios: monthly payment, long-term interest cost, and the effect of taxes, insurance, and HOA dues. That makes it more useful than a bare principal-and-interest estimator.",
  "loan-calculator": "The page is useful for personal loans, renovation loans, and other fixed borrowing scenarios where users want a fast monthly payment estimate plus a realistic view of total interest. The extra-payment comparison also turns it into a planning tool instead of a one-number answer.",
  "auto-loan-calculator": "It is built around the real details that affect car financing offers, including taxes, fees, trade-in value, and down payment. Showing multiple common loan terms helps users compare dealer offers without switching between separate tools.",
  "credit-card-payoff-calculator": "The page is designed for one of the most common debt questions online: how long will this balance take to pay off, and what happens if I pay more each month. By comparing the current payment against an accelerated plan, it makes the interest cost of revolving debt easier to see.",
  "debt-to-income-calculator": "This page is aimed at borrowers who need quick underwriting-style context before applying for a mortgage, auto loan, or other financing. Showing both front-end and back-end ratios makes it more practical than a single DTI number alone.",
  "rent-vs-buy-calculator": "It gives users a more decision-ready comparison by combining housing costs, time horizon, appreciation, and transaction costs into one side-by-side estimate. That makes the result more useful than relying on mortgage payment alone when evaluating whether buying is worth it.",
  "down-payment-calculator": "The page helps homebuyers move from a percentage assumption to a real cash target and a more realistic loan size. Connecting the down payment directly to estimated monthly payment makes it more actionable than a simple percentage converter.",
  "savings-goal-calculator": "It is built for one of the most common personal finance questions: how long will it take to reach my target if I save this much each month. Pairing the timeline with contribution and growth context makes the result easier to use for planning.",
  "inflation-calculator": "The page is useful because it translates an abstract economic concept into a clear before-and-after dollar comparison. Showing both future cost and lost purchasing power helps users connect inflation to budgeting and long-term planning more directly.",
  "tax-calculator": "The page turns a rough tax question into a more useful take-home-pay planning estimate by separating gross income from taxes and deductions. That makes it more actionable for offer review, budgeting, and salary comparisons than a generic percentage guess.",
  "net-worth-calculator": "The page helps users total what they own and what they owe in one place so their current financial picture is easier to understand. That makes it useful both for quick snapshots and for repeat progress tracking over time.",
  "age-calculator": "It is designed for exact date-based answers rather than rough age estimates. Showing total days, weeks, and the next birthday countdown makes it useful for forms, milestones, and planning use cases beyond a simple age number.",
  "date-difference-calculator": "The page makes date comparison easier by showing both total elapsed time and a calendar-style breakdown. That is more useful than a bare day count when users care about anniversaries, deadlines, and project timing.",
  "time-duration-calculator": "It is built for quick schedule math, especially work shifts and time blocks that cross midnight. Showing hours and minutes, decimal hours, and total minutes makes it practical for payroll, invoices, and personal planning.",
  "roi-calculator": "This page is meant for fast evaluation of campaigns, projects, and investments where simple return math needs extra context. By showing gain, total ROI, and annualized ROI together, it helps users compare opportunities that span different amounts and timeframes.",
  "compound-interest-calculator": "It is structured to make compounding more intuitive by separating contributions from growth and pairing the numbers with a visual chart. That makes it easier to explain long-term investing, savings habits, and future value planning without overwhelming the user.",
  "salary-to-hourly-calculator": "The page goes beyond a basic salary conversion by reflecting the questions people actually have when evaluating compensation: what the hourly equivalent is, how taxes change the picture, and how deductions affect take-home pay. That makes it useful for job offers, freelancing, and relocation planning.",
  "bmi-calculator": "It is designed as a quick screening tool rather than a single-number verdict. Alongside the BMI score, the page gives users healthy-weight context and a readable interpretation so the result is easier to understand and use responsibly.",
  "calorie-needs-calculator": "The page turns a common search query into a practical planning tool by showing maintenance calories and nearby targets for losing or gaining weight. That helps users compare goals in one place instead of piecing the answer together from separate pages.",
  "body-fat-calculator": "It focuses on a common body-fat estimation method that can be repeated at home with simple measurements, which makes it useful for trend tracking over time. The page also adds interpretation so users can place the estimate in a more realistic context.",
  "water-intake-calculator": "Rather than repeating a generic drink-more-water rule, the page gives a more tailored daily target based on weight, activity, and climate. Presenting the result in ounces, liters, and cups makes it easier to use in everyday routines.",
  "ideal-weight-calculator": "This page is built to be more useful than a single formula output by pairing an ideal-weight estimate with a broader healthy range. That gives users a better starting point for planning without implying that one exact number is universally correct.",
  "macro-calculator": "It connects calorie planning to practical meal targets by converting total energy needs into protein, carb, and fat grams. Showing different macro styles makes the page more flexible for users with different preferences while keeping the core logic understandable.",
  "protein-intake-calculator": "The page is intentionally range-based because that reflects how protein guidance works in practice. Instead of pretending there is one perfect number, it gives users a realistic target band that can support health, fat loss, or muscle gain goals.",
  "sleep-cycle-calculator": "It is designed to answer one of the most common sleep timing questions quickly: when should I go to bed or wake up if I want to align with fuller sleep cycles. The page keeps the recommendation simple while still explaining the basic 90-minute-cycle assumption.",
  "running-pace-calculator": "The page helps runners move between race results, training pace, and finish-time planning without juggling multiple conversions. By showing mile pace, kilometer pace, and speed together, it becomes useful for both outdoor running and treadmill-based training.",
  "one-rep-max-calculator": "It is built for lifters who want a practical estimate from a recent working set instead of testing a true max every time. The page adds rep-range equivalents so the result can support actual programming, not just a headline strength number."
};

export function getCalculatorLead(calculator: CalculatorDefinition) {
  return calculatorIntroExtensions[calculator.slug];
}

export function getCalculatorResultExplanation(calculator: CalculatorDefinition) {
  switch (calculator.slug) {
    case "mortgage-calculator":
      return "The output separates principal and interest from taxes, insurance, and HOA costs so users can understand what is driving the all-in housing payment. It also makes the tradeoff between monthly affordability and long-term interest cost easier to evaluate.";
    case "loan-calculator":
      return "The result shows how much the loan costs each month and how much total interest accumulates if the debt runs its full term. When extra payments are added, the output also makes the payoff-speed tradeoff clearer.";
    case "credit-card-payoff-calculator":
      return "The result highlights payoff time and total interest so users can see how expensive revolving debt becomes when balances linger. Comparing the current payment with a larger payment makes the savings from faster payoff more concrete.";
    case "rent-vs-buy-calculator":
      return "The result frames renting and buying as a longer-horizon comparison instead of just comparing one monthly payment with another. It helps users see how time horizon, equity, transaction costs, and ongoing ownership costs all shape the decision.";
    case "down-payment-calculator":
      return "The output links the upfront cash target to the remaining loan amount and a rough monthly payment, which makes the tradeoff immediately useful. Users can quickly see whether a larger down payment meaningfully improves the financing picture.";
    case "savings-goal-calculator":
      return "The result shows whether the current savings pace is enough for the target and how much of the ending balance comes from contributions versus growth. That gives users a clearer planning answer than a future value number alone.";
    case "inflation-calculator":
      return "The output translates an annual inflation assumption into a future-dollar cost and reduced purchasing power. That helps users understand how a seemingly small rate can materially change long-term budget or savings plans.";
    case "salary-to-hourly-calculator":
      return "The result connects pay conversion to a more realistic take-home estimate, which makes the number easier to use for job offers, budgeting, and freelance comparisons. The breakdown also clarifies how taxes and deductions change the picture.";
    case "bmi-calculator":
      return "The result places the BMI score inside a broader category and healthy-weight context so users are not left with a raw ratio alone. It works best as a quick screening number rather than a full health assessment.";
    case "calorie-needs-calculator":
      return "The output shows maintenance calories plus nearby targets for fat loss or gain, which makes the result usable for planning rather than just reference. It helps users turn a formula estimate into an actual decision about daily intake.";
    case "body-fat-calculator":
      return "The result turns a measurement-based estimate into a category and plain-language interpretation so users can gauge general body-composition context. It is most useful for repeat tracking and broad benchmarking, not exact laboratory-level precision.";
    case "macro-calculator":
      return "The output converts calorie needs into protein, carb, and fat targets that can be used in meal planning right away. The chosen macro style also helps users understand how the recommendation fits their goal and eating preference.";
    case "running-pace-calculator":
      return "The result converts one race or workout number into pace, speed, and finish-time context that runners can use immediately. That makes it easier to plan training and race strategy without extra conversions.";
    default:
      if (calculator.category === "Finance") {
        return `${calculator.title} turns the raw output into a planning answer so users can understand what the number means before making a money decision.`;
      }
      if (calculator.category === "Health") {
        return `${calculator.title} pairs the number with plain-language context so users can interpret the result more responsibly and use it as a starting point for planning.`;
      }
      return `${calculator.title} updates results instantly as inputs change, then explains what the number means in plain language so the output is easier to act on.`;
  }
}

export function getCalculatorGuide(calculator: CalculatorDefinition) {
  switch (calculator.category) {
    case "Finance":
      return {
        measures: `This calculator measures the main money relationship behind ${calculator.title.toLowerCase()}, turning inputs into a planning number instead of a rough guess.`,
        affects: "Rates, time horizon, payment size, and other scenario assumptions usually have the biggest impact on the final result.",
        uses: "People use the output to compare options, pressure-test affordability, and decide whether the current setup still fits the goal.",
        related: "Related finance tools below help users keep moving through the next step of the same decision instead of returning to search."
      };
    case "Health":
      return {
        measures: `This calculator measures the core health or fitness estimate behind ${calculator.title.toLowerCase()} and puts it into readable context.`,
        affects: "Body size, activity, timing, and the chosen assumptions are usually what move the result the most.",
        uses: "People use the output as a starting point for planning habits, nutrition, recovery, or training rather than as a perfect standalone verdict.",
        related: "Related health tools below help users compare the result with nutrition, body-composition, recovery, and performance calculators."
      };
    case "Business":
      return {
        measures: `This calculator measures the pricing or profitability math behind ${calculator.title.toLowerCase()} so the tradeoff is easier to read.`,
        affects: "Cost, selling price, target margins, and the direction of the calculation all change the business outcome.",
        uses: "People use the result to set prices faster, check profitability, and avoid making decisions from partial math.",
        related: "Related business and finance tools below help users move into adjacent pricing and return questions."
      };
    default:
      return {
        measures: `This calculator measures the main input-to-output relationship behind ${calculator.title.toLowerCase()} in a way that is fast to reuse.`,
        affects: "The selected mode, the quality of the starting inputs, and the chosen assumptions all influence the final number.",
        uses: "People use the result to answer a quick practical question and then move directly into the next decision.",
        related: "Related calculators below keep users inside the same problem cluster without duplicating navigation."
      };
  }
}

export function getCalculatorShareNote(calculator: CalculatorDefinition) {
  return `This ${calculator.title.toLowerCase()} supports shareable URL state, so the current inputs can be copied into a link and reopened later without re-entering the scenario.`;
}

export function createCalculatorSchemas(calculator: CalculatorDefinition) {
  const url = absoluteUrl(`/${calculator.slug}`);
  const applicationCategory =
    calculator.category === "Health"
      ? "HealthApplication"
      : calculator.category === "Finance"
        ? "FinanceApplication"
        : calculator.category === "Business"
          ? "BusinessApplication"
          : "UtilitiesApplication";

  return [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: calculator.title,
      description: calculator.shortDescription,
      applicationCategory,
      operatingSystem: "All",
      isAccessibleForFree: true,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD"
      },
      url
    },
    ...(calculator.faqs.length > 0
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: calculator.faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer
              }
            }))
          }
        ]
      : [])
  ];
}

export function createCalculatorIndexSchemas() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${siteConfig.name} calculators`,
    description: "Browse calculators across finance, health, business, income, and everyday categories.",
    url: absoluteUrl("/calculators")
  };
}




export function createCategoryMetadata(category: CalculatorCategoryDefinition) {
  return createMetadata({
    title: category.title,
    description: category.shortDescription,
    path: `/${category.slug}`,
    keywords: [...category.searchTerms, category.title, category.category]
  });
}

export function createCategorySchema(category: CalculatorCategoryDefinition) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.title,
    description: category.shortDescription,
    url: absoluteUrl(`/${category.slug}`)
  };
}