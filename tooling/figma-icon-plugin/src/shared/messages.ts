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

/** A font the user pointed the plugin at (parsed from the font file itself). */
export interface StoredFont {
  family: string;
  style: string;
  /** shortcode → hex codepoint, read from the font's glyph table */
  glyphs: Record<string, string>;
  fileName: string;
}

export interface PluginSettings {
  fonts: StoredFont[];
}

export const EMPTY_SETTINGS: PluginSettings = { fonts: [] };

export type UiToCodeMessage =
  | { type: "init" }
  | { type: "save-settings"; settings: PluginSettings }
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
  | { type: "inserted"; ok: boolean; detail: string };
