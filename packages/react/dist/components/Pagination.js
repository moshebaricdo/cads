import { jsxs, jsx } from 'react/jsx-runtime';
import MuiPagination from '@mui/material/Pagination';
import ButtonBase from '@mui/material/ButtonBase';
import { forwardRef, useRef, useState, useLayoutEffect } from 'react';
import { Button } from './Button.js';
import { FaIcon } from '../icons/FaIcon.js';
import { SEGMENTED_SIZE, TABLE_PAGINATION_SIZE, TRANSITION_COLORS } from '../shared/controlSize.js';

function defaultLabelCompactPages({ page, count }) {
  return `Page ${page} of ${count}`;
}
function isNavType(type) {
  return type === "first" || type === "previous" || type === "next" || type === "last";
}
function isEllipsisType(type) {
  return type === "start-ellipsis" || type === "end-ellipsis";
}
function itemIconName(type) {
  switch (type) {
    case "first":
      return "backward-step";
    case "previous":
      return "chevron-left";
    case "next":
      return "chevron-right";
    case "last":
      return "forward-step";
    default:
      return "ellipsis";
  }
}
const Pagination = forwardRef(
  function Pagination2({
    size = "medium",
    layout = "auto",
    labelCompactPages = defaultLabelCompactPages,
    showFirstButton = true,
    showLastButton = true,
    siblingCount = 1,
    boundaryCount = 1,
    disabled = false,
    count = 1,
    page: pageProp,
    defaultPage = 1,
    onChange,
    ...rest
  }, ref) {
    const dims = SEGMENTED_SIZE[size];
    const clusterDims = TABLE_PAGINATION_SIZE[size];
    const rootRef = useRef(null);
    const measureRef = useRef(null);
    const segmentedWidthRef = useRef(0);
    const [autoCompact, setAutoCompact] = useState(false);
    const [uncontrolledPage, setUncontrolledPage] = useState(defaultPage);
    const page = pageProp ?? uncontrolledPage;
    const showCompact = layout === "compact" || layout === "auto" && autoCompact;
    const setRootRef = (node) => {
      rootRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };
    const handleChange = (event, value) => {
      if (pageProp === void 0) setUncontrolledPage(value);
      onChange?.(event, value);
    };
    useLayoutEffect(() => {
      if (layout !== "auto") {
        setAutoCompact(layout === "compact");
        return;
      }
      const root = rootRef.current;
      if (!root) return;
      const measure = () => {
        const available = root.clientWidth;
        if (available <= 0) return;
        if (!showCompact) {
          const ul = root.querySelector(
            ".MuiPagination-ul"
          );
          if (ul) {
            segmentedWidthRef.current = ul.scrollWidth;
            if (ul.scrollWidth > available + 1) setAutoCompact(true);
          }
          return;
        }
        const measureEl = measureRef.current;
        if (measureEl) {
          const needed = measureEl.scrollWidth;
          segmentedWidthRef.current = needed;
          if (needed > 0 && needed <= available) setAutoCompact(false);
          return;
        }
        if (segmentedWidthRef.current > 0 && available >= segmentedWidthRef.current) {
          setAutoCompact(false);
        }
      };
      const ro = new ResizeObserver(measure);
      ro.observe(root);
      measure();
      return () => ro.disconnect();
    }, [
      layout,
      showCompact,
      size,
      count,
      page,
      siblingCount,
      boundaryCount,
      showFirstButton,
      showLastButton,
      disabled
    ]);
    const renderItem = (item) => {
      const nav = isNavType(item.type);
      const ellipsis = isEllipsisType(item.type);
      const selected = Boolean(item.selected);
      const isDisabled = Boolean(disabled || item.disabled);
      const iconOnly = nav || ellipsis;
      let children = item.page;
      if (iconOnly) {
        children = /* @__PURE__ */ jsx(FaIcon, { name: itemIconName(item.type), fontSize: dims.iconPx });
      }
      const disabledUnselected = {
        backgroundColor: "transparent",
        borderColor: "var(--border-disabled-neutral)",
        color: "var(--text-disabled-neutral)"
      };
      const disabledSelected = {
        backgroundColor: "var(--background-disabled-neutral)",
        borderColor: "var(--border-disabled-neutral)",
        color: "var(--text-disabled-neutral-inverse)"
      };
      if (ellipsis) {
        const ellipsisStyle = {
          boxSizing: "border-box",
          margin: 0,
          marginLeft: -1,
          minWidth: dims.height,
          width: dims.height,
          height: dims.height,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 0,
          zIndex: 0,
          ...isDisabled ? {
            border: "1px solid var(--border-disabled-neutral)",
            backgroundColor: "transparent",
            color: "var(--text-disabled-neutral)"
          } : {
            border: "1px solid var(--border-neutral-secondary)",
            backgroundColor: "var(--background-neutral-primary)",
            color: "var(--text-neutral-primary)"
          }
        };
        return /* @__PURE__ */ jsx(
          "div",
          {
            className: "CadsPagination-item CadsPagination-ellipsis",
            "aria-hidden": true,
            style: ellipsisStyle,
            children: /* @__PURE__ */ jsx(FaIcon, { name: "ellipsis", fontSize: dims.iconPx })
          }
        );
      }
      const sx = {
        boxSizing: "border-box",
        margin: 0,
        marginLeft: "-1px",
        minWidth: dims.height,
        width: iconOnly ? dims.height : void 0,
        height: dims.height,
        paddingInline: iconOnly ? dims.iconOnlyPadding : dims.paddingInline,
        paddingBlock: iconOnly ? dims.iconOnlyPadding : dims.paddingBlock,
        borderRadius: 0,
        border: "1px solid",
        borderColor: selected ? "var(--border-selected-primary)" : "var(--border-neutral-secondary)",
        backgroundColor: selected ? "var(--background-selected-primary)" : nav ? "var(--background-neutral-secondary)" : "var(--background-neutral-primary)",
        color: selected ? "var(--text-selected-primary)" : nav ? "var(--text-neutral-quaternary)" : "var(--text-neutral-primary)",
        fontFamily: "var(--font-body)",
        fontWeight: "var(--font-weight-semibold)",
        fontSize: dims.fontSize,
        lineHeight: dims.lineHeight,
        textTransform: "none",
        transition: TRANSITION_COLORS,
        zIndex: selected ? 1 : 0,
        ...isDisabled ? selected ? disabledSelected : disabledUnselected : null,
        "&:hover": isDisabled ? {} : {
          zIndex: 2,
          backgroundColor: selected ? "var(--background-selected-primary)" : "var(--background-neutral-tertiary)",
          borderColor: selected ? "var(--border-selected-strong)" : "var(--border-neutral-secondary)"
        },
        "&:active": isDisabled ? {} : {
          zIndex: 2,
          backgroundColor: selected ? "var(--background-selected-strong)" : "var(--background-neutral-tertiary)",
          borderColor: selected ? "var(--border-selected-strong)" : "var(--border-neutral-secondary)",
          /* Match Segmented Button Block: unselected press softens primary label/icon. */
          ...!selected && !nav ? { color: "var(--text-neutral-tertiary)" } : null
        },
        "&.Mui-focusVisible": isDisabled ? {} : {
          zIndex: 3,
          outline: `2px solid ${selected ? "var(--border-focused-inverse)" : "var(--border-focused-primary)"}`,
          outlineOffset: -2,
          backgroundColor: selected ? "var(--background-selected-primary)" : "var(--background-brand-light)"
        },
        "&.Mui-disabled": {
          opacity: 1,
          ...selected ? disabledSelected : disabledUnselected
        }
      };
      return /* @__PURE__ */ jsx(
        ButtonBase,
        {
          className: "CadsPagination-item",
          centerRipple: false,
          disableRipple: true,
          focusRipple: false,
          disabled: isDisabled,
          onClick: item.onClick,
          "aria-label": item["aria-label"],
          "aria-current": selected ? "page" : void 0,
          sx,
          children
        }
      );
    };
    const segmentedUlSx = {
      display: "inline-flex",
      flexWrap: "nowrap",
      alignItems: "stretch",
      gap: 0,
      padding: 0,
      margin: 0,
      listStyle: "none",
      overflowY: "hidden",
      borderRadius: "var(--radius-sm)",
      scrollbarWidth: "thin"
    };
    const segmentedSx = {
      display: "inline-flex",
      ...layout === "segmented" ? { maxWidth: "100%" } : null,
      verticalAlign: "middle",
      "& .MuiPagination-ul": {
        ...segmentedUlSx,
        overflowX: layout === "segmented" ? "auto" : "visible",
        ...layout === "segmented" ? { maxWidth: "100%" } : null
      },
      "& .MuiPagination-ul > li": {
        display: "flex",
        margin: 0,
        padding: 0,
        flexShrink: 0
      },
      "& .MuiPagination-ul > li:first-of-type .CadsPagination-item": {
        marginLeft: "0 !important",
        borderTopLeftRadius: "var(--radius-sm)",
        borderBottomLeftRadius: "var(--radius-sm)"
      },
      "& .MuiPagination-ul > li:last-of-type .CadsPagination-item": {
        borderTopRightRadius: "var(--radius-sm)",
        borderBottomRightRadius: "var(--radius-sm)"
      }
    };
    const measureSx = {
      display: "inline-flex",
      "& .MuiPagination-ul": {
        ...segmentedUlSx,
        overflowX: "visible"
      },
      "& .MuiPagination-ul > li": segmentedSx["& .MuiPagination-ul > li"],
      "& .MuiPagination-ul > li:first-of-type .CadsPagination-item": segmentedSx["& .MuiPagination-ul > li:first-of-type .CadsPagination-item"],
      "& .MuiPagination-ul > li:last-of-type .CadsPagination-item": segmentedSx["& .MuiPagination-ul > li:last-of-type .CadsPagination-item"]
    };
    const sharedPaginationProps = {
      disabled,
      count,
      page,
      onChange: handleChange,
      showFirstButton,
      showLastButton,
      siblingCount,
      boundaryCount,
      renderItem,
      ...rest
    };
    const compactCluster = /* @__PURE__ */ jsxs(
      "div",
      {
        role: "navigation",
        "aria-label": rest["aria-label"] ?? "Pagination",
        style: {
          display: "inline-flex",
          alignItems: "center",
          gap: clusterDims.clusterGap,
          height: clusterDims.height
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
              disabled: disabled || page <= 1,
              onClick: (event) => {
                handleChange(event, page - 1);
              }
            }
          ),
          /* @__PURE__ */ jsx(
            "span",
            {
              style: {
                fontFamily: "var(--font-body)",
                fontWeight: 400,
                fontSize: clusterDims.fontSize,
                lineHeight: clusterDims.lineHeight,
                color: "var(--text-neutral-tertiary)",
                whiteSpace: "nowrap"
              },
              children: labelCompactPages({ page, count })
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
              disabled: disabled || page >= count,
              onClick: (event) => {
                handleChange(event, page + 1);
              }
            }
          )
        ]
      }
    );
    return /* @__PURE__ */ jsxs(
      "div",
      {
        ref: setRootRef,
        className: "CadsPagination-root",
        style: {
          /* Full width so layout=auto can measure the parent; center the
             hug-sized segmented/compact control inside that measure box. */
          display: "flex",
          justifyContent: "center",
          width: "100%",
          maxWidth: "100%",
          position: "relative"
        },
        children: [
          layout === "auto" && showCompact ? /* @__PURE__ */ jsx(
            "div",
            {
              "aria-hidden": true,
              style: {
                position: "absolute",
                visibility: "hidden",
                pointerEvents: "none",
                height: 0,
                overflow: "hidden",
                whiteSpace: "nowrap"
              },
              children: /* @__PURE__ */ jsx("div", { ref: measureRef, style: { display: "inline-flex" }, children: /* @__PURE__ */ jsx(MuiPagination, { ...sharedPaginationProps, sx: measureSx }) })
            }
          ) : null,
          showCompact ? compactCluster : /* @__PURE__ */ jsx(MuiPagination, { ...sharedPaginationProps, sx: segmentedSx })
        ]
      }
    );
  }
);

export { Pagination };
//# sourceMappingURL=Pagination.js.map
//# sourceMappingURL=Pagination.js.map