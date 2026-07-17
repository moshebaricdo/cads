/**
 * tsup `bundle: false` emits extensionless relative imports; Node ESM requires
 * explicit `.js`. Rewrite relative imports/exports under dist/.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "..", "dist");

const IMPORT_RE =
  /(from\s+|import\s*\(\s*|export\s+\*\s+from\s+)(["'])(\.[^"']+)\2/g;

function resolveWithExt(fromFile, spec) {
  const abs = path.resolve(path.dirname(fromFile), spec);
  if (fs.existsSync(abs) && fs.statSync(abs).isFile()) return spec;
  if (fs.existsSync(abs + ".js")) return spec + ".js";
  if (fs.existsSync(path.join(abs, "index.js"))) {
    return spec.endsWith("/") ? `${spec}index.js` : `${spec}/index.js`;
  }
  return spec;
}

function rewriteFile(file) {
  const src = fs.readFileSync(file, "utf8");
  const next = src.replace(IMPORT_RE, (full, prefix, quote, spec) => {
    if (spec.endsWith(".js") || spec.endsWith(".json") || spec.endsWith(".css")) {
      return full;
    }
    const fixed = resolveWithExt(file, spec);
    return `${prefix}${quote}${fixed}${quote}`;
  });
  if (next !== src) fs.writeFileSync(file, next);
}

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walk(full);
    else if (name.endsWith(".js") && !name.endsWith(".map.js")) rewriteFile(full);
  }
}

walk(DIST);
console.log("Fixed ESM relative import extensions in dist/");
