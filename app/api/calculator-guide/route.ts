import { NextResponse } from "next/server";

import { buildCalculatorGuideResult } from "@/lib/calculator-guide";

interface GuidePayload {
  message?: string;
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const model = process.env.AI_SUMMARY_MODEL || "claude-haiku-4-5";
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
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model,
          max_tokens: 140,
          system: "You help route users to the right calculators. Write two short sentences max. Explain why these tools are the best next step. Do not mention being an AI.",
          messages: [
            {
              role: "user",
              content: `User request: ${message}\nRecommended calculators: ${calculatorTitles || "none"}\nRecommended hub: ${hubTitle || "none"}\nDeterministic summary: ${result.summary}\nFollow-up: ${result.followUp}`
            }
          ]
        })
      });

      if (response.ok) {
        const data = (await response.json()) as { content?: Array<{ type: string; text?: string }> };
        aiSummary = data.content?.find((b) => b.type === "text")?.text?.trim() || null;
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
