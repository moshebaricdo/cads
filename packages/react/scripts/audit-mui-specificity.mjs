#!/usr/bin/env node
/**
 * Guardrail: every CADS wrapper that mounts MUI Button / ButtonBase / IconButton
 * must bump CSS-module specificity with a double `:global(.Mui*-root)` so Emotion
 * cannot win the cascade in prod stylesheet order (local Turbopack often masks this).
 *
 * Exempt folders that intentionally style via Emotion `sx` instead of modules.
 *
 * Run: node packages/react/scripts/audit-mui-specificity.mjs
 * Wired into: pnpm --filter @codeai/cads-react typecheck
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const COMPONENTS_DIR = path.resolve(__dirname, "../src/components");

/** Folders that style MUI pressables via `sx` / Emotion, not CSS modules. */
const EXEMPT_DIRS = new Set([
  "pagination", // ButtonBase chrome is entirely in sx
]);

const RULES = [
  {
    id: "Button",
    importRe: /from\s+["']@mui\/material\/Button["']/,
    muiClass: "MuiButton-root",
  },
  {
    id: "ButtonBase",
    importRe: /from\s+["']@mui\/material\/ButtonBase["']/,
    muiClass: "MuiButtonBase-root",
  },
  {
    id: "IconButton",
    importRe: /from\s+["']@mui\/material\/IconButton["']/,
    muiClass: "MuiIconButton-root",
  },
];

function doubleGlobalPattern(muiClass) {
  // .foo:global(.MuiButtonBase-root):global(.MuiButtonBase-root)
  const escaped = muiClass.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(
    String.raw`:global\(\.${escaped}\)\s*:global\(\.${escaped}\)`,
  );
}

async function listComponentDirs() {
  const entries = await readdir(COMPONENTS_DIR, { withFileTypes: true });
  return entries.filter((e) => e.isDirectory()).map((e) => e.name);
}

async function filesWithExt(dir, ext) {
  const entries = await readdir(dir, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && e.name.endsWith(ext))
    .map((e) => path.join(dir, e.name));
}

async function auditDir(name) {
  if (EXEMPT_DIRS.has(name)) return [];

  const dir = path.join(COMPONENTS_DIR, name);
  const tsxFiles = (await filesWithExt(dir, ".tsx")).filter(
    (f) => !path.basename(f).endsWith(".test.tsx"),
  );
  const scssFiles = await filesWithExt(dir, ".module.scss");

  if (tsxFiles.length === 0) return [];

  const tsxSources = await Promise.all(
    tsxFiles.map(async (f) => ({ file: f, source: await readFile(f, "utf8") })),
  );
  const scssSource = (
    await Promise.all(scssFiles.map((f) => readFile(f, "utf8")))
  ).join("\n");

  const failures = [];

  for (const rule of RULES) {
    const hits = tsxSources.filter((t) => rule.importRe.test(t.source));
    if (hits.length === 0) continue;

    if (scssFiles.length === 0) {
      failures.push({
        dir: name,
        rule: rule.id,
        detail: `imports @mui/material/${rule.id} but has no *.module.scss (exempt via EXEMPT_DIRS if styling is sx-only)`,
        files: hits.map((h) => path.relative(COMPONENTS_DIR, h.file)),
      });
      continue;
    }

    if (!doubleGlobalPattern(rule.muiClass).test(scssSource)) {
      failures.push({
        dir: name,
        rule: rule.id,
        detail: `missing double :global(.${rule.muiClass}):global(.${rule.muiClass}) on the pressable root selector`,
        files: hits.map((h) => path.relative(COMPONENTS_DIR, h.file)),
      });
    }
  }

  return failures;
}

const dirs = await listComponentDirs();
const failures = (await Promise.all(dirs.map(auditDir))).flat();

if (failures.length === 0) {
  console.log(
    `[audit-mui-specificity] ok — ${dirs.length} component folders, ${EXEMPT_DIRS.size} exempt`,
  );
  process.exit(0);
}

console.error("[audit-mui-specificity] failed:\n");
for (const f of failures) {
  console.error(`  • ${f.dir} (${f.rule})`);
  console.error(`    ${f.detail}`);
  console.error(`    from: ${f.files.join(", ")}`);
}
console.error(`
Fix: bump the module root to .root:global(.MuiX-root):global(.MuiX-root) { ... }
See AGENTS.md → "CSS modules vs MUI Emotion specificity".
`);
process.exit(1);
