import type { Metadata } from "next";

import type { CalculatorDefinition, CalculatorSlug } from "@/data/calculators";

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
  "margin-calculator": "The page is designed for operators, founders, and ecommerce teams who need to move quickly between margin and markup without mixing the two up. It helps turn pricing questions into clearer decisions by showing the business meaning behind the math, not just the raw output.",
  "mortgage-calculator": "For SEO and usability, the page focuses on the numbers people actually care about when comparing homes or refinance scenarios: monthly payment, long-term interest cost, and the effect of taxes, insurance, and HOA dues. That makes it more useful than a bare principal-and-interest estimator.",
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
  return `${calculator.title} updates results instantly as inputs change, then turns the output into a plain-language answer so users can understand what the number means and what to do next.`;
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
