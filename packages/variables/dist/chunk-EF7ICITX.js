// src/nonColorVariables.ts
var NOTO_SANS_FALLBACKS = [
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
  "sans-serif"
];
var GENERIC_FAMILIES = /* @__PURE__ */ new Set([
  "serif",
  "sans-serif",
  "monospace",
  "cursive",
  "fantasy",
  "system-ui",
  "ui-monospace",
  "ui-sans-serif",
  "ui-serif",
  "ui-rounded"
]);
function fontStack(...faces) {
  return faces.map((face) => GENERIC_FAMILIES.has(face) ? face : `'${face}'`).join(", ");
}
var typography = {
  fontFamily: {
    heading: fontStack("Space Grotesk", "Geist", ...NOTO_SANS_FALLBACKS),
    body: fontStack("Geist", ...NOTO_SANS_FALLBACKS),
    /**
     * No brand mono in prod — browser / system monospace.
     * Docs may override with a specimen face (e.g. Google Sans Code) locally.
     */
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
  },
  fontWeight: {
    bold: "700",
    semibold: "600",
    medium: "500",
    normal: "400"
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
    bodyXxs: "10px"
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
    bodyXxs: "16px"
  },
  letterSpacing: {
    headingDisplay: "-0.01em",
    overline: "0.08em",
    none: "0"
  }
};
var shape = {
  radiusSm: "6px",
  radiusMd: "8px",
  radiusLg: "10px",
  radiusXl: "12px",
  radiusRound: "999px"
};
var spacing = {
  xxs: "8px",
  xs: "16px",
  s: "24px",
  m: "32px",
  l: "40px",
  xl: "48px",
  xxl: "56px",
  xxxl: "64px"
};
var elevation = {
  shadowSm: "0 4px 7px rgb(0 0 0 / 7%), 0 2px 2px rgb(0 0 0 / 7%)",
  shadowMd: "0 10px 15px -3px rgb(0 0 0 / 10%), 0 4px 6px -4px rgb(0 0 0 / 10%)",
  shadowLg: "0 20px 25px -5px rgb(0 0 0 / 10%), 0 8px 10px -6px rgb(0 0 0 / 10%)"
};
var zIndex = {
  drawer: 1200,
  modal: 1300,
  dropdown: 1300,
  popover: 1300,
  toast: 1400,
  tooltip: 1500
};
var zIndexLayers = [
  {
    key: "drawer",
    variable: "--z-drawer",
    value: zIndex.drawer,
    use: "Drawer (below centered dialogs)"
  },
  {
    key: "modal",
    variable: "--z-modal",
    value: zIndex.modal,
    use: "Dialog and Modal"
  },
  {
    key: "dropdown",
    variable: "--z-dropdown",
    value: zIndex.dropdown,
    use: "Dropdown menus and Breadcrumbs overflow (same layer as modal)"
  },
  {
    key: "popover",
    variable: "--z-popover",
    value: zIndex.popover,
    use: "Popover (same layer as modal / dropdown)"
  },
  {
    key: "toast",
    variable: "--z-toast",
    value: zIndex.toast,
    use: "Toast snackbar host"
  },
  {
    key: "tooltip",
    variable: "--z-tooltip",
    value: zIndex.tooltip,
    use: "Tooltip and IconTooltip"
  }
];
var controlHeights = {
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
  xs: "24px"
};
var durationInstant = "0ms";
var durationFast = "100ms";
var durationShort = "150ms";
var durationMedium = "200ms";
var motion = {
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
      bounce: 0
    },
    /** Indicator (Toggle handle, Tabs underline). */
    moderate: {
      type: "spring",
      duration: 0.2,
      bounce: 0.05
    },
    /** Drag release / drawer settle only — not everyday chrome. */
    slow: {
      type: "spring",
      duration: 0.32,
      bounce: 0.08
    }
  },
  /** Active scale feedback on pressable controls. Duration = short. */
  press: {
    scale: "0.97",
    duration: durationShort,
    easing: "cubic-bezier(0.23, 1, 0.32, 1)"
  },
  /** Overlay / menu enter-exit (opacity + slight scale). Duration = medium. */
  surface: {
    fromScale: "0.96",
    duration: durationMedium,
    easing: "cubic-bezier(0.23, 1, 0.32, 1)"
  },
  /**
   * Committed selection chrome that moves (toggle handle, selected pill).
   * When `experimentalMotion` is on, JS springs use `spring.moderate`;
   * CSS vars remain the non-spring / reduced-motion fallback.
   */
  indicator: {
    duration: durationMedium,
    easing: "cubic-bezier(0.2, 0, 0, 1)",
    spring: "moderate"
  },
  /**
   * Soft opacity/chrome fade — quieter than `--transition-colors`.
   * Duration = fast. Use for menu-item hover fills and high-frequency tints.
   * Do not spring high-frequency dropdown rows (feels slow under keyboard).
   */
  fade: {
    duration: durationFast,
    easing: "cubic-bezier(0.23, 1, 0.32, 1)"
  },
  /**
   * Ephemeral hover highlight that follows the pointer (single floating
   * chrome — not per-row fades). Spring = fast. Deferred in the catalog;
   * docs sidebar uses this pattern as a site-only experiment.
   */
  highlightChase: {
    duration: durationFast,
    easing: "cubic-bezier(0.23, 1, 0.32, 1)",
    spring: "fast"
  }
};
function pxToRem(pxValue) {
  const px = Number.parseFloat(pxValue);
  if (Number.isNaN(px)) return pxValue;
  const rem = px / 16;
  return `${Number(rem.toFixed(4))}rem`;
}
function nonColorCssVars() {
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
    /* CADS runtime overlay stacking — not in prod export (Bootstrap z-index). */
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
    "--font-fa-brands": '"Font Awesome 7 Brands"'
  };
}

// src/generated/cssVars.ts
var colorVarsLight = {
  "background-neutral-primary": "#FFFFFF",
  "background-neutral-primary-inverse": "#121212",
  "background-neutral-secondary": "#F1F2F4",
  "background-neutral-tertiary": "#E1E3E6",
  "background-neutral-quaternary": "#D3D6DA",
  "background-neutral-quinary": "#B7BCC2",
  "background-neutral-senary": "#87909A",
  "background-neutral-septenary": "#596069",
  "background-neutral-octonary": "#4B5258",
  "background-neutral-white-fixed": "#FFFFFF",
  "background-neutral-black-fixed": "#121212",
  "background-neutral-true-base": "#121212",
  "background-brand-primary": "#4C42CF",
  "background-brand-light": "#E4E2F8",
  "background-brand-mid": "#ACA8EA",
  "background-brand-strong": "#2B1E9F",
  "background-accent-pink-primary": "#E11970",
  "background-accent-pink-mid": "#F07FB0",
  "background-accent-pink-strong": "#B5004F",
  "background-accent-orange-primary": "#F46800",
  "background-accent-orange-mid": "#FFA868",
  "background-accent-orange-strong": "#B34800",
  "background-error-primary": "#EB1414",
  "background-error-light": "#FFDADA",
  "background-error-mid": "#F37272",
  "background-error-strong": "#B30F0F",
  "background-warning-primary": "#F5C000",
  "background-warning-light": "#FFF5DA",
  "background-warning-mid": "#FFD35C",
  "background-warning-strong": "#CF8E02",
  "background-success-primary": "#258830",
  "background-success-light": "#D8FFDC",
  "background-success-mid": "#7CDB87",
  "background-success-strong": "#17541E",
  "background-info-primary": "#1570D1",
  "background-info-light": "#D5EFFF",
  "background-info-mid": "#6FCAFF",
  "background-info-strong": "#0B43A3",
  "border-neutral-primary": "#D3D6DA",
  "border-neutral-secondary": "#9EA5AD",
  "border-neutral-solid": "#121212",
  "border-neutral-black-fixed": "#121212",
  "border-neutral-white-fixed": "#FFFFFF",
  "border-brand-primary": "#4C42CF",
  "border-brand-light": "#CAC6F5",
  "border-brand-strong": "#3228B7",
  "border-error-primary": "#EB1414",
  "border-error-light": "#FAC2C2",
  "border-error-strong": "#B30F0F",
  "border-warning-primary": "#F5C000",
  "border-warning-light": "#FFECB8",
  "border-warning-strong": "#CF8E02",
  "border-success-primary": "#34BD43",
  "border-success-light": "#C4F1CA",
  "border-success-strong": "#258830",
  "border-info-primary": "#0099F3",
  "border-info-light": "#B8E5FF",
  "border-info-strong": "#1570D1",
  "text-neutral-primary": "#121212",
  "text-neutral-secondary": "#363B40",
  "text-neutral-tertiary": "#4B5258",
  "text-neutral-quaternary": "#596069",
  "text-neutral-placeholder": "#9EA5AD",
  "text-neutral-primary-inverse": "#FFFFFF",
  "text-neutral-white-fixed": "#FFFFFF",
  "text-neutral-black-fixed": "#121212",
  "text-brand-primary": "#4C42CF",
  "text-brand-secondary": "#1D1590",
  "text-brand-primary-fixed": "#4C42CF",
  "text-error-primary": "#EB1414",
  "text-error-secondary": "#B30F0F",
  "text-error-primary-fixed": "#EB1414",
  "text-warning-primary": "#F5C000",
  "text-warning-secondary": "#885D02",
  "text-warning-primary-fixed": "#F5C000",
  "text-success-primary": "#258830",
  "text-success-secondary": "#17541E",
  "text-success-primary-fixed": "#258830",
  "text-info-primary": "#1570D1",
  "text-info-secondary": "#0B43A3",
  "text-info-primary-fixed": "#1570D1",
  "background-neutral-alpha-5": "#1212120D",
  "background-neutral-alpha-10": "#1212121A",
  "background-neutral-alpha-20": "#12121233",
  "background-neutral-alpha-30": "#1212124D",
  "background-neutral-alpha-40": "#12121266",
  "background-neutral-alpha-50": "#12121280",
  "background-neutral-alpha-60": "#12121299",
  "background-neutral-alpha-70": "#121212B2",
  "background-neutral-alpha-80": "#121212CC",
  "background-neutral-alpha-90": "#121212E5",
  "background-neutral-alpha-95": "#121212F2",
  "background-accent-pink-light": "#FBDAE8",
  "background-accent-orange-light": "#FFE3CE",
  "text-accent-pink-primary": "#E11970",
  "text-accent-orange-primary": "#F46800",
  "border-accent-pink-primary": "#E11970",
  "border-accent-orange-primary": "#F46800",
  "background-selected-primary": "#2B1E9F",
  "background-selected-strong": "#1F1976",
  "text-accent-pink-secondary": "#B5004F",
  "text-accent-pink-primary-fixed": "#E11970",
  "text-accent-orange-secondary": "#B34800",
  "text-accent-orange-primary-fixed": "#F46800",
  "text-selected-primary": "#D8FFDC",
  "border-accent-pink-light": "#F3C3D8",
  "border-accent-orange-light": "#FFD2B3",
  "border-accent-orange-strong": "#B34800",
  "border-accent-pink-strong": "#B5004F",
  "border-brand-mid": "#928CEF",
  "border-error-mid": "#F69898",
  "border-warning-mid": "#FFD35C",
  "border-success-mid": "#7CDB87",
  "border-info-mid": "#6FCAFF",
  "border-accent-pink-mid": "#F07FB0",
  "border-accent-orange-mid": "#FFA868",
  "border-selected-primary": "#2B1E9F",
  "border-selected-strong": "#1F1976",
  "background-disabled-neutral": "#D3D6DA",
  "background-disabled-brand": "#E4E2F8",
  "background-disabled-error": "#FFDADA",
  "background-disabled-warning": "#FFF5DA",
  "background-disabled-success": "#D8FFDC",
  "background-disabled-info": "#D5EFFF",
  "background-disabled-pink": "#FBDAE8",
  "background-disabled-orange": "#FFE3CE",
  "text-disabled-neutral": "#D3D6DA",
  "text-disabled-neutral-inverse": "#FFFFFF",
  "text-disabled-brand": "#E4E2F8",
  "text-disabled-error": "#FFDADA",
  "text-disabled-warning": "#FFF5DA",
  "text-disabled-success": "#D8FFDC",
  "text-disabled-info": "#D5EFFF",
  "text-disabled-pink": "#FBDAE8",
  "text-disabled-orange": "#FFE3CE",
  "border-disabled-neutral": "#D3D6DA",
  "border-disabled-brand": "#E4E2F8",
  "border-disabled-error": "#FFDADA",
  "border-disabled-warning": "#FFF5DA",
  "border-disabled-success": "#D8FFDC",
  "border-disabled-info": "#D5EFFF",
  "border-disabled-pink": "#FBDAE8",
  "border-disabled-orange": "#FFE3CE",
  "background-selected-primary-inverse": "#D8FFDC",
  "border-focused-inverse": "#D8FFDC",
  "border-focused-primary": "#4C42CF",
  "border-selected-primary-inverse": "#D8FFDC",
  "text-selected-primary-inverse": "#1F1976"
};
var colorVarsDark = {
  "background-neutral-primary": "#121212",
  "background-neutral-primary-inverse": "#FFFFFF",
  "background-neutral-secondary": "#282B2F",
  "background-neutral-tertiary": "#363B40",
  "background-neutral-quaternary": "#4B5258",
  "background-neutral-quinary": "#596069",
  "background-neutral-senary": "#87909A",
  "background-neutral-septenary": "#B7BCC2",
  "background-neutral-octonary": "#D3D6DA",
  "background-neutral-white-fixed": "#FFFFFF",
  "background-neutral-black-fixed": "#121212",
  "background-neutral-true-base": "#000000",
  "background-brand-primary": "#4C42CF",
  "background-brand-light": "#1F1976",
  "background-brand-mid": "#2B1E9F",
  "background-brand-strong": "#6F67D9",
  "background-accent-pink-primary": "#E11970",
  "background-accent-pink-mid": "#A10448",
  "background-accent-pink-strong": "#EB5895",
  "background-accent-orange-primary": "#F46800",
  "background-accent-orange-mid": "#942F00",
  "background-accent-orange-strong": "#FF8B38",
  "background-error-primary": "#EB1414",
  "background-error-light": "#620202",
  "background-error-mid": "#8D0C0C",
  "background-error-strong": "#EF4848",
  "background-warning-primary": "#F5C000",
  "background-warning-light": "#654500",
  "background-warning-mid": "#B27A01",
  "background-warning-strong": "#FDC835",
  "background-success-primary": "#258830",
  "background-success-light": "#003F25",
  "background-success-mid": "#1F7028",
  "background-success-strong": "#2DA43A",
  "background-info-primary": "#1570D1",
  "background-info-light": "#06338D",
  "background-info-mid": "#0855B2",
  "background-info-strong": "#0082E5",
  "border-neutral-primary": "#4B5258",
  "border-neutral-secondary": "#6E7782",
  "border-neutral-solid": "#FFFFFF",
  "border-neutral-black-fixed": "#121212",
  "border-neutral-white-fixed": "#FFFFFF",
  "border-brand-primary": "#4C42CF",
  "border-brand-light": "#1D1590",
  "border-brand-strong": "#928CEF",
  "border-error-primary": "#EB1414",
  "border-error-light": "#6C0909",
  "border-error-strong": "#F37272",
  "border-warning-primary": "#F5C000",
  "border-warning-light": "#885D02",
  "border-warning-strong": "#FFD35C",
  "border-success-primary": "#34BD43",
  "border-success-light": "#17541E",
  "border-success-strong": "#7CDB87",
  "border-info-primary": "#0099F3",
  "border-info-light": "#0B43A3",
  "border-info-strong": "#6FCAFF",
  "text-neutral-primary": "#FFFFFF",
  "text-neutral-secondary": "#F1F2F4",
  "text-neutral-tertiary": "#E1E3E6",
  "text-neutral-quaternary": "#D3D6DA",
  "text-neutral-placeholder": "#6E7782",
  "text-neutral-primary-inverse": "#121212",
  "text-neutral-white-fixed": "#FFFFFF",
  "text-neutral-black-fixed": "#121212",
  "text-brand-primary": "#FFFFFF",
  "text-brand-secondary": "#E4E2F8",
  "text-brand-primary-fixed": "#928CEF",
  "text-error-primary": "#FFFFFF",
  "text-error-secondary": "#FFDADA",
  "text-error-primary-fixed": "#F37272",
  "text-warning-primary": "#FFFFFF",
  "text-warning-secondary": "#FFF5DA",
  "text-warning-primary-fixed": "#FFD35C",
  "text-success-primary": "#FFFFFF",
  "text-success-secondary": "#D8FFDC",
  "text-success-primary-fixed": "#7CDB87",
  "text-info-primary": "#FFFFFF",
  "text-info-secondary": "#D5EFFF",
  "text-info-primary-fixed": "#6FCAFF",
  "background-neutral-alpha-5": "#FFFFFF0D",
  "background-neutral-alpha-10": "#FFFFFF1A",
  "background-neutral-alpha-20": "#FFFFFF33",
  "background-neutral-alpha-30": "#FFFFFF4D",
  "background-neutral-alpha-40": "#FFFFFF66",
  "background-neutral-alpha-50": "#FFFFFF80",
  "background-neutral-alpha-60": "#FFFFFF99",
  "background-neutral-alpha-70": "#FFFFFFB2",
  "background-neutral-alpha-80": "#FFFFFFCC",
  "background-neutral-alpha-90": "#FFFFFFE5",
  "background-neutral-alpha-95": "#FFFFFFF2",
  "background-accent-pink-light": "#7D0C3D",
  "background-accent-orange-light": "#611D00",
  "text-accent-pink-primary": "#FFFFFF",
  "text-accent-orange-primary": "#FFFFFF",
  "border-accent-pink-primary": "#E11970",
  "border-accent-orange-primary": "#F46800",
  "background-selected-primary": "#D8FFDC",
  "background-selected-strong": "#9BE3A3",
  "text-accent-pink-secondary": "#FBDAE8",
  "text-accent-pink-primary-fixed": "#F07FB0",
  "text-accent-orange-secondary": "#FFE3CE",
  "text-accent-orange-primary-fixed": "#FFA868",
  "text-selected-primary": "#1F1976",
  "border-accent-pink-light": "#8D003D",
  "border-accent-orange-light": "#701C00",
  "border-accent-orange-strong": "#FFA868",
  "border-accent-pink-strong": "#F07FB0",
  "border-brand-mid": "#3228B7",
  "border-error-mid": "#B30F0F",
  "border-warning-mid": "#CF8E02",
  "border-success-mid": "#258830",
  "border-info-mid": "#1570D1",
  "border-accent-pink-mid": "#B5004F",
  "border-accent-orange-mid": "#B34800",
  "border-selected-primary": "#D8FFDC",
  "border-selected-strong": "#9BE3A3",
  "background-disabled-neutral": "#4B5258",
  "background-disabled-brand": "#4B5258",
  "background-disabled-error": "#4B5258",
  "background-disabled-warning": "#4B5258",
  "background-disabled-success": "#4B5258",
  "background-disabled-info": "#4B5258",
  "background-disabled-pink": "#4B5258",
  "background-disabled-orange": "#4B5258",
  "text-disabled-neutral": "#4B5258",
  "text-disabled-neutral-inverse": "#121212",
  "text-disabled-brand": "#4B5258",
  "text-disabled-error": "#4B5258",
  "text-disabled-warning": "#4B5258",
  "text-disabled-success": "#4B5258",
  "text-disabled-info": "#4B5258",
  "text-disabled-pink": "#4B5258",
  "text-disabled-orange": "#4B5258",
  "border-disabled-neutral": "#4B5258",
  "border-disabled-brand": "#4B5258",
  "border-disabled-error": "#4B5258",
  "border-disabled-warning": "#4B5258",
  "border-disabled-success": "#4B5258",
  "border-disabled-info": "#4B5258",
  "border-disabled-pink": "#4B5258",
  "border-disabled-orange": "#4B5258",
  "background-selected-primary-inverse": "#2B1E9F",
  "border-focused-inverse": "#4C42CF",
  "border-focused-primary": "#928CEF",
  "border-selected-primary-inverse": "#2B1E9F",
  "text-selected-primary-inverse": "#D8FFDC"
};

export {
  typography,
  shape,
  spacing,
  elevation,
  zIndex,
  zIndexLayers,
  controlHeights,
  motion,
  pxToRem,
  nonColorCssVars,
  colorVarsLight,
  colorVarsDark
};
//# sourceMappingURL=chunk-EF7ICITX.js.map