/**
 * Copies the built portable skill ZIP into public/downloads for local /
 * internal docs builds. Skipped when the artifact hasn't been built — the
 * For Agents page then shows an internal-access note.
 *
 * The copy is gitignored: the ZIP inlines FA Pro fonts (internal license) and
 * must not be published via public GitHub Pages.
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
  console.log("[docs] copied cads-prototyping.zip → public/downloads/ (internal)");
} else if (existsSync(target)) {
  console.log("[docs] skill ZIP not rebuilt; keeping existing public copy");
} else {
  console.log(
    "[docs] no skill ZIP found (internal builds: run `pnpm artifact:build`); For Agents page will show access note",
  );
}
