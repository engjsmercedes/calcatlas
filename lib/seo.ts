import type { Metadata } from "next";

import type { CalculatorDefinition } from "@/data/calculators";

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
}) {
  const { title, description, path, keywords, type = "website" } = options;
  const canonical = absoluteUrl(path);
  const image = absoluteUrl(siteConfig.ogImage);

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
    keywords: [...calculator.searchTerms, calculator.title, calculator.category]
  });
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
