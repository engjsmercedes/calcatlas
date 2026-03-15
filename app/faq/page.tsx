import type { Metadata } from "next";
import Link from "next/link";

import { StaticPageShell } from "@/components/static-page-shell";
import { StructuredData } from "@/components/structured-data";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "FAQ",
  description:
    "Find answers to common questions about Calc Atlas calculators, including accuracy, formulas, health tools, finance tools, and how to use estimates responsibly.",
  path: "/faq"
});

const faqGroups = [
  {
    title: "Using Calc Atlas",
    items: [
      {
        question: "How accurate are online calculators?",
        answer: (
          <p>
            Online calculators are only as good as their formulas and assumptions. Calc Atlas aims to make those assumptions clear, but important decisions should still be verified independently. For more detail, review the <Link href="/methodology" className="text-accent hover:text-cyan-700">methodology page</Link> and the <Link href="/disclaimer" className="text-accent hover:text-cyan-700">disclaimer</Link>.
          </p>
        ),
        schemaAnswer: "Online calculators are only as good as their formulas and assumptions. Calc Atlas aims to make those assumptions clear, but important decisions should still be verified independently."
      },
      {
        question: "Why do some calculators include assumptions?",
        answer: <p>Some topics, especially tax, nutrition, and finance, require simplified assumptions to stay usable. Calc Atlas surfaces those assumptions so users understand the limits of the estimate.</p>,
        schemaAnswer: "Some topics, especially tax, nutrition, and finance, require simplified assumptions to stay usable. Calc Atlas surfaces those assumptions so users understand the limits of the estimate."
      }
    ]
  },
  {
    title: "Health calculators",
    items: [
      {
        question: "What is BMI and how should I use it?",
        answer: <p>BMI is a height-to-weight screening metric. It is useful for general context, but it does not directly measure body composition. You can review the <Link href="/bmi-calculator" className="text-accent hover:text-cyan-700">BMI Calculator</Link> and pair it with the <Link href="/body-fat-calculator" className="text-accent hover:text-cyan-700">Body Fat Calculator</Link> for more context.</p>,
        schemaAnswer: "BMI is a height-to-weight screening metric. It is useful for general context, but it does not directly measure body composition."
      },
      {
        question: "How many calories should I eat each day?",
        answer: <p>That depends on body size, sex, age, activity level, and goal. The <Link href="/calorie-needs-calculator" className="text-accent hover:text-cyan-700">Calorie Needs Calculator</Link> provides a starting estimate, not a perfect answer.</p>,
        schemaAnswer: "That depends on body size, sex, age, activity level, and goal. The Calorie Needs Calculator provides a starting estimate, not a perfect answer."
      }
    ]
  },
  {
    title: "Finance and business calculators",
    items: [
      {
        question: "How does compound interest work?",
        answer: <p>Compound interest means growth can earn additional growth over time. The <Link href="/compound-interest-calculator" className="text-accent hover:text-cyan-700">Compound Interest Calculator</Link> shows how recurring contributions and time can change the result.</p>,
        schemaAnswer: "Compound interest means growth can earn additional growth over time. The Compound Interest Calculator shows how recurring contributions and time can change the result."
      },
      {
        question: "What is ROI?",
        answer: <p>ROI stands for return on investment. It compares gain or loss to the original amount invested. The <Link href="/roi-calculator" className="text-accent hover:text-cyan-700">ROI Calculator</Link> also shows annualized ROI when a time period is included.</p>,
        schemaAnswer: "ROI stands for return on investment. It compares gain or loss to the original amount invested."
      }
    ]
  }
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqGroups.flatMap((group) =>
    group.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.schemaAnswer
      }
    }))
  )
};

export default function FaqPage() {
  return (
    <>
      <StructuredData data={faqSchema} />
      <StaticPageShell
        eyebrow="FAQ"
        title="Frequently asked questions"
        intro="This page answers common questions about calculator accuracy, formulas, usage, and the way Calc Atlas approaches health, finance, and other estimate-driven tools."
      >
        {faqGroups.map((group) => (
          <section key={group.title} className="surface p-6 md:p-8">
            <h2 className="font-display text-3xl font-semibold">{group.title}</h2>
            <div className="mt-5 space-y-5">
              {group.items.map((item) => (
                <article key={item.question} className="border-t border-border/80 pt-5 first:border-t-0 first:pt-0">
                  <h3 className="text-xl font-semibold">{item.question}</h3>
                  <div className="mt-2 text-sm leading-7 md:text-base">{item.answer}</div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </StaticPageShell>
    </>
  );
}
