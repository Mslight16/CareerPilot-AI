import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { apiKey, model, messages, temperature = 0.7, max_tokens = 4096 } =
      await request.json();

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: model || "openai/gpt-oss-120b",
          messages,
          temperature,
          max_tokens,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || "Groq API error" },
        { status: response.status }
      );
    }

    const content = data.choices?.[0]?.message?.content || "";
    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
