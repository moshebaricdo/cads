import { TablePaginationProps } from './types';
export type { TablePaginationProps, TablePaginationSize, LabelDisplayedRowsArgs, } from './types';
/**
 * CADS table Pagination — rows-per-page Dropdown + range + prev/next Buttons.
 *
 * Spec: set `17007:19104` type=table. Composes Dropdown (input / secondary,
 * hug + menuWidth trigger) and Button (outlined secondary iconOnly). On mobile
 * (<=760px), the clusters stack, the divider hides, and the gap is L16 / M12 /
 * S8 / XS6.
 */
export declare const TablePagination: import('react').ForwardRefExoticComponent<TablePaginationProps & import('react').RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=TablePagination.d.ts.map