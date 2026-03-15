import { NextResponse } from "next/server";

interface ContactPayload {
  name?: string;
  email?: string;
  topic?: string;
  message?: string;
  company?: string;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
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

  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Topic: ${topic}`,
    "",
    message
  ].join("\n");

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
    return NextResponse.json(
      { message: `Email provider error: ${errorText}` },
      { status: 502 }
    );
  }

  return NextResponse.json({ message: "Thanks. Your message has been sent." });
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
