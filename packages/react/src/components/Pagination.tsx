import MuiPagination, {
  type PaginationProps as MuiPaginationProps,
  type PaginationRenderItemParams,
} from "@mui/material/Pagination";
import ButtonBase from "@mui/material/ButtonBase";
import {
  forwardRef,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Button } from "./Button";
import { FaIcon } from "../icons/FaIcon";
import {
  SEGMENTED_SIZE,
  TABLE_PAGINATION_SIZE,
  TRANSITION_COLORS,
  type ControlSize,
} from "../shared/controlSize";

export type PaginationSize = ControlSize;

/** How the control adapts when space is tight. */
export type PaginationLayout = "auto" | "segmented" | "compact";

export interface LabelCompactPagesArgs {
  page: number;
  count: number;
}

export interface PaginationProps
  extends Omit<MuiPaginationProps, "size" | "color" | "variant" | "shape"> {
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

function defaultLabelCompactPages({ page, count }: LabelCompactPagesArgs) {
  return `Page ${page} of ${count}`;
}

function isNavType(type: PaginationRenderItemParams["type"]) {
  return (
    type === "first" ||
    type === "previous" ||
    type === "next" ||
    type === "last"
  );
}

function isEllipsisType(type: PaginationRenderItemParams["type"]) {
  return type === "start-ellipsis" || type === "end-ellipsis";
}

function itemIconName(type: PaginationRenderItemParams["type"]) {
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
export const Pagination = forwardRef<HTMLDivElement, PaginationProps>(
  function Pagination(
    {
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
    },
    ref,
  ) {
    const dims = SEGMENTED_SIZE[size];
    const clusterDims = TABLE_PAGINATION_SIZE[size];
    const rootRef = useRef<HTMLDivElement | null>(null);
    const measureRef = useRef<HTMLDivElement | null>(null);
    const segmentedWidthRef = useRef(0);
    const [autoCompact, setAutoCompact] = useState(false);

    const [uncontrolledPage, setUncontrolledPage] = useState(defaultPage);
    const page = pageProp ?? uncontrolledPage;
    const showCompact =
      layout === "compact" || (layout === "auto" && autoCompact);

    const setRootRef = (node: HTMLDivElement | null) => {
      rootRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };

    const handleChange = (event: ChangeEvent<unknown>, value: number) => {
      if (pageProp === undefined) setUncontrolledPage(value);
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
            ".MuiPagination-ul",
          ) as HTMLElement | null;
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

        if (
          segmentedWidthRef.current > 0 &&
          available >= segmentedWidthRef.current
        ) {
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
      disabled,
    ]);

    const renderItem = (item: PaginationRenderItemParams) => {
      const nav = isNavType(item.type);
      const ellipsis = isEllipsisType(item.type);
      const selected = Boolean(item.selected);
      const isDisabled = Boolean(disabled || item.disabled);
      const iconOnly = nav || ellipsis;

      let children: ReactNode = item.page;
      if (iconOnly) {
        children = (
          <FaIcon name={itemIconName(item.type)} fontSize={dims.iconPx} />
        );
      }

      /* Figma state=disabled: unselected = no fill + disabled chrome;
         selected-disabled = disabled neutral fill + inverse text. */
      const disabledUnselected = {
        backgroundColor: "transparent",
        borderColor: "var(--border-disabled-neutral)",
        color: "var(--text-disabled-neutral)",
      } as const;
      const disabledSelected = {
        backgroundColor: "var(--background-disabled-neutral)",
        borderColor: "var(--border-disabled-neutral)",
        color: "var(--text-disabled-neutral-inverse)",
      } as const;

      if (ellipsis) {
        const ellipsisStyle: CSSProperties = {
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
          ...(isDisabled
            ? {
                border: "1px solid var(--border-disabled-neutral)",
                backgroundColor: "transparent",
                color: "var(--text-disabled-neutral)",
              }
            : {
                border: "1px solid var(--border-neutral-secondary)",
                backgroundColor: "var(--background-neutral-primary)",
                color: "var(--text-neutral-primary)",
              }),
        };
        return (
          <div
            className="CadsPagination-item CadsPagination-ellipsis"
            aria-hidden
            style={ellipsisStyle}
          >
            <FaIcon name="ellipsis" fontSize={dims.iconPx} />
          </div>
        );
      }

      const sx = {
        boxSizing: "border-box" as const,
        margin: 0,
        marginLeft: "-1px",
        minWidth: dims.height,
        width: iconOnly ? dims.height : undefined,
        height: dims.height,
        paddingInline: iconOnly ? dims.iconOnlyPadding : dims.paddingInline,
        paddingBlock: iconOnly ? dims.iconOnlyPadding : dims.paddingBlock,
        borderRadius: 0,
        border: "1px solid",
        borderColor: selected
          ? "var(--border-selected-primary)"
          : "var(--border-neutral-secondary)",
        backgroundColor: selected
          ? "var(--background-selected-primary)"
          : nav
            ? "var(--background-neutral-secondary)"
            : "var(--background-neutral-primary)",
        color: selected
          ? "var(--text-selected-primary)"
          : nav
            ? "var(--text-neutral-quaternary)"
            : "var(--text-neutral-primary)",
        fontFamily: "var(--font-body)",
        fontWeight: "var(--font-weight-semibold)",
        fontSize: dims.fontSize,
        lineHeight: dims.lineHeight,
        textTransform: "none" as const,
        transition: TRANSITION_COLORS,
        zIndex: selected ? 1 : 0,
        ...(isDisabled
          ? selected
            ? disabledSelected
            : disabledUnselected
          : null),
        "&:hover": isDisabled
          ? {}
          : {
              zIndex: 2,
              backgroundColor: selected
                ? "var(--background-selected-primary)"
                : "var(--background-neutral-tertiary)",
              borderColor: selected
                ? "var(--border-selected-strong)"
                : "var(--border-neutral-secondary)",
            },
        "&:active": isDisabled
          ? {}
          : {
              zIndex: 2,
              backgroundColor: selected
                ? "var(--background-selected-strong)"
                : "var(--background-neutral-tertiary)",
              borderColor: selected
                ? "var(--border-selected-strong)"
                : "var(--border-neutral-secondary)",
            },
        "&.Mui-focusVisible": isDisabled
          ? {}
          : {
              zIndex: 3,
              outline: `2px solid ${
                selected
                  ? "var(--border-focused-inverse)"
                  : "var(--border-focused-primary)"
              }`,
              outlineOffset: -2,
              backgroundColor: selected
                ? "var(--background-selected-primary)"
                : "var(--background-brand-light)",
            },
        "&.Mui-disabled": {
          opacity: 1,
          ...(selected ? disabledSelected : disabledUnselected),
        },
      };

      return (
        <ButtonBase
          className="CadsPagination-item"
          centerRipple={false}
          disableRipple
          focusRipple={false}
          disabled={isDisabled}
          onClick={item.onClick}
          aria-label={
            (item as PaginationRenderItemParams & { "aria-label"?: string })[
              "aria-label"
            ]
          }
          aria-current={selected ? ("page" as const) : undefined}
          sx={sx}
        >
          {children}
        </ButtonBase>
      );
    };

    const segmentedUlSx = {
      display: "inline-flex",
      flexWrap: "nowrap" as const,
      alignItems: "stretch",
      gap: 0,
      padding: 0,
      margin: 0,
      listStyle: "none",
      overflowY: "hidden" as const,
      borderRadius: "var(--radius-sm)",
      scrollbarWidth: "thin" as const,
    };

    const segmentedSx = {
      display: "inline-flex",
      ...(layout === "segmented" ? { maxWidth: "100%" } : null),
      verticalAlign: "middle",
      "& .MuiPagination-ul": {
        ...segmentedUlSx,
        overflowX:
          layout === "segmented" ? ("auto" as const) : ("visible" as const),
        ...(layout === "segmented" ? { maxWidth: "100%" } : null),
      },
      "& .MuiPagination-ul > li": {
        display: "flex",
        margin: 0,
        padding: 0,
        flexShrink: 0,
      },
      "& .MuiPagination-ul > li:first-of-type .CadsPagination-item": {
        marginLeft: "0 !important",
        borderTopLeftRadius: "var(--radius-sm)",
        borderBottomLeftRadius: "var(--radius-sm)",
      },
      "& .MuiPagination-ul > li:last-of-type .CadsPagination-item": {
        borderTopRightRadius: "var(--radius-sm)",
        borderBottomRightRadius: "var(--radius-sm)",
      },
    };

    const measureSx = {
      display: "inline-flex",
      "& .MuiPagination-ul": {
        ...segmentedUlSx,
        overflowX: "visible" as const,
      },
      "& .MuiPagination-ul > li": segmentedSx["& .MuiPagination-ul > li"],
      "& .MuiPagination-ul > li:first-of-type .CadsPagination-item":
        segmentedSx["& .MuiPagination-ul > li:first-of-type .CadsPagination-item"],
      "& .MuiPagination-ul > li:last-of-type .CadsPagination-item":
        segmentedSx["& .MuiPagination-ul > li:last-of-type .CadsPagination-item"],
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
      ...rest,
    };

    const compactCluster = (
      <div
        role="navigation"
        aria-label={
          (rest["aria-label"] as string | undefined) ?? "Pagination"
        }
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: clusterDims.clusterGap,
          height: clusterDims.height,
        }}
      >
        <Button
          variant="outlined"
          color="secondary"
          size={size}
          iconOnly
          startIconName="chevron-left"
          aria-label="Go to previous page"
          disabled={disabled || page <= 1}
          onClick={(event) => {
            handleChange(event as unknown as ChangeEvent<unknown>, page - 1);
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 400,
            fontSize: clusterDims.fontSize,
            lineHeight: clusterDims.lineHeight,
            color: "var(--text-neutral-tertiary)",
            whiteSpace: "nowrap",
          }}
        >
          {labelCompactPages({ page, count })}
        </span>
        <Button
          variant="outlined"
          color="secondary"
          size={size}
          iconOnly
          startIconName="chevron-right"
          aria-label="Go to next page"
          disabled={disabled || page >= count}
          onClick={(event) => {
            handleChange(event as unknown as ChangeEvent<unknown>, page + 1);
          }}
        />
      </div>
    );

    return (
      <div
        ref={setRootRef}
        className="CadsPagination-root"
        style={{
          /* Full width so layout=auto can measure the parent; center the
             hug-sized segmented/compact control inside that measure box. */
          display: "flex",
          justifyContent: "center",
          width: "100%",
          maxWidth: "100%",
          position: "relative",
        }}
      >
        {layout === "auto" && showCompact ? (
          <div
            aria-hidden
            style={{
              position: "absolute",
              visibility: "hidden",
              pointerEvents: "none",
              height: 0,
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            <div ref={measureRef} style={{ display: "inline-flex" }}>
              <MuiPagination {...sharedPaginationProps} sx={measureSx} />
            </div>
          </div>
        ) : null}

        {showCompact ? (
          compactCluster
        ) : (
          <MuiPagination {...sharedPaginationProps} sx={segmentedSx} />
        )}
      </div>
    );
  },
);
