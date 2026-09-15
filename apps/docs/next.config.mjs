import path from "node:path";
import { fileURLToPath } from "node:url";

/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === "true";
/** Project Pages URL is https://<user>.github.io/cads/ */
const basePath = isGithubPages ? "/cads" : "";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "../..");
const reactSrcAbs = path.join(repoRoot, "packages/react/src");
const variablesSrcAbs = path.join(repoRoot, "packages/variables/src");

/**
 * Dev-only: resolve workspace packages from source.
 * Production/export keeps package.json `exports` → committed `dist/`,
 * except icon fonts: always the in-repo Pro OTFs (npm ships Free).
 * This stops `vite build` / `pnpm build:react` from deleting modules out from
 * under a live Turbopack server (Module not found → .next cache corruption).
 *
 * Turbopack resolves these relative to the docs app dir (`apps/docs`).
 * Wildcard `/*` covers subpaths (`/icons`, `/manifest`, …).
 */
const turbopackSrcAliases = {
  "@moshebari/cads-react/manifest":
    "../../packages/react/src/manifest/cads.manifest.ts",
  "@moshebari/cads-react/*": "../../packages/react/src/*",
  "@moshebari/cads-react": "../../packages/react/src/index.ts",
  "@moshebari/cads-variables/theme": "../../packages/variables/src/theme.ts",
  "@moshebari/cads-variables/variables.css":
    "../../packages/variables/src/variables.css",
  "@moshebari/cads-variables/data/color-system.json":
    "../../packages/variables/src/data/codeAiColorSystem.json",
  "@moshebari/cads-variables/*": "../../packages/variables/src/*",
  "@moshebari/cads-variables": "../../packages/variables/src/index.ts",
};

/** Always Pro OTFs for docs (dev + GitHub Pages). npm exports Free instead. */
const turbopackFontAliases = {
  "@moshebari/cads-react/icons/fonts.css":
    "../../packages/react/src/icons/fonts.css",
  "@moshebari/cads-react/icons/fonts-solid.css":
    "../../packages/react/src/icons/fonts-solid.css",
};

const webpackSrcAliases = {
  "@moshebari/cads-react/manifest$": path.join(
    reactSrcAbs,
    "manifest/cads.manifest.ts",
  ),
  "@moshebari/cads-react$": path.join(reactSrcAbs, "index.ts"),
  "@moshebari/cads-react": reactSrcAbs,
  "@moshebari/cads-variables/theme$": path.join(variablesSrcAbs, "theme.ts"),
  "@moshebari/cads-variables/variables.css$": path.join(
    variablesSrcAbs,
    "variables.css",
  ),
  "@moshebari/cads-variables/data/color-system.json$": path.join(
    variablesSrcAbs,
    "data/codeAiColorSystem.json",
  ),
  "@moshebari/cads-variables$": path.join(variablesSrcAbs, "index.ts"),
  "@moshebari/cads-variables": variablesSrcAbs,
};

const webpackFontAliases = {
  "@moshebari/cads-react/icons/fonts.css$": path.join(
    reactSrcAbs,
    "icons/fonts.css",
  ),
  "@moshebari/cads-react/icons/fonts-solid.css$": path.join(
    reactSrcAbs,
    "icons/fonts-solid.css",
  ),
};

const isDev = process.env.NODE_ENV !== "production";

const nextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath || undefined,
  /** Exposed for `withBasePath` — `next/image` (unoptimized) skips basePath. */
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  /** Keep the Next.js "N" FAB off the stage / preview chrome. */
  devIndicators: {
    position: "bottom-right",
  },
  transpilePackages: ["@moshebari/cads-react", "@moshebari/cads-variables"],
  reactStrictMode: true,
  experimental: {
    /** Turn barrel imports into per-module imports for smaller client graphs. */
    optimizePackageImports: ["@moshebari/cads-react", "@mui/material"],
  },
  turbopack: {
    // Font aliases last so they win over `@moshebari/cads-react/*`.
    resolveAlias: {
      ...(isDev ? turbopackSrcAliases : {}),
      ...turbopackFontAliases,
    },
  },
  webpack: (config, { dev }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      ...webpackFontAliases,
      ...(dev ? webpackSrcAliases : {}),
    };
    return config;
  },
};

export default nextConfig;
