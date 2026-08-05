/**
 * Wave A+B DSCO → CADS component swap rules.
 *
 * Harvested 2026-08-04 via Figma import-by-key against
 * `(OLD) DSCO Components` and `CodeAI Design System (CADS)`.
 *
 * Supported: Link, Tag, Chip, Close Icon Button, Button (+ Destructive),
 * Alert, Toast, Notification Banner, Font Awesome Icon (+ Duotone).
 */

import { cadsComponents } from "./cadsCatalog";

export interface ComponentSwapRule {
  /** Published DSCO component-set key. */
  dscoKey: string;
  dscoName: string;
  /** Published CADS component-set name (resolved to key via catalog). */
  cadsName: string;
  /**
   * Forced variant overrides applied after name/value remaps
   * (e.g. Destructive Button → color=error).
   */
  forceVariants?: Record<string, string>;
  /**
   * Source prop base-name (before `#…`) → target prop base-name.
   * Variant axes use the axis name as both source and target unless remapped.
   */
  propNames?: Record<string, string>;
  /** Per-axis value remaps (source value → target value). Case-sensitive on source. */
  variantValues?: Record<string, Record<string, string>>;
  /**
   * When true, read the first TEXT descendant's characters before swap and
   * write them to `textCaptureTarget` after swap (for components whose label
   * isn't a shared TEXT property key).
   */
  captureText?: boolean;
  textCaptureTarget?: string;
}

const SIZE_LMXS: Record<string, string> = {
  L: "large",
  M: "medium",
  S: "small",
  XS: "extraSmall",
  large: "large",
  medium: "medium",
  small: "small",
  extraSmall: "extraSmall",
};

const STATE_DEFAULT: Record<string, string> = {
  Default: "default",
  default: "default",
  Hover: "hover",
  hover: "hover",
  Focus: "focus",
  focus: "focus",
  Pressed: "pressed",
  pressed: "pressed",
  Press: "press",
  press: "press",
  Disabled: "disabled",
  disabled: "disabled",
  Visited: "visited",
  visited: "visited",
};

const MEANING_TO_SENTIMENT: Record<string, string> = {
  Primary: "brand",
  Brand: "brand",
  Success: "success",
  Danger: "error",
  Error: "error",
  Warning: "warning",
  Info: "info",
  Gray: "neutral",
  Aqua: "pink",
};

const MEANING_TO_TOAST_SENTIMENT: Record<string, string> = {
  Primary: "primary",
  Success: "success",
  Danger: "error",
  Warning: "warning",
  Info: "info",
  Gray: "neutral",
};

/** Published DSCO keys that support one-click swap with prop remapping. */
export const componentSwapRules: ComponentSwapRule[] = [
  {
    dscoKey: "cbc707599ceb83eaa1cee51d698831793e0ebde6",
    dscoName: "Button",
    cadsName: "Button",
    // Current published DSCO Button ≈ CADS (same axes). Stale consumer
    // instances may still carry older names/values (Size/S, startIcon Name).
    propNames: {
      "startIcon Name": "startIconName",
      "endIcon Name": "endIconName",
      Size: "size",
      State: "state",
      Color: "color",
      Variant: "variant",
      "Icon Only": "iconOnly",
      IconOnly: "iconOnly",
    },
    variantValues: {
      // Current: large/medium/small/extraSmall. Legacy: L/M/S/XS.
      size: SIZE_LMXS,
      Size: SIZE_LMXS,
      state: STATE_DEFAULT,
      State: STATE_DEFAULT,
      color: {
        primary: "primary",
        secondary: "secondary",
        tertiary: "tertiary",
        "white (deprecated)": "secondary",
        white: "secondary",
        error: "error",
        Primary: "primary",
        Secondary: "secondary",
        Tertiary: "tertiary",
        Error: "error",
      },
      Color: {
        primary: "primary",
        secondary: "secondary",
        tertiary: "tertiary",
        "white (deprecated)": "secondary",
        white: "secondary",
        Primary: "primary",
        Secondary: "secondary",
        Tertiary: "tertiary",
      },
      variant: {
        contained: "contained",
        outlined: "outlined",
        text: "text",
        Contained: "contained",
        Outlined: "outlined",
        Text: "text",
        filled: "contained",
        Filled: "contained",
      },
      Variant: {
        contained: "contained",
        outlined: "outlined",
        text: "text",
        Contained: "contained",
        Outlined: "outlined",
        Text: "text",
        filled: "contained",
        Filled: "contained",
      },
      iconOnly: { No: "No", Yes: "Yes", no: "No", yes: "Yes", false: "No", true: "Yes" },
      "Icon Only": { No: "No", Yes: "Yes", no: "No", yes: "Yes" },
    },
  },
  {
    dscoKey: "0478bc835a0e7e1593fc0e6f3044f54730b66861",
    dscoName: "Destructive Button",
    cadsName: "Button",
    forceVariants: { color: "error" },
    propNames: {
      "startIcon Name": "startIconName",
      "endIcon Name": "endIconName",
      Size: "size",
      State: "state",
      Color: "color",
      Variant: "variant",
      "Icon Only": "iconOnly",
      IconOnly: "iconOnly",
    },
    variantValues: {
      size: SIZE_LMXS,
      Size: SIZE_LMXS,
      state: STATE_DEFAULT,
      State: STATE_DEFAULT,
      variant: {
        contained: "contained",
        outlined: "outlined",
        text: "text",
        Contained: "contained",
        Outlined: "outlined",
        Text: "text",
        filled: "contained",
        Filled: "contained",
      },
      Variant: {
        contained: "contained",
        outlined: "outlined",
        text: "text",
        Contained: "contained",
        Outlined: "outlined",
        Text: "text",
        filled: "contained",
        Filled: "contained",
      },
      iconOnly: { No: "No", Yes: "Yes", no: "No", yes: "Yes", false: "No", true: "Yes" },
    },
  },
  {
    dscoKey: "385632d619eb1dffc825a323a3f596b2011f8bb7",
    dscoName: "Close Icon Button",
    cadsName: "Close Icon Button",
    propNames: {
      Size: "size",
      State: "state",
      Color: "color",
    },
    variantValues: {
      size: SIZE_LMXS,
      Size: SIZE_LMXS,
      state: {
        ...STATE_DEFAULT,
        Pressed: "press",
        pressed: "press",
      },
      State: {
        ...STATE_DEFAULT,
        Pressed: "press",
        pressed: "press",
      },
      color: {
        Default: "primary",
        Strong: "secondary",
        "Solid Black": "primary",
        "Solid White": "secondary",
        primary: "primary",
        secondary: "secondary",
      },
      Color: {
        Default: "primary",
        Strong: "secondary",
        "Solid Black": "primary",
        "Solid White": "secondary",
      },
    },
  },
  {
    dscoKey: "341373d642bfd3c0e0cbb35c1130b146945a2321",
    dscoName: "Chip",
    cadsName: "Chip",
    propNames: {
      Text: "label",
      Size: "size",
      Selected: "selected",
      Color: "color",
      State: "state",
      Type: "labelStyle",
    },
    variantValues: {
      size: SIZE_LMXS,
      Size: SIZE_LMXS,
      selected: { No: "no", Yes: "yes", no: "no", yes: "yes" },
      Selected: { No: "no", Yes: "yes" },
      color: {
        Gray: "primary",
        Black: "secondary",
        Selected: "primary",
        primary: "primary",
        secondary: "secondary",
      },
      Color: {
        Gray: "primary",
        Black: "secondary",
        Selected: "primary",
      },
      labelStyle: { Thick: "thick", Thin: "thin", thick: "thick", thin: "thin" },
      Type: { Thick: "thick", Thin: "thin" },
      state: {
        ...STATE_DEFAULT,
        Pressed: "press",
        pressed: "press",
      },
      State: {
        ...STATE_DEFAULT,
        Pressed: "press",
        pressed: "press",
      },
    },
  },
  {
    dscoKey: "8314a929103d75e027acd08445eb326299d24b74",
    dscoName: "Link",
    cadsName: "Link",
    captureText: true,
    textCaptureTarget: "linkText",
    propNames: {
      Size: "size",
      State: "state",
      Type: "type",
    },
    variantValues: {
      size: SIZE_LMXS,
      Size: SIZE_LMXS,
      type: {
        Primary: "primary",
        Secondary: "secondary",
        primary: "primary",
        secondary: "secondary",
      },
      Type: { Primary: "primary", Secondary: "secondary" },
      state: {
        ...STATE_DEFAULT,
        Pressed: "press",
        pressed: "press",
      },
      State: {
        ...STATE_DEFAULT,
        Pressed: "press",
        pressed: "press",
      },
    },
  },
  {
    dscoKey: "6da8599310350b4a87b2a2f8e08d34ae3376a1d1",
    dscoName: "Tag",
    cadsName: "Tag",
    propNames: {
      Label: "labelText",
      "Icon Name": "startIconName",
      Size: "size",
      Color: "color",
      "Is Removable": "isDismissible",
    },
    variantValues: {
      size: SIZE_LMXS,
      Size: SIZE_LMXS,
      color: {
        Teal: "brand",
        Purple: "pink",
        Aqua: "info",
        Error: "error",
        Warning: "warning",
        Success: "success",
        Gray: "neutral",
        Disabled: "neutral",
        brand: "brand",
        neutral: "neutral",
        pink: "pink",
        orange: "orange",
        success: "success",
        error: "error",
        warning: "warning",
        info: "info",
      },
      Color: {
        Teal: "brand",
        Purple: "pink",
        Aqua: "info",
        Error: "error",
        Warning: "warning",
        Success: "success",
        Gray: "neutral",
        Disabled: "neutral",
      },
    },
  },
  {
    dscoKey: "3133f83a3f98b68c1f3081132b2e90bb5d1dc59a",
    dscoName: "Alert",
    cadsName: "Alert",
    propNames: {
      Size: "size",
      Meaning: "sentiment",
      hasLink: "hasAction",
      hasIcon: "hasIcon",
    },
    variantValues: {
      size: SIZE_LMXS,
      Size: SIZE_LMXS,
      sentiment: MEANING_TO_SENTIMENT,
      Meaning: MEANING_TO_SENTIMENT,
      hasIcon: { Yes: "true", No: "false", yes: "true", no: "false" },
    },
  },
  {
    dscoKey: "949e2949033f60df26231b2f73985b488f9f78fe",
    dscoName: "Toast",
    cadsName: "Toast",
    propNames: {
      alertText: "toastText",
      alertIcon: "toastIcon",
      Meaning: "sentiment",
      hasLink: "hasAction",
      hasIcon: "hasIcon",
    },
    variantValues: {
      sentiment: MEANING_TO_TOAST_SENTIMENT,
      Meaning: MEANING_TO_TOAST_SENTIMENT,
      hasIcon: { Yes: "true", No: "false", yes: "true", no: "false" },
    },
  },
  {
    dscoKey: "64993adac217e2c6daab4eb131f94531d02e65a9",
    dscoName: "Notification Banner",
    cadsName: "Notification Banner",
    propNames: {
      Title: "titleText",
      Description: "descriptionText",
      Icon: "iconName",
      "Secondary Action": "hasSecondaryAction",
      "Primary Action": "hasPrimaryAction",
      "Dismissible   ": "isDismissible",
      Dismissible: "isDismissible",
      Meaning: "sentiment",
      Style: "fillStyle",
    },
    variantValues: {
      sentiment: MEANING_TO_SENTIMENT,
      Meaning: MEANING_TO_SENTIMENT,
      fillStyle: { Default: "none", Color: "color", none: "none", color: "color" },
      Style: { Default: "none", Color: "color" },
    },
  },
  // FA Icon → v7: identical prop surface (icon-name TEXT + style/padding/scale).
  {
    dscoKey: "051a05d840dcf0a8220c056833c040fc581dff41",
    dscoName: "Font Awesome Icon",
    cadsName: "Font Awesome Icon v7",
  },
  {
    dscoKey: "2073beaaf6394b66220e04a5588a35e08d66daf2",
    dscoName: "Font Awesome Duotone Icon",
    cadsName: "Font Awesome Duotone Icon v7",
  },
  // Pegasus FA Icon shares the same published prop surface as DSCO.
  {
    dscoKey: "6315f244285e23cac76df5c8e3c807276fdc0da4",
    dscoName: "Font Awesome Icon",
    cadsName: "Font Awesome Icon v7",
  },
];

const ruleByDscoKey = new Map(
  componentSwapRules.map((rule) => [rule.dscoKey, rule]),
);

const cadsKeyByName = new Map(
  cadsComponents.map((component) => [component.name, component.key]),
);

export function propBaseName(key: string): string {
  return key.split("#")[0] ?? key;
}

/** Parse a component-set variant child name (`size=small, variant=contained, …`). */
export function parseVariantName(name: string): Record<string, string> {
  const result: Record<string, string> = {};
  if (!name.includes("=")) return result;
  for (const part of name.split(",")) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    const key = part.slice(0, eq).trim();
    const value = part.slice(eq + 1).trim();
    if (key) result[key] = value;
  }
  return result;
}

/** Normalize common size shorthand used across DSCO sets. */
export function normalizeSizeValue(value: string): string {
  return SIZE_LMXS[value] ?? SIZE_LMXS[value.trim()] ?? value;
}

export function getComponentSwapRule(
  dscoKey: string,
): ComponentSwapRule | null {
  return ruleByDscoKey.get(dscoKey) ?? null;
}

export function isSwappableComponentKey(dscoKey: string): boolean {
  return ruleByDscoKey.has(dscoKey);
}

export function resolveCadsComponentKey(cadsName: string): string | null {
  return cadsKeyByName.get(cadsName) ?? null;
}

/**
 * Resolve the CADS component-set key for a non-CADS finding, when swap is
 * supported for that DSCO key (Wave A+B).
 */
export function resolveSwapTargetKey(source: {
  key: string;
}): string | null {
  const rule = getComponentSwapRule(source.key);
  if (rule) return resolveCadsComponentKey(rule.cadsName);
  return null;
}

export interface CapturedComponentProps {
  /** Raw componentProperties snapshot (key → value). */
  properties: Record<string, string | boolean>;
  /** Variant axis snapshot when available. */
  variants: Record<string, string>;
  /** Optional captured free-text from a TEXT descendant. */
  capturedText: string | null;
  /** Tag-specific: DSCO Icon axis (Left/Right/None). */
  tagIconPlacement: "Left" | "Right" | "None" | null;
}

function normalizePropBase(name: string): string {
  return name.replace(/\s+/g, "").toLocaleLowerCase();
}

function findTargetPropKey(
  targetProps: Record<string, { type: string }>,
  baseName: string,
): string | null {
  if (targetProps[baseName]) return baseName;
  const lower = baseName.toLocaleLowerCase();
  const compacted = normalizePropBase(baseName);
  for (const key of Object.keys(targetProps)) {
    const base = propBaseName(key);
    if (base.toLocaleLowerCase() === lower) return key;
    if (normalizePropBase(base) === compacted) return key;
  }
  return null;
}

function remapVariantValue(
  rule: ComponentSwapRule,
  axis: string,
  value: string,
): string {
  const table = rule.variantValues?.[axis];
  if (table && table[value] !== undefined) return table[value];
  // Case-insensitive fallback for state/size-like axes.
  if (table) {
    const hit = Object.entries(table).find(
      ([from]) => from.toLocaleLowerCase() === value.toLocaleLowerCase(),
    );
    if (hit) return hit[1];
  }
  // Global size shorthand (S/M/L/XS) even when the rule table is identity-only.
  if (axis.toLocaleLowerCase() === "size") {
    return normalizeSizeValue(value);
  }
  return value;
}

/**
 * CADS Button has restricted variant combinations (from Figma / parity notes):
 * - color=tertiary only for variant=text + iconOnly=Yes → else secondary
 * - color=orange only for variant=contained → else primary
 * - outlined + iconOnly only supports primary/secondary/error
 */
function applyButtonRestrictedCombos(
  variants: Record<string, string>,
): Record<string, string> {
  const out = { ...variants };
  const variant = out.variant;
  const color = out.color;
  const iconOnly = out.iconOnly;

  if (color === "tertiary") {
    const tertiaryOk = variant === "text" && iconOnly === "Yes";
    if (!tertiaryOk) out.color = "secondary";
  }

  if (out.color === "orange" && variant !== "contained") {
    out.color = "primary";
  }

  // Outlined icon-only has no tertiary/orange/white in CADS.
  if (variant === "outlined" && iconOnly === "Yes") {
    if (out.color === "tertiary" || out.color === "orange") {
      out.color = out.color === "orange" ? "primary" : "secondary";
    }
  }

  return out;
}

/**
 * Remapped target variant axes (axis name → value) for exact variant matching.
 * Always forces interactive `state` to `default` when that axis exists on source.
 */
export function remapVariants(
  rule: ComponentSwapRule,
  captured: CapturedComponentProps,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [axis, value] of Object.entries(captured.variants)) {
    const targetAxis = rule.propNames?.[axis] ?? axis;
    // Skip axes that become booleans on CADS (e.g. Alert hasIcon Yes/No).
    const remapped = remapVariantValue(rule, axis, value);
    const alsoByTarget = remapVariantValue(rule, targetAxis, remapped);
    if (
      alsoByTarget === "true" ||
      alsoByTarget === "false" ||
      alsoByTarget === "Yes" ||
      alsoByTarget === "No" ||
      alsoByTarget === "yes" ||
      alsoByTarget === "no"
    ) {
      // Only skip when the source axis is a Yes/No VARIANT that we map to BOOLEAN.
      // iconOnly stays Yes/No on Button.
      if (targetAxis.toLocaleLowerCase() === "hasicon") continue;
    }
    if (targetAxis.toLocaleLowerCase() === "state") {
      out[targetAxis] = "default";
      continue;
    }
    out[targetAxis] = alsoByTarget;
  }
  if (rule.forceVariants) {
    for (const [axis, value] of Object.entries(rule.forceVariants)) {
      out[axis] = value;
    }
  }
  if (rule.cadsName === "Button") {
    return applyButtonRestrictedCombos(out);
  }
  return out;
}

/**
 * TEXT/BOOLEAN (and VARIANT→BOOLEAN) payload for setProperties after swap.
 * Variant axes are applied by swapping to an exact matching component child.
 */
export function buildContentProperties(
  rule: ComponentSwapRule,
  captured: CapturedComponentProps,
  targetProps: Record<string, { type: string }>,
): Record<string, string | boolean> {
  const targetMeta: Record<string, { type: string }> = { ...targetProps };
  const out: Record<string, string | boolean> = {};

  for (const [sourceKey, value] of Object.entries(captured.properties)) {
    const sourceBase = propBaseName(sourceKey);
    const targetBase = rule.propNames?.[sourceBase] ?? sourceBase;
    const targetKey = findTargetPropKey(targetMeta, targetBase);
    if (!targetKey) continue;
    const targetType = targetMeta[targetKey].type;
    if (targetType === "VARIANT") continue;
    if (targetType === "BOOLEAN") {
      if (typeof value === "boolean") out[targetKey] = value;
      else if (value === "true" || value === "Yes" || value === "yes")
        out[targetKey] = true;
      else if (value === "false" || value === "No" || value === "no")
        out[targetKey] = false;
      continue;
    }
    if (
      targetType === "TEXT" &&
      (typeof value === "string" || typeof value === "boolean")
    ) {
      out[targetKey] = String(value);
    }
  }

  // VARIANT → BOOLEAN (Alert/Toast hasIcon Yes/No).
  for (const [axis, value] of Object.entries(captured.variants)) {
    const targetAxis = rule.propNames?.[axis] ?? axis;
    const targetKey = findTargetPropKey(targetMeta, targetAxis);
    if (!targetKey || targetMeta[targetKey].type !== "BOOLEAN") continue;
    const remapped = remapVariantValue(rule, axis, value);
    if (remapped === "true" || remapped === "Yes" || remapped === "yes") {
      out[targetKey] = true;
    } else if (
      remapped === "false" ||
      remapped === "No" ||
      remapped === "no"
    ) {
      out[targetKey] = false;
    }
  }

  if (captured.tagIconPlacement) {
    const startKey = findTargetPropKey(targetMeta, "startIcon");
    const endKey = findTargetPropKey(targetMeta, "endIcon");
    if (startKey && targetMeta[startKey].type === "BOOLEAN") {
      out[startKey] = captured.tagIconPlacement === "Left";
    }
    if (endKey && targetMeta[endKey].type === "BOOLEAN") {
      out[endKey] = captured.tagIconPlacement === "Right";
    }
  }

  if (rule.captureText && rule.textCaptureTarget && captured.capturedText) {
    const targetKey = findTargetPropKey(targetMeta, rule.textCaptureTarget);
    if (targetKey) out[targetKey] = captured.capturedText;
  }

  const removable =
    captured.variants["Is Removable"] ?? captured.variants.isDismissible;
  if (removable !== undefined) {
    const targetKey = findTargetPropKey(targetMeta, "isDismissible");
    if (targetKey && targetMeta[targetKey].type === "BOOLEAN") {
      out[targetKey] =
        removable === "Yes" || removable === "yes" || removable === "true";
    }
  }

  return out;
}

/**
 * Full setProperties payload (variants + content). Used as fallback when an
 * exact variant child can't be found in the imported CADS set.
 */
export function buildSwapProperties(
  rule: ComponentSwapRule,
  captured: CapturedComponentProps,
  targetProps: Record<string, { type: string }>,
): Record<string, string | boolean> {
  const targetMeta: Record<string, { type: string }> = { ...targetProps };
  const out = buildContentProperties(rule, captured, targetMeta);
  const variants = remapVariants(rule, captured);
  for (const [axis, value] of Object.entries(variants)) {
    const targetKey = findTargetPropKey(targetMeta, axis);
    if (!targetKey || targetMeta[targetKey].type !== "VARIANT") continue;
    out[targetKey] = value;
  }
  return out;
}
