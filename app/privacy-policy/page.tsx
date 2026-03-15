import type { Metadata } from "next";

import { StaticPageShell } from "@/components/static-page-shell";
import { contactEmail } from "@/data/static-pages";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Privacy Policy",
  description:
    "Read the Calc Atlas privacy policy covering cookies, analytics, usage data, contact requests, and third-party services.",
  path: "/privacy-policy"
});

const sections = [
  {
    title: "Information we may collect",
    body: "Calc Atlas is designed as a lightweight calculator website. Depending on how the site is configured over time, we may collect limited usage information such as page views, browser or device information, rough location derived from IP address, referral sources, and interactions that help us understand which calculators are useful. If you contact us directly, we may also receive the information you choose to include in your message."
  },
  {
    title: "Cookies and analytics",
    body: "The site may use cookies or similar technologies for basic analytics, performance measurement, preferences, or functionality. These tools help us understand how visitors use the site, which calculators are popular, and where usability issues may exist."
  },
  {
    title: "Third-party services",
    body: "Calc Atlas may rely on third-party services for hosting, analytics, performance monitoring, email, or embedded content. Those providers may process limited technical data as part of operating the site. Their own privacy practices apply to the data they handle."
  },
  {
    title: "How data may be used",
    body: "Any data collected may be used to operate the site, improve calculator quality, diagnose technical issues, respond to contact requests, understand traffic patterns, and protect the site from misuse. We do not treat calculator inputs as submitted accounts or stored personal profiles unless a future feature clearly says otherwise."
  },
  {
    title: "External links",
    body: "Some pages may link to external websites, references, or sources. Once you leave Calc Atlas, the privacy practices of those other sites control how your data is handled."
  },
  {
    title: "Updates to this policy",
    body: "Privacy practices and supporting tools may change over time as the site grows. This page may be updated to reflect those changes, and continued use of the site means you understand that the policy can evolve."
  }
];

export default function PrivacyPolicyPage() {
  return (
    <StaticPageShell
      eyebrow="Privacy"
      title="Privacy Policy"
      intro="This page explains the general privacy practices for Calc Atlas as a small public calculator website. It is intended to be practical, readable, and clear about the kinds of information a tool-focused site may use."
    >
      <div className="space-y-6">
        {sections.map((section) => (
          <section key={section.title} className="surface p-6 md:p-8">
            <h2 className="font-display text-3xl font-semibold">{section.title}</h2>
            <p className="mt-4 text-sm leading-7 md:text-base">{section.body}</p>
          </section>
        ))}
      </div>
      <section className="surface p-6 md:p-8">
        <h2 className="font-display text-3xl font-semibold">Contact</h2>
        <p className="mt-4 text-sm leading-7 md:text-base">
          Questions about this policy can be sent to <a href={`mailto:${contactEmail}`} className="text-accent hover:text-cyan-700">{contactEmail}</a>.
        </p>
      </section>
    </StaticPageShell>
  );
}
