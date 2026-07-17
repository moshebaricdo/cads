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
 * Motion / transition variables.
 * Figma has no duration/easing collection yet — these are a small CADS set for
 * control chrome (hover/press fills, borders). Focus rings use short so they
 * don't feel lagged.
 */
export const motion = {
  durationInstant: "0ms",
  durationShort: "150ms",
  durationMedium: "200ms",
  easingStandard: "cubic-bezier(0.4, 0, 0.2, 1)",
  easingEmphasized: "cubic-bezier(0.2, 0, 0, 1)",
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
    "--control-height-large": controlHeights.large,
    "--control-height-medium": controlHeights.medium,
    "--control-height-small": controlHeights.small,
    "--control-height-extra-small": controlHeights.extraSmall,
    "--control-height-l": controlHeights.large,
    "--control-height-m": controlHeights.medium,
    "--control-height-s": controlHeights.small,
    "--control-height-xs": controlHeights.extraSmall,
    "--duration-instant": motion.durationInstant,
    "--duration-short": motion.durationShort,
    "--duration-medium": motion.durationMedium,
    "--easing-standard": motion.easingStandard,
    "--easing-emphasized": motion.easingEmphasized,
    "--transition-colors": `background-color var(--duration-short) var(--easing-standard), color var(--duration-short) var(--easing-standard), border-color var(--duration-short) var(--easing-standard), box-shadow var(--duration-short) var(--easing-standard), opacity var(--duration-short) var(--easing-standard)`,
    "--font-fa-pro": '"Font Awesome 7 Pro"',
    "--font-fa-brands": '"Font Awesome 7 Brands"',
  };
}
