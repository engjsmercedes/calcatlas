"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="page-shell py-24">
      <div className="surface max-w-2xl p-8 md:p-10">
        <span className="section-label">Something went wrong</span>
        <h1 className="mt-4 text-4xl font-semibold">This page ran into an error.</h1>
        <p className="mt-4 text-sm leading-7">
          An unexpected error occurred while loading this page. You can try reloading it or return to the calculator library.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={reset}
            className="button-base bg-accent text-white hover:bg-cyan-700 dark:text-slate-950"
          >
            Try again
          </button>
          <Link href="/calculators" className="button-base border border-border hover:bg-surface-hover">
            Back to all calculators
          </Link>
        </div>
      </div>
    </section>
  );
}
