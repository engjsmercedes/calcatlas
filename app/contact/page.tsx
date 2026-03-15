import type { Metadata } from "next";

import { StaticPageShell } from "@/components/static-page-shell";
import { contactEmail } from "@/data/static-pages";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Contact",
  description:
    "Contact Calc Atlas with calculator suggestions, corrections, partnership questions, or general product feedback.",
  path: "/contact"
});

export default function ContactPage() {
  return (
    <StaticPageShell
      eyebrow="Contact"
      title="Contact Calc Atlas"
      intro="Questions, calculator suggestions, and accuracy corrections are all welcome. If you spot something that should be improved, reaching out helps make the library more useful for everyone."
    >
      <section className="surface p-6 md:p-8">
        <h2 className="font-display text-3xl font-semibold">How to reach us</h2>
        <p className="mt-4 text-sm leading-7 md:text-base">
          The fastest way to get in touch is by email. This is the best channel for calculator requests, methodology questions, content corrections, and general site feedback.
        </p>
        <p className="mt-5 text-lg font-semibold text-slate-950 dark:text-white">
          <a href={`mailto:${contactEmail}`} className="text-accent hover:text-cyan-700">
            {contactEmail}
          </a>
        </p>
      </section>
      <section className="grid gap-6 md:grid-cols-2">
        <article className="surface p-6">
          <h2 className="font-display text-2xl font-semibold">What to include</h2>
          <p className="mt-3 text-sm leading-7">
            If you are reporting a calculator issue, include the page URL, the inputs you used, the result you expected, and where the current output appears off. That makes it much easier to review quickly.
          </p>
        </article>
        <article className="surface p-6">
          <h2 className="font-display text-2xl font-semibold">What you can contact us about</h2>
          <p className="mt-3 text-sm leading-7">
            Reach out with calculator ideas, corrections, usability feedback, partnership requests, or general questions about how Calc Atlas works and what it plans to cover next.
          </p>
        </article>
      </section>
    </StaticPageShell>
  );
}
