/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === "true";
/** Project Pages URL is https://<user>.github.io/cads/ */
const basePath = isGithubPages ? "/cads" : "";

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
};

export default nextConfig;
