/**
 * Copies the built Claude skill ZIP (tooling/cads-artifact/dist) into
 * public/downloads so the AI setup page can offer a download. Skipped when the
 * artifact hasn't been built — the page then falls back to build instructions.
 * The copy is gitignored: the ZIP inlines FA Pro fonts (internal license).
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
    "[docs] no skill ZIP found (run `pnpm artifact:build`); AI page will show build instructions",
  );
}
