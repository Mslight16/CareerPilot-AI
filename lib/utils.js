import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getExperienceLabel(level) {
  if (level <= 1) return "Intern (0–1 Year)";
  if (level <= 2) return "1–2 Years";
  if (level <= 5) return "3–5 Years";
  if (level <= 8) return "5–8 Years";
  if (level <= 10) return "8–10 Years";
  return "10+ Years";
}

export function clampScore(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return 0;
  return Math.min(100, Math.max(0, Math.round(n)));
}

export function parseJsonFromAI(text) {
  const cleaned = text
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}
