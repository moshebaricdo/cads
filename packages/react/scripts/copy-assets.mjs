import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PKG = path.resolve(__dirname, "..");
const DIST = path.join(PKG, "dist", "icons");
const FONTS_SRC = path.join(PKG, "src", "icons", "fonts");

fs.mkdirSync(DIST, { recursive: true });

const css = `/* Font Awesome 7 — internal CADS distribution only */
@font-face {
  font-family: "Font Awesome 7 Pro";
  font-style: normal;
  font-weight: 900;
  font-display: block;
  src: url("./fonts/font-awesome-7-pro-solid-900.otf") format("opentype");
}

@font-face {
  font-family: "Font Awesome 7 Brands";
  font-style: normal;
  font-weight: 400;
  font-display: block;
  src: url("./fonts/Font Awesome 7 Brands-Regular-400.otf") format("opentype");
}
`;

fs.writeFileSync(path.join(DIST, "fonts.css"), css, "utf-8");
fs.cpSync(FONTS_SRC, path.join(DIST, "fonts"), { recursive: true });
console.log("Copied icon fonts + fonts.css to dist/icons");
