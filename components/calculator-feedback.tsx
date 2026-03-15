"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";

export function CalculatorFeedback({
  calculatorSlug,
  calculatorTitle
}: {
  calculatorSlug: string;
  calculatorTitle: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [expanded, setExpanded] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string>("");

  function submit(sentiment: "up" | "down" | "report") {
    setStatus("");

    startTransition(async () => {
      try {
        const response = await fetch("/api/calculator-feedback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            calculatorSlug,
            calculatorTitle,
            sentiment,
            pageUrl: window.location.href,
            message: sentiment === "report" ? message : "",
            email
          })
        });

        const data = (await response.json()) as { message?: string };
        setStatus(data.message || (response.ok ? "Thanks for the feedback." : "Feedback could not be sent."));

        if (response.ok && sentiment === "report") {
          setMessage("");
          setEmail("");
          setExpanded(false);
        }
      } catch {
        setStatus("Feedback could not be sent right now. Please try again in a moment.");
      }
    });
  }

  return (
    <div className="surface space-y-4 p-6 md:p-8">
      <div className="space-y-2">
        <p className="section-label">Calculator feedback</p>
        <h2 className="font-display text-2xl font-semibold">Tell us if this calculator is working well</h2>
        <p className="text-sm leading-7 text-muted">
          Use quick feedback if the result looks right or flag an issue if something seems off. Reports include the current calculator URL so the scenario can be reviewed.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button type="button" variant="secondary" onClick={() => submit("up")} disabled={isPending}>
          Thumbs up
        </Button>
        <Button type="button" variant="secondary" onClick={() => submit("down")} disabled={isPending}>
          Thumbs down
        </Button>
        <Button type="button" variant="ghost" onClick={() => setExpanded((current) => !current)} disabled={isPending}>
          {expanded ? "Hide report form" : "Report an issue"}
        </Button>
      </div>
      {expanded ? (
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-slate-900 dark:text-white">What looks wrong?</span>
            <textarea
              className="input-base min-h-32 px-4 py-3"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              maxLength={2000}
              placeholder="Example: the mortgage calculator ignored 6.89% when I typed the percent sign."
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-900 dark:text-white">Email (optional)</span>
            <input
              type="email"
              className="input-base h-12 px-4"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
            />
          </label>
          <div className="flex items-end">
            <Button type="button" variant="primary" onClick={() => submit("report")} disabled={isPending || !message.trim()}>
              Send report
            </Button>
          </div>
        </div>
      ) : null}
      {status ? <p className="text-sm leading-7 text-muted">{status}</p> : null}
    </div>
  );
}
