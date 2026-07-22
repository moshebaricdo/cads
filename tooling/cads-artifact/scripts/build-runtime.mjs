#!/usr/bin/env node
/**
 * Bundle a self-contained browser CADS runtime (JS + CSS with inlined FA fonts).
 * Output lands in dist/ and is copied into skill/runtime/ for the portable skill.
 */
import * as esbuild from "esbuild";
import {
  copyFileSync,
  mkdirSync,
  writeFileSync,
  statSync,
} from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const repoRoot = join(root, "../..");
const distDir = join(root, "dist");
const skillRuntimeDir = join(root, "skill/runtime");

mkdirSync(distDir, { recursive: true });
mkdirSync(skillRuntimeDir, { recursive: true });

const result = await esbuild.build({
  entryPoints: [join(root, "src/entry.tsx")],
  bundle: true,
  format: "iife",
  globalName: "CADS",
  outfile: join(distDir, "cads-runtime.js"),
  platform: "browser",
  target: ["es2020"],
  jsx: "automatic",
  minify: true,
  sourcemap: false,
  metafile: true,
  loader: {
    ".css": "css",
    ".otf": "dataurl",
    ".ttf": "dataurl",
    ".woff": "dataurl",
    ".woff2": "dataurl",
  },
  define: {
    "process.env.NODE_ENV": '"production"',
  },
  // Keep React on the global if Claude already provides it? Prefer bundling for isolation.
  // Bundle everything so shared org viewers need zero deps.
  banner: {
    js: `/* CADS artifact runtime — internal prototyping only. Built ${new Date().toISOString()} */`,
  },
});

// esbuild writes CSS next to JS when CSS is imported — check for sibling css
const jsPath = join(distDir, "cads-runtime.js");
const cssPath = join(distDir, "cads-runtime.css");

// With a single outfile and CSS imports, esbuild emits cads-runtime.css alongside.
if (!exists(cssPath)) {
  // Fallback: extract any injected style (shouldn't happen with css loader)
  writeFileSync(cssPath, "/* no separate CSS emitted */\n");
}

const { cadsManifest } = await import("@codeai/cads-react/manifest");
const versionInfo = {
  package: "@codeai/cads-react",
  manifestVersion: cadsManifest.version,
  builtAt: new Date().toISOString(),
  formats: ["html-self-contained", "react-module-preferred"],
};

writeFileSync(join(distDir, "VERSION.json"), JSON.stringify(versionInfo, null, 2));

const componentsJson = Object.fromEntries(
  cadsManifest.components.map((component) => [
    component.exportName,
    {
      name: component.name,
      props: component.props,
      usageRules: component.usageRules,
      example: component.example,
    },
  ]),
);
writeFileSync(
  join(root, "skill/references/components.json"),
  JSON.stringify(componentsJson, null, 2),
);

// Size report
const sizes = {
  js: statSync(jsPath).size,
  css: exists(cssPath) ? statSync(cssPath).size : 0,
};
sizes.total = sizes.js + sizes.css;
sizes.human = {
  js: human(sizes.js),
  css: human(sizes.css),
  total: human(sizes.total),
};
writeFileSync(join(distDir, "SIZE.json"), JSON.stringify(sizes, null, 2));

// Copy into skill/runtime (exclude SIZE.json / meta — packaging noise)
for (const file of ["cads-runtime.js", "cads-runtime.css", "VERSION.json"]) {
  const from = join(distDir, file);
  if (exists(from)) copyFileSync(from, join(skillRuntimeDir, file));
}

// Write a thin ESM wrapper for the "preferred" React-module format experiments.
// Claude may not support local imports; HTML fallback is the reliable path.
writeFileSync(
  join(distDir, "cads-runtime.module.js"),
  `/**
 * Preferred format: import { renderPrototype } from "./cads-runtime.module.js"
 * In practice Claude artifacts often cannot load local modules — use the HTML
 * generator (scripts/generate-artifact.mjs) which inlines the IIFE instead.
 */
export function renderPrototype(container, spec) {
  if (typeof CADS === "undefined" || !CADS.renderPrototype) {
    throw new Error("Load cads-runtime.js (IIFE) before this module wrapper");
  }
  return CADS.renderPrototype(container, spec);
}
export function mountFromScriptTag(id) {
  return CADS.mountFromScriptTag(id);
}
`,
);
copyFileSync(
  join(distDir, "cads-runtime.module.js"),
  join(skillRuntimeDir, "cads-runtime.module.js"),
);

// Metafile for debugging bundle composition
writeFileSync(
  join(distDir, "metafile.json"),
  JSON.stringify(result.metafile, null, 2),
);

console.log("CADS artifact runtime built:");
console.log(`  JS:  ${sizes.human.js}`);
console.log(`  CSS: ${sizes.human.css}`);
console.log(`  Total: ${sizes.human.total}`);
console.log(`  → ${relative(repoRoot, skillRuntimeDir)}/`);

function human(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function exists(path) {
  try {
    statSync(path);
    return true;
  } catch {
    return false;
  }
}
