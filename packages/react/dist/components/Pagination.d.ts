import * as react from 'react';
import { ReactNode } from 'react';
import { PaginationProps as PaginationProps$1 } from '@mui/material/Pagination';
import { ControlSize } from '../shared/controlSize.js';

type PaginationSize = ControlSize;
/** How the control adapts when space is tight. */
type PaginationLayout = "auto" | "segmented" | "compact";
interface LabelCompactPagesArgs {
    page: number;
    count: number;
}
interface PaginationProps extends Omit<PaginationProps$1, "size" | "color" | "variant" | "shape"> {
    /**
     * Control height: large 48 / medium 40 / small 32 / extraSmall 24.
     * @default "medium"
     */
    size?: PaginationSize;
    /**
     * Narrow-container behavior.
     * - `segmented` — always the full page trail (may scroll if forced narrower)
     * - `compact` — prev + “Page X of Y” + next (table-nav style)
     * - `auto` — segmented until it would overflow, then compact
     * @default "auto"
     */
    layout?: PaginationLayout;
    /** Formats the compact-mode page label. @default `Page ${page} of ${count}` */
    labelCompactPages?: (args: LabelCompactPagesArgs) => ReactNode;
}
/**
 * CADS page Pagination — MUI Pagination styled as a Segmented Button group
 * with pagination-specific nav chrome.
 *
 * Spec: set `17007:19104` (key `9f27562cc11f74ff5019ad281149a183c1510ecf`),
 * type=page. Building blocks: Segmented Button Block `8000:4554`.
 *
 * Case-specific tweaks vs SegmentedButton:
 * - first/prev/next/last use `--background-neutral-secondary` + quaternary icons
 * - page + ellipsis keep primary fill
 * - disabled (group or boundary item): no fill; selected-disabled uses disabled
 *   neutral fill + inverse text (Figma state=disabled)
 *
 * Responsiveness (`layout`, default `auto`): when the segmented bar would
 * overflow, swap to compact prev + “Page X of Y” + next (no wrap / scroll).
 */
declare const Pagination: react.ForwardRefExoticComponent<Omit<PaginationProps, "ref"> & react.RefAttributes<HTMLDivElement>>;

export { type LabelCompactPagesArgs, Pagination, type PaginationLayout, type PaginationProps, type PaginationSize };
