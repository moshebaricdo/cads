import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PKG = path.resolve(__dirname, "..");
const DIST = path.join(PKG, "dist", "icons");
const FREE_CSS_SRC = path.join(PKG, "src", "icons", "fonts-free.css");
const FREE_SOLID_CSS_SRC = path.join(PKG, "src", "icons", "fonts-solid-free.css");
const FREE_FONTS_SRC = path.join(PKG, "src", "icons", "fonts-free");

const FREE_FACES = [
  "fa-solid-900.woff2",
  "fa-regular-400.woff2",
  "fa-brands-400.woff2",
];

function assertFreeFaces() {
  for (const file of FREE_FACES) {
    const from = path.join(FREE_FONTS_SRC, file);
    if (!fs.existsSync(from)) {
      throw new Error(`Missing FA7 Free webfont: ${from}`);
    }
  }
}

assertFreeFaces();
fs.mkdirSync(DIST, { recursive: true });
fs.rmSync(path.join(DIST, "fonts"), { recursive: true, force: true });
fs.copyFileSync(FREE_CSS_SRC, path.join(DIST, "fonts.css"));
fs.copyFileSync(FREE_SOLID_CSS_SRC, path.join(DIST, "fonts-solid.css"));
const distFree = path.join(DIST, "fonts-free");
fs.mkdirSync(distFree, { recursive: true });
for (const file of FREE_FACES) {
  fs.copyFileSync(path.join(FREE_FONTS_SRC, file), path.join(distFree, file));
}
console.log("Copied FA7 Free webfonts to dist/icons (Pro OTFs stay in src/icons/fonts)");
