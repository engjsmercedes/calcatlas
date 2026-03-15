import { NextResponse } from "next/server";

interface FeedbackPayload {
  calculatorSlug?: string;
  calculatorTitle?: string;
  sentiment?: "up" | "down" | "report";
  pageUrl?: string;
  message?: string;
  email?: string;
}

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 8;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const rateLimitStore =
  (globalThis as typeof globalThis & { __calculatorFeedbackRateLimitStore?: Map<string, RateLimitEntry> }).__calculatorFeedbackRateLimitStore ??
  new Map<string, RateLimitEntry>();

(globalThis as typeof globalThis & { __calculatorFeedbackRateLimitStore?: Map<string, RateLimitEntry> }).__calculatorFeedbackRateLimitStore = rateLimitStore;

export async function POST(request: Request) {
  const clientKey = getClientKey(request);
  const limit = enforceRateLimit(clientKey);

  if (!limit.allowed) {
    return NextResponse.json(
      { message: "Too many feedback submissions from this browser or network. Please wait a few minutes and try again." },
      { status: 429 }
    );
  }

  const body = (await request.json()) as FeedbackPayload;
  const calculatorSlug = body.calculatorSlug?.trim() || "unknown-calculator";
  const calculatorTitle = body.calculatorTitle?.trim() || calculatorSlug;
  const sentiment = body.sentiment || "report";
  const pageUrl = body.pageUrl?.trim() || "unknown-url";
  const message = body.message?.trim() || "";
  const email = body.email?.trim() || "";

  if (!calculatorSlug || !calculatorTitle || !pageUrl) {
    return NextResponse.json({ message: "Missing calculator feedback details." }, { status: 400 });
  }

  if (sentiment === "report" && !message) {
    return NextResponse.json({ message: "Please include a short issue description." }, { status: 400 });
  }

  if (email && !emailPattern.test(email)) {
    return NextResponse.json({ message: "Enter a valid email address or leave it blank." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL || "Calc Atlas <onboarding@resend.dev>";

  if (!apiKey || !to) {
    return NextResponse.json({ message: "Feedback email is not configured yet." }, { status: 500 });
  }

  const subjectPrefix = sentiment === "up" ? "Thumbs up" : sentiment === "down" ? "Thumbs down" : "Issue report";
  const text = [
    `Calculator: ${calculatorTitle}`,
    `Slug: ${calculatorSlug}`,
    `Feedback: ${subjectPrefix}`,
    `Page URL: ${pageUrl}`,
    email ? `Email: ${email}` : "Email: not provided",
    "",
    message || "No additional note provided."
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
      <h2 style="margin-bottom: 16px;">Calculator feedback</h2>
      <p><strong>Calculator:</strong> ${escapeHtml(calculatorTitle)}</p>
      <p><strong>Slug:</strong> ${escapeHtml(calculatorSlug)}</p>
      <p><strong>Feedback:</strong> ${escapeHtml(subjectPrefix)}</p>
      <p><strong>Page URL:</strong> ${escapeHtml(pageUrl)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email || "not provided")}</p>
      <hr style="margin: 24px 0; border: 0; border-top: 1px solid #e2e8f0;" />
      <p style="white-space: pre-wrap;">${escapeHtml(message || "No additional note provided.")}</p>
    </div>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `Calc Atlas feedback: ${subjectPrefix} on ${calculatorTitle}`,
      text,
      html
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    return NextResponse.json({ message: `Email provider error: ${errorText}` }, { status: 502 });
  }

  return NextResponse.json({
    message: sentiment === "report" ? "Thanks. Your report has been sent." : "Thanks for the feedback."
  });
}

function getClientKey(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for") || "";
  const realIp = request.headers.get("x-real-ip") || "";
  const userAgent = request.headers.get("user-agent") || "unknown-agent";
  const ip = forwardedFor.split(",")[0]?.trim() || realIp || "unknown-ip";
  return `${ip}:${userAgent.slice(0, 120)}`;
}

function enforceRateLimit(key: string) {
  const now = Date.now();
  const existing = rateLimitStore.get(key);

  if (!existing || existing.resetAt <= now) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + WINDOW_MS
    });
    return { allowed: true };
  }

  if (existing.count >= MAX_REQUESTS) {
    return { allowed: false };
  }

  existing.count += 1;
  rateLimitStore.set(key, existing);
  return { allowed: true };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
