import react from "@vitejs/plugin-react";
import { globSync } from "glob";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { PreRenderedAsset } from "rollup";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { externalizeDeps } from "vite-plugin-externalize-deps";
import { libInjectCss } from "vite-plugin-lib-inject-css";

const root = path.dirname(fileURLToPath(import.meta.url));

/** Every TS/TSX source so dist preserves the module graph (tree-shakeable). */
const entries = Object.fromEntries(
  globSync("src/**/*.{ts,tsx}", {
    cwd: root,
    // types.ts is type-only (erases to an empty chunk if used as an entry).
    ignore: ["src/**/*.d.ts", "src/**/types.ts"],
  }).map((file) => {
    const name = file
      .replace(/^src\//, "")
      .replace(/\.(ts|tsx)$/, "");
    return [name, path.resolve(root, file)];
  }),
);

/**
 * Emit compiled CSS modules as `{base}.css` (strip `.module`) so host bundlers
 * do not re-modularize already-hashed class names.
 */
function getAssetFileNames(assetInfo: PreRenderedAsset): string {
  const name = assetInfo.names?.[0] ?? assetInfo.name;
  if (name && /\.module\.(scss|css)$/.test(name)) {
    const dir = path.dirname(name);
    const base = path.basename(name).replace(/\.module\.(scss|css)$/, "");
    return dir === "." ? `${base}.css` : `${dir}/${base}.css`;
  }
  return "[name][extname]";
}

export default defineConfig({
  plugins: [
    react(),
    dts({
      entryRoot: "src",
      include: ["src"],
      insertTypesEntry: false,
      rollupTypes: false,
      tsconfigPath: path.resolve(root, "tsconfig.json"),
    }),
    libInjectCss(),
    externalizeDeps(),
  ],
  build: {
    sourcemap: true,
    cssCodeSplit: true,
    emptyOutDir: true,
    lib: {
      entry: entries,
      formats: ["es"],
    },
    rollupOptions: {
      output: {
        format: "es",
        exports: "named",
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js",
        assetFileNames: getAssetFileNames,
      },
    },
  },
});
