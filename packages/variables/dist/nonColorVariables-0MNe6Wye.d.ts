/**
 * Non-color CADS variables (typography, spacing/shape, elevation).
 * Sourced from the CADS Figma typography + spacing-shape collections.
 * Color semantics live in codeAiColorSystem.json and are resolved at generate time.
 */
declare const typography: {
    readonly fontFamily: {
        readonly heading: string;
        readonly body: string;
        /**
         * No brand mono in prod — browser / system monospace.
         * Docs may override with a specimen face (e.g. Google Sans Code) locally.
         */
        readonly mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace";
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
    readonly radiusXl: "12px";
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
/**
 * Overlay stacking layers (code-owned; Figma has no z-index collection).
 * Dropdown / Popover share the modal layer so nested menus stack by DOM order
 * when both portal to `document.body`.
 */
declare const zIndex: {
    readonly drawer: 1200;
    readonly modal: 1300;
    readonly dropdown: 1300;
    readonly popover: 1300;
    readonly toast: 1400;
    readonly tooltip: 1500;
};
type ZIndexLayer = keyof typeof zIndex;
/** Docs rows — variable / value / use stay in sync with `zIndex`. */
declare const zIndexLayers: readonly [{
    readonly key: "drawer";
    readonly variable: "--z-drawer";
    readonly value: 1200;
    readonly use: "Drawer (below centered dialogs)";
}, {
    readonly key: "modal";
    readonly variable: "--z-modal";
    readonly value: 1300;
    readonly use: "Dialog and Modal";
}, {
    readonly key: "dropdown";
    readonly variable: "--z-dropdown";
    readonly value: 1300;
    readonly use: "Dropdown menus and Breadcrumbs overflow (same layer as modal)";
}, {
    readonly key: "popover";
    readonly variable: "--z-popover";
    readonly value: 1300;
    readonly use: "Popover (same layer as modal / dropdown)";
}, {
    readonly key: "toast";
    readonly variable: "--z-toast";
    readonly value: 1400;
    readonly use: "Toast snackbar host";
}, {
    readonly key: "tooltip";
    readonly variable: "--z-tooltip";
    readonly value: 1500;
    readonly use: "Tooltip and IconTooltip";
}];
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
 * Apple-style spring preset (Motion / Framer Motion `transition` shape).
 * Prefer these over stiffness/damping for Indicator and pointer-driven chase.
 * Near-zero bounce — CADS product UI, not playful consumer chrome.
 */
type MotionSpringPreset = {
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
declare const motion: {
    readonly durationInstant: "0ms";
    /** High-frequency tint / chase — quieter than chrome color transitions. */
    readonly durationFast: "100ms";
    readonly durationShort: "150ms";
    readonly durationMedium: "200ms";
    readonly easingStandard: "cubic-bezier(0.4, 0, 0.2, 1)";
    readonly easingEmphasized: "cubic-bezier(0.2, 0, 0, 1)";
    /** Ease-out for user-initiated feedback (snappy start, soft settle). */
    readonly easingOut: "cubic-bezier(0.23, 1, 0.32, 1)";
    /**
     * Spring ladder for interruptible travel. Maps loosely to the duration
     * ladder’s feel (fast ≈ 100ms, moderate ≈ 200ms, slow ≈ 320ms).
     */
    readonly spring: {
        /** Pointer chase / micro-settle — docs nav highlight. */
        readonly fast: {
            type: "spring";
            duration: number;
            bounce: number;
        };
        /** Indicator (Toggle handle, Tabs underline). */
        readonly moderate: {
            type: "spring";
            duration: number;
            bounce: number;
        };
        /** Drag release / drawer settle only — not everyday chrome. */
        readonly slow: {
            type: "spring";
            duration: number;
            bounce: number;
        };
    };
    /** Active scale feedback on pressable controls. Duration = short. */
    readonly press: {
        readonly scale: "0.97";
        readonly duration: "150ms";
        readonly easing: "cubic-bezier(0.23, 1, 0.32, 1)";
    };
    /** Overlay / menu enter-exit (opacity + slight scale). Duration = medium. */
    readonly surface: {
        readonly fromScale: "0.96";
        readonly duration: "200ms";
        readonly easing: "cubic-bezier(0.23, 1, 0.32, 1)";
    };
    /**
     * Committed selection chrome that moves (toggle handle, selected pill).
     * When `experimentalMotion` is on, JS springs use `spring.moderate`;
     * CSS vars remain the non-spring / reduced-motion fallback.
     */
    readonly indicator: {
        readonly duration: "200ms";
        readonly easing: "cubic-bezier(0.2, 0, 0, 1)";
        readonly spring: "moderate";
    };
    /**
     * Soft opacity/chrome fade — quieter than `--transition-colors`.
     * Duration = fast. Use for menu-item hover fills and high-frequency tints.
     * Do not spring high-frequency dropdown rows (feels slow under keyboard).
     */
    readonly fade: {
        readonly duration: "100ms";
        readonly easing: "cubic-bezier(0.23, 1, 0.32, 1)";
    };
    /**
     * Ephemeral hover highlight that follows the pointer (single floating
     * chrome — not per-row fades). Spring = fast. Deferred in the catalog;
     * docs sidebar uses this pattern as a site-only experiment.
     */
    readonly highlightChase: {
        readonly duration: "100ms";
        readonly easing: "cubic-bezier(0.23, 1, 0.32, 1)";
        readonly spring: "fast";
    };
};
/** Flat CSS custom-property map for non-color variables (prod-aligned names). */
declare function nonColorCssVars(): Record<string, string>;

export { type MotionSpringPreset as M, type ZIndexLayer as Z, spacing as a, zIndexLayers as b, controlHeights as c, elevation as e, motion as m, nonColorCssVars as n, shape as s, typography as t, zIndex as z };
