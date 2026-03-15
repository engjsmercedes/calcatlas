import Link from "next/link";

import { siteConfig } from "@/lib/site";

import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  return (
    <header className="print-hidden sticky top-0 z-40 border-b border-border/80 bg-canvas/80 backdrop-blur-xl">
      <div className="page-shell flex items-center justify-between gap-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent text-sm font-bold text-white dark:text-slate-950">
            CA
          </span>
          <div>
            <p className="text-base font-semibold text-slate-950 dark:text-white">{siteConfig.name}</p>
            <p className="text-xs text-muted">Fast calculators for real decisions</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-5 md:flex">
          {siteConfig.nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-muted transition hover:text-accent">
              {item.label}
            </Link>
          ))}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
