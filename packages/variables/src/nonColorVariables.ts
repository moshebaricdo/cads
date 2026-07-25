/**
 * Non-color CADS variables (typography, spacing/shape, elevation).
 * Sourced from the CADS Figma typography + spacing-shape collections.
 * Color semantics live in codeAiColorSystem.json and are resolved at generate time.
 */

export const typography = {
  fontFamily: {
    heading: '"Space Grotesk", sans-serif',
    body: '"Geist", sans-serif',
    mono: '"Google Sans Code", "Courier New", monospace',
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

/** Flat CSS custom-property map for non-color variables. */
export function nonColorCssVars(): Record<string, string> {
  return {
    "--font-heading": typography.fontFamily.heading,
    "--font-body": typography.fontFamily.body,
    "--font-mono": typography.fontFamily.mono,
    "--font-weight-bold": typography.fontWeight.bold,
    "--font-weight-semibold": typography.fontWeight.semibold,
    "--font-weight-medium": typography.fontWeight.medium,
    "--font-weight-normal": typography.fontWeight.normal,
    "--text-heading-xxl": typography.fontSize.headingXxl,
    "--text-heading-xl": typography.fontSize.headingXl,
    "--text-heading-lg": typography.fontSize.headingLg,
    "--text-heading-md": typography.fontSize.headingMd,
    "--text-heading-sm": typography.fontSize.headingSm,
    "--text-heading-xs": typography.fontSize.headingXs,
    "--leading-heading-xxl": typography.lineHeight.headingXxl,
    "--leading-heading-xl": typography.lineHeight.headingXl,
    "--leading-heading-lg": typography.lineHeight.headingLg,
    "--leading-heading-md": typography.lineHeight.headingMd,
    "--leading-heading-sm": typography.lineHeight.headingSm,
    "--leading-heading-xs": typography.lineHeight.headingXs,
    "--text-body-lg": typography.fontSize.bodyLg,
    "--text-body-md": typography.fontSize.bodyMd,
    "--text-body-sm": typography.fontSize.bodySm,
    "--text-body-xs": typography.fontSize.bodyXs,
    "--text-body-xxs": typography.fontSize.bodyXxs,
    "--leading-body-lg": typography.lineHeight.bodyLg,
    "--leading-body-md": typography.lineHeight.bodyMd,
    "--leading-body-sm": typography.lineHeight.bodySm,
    "--leading-body-xs": typography.lineHeight.bodyXs,
    "--leading-body-xxs": typography.lineHeight.bodyXxs,
    "--tracking-heading-display": typography.letterSpacing.headingDisplay,
    "--tracking-overline": typography.letterSpacing.overline,
    "--tracking-none": typography.letterSpacing.none,
    "--radius-sm": shape.radiusSm,
    "--radius-md": shape.radiusMd,
    "--radius-lg": shape.radiusLg,
    "--radius-xl": shape.radiusXl,
    "--radius-round": shape.radiusRound,
    "--space-xxs": spacing.xxs,
    "--space-xs": spacing.xs,
    "--space-s": spacing.s,
    "--space-m": spacing.m,
    "--space-l": spacing.l,
    "--space-xl": spacing.xl,
    "--space-xxl": spacing.xxl,
    "--space-xxxl": spacing.xxxl,
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
