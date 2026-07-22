#!/usr/bin/env node
/**
 * Generate a self-contained HTML CADS artifact from a prototype JSON spec.
 *
 * Usage:
 *   node scripts/generate-artifact.mjs --spec path/to/spec.json [--out path.html]
 *   node scripts/generate-artifact.mjs --example teacher-onboarding
 *   node scripts/generate-artifact.mjs --stdin < spec.json
 */
import {
  mkdirSync,
  readFileSync,
  writeFileSync,
  existsSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { validatePrototype } from "../../cads-mcp/src/prototype.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const runtimeDir = join(root, "dist");
const examplesDir = join(root, "examples");
const outDir = join(root, "dist/artifacts");

const args = parseArgs(process.argv.slice(2));

if (!existsSync(join(runtimeDir, "cads-runtime.js"))) {
  console.error("Missing dist/cads-runtime.js — run `pnpm --filter @codeai/cads-artifact build` first.");
  process.exit(1);
}

let spec;
let outPath;

if (args.example) {
  const examplePath = join(examplesDir, `${args.example}.json`);
  if (!existsSync(examplePath)) {
    console.error(`Unknown example: ${args.example}`);
    process.exit(1);
  }
  spec = JSON.parse(readFileSync(examplePath, "utf8"));
  outPath = args.out
    ? resolve(args.out)
    : join(outDir, `${args.example}.html`);
} else if (args.spec) {
  spec = JSON.parse(readFileSync(resolve(args.spec), "utf8"));
  outPath = args.out
    ? resolve(args.out)
    : join(outDir, `${slug(spec.title)}.html`);
} else if (args.stdin) {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  spec = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  outPath = args.out
    ? resolve(args.out)
    : join(outDir, `${slug(spec.title || "prototype")}.html`);
} else {
  console.error(`Usage:
  node scripts/generate-artifact.mjs --example teacher-onboarding
  node scripts/generate-artifact.mjs --spec ./my.json [--out ./out.html]
  node scripts/generate-artifact.mjs --stdin < my.json`);
  process.exit(1);
}

const validation = validatePrototype(spec);
if (!validation.valid) {
  console.error("Invalid CADS prototype:");
  for (const error of validation.errors) console.error(`  - ${error}`);
  process.exit(1);
}
if (validation.warnings.length) {
  for (const warning of validation.warnings) console.warn(`  warning: ${warning}`);
}

const version = JSON.parse(
  readFileSync(join(runtimeDir, "VERSION.json"), "utf8"),
);
const js = readFileSync(join(runtimeDir, "cads-runtime.js"), "utf8");
const css = existsSync(join(runtimeDir, "cads-runtime.css"))
  ? readFileSync(join(runtimeDir, "cads-runtime.css"), "utf8")
  : "";

const html = buildHtml({
  spec,
  js,
  css,
  version,
  warnings: validation.warnings,
});

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, html, "utf8");

const sizeKb = (Buffer.byteLength(html) / 1024).toFixed(1);
console.log(`Wrote ${outPath}`);
console.log(`  artifact size: ${sizeKb} KB`);
console.log(`  CADS manifest: ${version.manifestVersion}`);
console.log(`  format: self-contained HTML (portable skill output)`);

function buildHtml({ spec, js, css, version, warnings }) {
  const title = escapeHtml(spec.title || "CADS prototype");
  const stamped = {
    ...spec,
    _cads: {
      manifestVersion: version.manifestVersion,
      builtAt: version.builtAt,
      format: "html-self-contained",
      warnings,
    },
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <meta name="cads-manifest-version" content="${escapeHtml(version.manifestVersion)}" />
  <meta name="cads-format" content="html-self-contained" />
  <style>
    html, body { margin: 0; padding: 0; }
    ${css}
  </style>
</head>
<body>
  <div id="cads-root"></div>
  <script id="cads-prototype-spec" type="application/json">${JSON.stringify(stamped).replace(/</g, "\\u003c")}</script>
  <script>
${js}
  </script>
  <script>
    CADS.mountFromScriptTag("cads-prototype-spec");
  </script>
</body>
</html>
`;
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--example") out.example = argv[++i];
    else if (arg === "--spec") out.spec = argv[++i];
    else if (arg === "--out") out.out = argv[++i];
    else if (arg === "--stdin") out.stdin = true;
  }
  return out;
}

function slug(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64) || "prototype";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
