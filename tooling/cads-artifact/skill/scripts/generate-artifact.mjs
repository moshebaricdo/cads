#!/usr/bin/env node
/**
 * Skill-local generator (no monorepo deps).
 * Reads runtime/ + a JSON spec and writes a self-contained HTML artifact.
 *
 *   node scripts/generate-artifact.mjs --spec examples/teacher-onboarding.json
 *   node scripts/generate-artifact.mjs --stdin < spec.json
 */
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const skillRoot = join(__dirname, "..");
const runtimeDir = join(skillRoot, "runtime");

const args = parseArgs(process.argv.slice(2));
const jsPath = join(runtimeDir, "cads-runtime.js");
const cssPath = join(runtimeDir, "cads-runtime.css");
const versionPath = join(runtimeDir, "VERSION.json");
const componentsPath = join(skillRoot, "references/components.json");

if (!existsSync(jsPath)) {
  console.error("Missing runtime/cads-runtime.js");
  process.exit(1);
}

let spec;
if (args.spec) {
  spec = JSON.parse(readFileSync(resolve(args.spec), "utf8"));
} else if (args.stdin) {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  spec = JSON.parse(Buffer.concat(chunks).toString("utf8"));
} else {
  console.error("Pass --spec path.json or --stdin");
  process.exit(1);
}

const validation = validateSpec(spec, loadComponents());
if (!validation.valid) {
  console.error("Invalid prototype:");
  for (const e of validation.errors) console.error(`  - ${e}`);
  process.exit(1);
}

const version = JSON.parse(readFileSync(versionPath, "utf8"));
const js = readFileSync(jsPath, "utf8");
const css = existsSync(cssPath) ? readFileSync(cssPath, "utf8") : "";
const stamped = {
  ...spec,
  _cads: {
    manifestVersion: version.manifestVersion,
    builtAt: version.builtAt,
    format: "html-self-contained",
    warnings: validation.warnings,
  },
};

const out =
  args.out ||
  join(skillRoot, "output", `${slug(spec.title || "prototype")}.html`);
mkdirSync(dirname(out), { recursive: true });

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(spec.title || "CADS prototype")}</title>
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

writeFileSync(out, html);
console.log(`Wrote ${out} (${(Buffer.byteLength(html) / 1024).toFixed(1)} KB)`);

function loadComponents() {
  if (!existsSync(componentsPath)) return null;
  return JSON.parse(readFileSync(componentsPath, "utf8"));
}

function validateSpec(spec, catalog) {
  const errors = [];
  const warnings = [];
  if (!spec || typeof spec !== "object") {
    return { valid: false, errors: ["spec must be an object"], warnings };
  }
  if (typeof spec.title !== "string" || !spec.title.trim()) {
    errors.push("title is required");
  }
  if (spec.theme !== undefined && !["light", "dark"].includes(spec.theme)) {
    errors.push("theme must be light or dark");
  }
  walk(spec.root, "root", errors, warnings, catalog);
  detectForbidden(spec, "spec", errors);
  return { valid: errors.length === 0, errors, warnings };
}

function walk(node, path, errors, warnings, catalog) {
  if (!node || typeof node !== "object") {
    errors.push(`${path}: expected node`);
    return;
  }
  if (node.type === "layout") {
    if (!["stack", "inline", "surface"].includes(node.layout)) {
      errors.push(`${path}.layout invalid`);
    }
  } else if (node.type === "text") {
    if (!node.text) errors.push(`${path}.text required`);
  } else if (node.type === "component") {
    if (catalog && !catalog[node.component]) {
      errors.push(`${path}.component ${node.component} not in CADS`);
    } else if (catalog) {
      const allowed = new Set(catalog[node.component].props.map((p) => p.name));
      for (const key of Object.keys(node.props || {})) {
        if (!allowed.has(key)) {
          errors.push(`${path}.props.${key} not declared`);
        }
      }
    }
  } else {
    errors.push(`${path}.type invalid`);
  }
  if (Array.isArray(node.children)) {
    node.children.forEach((child, i) =>
      walk(child, `${path}.children[${i}]`, errors, warnings, catalog),
    );
  }
}

function detectForbidden(value, path, errors) {
  if (typeof value === "string") {
    if (/#[\da-f]{3,8}\b/i.test(value)) {
      errors.push(`${path}: hard-coded colors are not allowed`);
    }
    if (value.includes("--ds-")) {
      errors.push(`${path}: --ds-* variables are not allowed`);
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, i) => detectForbidden(item, `${path}[${i}]`, errors));
    return;
  }
  if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) {
      detectForbidden(v, `${path}.${k}`, errors);
    }
  }
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--spec") out.spec = argv[++i];
    else if (argv[i] === "--out") out.out = argv[++i];
    else if (argv[i] === "--stdin") out.stdin = true;
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
