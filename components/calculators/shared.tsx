"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

export function CalculatorActions({
  onReset,
  onShare,
  hasActiveValues
}: {
  onReset: () => void;
  onShare: () => Promise<void>;
  hasActiveValues: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    await onShare();
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="print-hidden flex flex-wrap items-center gap-3">
      <Button variant="primary" type="button" onClick={handleShare} disabled={!hasActiveValues}>
        {copied ? "Link copied" : "Copy share link"}
      </Button>
      <Button variant="secondary" type="button" onClick={() => window.print()} disabled={!hasActiveValues}>
        Print result
      </Button>
      <Button variant="ghost" type="button" onClick={onReset}>
        Reset
      </Button>
    </div>
  );
}

export function EmptyCalculatorState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-white/40 p-6 dark:bg-slate-950/20">
      <p className="text-base font-semibold text-slate-950 dark:text-white">{title}</p>
      <p className="mt-2 text-sm leading-7">{body}</p>
    </div>
  );
}

export function InsightPanel({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-3xl border border-accent/15 bg-accent-soft p-5">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">{title}</p>
      <p className="mt-2 text-sm leading-7 text-slate-700 dark:text-slate-200">{body}</p>
    </div>
  );
}
