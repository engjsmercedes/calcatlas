import { NextResponse } from "next/server";

interface ContactPayload {
  name?: string;
  email?: string;
  topic?: string;
  message?: string;
  company?: string;
}

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;

const rateLimitStore =
  (globalThis as typeof globalThis & { __contactRateLimitStore?: Map<string, RateLimitEntry> }).__contactRateLimitStore ??
  new Map<string, RateLimitEntry>();

(globalThis as typeof globalThis & { __contactRateLimitStore?: Map<string, RateLimitEntry> }).__contactRateLimitStore = rateLimitStore;

export async function POST(request: Request) {
  const clientKey = getClientKey(request);
  const limit = enforceRateLimit(clientKey);

  if (!limit.allowed) {
    return NextResponse.json(
      { message: "Too many contact attempts from this browser or network. Please wait a few minutes and try again." },
      {
        status: 429,
        headers: {
          "Retry-After": String(limit.retryAfterSeconds)
        }
      }
    );
  }

  const body = (await request.json()) as ContactPayload;

  const name = body.name?.trim() || "";
  const email = body.email?.trim() || "";
  const topic = body.topic?.trim() || "General feedback";
  const message = body.message?.trim() || "";
  const company = body.company?.trim() || "";

  if (company) {
    return NextResponse.json({ message: "Message sent." });
  }

  if (!name || !email || !message) {
    return NextResponse.json({ message: "Please complete all required fields." }, { status: 400 });
  }

  if (!emailPattern.test(email)) {
    return NextResponse.json({ message: "Enter a valid email address." }, { status: 400 });
  }

  if (name.length > 80 || email.length > 120 || topic.length > 120 || message.length > 3000) {
    return NextResponse.json({ message: "One or more fields are too long." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL || "Calc Atlas <onboarding@resend.dev>";

  if (!apiKey || !to) {
    return NextResponse.json(
      { message: "Contact form is not configured yet. Add the server email settings in Vercel." },
      { status: 500 }
    );
  }

  const text = [`Name: ${name}`, `Email: ${email}`, `Topic: ${topic}`, "", message].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
      <h2 style="margin-bottom: 16px;">New Calc Atlas contact message</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Topic:</strong> ${escapeHtml(topic)}</p>
      <hr style="margin: 24px 0; border: 0; border-top: 1px solid #e2e8f0;" />
      <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
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
      reply_to: email,
      subject: `Calc Atlas contact: ${topic}`,
      text,
      html
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    return NextResponse.json({ message: `Email provider error: ${errorText}` }, { status: 502 });
  }

  return NextResponse.json({ message: "Thanks. Your message has been sent." });
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
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (existing.count >= MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000))
    };
  }

  existing.count += 1;
  rateLimitStore.set(key, existing);
  return { allowed: true, retryAfterSeconds: 0 };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
