import type { Metadata } from "next";

import { StaticPageShell } from "@/components/static-page-shell";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Disclaimer",
  description:
    "Review the Calc Atlas disclaimer covering calculator estimates, financial and health limitations, and independent verification of important decisions.",
  path: "/disclaimer"
});

export default function DisclaimerPage() {
  return (
    <StaticPageShell
      eyebrow="Disclaimer"
      title="Calculator and Content Disclaimer"
      intro="Calc Atlas provides informational calculators and supporting content to help users estimate outcomes more quickly. Those results are not a substitute for professional judgment, regulated advice, or situation-specific review."
    >
      <section className="surface p-6 md:p-8">
        <h2 className="font-display text-3xl font-semibold">Estimates only</h2>
        <p className="mt-4 text-sm leading-7 md:text-base">
          Calculator outputs are estimates built from formulas, assumptions, and simplified inputs. Real outcomes may differ because of missing variables, changing laws, individual circumstances, or incomplete data.
        </p>
      </section>
      <section className="grid gap-6 md:grid-cols-3">
        <article className="surface p-6">
          <h2 className="font-display text-2xl font-semibold">Not financial advice</h2>
          <p className="mt-3 text-sm leading-7">
            Finance calculators, mortgage tools, ROI estimates, and salary projections are for general information only. They do not replace licensed financial, tax, payroll, lending, or investment advice.
          </p>
        </article>
        <article className="surface p-6">
          <h2 className="font-display text-2xl font-semibold">Not medical advice</h2>
          <p className="mt-3 text-sm leading-7">
            Health calculators such as BMI, calorie, body fat, macro, protein, hydration, and sleep tools are general education aids. They should not replace a physician, registered dietitian, or other qualified clinician.
          </p>
        </article>
        <article className="surface p-6">
          <h2 className="font-display text-2xl font-semibold">Not legal advice</h2>
          <p className="mt-3 text-sm leading-7">
            Nothing on this site should be treated as legal advice or a substitute for reviewing requirements with a licensed attorney or other qualified professional.
          </p>
        </article>
      </section>
      <section className="surface p-6 md:p-8">
        <h2 className="font-display text-3xl font-semibold">Verify important decisions independently</h2>
        <p className="mt-4 text-sm leading-7 md:text-base">
          If a result affects money, health, employment, legal obligations, or any other high-stakes outcome, verify the assumptions independently and consult the appropriate professional before acting.
        </p>
      </section>
    </StaticPageShell>
  );
}
