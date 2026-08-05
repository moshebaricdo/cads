/**
 * Optional team AI defaults injected at build time (see scripts/build.mjs).
 * When set, the plugin enables AI without each designer pasting a key.
 *
 * Define via .env (never commit real keys):
 *   CADS_AUDIT_AI_API_KEY=
 *   CADS_AUDIT_AI_PROVIDER=anthropic|openai
 *   CADS_AUDIT_AI_MODEL=
 */
import type { AiProvider, AiSettings } from "./messages";
import { DEFAULT_AI_MODELS } from "./messages";

declare const __CADS_TEAM_AI_KEY__: string;
declare const __CADS_TEAM_AI_PROVIDER__: string;
declare const __CADS_TEAM_AI_MODEL__: string;

function readDefine(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function getTeamAiSettings(): AiSettings | null {
  const apiKey = readDefine(
    typeof __CADS_TEAM_AI_KEY__ !== "undefined" ? __CADS_TEAM_AI_KEY__ : "",
  );
  if (!apiKey) return null;
  const providerRaw = readDefine(
    typeof __CADS_TEAM_AI_PROVIDER__ !== "undefined"
      ? __CADS_TEAM_AI_PROVIDER__
      : "anthropic",
  ).toLowerCase();
  const provider: AiProvider =
    providerRaw === "openai" ? "openai" : "anthropic";
  const model =
    readDefine(
      typeof __CADS_TEAM_AI_MODEL__ !== "undefined" ? __CADS_TEAM_AI_MODEL__ : "",
    ) || DEFAULT_AI_MODELS[provider];
  return { provider, model, apiKey };
}

/** True when build embedded a team key (UI can hide the paste step). */
export function hasTeamAiKey(): boolean {
  return getTeamAiSettings() != null;
}
