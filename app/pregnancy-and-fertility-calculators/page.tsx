import type { Metadata } from "next";

import { StructuredData } from "@/components/structured-data";
import { SubtopicHubPage } from "@/components/subtopic-hub-page";
import { calculators } from "@/data/calculators";
import { getSubtopicCalculators, subtopicHubs } from "@/data/subtopic-hubs";
import { absoluteUrl, createMetadata } from "@/lib/seo";

const hub = subtopicHubs.find((item) => item.slug === "pregnancy-and-fertility-calculators")!;

export const metadata: Metadata = createMetadata({
  title: hub.title,
  description: hub.shortDescription,
  path: "/pregnancy-and-fertility-calculators",
  keywords: [...hub.searchTerms, hub.title]
});

export default function Page() {
  return (
    <>
      <StructuredData data={{ "@context": "https://schema.org", "@type": "CollectionPage", name: hub.title, description: hub.shortDescription, url: absoluteUrl("/pregnancy-and-fertility-calculators") }} />
      <SubtopicHubPage hub={hub} calculators={getSubtopicCalculators(hub, calculators)} siblingHubs={subtopicHubs} />
    </>
  );
}
