/**
 * Prefix a root-relative public path with the Next.js `basePath` (e.g. `/cads`
 * on GitHub Pages). `next/link` handles this automatically; `next/image` with
 * `images.unoptimized` and plain `<a>` / metadata URLs do not.
 */
export function withBasePath(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  return `${base}${path}`;
}
