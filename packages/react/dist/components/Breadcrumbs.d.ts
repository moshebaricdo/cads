import * as react from 'react';
import { ReactNode, MouseEvent, CSSProperties } from 'react';
import { FaIconName } from '../icons/faProRegularCodepoints.js';
import { ControlSize } from '../shared/controlSize.js';

type BreadcrumbsSize = ControlSize;
interface BreadcrumbItem {
    key?: string;
    label: ReactNode;
    href?: string;
    /**
     * Optional leading icon on this crumb (Figma `startIcon` + `iconName`).
     * Available on any item — not limited to the first / “home” crumb.
     */
    iconName?: FaIconName | (string & {});
    /**
     * When true with `iconName`, hide the label visually (keep accessible name).
     * Figma `iconOnly`.
     */
    iconOnly?: boolean;
    /** Maps Figma isCurrent — render as span, not a link. */
    current?: boolean;
    disabled?: boolean;
    onClick?: (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
}
interface BreadcrumbsProps {
    /**
     * @default "medium"
     */
    size?: BreadcrumbsSize;
    items: BreadcrumbItem[];
    /**
     * Max visible crumbs before collapsing the middle into Breadcrumb Overflow
     * (ellipsis that opens a dropdown of truncated pages). MUI-compatible.
     * @default 8
     */
    maxItems?: number;
    /**
     * Crumbs kept before the overflow ellipsis when collapsed. MUI-compatible.
     * @default 1
     */
    itemsBeforeCollapse?: number;
    /**
     * Crumbs kept after the overflow ellipsis when collapsed. MUI-compatible.
     * Figma’s default composition shows 2 after the ellipsis.
     * @default 1
     */
    itemsAfterCollapse?: number;
    /**
     * Accessible name for the overflow trigger.
     * @default "Show path"
     */
    expandText?: string;
    /**
     * @default "Breadcrumb"
     */
    "aria-label"?: string;
    className?: string;
    style?: CSSProperties;
}
/**
 * CADS Breadcrumbs — trail of links with separators and optional overflow.
 * Spec: Figma Breadcrumbs `16381:3339` / key `43afede0abfd158d2c740e2801b46d13e570a8d0`.
 * Internal: Links `6862:5619`, Separators `2434:9333`, Overflow `16398:927`.
 */
declare const Breadcrumbs: react.ForwardRefExoticComponent<BreadcrumbsProps & react.RefAttributes<HTMLElement>>;

export { type BreadcrumbItem, Breadcrumbs, type BreadcrumbsProps, type BreadcrumbsSize };
