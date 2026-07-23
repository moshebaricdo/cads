/**
 * Copies the built portable skill ZIP into public/downloads for docs export
 * (local + GitHub Pages). The ZIP is gitignored; CI runs `pnpm artifact:package`
 * before `build:docs` so Pages ships the download.
 *
 * Embeds FA7 Pro — CodeAI internal use. When prod `dsco` publishes FA7, prefer
 * those CDN assets over inlining.
 */
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const docsRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = join(
  docsRoot,
  "../../tooling/cads-artifact/dist/cads-prototyping.zip",
);
const targetDir = join(docsRoot, "public/downloads");
const target = join(targetDir, "cads-prototyping.zip");

if (existsSync(source)) {
  mkdirSync(targetDir, { recursive: true });
  copyFileSync(source, target);
  console.log("[docs] copied cads-prototyping.zip → public/downloads/");
} else if (existsSync(target)) {
  console.log("[docs] skill ZIP not rebuilt; keeping existing public copy");
} else {
  console.log(
    "[docs] no skill ZIP found (run `pnpm artifact:package`); /ai will show a rebuild note",
  );
}
