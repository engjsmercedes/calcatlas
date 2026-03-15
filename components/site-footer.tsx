import Link from "next/link";

import { calculatorCategoryPages, calculators } from "@/data/calculators";
import { trustPageLinks } from "@/data/static-pages";
import { siteConfig } from "@/lib/site";

import { LogoMark } from "./logo-mark";

const featuredCalculators = calculators.slice(0, 6);

export function SiteFooter() {
  return (
    <footer className="print-hidden border-t border-border/80 py-12">
      <div className="page-shell grid gap-10 lg:grid-cols-[1.1fr_0.9fr_1fr]">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <LogoMark className="h-10 w-10 shrink-0" />
            <div>
              <p className="text-lg font-semibold text-slate-950 dark:text-white">{siteConfig.name}</p>
              <p className="text-xs text-muted">Fast calculators for real decisions</p>
            </div>
          </div>
          <p className="max-w-xl text-sm leading-7">
            A calculator library designed for speed, clarity, and search intent. Each tool is lightweight, shareable, and built to expand cleanly.
          </p>
          <div className="flex flex-wrap gap-2 text-xs text-muted">
            {calculatorCategoryPages.map((category) => (
              <Link key={category.slug} href={`/${category.slug}`} className="rounded-full border border-border px-3 py-1 transition hover:border-accent hover:text-accent">
                {category.category}
              </Link>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">Company and trust</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {trustPageLinks.map((page) => (
              <Link key={page.href} href={page.href} className="text-sm text-muted transition hover:text-accent">
                {page.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">Popular calculators</h2>
          <div className="grid gap-3">
            {featuredCalculators.map((calculator) => (
              <Link key={calculator.slug} href={`/${calculator.slug}`} className="text-sm text-muted transition hover:text-accent">
                {calculator.title}
              </Link>
            ))}
            <Link href="/calculators" className="text-sm font-medium text-accent transition hover:text-cyan-700">
              Browse all calculators
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
