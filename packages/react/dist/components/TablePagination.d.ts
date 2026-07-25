import * as react from 'react';
import { MouseEvent, ChangeEvent, ReactNode } from 'react';
import { ControlSize } from '../shared/controlSize.js';

type TablePaginationSize = ControlSize;
interface LabelDisplayedRowsArgs {
    from: number;
    to: number;
    count: number;
    page: number;
}
interface TablePaginationProps {
    /**
     * Control height: large 48 / medium 40 / small 32 / extraSmall 24.
     * @default "medium"
     */
    size?: TablePaginationSize;
    /** Total number of rows. */
    count: number;
    /** 0-based page index (MUI TablePagination). */
    page: number;
    /** Rows shown per page. */
    rowsPerPage: number;
    onPageChange: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    /** @default [10, 25, 50, 100] */
    rowsPerPageOptions?: Array<number | {
        value: number;
        label: string;
    }>;
    /** @default "Rows per page" */
    labelRowsPerPage?: ReactNode;
    labelDisplayedRows?: (args: LabelDisplayedRowsArgs) => ReactNode;
    disabled?: boolean;
    "aria-label"?: string;
    className?: string;
}
/**
 * CADS table Pagination — rows-per-page Dropdown + range + prev/next Buttons.
 *
 * Spec: set `17007:19104` type=table. Composes Dropdown (input / secondary,
 * hug + menuWidth trigger) and Button (outlined secondary iconOnly). On mobile
 * (≤760px), the clusters stack, the divider hides, and the gap is L16 / M12 /
 * S8 / XS6.
 */
declare const TablePagination: react.ForwardRefExoticComponent<TablePaginationProps & react.RefAttributes<HTMLDivElement>>;

export { type LabelDisplayedRowsArgs, TablePagination, type TablePaginationProps, type TablePaginationSize };
