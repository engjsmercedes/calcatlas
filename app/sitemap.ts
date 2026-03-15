import type { MetadataRoute } from "next";

import { calculatorCategoryPages, calculators } from "@/data/calculators";
import { subtopicHubs } from "@/data/subtopic-hubs";
import { trustPageLinks } from "@/data/static-pages";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: siteConfig.url,
      lastModified,
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: `${siteConfig.url}/calculators`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9
    },
    ...calculatorCategoryPages.map((category) => ({
      url: `${siteConfig.url}/${category.slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.85
    })),
    ...subtopicHubs.map((hub) => ({
      url: `${siteConfig.url}/${hub.slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.82
    })),
    ...trustPageLinks.map((page) => ({
      url: `${siteConfig.url}${page.href}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6
    })),
    ...calculators.map((calculator) => ({
      url: `${siteConfig.url}/${calculator.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8
    }))
  ];
}
