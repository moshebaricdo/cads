import { ChangeEvent, MouseEvent, ReactNode } from 'react';
import { ControlSize } from '../../shared/controlSize';
export type TablePaginationSize = ControlSize;
export interface LabelDisplayedRowsArgs {
    from: number;
    to: number;
    count: number;
    page: number;
}
export interface TablePaginationProps {
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
//# sourceMappingURL=types.d.ts.map