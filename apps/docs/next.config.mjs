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
 * This stops `vite build` / `pnpm build:react` from deleting modules out from
 * under a live Turbopack server (Module not found → .next cache corruption).
 *
 * Turbopack resolves these relative to the docs app dir (`apps/docs`).
 * Wildcard `/*` covers subpaths (`/icons`, `/manifest`, …).
 */
const turbopackSrcAliases = {
  "@moshebaricdo/cads-react/manifest":
    "../../packages/react/src/manifest/cads.manifest.ts",
  "@moshebaricdo/cads-react/icons/fonts.css":
    "../../packages/react/src/icons/fonts.css",
  "@moshebaricdo/cads-react/icons/fonts-solid.css":
    "../../packages/react/src/icons/fonts-solid.css",
  "@moshebaricdo/cads-react/*": "../../packages/react/src/*",
  "@moshebaricdo/cads-react": "../../packages/react/src/index.ts",
  "@moshebaricdo/cads-variables/theme": "../../packages/variables/src/theme.ts",
  "@moshebaricdo/cads-variables/variables.css":
    "../../packages/variables/src/variables.css",
  "@moshebaricdo/cads-variables/data/color-system.json":
    "../../packages/variables/src/data/codeAiColorSystem.json",
  "@moshebaricdo/cads-variables/*": "../../packages/variables/src/*",
  "@moshebaricdo/cads-variables": "../../packages/variables/src/index.ts",
};

const webpackSrcAliases = {
  "@moshebaricdo/cads-react/manifest$": path.join(
    reactSrcAbs,
    "manifest/cads.manifest.ts",
  ),
  "@moshebaricdo/cads-react/icons/fonts.css$": path.join(
    reactSrcAbs,
    "icons/fonts.css",
  ),
  "@moshebaricdo/cads-react/icons/fonts-solid.css$": path.join(
    reactSrcAbs,
    "icons/fonts-solid.css",
  ),
  "@moshebaricdo/cads-react$": path.join(reactSrcAbs, "index.ts"),
  "@moshebaricdo/cads-react": reactSrcAbs,
  "@moshebaricdo/cads-variables/theme$": path.join(variablesSrcAbs, "theme.ts"),
  "@moshebaricdo/cads-variables/variables.css$": path.join(
    variablesSrcAbs,
    "variables.css",
  ),
  "@moshebaricdo/cads-variables/data/color-system.json$": path.join(
    variablesSrcAbs,
    "data/codeAiColorSystem.json",
  ),
  "@moshebaricdo/cads-variables$": path.join(variablesSrcAbs, "index.ts"),
  "@moshebaricdo/cads-variables": variablesSrcAbs,
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
  transpilePackages: ["@moshebaricdo/cads-react", "@moshebaricdo/cads-variables"],
  reactStrictMode: true,
  experimental: {
    /** Turn barrel imports into per-module imports for smaller client graphs. */
    optimizePackageImports: ["@moshebaricdo/cads-react", "@mui/material"],
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
