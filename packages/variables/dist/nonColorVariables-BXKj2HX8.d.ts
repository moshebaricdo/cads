/**
 * Non-color CADS variables (typography, spacing/shape, elevation).
 * Sourced from the CADS Figma typography + spacing-shape collections.
 * Color semantics live in codeAiColorSystem.json and are resolved at generate time.
 */
declare const typography: {
    readonly fontFamily: {
        readonly heading: "\"Space Grotesk\", sans-serif";
        readonly body: "\"Geist\", sans-serif";
        readonly mono: "\"Google Sans Code\", \"Courier New\", monospace";
    };
    readonly fontWeight: {
        readonly bold: "700";
        readonly semibold: "600";
        readonly medium: "500";
        readonly normal: "400";
    };
    readonly fontSize: {
        readonly headingXxl: "48px";
        readonly headingXl: "38px";
        readonly headingLg: "28px";
        readonly headingMd: "24px";
        readonly headingSm: "22px";
        readonly headingXs: "20px";
        readonly bodyLg: "18px";
        readonly bodyMd: "16px";
        readonly bodySm: "14px";
        readonly bodyXs: "12px";
        readonly bodyXxs: "10px";
    };
    readonly lineHeight: {
        readonly headingXxl: "52px";
        readonly headingXl: "40px";
        readonly headingLg: "36px";
        readonly headingMd: "32px";
        readonly headingSm: "30px";
        readonly headingXs: "28px";
        readonly bodyLg: "28px";
        readonly bodyMd: "24px";
        readonly bodySm: "22px";
        readonly bodyXs: "18px";
        readonly bodyXxs: "16px";
    };
    readonly letterSpacing: {
        readonly headingDisplay: "-0.01em";
        readonly overline: "0.08em";
        readonly none: "0";
    };
};
declare const shape: {
    readonly radiusSm: "6px";
    readonly radiusMd: "8px";
    readonly radiusLg: "10px";
    readonly radiusRound: "999px";
};
declare const spacing: {
    readonly xxs: "8px";
    readonly xs: "16px";
    readonly s: "24px";
    readonly m: "32px";
    readonly l: "40px";
    readonly xl: "48px";
    readonly xxl: "56px";
    readonly xxxl: "64px";
};
declare const elevation: {
    readonly shadowSm: "0 4px 7px rgb(0 0 0 / 7%), 0 2px 2px rgb(0 0 0 / 7%)";
    readonly shadowMd: "0 10px 15px -3px rgb(0 0 0 / 10%), 0 4px 6px -4px rgb(0 0 0 / 10%)";
    readonly shadowLg: "0 20px 25px -5px rgb(0 0 0 / 10%), 0 8px 10px -6px rgb(0 0 0 / 10%)";
};
declare const controlHeights: {
    readonly large: "48px";
    readonly medium: "40px";
    readonly small: "32px";
    readonly extraSmall: "24px";
    /** @deprecated Prefer `large` */
    readonly l: "48px";
    /** @deprecated Prefer `medium` */
    readonly m: "40px";
    /** @deprecated Prefer `small` */
    readonly s: "32px";
    /** @deprecated Prefer `extraSmall` */
    readonly xs: "24px";
};
/**
 * Motion / transition variables.
 * Figma has no duration/easing collection yet — these are a small CADS set for
 * control chrome (hover/press fills, borders). Focus rings use short so they
 * don't feel lagged.
 */
declare const motion: {
    readonly durationInstant: "0ms";
    readonly durationShort: "150ms";
    readonly durationMedium: "200ms";
    readonly easingStandard: "cubic-bezier(0.4, 0, 0.2, 1)";
    readonly easingEmphasized: "cubic-bezier(0.2, 0, 0, 1)";
};
/** Flat CSS custom-property map for non-color variables. */
declare function nonColorCssVars(): Record<string, string>;

export { spacing as a, controlHeights as c, elevation as e, motion as m, nonColorCssVars as n, shape as s, typography as t };
