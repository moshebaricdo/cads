import * as react from 'react';
import { AnchorHTMLAttributes, ReactNode } from 'react';
import { ControlSize } from '../shared/controlSize.js';

/** Figma Link size scale — includes Link-only `extraExtraSmall`. */
type LinkSize = ControlSize | "extraExtraSmall";
/** Figma Link `type` axis (not HTML link type). */
type LinkType = "primary" | "secondary";
interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "type"> {
    /**
     * Typography / icon scale.
     * @default "medium"
     */
    size?: LinkSize;
    /**
     * Figma `type` axis: primary (brand) | secondary (neutral).
     * @default "primary"
     */
    type?: LinkType;
    /**
     * Show FA solid `up-right-from-square` end icon.
     * @default true
     */
    isExternal?: boolean;
    /** Disables navigation and applies disabled chrome. */
    disabled?: boolean;
    children?: ReactNode;
}
/**
 * CADS Link — inline text link with optional external-affordance icon.
 * Spec: Figma Link `3480:5546` / key `87b099a460c3dad155731d3983e7ccfecefc5975`.
 */
declare const Link: react.ForwardRefExoticComponent<LinkProps & react.RefAttributes<HTMLSpanElement | HTMLAnchorElement>>;

export { Link, type LinkProps, type LinkSize, type LinkType };
