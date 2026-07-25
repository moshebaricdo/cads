import {
  forwardRef,
  type ChangeEvent,
  type CSSProperties,
} from "react";
import { Button } from "../button/index";
import { Dropdown } from "../dropdown/index";
import { TABLE_PAGINATION_SIZE } from "../../shared/controlSize";
import moduleStyles from "./tablePagination.module.scss";
import type { TablePaginationProps } from "./types";

export type {
  TablePaginationProps,
  TablePaginationSize,
  LabelDisplayedRowsArgs,
} from "./types";

function defaultLabelDisplayedRows({
  from,
  to,
  count,
}: {
  from: number;
  to: number;
  count: number;
}) {
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
 * (<=760px), the clusters stack, the divider hides, and the gap is L16 / M12 /
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

    const rootClass = [moduleStyles.root, className].filter(Boolean).join(" ");

    const chromeVars = {
      "--tp-group-gap": dims.groupGap,
      "--tp-height": dims.height,
      "--tp-mobile-gap": dims.mobileGroupGap,
      "--tp-cluster-gap": dims.clusterGap,
      "--tp-font-size": dims.fontSize,
      "--tp-line-height": dims.lineHeight,
      "--tp-divider-height": dims.dividerHeight,
    } as CSSProperties;

    return (
      <div
        ref={ref}
        role="navigation"
        aria-label={ariaLabel ?? "Table pagination"}
        className={rootClass}
        data-cads-component="TablePagination"
        style={chromeVars}
      >
        <div className={moduleStyles.cluster}>
          <span className={moduleStyles.label}>
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

        <div aria-hidden className={moduleStyles.divider} />

        <div className={moduleStyles.cluster}>
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
          <span className={moduleStyles.label}>
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
      </div>
    );
  },
);
