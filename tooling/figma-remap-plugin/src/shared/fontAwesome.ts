/**
 * Font Awesome 6 (and older) → Font Awesome 7 family rewrites for text glyphs.
 *
 * Custom kit faces are unversioned (`Font Awesome Kit {id}`) even on FA7
 * desktop downloads — do not invent `Font Awesome 7 Kit …` or treat kits as
 * outdated stock fonts.
 */

/** Target key prefix for FA family upgrades (not a Figma variable/style key). */
export const FA_FAMILY_TARGET_PREFIX = "fontfamily:";

export function isFontAwesomeFamily(family: string): boolean {
  return /^font awesome\b/i.test(family.trim());
}

/** Custom-icon kit faces (monotone or duotone). Family names never carry "7". */
export function isFontAwesomeKitFamily(family: string): boolean {
  return isFontAwesomeFamily(family) && /\bkit\b/i.test(family);
}

export function isFontAwesome7Family(family: string): boolean {
  return /^font awesome\s+7\b/i.test(family.trim());
}

/**
 * Compliant for CADS typography audit: FA7 stock/subset faces, or any kit
 * face (kits are the supported custom-icon path and stay unversioned).
 */
export function isFontAwesomeCurrentFamily(family: string): boolean {
  return isFontAwesome7Family(family) || isFontAwesomeKitFamily(family);
}

/**
 * Rewrite a pre-FA7 Font Awesome family to the FA7 equivalent.
 * "Font Awesome 6 Pro" → "Font Awesome 7 Pro"
 * "Font Awesome Pro" → "Font Awesome 7 Pro"
 * Kit families → null (already current; no rewrite).
 */
export function toFontAwesome7Family(family: string): string | null {
  const trimmed = family.trim();
  if (!isFontAwesomeFamily(trimmed) || isFontAwesomeCurrentFamily(trimmed)) {
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
