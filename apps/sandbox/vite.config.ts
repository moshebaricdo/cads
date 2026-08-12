import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const root = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(root, "../..");
const reactSrc = path.join(repoRoot, "packages/react/src");
const variablesSrc = path.join(repoRoot, "packages/variables/src");

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3200,
    open: false,
    fs: {
      allow: [repoRoot],
    },
  },
  resolve: {
    alias: [
      {
        find: "@moshebaricdo/cads-react/icons/fonts.css",
        replacement: path.join(reactSrc, "icons/fonts.css"),
      },
      {
        find: "@moshebaricdo/cads-react/icons/fonts-solid.css",
        replacement: path.join(reactSrc, "icons/fonts-solid.css"),
      },
      {
        find: "@moshebaricdo/cads-react/icons",
        replacement: path.join(reactSrc, "icons/index.ts"),
      },
      {
        find: "@moshebaricdo/cads-react",
        replacement: path.join(reactSrc, "index.ts"),
      },
      {
        find: "@moshebaricdo/cads-variables/theme",
        replacement: path.join(variablesSrc, "theme.ts"),
      },
      {
        find: "@moshebaricdo/cads-variables/variables.css",
        replacement: path.join(variablesSrc, "variables.css"),
      },
      {
        find: "@moshebaricdo/cads-variables",
        replacement: path.join(variablesSrc, "index.ts"),
      },
    ],
  },
  optimizeDeps: {
    include: [
      "@mui/material",
      "@emotion/react",
      "@emotion/styled",
      "dialkit",
      "motion",
    ],
  },
});
