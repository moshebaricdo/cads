import type { CSSProperties, MouseEvent, ReactNode } from "react";
import type { FaIconName } from "../../icons/faProRegularCodepoints";
import type { ControlSize } from "../../shared/controlSize";

export type BreadcrumbsSize = ControlSize;

export interface BreadcrumbItem {
  key?: string;
  label: ReactNode;
  href?: string;
  /**
   * Optional leading icon on this crumb (Figma `startIcon` + `iconName`).
   * Available on any item — not limited to the first / "home" crumb.
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

export interface BreadcrumbsProps {
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
   * Figma's default composition shows 2 after the ellipsis.
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
