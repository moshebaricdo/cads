/**
 * Shared control size scale (Figma: large / medium / small / extraSmall).
 * Heights map to CSS variables; paddings/gaps use rem (root) or em (font-relative).
 */

export type ControlSize = "large" | "medium" | "small" | "extraSmall";

export const CONTROL_HEIGHT: Record<ControlSize, string> = {
  large: "var(--control-height-large)",
  medium: "var(--control-height-medium)",
  small: "var(--control-height-small)",
  extraSmall: "var(--control-height-extra-small)",
};

/** Labeled button padding / gap / type from Figma Button set. */
export const BUTTON_SIZE: Record<
  ControlSize,
  {
    height: string;
    paddingInline: string;
    paddingBlock: string;
    gap: string;
    fontSize: string;
    lineHeight: string;
    iconPx: string;
    iconOnlyPadding: string;
  }
> = {
  large: {
    height: CONTROL_HEIGHT.large,
    paddingInline: "var(--space-xs)", // 16px
    paddingBlock: "0.625rem", // 10px
    gap: "0.556em", // 10px @ 18px type
    fontSize: "var(--text-body-lg)",
    lineHeight: "var(--leading-body-lg)",
    iconPx: "1.125rem", // 18px
    iconOnlyPadding: "0.75rem", // 12px
  },
  medium: {
    height: CONTROL_HEIGHT.medium,
    paddingInline: "var(--space-xs)", // 16px
    paddingBlock: "0.5rem", // 8px
    gap: "0.5em", // 8px @ 16px type
    fontSize: "var(--text-body-md)",
    lineHeight: "var(--leading-body-md)",
    iconPx: "1rem", // 16px
    iconOnlyPadding: "0.625rem", // 10px
  },
  small: {
    height: CONTROL_HEIGHT.small,
    paddingInline: "0.75rem", // 12px
    paddingBlock: "0.3125rem", // 5px
    gap: "0.429em", // 6px @ 14px type
    fontSize: "var(--text-body-sm)",
    lineHeight: "var(--leading-body-sm)",
    iconPx: "0.875rem", // 14px
    iconOnlyPadding: "0.4375rem", // 7px
  },
  extraSmall: {
    height: CONTROL_HEIGHT.extraSmall,
    paddingInline: "0.5rem", // 8px
    paddingBlock: "0.125rem", // 2px
    gap: "0.333em", // 4px @ 12px type (Figma Button)
    fontSize: "var(--text-body-xs)",
    lineHeight: "var(--leading-body-xs)",
    iconPx: "0.75rem", // 12px
    iconOnlyPadding: "0.25rem", // 4px
  },
};

/** Icon Toggle hit target + glyph size from Figma Icon Toggle set. */
export const ICON_TOGGLE_SIZE: Record<
  ControlSize,
  { size: string; padding: string; iconPx: string; iconSlot: string }
> = {
  large: {
    size: CONTROL_HEIGHT.large,
    padding: "0.75rem", // 12px
    iconPx: "1.1875rem", // 19px
    iconSlot: "1.5rem", // 24px
  },
  medium: {
    size: CONTROL_HEIGHT.medium,
    padding: "0.625rem", // 10px
    iconPx: "1rem", // 16px
    iconSlot: "1.25rem", // 20px
  },
  small: {
    size: CONTROL_HEIGHT.small,
    padding: "0.4375rem", // 7px
    iconPx: "0.875rem", // 14px
    iconSlot: "1.125rem", // 18px
  },
  extraSmall: {
    size: CONTROL_HEIGHT.extraSmall,
    padding: "0.25rem", // 4px
    iconPx: "0.75rem", // 12px
    iconSlot: "1rem", // 16px
  },
};

/** Figma focus ring: 2px surface gap + 2px focused border (outer 4px). */
export const FOCUS_RING =
  "0 0 0 2px var(--background-neutral-primary), 0 0 0 4px var(--border-focused-primary)";

/** Shared color/chrome transition — uses CADS motion variables. */
export const TRANSITION_COLORS = "var(--transition-colors)";

/**
 * Text Input / Dropdown Button size matrix from Figma Text Input Building Block
 * and Dropdown Button sets (matches Button padding for L/M; area heights differ).
 */
export const TEXT_INPUT_SIZE: Record<
  ControlSize,
  {
    height: string;
    areaHeight: string;
    paddingInline: string;
    paddingBlock: string;
    fontSize: string;
    lineHeight: string;
  }
> = {
  large: {
    height: CONTROL_HEIGHT.large,
    areaHeight: "6.5rem", // 104px
    paddingInline: "var(--space-xs)", // 16px
    paddingBlock: "0.625rem", // 10px
    fontSize: "var(--text-body-lg)",
    lineHeight: "var(--leading-body-lg)",
  },
  medium: {
    height: CONTROL_HEIGHT.medium,
    areaHeight: "5.5rem", // 88px
    paddingInline: "var(--space-xs)", // 16px
    paddingBlock: "0.5rem", // 8px
    fontSize: "var(--text-body-md)",
    lineHeight: "var(--leading-body-md)",
  },
  small: {
    height: CONTROL_HEIGHT.small,
    areaHeight: "4.75rem", // 76px
    paddingInline: "0.75rem", // 12px
    paddingBlock: "0.3125rem", // 5px
    fontSize: "var(--text-body-sm)",
    lineHeight: "var(--leading-body-sm)",
  },
  extraSmall: {
    // Approved exception: Figma field is 22px; CADS uses shared 24px control height.
    height: CONTROL_HEIGHT.extraSmall,
    areaHeight: "3.625rem", // 58px
    paddingInline: "0.5rem", // 8px
    paddingBlock: "0.125rem", // 2px
    fontSize: "var(--text-body-xs)",
    lineHeight: "var(--leading-body-xs)",
  },
};

/** Field Wrapper label + helper typography / icon slots from Figma Field Wrapper. */
export const FIELD_WRAPPER_SIZE: Record<
  ControlSize,
  {
    labelFontSize: string;
    labelLineHeight: string;
    helperFontSize: string;
    helperLineHeight: string;
    helperGap: string;
    helperIconPx: string;
    helperIconSlot: string;
  }
> = {
  large: {
    labelFontSize: "var(--text-body-md)",
    labelLineHeight: "var(--leading-body-md)",
    helperFontSize: "var(--text-body-md)",
    helperLineHeight: "var(--leading-body-md)",
    helperGap: "0.375rem", // 6px
    helperIconPx: "1rem", // 16px
    helperIconSlot: "1.125rem", // 18px
  },
  medium: {
    labelFontSize: "var(--text-body-sm)",
    labelLineHeight: "var(--leading-body-sm)",
    helperFontSize: "var(--text-body-sm)",
    helperLineHeight: "var(--leading-body-sm)",
    helperGap: "0.25rem", // 4px
    helperIconPx: "0.875rem", // 14px
    helperIconSlot: "1rem", // 16px
  },
  small: {
    labelFontSize: "var(--text-body-xs)",
    labelLineHeight: "var(--leading-body-xs)",
    helperFontSize: "var(--text-body-xs)",
    helperLineHeight: "var(--leading-body-xs)",
    helperGap: "0.25rem", // 4px
    helperIconPx: "0.75rem", // 12px
    helperIconSlot: "0.875rem", // 14px
  },
  extraSmall: {
    labelFontSize: "var(--text-body-xxs)",
    labelLineHeight: "var(--leading-body-xxs)",
    helperFontSize: "var(--text-body-xxs)",
    helperLineHeight: "var(--leading-body-xxs)",
    helperGap: "0.25rem", // 4px
    helperIconPx: "0.625rem", // 10px
    helperIconSlot: "0.75rem", // 12px
  },
};

/**
 * Segmented Button Block size matrix from Figma (differs from Button padding/gap).
 * Gap is 8px for L/M/S and 4px for XS; medium/small horizontal padding is tighter.
 */
export const SEGMENTED_SIZE: Record<
  ControlSize,
  {
    height: string;
    paddingInline: string;
    paddingBlock: string;
    gap: string;
    fontSize: string;
    lineHeight: string;
    iconPx: string;
    iconOnlyPadding: string;
  }
> = {
  large: {
    height: CONTROL_HEIGHT.large,
    paddingInline: "var(--space-xs)", // 16px
    paddingBlock: "0.625rem", // 10px
    gap: "0.5rem", // 8px
    fontSize: "var(--text-body-lg)",
    lineHeight: "var(--leading-body-lg)",
    iconPx: "1.1875rem", // 19px
    iconOnlyPadding: "0.75rem", // 12px
  },
  medium: {
    height: CONTROL_HEIGHT.medium,
    paddingInline: "0.75rem", // 12px
    paddingBlock: "0.5rem", // 8px
    gap: "0.5rem", // 8px
    fontSize: "var(--text-body-md)",
    lineHeight: "var(--leading-body-md)",
    iconPx: "1rem", // 16px
    iconOnlyPadding: "0.625rem", // 10px
  },
  small: {
    height: CONTROL_HEIGHT.small,
    paddingInline: "0.625rem", // 10px
    paddingBlock: "0.3125rem", // 5px
    gap: "0.5rem", // 8px
    fontSize: "var(--text-body-sm)",
    lineHeight: "var(--leading-body-sm)",
    iconPx: "0.875rem", // 14px
    iconOnlyPadding: "0.4375rem", // 7px
  },
  extraSmall: {
    height: CONTROL_HEIGHT.extraSmall,
    paddingInline: "0.5rem", // 8px
    paddingBlock: "0.125rem", // 2px
    gap: "0.25rem", // 4px
    fontSize: "var(--text-body-xs)",
    lineHeight: "var(--leading-body-xs)",
    iconPx: "0.75rem", // 12px
    iconOnlyPadding: "0.25rem", // 4px
  },
};
