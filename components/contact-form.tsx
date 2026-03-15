"use client";

import { useState, useTransition } from "react";

const topics = [
  "Calculator suggestion",
  "Correction or bug report",
  "Methodology question",
  "Partnership or business",
  "General feedback"
];

export function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message: string }>({
    type: "idle",
    message: ""
  });
  const [values, setValues] = useState({
    name: "",
    email: "",
    topic: topics[0],
    message: "",
    company: ""
  });

  function updateValue(field: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ type: "idle", message: "" });

    startTransition(async () => {
      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(values)
        });

        const data = (await response.json()) as { message?: string };

        if (!response.ok) {
          setStatus({
            type: "error",
            message: data.message || "Something went wrong while sending your message."
          });
          return;
        }

        setStatus({
          type: "success",
          message: data.message || "Your message has been sent."
        });
        setValues({
          name: "",
          email: "",
          topic: topics[0],
          message: "",
          company: ""
        });
      } catch {
        setStatus({
          type: "error",
          message: "The message could not be sent right now. Please try again in a moment."
        });
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="surface p-6 md:p-8">
      <div className="space-y-2">
        <span className="section-label">Contact form</span>
        <h2 className="font-display text-3xl font-semibold">Send a message</h2>
        <p className="text-sm leading-7 md:text-base">
          Use this form for calculator suggestions, corrections, and product questions. Messages are delivered privately and the destination inbox is not exposed on the public page.
        </p>
      </div>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-900 dark:text-white">Name</span>
          <input
            className="input-base h-12 px-4"
            value={values.name}
            onChange={(event) => updateValue("name", event.target.value)}
            autoComplete="name"
            maxLength={80}
            required
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-900 dark:text-white">Email</span>
          <input
            type="email"
            className="input-base h-12 px-4"
            value={values.email}
            onChange={(event) => updateValue("email", event.target.value)}
            autoComplete="email"
            maxLength={120}
            required
          />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-medium text-slate-900 dark:text-white">Topic</span>
          <select
            className="input-base h-12 px-4"
            value={values.topic}
            onChange={(event) => updateValue("topic", event.target.value)}
          >
            {topics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </label>
        <label className="hidden" aria-hidden="true">
          <span>Company</span>
          <input
            tabIndex={-1}
            autoComplete="off"
            value={values.company}
            onChange={(event) => updateValue("company", event.target.value)}
          />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-medium text-slate-900 dark:text-white">Message</span>
          <textarea
            className="input-base min-h-40 px-4 py-3"
            value={values.message}
            onChange={(event) => updateValue("message", event.target.value)}
            maxLength={3000}
            required
          />
        </label>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button type="submit" disabled={isPending} className="button-base bg-accent text-white hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-70 dark:text-slate-950">
          {isPending ? "Sending..." : "Send message"}
        </button>
        <p className="text-sm text-muted">We recommend including the calculator page URL and your input values when reporting an issue.</p>
      </div>
      {status.type !== "idle" ? (
        <div
          className={`mt-5 rounded-2xl border px-4 py-3 text-sm ${
            status.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          {status.message}
        </div>
      ) : null}
    </form>
  );
}
