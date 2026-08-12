import type { Metadata } from "next";

/** Soft cap for meta descriptions (search result snippets). */
const META_DESC_MAX = 160;

/** Collapse whitespace and trim for a single-line meta description. */
export function toMetaDescription(
  text: string,
  max: number = META_DESC_MAX,
): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= max) return normalized;

  const slice = normalized.slice(0, max - 1);
  const sentenceEnd = Math.max(
    slice.lastIndexOf(". "),
    slice.lastIndexOf("! "),
    slice.lastIndexOf("? "),
  );
  if (sentenceEnd >= Math.floor(max * 0.5)) {
    return slice.slice(0, sentenceEnd + 1).trim();
  }

  const wordEnd = slice.lastIndexOf(" ");
  const clipped = (wordEnd > 0 ? slice.slice(0, wordEnd) : slice).trimEnd();
  return `${clipped}…`;
}

/** Per-route metadata; root layout supplies the `%s | CADS Docs` title template. */
export function docsMetadata(title: string, description: string): Metadata {
  return {
    title,
    description: toMetaDescription(description),
  };
}
