import ClickAwayListener from "@mui/material/ClickAwayListener";
import Popper from "@mui/material/Popper";
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
  type SyntheticEvent,
} from "react";
import { Button } from "../button/index";
import { FieldWrapper, type FieldSentiment } from "../field-wrapper/index";
import { FaIcon } from "../../icons/FaIcon";
import type { FaIconName } from "../../icons/faProRegularCodepoints";
import {
  BUTTON_SIZE,
  CONTROL_HEIGHT,
  TEXT_INPUT_SIZE,
  type ControlSize,
} from "../../shared/controlSize";
import {
  experimentalMotionHostAttrs,
  surfaceMotionStateAttrs,
  useExperimentalMotion,
  useSurfacePresence,
} from "../../theme/experimentalMotion";
import styles from "./dropdown.module.scss";
import type {
  DropdownActionProps,
  DropdownColor,
  DropdownFieldWidth,
  DropdownInputProps,
  DropdownItemOption,
  DropdownLabelStyle,
  DropdownMenuPlacement,
  DropdownMenuType,
  DropdownMenuWidth,
  DropdownOption,
  DropdownProps,
  DropdownRole,
  DropdownSize,
} from "./types";

export type {
  DropdownProps,
  DropdownInputProps,
  DropdownActionProps,
  DropdownOption,
  DropdownItemOption,
  DropdownSeparatorOption,
  DropdownGroupOption,
  DropdownSize,
  DropdownRole,
  DropdownMenuType,
  DropdownMenuPlacement,
  DropdownLabelStyle,
  DropdownColor,
  DropdownFieldWidth,
  DropdownMenuWidth,
} from "./types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

function isItemOption(option: DropdownOption): option is DropdownItemOption {
  return option.type !== "separator" && option.type !== "group";
}

function isSelectableOption(
  option: DropdownOption,
): option is DropdownItemOption {
  return isItemOption(option) && !option.disabled;
}

function resolveInputWidth(width: DropdownFieldWidth = "hug"): {
  rootWidth: CSSProperties["width"];
  triggerWidth: CSSProperties["width"];
  maxWidth?: CSSProperties["maxWidth"];
} {
  if (width === "hug") {
    return {
      rootWidth: "max-content",
      triggerWidth: "auto",
      maxWidth: "100%",
    };
  }
  if (width === "full") {
    return { rootWidth: "100%", triggerWidth: "100%" };
  }
  const resolved = typeof width === "number" ? `${width}px` : width;
  return {
    rootWidth: resolved,
    triggerWidth: "100%",
    maxWidth: "100%",
  };
}

function resolveMenuPanelWidth(
  menuWidth: DropdownMenuWidth = "hug",
  triggerWidthPx: number,
): { width: CSSProperties["width"]; minWidth: CSSProperties["minWidth"] } {
  if (menuWidth === "trigger") {
    const px = Math.max(0, triggerWidthPx);
    return { width: px, minWidth: px };
  }
  if (typeof menuWidth === "number") {
    const min = Math.max(menuWidth, triggerWidthPx);
    return { width: "max-content", minWidth: min };
  }
  if (menuWidth.endsWith("%")) {
    const ratio = Number.parseFloat(menuWidth) / 100;
    const px = Math.max(0, triggerWidthPx * ratio);
    return { width: px, minWidth: px };
  }
  return {
    width: "max-content",
    minWidth: Math.max(0, triggerWidthPx) || "max-content",
  };
}

function placementToPopper(
  placement: DropdownMenuPlacement,
): "bottom-start" | "bottom-end" | "top-start" | "top-end" {
  switch (placement) {
    case "bottomRight":
      return "bottom-end";
    case "topLeft":
      return "top-start";
    case "topRight":
      return "top-end";
    case "bottomLeft":
    default:
      return "bottom-start";
  }
}

/** Grow the Surface recipe from the corner that stays pinned to the trigger. */
function placementToSurfaceOrigin(placement: DropdownMenuPlacement): string {
  switch (placement) {
    case "bottomRight":
      return "top right";
    case "topLeft":
      return "bottom left";
    case "topRight":
      return "bottom right";
    case "bottomLeft":
    default:
      return "top left";
  }
}

/**
 * Popper anchor that ignores press-scale on the trigger.
 * `getBoundingClientRect` includes transforms; a releasing `:active` scale
 * otherwise shoves the menu ~1–2px as the button eases back to 1.
 * Reconstruct the unscaled border box (uniform scale about center).
 */
function createLayoutStableAnchor(el: HTMLElement): {
  getBoundingClientRect: () => DOMRect;
  contextElement: HTMLElement;
} {
  return {
    contextElement: el,
    getBoundingClientRect: () => {
      const visual = el.getBoundingClientRect();
      const width = el.offsetWidth;
      const height = el.offsetHeight;
      const left = visual.left - (width - visual.width) / 2;
      const top = visual.top - (height - visual.height) / 2;
      return new DOMRect(left, top, width, height);
    },
  };
}

function asArray(value: string | string[] | undefined): string[] {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

// ---------------------------------------------------------------------------
// Size look-ups
// ---------------------------------------------------------------------------

/** Menu Item geometry from Figma `896:3791` (not Button padding). */
const MENU_ITEM_SIZE: Record<
  ControlSize,
  {
    height: string;
    paddingLeft: string;
    paddingRight: string;
    paddingBlock: string;
    gap: string;
    fontSize: string;
    lineHeight: string;
    iconSlot: string;
    iconPx: string;
    checkbox: number;
  }
> = {
  // Gaps / padding / iconPx match Figma `896:3791` (icon = body textSize).
  large: {
    height: CONTROL_HEIGHT.large,
    paddingLeft: "1rem", // 16
    paddingRight: "1.125rem", // 18
    paddingBlock: "0.625rem", // 10
    gap: "0.625rem", // 10
    fontSize: "var(--text-body-lg)",
    lineHeight: "var(--leading-body-lg)",
    iconSlot: "1.25rem", // 20
    iconPx: "1.125rem", // 18
    checkbox: 22,
  },
  medium: {
    height: CONTROL_HEIGHT.medium,
    paddingLeft: "0.75rem", // 12
    paddingRight: "0.875rem", // 14
    paddingBlock: "0.5rem", // 8
    gap: "0.5rem", // 8
    fontSize: "var(--text-body-md)",
    lineHeight: "var(--leading-body-md)",
    iconSlot: "1.125rem", // 18
    iconPx: "1rem", // 16
    checkbox: 20,
  },
  small: {
    height: CONTROL_HEIGHT.small,
    paddingLeft: "0.625rem", // 10
    paddingRight: "0.75rem", // 12
    paddingBlock: "0.3125rem", // 5
    gap: "0.375rem", // 6
    fontSize: "var(--text-body-sm)",
    lineHeight: "var(--leading-body-sm)",
    iconSlot: "1rem", // 16
    iconPx: "0.875rem", // 14
    checkbox: 18,
  },
  extraSmall: {
    height: CONTROL_HEIGHT.extraSmall,
    paddingLeft: "0.5rem", // 8
    paddingRight: "0.625rem", // 10
    paddingBlock: "0.125rem", // 2
    gap: "0.25rem", // 4
    fontSize: "var(--text-body-xs)",
    lineHeight: "var(--leading-body-xs)",
    iconSlot: "0.875rem", // 14
    iconPx: "0.75rem", // 12
    checkbox: 16,
  },
};

/** Optgroup label geometry from Figma menuOptGroup `16847:69853`. */
const MENU_GROUP_SIZE: Record<
  ControlSize,
  {
    height: number;
    paddingLeft: string;
    paddingRight: string;
    fontSize: string;
    lineHeight: string;
  }
> = {
  large: {
    height: 32,
    paddingLeft: "1rem",
    paddingRight: "1.125rem", // 18 — match menu item
    fontSize: "var(--text-body-sm)",
    lineHeight: "var(--leading-body-sm)",
  },
  medium: {
    height: 28,
    paddingLeft: "0.75rem",
    paddingRight: "0.875rem", // 14 — match menu item
    fontSize: "var(--text-body-xs)",
    lineHeight: "var(--leading-body-xs)",
  },
  small: {
    height: 24,
    paddingLeft: "0.625rem",
    paddingRight: "0.75rem", // 12 — match menu item
    fontSize: "var(--text-body-xxs)",
    lineHeight: "var(--leading-body-xxs)",
  },
  extraSmall: {
    height: 20,
    paddingLeft: "0.5rem",
    paddingRight: "0.625rem", // 10 — match menu item
    fontSize: "var(--text-body-xxs)",
    lineHeight: "var(--leading-body-xxs)",
  },
};

// ---------------------------------------------------------------------------
// Trigger helpers
// ---------------------------------------------------------------------------

function triggerBorder(
  color: DropdownColor,
  error: boolean,
  disabled: boolean,
  readOnly: boolean,
) {
  if (disabled) return "var(--border-disabled-neutral)";
  if (error) return "var(--border-error-primary)";
  if (readOnly) return "var(--border-neutral-secondary)";
  return color === "secondary"
    ? "var(--border-neutral-secondary)"
    : "var(--border-neutral-solid)";
}

/**
 * Visible label + optional hug sizers. Hidden candidates reserve the widest
 * intrinsic width so selection changes do not resize the trigger.
 */
function TriggerLabel({
  label,
  hugCandidates,
}: {
  label: ReactNode;
  hugCandidates?: ReactNode[];
}) {
  const visible = (
    <span
      style={{
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        minWidth: 0,
      }}
    >
      {label}
    </span>
  );

  if (!hugCandidates?.length) return visible;

  return (
    <span
      style={{
        display: "inline-grid",
        alignItems: "center",
        justifyItems: "stretch",
        minWidth: 0,
      }}
    >
      {hugCandidates.map((candidate, index) => (
        <span
          key={index}
          aria-hidden
          style={{
            gridArea: "1 / 1",
            visibility: "hidden",
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          {candidate}
        </span>
      ))}
      <span
        style={{
          gridArea: "1 / 1",
          minWidth: 0,
          maxWidth: "100%",
          display: "block",
        }}
      >
        {visible}
      </span>
    </span>
  );
}

/** Internal Dropdown Button (role=input trigger). Not exported. */
function DropdownButtonTrigger({
  size,
  color,
  labelStyle,
  label,
  hugCandidates,
  startIconName,
  open,
  disabled,
  readOnly,
  error,
  required,
  onClick,
  buttonRef,
  id,
  listedBy,
  ariaLabel,
  triggerWidth,
}: {
  size: DropdownSize;
  color: DropdownColor;
  labelStyle: DropdownLabelStyle;
  label: ReactNode;
  hugCandidates?: ReactNode[];
  startIconName?: FaIconName | (string & {});
  open: boolean;
  disabled: boolean;
  readOnly: boolean;
  error: boolean;
  required?: boolean;
  onClick: () => void;
  buttonRef: (node: HTMLButtonElement | null) => void;
  id: string;
  listedBy?: string;
  ariaLabel?: string;
  triggerWidth: CSSProperties["width"];
}) {
  const dims = TEXT_INPUT_SIZE[size];
  const btnDims = BUTTON_SIZE[size];
  const border = triggerBorder(color, error, disabled, readOnly);
  const hug = Boolean(hugCandidates?.length);

  const chromeVars = {
    "--dd-height": dims.height,
    // Match Button / Figma Dropdown Button padding 16 / 14 / 12 / 8
    "--dd-px": btnDims.paddingInline,
    "--dd-py": dims.paddingBlock,
    "--dd-gap": btnDims.gap,
    "--dd-font-size": dims.fontSize,
    "--dd-line-height": dims.lineHeight,
    "--dd-font-weight": String(labelStyle === "thin" ? 400 : 600),
    "--dd-border": border,
    "--dd-bg": readOnly
      ? "var(--background-neutral-secondary)"
      : "var(--background-neutral-primary)",
    "--dd-fg": disabled
      ? "var(--text-disabled-neutral)"
      : readOnly
        ? "var(--text-neutral-quaternary)"
        : "var(--text-neutral-primary)",
    "--dd-cursor": disabled || readOnly ? "default" : "pointer",
    "--dd-trigger-width": triggerWidth,
  } as CSSProperties;

  return (
    <button
      ref={buttonRef}
      type="button"
      id={id}
      disabled={disabled || readOnly}
      aria-haspopup={listedBy ? "listbox" : "menu"}
      aria-expanded={open}
      aria-controls={listedBy}
      aria-required={required || undefined}
      aria-label={ariaLabel}
      onClick={onClick}
      data-cads-dropdown-trigger="input"
      {...(hug ? { "data-hug": "" } : {})}
      className={styles.trigger}
      style={chromeVars}
    >
      <span className={styles.triggerContent}>
        {startIconName ? (
          <FaIcon name={startIconName} fontSize={btnDims.iconPx} />
        ) : null}
        <TriggerLabel label={label} hugCandidates={hugCandidates} />
      </span>
      <FaIcon name="chevron-down" fontSize={btnDims.iconPx} />
    </button>
  );
}

// ---------------------------------------------------------------------------
// Menu sub-components
// ---------------------------------------------------------------------------

function MenuItemRow({
  option,
  size,
  selected,
  menuType,
  role,
  active,
  keyboardFocus,
  onSelect,
  onHighlight,
  id,
}: {
  option: DropdownItemOption;
  size: DropdownSize;
  selected: boolean;
  menuType: DropdownMenuType;
  role: DropdownRole;
  active: boolean;
  /** Keyboard highlight — Figma item `state=focus` (distinct from pointer hover). */
  keyboardFocus: boolean;
  onSelect: () => void;
  onHighlight: () => void;
  id: string;
}) {
  const dims = MENU_ITEM_SIZE[size];
  const destructive = Boolean(option.destructive) && role === "action";
  const isChecklist = menuType === "checklist";
  const showStartIcon = !isChecklist && Boolean(option.iconName);
  const useDisabledTokens = Boolean(option.disabled) && !isChecklist;
  const hasLeading = isChecklist || showStartIcon;

  const textColor = useDisabledTokens
    ? destructive
      ? "var(--text-disabled-error)"
      : selected
        ? "var(--text-disabled-neutral-inverse)"
        : "var(--text-disabled-neutral)"
    : destructive
      ? "var(--text-error-primary)"
      : selected
        ? "var(--text-selected-primary)"
        : "var(--text-neutral-primary)";

  const bg = useDisabledTokens
    ? selected
      ? "var(--background-disabled-neutral)"
      : "var(--background-neutral-primary)"
    : selected
      ? "var(--background-selected-primary)"
      : "var(--background-neutral-primary)";

  const itemVars = {
    "--dd-item-bg": bg,
    "--dd-item-fg": textColor,
    "--dd-item-cursor": option.disabled ? "default" : "pointer",
    "--dd-item-opacity": String(option.disabled && isChecklist ? 0.5 : 1),
    "--dd-item-height": dims.height,
  } as CSSProperties;

  return (
    <div
      id={id}
      role={role === "input" ? "option" : "menuitem"}
      aria-selected={role === "input" ? selected : undefined}
      aria-disabled={option.disabled || undefined}
      data-cads-dropdown-item=""
      data-value={option.value}
      data-destructive={destructive ? "true" : undefined}
      data-active={active ? "true" : undefined}
      data-keyboard-focus={keyboardFocus ? "true" : undefined}
      tabIndex={-1}
      onMouseDown={(e) => {
        e.preventDefault();
      }}
      onClick={(e) => {
        e.preventDefault();
        if (e.metaKey || e.ctrlKey) return;
        e.stopPropagation();
        if (!option.disabled) onSelect();
      }}
      onMouseEnter={() => {
        if (!option.disabled) onHighlight();
      }}
      className={styles.item}
      style={itemVars}
    >
      <span className={cx(styles.itemInner, hasLeading && styles.itemInnerGap)}>
        {menuType === "checklist" ? (
          <span
            aria-hidden
            className={cx(
              styles.checkbox,
              selected && styles.checkboxSelected,
            )}
          >
            {selected ? (
              <FaIcon
                name="check"
                fontSize={
                  size === "large"
                    ? "0.875rem"
                    : size === "extraSmall"
                      ? "0.625rem"
                      : "0.75rem"
                }
              />
            ) : null}
          </span>
        ) : showStartIcon ? (
          <span aria-hidden className={styles.iconSlot}>
            <FaIcon name={option.iconName!} fontSize={dims.iconPx} />
          </span>
        ) : null}
        <span className={styles.itemLabel}>{option.label}</span>
      </span>
    </div>
  );
}

function MenuSeparatorRow() {
  return (
    <div
      role="separator"
      aria-hidden
      data-cads-dropdown-separator=""
      className={styles.separator}
    >
      <div className={styles.separatorLine} />
    </div>
  );
}

function MenuGroupRow({ label }: { label: ReactNode }) {
  return (
    <div
      role="presentation"
      data-cads-dropdown-group=""
      className={styles.group}
    >
      <span className={styles.groupLabel}>{label}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Dropdown
// ---------------------------------------------------------------------------

/**
 * CADS Dropdown — form select (input) or action menu.
 * Spec: `15857:100676` / key `d3660d988bcb4702c24ce921128e32cadb6618db`.
 * Internal: Dropdown Button `964:10677`, Menu List `971:4280`, Menu Item `896:3791`,
 * menuSeparator `16847:69841`, menuOptGroup `16847:69853`.
 */
export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  function Dropdown(props, ref) {
    const {
      size = "medium",
      menuType = "default",
      menuPlacement = "bottomLeft",
      menuWidth = "hug",
      options,
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      disabled = false,
      disablePortal = false,
      className,
      style,
      "aria-label": ariaLabel,
    } = props;

    const isInput = props.role === "input";
    const reactId = useId();
    const listId = `cads-dropdown-list-${reactId}`;
    const triggerId = `cads-dropdown-trigger-${reactId}`;

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const anchorRef = useRef<HTMLButtonElement | null>(null);
    const setAnchor = useCallback((node: HTMLButtonElement | null) => {
      if (!node) return;
      anchorRef.current = node;
      setAnchorEl((prev) => (prev === node ? prev : node));
    }, []);
    const popperAnchor = useMemo(
      () => (anchorEl ? createLayoutStableAnchor(anchorEl) : null),
      [anchorEl],
    );

    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
    const open = openProp ?? uncontrolledOpen;
    const experimentalMotion = useExperimentalMotion();
    const {
      mounted: surfaceMounted,
      exiting: surfaceExiting,
      entering: surfaceEntering,
    } = useSurfacePresence(open && Boolean(anchorEl));

    useLayoutEffect(() => {
      if (!open) return;
      const node =
        anchorRef.current ??
        (document.getElementById(triggerId) as HTMLButtonElement | null);
      if (node) setAnchor(node);
    }, [open, triggerId, setAnchor]);

    const [activeIndex, setActiveIndex] = useState(-1);
    const [highlightMode, setHighlightMode] = useState<"keyboard" | "pointer">(
      "pointer",
    );

    const setOpen = useCallback(
      (next: boolean) => {
        if (openProp === undefined) setUncontrolledOpen(next);
        onOpenChange?.(next);
        if (!next) {
          setActiveIndex(-1);
          setHighlightMode("pointer");
        }
      },
      [openProp, onOpenChange],
    );

    // Selection state (input)
    const inputProps = isInput ? (props as DropdownInputProps) : null;
    const isChecklist =
      isInput &&
      (menuType === "checklist" || inputProps?.menuType === "checklist");
    const [uncontrolledValue, setUncontrolledValue] = useState<string[]>(() =>
      asArray(inputProps?.defaultValue),
    );
    const selectedValues =
      inputProps?.value !== undefined
        ? asArray(inputProps.value)
        : uncontrolledValue;

    const selectedSet = useMemo(
      () => new Set(selectedValues),
      [selectedValues],
    );

    const itemOptions = useMemo(() => options.filter(isItemOption), [options]);

    const displayLabel = useMemo(() => {
      if (!isInput) return props.label ?? "Button";
      const placeholder = inputProps?.placeholder ?? "Dropdown";
      if (selectedValues.length === 0) return placeholder;
      const labels = itemOptions
        .filter((o) => selectedSet.has(o.value))
        .map((o) => o.label);
      if (labels.length === 0) return placeholder;
      return labels.length === 1 ? labels[0] : `${labels.length} selected`;
    }, [
      isInput,
      props,
      inputProps?.placeholder,
      selectedValues,
      itemOptions,
      selectedSet,
    ]);

    const hugCandidates = useMemo(() => {
      if (!isInput) return undefined;
      const candidates: ReactNode[] = itemOptions.map((o) => o.label);
      if (inputProps?.placeholder != null && inputProps.placeholder !== "") {
        candidates.push(inputProps.placeholder);
      }
      if (isChecklist) {
        candidates.push(`${itemOptions.length} selected`);
      }
      if (candidates.length === 0) {
        candidates.push(inputProps?.placeholder ?? "Dropdown");
      }
      return candidates;
    }, [isInput, inputProps?.placeholder, itemOptions, isChecklist]);

    const commitSelection = (next: string[]) => {
      if (!inputProps) return;
      if (inputProps.value === undefined) setUncontrolledValue(next);
      inputProps.onChange?.(isChecklist ? next : (next[0] ?? ""));
    };

    const handleItemSelect = (option: DropdownItemOption) => {
      if (option.disabled) return;
      if (isInput) {
        if (isChecklist) {
          const next = selectedSet.has(option.value)
            ? selectedValues.filter((v) => v !== option.value)
            : [...selectedValues, option.value];
          commitSelection(next);
        } else {
          commitSelection([option.value]);
          setOpen(false);
        }
      } else {
        (props as DropdownActionProps).onAction?.(option.value);
        setOpen(false);
      }
    };

    const handleSelectAll = () => {
      commitSelection(
        itemOptions.filter((o) => !o.disabled).map((o) => o.value),
      );
    };
    const handleClearAll = () => {
      commitSelection([]);
    };

    const toggleOpen = () => {
      if (disabled) return;
      if (isInput && inputProps?.readOnly) return;
      setOpen(!open);
    };

    useEffect(() => {
      if (!open) {
        setActiveIndex(-1);
        setHighlightMode("pointer");
      }
    }, [open]);

    const highlightKeyboard = (index: number) => {
      setHighlightMode("keyboard");
      setActiveIndex(index);
    };

    const moveActive = (direction: 1 | -1) => {
      setHighlightMode("keyboard");
      setActiveIndex((current) => {
        const start = current < 0 ? (direction === 1 ? -1 : 0) : current;
        let next = start;
        for (let step = 0; step < options.length; step++) {
          next =
            direction === 1
              ? (next + 1) % options.length
              : (next - 1 + options.length) % options.length;
          if (isSelectableOption(options[next]!)) return next;
        }
        return current;
      });
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (!open) {
        if (
          event.key === "ArrowDown" ||
          event.key === "ArrowUp" ||
          event.key === "Enter" ||
          event.key === " "
        ) {
          event.preventDefault();
          setOpen(true);
          if (event.key === "ArrowUp") {
            for (let i = options.length - 1; i >= 0; i--) {
              if (isSelectableOption(options[i]!)) {
                highlightKeyboard(i);
                break;
              }
            }
          } else {
            const idx = options.findIndex(isSelectableOption);
            if (idx >= 0) highlightKeyboard(idx);
          }
        }
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        anchorRef.current?.focus();
        return;
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        moveActive(1);
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        moveActive(-1);
      }
      if (event.key === "Home") {
        event.preventDefault();
        const idx = options.findIndex(isSelectableOption);
        if (idx >= 0) highlightKeyboard(idx);
      }
      if (event.key === "End") {
        event.preventDefault();
        for (let i = options.length - 1; i >= 0; i--) {
          if (isSelectableOption(options[i]!)) {
            highlightKeyboard(i);
            break;
          }
        }
      }
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        const opt = activeIndex >= 0 ? options[activeIndex] : undefined;
        if (opt && isItemOption(opt)) handleItemSelect(opt);
      }
    };

    const resolvedMenuType: DropdownMenuType =
      isInput && (inputProps?.menuType ?? menuType) === "checklist"
        ? "checklist"
        : "default";

    const menuPanelWidth = isChecklist
      ? ({ width: "max-content", minWidth: "max-content" } as const)
      : resolveMenuPanelWidth(menuWidth, anchorEl?.offsetWidth ?? 0);
    const menuPanelMinWidthCss =
      typeof menuPanelWidth.minWidth === "number"
        ? `${menuPanelWidth.minWidth}px`
        : menuPanelWidth.minWidth;
    const menuPanelWidthCss =
      typeof menuPanelWidth.width === "number"
        ? `${menuPanelWidth.width}px`
        : menuPanelWidth.width;

    // Size look-ups for menu children (set once on panel, inherited via CSS vars)
    const itemDims = MENU_ITEM_SIZE[size];
    const groupDims = MENU_GROUP_SIZE[size];

    const menuVars = {
      "--dd-panel-width": menuPanelWidthCss,
      "--dd-panel-min-width": menuPanelMinWidthCss,
      "--dd-panel-py": isChecklist ? "0" : "4px",
      "--dd-list-py": isChecklist ? "4px" : "0",
      "--dd-item-pl": itemDims.paddingLeft,
      "--dd-item-pr": itemDims.paddingRight,
      "--dd-item-py": itemDims.paddingBlock,
      "--dd-item-height": itemDims.height,
      "--dd-item-gap": itemDims.gap,
      "--dd-item-font-size": itemDims.fontSize,
      "--dd-item-line-height": itemDims.lineHeight,
      "--dd-item-icon-slot": itemDims.iconSlot,
      "--dd-checkbox": `${itemDims.checkbox}px`,
      "--dd-group-height": `${groupDims.height}px`,
      "--dd-group-pl": groupDims.paddingLeft,
      "--dd-group-pr": groupDims.paddingRight,
      "--dd-group-font-size": groupDims.fontSize,
      "--dd-group-line-height": groupDims.lineHeight,
      "--dd-action-justify":
        size === "large" ? "space-between" : "flex-start",
      "--cads-surface-origin": placementToSurfaceOrigin(menuPlacement),
    } as CSSProperties;

    const menu = (
      <Popper
        open={surfaceMounted}
        anchorEl={popperAnchor}
        placement={placementToPopper(menuPlacement)}
        disablePortal={disablePortal}
        style={{
          zIndex: "var(--z-dropdown)",
          width: menuPanelWidthCss,
          minWidth: menuPanelMinWidthCss,
        }}
        modifiers={[
          { name: "offset", options: { offset: [0, 4] } },
          ...(disablePortal
            ? [
                { name: "flip", enabled: false },
                { name: "preventOverflow", enabled: false },
              ]
            : []),
        ]}
      >
        <div
          id={listId}
          role={isInput ? "listbox" : "menu"}
          aria-labelledby={triggerId}
          aria-multiselectable={isChecklist || undefined}
          data-cads-dropdown-menu=""
          data-cads-surface=""
          {...experimentalMotionHostAttrs(experimentalMotion)}
          {...surfaceMotionStateAttrs(surfaceEntering, surfaceExiting)}
          data-menu-type={resolvedMenuType}
          onKeyDown={onKeyDown}
          className={styles.menuPanel}
          style={menuVars}
        >
          <div
            className={styles.optionsList}
            onMouseLeave={() => {
              setActiveIndex(-1);
              setHighlightMode("pointer");
            }}
          >
            {options.map((option, index) => {
              if (option.type === "separator") {
                return <MenuSeparatorRow key={`${listId}-sep-${index}`} />;
              }
              if (option.type === "group") {
                return (
                  <MenuGroupRow
                    key={`${listId}-group-${index}`}
                    label={option.label}
                  />
                );
              }
              const active = index === activeIndex;
              return (
                <MenuItemRow
                  key={option.value}
                  id={`${listId}-opt-${index}`}
                  option={option}
                  size={size}
                  selected={selectedSet.has(option.value)}
                  menuType={resolvedMenuType}
                  role={props.role}
                  active={active}
                  keyboardFocus={active && highlightMode === "keyboard"}
                  onSelect={() => handleItemSelect(option)}
                  onHighlight={() => {
                    setHighlightMode("pointer");
                    setActiveIndex(index);
                  }}
                />
              );
            })}
          </div>
          {isChecklist ? (
            <div
              data-cads-dropdown-action-row=""
              className={styles.actionRow}
            >
              <Button
                variant="text"
                color="secondary"
                size={size}
                onMouseDown={(e: SyntheticEvent) => e.preventDefault()}
                onClick={(e: SyntheticEvent) => {
                  e.stopPropagation();
                  handleSelectAll();
                }}
              >
                Select all
              </Button>
              <Button
                variant="text"
                color="secondary"
                size={size}
                onMouseDown={(e: SyntheticEvent) => e.preventDefault()}
                onClick={(e: SyntheticEvent) => {
                  e.stopPropagation();
                  handleClearAll();
                }}
              >
                Clear all
              </Button>
            </div>
          ) : null}
        </div>
      </Popper>
    );

    if (isInput) {
      const ip = props as DropdownInputProps;
      const sentiment: FieldSentiment = ip.error
        ? "error"
        : (ip.sentiment ?? "default");
      const widthMode = ip.width ?? "hug";
      const fieldWidth = resolveInputWidth(widthMode);
      const isHug = widthMode === "hug";

      return (
        <ClickAwayListener
          onClickAway={() => {
            if (open) setOpen(false);
          }}
        >
          <div
            ref={ref}
            className={cx(styles.root, className)}
            style={{
              width: fieldWidth.rootWidth,
              maxWidth: fieldWidth.maxWidth,
              ...style,
            }}
            data-cads-dropdown="input"
            data-width={
              isHug ? "hug" : widthMode === "full" ? "full" : "fixed"
            }
            onKeyDown={onKeyDown}
          >
            <FieldWrapper
              size={size}
              sentiment={sentiment}
              label={ip.label}
              required={ip.required}
              helperText={ip.helperText}
              helperIconName={ip.helperIconName}
              showHelper={ip.showHelper}
              htmlFor={triggerId}
              disabled={disabled}
            >
              <DropdownButtonTrigger
                size={size}
                color={ip.color ?? "primary"}
                labelStyle={ip.labelStyle ?? "thick"}
                label={displayLabel}
                hugCandidates={isHug ? hugCandidates : undefined}
                startIconName={ip.startIconName}
                open={open}
                disabled={disabled}
                readOnly={Boolean(ip.readOnly)}
                error={Boolean(ip.error) || sentiment === "error"}
                required={Boolean(ip.required)}
                onClick={toggleOpen}
                buttonRef={setAnchor}
                id={triggerId}
                listedBy={open ? listId : undefined}
                triggerWidth={fieldWidth.triggerWidth}
                ariaLabel={
                  typeof ariaLabel === "string"
                    ? ariaLabel
                    : typeof ip.label === "string"
                      ? undefined
                      : "Dropdown"
                }
              />
            </FieldWrapper>
            {menu}
          </div>
        </ClickAwayListener>
      );
    }

    const ap = props as DropdownActionProps;
    const actionIconOnly = Boolean(ap.iconOnly);
    return (
      <ClickAwayListener
        onClickAway={() => {
          if (open) setOpen(false);
        }}
      >
        <div
          ref={ref}
          className={cx(styles.root, className)}
          style={{ display: "inline-flex", ...style }}
          data-cads-dropdown="action"
          onKeyDown={onKeyDown}
        >
          <Button
            ref={setAnchor}
            id={triggerId}
            size={size}
            variant={ap.buttonVariant ?? "contained"}
            color={ap.buttonColor ?? "primary"}
            iconOnly={actionIconOnly}
            startIconName={ap.startIconName}
            endIconName={actionIconOnly ? undefined : "chevron-down"}
            disabled={disabled}
            data-cads-dropdown-trigger="action"
            aria-haspopup="menu"
            aria-expanded={open}
            aria-controls={open ? listId : undefined}
            aria-label={ariaLabel}
            onClick={toggleOpen}
          >
            {actionIconOnly ? undefined : (ap.label ?? "Button")}
          </Button>
          {menu}
        </div>
      </ClickAwayListener>
    );
  },
);
