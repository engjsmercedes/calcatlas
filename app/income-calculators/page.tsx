import type { Metadata } from "next";

import { CategoryHubPage } from "@/components/category-hub-page";
import { StructuredData } from "@/components/structured-data";
import { calculatorCategoryDetails, calculatorCategoryPages, getCalculatorsByCategory } from "@/data/calculators";
import { createCategoryMetadata, createCategorySchema } from "@/lib/seo";

const category = calculatorCategoryDetails.Income;

export const metadata: Metadata = createCategoryMetadata(category);

export default function Page() {
  return (
    <>
      <StructuredData data={createCategorySchema(category)} />
      <CategoryHubPage
        category={category}
        calculators={getCalculatorsByCategory(category.category)}
        categoryLinks={calculatorCategoryPages}
      />
    </>
  );
}
