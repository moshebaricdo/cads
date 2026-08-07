#!/usr/bin/env node
/**
 * Build the Variable Remap Figma plugin: dist/code.js + dist/ui.html.
 * The UI bundle is inlined into template.html (single-file UI, Community-safe).
 *
 * Optional team AI key (never commit real values) — read from env / .env:
 *   CADS_AUDIT_AI_API_KEY
 *   CADS_AUDIT_AI_PROVIDER  (anthropic|openai)
 *   CADS_AUDIT_AI_MODEL
 */
import * as esbuild from "esbuild";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  watch,
  writeFileSync,
  copyFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const repoRoot = join(root, "../..");
const distDir = join(root, "dist");

const isWatch = process.argv.includes("--watch");

function loadDotEnv(filePath) {
  if (!existsSync(filePath)) return;
  const text = readFileSync(filePath, "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

loadDotEnv(join(repoRoot, ".env"));
loadDotEnv(join(root, ".env"));

function teamAiDefines() {
  const key = process.env.CADS_AUDIT_AI_API_KEY?.trim() ?? "";
  const provider = process.env.CADS_AUDIT_AI_PROVIDER?.trim() || "anthropic";
  const model = process.env.CADS_AUDIT_AI_MODEL?.trim() || "";
  return {
    __CADS_TEAM_AI_KEY__: JSON.stringify(key),
    __CADS_TEAM_AI_PROVIDER__: JSON.stringify(provider),
    __CADS_TEAM_AI_MODEL__: JSON.stringify(model),
  };
}

async function build() {
  mkdirSync(distDir, { recursive: true });
  const define = teamAiDefines();
  if (process.env.CADS_AUDIT_AI_API_KEY?.trim()) {
    console.log("Team AI key: embedded from CADS_AUDIT_AI_API_KEY");
  }

  await esbuild.build({
    entryPoints: [join(root, "src/code.ts")],
    bundle: true,
    outfile: join(distDir, "code.js"),
    platform: "browser",
    target: ["es2017"],
    minify: false,
    logLevel: "silent",
    define,
  });

  const ui = await esbuild.build({
    entryPoints: [join(root, "src/ui/main.ts")],
    bundle: true,
    write: false,
    platform: "browser",
    target: ["es2017"],
    minify: true,
    logLevel: "silent",
    loader: { ".svg": "text" },
    define,
  });
  // Escape </script so the inlined bundle can't close the host tag early.
  // Use a function replacer — string replace treats $& / $$ / $' as special,
  // and minified JS routinely contains `$&&` which would corrupt the output
  // (blank plugin UI).
  const uiJs = ui.outputFiles[0].text.replace(/<\/script/gi, "<\\/script");

  const template = readFileSync(join(root, "src/ui/template.html"), "utf8");
  const html = template.replace("/*__SCRIPT__*/", () => uiJs);
  writeFileSync(join(distDir, "ui.html"), html);

  try {
    copyFileSync(join(root, "icon.png"), join(distDir, "icon.png"));
  } catch {
    // icon optional until generated
  }

  const sizeKb = Buffer.byteLength(html) / 1024;
  console.log(`Built dist/code.js + dist/ui.html (${sizeKb.toFixed(0)} KB)`);
}

await build();

if (isWatch) {
  console.log("Watching src/ …");
  let pending = null;
  watch(join(root, "src"), { recursive: true }, () => {
    clearTimeout(pending);
    pending = setTimeout(() => {
      build().catch((error) => console.error(error.message));
    }, 100);
  });
}
