import * as react from 'react';
import { CSSProperties } from 'react';
import { FaBrandIconName } from './faBrandsCodepoints.js';
import { FaIconName } from './faProRegularCodepoints.js';

type FaIconSize = "inherit" | "extraSmall" | "small" | "medium" | "large"
/** @deprecated Prefer `extraSmall` */
 | "xs"
/** @deprecated Prefer `small` */
 | "s"
/** @deprecated Prefer `medium` */
 | "m"
/** @deprecated Prefer `large` */
 | "l";
type FaIconFamily = "solid" | "regular" | "brands";
interface FaIconProps {
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
 * Renders a glyph from the licensed Font Awesome 7 webfont
 * (Pro Solid / Pro Regular / Brands).
 * Import `@codeai/cads-react/icons/fonts.css` once at app root.
 *
 * Unknown names render nothing (no throw) so playgrounds stay resilient
 * while typing shortcodes.
 */
declare function FaIcon({ name, family, className, title, size, fontSize: fontSizeProp, style, }: FaIconProps): react.JSX.Element | null;

export { FaIcon, type FaIconFamily, type FaIconProps, type FaIconSize };
