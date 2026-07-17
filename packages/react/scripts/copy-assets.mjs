import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PKG = path.resolve(__dirname, "..");
const DIST = path.join(PKG, "dist", "icons");
const FONTS_SRC = path.join(PKG, "src", "icons", "fonts");
const FONTS_CSS_SRC = path.join(PKG, "src", "icons", "fonts.css");

const FONTS_SOLID_CSS_SRC = path.join(PKG, "src", "icons", "fonts-solid.css");

fs.mkdirSync(DIST, { recursive: true });
fs.copyFileSync(FONTS_CSS_SRC, path.join(DIST, "fonts.css"));
if (fs.existsSync(FONTS_SOLID_CSS_SRC)) {
  fs.copyFileSync(FONTS_SOLID_CSS_SRC, path.join(DIST, "fonts-solid.css"));
}
fs.cpSync(FONTS_SRC, path.join(DIST, "fonts"), { recursive: true });
console.log("Copied icon fonts + fonts.css to dist/icons");
