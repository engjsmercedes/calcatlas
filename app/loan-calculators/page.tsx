import type { Metadata } from "next";

import { StructuredData } from "@/components/structured-data";
import { SubtopicHubPage } from "@/components/subtopic-hub-page";
import { calculators } from "@/data/calculators";
import { getSubtopicCalculators, subtopicHubs } from "@/data/subtopic-hubs";
import { absoluteUrl, createMetadata } from "@/lib/seo";

const hub = subtopicHubs.find((item) => item.slug === "loan-calculators")!;

export const metadata: Metadata = createMetadata({
  title: hub.title,
  description: hub.shortDescription,
  path: `/${hub.slug}`,
  keywords: [...hub.searchTerms, hub.title]
});

export default function Page() {
  return (
    <>
      <StructuredData data={{ "@context": "https://schema.org", "@type": "CollectionPage", name: hub.title, description: hub.shortDescription, url: absoluteUrl(`/${hub.slug}`) }} />
      <SubtopicHubPage hub={hub} calculators={getSubtopicCalculators(hub, calculators)} siblingHubs={subtopicHubs} />
    </>
  );
}
