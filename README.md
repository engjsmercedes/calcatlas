# Calc Atlas

Calc Atlas is a production-ready calculator library built with Next.js, TypeScript, and Tailwind CSS. The app currently ships with 64 calculator routes across finance, business, income, health, and everyday utility topics, plus category hubs, subtopic hubs, trust pages, embeds, comparison tools, and shareable result states.

## What the app includes

- 64 calculator routes powered by a shared registry in `data/calculators.ts`
- Category hubs for finance, health, and everyday calculators
- Subtopic hubs for loans, investing, tax and income, date and time, conversions, pregnancy and fertility, and fitness performance
- Static trust and transparency pages:
  - `/about`
  - `/contact`
  - `/faq`
  - `/methodology`
  - `/sources`
  - `/privacy-policy`
  - `/terms-of-service`
  - `/disclaimer`
- Shareable calculator URLs based on query string state
- Comparison mode on major decision calculators
- Calculator-specific examples, FAQs, result explanations, and decision guidance
- Embeddable calculator routes under `/embed/[slug]`
- Contact form with server-side email delivery and Turnstile verification
- Calculator feedback actions with thumbs up, thumbs down, and issue reporting
- Optional Google Analytics tracking
- Optional AI-backed decision summaries on comparison-enabled calculators

## Major calculator coverage

### Finance

- Mortgage Calculator
- Mortgage Affordability Calculator
- Loan Calculator
- Auto Loan Calculator
- Credit Card Payoff Calculator
- Debt Payoff Calculator
- Debt-to-Income Calculator
- Rent vs Buy Calculator
- Down Payment Calculator
- Compound Interest Calculator
- Interest Calculator
- Investment Calculator
- Inflation Calculator
- Savings Goal Calculator
- Savings Calculator
- Retirement Calculator
- ROI Calculator
- Tax Calculator
- Net Worth Calculator

### Business

- Margin Calculator
- Markup Calculator
- Break-Even Calculator
- Commission Calculator
- Sales Tax Calculator
- Budget Calculator

### Income

- Salary Calculator
- Salary to Hourly Calculator
- Take-Home Paycheck Calculator
- Hourly Paycheck Calculator
- Overtime Calculator

### Health

- BMI Calculator
- BMR Calculator
- Calorie Needs Calculator
- Calorie Calculator
- Body Fat Calculator
- TDEE Calculator
- Water Intake Calculator
- Ideal Weight Calculator
- Macro Calculator
- Protein Intake Calculator
- Sleep Cycle Calculator
- Running Pace Calculator
- One Rep Max Calculator
- Pregnancy Due Date Calculator
- Ovulation Calculator
- Heart Rate Zone Calculator
- Steps to Calories Calculator

### Everyday

- Percentage Calculator
- Discount Calculator
- Tip Calculator
- Age Calculator
- Date Difference Calculator
- Time Duration Calculator
- Unit Converter
- Speed Converter
- Length Converter
- Weight Converter
- Temperature Converter
- Time Zone Converter

## Local development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000)

## Production build

```bash
npm run build
npm run start
```

## Deploy to Vercel

1. Push the project to GitHub or another supported Git provider.
2. Import the repository into Vercel.
3. Set `NEXT_PUBLIC_SITE_URL` to the production domain, for example:
   ```text
   NEXT_PUBLIC_SITE_URL=https://calcatlas.app
   ```
4. Add the optional environment variables you need from the list below.
5. Deploy. The site is mostly static-friendly and uses server routes only for controlled features such as contact delivery, calculator feedback, and AI summaries.

## Environment variables

### Core

```text
NEXT_PUBLIC_SITE_URL=https://calcatlas.app
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Contact form and email

```text
RESEND_API_KEY=...
CONTACT_TO_EMAIL=you@example.com
CONTACT_FROM_EMAIL=Calc Atlas <onboarding@resend.dev>
NEXT_PUBLIC_TURNSTILE=...
TURNSTILE_SECRET=...
```

For production, replace the default sender with an address on a verified sending domain.

### AI summaries

```text
OPENAI_API_KEY=...
AI_SUMMARY_MODEL=gpt-5-mini
```

`AI_SUMMARY_MODEL` is optional. If omitted, the app falls back to the default model configured in the server route.

## SEO and indexing setup

Calc Atlas is structured so new calculators and hubs flow into the indexing-critical surfaces automatically.

- Canonicals, OpenGraph, and page metadata are generated through `lib/seo.ts`
- The production site base is defined in `lib/site.ts`
- Sitemap is generated in `app/sitemap.ts`
- Robots file lives in `public/robots.txt`
- Calculator pages are generated from the central registry in `data/calculators.ts`
- Embed routes are marked `noindex` so they do not compete with the main calculator pages

## Architecture overview

- `app/`: App Router routes, root layout, sitemap, embed routes, trust pages, API routes, and the dynamic calculator page
- `components/`: Shared UI, home page sections, feedback, embed controls, and calculator-specific components
- `components/calculators/`: Calculator UIs and shared calculator UX primitives
- `data/calculators.ts`: Central calculator registry for routing, metadata, categories, FAQs, examples, and related links
- `data/calculator-guidance.ts`: Calculator-specific considerations, tips, and assumptions
- `data/subtopic-hubs.ts`: Crawlable subtopic hub definitions
- `lib/calculators/`: Pure calculation logic separated from rendering
- `lib/hooks/`: Client-side hooks for theme, recent calculators, and shareable URL state

## Embeds

Every calculator page includes an embed generator. Embed routes live under:

```text
/embed/[slug]
```

Supported query flags currently include:

```text
title=0
compact=1
powered=0
actions=0
examples=0
compare=0
results=0
insights=0
charts=0
tables=0
```

Example:

```text
https://calcatlas.app/embed/mortgage-calculator?title=0&charts=0&tables=0
```

## Contact and feedback

- Contact form posts to `app/api/contact/route.ts`
- Calculator feedback posts to `app/api/calculator-feedback/route.ts`
- Both flows stay server-side and do not expose destination email addresses in the client

## Analytics and AI

- Google Analytics is mounted from `components/google-analytics.tsx`
- AI comparison summaries are served through `app/api/decision-summary/route.ts`
- Comparison-enabled calculators fall back gracefully if AI is unavailable

## Adding more calculators

1. Add the calculator definition, FAQs, examples, category, related links, and search terms in `data/calculators.ts`
2. Add calculator-specific guidance in `data/calculator-guidance.ts` if needed
3. Add the math in `lib/calculators/`
4. Create or reuse a UI in `components/calculators/`
5. Register the component in `components/calculators/calculator-renderer.tsx`

## Branding edits

- Site name and canonical base: `lib/site.ts`
- Metadata defaults and OG behavior: `lib/seo.ts`
- Header and footer branding: `components/site-header.tsx` and `components/site-footer.tsx`
- Homepage hero and discovery structure: `app/page.tsx`
- Favicon/icon: `app/icon.svg`
- Dynamic sharing images: `app/opengraph-image.tsx` and `app/[slug]/opengraph-image.tsx`
- Global styling: `app/globals.css`

## Notes

- Results update live and are stored in query params for shareable calculator URLs
- Recently used calculators are saved locally in the browser
- Dark mode is handled entirely on the frontend
- Category and subtopic hubs are intended to support both user discovery and organic search clustering
