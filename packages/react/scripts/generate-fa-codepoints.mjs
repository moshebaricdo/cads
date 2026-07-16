/**
 * Extracts all icon name → Unicode codepoint mappings directly from the
 * Font Awesome Pro OTF font file. No dependency on @fortawesome npm packages.
 *
 * Run: npm run generate:fa-codepoints
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import opentype from "opentype.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const FONTS = [
  {
    path: path.join(root, "src/assets/fonts/font-awesome-7-pro-solid-900.otf"),
    constName: "FA_PRO_SOLID_CODEPOINTS",
    typeName: "FaIconName",
    getterName: "getFaCodepoint",
    outFile: "faProRegularCodepoints.ts",
    headerTitle: "Font Awesome 7 Pro Solid",
  },
  {
    path: path.join(
      root,
      "src/assets/fonts/Font Awesome 7 Brands-Regular-400.otf",
    ),
    constName: "FA_BRANDS_CODEPOINTS",
    typeName: "FaBrandIconName",
    getterName: "getFaBrandCodepoint",
    outFile: "faBrandsCodepoints.ts",
    headerTitle: "Font Awesome 7 Brands",
  },
];

function extractCodepoints(fontPath) {
  const font = opentype.loadSync(fontPath);
  const glyphs = font.glyphs;
  const out = {};

  for (let i = 0; i < glyphs.length; i++) {
    const glyph = glyphs.get(i);
    if (!glyph.name || !glyph.unicode) continue;

    const name = glyph.name;
    const hex = glyph.unicode.toString(16).toLowerCase();

    if (glyph.unicode < 0x21) continue;
    if (name === ".notdef" || name === ".null" || name === "nonmarkingreturn")
      continue;

    out[name] = hex;
  }

  return Object.keys(out)
    .sort()
    .reduce((acc, key) => {
      acc[key] = out[key];
      return acc;
    }, {});
}

for (const fontConfig of FONTS) {
  const sorted = extractCodepoints(fontConfig.path);
  const lines = Object.entries(sorted).map(
    ([name, hex]) => `  ${JSON.stringify(name)}: "${hex}",`,
  );

  const header = `/**
 * Unicode codepoints (hex, no "0x") for every glyph in the ${fontConfig.headerTitle} font.
 * Auto-generated from ${path.basename(fontConfig.path)}
 * Regenerate: \`npm run generate:fa-codepoints\`
 */
`;

  const body = `export const ${fontConfig.constName} = {
${lines.join("\n")}
} as const;

export type ${fontConfig.typeName} = keyof typeof ${fontConfig.constName};

export function ${fontConfig.getterName}(name: ${fontConfig.typeName}): string {
  return ${fontConfig.constName}[name];
}
`;

  fs.writeFileSync(path.join(root, "src/icons", fontConfig.outFile), header + body);
  console.log(`Wrote ${lines.length} icons to src/icons/${fontConfig.outFile}`);
}
