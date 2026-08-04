/**
 * Icon catalog for the plugin UI, sourced from the same codepoint maps that
 * power `FaIcon` in @codeai/cads-react — the single source of truth for
 * which shortcodes exist and what they render.
 *
 * Custom kit icons will be appended here (fetched from the FA API) in a later
 * milestone; the UI already treats this as one flat searchable catalog.
 */
import {
  FA_PRO_SOLID_CODEPOINTS,
  FA_ICON_ALIASES,
} from "../../../../packages/react/src/icons/faProRegularCodepoints";
import { FA_BRANDS_CODEPOINTS } from "../../../../packages/react/src/icons/faBrandsCodepoints";

export interface IconEntry {
  /** Canonical shortcode — what gets inserted */
  name: string;
  /** Hex codepoint (no 0x) for glyph preview */
  codepoint: string;
  /** Extra searchable terms (designer aliases like "smile", "home") */
  aliases: string[];
  /** When browsing "All", which face this glyph came from (for preview + insert) */
  fontFamily?: string;
  fontStyle?: string;
  fontWeight?: number;
}

function buildEntries(
  map: Record<string, string>,
  aliases: Record<string, string>,
): IconEntry[] {
  const aliasesByCanonical = new Map<string, string[]>();
  for (const [alias, canonical] of Object.entries(aliases)) {
    const list = aliasesByCanonical.get(canonical) ?? [];
    list.push(alias);
    aliasesByCanonical.set(canonical, list);
  }
  return Object.entries(map)
    .filter(([name]) => name.length > 1) // skip single letters/digits (font plumbing, not icons)
    .map(([name, codepoint]) => ({
      name,
      codepoint,
      aliases: aliasesByCanonical.get(name) ?? [],
    }));
}

export const SOLID_ICONS: IconEntry[] = buildEntries(
  FA_PRO_SOLID_CODEPOINTS,
  FA_ICON_ALIASES,
);

export const BRAND_ICONS: IconEntry[] = buildEntries(FA_BRANDS_CODEPOINTS, {});
