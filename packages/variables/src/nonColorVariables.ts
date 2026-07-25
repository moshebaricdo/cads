/**
 * Non-color CADS variables (typography, spacing/shape, elevation).
 * Sourced from the CADS Figma typography + spacing-shape collections.
 * Color semantics live in codeAiColorSystem.json and are resolved at generate time.
 */

/** Prod i18n fallback stack (Noto Sans script coverage). */
const NOTO_SANS_FALLBACKS = [
  "Noto Sans",
  "Noto Sans Arabic",
  "Noto Sans Armenian",
  "Noto Sans Bengali",
  "Noto Sans SC",
  "Noto Sans TC",
  "Noto Sans Devanagari",
  "Noto Sans Georgian",
  "Noto Sans Hebrew",
  "Noto Sans JP",
  "Noto Sans Kannada",
  "Noto Sans Khmer",
  "Noto Sans KR",
  "Noto Sans Myanmar",
  "Noto Sans Sinhala",
  "Noto Sans Tamil",
  "Noto Sans Telugu",
  "Noto Sans Thai",
  "Noto Sans Thaana",
  "Noto Sans Math",
  "sans-serif",
] as const;

const GENERIC_FAMILIES = new Set([
  "serif",
  "sans-serif",
  "monospace",
  "cursive",
  "fantasy",
  "system-ui",
  "ui-monospace",
  "ui-sans-serif",
  "ui-serif",
  "ui-rounded",
]);

function fontStack(...faces: string[]): string {
  return faces
    .map((face) => (GENERIC_FAMILIES.has(face) ? face : `'${face}'`))
    .join(", ");
}

export const typography = {
  fontFamily: {
    heading: fontStack("Space Grotesk", "Geist", ...NOTO_SANS_FALLBACKS),
    body: fontStack("Geist", ...NOTO_SANS_FALLBACKS),
    /**
     * No brand mono in prod — browser / system monospace.
     * Docs may override with a specimen face (e.g. Google Sans Code) locally.
     */
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  fontWeight: {
    bold: "700",
    semibold: "600",
    medium: "500",
    normal: "400",
  },
  fontSize: {
    headingXxl: "48px",
    headingXl: "38px",
    headingLg: "28px",
    headingMd: "24px",
    headingSm: "22px",
    headingXs: "20px",
    bodyLg: "18px",
    bodyMd: "16px",
    bodySm: "14px",
    bodyXs: "12px",
    bodyXxs: "10px",
  },
  lineHeight: {
    headingXxl: "52px",
    headingXl: "40px",
    headingLg: "36px",
    headingMd: "32px",
    headingSm: "30px",
    headingXs: "28px",
    bodyLg: "28px",
    bodyMd: "24px",
    bodySm: "22px",
    bodyXs: "18px",
    bodyXxs: "16px",
  },
  letterSpacing: {
    headingDisplay: "-0.01em",
    overline: "0.08em",
    none: "0",
  },
} as const;

export const shape = {
  radiusSm: "6px",
  radiusMd: "8px",
  radiusLg: "10px",
  radiusXl: "12px",
  radiusRound: "999px",
} as const;

export const spacing = {
  xxs: "8px",
  xs: "16px",
  s: "24px",
  m: "32px",
  l: "40px",
  xl: "48px",
  xxl: "56px",
  xxxl: "64px",
} as const;

export const elevation = {
  shadowSm: "0 4px 7px rgb(0 0 0 / 7%), 0 2px 2px rgb(0 0 0 / 7%)",
  shadowMd:
    "0 10px 15px -3px rgb(0 0 0 / 10%), 0 4px 6px -4px rgb(0 0 0 / 10%)",
  shadowLg:
    "0 20px 25px -5px rgb(0 0 0 / 10%), 0 8px 10px -6px rgb(0 0 0 / 10%)",
} as const;

/**
 * Overlay stacking layers (code-owned; Figma has no z-index collection).
 * Dropdown / Popover share the modal layer so nested menus stack by DOM order
 * when both portal to `document.body`.
 */
export const zIndex = {
  drawer: 1200,
  modal: 1300,
  dropdown: 1300,
  popover: 1300,
  toast: 1400,
  tooltip: 1500,
} as const;

export type ZIndexLayer = keyof typeof zIndex;

/** Docs rows — variable / value / use stay in sync with `zIndex`. */
export const zIndexLayers = [
  {
    key: "drawer",
    variable: "--z-drawer",
    value: zIndex.drawer,
    use: "Drawer (below centered dialogs)",
  },
  {
    key: "modal",
    variable: "--z-modal",
    value: zIndex.modal,
    use: "Dialog and Modal",
  },
  {
    key: "dropdown",
    variable: "--z-dropdown",
    value: zIndex.dropdown,
    use: "Dropdown menus and Breadcrumbs overflow (same layer as modal)",
  },
  {
    key: "popover",
    variable: "--z-popover",
    value: zIndex.popover,
    use: "Popover (same layer as modal / dropdown)",
  },
  {
    key: "toast",
    variable: "--z-toast",
    value: zIndex.toast,
    use: "Toast snackbar host",
  },
  {
    key: "tooltip",
    variable: "--z-tooltip",
    value: zIndex.tooltip,
    use: "Tooltip and IconTooltip",
  },
] as const;

export const controlHeights = {
  large: "48px",
  medium: "40px",
  small: "32px",
  extraSmall: "24px",
  /** @deprecated Prefer `large` */
  l: "48px",
  /** @deprecated Prefer `medium` */
  m: "40px",
  /** @deprecated Prefer `small` */
  s: "32px",
  /** @deprecated Prefer `extraSmall` */
  xs: "24px",
} as const;

/**
 * Duration ladder (primitives). Recipes pick from these — they do not invent
 * parallel ms values. Figma has no duration collection yet.
 * Focus rings use short so they don't feel lagged.
 */
const durationInstant = "0ms";
const durationFast = "100ms";
const durationShort = "150ms";
const durationMedium = "200ms";

/**
 * Apple-style spring preset (Motion / Framer Motion `transition` shape).
 * Prefer these over stiffness/damping for Indicator and pointer-driven chase.
 * Near-zero bounce — CADS product UI, not playful consumer chrome.
 */
export type MotionSpringPreset = {
  type: "spring";
  /** Perceptual settle time in seconds. */
  duration: number;
  /** Overshoot amount; keep ≤ 0.1 for library chrome. */
  bounce: number;
};

/**
 * Motion / transition variables — duration primitives + experimental recipes
 * (Press / Surface / Indicator / Fade / Highlight chase) + spring presets.
 *
 * Springs are JS-only (not CSS custom properties). Use for interruptible /
 * pointer-driven recipes; keep the duration ladder for Press, Fade, Surface.
 */
export const motion = {
  durationInstant,
  /** High-frequency tint / chase — quieter than chrome color transitions. */
  durationFast,
  durationShort,
  durationMedium,
  easingStandard: "cubic-bezier(0.4, 0, 0.2, 1)",
  easingEmphasized: "cubic-bezier(0.2, 0, 0, 1)",
  /** Ease-out for user-initiated feedback (snappy start, soft settle). */
  easingOut: "cubic-bezier(0.23, 1, 0.32, 1)",
  /**
   * Spring ladder for interruptible travel. Maps loosely to the duration
   * ladder’s feel (fast ≈ 100ms, moderate ≈ 200ms, slow ≈ 320ms).
   */
  spring: {
    /** Pointer chase / micro-settle — docs nav highlight. */
    fast: {
      type: "spring",
      duration: 0.12,
      bounce: 0,
    } satisfies MotionSpringPreset,
    /** Indicator (Toggle handle, Tabs underline). */
    moderate: {
      type: "spring",
      duration: 0.2,
      bounce: 0.05,
    } satisfies MotionSpringPreset,
    /** Drag release / drawer settle only — not everyday chrome. */
    slow: {
      type: "spring",
      duration: 0.32,
      bounce: 0.08,
    } satisfies MotionSpringPreset,
  },
  /** Active scale feedback on pressable controls. Duration = short. */
  press: {
    scale: "0.97",
    duration: durationShort,
    easing: "cubic-bezier(0.23, 1, 0.32, 1)",
  },
  /** Overlay / menu enter-exit (opacity + slight scale). Duration = medium. */
  surface: {
    fromScale: "0.96",
    duration: durationMedium,
    easing: "cubic-bezier(0.23, 1, 0.32, 1)",
  },
  /**
   * Committed selection chrome that moves (toggle handle, selected pill).
   * When `experimentalMotion` is on, JS springs use `spring.moderate`;
   * CSS vars remain the non-spring / reduced-motion fallback.
   */
  indicator: {
    duration: durationMedium,
    easing: "cubic-bezier(0.2, 0, 0, 1)",
    spring: "moderate" as const,
  },
  /**
   * Soft opacity/chrome fade — quieter than `--transition-colors`.
   * Duration = fast. Use for menu-item hover fills and high-frequency tints.
   * Do not spring high-frequency dropdown rows (feels slow under keyboard).
   */
  fade: {
    duration: durationFast,
    easing: "cubic-bezier(0.23, 1, 0.32, 1)",
  },
  /**
   * Ephemeral hover highlight that follows the pointer (single floating
   * chrome — not per-row fades). Spring = fast. Deferred in the catalog;
   * docs sidebar uses this pattern as a site-only experiment.
   */
  highlightChase: {
    duration: durationFast,
    easing: "cubic-bezier(0.23, 1, 0.32, 1)",
    spring: "fast" as const,
  },
} as const;

/**
 * Convert a px literal (e.g. `"6px"`) to rem at a 16px root.
 * Used so CSS emission matches prod rem ramps while TS objects keep px for MUI.
 */
export function pxToRem(pxValue: string): string {
  const px = Number.parseFloat(pxValue);
  if (Number.isNaN(px)) return pxValue;
  const rem = px / 16;
  // Prefer compact forms that match prod (0.375rem, not 0.3750rem).
  return `${Number(rem.toFixed(4))}rem`;
}

/** Flat CSS custom-property map for non-color variables (prod-aligned names). */
export function nonColorCssVars(): Record<string, string> {
  return {
    "--font-family-heading": typography.fontFamily.heading,
    "--font-family-main": typography.fontFamily.body,
    "--font-family-mono": typography.fontFamily.mono,
    "--font-weight-bold": typography.fontWeight.bold,
    "--font-weight-semi-bold": typography.fontWeight.semibold,
    "--font-weight-medium": typography.fontWeight.medium,
    "--font-weight-regular": typography.fontWeight.normal,
    /* Prod uses rem for type sizes (16px root). TS keeps px for Figma parity. */
    "--text-heading-xxl": pxToRem(typography.fontSize.headingXxl),
    "--text-heading-xl": pxToRem(typography.fontSize.headingXl),
    "--text-heading-lg": pxToRem(typography.fontSize.headingLg),
    "--text-heading-md": pxToRem(typography.fontSize.headingMd),
    "--text-heading-sm": pxToRem(typography.fontSize.headingSm),
    "--text-heading-xs": pxToRem(typography.fontSize.headingXs),
    "--leading-heading-xxl": pxToRem(typography.lineHeight.headingXxl),
    "--leading-heading-xl": pxToRem(typography.lineHeight.headingXl),
    "--leading-heading-lg": pxToRem(typography.lineHeight.headingLg),
    "--leading-heading-md": pxToRem(typography.lineHeight.headingMd),
    "--leading-heading-sm": pxToRem(typography.lineHeight.headingSm),
    "--leading-heading-xs": pxToRem(typography.lineHeight.headingXs),
    "--text-body-lg": pxToRem(typography.fontSize.bodyLg),
    "--text-body-md": pxToRem(typography.fontSize.bodyMd),
    "--text-body-sm": pxToRem(typography.fontSize.bodySm),
    "--text-body-xs": pxToRem(typography.fontSize.bodyXs),
    "--text-body-xxs": pxToRem(typography.fontSize.bodyXxs),
    "--leading-body-lg": pxToRem(typography.lineHeight.bodyLg),
    "--leading-body-md": pxToRem(typography.lineHeight.bodyMd),
    "--leading-body-sm": pxToRem(typography.lineHeight.bodySm),
    "--leading-body-xs": pxToRem(typography.lineHeight.bodyXs),
    "--leading-body-xxs": pxToRem(typography.lineHeight.bodyXxs),
    "--tracking-heading-display": typography.letterSpacing.headingDisplay,
    "--tracking-overline": typography.letterSpacing.overline,
    "--tracking-none": typography.letterSpacing.none,
    /* Prod shapeAndSpacingVariables.css — rem at 16px root. */
    "--shape-sm": pxToRem(shape.radiusSm),
    "--shape-md": pxToRem(shape.radiusMd),
    "--shape-lg": pxToRem(shape.radiusLg),
    "--shape-xl": pxToRem(shape.radiusXl),
    "--shape-round": pxToRem(shape.radiusRound),
    "--spacing-p-xxs": pxToRem(spacing.xxs),
    "--spacing-p-xs": pxToRem(spacing.xs),
    "--spacing-p-s": pxToRem(spacing.s),
    "--spacing-p-m": pxToRem(spacing.m),
    "--spacing-p-l": pxToRem(spacing.l),
    "--spacing-p-xl": pxToRem(spacing.xl),
    "--spacing-p-xxl": pxToRem(spacing.xxl),
    "--spacing-p-xxxl": pxToRem(spacing.xxxl),
    "--shadow-sm": elevation.shadowSm,
    "--shadow-md": elevation.shadowMd,
    "--shadow-lg": elevation.shadowLg,
    "--z-drawer": String(zIndex.drawer),
    "--z-modal": String(zIndex.modal),
    "--z-dropdown": String(zIndex.dropdown),
    "--z-popover": String(zIndex.popover),
    "--z-toast": String(zIndex.toast),
    "--z-tooltip": String(zIndex.tooltip),
    "--control-height-large": controlHeights.large,
    "--control-height-medium": controlHeights.medium,
    "--control-height-small": controlHeights.small,
    "--control-height-extra-small": controlHeights.extraSmall,
    "--control-height-l": controlHeights.large,
    "--control-height-m": controlHeights.medium,
    "--control-height-s": controlHeights.small,
    "--control-height-xs": controlHeights.extraSmall,
    "--duration-instant": motion.durationInstant,
    "--duration-fast": motion.durationFast,
    "--duration-short": motion.durationShort,
    "--duration-medium": motion.durationMedium,
    "--easing-standard": motion.easingStandard,
    "--easing-emphasized": motion.easingEmphasized,
    "--easing-out": motion.easingOut,
    "--motion-press-scale": motion.press.scale,
    "--motion-press-duration": motion.press.duration,
    "--motion-press-easing": motion.press.easing,
    "--motion-surface-from-scale": motion.surface.fromScale,
    "--motion-surface-duration": motion.surface.duration,
    "--motion-surface-easing": motion.surface.easing,
    "--motion-indicator-duration": motion.indicator.duration,
    "--motion-indicator-easing": motion.indicator.easing,
    "--motion-fade-duration": motion.fade.duration,
    "--motion-fade-easing": motion.fade.easing,
    "--motion-highlight-chase-duration": motion.highlightChase.duration,
    "--motion-highlight-chase-easing": motion.highlightChase.easing,
    "--transition-colors": `background-color var(--duration-short) var(--easing-standard), color var(--duration-short) var(--easing-standard), border-color var(--duration-short) var(--easing-standard), box-shadow var(--duration-short) var(--easing-standard), opacity var(--duration-short) var(--easing-standard)`,
    "--transition-fade": `background-color var(--motion-fade-duration) var(--motion-fade-easing), color var(--motion-fade-duration) var(--motion-fade-easing), border-color var(--motion-fade-duration) var(--motion-fade-easing), opacity var(--motion-fade-duration) var(--motion-fade-easing)`,
    "--transition-press": `transform var(--motion-press-duration) var(--motion-press-easing)`,
    "--transition-surface": `opacity var(--motion-surface-duration) var(--motion-surface-easing), transform var(--motion-surface-duration) var(--motion-surface-easing)`,
    "--transition-indicator": `left var(--motion-indicator-duration) var(--motion-indicator-easing), width var(--motion-indicator-duration) var(--motion-indicator-easing), transform var(--motion-indicator-duration) var(--motion-indicator-easing), background-color var(--duration-short) var(--easing-standard)`,
    "--transition-highlight-chase": `top var(--motion-highlight-chase-duration) var(--motion-highlight-chase-easing), height var(--motion-highlight-chase-duration) var(--motion-highlight-chase-easing), opacity var(--motion-highlight-chase-duration) var(--motion-highlight-chase-easing)`,
    "--font-fa-pro": '"Font Awesome 7 Pro"',
    "--font-fa-brands": '"Font Awesome 7 Brands"',
  };
}
