import { NextResponse } from "next/server";

import { buildCalculatorGuideResult } from "@/lib/calculator-guide";

interface GuidePayload {
  message?: string;
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.AI_SUMMARY_MODEL || "gpt-5-mini";
  const body = (await request.json()) as GuidePayload;
  const message = body.message?.trim() || "";

  if (!message) {
    return NextResponse.json({ message: "Missing guide request." }, { status: 400 });
  }

  const result = buildCalculatorGuideResult(message);
  let aiSummary: string | null = null;
  let aiStatus: "ready" | "unavailable" | "error" = "unavailable";

  if (apiKey) {
    try {
      const calculatorTitles = result.recommendedCalculators.map((calculator) => calculator?.title).filter(Boolean).join(", ");
      const hubTitle = result.recommendedHub?.title || "";
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model,
          temperature: 0.2,
          max_tokens: 140,
          messages: [
            {
              role: "system",
              content:
                "You help route users to the right calculators. Write two short sentences max. Explain why these tools are the best next step. Do not mention being an AI."
            },
            {
              role: "user",
              content: `User request: ${message}\nRecommended calculators: ${calculatorTitles || "none"}\nRecommended hub: ${hubTitle || "none"}\nDeterministic summary: ${result.summary}\nFollow-up: ${result.followUp}`
            }
          ]
        })
      });

      if (response.ok) {
        const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
        aiSummary = data.choices?.[0]?.message?.content?.trim() || null;
        aiStatus = aiSummary ? "ready" : "unavailable";
      } else {
        aiStatus = "error";
      }
    } catch {
      aiStatus = "error";
    }
  }

  return NextResponse.json({
    title: result.title,
    summary: aiSummary || result.summary,
    fallbackSummary: result.summary,
    followUp: result.followUp,
    aiStatus,
    recommendedCalculators: result.recommendedCalculators.map((calculator) => ({
      slug: calculator.slug,
      title: calculator.title,
      shortDescription: calculator.shortDescription,
      category: calculator.category,
      href: `/${calculator.slug}`
    })),
    recommendedHub: result.recommendedHub
      ? {
          slug: result.recommendedHub.slug,
          title: result.recommendedHub.title,
          shortDescription: result.recommendedHub.shortDescription,
          href: `/${result.recommendedHub.slug}`
        }
      : null,
    promptExamples: result.promptExamples
  });
}
