import {
  forwardRef,
  type ChangeEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import Box from "@mui/material/Box";
import { Button } from "./Button";
import { Dropdown } from "./Dropdown";
import {
  TABLE_PAGINATION_SIZE,
  type ControlSize,
} from "../shared/controlSize";

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
  onPageChange: (
    event: MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => void;
  onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  /** @default [10, 25, 50, 100] */
  rowsPerPageOptions?: Array<number | { value: number; label: string }>;
  /** @default "Rows per page" */
  labelRowsPerPage?: ReactNode;
  labelDisplayedRows?: (args: LabelDisplayedRowsArgs) => ReactNode;
  disabled?: boolean;
  "aria-label"?: string;
  className?: string;
}

function defaultLabelDisplayedRows({
  from,
  to,
  count,
}: LabelDisplayedRowsArgs) {
  return `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`;
}

function optionValue(
  option: number | { value: number; label: string },
): number {
  return typeof option === "number" ? option : option.value;
}

function optionLabel(
  option: number | { value: number; label: string },
): string {
  return typeof option === "number" ? String(option) : option.label;
}

/**
 * CADS table Pagination — rows-per-page Dropdown + range + prev/next Buttons.
 *
 * Spec: set `17007:19104` type=table. Composes Dropdown (input / secondary,
 * hug + menuWidth trigger) and Button (outlined secondary iconOnly). On mobile
 * (≤760px), the clusters stack, the divider hides, and the gap is L16 / M12 /
 * S8 / XS6.
 */
export const TablePagination = forwardRef<HTMLDivElement, TablePaginationProps>(
  function TablePagination(
    {
      size = "medium",
      count,
      page,
      rowsPerPage,
      onPageChange,
      onRowsPerPageChange,
      rowsPerPageOptions = [10, 25, 50, 100],
      labelRowsPerPage = "Rows per page",
      labelDisplayedRows = defaultLabelDisplayedRows,
      disabled,
      "aria-label": ariaLabel,
      className,
    },
    ref,
  ) {
    const dims = TABLE_PAGINATION_SIZE[size];
    const from = count === 0 ? 0 : page * rowsPerPage + 1;
    const to =
      count === -1
        ? (page + 1) * rowsPerPage
        : Math.min(count, (page + 1) * rowsPerPage);
    const lastPage =
      count === -1 ? page + 1 : Math.max(0, Math.ceil(count / rowsPerPage) - 1);
    const atFirst = page <= 0;
    const atLast = count !== -1 && page >= lastPage;

    const dropdownOptions = rowsPerPageOptions.map((option) => ({
      value: String(optionValue(option)),
      label: optionLabel(option),
    }));

    return (
      <Box
        ref={ref}
        role="navigation"
        aria-label={ariaLabel ?? "Table pagination"}
        className={className}
        sx={{
          display: "inline-flex",
          flexDirection: "row",
          alignItems: "center",
          gap: dims.groupGap,
          height: dims.height,
          "@media (max-width: 760px)": {
            flexDirection: "column",
            alignItems: "flex-start",
            gap: dims.mobileGroupGap,
            height: "auto",
          },
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: dims.clusterGap,
            height: dims.height,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 400,
              fontSize: dims.fontSize,
              lineHeight: dims.lineHeight,
              color: "var(--text-neutral-tertiary)",
              whiteSpace: "nowrap",
            }}
          >
            {labelRowsPerPage}
          </span>
          <Dropdown
            role="input"
            size={size}
            color="secondary"
            width="hug"
            menuWidth="trigger"
            labelStyle="thick"
            value={String(rowsPerPage)}
            options={dropdownOptions}
            disabled={disabled}
            aria-label={`${typeof labelRowsPerPage === "string" ? labelRowsPerPage : "Rows per page"}: ${rowsPerPage}`}
            onChange={(value) => {
              if (!onRowsPerPageChange) return;
              const next = Array.isArray(value) ? value[0] : value;
              if (next == null) return;
              const event = {
                target: { value: next },
              } as ChangeEvent<HTMLInputElement>;
              onRowsPerPageChange(event);
            }}
          />
        </div>

        <Box
          aria-hidden
          sx={{
            width: "1px",
            height: dims.dividerHeight,
            backgroundColor: "var(--border-neutral-primary)",
            flexShrink: 0,
            alignSelf: "center",
            "@media (max-width: 760px)": {
              display: "none",
            },
          }}
        />

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: dims.clusterGap,
            height: dims.height,
          }}
        >
          <Button
            variant="outlined"
            color="secondary"
            size={size}
            iconOnly
            startIconName="chevron-left"
            aria-label="Go to previous page"
            disabled={disabled || atFirst}
            onClick={(event) => {
              onPageChange(event, page - 1);
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 400,
              fontSize: dims.fontSize,
              lineHeight: dims.lineHeight,
              color: "var(--text-neutral-tertiary)",
              whiteSpace: "nowrap",
            }}
          >
            {labelDisplayedRows({ from, to, count, page })}
          </span>
          <Button
            variant="outlined"
            color="secondary"
            size={size}
            iconOnly
            startIconName="chevron-right"
            aria-label="Go to next page"
            disabled={disabled || atLast}
            onClick={(event) => {
              onPageChange(event, page + 1);
            }}
          />
        </div>
      </Box>
    );
  },
);
