import { defineConfig } from "tsup";
import { readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

/** Collect every TS/TSX source so dist preserves the module graph (tree-shakeable). */
function collectEntries(dir: string, acc: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      collectEntries(full, acc);
      continue;
    }
    if (/\.(ts|tsx)$/.test(name) && !name.endsWith(".d.ts")) {
      acc.push(full);
    }
  }
  return acc;
}

const srcEntries = collectEntries("src").map((p) =>
  relative(process.cwd(), p).replace(/\\/g, "/"),
);

export default defineConfig({
  entry: srcEntries,
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  /** Emit one file per source module — barrel imports stay as re-exports. */
  bundle: false,
  treeshake: true,
  external: [
    "react",
    "react-dom",
    "react/jsx-runtime",
    "@mui/material",
    /^@mui\/material\//,
    "@mui/system",
    /^@mui\/system\//,
    "@emotion/react",
    "@emotion/styled",
    "@codeai/cads-variables",
    /^@codeai\/cads-variables\//,
  ],
});
