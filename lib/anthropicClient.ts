import Anthropic from "@anthropic-ai/sdk";

/**
 * Server-only Anthropic client. Imported exclusively by /app/api routes, so the
 * ANTHROPIC_API_KEY never reaches the client bundle.
 *
 * Model: current Sonnet. Low temperature + tight max_tokens for fast, consistent
 * intake/match responses. Thinking disabled — this is structured extraction, not
 * open-ended reasoning, so we want speed.
 */
export const MODEL = "claude-sonnet-4-6";

let client: Anthropic | null = null;

export function getAnthropic(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY ontbreekt in de server-omgeving.");
  }
  client ??= new Anthropic(); // reads ANTHROPIC_API_KEY from env
  return client;
}

/**
 * Robust JSON extraction: structured outputs already return schema-valid JSON,
 * but we strip code fences and fall back to the first {...} block just in case.
 */
export function extractJson<T>(text: string): T {
  const trimmed = text.trim();
  const unfenced = trimmed
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  try {
    return JSON.parse(unfenced) as T;
  } catch {
    const match = unfenced.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]) as T;
    throw new Error("Kon geen geldige JSON uit het modelantwoord halen.");
  }
}

/** Pull the concatenated text from a Messages API response. */
export function responseText(message: Anthropic.Message): string {
  return message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");
}
