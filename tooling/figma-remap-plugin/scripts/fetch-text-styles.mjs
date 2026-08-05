#!/usr/bin/env node
/**
 * Regenerate src/data/cadsTextStyles.ts from the CADS Figma file's published
 * text styles via the REST API. Requires FIGMA_ACCESS_TOKEN (File content
 * Read scope) in the environment or the repo-root .env.
 *
 * REST only returns key + name. Existing baked `values` (font metrics) are
 * preserved by key so load-time imports stay skipped. Refresh metrics via
 * Figma MCP / in-file capture when the type ramp changes.
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

/** Pull previously baked values by key so REST refresh doesn't drop metrics. */
function readExistingValues(outPath) {
  try {
    const src = readFileSync(outPath, "utf8");
    const match = src.match(
      /export const bakedTextStyles: BakedTextStyle\[] = (\[[\s\S]*?\]);/,
    );
    if (!match) return new Map();
    const parsed = JSON.parse(match[1]);
    return new Map(
      parsed
        .filter((entry) => entry?.key && entry?.values)
        .map((entry) => [entry.key, entry.values]),
    );
  } catch {
    return new Map();
  }
}

const token = readToken();
if (!token) {
  console.error(
    "FIGMA_ACCESS_TOKEN not found (env or repo-root .env). Aborting — harvest values via Figma MCP instead.",
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
const outPath = join(root, "src/data/cadsTextStyles.ts");
const existingValues = readExistingValues(outPath);

const familyOrder = {
  Heading: 0,
  Body: 1,
  Overline: 2,
  Link: 3,
  Label: 4,
  Mono: 5,
};

const styles = (data.meta?.styles ?? [])
  .filter((style) => style.style_type === "TEXT")
  .map((style) => {
    const values = existingValues.get(style.key);
    return values
      ? { key: style.key, name: style.name, values }
      : { key: style.key, name: style.name };
  })
  .sort((a, b) => {
    const fa = a.name.split("/")[0];
    const fb = b.name.split("/")[0];
    const oa = familyOrder[fa] ?? 99;
    const ob = familyOrder[fb] ?? 99;
    if (oa !== ob) return oa - ob;
    return a.name.localeCompare(b.name);
  });

const missingValues = styles.filter((s) => !s.values).length;

const contents = `/**
 * Baked CADS text-style catalog (published style keys + font metrics from the
 * CADS Figma library). Metrics let the plugin skip importStyleByKeyAsync at
 * load time — apply still imports styles lazily when remapping.
 *
 * Regenerate keys via \`node scripts/fetch-text-styles.mjs\` (REST; preserves
 * existing values by key). Refresh values from the open CADS file via Figma
 * MCP / plugin capture.
 *
 * GENERATED FILE — do not hand-edit style entries.
 */
export interface BakedTextStyle {
  key: string;
  name: string;
  /** Font metrics for matching/display. When present, load skips style import. */
  values?: Record<string, string>;
}

export const CADS_FILE_KEY = ${JSON.stringify(FILE_KEY)};

export const bakedFetchedAt: string | null = ${JSON.stringify(new Date().toISOString())};

export const bakedTextStyles: BakedTextStyle[] = ${JSON.stringify(styles, null, 2)};
`;
writeFileSync(outPath, contents);
console.log(
  `Wrote ${styles.length} text styles to src/data/cadsTextStyles.ts` +
    (missingValues
      ? ` (${missingValues} missing values — will import at load until refreshed)`
      : " (all have baked values)"),
);
