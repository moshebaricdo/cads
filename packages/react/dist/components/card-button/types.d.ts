import { ButtonBaseProps } from '@mui/material/ButtonBase';
import { ReactNode } from 'react';
import { FaIconName } from '../../icons/faProRegularCodepoints';
/** Figma Card Button `layout`. */
export type CardButtonLayout = "horizontal" | "vertical";
/** Figma Card Button `size`. */
export type CardButtonSize = "medium" | "small";
export interface CardButtonProps extends Omit<ButtonBaseProps, "children" | "title" | "centerRipple"> {
    /**
     * `horizontal` — list rows (icon · text · optional trailing icon).
     * `vertical` — stacked, centered choice tiles.
     * @default "horizontal"
     */
    layout?: CardButtonLayout;
    /**
     * @default "medium"
     */
    size?: CardButtonSize;
    /** Primary text (Figma `title`). */
    title: ReactNode;
    /**
     * Supporting text under the title (Figma `description`).
     * Presence replaces Figma `showDescription`.
     */
    description?: ReactNode;
    /**
     * Leading FA icon (Figma `startIconName`). Presence replaces Figma
     * `startIcon`; omit for a text-only card.
     */
    startIconName?: FaIconName | (string & {});
    /**
     * Custom start icon color — any CSS color; prefer a CADS semantic
     * variable, e.g. `"var(--text-success-primary)"`. Replaces the default
     * `--text-brand-primary` in the unselected default / hover / pressed
     * states. Selected and disabled keep their recipe colors so state stays
     * legible. Also applies as the `color` of `startContent`.
     */
    startIconColor?: string;
    /**
     * Custom leading content in place of the start icon — e.g. a section
     * avatar or image (Figma `startContent` slot; presence replaces
     * `hasStartContent`). Hugs its content, min the icon box size, and is
     * vertically centered. Takes precedence over `startIconName`.
     * Consumer owns its visuals (it isn't recolored for selected / disabled).
     */
    startContent?: ReactNode;
    /**
     * Trailing FA icon, e.g. `chevron-right` / `arrow-right` (Figma
     * `endIconName`). Horizontal layout only — Figma has no end slot on
     * vertical cards. Presence replaces Figma `endIcon`.
     */
    endIconName?: FaIconName | (string & {});
    /**
     * Selected chrome (Figma `selected=Yes`). When a boolean is passed on a
     * button, the card exposes `aria-pressed`; omit for plain action /
     * navigation cards.
     */
    selected?: boolean;
    /**
     * Stretch to the container width. Default hugs content like Button
     * (Figma's fixed 360 / 200 widths are canvas widths, not a size spec).
     * @default false
     */
    fullWidth?: boolean;
    /** Renders the card as a link (`<a>`) for navigation cards. */
    href?: string;
    /** Link target when `href` is set. */
    target?: string;
    /** Link rel when `href` is set. */
    rel?: string;
}
//# sourceMappingURL=types.d.ts.map