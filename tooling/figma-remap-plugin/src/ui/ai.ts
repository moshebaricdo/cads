/**
 * Optional AI mapping suggestions. Runs in the UI iframe with the user's own
 * API key; requests go directly to the provider (see manifest networkAccess).
 */
import type { AiSettings } from "../shared/messages";

export interface AiSourceInput {
  sourceId: string;
  name: string;
  type: string;
  /** modeName -> value */
  values: Record<string, string>;
  /** e.g. "used 12× on fills of Button, Card / inside instances: 3" */
  usageSummary: string;
}

export interface AiTargetInput {
  name: string;
  type: string;
  values: Record<string, string>;
}

export interface AiSuggestion {
  sourceId: string;
  targetName: string | null;
  confidence: number;
  rationale: string;
}

function buildPrompt(sources: AiSourceInput[], targets: AiTargetInput[]): string {
  return [
    "You map design tokens from legacy design systems onto a new source-of-truth Figma variable library.",
    "For each SOURCE, pick the best TARGET variable name, or null if nothing fits.",
    "Prefer semantic intent over raw value equality: a primitive gray used as body text should map to the semantic text token, not another primitive.",
    "Use the usage context (which properties and layers consume the token) to infer the semantic role.",
    "",
    "Respond with ONLY a JSON array, no prose, no code fences. Each element:",
    '{"sourceId": string, "targetName": string | null, "confidence": number between 0 and 1, "rationale": short string}',
    "",
    "SOURCES:",
    JSON.stringify(sources, null, 1),
    "",
    "TARGETS:",
    JSON.stringify(targets, null, 1),
  ].join("\n");
}

function parseSuggestions(text: string): AiSuggestion[] {
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();
  const start = cleaned.indexOf("[");
  const end = cleaned.lastIndexOf("]");
  if (start === -1 || end === -1) throw new Error("AI returned no JSON array");
  const parsed = JSON.parse(cleaned.slice(start, end + 1)) as unknown[];
  return parsed
    .filter(
      (item): item is Record<string, unknown> =>
        typeof item === "object" && item !== null,
    )
    .map((item) => ({
      sourceId: String(item.sourceId ?? ""),
      targetName:
        item.targetName === null || item.targetName === undefined
          ? null
          : String(item.targetName),
      confidence:
        typeof item.confidence === "number"
          ? Math.max(0, Math.min(1, item.confidence))
          : 0.5,
      rationale: String(item.rationale ?? ""),
    }))
    .filter((s) => s.sourceId);
}

async function callAnthropic(settings: AiSettings, prompt: string): Promise<string> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": settings.apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: settings.model,
      max_tokens: 8192,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!response.ok) {
    throw new Error(`Anthropic API error ${response.status}: ${await response.text()}`);
  }
  const data = (await response.json()) as {
    content: { type: string; text?: string }[];
  };
  return data.content.map((c) => c.text ?? "").join("");
}

async function callOpenAi(settings: AiSettings, prompt: string): Promise<string> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${settings.apiKey}`,
    },
    body: JSON.stringify({
      model: settings.model,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!response.ok) {
    throw new Error(`OpenAI API error ${response.status}: ${await response.text()}`);
  }
  const data = (await response.json()) as {
    choices: { message: { content: string } }[];
  };
  return data.choices[0]?.message?.content ?? "";
}

export async function requestAiSuggestions(
  settings: AiSettings,
  sources: AiSourceInput[],
  targets: AiTargetInput[],
): Promise<AiSuggestion[]> {
  const prompt = buildPrompt(sources, targets);
  const text =
    settings.provider === "anthropic"
      ? await callAnthropic(settings, prompt)
      : await callOpenAi(settings, prompt);
  return parseSuggestions(text);
}
