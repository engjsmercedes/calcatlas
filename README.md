# Calc Atlas

Calc Atlas is a production-ready calculator website built with Next.js, TypeScript, and Tailwind CSS. It currently ships with 16 calculators across finance, business, income, health, and everyday categories, with a reusable architecture for expanding the library later.

## Included calculators

- Percentage Calculator
- Margin Calculator
- Mortgage Calculator
- ROI Calculator
- Compound Interest Calculator
- Salary to Hourly Calculator
- BMI Calculator
- Calorie Needs Calculator
- Body Fat Calculator
- Water Intake Calculator
- Ideal Weight Calculator
- Macro Calculator
- Protein Intake Calculator
- Sleep Cycle Calculator
- Running Pace Calculator
- One Rep Max Calculator

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

1. Push the project to a Git provider.
2. Import the repository into Vercel.
3. Set `NEXT_PUBLIC_SITE_URL` to your production domain.
4. If you want the contact form to send email, also set:
   - `RESEND_API_KEY`
   - `CONTACT_TO_EMAIL`
   - `CONTACT_FROM_EMAIL` (optional, defaults to `Calc Atlas <onboarding@resend.dev>` for Resend testing)
5. If you want Google Analytics page tracking, set `NEXT_PUBLIC_GA_ID` to your Google Analytics Measurement ID.
6. Deploy. The app uses static-friendly routes and frontend-only calculation logic, with a small server route only for contact form delivery.

## Contact form setup

The contact form posts to `app/api/contact/route.ts` and sends email through the Resend HTTP API. The destination email is not exposed in the client UI and should be stored only in Vercel environment variables.

Suggested values:

```text
CONTACT_TO_EMAIL=you@example.com
CONTACT_FROM_EMAIL=Calc Atlas <onboarding@resend.dev>
```

For production, replace the default sender with an address on a verified sending domain.

## Analytics setup

Set `NEXT_PUBLIC_GA_ID` to a Google Analytics 4 Measurement ID such as `G-XXXXXXXXXX`. The app will then send page views for the homepage, trust pages, calculator pages, and query-string-based calculator states.

## Architecture overview

- `app/`: Next.js App Router pages, layout, sitemap, robots, API route, and the dynamic calculator route.
- `components/`: Reusable UI, homepage sections, and calculator-specific interactive components.
- `data/calculators.ts`: Central registry for calculator metadata, content, categories, FAQs, examples, and related links.
- `lib/calculators/`: Pure calculation logic separated from the UI.
- `lib/hooks/`: Client-side hooks for theme, recent calculators, and shareable URL state.

## Adding more calculators

1. Add the new calculator metadata, FAQ content, examples, category, and related links in `data/calculators.ts`.
2. Add the new calculation logic in `lib/calculators/`.
3. Create a client component in `components/calculators/`.
4. Register the component in `components/calculators/calculator-renderer.tsx`.

## Branding edits

- Site name and base description: `lib/site.ts`
- Header and footer brand treatment: `components/site-header.tsx` and `components/site-footer.tsx`
- Homepage hero messaging: `app/page.tsx`
- Favicon/icon: `app/icon.svg`
- Colors and global styling: `app/globals.css`
- Dynamic sharing images: `app/opengraph-image.tsx` and `app/[slug]/opengraph-image.tsx`

## Notes

- Results update live and are stored in query params for shareable calculator URLs.
- Recently used calculators are saved locally in the browser.
- Dark mode is optional and handled entirely on the frontend.
