import { NextResponse } from "next/server";

type OpenRouterModel = {
  id: string;
  name?: string;
};

export async function GET() {
  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json(
      { error: "Missing OPENROUTER_API_KEY server environment variable" },
      { status: 500 }
    );
  }

  const response = await fetch("https://openrouter.ai/api/v1/models", {
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    // Ensure this is not cached between deploys so the list stays fresh.
    cache: "no-store",
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Failed to fetch models from OpenRouter" },
      { status: response.status }
    );
  }

  const json = (await response.json()) as { data?: OpenRouterModel[] };
  
  // Filter models: only keep Gemini (Google), OpenAI, DeepSeek, and Flux models
  const allowedPrefixes = ["google/", "openai/", "deepseek/"];
  const allowedModels = (json.data ?? []).filter((model) => {
    const id = model.id.toLowerCase();
    // Check if it starts with allowed prefix
    if (allowedPrefixes.some(prefix => id.startsWith(prefix))) {
      return true;
    }
    // Check if it's a Flux model (diffusion)
    if (id.includes("flux")) {
      return true;
    }
    return false;
  });

  const models = allowedModels.map((model) => ({
    id: model.id,
    name: model.name ?? model.id,
  }));

  return NextResponse.json({ models });
}
