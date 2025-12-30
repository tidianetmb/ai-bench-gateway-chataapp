import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { DEFAULT_MODEL } from "@/lib/constants";
import { gateway } from "@/lib/gateway";
import { NextResponse } from "next/server";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "Missing OPENROUTER_API_KEY server environment variable" },
        { status: 500 }
      );
    }

    const {
      messages,
      modelId = DEFAULT_MODEL,
    }: { messages: UIMessage[]; modelId: string } = await req.json();

    const result = streamText({
      model: gateway(modelId),
      system: "You are a software engineer exploring Generative AI.",
      messages: convertToModelMessages(messages),
      onError: (e) => {
        console.error("Error while streaming.", e);
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error in POST /api/chat:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred while processing the request" },
      { status: 500 }
    );
  }
}
