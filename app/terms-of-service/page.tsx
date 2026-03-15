import type { Metadata } from "next";

import { StaticPageShell } from "@/components/static-page-shell";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Terms of Service",
  description:
    "Read the basic terms for using Calc Atlas, including calculator limitations, site availability, and user responsibilities.",
  path: "/terms-of-service"
});

const sections = [
  {
    title: "Using the website",
    body: "By using Calc Atlas, you agree to use the site lawfully and responsibly. The website is intended for general informational use and is not designed as a contractual advisory service, regulated product, or guaranteed decision engine."
  },
  {
    title: "Calculator accuracy and limitations",
    body: "Calculators on the site are designed to provide fast estimates based on stated formulas and assumptions. They may not reflect every real-world variable, tax rule, medical factor, or professional standard relevant to your situation. Results should be reviewed independently before being used for important personal, financial, business, legal, or health decisions."
  },
  {
    title: "No uninterrupted access guarantee",
    body: "We may update, suspend, redesign, or remove parts of the site at any time. Calc Atlas does not guarantee uninterrupted availability, error-free operation, or that every calculator will remain unchanged over time."
  },
  {
    title: "User responsibilities",
    body: "You are responsible for checking whether calculator assumptions fit your circumstances. You should not rely on the site as the sole basis for any major decision, and you should verify critical numbers with qualified professionals or more specific tools when needed."
  },
  {
    title: "Intellectual property and site content",
    body: "The site design, copy, calculator logic, branding, and original content are protected by applicable intellectual property laws. You may use the site for personal or internal reference, but that does not grant ownership of the underlying materials."
  },
  {
    title: "Changes to the terms",
    body: "These terms may be updated from time to time to reflect site changes, new features, or legal housekeeping. Continued use of the site after updates means you accept the revised terms."
  },
  {
    title: "Limitation of liability",
    body: "To the fullest extent allowed by law, Calc Atlas is not liable for losses, damages, or consequences resulting from use of the site, reliance on a calculator estimate, or inability to access the website."
  }
];

export default function TermsOfServicePage() {
  return (
    <StaticPageShell
      eyebrow="Terms"
      title="Terms of Service"
      intro="These terms describe the basic rules for using Calc Atlas. They are written for a practical calculator website and should be read alongside the site disclaimer and methodology pages."
    >
      <div className="space-y-6">
        {sections.map((section) => (
          <section key={section.title} className="surface p-6 md:p-8">
            <h2 className="font-display text-3xl font-semibold">{section.title}</h2>
            <p className="mt-4 text-sm leading-7 md:text-base">{section.body}</p>
          </section>
        ))}
      </div>
    </StaticPageShell>
  );
}
