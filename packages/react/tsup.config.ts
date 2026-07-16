import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "icons/index": "src/icons/index.ts",
    "manifest/cads.manifest": "src/manifest/cads.manifest.ts",
  },
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom", "react/jsx-runtime", "@mui/material", "@emotion/react", "@emotion/styled", "@codeai/cads-variables"],
});
