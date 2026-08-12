/**
 * Message protocol between the plugin main thread (code.ts) and the UI iframe.
 */

export interface InstanceTextProp {
  /** Full component property key, e.g. "iconName#123:4" */
  key: string;
  /** Human label, e.g. "iconName" */
  label: string;
  /** Current value of the property */
  value: string;
}

export type InsertTarget =
  | {
      kind: "instance";
      nodeName: string;
      textProps: InstanceTextProp[];
    }
  | {
      kind: "text";
      nodeName: string;
      /** Bound TEXT component property label, when this layer maps to one */
      propName?: string;
      /** >1 when multiple text layers are selected (incl. Figma multi-edit) */
      count?: number;
    }
  | { kind: "create" };

export interface FontNameLike {
  family: string;
  style: string;
}

/** An installed Font Awesome family and its available styles. */
export interface FaFont {
  family: string;
  styles: string[];
}

/**
 * SVG path preview for a custom kit upload (from FA `iconUploads`).
 * Used by the picker so previews don't depend on the OS-installed kit OTF
 * (Windows font cache often serves a stale face after kit updates).
 */
export interface GlyphPreview {
  pathData: string[];
  width: number;
  height: number;
}

/** A font the user pointed the plugin at (parsed from the font file itself). */
export interface StoredFont {
  family: string;
  style: string;
  /** shortcode → hex codepoint, read from the font's glyph table */
  glyphs: Record<string, string>;
  /**
   * shortcode → SVG paths for custom kit uploads (API sync).
   * When present, the picker renders these instead of unicode + OTF.
   */
  previews?: Record<string, GlyphPreview>;
  fileName: string;
  /** Set when this face was populated via FA Kit API sync (not a local OTF). */
  source?: "file" | "api";
  /** Kit token when `source === "api"`. */
  apiKitToken?: string;
  /** FA GraphQL family when `source === "api"` (classic, kit, …). */
  apiFamily?: string;
  /** FA GraphQL style when `source === "api"` (solid, custom, …). */
  apiStyle?: string;
  /** Kit display name when `source === "api"`. */
  apiKitName?: string;
}

export interface PluginSettings {
  fonts: StoredFont[];
  /**
   * Style to select when the plugin opens (and after fonts reload with no
   * user pick yet). Match is by face style name, e.g. "Solid" / "Regular".
   * Use "All" to open on the union view.
   */
  preferredStyle: string;
  /**
   * Font Awesome account API token (`kits_read`). Used only for optional
   * Custom Kit catalog sync — never required for local OTF import.
   */
  faApiToken?: string;
  /** Selected kit id (hex token), e.g. from `Font Awesome Kit {id}`. */
  kitToken?: string;
  /** ISO timestamp of the last successful kit API sync. */
  kitSyncedAt?: string;
}

export const EMPTY_SETTINGS: PluginSettings = {
  fonts: [],
  preferredStyle: "Solid",
};

/** Persisted FA kit catalog so Settings can open without a network round-trip. */
export interface FaKitCatalogCache {
  /** Account API token this catalog was fetched with. */
  apiToken: string;
  fetchedAt: string;
  kits: Array<{ token: string; name: string }>;
  faces: Array<{
    kitToken: string;
    kitName: string;
    family: string;
    style: string;
    label: string;
    version: string;
    kind: "official" | "custom";
  }>;
}

/**
 * Persisted per-kit official glyph maps (family|style → name→hex).
 * Only kits the user has imported styles from are stored.
 */
export interface FaGlyphCacheBlob {
  apiToken: string;
  /** kitToken → "family|style" → name → hex */
  kits: Record<string, Record<string, Record<string, string>>>;
}

export type UiToCodeMessage =
  | { type: "init" }
  | { type: "save-settings"; settings: PluginSettings }
  | { type: "save-kit-catalog"; catalog: FaKitCatalogCache | null }
  | { type: "save-glyph-cache"; cache: FaGlyphCacheBlob | null }
  | { type: "notify"; message: string; error?: boolean }
  | {
      type: "insert";
      name: string;
      /** Exact font to apply for text-layer / new-layer insertion */
      fontName: FontNameLike;
      /** Required when the target is an instance with more than one text prop */
      propKey?: string;
    };

export type CodeToUiMessage =
  | { type: "selection"; target: InsertTarget }
  | { type: "fonts"; faFonts: FaFont[] }
  | { type: "settings"; settings: PluginSettings }
  | { type: "kit-catalog"; catalog: FaKitCatalogCache | null }
  | { type: "glyph-cache"; cache: FaGlyphCacheBlob | null }
  | { type: "inserted"; ok: boolean; detail: string };
