import type { Metadata } from "next";

import { ContactForm } from "@/components/contact-form";
import { StaticPageShell } from "@/components/static-page-shell";
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
      intro="Questions, calculator suggestions, and accuracy corrections are all welcome. Use the form below to send feedback privately without exposing a public inbox address on the site."
    >
      <ContactForm />
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
