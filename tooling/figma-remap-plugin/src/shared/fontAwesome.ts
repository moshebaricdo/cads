/**
 * Font Awesome 6 (and older) → Font Awesome 7 family rewrites for text glyphs.
 */

/** Target key prefix for FA family upgrades (not a Figma variable/style key). */
export const FA_FAMILY_TARGET_PREFIX = "fontfamily:";

export function isFontAwesomeFamily(family: string): boolean {
  return /^font awesome\b/i.test(family.trim());
}

export function isFontAwesome7Family(family: string): boolean {
  return /^font awesome\s+7\b/i.test(family.trim());
}

/**
 * Rewrite a pre-FA7 Font Awesome family to the FA7 equivalent.
 * "Font Awesome 6 Pro" → "Font Awesome 7 Pro"
 * "Font Awesome Pro" → "Font Awesome 7 Pro"
 */
export function toFontAwesome7Family(family: string): string | null {
  const trimmed = family.trim();
  if (!isFontAwesomeFamily(trimmed) || isFontAwesome7Family(trimmed)) {
    return null;
  }
  // Font Awesome [N] Rest…  OR  Font Awesome Rest… (no version)
  const withVersion = trimmed.match(/^font awesome\s+\d+\s+(.+)$/i);
  if (withVersion) {
    return `Font Awesome 7 ${withVersion[1].trim()}`;
  }
  const withoutVersion = trimmed.match(/^font awesome\s+(.+)$/i);
  if (withoutVersion) {
    const rest = withoutVersion[1].trim();
    // Avoid "Font Awesome 7 7 Pro" if somehow already versioned oddly.
    if (/^\d+\b/.test(rest)) {
      return `Font Awesome 7 ${rest.replace(/^\d+\s+/, "")}`;
    }
    return `Font Awesome 7 ${rest}`;
  }
  return null;
}

export function faFamilyTargetKey(family: string): string {
  return `${FA_FAMILY_TARGET_PREFIX}${family}`;
}

export function parseFaFamilyTargetKey(targetKey: string): string | null {
  if (!targetKey.startsWith(FA_FAMILY_TARGET_PREFIX)) return null;
  const family = targetKey.slice(FA_FAMILY_TARGET_PREFIX.length).trim();
  return family || null;
}
