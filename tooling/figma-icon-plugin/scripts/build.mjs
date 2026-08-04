#!/usr/bin/env node
/**
 * Build the FontAwesome Glyphs Figma plugin:
 *  - dist/code.js + dist/ui.html  (default / --public: no FA fonts inlined)
 *  - Optional --with-fonts for local CADS testing (inlines FA Pro — never publish)
 *
 * Public build is safe for Figma Community (no Pro font binaries redistributed).
 * Previews use OS-installed fonts + FontFace from Settings → Add files.
 */
import * as esbuild from "esbuild";
import {
  copyFileSync,
  mkdirSync,
  readFileSync,
  watch,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const repoRoot = join(root, "../..");
const distDir = join(root, "dist");
const fontsDir = join(repoRoot, "packages/react/src/icons/fonts");

const withFonts = process.argv.includes("--with-fonts");
const isWatch = process.argv.includes("--watch");

const FONTS = [
  {
    file: "font-awesome-7-pro-solid-900.otf",
    family: "Font Awesome 7 Pro",
    weight: 900,
  },
  {
    file: "font-awesome-7-pro-regular-400.otf",
    family: "Font Awesome 7 Pro",
    weight: 400,
  },
  {
    file: "Font Awesome 7 Brands-Regular-400.otf",
    family: "Font Awesome 7 Brands",
    weight: 400,
  },
];

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
  });
  const uiJs = ui.outputFiles[0].text.replace(/<\/script/gi, "<\\/script");

  let fontsCss = "";
  if (withFonts) {
    fontsCss = FONTS.map(({ file, family, weight }) => {
      const base64 = readFileSync(join(fontsDir, file)).toString("base64");
      return `@font-face {
  font-family: "${family}";
  font-style: normal;
  font-weight: ${weight};
  src: url(data:font/otf;base64,${base64}) format("opentype");
}`;
    }).join("\n");
  }

  // Ensure icon sits next to the built files for publish / Import from manifest
  const iconSrc = join(root, "icon.png");
  let pluginIconDataUri = "";
  try {
    copyFileSync(iconSrc, join(distDir, "icon.png"));
    pluginIconDataUri = `data:image/png;base64,${readFileSync(iconSrc).toString("base64")}`;
  } catch {
    // icon optional until generated
  }

  const template = readFileSync(join(root, "src/ui/template.html"), "utf8");
  const html = template
    .replace("/*__FONTS_CSS__*/", fontsCss)
    .replace("/*__SCRIPT__*/", uiJs)
    .replace("__PLUGIN_ICON_SRC__", pluginIconDataUri);
  writeFileSync(join(distDir, "ui.html"), html);

  const sizeKb = Buffer.byteLength(html) / 1024;
  const sizeLabel =
    sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(2)} MB` : `${sizeKb.toFixed(0)} KB`;
  console.log(
    `Built dist/code.js + dist/ui.html (${sizeLabel})${
      withFonts ? " [with inlined FA fonts — do not publish]" : " [public / Community-safe]"
    }`,
  );
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
