import { PaginationProps } from './types';
export type { PaginationProps, PaginationSize, PaginationLayout, LabelCompactPagesArgs, } from './types';
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
 * overflow, swap to compact prev + "Page X of Y" + next (no wrap / scroll).
 */
export declare const Pagination: import('react').ForwardRefExoticComponent<Omit<PaginationProps, "ref"> & import('react').RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=Pagination.d.ts.map