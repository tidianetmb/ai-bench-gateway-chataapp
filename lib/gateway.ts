import { createOpenAI } from "@ai-sdk/openai";

// OpenRouter is OpenAI-compatible, so we can use the OpenAI provider
export const gateway = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});
