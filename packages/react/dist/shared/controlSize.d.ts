/**
 * Shared control size scale (Figma: large / medium / small / extraSmall).
 * Heights map to CSS variables; paddings/gaps use rem (root) or em (font-relative).
 */
type ControlSize = "large" | "medium" | "small" | "extraSmall";
declare const CONTROL_HEIGHT: Record<ControlSize, string>;
/** Labeled button padding / gap / type from Figma Button set. */
declare const BUTTON_SIZE: Record<ControlSize, {
    height: string;
    paddingInline: string;
    paddingBlock: string;
    gap: string;
    fontSize: string;
    lineHeight: string;
    iconPx: string;
    iconOnlyPadding: string;
}>;
/**
 * Checkbox box + label geometry from Figma Checkbox / Checkbox + Label.
 * Box sizes are independent of CONTROL_HEIGHT (22 / 20 / 18 / 16).
 * Corner radius uses `--radius-sm` (6px).
 */
declare const CHECKBOX_SIZE: Record<ControlSize, {
    box: string;
    iconPx: string;
    gap: string;
    fontSize: string;
    lineHeight: string;
    /** Optical align of box to body line-height when a label is present. */
    labelAlignOffset: string;
}>;
/**
 * Toggle (switch) track / handle / icon matrix from Figma Toggle set
 * (`8841:5569`) and Toggle + Label (`327:2151`).
 * Handle slides via absolute `left`; icons crossfade in fixed slots.
 */
declare const TOGGLE_SIZE: Record<ControlSize, {
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
}>;
/** Icon Toggle hit target + glyph size from Figma Icon Toggle set. */
declare const ICON_TOGGLE_SIZE: Record<ControlSize, {
    size: string;
    padding: string;
    iconPx: string;
    iconSlot: string;
}>;
/** Figma focus ring: 2px surface gap + 2px focused border (outer 4px). */
declare const FOCUS_RING = "0 0 0 2px var(--background-neutral-primary), 0 0 0 4px var(--border-focused-primary)";
/** Shared color/chrome transition — uses CADS motion variables. */
declare const TRANSITION_COLORS = "var(--transition-colors)";
/**
 * Chip size matrix from Figma Chip set (`5881:2187`).
 * Heights match CONTROL_HEIGHT; horizontal padding is slightly tighter than Button.
 */
declare const CHIP_SIZE: Record<ControlSize, {
    height: string;
    paddingInline: string;
    paddingBlock: string;
    gap: string;
    fontSize: string;
    lineHeight: string;
    iconPx: string;
    groupGap: string;
}>;
/**
 * Slider chrome from Figma Slider (`16344:15611`), Knob (`16336:13274`),
 * Bar (`16342:13347`), Stepper (`16344:14959`).
 * Track row is short (knob height); ± buttons overflow into the stack gap like Figma.
 */
declare const SLIDER_CHROME: {
    readonly trackHeight: "0.375rem";
    readonly knob: "1rem";
    /**
     * Half knob — insets thumb travel (and end ticks) only; rail stays full-bleed
     * so the bar stays label-aligned and tight to ± controls.
     */
    readonly knobInset: "0.5rem";
    readonly barRadius: "0.25rem";
    readonly controlGap: "0.375rem";
    /** Root gap: labelRow ↔ sliderWrapper; also bar ↔ stepper. */
    readonly stackGap: "0.625rem";
    /** Helper row bottom pad before the stack gap (Figma helperFieldWrapper pb). */
    readonly helperPaddingBottom: "0.5rem";
    /** 24px button + 6px gap — offsets stepper so ticks align to the track. */
    readonly controlOffset: "1.875rem";
    readonly stepperTickHeight: "0.375rem";
    readonly stepperTickGap: "0.25rem";
    readonly stepperLabelHeight: "0.875rem";
};
/**
 * Text Input / Dropdown Button size matrix from Figma Text Input Building Block
 * and Dropdown Button sets (matches Button padding for L/M; area heights differ).
 */
declare const TEXT_INPUT_SIZE: Record<ControlSize, {
    height: string;
    areaHeight: string;
    paddingInline: string;
    paddingBlock: string;
    fontSize: string;
    lineHeight: string;
}>;
/** Field Wrapper label + helper typography / icon slots from Figma Field Wrapper. */
declare const FIELD_WRAPPER_SIZE: Record<ControlSize, {
    labelFontSize: string;
    labelLineHeight: string;
    helperFontSize: string;
    helperLineHeight: string;
    helperGap: string;
    helperIconPx: string;
    helperIconSlot: string;
}>;
/**
 * Radio Button + Label / Radio Buttons Block size matrix from Figma.
 * Circle box: 22 / 20 / 18 / 16; selected inner dot: 10 / 8 / 8 / 7.
 * Label gap: 8px (L/M), 6px (S/XS). L/M/S have 2px top offset; XS has none.
 */
declare const RADIO_SIZE: Record<ControlSize, {
    box: string;
    dot: string;
    gap: string;
    fontSize: string;
    lineHeight: string;
    controlPaddingTop: string;
}>;
/**
 * Tab Group / Tab Item size matrix from Figma Tab Group (`16496:3371`) +
 * Tab Item (`6240:7203`). Primary (underline) and secondary (contained) differ
 * in height, group gap, type scale, and padding.
 */
declare const TABS_SIZE: Record<ControlSize, {
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
}>;
/**
 * Breadcrumbs trail geometry from Figma Breadcrumbs (`16381:3339`),
 * Breadcrumb Links (`6862:5619`), Separators (`2434:9333`), Overflow (`16398:927`).
 * Type scale is one step smaller than Button at each size (body/md → body/xxs).
 */
declare const BREADCRUMB_SIZE: Record<ControlSize, {
    linkGap: string;
    trailGap: string;
    fontSize: string;
    lineHeight: string;
    iconPx: string;
    sepBox: string;
    /** Chevron / ellipsis glyph inside the separator/overflow box. */
    sepIconPx: string;
}>;
/**
 * Segmented Button Block size matrix from Figma (differs from Button padding/gap).
 * Gap is 8px for L/M/S and 4px for XS; medium/small horizontal padding is tighter.
 */
declare const SEGMENTED_SIZE: Record<ControlSize, {
    height: string;
    paddingInline: string;
    paddingBlock: string;
    gap: string;
    fontSize: string;
    lineHeight: string;
    iconPx: string;
    iconOnlyPadding: string;
}>;
/**
 * Link size matrix from Figma Link (`3480:5546`).
 * Includes Link-only `extraExtraSmall` (body/xxs) — do not add to ControlSize.
 */
type LinkControlSize = ControlSize | "extraExtraSmall";
declare const LINK_SIZE: Record<LinkControlSize, {
    fontSize: string;
    lineHeight: string;
    gap: string;
    iconPx: string;
}>;
/**
 * Alert size matrix from Figma Alert (`2133:4160`).
 * Surface radius is `--radius-md` (8px) in the component.
 */
declare const ALERT_SIZE: Record<ControlSize, {
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
}>;
/**
 * Tag size matrix from Figma Tag (`16433:2625`).
 * Heights 28 / 24 / 20 — tighter than control heights.
 */
declare const TAG_SIZE: Record<"large" | "medium" | "small", {
    height: string;
    paddingInline: string;
    paddingBlock: string;
    gap: string;
    contentGap: string;
    fontSize: string;
    lineHeight: string;
    iconPx: string;
    closeWidth: string;
}>;
/** Toast chrome from Figma Toast (`10587:14942`) — single size, elevated. */
declare const TOAST_CHROME: {
    width: string;
    paddingInline: string;
    paddingBlock: string;
    gap: string;
    contentGap: string;
    actionGap: string;
    fontSize: string;
    lineHeight: string;
    iconPx: string;
    iconSlot: string;
    radius: string;
    shadow: string;
};
/** Notification Banner chrome from Figma (`10618:632`). */
declare const NOTIFICATION_BANNER_CHROME: {
    padding: string;
    gap: string;
    contentGap: string;
    actionGap: string;
    buttonGap: string;
    iconSize: string;
    iconBorder: string;
    iconPx: string;
    titleSize: string;
    titleLineHeight: string;
    descriptionSize: string;
    descriptionLineHeight: string;
    radius: string;
};

export { ALERT_SIZE, BREADCRUMB_SIZE, BUTTON_SIZE, CHECKBOX_SIZE, CHIP_SIZE, CONTROL_HEIGHT, type ControlSize, FIELD_WRAPPER_SIZE, FOCUS_RING, ICON_TOGGLE_SIZE, LINK_SIZE, type LinkControlSize, NOTIFICATION_BANNER_CHROME, RADIO_SIZE, SEGMENTED_SIZE, SLIDER_CHROME, TABS_SIZE, TAG_SIZE, TEXT_INPUT_SIZE, TOAST_CHROME, TOGGLE_SIZE, TRANSITION_COLORS };
