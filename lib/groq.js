"use client";

import { parseJsonFromAI } from "./utils";

export async function callGroq({
  apiKey,
  model,
  prompt,
  systemPrompt = "You are an expert technical interviewer and career coach. Always respond with valid JSON when asked.",
  temperature = 0.7,
  maxTokens = 4096,
}) {
  if (!apiKey?.trim()) {
    throw new Error(
      "Groq API key is required. Add it in Settings (free at console.groq.com)."
    );
  }

  const response = await fetch("/api/groq", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      apiKey,
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      temperature,
      max_tokens: maxTokens,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to call Groq API");
  }

  return data.content;
}

export async function callGroqJSON(options) {
  const content = await callGroq(options);
  const parsed = parseJsonFromAI(content);
  if (!parsed) {
    throw new Error("AI returned invalid JSON. Please try again.");
  }
  return parsed;
}
