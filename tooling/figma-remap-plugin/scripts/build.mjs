#!/usr/bin/env node
/**
 * Build the Variable Remap Figma plugin: dist/code.js + dist/ui.html.
 * The UI bundle is inlined into template.html (single-file UI, Community-safe).
 */
import * as esbuild from "esbuild";
import { mkdirSync, readFileSync, watch, writeFileSync, copyFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const distDir = join(root, "dist");

const isWatch = process.argv.includes("--watch");

async function build() {
  mkdirSync(distDir, { recursive: true });

  await esbuild.build({
    entryPoints: [join(root, "src/code.ts")],
    bundle: true,
    outfile: join(distDir, "code.js"),
    platform: "browser",
    target: ["es2017"],
    minify: false,
    logLevel: "silent",
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
