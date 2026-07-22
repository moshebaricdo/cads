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
 * Production/export keeps package.json `exports` → committed `dist/`.
 * This stops `tsup clean` / `pnpm build:react` from deleting modules out from
 * under a live Turbopack server (Module not found → .next cache corruption).
 *
 * Turbopack resolves these relative to the docs app dir (`apps/docs`).
 * Wildcard `/*` covers deep imports (`/components/Button`, `/icons`, …).
 */
const turbopackSrcAliases = {
  "@codeai/cads-react/manifest":
    "../../packages/react/src/manifest/cads.manifest.ts",
  "@codeai/cads-react/icons/fonts.css":
    "../../packages/react/src/icons/fonts.css",
  "@codeai/cads-react/icons/fonts-solid.css":
    "../../packages/react/src/icons/fonts-solid.css",
  "@codeai/cads-react/*": "../../packages/react/src/*",
  "@codeai/cads-react": "../../packages/react/src/index.ts",
  "@codeai/cads-variables/theme": "../../packages/variables/src/theme.ts",
  "@codeai/cads-variables/variables.css":
    "../../packages/variables/src/variables.css",
  "@codeai/cads-variables/data/color-system.json":
    "../../packages/variables/src/data/codeAiColorSystem.json",
  "@codeai/cads-variables/*": "../../packages/variables/src/*",
  "@codeai/cads-variables": "../../packages/variables/src/index.ts",
};

const webpackSrcAliases = {
  "@codeai/cads-react/manifest$": path.join(
    reactSrcAbs,
    "manifest/cads.manifest.ts",
  ),
  "@codeai/cads-react/icons/fonts.css$": path.join(
    reactSrcAbs,
    "icons/fonts.css",
  ),
  "@codeai/cads-react/icons/fonts-solid.css$": path.join(
    reactSrcAbs,
    "icons/fonts-solid.css",
  ),
  "@codeai/cads-react$": path.join(reactSrcAbs, "index.ts"),
  "@codeai/cads-react": reactSrcAbs,
  "@codeai/cads-variables/theme$": path.join(variablesSrcAbs, "theme.ts"),
  "@codeai/cads-variables/variables.css$": path.join(
    variablesSrcAbs,
    "variables.css",
  ),
  "@codeai/cads-variables/data/color-system.json$": path.join(
    variablesSrcAbs,
    "data/codeAiColorSystem.json",
  ),
  "@codeai/cads-variables$": path.join(variablesSrcAbs, "index.ts"),
  "@codeai/cads-variables": variablesSrcAbs,
};

const isDev = process.env.NODE_ENV !== "production";

const nextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  transpilePackages: ["@codeai/cads-react", "@codeai/cads-variables"],
  reactStrictMode: true,
  experimental: {
    /** Turn barrel imports into per-module imports for smaller client graphs. */
    optimizePackageImports: ["@codeai/cads-react", "@mui/material"],
  },
  ...(isDev
    ? {
        // Aliases are relative to apps/docs. Lockfile at repo root already
        // makes Turbopack treat the monorepo as the watch root.
        turbopack: {
          resolveAlias: turbopackSrcAliases,
        },
      }
    : {}),
  webpack: (config, { dev }) => {
    if (dev) {
      config.resolve.alias = {
        ...config.resolve.alias,
        ...webpackSrcAliases,
      };
    }
    return config;
  },
};

export default nextConfig;
