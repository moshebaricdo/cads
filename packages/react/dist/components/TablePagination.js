import { jsxs, jsx } from 'react/jsx-runtime';
import { forwardRef } from 'react';
import Box from '@mui/material/Box';
import { Button } from './Button.js';
import { Dropdown } from './Dropdown.js';
import { TABLE_PAGINATION_SIZE } from '../shared/controlSize.js';

function defaultLabelDisplayedRows({
  from,
  to,
  count
}) {
  return `${from}-${to} of ${count !== -1 ? count : `more than ${to}`}`;
}
function optionValue(option) {
  return typeof option === "number" ? option : option.value;
}
function optionLabel(option) {
  return typeof option === "number" ? String(option) : option.label;
}
const TablePagination = forwardRef(
  function TablePagination2({
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
    className
  }, ref) {
    const dims = TABLE_PAGINATION_SIZE[size];
    const from = count === 0 ? 0 : page * rowsPerPage + 1;
    const to = count === -1 ? (page + 1) * rowsPerPage : Math.min(count, (page + 1) * rowsPerPage);
    const lastPage = count === -1 ? page + 1 : Math.max(0, Math.ceil(count / rowsPerPage) - 1);
    const atFirst = page <= 0;
    const atLast = count !== -1 && page >= lastPage;
    const dropdownOptions = rowsPerPageOptions.map((option) => ({
      value: String(optionValue(option)),
      label: optionLabel(option)
    }));
    return /* @__PURE__ */ jsxs(
      Box,
      {
        ref,
        role: "navigation",
        "aria-label": ariaLabel ?? "Table pagination",
        className,
        sx: {
          display: "inline-flex",
          flexDirection: "row",
          alignItems: "center",
          gap: dims.groupGap,
          height: dims.height,
          "@media (max-width: 760px)": {
            flexDirection: "column",
            alignItems: "flex-start",
            gap: dims.mobileGroupGap,
            height: "auto"
          }
        },
        children: [
          /* @__PURE__ */ jsxs(
            "div",
            {
              style: {
                display: "inline-flex",
                alignItems: "center",
                gap: dims.clusterGap,
                height: dims.height
              },
              children: [
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    style: {
                      fontFamily: "var(--font-body)",
                      fontWeight: 400,
                      fontSize: dims.fontSize,
                      lineHeight: dims.lineHeight,
                      color: "var(--text-neutral-tertiary)",
                      whiteSpace: "nowrap"
                    },
                    children: labelRowsPerPage
                  }
                ),
                /* @__PURE__ */ jsx(
                  Dropdown,
                  {
                    role: "input",
                    size,
                    color: "secondary",
                    width: "hug",
                    menuWidth: "trigger",
                    labelStyle: "thick",
                    value: String(rowsPerPage),
                    options: dropdownOptions,
                    disabled,
                    "aria-label": `${typeof labelRowsPerPage === "string" ? labelRowsPerPage : "Rows per page"}: ${rowsPerPage}`,
                    onChange: (value) => {
                      if (!onRowsPerPageChange) return;
                      const next = Array.isArray(value) ? value[0] : value;
                      if (next == null) return;
                      const event = {
                        target: { value: next }
                      };
                      onRowsPerPageChange(event);
                    }
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            Box,
            {
              "aria-hidden": true,
              sx: {
                width: "1px",
                height: dims.dividerHeight,
                backgroundColor: "var(--border-neutral-primary)",
                flexShrink: 0,
                alignSelf: "center",
                "@media (max-width: 760px)": {
                  display: "none"
                }
              }
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              style: {
                display: "inline-flex",
                alignItems: "center",
                gap: dims.clusterGap,
                height: dims.height
              },
              children: [
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "outlined",
                    color: "secondary",
                    size,
                    iconOnly: true,
                    startIconName: "chevron-left",
                    "aria-label": "Go to previous page",
                    disabled: disabled || atFirst,
                    onClick: (event) => {
                      onPageChange(event, page - 1);
                    }
                  }
                ),
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    style: {
                      fontFamily: "var(--font-body)",
                      fontWeight: 400,
                      fontSize: dims.fontSize,
                      lineHeight: dims.lineHeight,
                      color: "var(--text-neutral-tertiary)",
                      whiteSpace: "nowrap"
                    },
                    children: labelDisplayedRows({ from, to, count, page })
                  }
                ),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    variant: "outlined",
                    color: "secondary",
                    size,
                    iconOnly: true,
                    startIconName: "chevron-right",
                    "aria-label": "Go to next page",
                    disabled: disabled || atLast,
                    onClick: (event) => {
                      onPageChange(event, page + 1);
                    }
                  }
                )
              ]
            }
          )
        ]
      }
    );
  }
);

export { TablePagination };
//# sourceMappingURL=TablePagination.js.map
//# sourceMappingURL=TablePagination.js.map