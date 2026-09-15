import { CSSProperties } from 'react';
import { FaBrandIconName } from './faBrandsCodepoints';
import { FaIconName } from './faProRegularCodepoints';
export type FaIconSize = "inherit" | "extraSmall" | "small" | "medium" | "large"
/** @deprecated Prefer `extraSmall` */
 | "xs"
/** @deprecated Prefer `small` */
 | "s"
/** @deprecated Prefer `medium` */
 | "m"
/** @deprecated Prefer `large` */
 | "l";
export type FaIconFamily = "solid" | "regular" | "brands";
export interface FaIconProps {
    /**
     * FA icon name (kebab-case), e.g. `arrow-right`, `face-smile`.
     * Figma shortcode `smile` is accepted as an alias for `face-smile`.
     */
    name: FaIconName | FaBrandIconName | (string & {});
    family?: FaIconFamily;
    className?: string;
    /** Visible label for screen readers; when set, `aria-hidden` is not applied. */
    title?: string;
    size?: FaIconSize;
    /** Override glyph size (e.g. Figma button icon px). */
    fontSize?: string;
    style?: CSSProperties;
}
/**
 * Renders a glyph from Font Awesome 7 (solid / regular / brands).
 * Import `@moshebari/cads-react/icons/fonts.css` once at app root.
 * CADS Docs loads Pro OTFs; the public npm export is FA7 Free webfonts
 * registered under the same family names (Pro-only glyphs are empty there).
 *
 * Unknown names render nothing (no throw) so playgrounds stay resilient
 * while typing shortcodes.
 */
export declare function FaIcon({ name, family, className, title, size, fontSize: fontSizeProp, style, }: FaIconProps): import("react").JSX.Element | null;
//# sourceMappingURL=FaIcon.d.ts.map