/**
 * Optional AI mapping suggestions. Runs in the UI iframe with the team or
 * user API key; requests go directly to the provider (see manifest networkAccess).
 */
import type { AiSettings } from "../shared/messages";
import type { ColorSurface } from "../shared/surfaces";

export interface AiSourceInput {
  sourceId: string;
  name: string;
  type: string;
  /** modeName -> value */
  values: Record<string, string>;
  /** e.g. "used 12× on fills of Button, Card / inside instances: 3" */
  usageSummary: string;
  /** COLOR context — omitted for non-color sources. */
  surface?: ColorSurface;
  /** Majority fill behind usages: chromatic (brand/accent) vs neutral. */
  backdrop?: "chromatic" | "neutral" | "unknown";
  /** Assumed CADS Light/Dark for theme-aware tokens. */
  themeAssumption?: "light" | "dark";
  groupLabel?: string;
}

export interface AiTargetInput {
  name: string;
  type: string;
  /** Slim values — prefer light/dark hex only for colors. */
  values: Record<string, string>;
}

export interface AiSuggestion {
  sourceId: string;
  targetName: string | null;
  confidence: number;
  rationale: string;
}

const BATCH_SIZE = 16;

function buildPrompt(sources: AiSourceInput[], targets: AiTargetInput[]): string {
  const hasColor = sources.some((source) => source.type === "COLOR");
  const hasComponent = sources.some((source) => source.type === "COMPONENT");
  const lines = [
    "You map design tokens / components from legacy design systems onto CADS.",
    "For each SOURCE, pick the best TARGET name, or null if nothing fits.",
    "Return ONLY exact names from TARGETS (copy spelling exactly), or null.",
    "Never invent names that are not in TARGETS.",
    "",
  ];

  if (hasColor) {
    lines.push(
      "COLOR RULES:",
      "- TARGETS are semantic CADS color variables only (never primitives).",
      "- Each SOURCE already has a surface (text/background/border). ONLY pick a TARGET whose name starts with that surface prefix (text/, background/, or border/).",
      "- Use backdrop and themeAssumption for white/black and neutrals.",
      "- White/black on chromatic primary chrome (brand/accent/sentiment) → *-fixed (e.g. text/neutral/white-fixed).",
      "- Otherwise theme-aware: under Light, white text → text/neutral/primary-inverse; under Dark, white text → text/neutral/primary.",
      "- Under Dark, dark neutral surfaces → background/neutral/primary (not primary-inverse).",
      "- Prefer role over hex closeness.",
      "",
    );
  }

  if (hasComponent) {
    lines.push(
      "COMPONENT RULES:",
      "- Pick the closest published CADS component name from TARGETS.",
      "- Prefer exact / near-exact product role (Button→Button, Alert→Alert).",
      "- If nothing is a reasonable successor, return null.",
      "",
    );
  }

  lines.push(
    "Respond with ONLY a JSON array, no prose, no code fences. Each element:",
    '{"sourceId": string, "targetName": string | null, "confidence": number between 0 and 1, "rationale": short string}',
    "",
    "SOURCES:",
    JSON.stringify(sources),
    "",
    "TARGETS:",
    JSON.stringify(targets),
  );

  return lines.join("\n");
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
      max_tokens: 4096,
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

async function requestOneBatch(
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

/**
 * Filter targets to the source's surface (colors) to shrink the prompt and
 * prevent cross-surface hallucinations.
 */
export function targetsForSource(
  source: AiSourceInput,
  allTargets: AiTargetInput[],
): AiTargetInput[] {
  if (source.type === "COLOR" && source.surface) {
    const prefix = `${source.surface}/`;
    const filtered = allTargets.filter(
      (t) => t.type === "COLOR" && t.name.toLowerCase().startsWith(prefix),
    );
    return filtered.length > 0 ? filtered : allTargets.filter((t) => t.type === "COLOR");
  }
  if (source.type === "COMPONENT") {
    return allTargets.filter((t) => t.type === "COMPONENT");
  }
  return allTargets.filter((t) => t.type === source.type);
}

/**
 * Request AI suggestions. Batches sources and runs batches in parallel.
 * Callers must validate returned targetName against the real CADS catalog.
 */
export async function requestAiSuggestions(
  settings: AiSettings,
  sources: AiSourceInput[],
  targets: AiTargetInput[],
): Promise<AiSuggestion[]> {
  if (sources.length === 0) return [];

  // Group by type+surface so each batch gets a tight target list.
  const groups = new Map<string, AiSourceInput[]>();
  for (const source of sources) {
    const key = `${source.type}:${source.surface ?? "*"}`;
    const list = groups.get(key) ?? [];
    list.push(source);
    groups.set(key, list);
  }

  const jobs: Promise<AiSuggestion[]>[] = [];
  for (const group of groups.values()) {
    const groupTargets = targetsForSource(group[0], targets);
    for (let i = 0; i < group.length; i += BATCH_SIZE) {
      const batch = group.slice(i, i + BATCH_SIZE);
      jobs.push(requestOneBatch(settings, batch, groupTargets));
    }
  }

  const results = await Promise.all(jobs);
  const merged: AiSuggestion[] = [];
  for (const batch of results) merged.push(...batch);
  return merged;
}
