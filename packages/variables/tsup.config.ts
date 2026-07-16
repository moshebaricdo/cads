import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/theme.ts"],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: false,
  external: ["@mui/material", "@mui/material/styles"],
});
