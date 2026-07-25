import { PaginationProps as MuiPaginationProps } from '@mui/material/Pagination';
import { ReactNode } from 'react';
import { ControlSize } from '../../shared/controlSize';
export type PaginationSize = ControlSize;
/** How the control adapts when space is tight. */
export type PaginationLayout = "auto" | "segmented" | "compact";
export interface LabelCompactPagesArgs {
    page: number;
    count: number;
}
export interface PaginationProps extends Omit<MuiPaginationProps, "size" | "color" | "variant" | "shape"> {
    /**
     * Control height: large 48 / medium 40 / small 32 / extraSmall 24.
     * @default "medium"
     */
    size?: PaginationSize;
    /**
     * Narrow-container behavior.
     * - `segmented` — always the full page trail (may scroll if forced narrower)
     * - `compact` — prev + "Page X of Y" + next (table-nav style)
     * - `auto` — segmented until it would overflow, then compact
     * @default "auto"
     */
    layout?: PaginationLayout;
    /** Formats the compact-mode page label. @default `Page ${page} of ${count}` */
    labelCompactPages?: (args: LabelCompactPagesArgs) => ReactNode;
}
//# sourceMappingURL=types.d.ts.map