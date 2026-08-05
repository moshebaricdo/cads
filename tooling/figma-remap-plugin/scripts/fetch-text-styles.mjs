#!/usr/bin/env node
/**
 * Regenerate src/data/cadsTextStyles.ts from the CADS Figma file's published
 * text styles via the REST API. Requires FIGMA_ACCESS_TOKEN (File content
 * Read scope) in the environment or the repo-root .env.
 *
 * Designers don't need this: the plugin's "Capture text styles" button inside
 * the CADS library file does the same thing without a token.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const repoRoot = join(root, "../..");

const FILE_KEY = "DGekOeToRVifvFAhfqpeC1";

function readToken() {
  if (process.env.FIGMA_ACCESS_TOKEN) return process.env.FIGMA_ACCESS_TOKEN;
  try {
    const env = readFileSync(join(repoRoot, ".env"), "utf8");
    const match = env.match(/^FIGMA_ACCESS_TOKEN=(.+)$/m);
    if (match) return match[1].trim();
  } catch {
    // no .env
  }
  return null;
}

const token = readToken();
if (!token) {
  console.error(
    "FIGMA_ACCESS_TOKEN not found (env or repo-root .env). Aborting — the plugin's in-file capture mode works without a token.",
  );
  process.exit(1);
}

const response = await fetch(`https://api.figma.com/v1/files/${FILE_KEY}/styles`, {
  headers: { "X-Figma-Token": token },
});
if (!response.ok) {
  console.error(`Figma API error ${response.status}: ${await response.text()}`);
  process.exit(1);
}
const data = await response.json();
const styles = (data.meta?.styles ?? [])
  .filter((style) => style.style_type === "TEXT")
  .map((style) => ({ key: style.key, name: style.name }))
  .sort((a, b) => a.name.localeCompare(b.name));

const outPath = join(root, "src/data/cadsTextStyles.ts");
const contents = `/**
 * Baked CADS text-style catalog (published style keys from the CADS Figma
 * library). Regenerate with \`node scripts/fetch-text-styles.mjs\` (requires
 * FIGMA_ACCESS_TOKEN), or capture live from inside the CADS library file via
 * the plugin's "Capture text styles" button — a capture always takes
 * precedence over this baked list.
 *
 * GENERATED FILE — do not hand-edit style entries.
 */
export interface BakedTextStyle {
  key: string;
  name: string;
}

export const CADS_FILE_KEY = ${JSON.stringify(FILE_KEY)};

export const bakedFetchedAt: string | null = ${JSON.stringify(new Date().toISOString())};

export const bakedTextStyles: BakedTextStyle[] = ${JSON.stringify(styles, null, 2)};
`;
writeFileSync(outPath, contents);
console.log(`Wrote ${styles.length} text styles to src/data/cadsTextStyles.ts`);
