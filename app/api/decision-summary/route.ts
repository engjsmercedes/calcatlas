import { NextResponse } from "next/server";

interface SummaryPayload {
  calculator?: string;
  prompt?: string;
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.AI_SUMMARY_MODEL || "gpt-4o-mini";

  if (!apiKey) {
    return NextResponse.json({ message: "AI summaries are not configured.", summary: null, status: "unavailable" }, { status: 200 });
  }

  let body: SummaryPayload;
  try {
    body = (await request.json()) as SummaryPayload;
  } catch {
    return NextResponse.json({ message: "Invalid request body.", summary: null, status: "error" }, { status: 400 });
  }

  const calculator = body.calculator?.trim() || "Calculator";
  const prompt = body.prompt?.trim() || "";

  if (!prompt) {
    return NextResponse.json({ message: "Missing summary prompt.", summary: null, status: "error" }, { status: 400 });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        max_tokens: 120,
        messages: [
          {
            role: "system",
            content:
              "You write concise, practical calculator decision summaries. Keep the answer to 2 sentences max. Be specific about tradeoffs. Do not mention being an AI."
          },
          {
            role: "user",
            content: `Calculator: ${calculator}\n\nExisting comparison details:\n${prompt}\n\nRewrite this into a sharper recommendation for a non-expert making a decision.`
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ message: `AI provider error: ${errorText}`, summary: null, status: "error" }, { status: 502 });
    }

    const data = (await response.json()) as {
      choices?: Array<{
        message?: {
          content?: string;
        };
      }>;
    };

    const summary = data.choices?.[0]?.message?.content?.trim() || null;

    return NextResponse.json({ summary, status: summary ? "ready" : "unavailable" });
  } catch {
    return NextResponse.json({ message: "Unexpected error contacting AI provider.", summary: null, status: "error" }, { status: 500 });
  }
}
