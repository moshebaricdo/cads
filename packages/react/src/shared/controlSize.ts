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

/**
 * Checkbox box + label geometry from Figma Checkbox / Checkbox + Label.
 * Box sizes are independent of CONTROL_HEIGHT (22 / 20 / 18 / 16).
 * Corner radius uses `--radius-sm` (6px).
 */
export const CHECKBOX_SIZE: Record<
  ControlSize,
  {
    box: string;
    iconPx: string;
    gap: string;
    fontSize: string;
    lineHeight: string;
    /** Optical align of box to body line-height when a label is present. */
    labelAlignOffset: string;
  }
> = {
  large: {
    box: "1.375rem", // 22px
    iconPx: "0.875rem", // 14px
    gap: "0.5rem", // 8px
    fontSize: "var(--text-body-lg)",
    lineHeight: "var(--leading-body-lg)",
    labelAlignOffset: "0.125rem", // 2px
  },
  medium: {
    box: "1.25rem", // 20px
    iconPx: "0.75rem", // 12px
    gap: "0.5rem", // 8px
    fontSize: "var(--text-body-md)",
    lineHeight: "var(--leading-body-md)",
    labelAlignOffset: "0.125rem", // 2px
  },
  small: {
    box: "1.125rem", // 18px
    iconPx: "0.625rem", // 10px
    gap: "0.375rem", // 6px
    fontSize: "var(--text-body-sm)",
    lineHeight: "var(--leading-body-sm)",
    labelAlignOffset: "0.125rem", // 2px
  },
  extraSmall: {
    box: "1rem", // 16px
    iconPx: "0.625rem", // 10px
    gap: "0.375rem", // 6px
    fontSize: "var(--text-body-xs)",
    lineHeight: "var(--leading-body-xs)",
    labelAlignOffset: "0", // Figma: no optical offset on XS
  },
};

/**
 * Toggle (switch) track / handle / icon matrix from Figma Toggle set
 * (`8841:5569`) and Toggle + Label (`327:2151`).
 * Handle slides via absolute `left`; icons crossfade in fixed slots.
 */
export const TOGGLE_SIZE: Record<
  ControlSize,
  {
    trackWidth: string;
    trackHeight: string;
    handle: string;
    /** Inset from track edge to handle / track padding. */
    pad: string;
    iconPx: string;
    iconSlot: string;
    /** Inset for check (left) / xmark (right) icon slots. */
    iconInset: string;
    labelGap: string;
    fontSize: string;
    lineHeight: string;
  }
> = {
  large: {
    trackWidth: "3.25rem", // 52px
    trackHeight: "1.625rem", // 26px
    handle: "1.375rem", // 22px
    pad: "0.125rem", // 2px
    iconPx: "1rem", // 16px
    iconSlot: "0.875rem", // 14px
    iconInset: "0.5rem", // 8px — matches Figma on-state left padding
    labelGap: "0.5rem", // 8px
    fontSize: "var(--text-body-lg)",
    lineHeight: "var(--leading-body-lg)",
  },
  medium: {
    trackWidth: "3rem", // 48px
    trackHeight: "1.5rem", // 24px
    handle: "1.25rem", // 20px
    pad: "0.125rem", // 2px
    iconPx: "0.875rem", // 14px
    iconSlot: "0.875rem", // 14px
    iconInset: "0.5rem", // 8px
    labelGap: "0.5rem", // 8px
    fontSize: "var(--text-body-md)",
    lineHeight: "var(--leading-body-md)",
  },
  small: {
    trackWidth: "2.75rem", // 44px
    trackHeight: "1.375rem", // 22px
    handle: "1.125rem", // 18px
    pad: "0.125rem", // 2px
    iconPx: "0.75rem", // 12px
    iconSlot: "0.625rem", // 10px
    iconInset: "0.5rem", // 8px
    labelGap: "0.5rem", // 8px
    fontSize: "var(--text-body-sm)",
    lineHeight: "var(--leading-body-sm)",
  },
  extraSmall: {
    trackWidth: "2.5rem", // 40px
    trackHeight: "1.25rem", // 20px
    handle: "1rem", // 16px
    pad: "0.125rem", // 2px
    iconPx: "0.625rem", // 10px
    iconSlot: "0.625rem", // 10px
    iconInset: "0.4375rem", // 7px — matches Figma XS on-state left padding
    labelGap: "0.375rem", // 6px
    fontSize: "var(--text-body-xs)",
    lineHeight: "var(--leading-body-xs)",
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
 * Chip size matrix from Figma Chip set (`5881:2187`).
 * Heights match CONTROL_HEIGHT; horizontal padding is slightly tighter than Button.
 */
export const CHIP_SIZE: Record<
  ControlSize,
  {
    height: string;
    paddingInline: string;
    paddingBlock: string;
    gap: string;
    fontSize: string;
    lineHeight: string;
    iconPx: string;
    groupGap: string;
  }
> = {
  large: {
    height: CONTROL_HEIGHT.large,
    paddingInline: "1.25rem", // 20px
    paddingBlock: "0.625rem", // 10px
    gap: "0.625rem", // 10px
    fontSize: "var(--text-body-lg)",
    lineHeight: "var(--leading-body-lg)",
    iconPx: "1.125rem", // 18px
    groupGap: "0.5rem", // 8px
  },
  medium: {
    height: CONTROL_HEIGHT.medium,
    paddingInline: "1rem", // 16px
    paddingBlock: "0.5rem", // 8px
    gap: "0.5rem", // 8px
    fontSize: "var(--text-body-md)",
    lineHeight: "var(--leading-body-md)",
    iconPx: "1rem", // 16px
    groupGap: "0.375rem", // 6px
  },
  small: {
    height: CONTROL_HEIGHT.small,
    paddingInline: "0.75rem", // 12px
    paddingBlock: "0.3125rem", // 5px
    gap: "0.375rem", // 6px
    fontSize: "var(--text-body-sm)",
    lineHeight: "var(--leading-body-sm)",
    iconPx: "0.875rem", // 14px
    groupGap: "0.375rem", // 6px
  },
  extraSmall: {
    height: CONTROL_HEIGHT.extraSmall,
    paddingInline: "0.5rem", // 8px
    paddingBlock: "0.125rem", // 2px
    gap: "0.25rem", // 4px
    fontSize: "var(--text-body-xs)",
    lineHeight: "var(--leading-body-xs)",
    iconPx: "0.75rem", // 12px
    groupGap: "0.25rem", // 4px
  },
};

/**
 * Slider chrome from Figma Slider (`16344:15611`), Knob (`16336:13274`),
 * Bar (`16342:13347`), Stepper (`16344:14959`).
 * Track row is short (knob height); ± buttons overflow into the stack gap like Figma.
 */
export const SLIDER_CHROME = {
  trackHeight: "0.375rem", // 6px
  knob: "1rem", // 16px
  /**
   * Half knob — insets thumb travel (and end ticks) only; rail stays full-bleed
   * so the bar stays label-aligned and tight to ± controls.
   */
  knobInset: "0.5rem", // 8px
  barRadius: "0.25rem", // 4px
  controlGap: "0.375rem", // 6px between ± buttons and track
  /** Root gap: labelRow ↔ sliderWrapper; also bar ↔ stepper. */
  stackGap: "0.625rem", // 10px
  /** Helper row bottom pad before the stack gap (Figma helperFieldWrapper pb). */
  helperPaddingBottom: "0.5rem", // 8px
  /** 24px button + 6px gap — offsets stepper so ticks align to the track. */
  controlOffset: "1.875rem", // 30px
  stepperTickHeight: "0.375rem", // 6px
  stepperTickGap: "0.25rem", // 4px tick ↔ label
  stepperLabelHeight: "0.875rem", // 14px
} as const;

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
 * Radio Button + Label / Radio Buttons Block size matrix from Figma.
 * Circle box: 22 / 20 / 18 / 16; selected inner dot: 10 / 8 / 8 / 7.
 * Label gap: 8px (L/M), 6px (S/XS). L/M/S have 2px top offset; XS has none.
 */
export const RADIO_SIZE: Record<
  ControlSize,
  {
    box: string;
    dot: string;
    gap: string;
    fontSize: string;
    lineHeight: string;
    controlPaddingTop: string;
  }
> = {
  large: {
    box: "1.375rem", // 22px
    dot: "0.625rem", // 10px
    gap: "0.5rem", // 8px
    fontSize: "var(--text-body-lg)",
    lineHeight: "var(--leading-body-lg)",
    controlPaddingTop: "0.125rem", // 2px
  },
  medium: {
    box: "1.25rem", // 20px
    dot: "0.5rem", // 8px
    gap: "0.5rem", // 8px
    fontSize: "var(--text-body-md)",
    lineHeight: "var(--leading-body-md)",
    controlPaddingTop: "0.125rem", // 2px
  },
  small: {
    box: "1.125rem", // 18px
    dot: "0.5rem", // 8px
    gap: "0.375rem", // 6px
    fontSize: "var(--text-body-sm)",
    lineHeight: "var(--leading-body-sm)",
    controlPaddingTop: "0.125rem", // 2px
  },
  extraSmall: {
    box: "1rem", // 16px
    dot: "0.4375rem", // 7px
    gap: "0.375rem", // 6px
    fontSize: "var(--text-body-xs)",
    lineHeight: "var(--leading-body-xs)",
    controlPaddingTop: "0", // Figma: no optical offset on XS
  },
};

/**
 * Tab Group / Tab Item size matrix from Figma Tab Group (`16496:3371`) +
 * Tab Item (`6240:7203`). Primary (underline) and secondary (contained) differ
 * in height, group gap, type scale, and padding.
 */
export const TABS_SIZE: Record<
  ControlSize,
  {
    primaryHeight: string;
    secondaryHeight: string;
    primaryGroupGap: string;
    secondaryGroupGap: string;
    primaryPadY: string;
    secondaryPadX: string;
    primaryItemGap: string;
    secondaryItemGap: string;
    primaryFontSize: string;
    primaryLineHeight: string;
    secondaryFontSize: string;
    secondaryLineHeight: string;
    primaryIconPx: string;
    secondaryIconPx: string;
    primaryIconOnlyPadX: string;
    secondaryIconOnlyPadX: string;
    secondaryIconOnlyMinWidth: string;
  }
> = {
  large: {
    primaryHeight: CONTROL_HEIGHT.large, // 48
    secondaryHeight: "2rem", // 32
    primaryGroupGap: "1.25rem", // 20
    secondaryGroupGap: "0.25rem", // 4
    primaryPadY: "0.625rem", // 10
    secondaryPadX: "0.75rem", // 12
    primaryItemGap: "0.5rem", // 8
    secondaryItemGap: "0.375rem", // 6
    primaryFontSize: "var(--text-body-lg)",
    primaryLineHeight: "var(--leading-body-lg)",
    secondaryFontSize: "var(--text-body-md)",
    secondaryLineHeight: "var(--leading-body-md)",
    primaryIconPx: "1.125rem", // 18
    secondaryIconPx: "1rem", // 16
    primaryIconOnlyPadX: "1rem", // 16
    secondaryIconOnlyPadX: "0.625rem", // 10
    secondaryIconOnlyMinWidth: "2.25rem", // 36
  },
  medium: {
    primaryHeight: CONTROL_HEIGHT.medium, // 40
    secondaryHeight: "1.75rem", // 28
    primaryGroupGap: "1.125rem", // 18
    secondaryGroupGap: "0.25rem", // 4
    primaryPadY: "0.375rem", // 6
    secondaryPadX: "0.625rem", // 10
    primaryItemGap: "0.5rem", // 8
    secondaryItemGap: "0.375rem", // 6
    primaryFontSize: "var(--text-body-md)",
    primaryLineHeight: "var(--leading-body-md)",
    secondaryFontSize: "var(--text-body-sm)",
    secondaryLineHeight: "var(--leading-body-sm)",
    primaryIconPx: "1rem", // 16
    secondaryIconPx: "0.875rem", // 14
    primaryIconOnlyPadX: "0.875rem", // 14
    secondaryIconOnlyPadX: "0.625rem", // 10
    secondaryIconOnlyMinWidth: "2rem", // 32
  },
  small: {
    primaryHeight: CONTROL_HEIGHT.small, // 32
    secondaryHeight: "1.5rem", // 24
    primaryGroupGap: "1rem", // 16
    secondaryGroupGap: "0.25rem", // 4
    primaryPadY: "0.375rem", // 6
    secondaryPadX: "0.5rem", // 8
    primaryItemGap: "0.375rem", // 6
    secondaryItemGap: "0.25rem", // 4
    primaryFontSize: "var(--text-body-sm)",
    primaryLineHeight: "var(--leading-body-sm)",
    secondaryFontSize: "var(--text-body-xs)",
    secondaryLineHeight: "var(--leading-body-xs)",
    primaryIconPx: "0.875rem", // 14
    secondaryIconPx: "0.75rem", // 12
    primaryIconOnlyPadX: "0.75rem", // 12
    secondaryIconOnlyPadX: "0.5rem", // 8
    secondaryIconOnlyMinWidth: "1.75rem", // 28
  },
  extraSmall: {
    primaryHeight: CONTROL_HEIGHT.extraSmall, // 24
    secondaryHeight: "1.25rem", // 20
    primaryGroupGap: "0.875rem", // 14
    secondaryGroupGap: "0.125rem", // 2
    primaryPadY: "0.25rem", // 4
    secondaryPadX: "0.375rem", // 6
    primaryItemGap: "0.25rem", // 4
    secondaryItemGap: "0.1875rem", // 3
    primaryFontSize: "var(--text-body-xs)",
    primaryLineHeight: "var(--leading-body-xs)",
    secondaryFontSize: "var(--text-body-xxs)",
    secondaryLineHeight: "var(--leading-body-xxs)",
    primaryIconPx: "0.75rem", // 12
    secondaryIconPx: "0.625rem", // 10
    primaryIconOnlyPadX: "0.25rem", // 4
    secondaryIconOnlyPadX: "0.375rem", // 6
    secondaryIconOnlyMinWidth: "1.5rem", // 24
  },
};

/**
 * Breadcrumbs trail geometry from Figma Breadcrumbs (`16381:3339`),
 * Breadcrumb Links (`6862:5619`), Separators (`2434:9333`), Overflow (`16398:927`).
 * Type scale is one step smaller than Button at each size (body/md → body/xxs).
 */
export const BREADCRUMB_SIZE: Record<
  ControlSize,
  {
    linkGap: string;
    trailGap: string;
    fontSize: string;
    lineHeight: string;
    iconPx: string;
    sepBox: string;
    /** Chevron / ellipsis glyph inside the separator/overflow box. */
    sepIconPx: string;
  }
> = {
  large: {
    linkGap: "0.625rem", // 10px
    trailGap: "0.375rem", // 6px
    fontSize: "var(--text-body-md)",
    lineHeight: "var(--leading-body-md)",
    iconPx: "1rem", // 16px
    sepBox: "1.75rem", // 28px
    sepIconPx: "0.75rem", // 12px
  },
  medium: {
    linkGap: "0.5rem", // 8px
    trailGap: "0.25rem", // 4px
    fontSize: "var(--text-body-sm)",
    lineHeight: "var(--leading-body-sm)",
    iconPx: "0.875rem", // 14px
    sepBox: "1.625rem", // 26px
    sepIconPx: "0.6875rem", // 11px
  },
  small: {
    linkGap: "0.375rem", // 6px
    trailGap: "0.25rem", // 4px
    fontSize: "var(--text-body-xs)",
    lineHeight: "var(--leading-body-xs)",
    iconPx: "0.75rem", // 12px
    sepBox: "1.5rem", // 24px
    sepIconPx: "0.6875rem", // 11px
  },
  extraSmall: {
    linkGap: "0.375rem", // 6px
    trailGap: "0.125rem", // 2px
    fontSize: "var(--text-body-xxs)",
    lineHeight: "var(--leading-body-xxs)",
    iconPx: "0.625rem", // 10px
    sepBox: "1.5rem", // 24px
    sepIconPx: "0.625rem", // 10px
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

/**
 * Link size matrix from Figma Link (`3480:5546`).
 * Includes Link-only `extraExtraSmall` (body/xxs) — do not add to ControlSize.
 */
export type LinkControlSize = ControlSize | "extraExtraSmall";

export const LINK_SIZE: Record<
  LinkControlSize,
  {
    fontSize: string;
    lineHeight: string;
    gap: string;
    iconPx: string;
  }
> = {
  large: {
    fontSize: "var(--text-body-lg)",
    lineHeight: "var(--leading-body-lg)",
    gap: "0.5rem", // 8px
    iconPx: "1.125rem", // 18px
  },
  medium: {
    fontSize: "var(--text-body-md)",
    lineHeight: "var(--leading-body-md)",
    gap: "0.5rem", // 8px
    iconPx: "0.875rem", // 14px
  },
  small: {
    fontSize: "var(--text-body-sm)",
    lineHeight: "var(--leading-body-sm)",
    gap: "0.375rem", // 6px
    iconPx: "0.75rem", // 12px
  },
  extraSmall: {
    fontSize: "var(--text-body-xs)",
    lineHeight: "var(--leading-body-xs)",
    gap: "0.25rem", // 4px
    iconPx: "0.625rem", // 10px
  },
  extraExtraSmall: {
    fontSize: "var(--text-body-xxs)",
    lineHeight: "var(--leading-body-xxs)",
    gap: "0.25rem", // 4px
    iconPx: "0.625rem", // 10px
  },
};

/**
 * Alert size matrix from Figma Alert (`2133:4160`).
 * Surface radius is `--radius-md` (8px) in the component.
 */
export const ALERT_SIZE: Record<
  ControlSize,
  {
    minHeight: string;
    paddingInline: string;
    paddingBlock: string;
    gap: string;
    contentGap: string;
    actionGap: string;
    fontSize: string;
    lineHeight: string;
    iconPx: string;
    iconSlot: string;
    actionButtonSize: ControlSize;
  }
> = {
  large: {
    minHeight: "3.5rem", // 56px
    paddingInline: "1rem 0.875rem", // 16 / 14
    paddingBlock: "0.875rem", // 14
    gap: "1rem", // 16
    contentGap: "0.625rem", // 10
    actionGap: "0.625rem", // 10
    fontSize: "var(--text-body-lg)",
    lineHeight: "var(--leading-body-lg)",
    iconPx: "1.125rem", // 18
    iconSlot: "1.5rem", // 24
    actionButtonSize: "medium",
  },
  medium: {
    minHeight: "3rem", // 48px
    paddingInline: "0.875rem 0.75rem", // 14 / 12
    paddingBlock: "0.75rem", // 12
    gap: "1rem", // 16
    contentGap: "0.4375rem", // 7
    actionGap: "0.5rem", // 8
    fontSize: "var(--text-body-md)",
    lineHeight: "var(--leading-body-md)",
    iconPx: "1rem", // 16
    iconSlot: "1.25rem", // 20
    actionButtonSize: "small",
  },
  small: {
    minHeight: "2.625rem", // 42px
    paddingInline: "0.75rem 0.625rem", // 12 / 10
    paddingBlock: "0.625rem", // 10
    gap: "0.875rem", // 14
    contentGap: "0.375rem", // 6
    actionGap: "0.375rem", // 6
    fontSize: "var(--text-body-sm)",
    lineHeight: "var(--leading-body-sm)",
    iconPx: "0.875rem", // 14
    iconSlot: "1.125rem", // 18
    actionButtonSize: "extraSmall",
  },
  extraSmall: {
    minHeight: "2.125rem", // 34px
    paddingInline: "0.625rem 0.5rem", // 10 / 8
    paddingBlock: "0.5rem", // 8
    gap: "0.875rem", // 14
    contentGap: "0.375rem", // 6
    actionGap: "0.3125rem", // 5
    fontSize: "var(--text-body-xs)",
    lineHeight: "var(--leading-body-xs)",
    iconPx: "0.75rem", // 12
    iconSlot: "1rem", // 16
    actionButtonSize: "extraSmall",
  },
};

/**
 * Tag size matrix from Figma Tag (`16433:2625`).
 * Heights 28 / 24 / 20 — tighter than control heights.
 */
export const TAG_SIZE: Record<
  "large" | "medium" | "small",
  {
    height: string;
    paddingInline: string;
    paddingBlock: string;
    gap: string;
    contentGap: string;
    fontSize: string;
    lineHeight: string;
    iconPx: string;
    closeWidth: string;
  }
> = {
  large: {
    height: "1.75rem", // 28
    paddingInline: "0.625rem", // 10
    paddingBlock: "0.3125rem", // 5
    gap: "0.5rem", // 8
    contentGap: "0.375rem", // 6
    fontSize: "var(--text-body-sm)",
    lineHeight: "var(--leading-body-sm)",
    iconPx: "0.875rem", // 14
    closeWidth: "0.75rem", // 12
  },
  medium: {
    height: "1.5rem", // 24
    paddingInline: "0.5rem", // 8
    paddingBlock: "0.3125rem", // 5
    gap: "0.375rem", // 6
    contentGap: "0.25rem", // 4
    fontSize: "var(--text-body-xs)",
    lineHeight: "var(--leading-body-xs)",
    iconPx: "0.75rem", // 12
    closeWidth: "0.625rem", // 10
  },
  small: {
    height: "1.25rem", // 20
    paddingInline: "0.375rem", // 6
    paddingBlock: "0.3125rem", // 5
    gap: "0.375rem", // 6
    contentGap: "0.25rem", // 4
    fontSize: "var(--text-body-xxs)",
    lineHeight: "var(--leading-body-xxs)",
    iconPx: "0.625rem", // 10
    closeWidth: "0.5rem", // 8
  },
};

/** Toast chrome from Figma Toast (`10587:14942`) — single size, elevated. */
export const TOAST_CHROME = {
  width: "18.75rem", // 300
  paddingInline: "0.875rem 0.75rem", // 14 / 12
  paddingBlock: "0.75rem", // 12
  gap: "1rem", // 16
  contentGap: "0.5rem", // 8
  actionGap: "0.625rem", // 10
  fontSize: "var(--text-body-md)",
  lineHeight: "var(--leading-body-md)",
  iconPx: "1rem", // 16
  iconSlot: "1.25rem", // 20
  radius: "var(--radius-md)", // shape/md — 8px
  shadow: "var(--shadow-lg)",
};

/** Notification Banner chrome from Figma (`10618:632`). */
export const NOTIFICATION_BANNER_CHROME = {
  padding: "1rem", // 16
  gap: "1.5rem", // 24
  contentGap: "0.875rem", // 14
  actionGap: "0.875rem", // 14
  buttonGap: "0.5rem", // 8
  iconSize: "2.875rem", // 46
  iconBorder: "3px",
  iconPx: "1.375rem", // 22
  titleSize: "var(--text-body-lg)",
  titleLineHeight: "var(--leading-body-lg)",
  descriptionSize: "var(--text-body-sm)",
  descriptionLineHeight: "var(--leading-body-sm)",
  radius: "var(--radius-md)", // shape/md — 8px
};
