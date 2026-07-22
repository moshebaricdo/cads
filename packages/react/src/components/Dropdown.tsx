import ClickAwayListener from "@mui/material/ClickAwayListener";
import Paper from "@mui/material/Paper";
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
import { Button, type ButtonColor, type ButtonVariant } from "./Button";
import { FieldWrapper, type FieldSentiment } from "./FieldWrapper";
import { FaIcon } from "../icons/FaIcon";
import type { FaIconName } from "../icons/faProRegularCodepoints";
import {
  BUTTON_SIZE,
  FOCUS_RING,
  TEXT_INPUT_SIZE,
  TRANSITION_COLORS,
  type ControlSize,
} from "../shared/controlSize";

export type DropdownSize = ControlSize;
export type DropdownRole = "input" | "action";
export type DropdownMenuType = "default" | "checklist";
export type DropdownMenuPlacement =
  | "bottomLeft"
  | "bottomRight"
  | "topLeft"
  | "topRight";
export type DropdownLabelStyle = "thick" | "thin";
export type DropdownColor = "primary" | "secondary";
/**
 * Input-role field width.
 * - `"hug"` (default): static width from the longest option / placeholder
 *   (selection changes do not resize the field; longer text ellipsizes)
 * - `"full"`: fill the parent
 * - CSS length: e.g. `"12rem"`, `"240px"`, `"50%"`, `"min(100%, 20rem)"`
 * - number: treated as pixels
 */
export type DropdownFieldWidth = "hug" | "full" | number | (string & {});

/** Selectable menu row (Figma Dropdown Menu Item `896:3791`). */
export interface DropdownItemOption {
  type?: "item";
  value: string;
  label: ReactNode;
  /**
   * Show leading icon (Figma `hasStartIcon`).
   * Defaults to `true` when `iconName` is set, otherwise `false` (text-only).
   */
  startIcon?: boolean;
  /** FA icon when `startIcon` (Figma `iconName`). */
  iconName?: FaIconName | (string & {});
  /** Destructive styling (Figma itemType=defaultError). Action role only. */
  destructive?: boolean;
  disabled?: boolean;
}

/** Hairline row (Figma menuSeparator `16847:69841`). */
export interface DropdownSeparatorOption {
  type: "separator";
}

/** Non-interactive section label (Figma menuOptGroup `16847:69853`). */
export interface DropdownGroupOption {
  type: "group";
  label: ReactNode;
}

export type DropdownOption =
  | DropdownItemOption
  | DropdownSeparatorOption
  | DropdownGroupOption;

function isItemOption(option: DropdownOption): option is DropdownItemOption {
  return option.type !== "separator" && option.type !== "group";
}

function isSelectableOption(
  option: DropdownOption,
): option is DropdownItemOption {
  return isItemOption(option) && !option.disabled;
}

interface DropdownBaseProps {
  size?: DropdownSize;
  menuType?: DropdownMenuType;
  menuPlacement?: DropdownMenuPlacement;
  options: DropdownOption[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
}

export interface DropdownInputProps extends DropdownBaseProps {
  role: "input";
  label?: ReactNode;
  /**
   * Required field marker on the Field Wrapper label (`*`).
   * @default false
   */
  required?: boolean;
  helperText?: ReactNode;
  helperIconName?: FaIconName | (string & {});
  showHelper?: boolean;
  sentiment?: FieldSentiment;
  error?: boolean;
  readOnly?: boolean;
  color?: DropdownColor;
  labelStyle?: DropdownLabelStyle;
  startIconName?: FaIconName | (string & {});
  placeholder?: string;
  /**
   * Field width for the input role.
   * @default "hug"
   */
  width?: DropdownFieldWidth;
  /** Single select (icon) or multi (checklist). */
  value?: string | string[];
  defaultValue?: string | string[];
  onChange?: (value: string | string[]) => void;
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

export interface DropdownActionProps extends DropdownBaseProps {
  role: "action";
  /** Button label. */
  label?: ReactNode;
  startIconName?: FaIconName | (string & {});
  buttonVariant?: ButtonVariant;
  buttonColor?: ButtonColor;
  onAction?: (value: string) => void;
  /** Action menus are non-checklist (`menuType=default`) in Figma. */
  menuType?: "default";
}

export type DropdownProps = DropdownInputProps | DropdownActionProps;

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

function asArray(value: string | string[] | undefined): string[] {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

/** Menu Item geometry from Figma `896:3791` (not Button padding). */
const MENU_ITEM_SIZE: Record<
  ControlSize,
  {
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
  large: {
    paddingLeft: "1rem", // 16
    paddingRight: "1.375rem", // 22
    paddingBlock: "0.625rem", // 10
    gap: "0.75rem", // 12
    fontSize: "var(--text-body-lg)",
    lineHeight: "var(--leading-body-lg)",
    iconSlot: "1.75rem", // 28
    iconPx: "1.375rem", // 22
    checkbox: 22,
  },
  medium: {
    paddingLeft: "0.75rem", // 12
    paddingRight: "1rem", // 16
    paddingBlock: "0.5rem", // 8
    gap: "0.75rem", // 12
    fontSize: "var(--text-body-md)",
    lineHeight: "var(--leading-body-md)",
    iconSlot: "1.5rem", // 24
    iconPx: "1.1875rem", // 19
    checkbox: 20,
  },
  small: {
    paddingLeft: "0.625rem", // 10
    paddingRight: "0.875rem", // 14
    paddingBlock: "0.3125rem", // 5
    gap: "0.5rem", // 8
    fontSize: "var(--text-body-sm)",
    lineHeight: "var(--leading-body-sm)",
    iconSlot: "1.25rem", // 20
    iconPx: "1rem", // 16
    checkbox: 18,
  },
  extraSmall: {
    paddingLeft: "0.5rem", // 8
    paddingRight: "0.625rem", // 10
    paddingBlock: "0.125rem", // 2
    gap: "0.25rem", // 4
    fontSize: "var(--text-body-xs)",
    lineHeight: "var(--leading-body-xs)",
    iconSlot: "1rem", // 16
    iconPx: "0.8125rem", // 13
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
    paddingRight: "1.375rem",
    fontSize: "var(--text-body-sm)",
    lineHeight: "var(--leading-body-sm)",
  },
  medium: {
    height: 28,
    paddingLeft: "0.75rem",
    paddingRight: "1rem",
    fontSize: "var(--text-body-xs)",
    lineHeight: "var(--leading-body-xs)",
  },
  small: {
    height: 24,
    paddingLeft: "0.625rem",
    paddingRight: "0.875rem",
    fontSize: "var(--text-body-xxs)",
    lineHeight: "var(--leading-body-xxs)",
  },
  extraSmall: {
    height: 20,
    paddingLeft: "0.5rem",
    paddingRight: "0.625rem",
    fontSize: "var(--text-body-xxs)",
    lineHeight: "var(--leading-body-xxs)",
  },
};

/** Figma menuSeparator `16847:69840` — 8px row, 1px hairline. */
const MENU_SEPARATOR_HEIGHT = 8;

function triggerBorder(color: DropdownColor, error: boolean, disabled: boolean, readOnly: boolean) {
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
  const iconDims = BUTTON_SIZE[size];
  const border = triggerBorder(color, error, disabled, readOnly);
  const hug = Boolean(hugCandidates?.length);

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
      className="cads-dropdown-trigger"
      style={{
        boxSizing: "border-box",
        width: triggerWidth,
        minWidth: hug ? "max-content" : undefined,
        height: dims.height,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: iconDims.gap,
        paddingInline: dims.paddingInline,
        paddingBlock: dims.paddingBlock,
        borderRadius: "var(--radius-sm)",
        border: `1px solid ${border}`,
        backgroundColor: readOnly
          ? "var(--background-neutral-secondary)"
          : "var(--background-neutral-primary)",
        color: disabled
          ? "var(--text-disabled-neutral)"
          : readOnly
            ? "var(--text-neutral-quaternary)"
            : "var(--text-neutral-primary)",
        fontFamily: "var(--font-body)",
        fontWeight: labelStyle === "thin" ? 400 : 600,
        fontSize: dims.fontSize,
        lineHeight: dims.lineHeight,
        cursor: disabled || readOnly ? "default" : "pointer",
        transition: TRANSITION_COLORS,
        textAlign: "left",
      }}
    >
      <span
        style={{
          display: "flex",
          alignItems: "center",
          gap: iconDims.gap,
          minWidth: 0,
          paddingRight: 8,
          overflow: hug ? "visible" : "hidden",
          flex: hug ? "0 1 auto" : "1 1 auto",
        }}
      >
        {startIconName ? (
          <FaIcon name={startIconName} fontSize={iconDims.iconPx} />
        ) : null}
        <TriggerLabel label={label} hugCandidates={hugCandidates} />
      </span>
      <FaIcon name="chevron-down" fontSize={iconDims.iconPx} />
    </button>
  );
}

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
  const showStartIcon =
    menuType !== "checklist" && (option.startIcon ?? Boolean(option.iconName));
  const textColor = destructive
    ? "var(--text-error-primary)"
    : selected
      ? "var(--text-selected-primary)"
      : "var(--text-neutral-primary)";
  // Base chrome only — hover / keyboard-focus / press are CSS recipes.
  const bg = selected
    ? "var(--background-selected-primary)"
    : "var(--background-neutral-primary)";

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
        // Keep focus on the trigger; prevents the menu from stealing focus mid-click.
        e.preventDefault();
      }}
      onClick={(e) => {
        e.preventDefault();
        // ⌘/Ctrl+click is reserved for design-tool nested inspection in docs;
        // don't select/close, and let the event bubble to the playground stage.
        if (e.metaKey || e.ctrlKey) return;
        e.stopPropagation();
        if (!option.disabled) onSelect();
      }}
      onMouseEnter={() => {
        if (!option.disabled) onHighlight();
      }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: showStartIcon || menuType === "checklist" ? dims.gap : 0,
        width: "100%",
        boxSizing: "border-box",
        paddingLeft: dims.paddingLeft,
        paddingRight: dims.paddingRight,
        paddingBlock: dims.paddingBlock,
        backgroundColor: bg,
        color: textColor,
        cursor: option.disabled ? "default" : "pointer",
        opacity: option.disabled ? 0.5 : 1,
        fontFamily: "var(--font-body)",
        fontWeight: 400,
        fontSize: dims.fontSize,
        lineHeight: dims.lineHeight,
        transition: TRANSITION_COLORS,
        minWidth: 0,
      }}
    >
      {menuType === "checklist" ? (
        <span
          aria-hidden
          style={{
            boxSizing: "border-box",
            width: dims.checkbox,
            height: dims.checkbox,
            borderRadius: "var(--radius-sm)",
            flexShrink: 0,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: selected
              ? "var(--background-selected-primary-inverse)"
              : "var(--background-neutral-primary)",
            border: selected
              ? "none"
              : "2px solid var(--border-neutral-solid)",
            color: "var(--text-selected-primary-inverse)",
          }}
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
        <span
          aria-hidden
          style={{
            width: dims.iconSlot,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            color: textColor,
          }}
        >
          <FaIcon
            name={option.iconName ?? "smile"}
            fontSize={dims.iconPx}
          />
        </span>
      ) : null}
      <span
        style={{
          minWidth: 0,
          flex: "1 1 auto",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {option.label}
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
      style={{
        boxSizing: "border-box",
        width: "100%",
        height: MENU_SEPARATOR_HEIGHT,
        display: "flex",
        alignItems: "center",
        flexShrink: 0,
        paddingBlock: 1,
      }}
    >
      <div
        style={{
          width: "100%",
          height: 1,
          backgroundColor: "var(--border-neutral-primary)",
        }}
      />
    </div>
  );
}

function MenuGroupRow({
  label,
  size,
}: {
  label: ReactNode;
  size: DropdownSize;
}) {
  const dims = MENU_GROUP_SIZE[size];
  return (
    <div
      role="presentation"
      data-cads-dropdown-group=""
      style={{
        boxSizing: "border-box",
        width: "100%",
        height: dims.height,
        display: "flex",
        alignItems: "center",
        paddingLeft: dims.paddingLeft,
        paddingRight: dims.paddingRight,
        backgroundColor: "var(--background-neutral-primary)",
        color: "var(--text-neutral-quaternary)",
        fontFamily: "var(--font-body)",
        fontWeight: 600,
        fontSize: dims.fontSize,
        lineHeight: dims.lineHeight,
        letterSpacing: "var(--tracking-overline)",
        textTransform: "uppercase",
        minWidth: 0,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        userSelect: "none",
        pointerEvents: "none",
      }}
    >
      <span
        style={{
          minWidth: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
    </div>
  );
}

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
      options,
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      disabled = false,
      className,
      style,
      "aria-label": ariaLabel,
    } = props;

    const isInput = props.role === "input";
    const reactId = useId();
    const listId = `cads-dropdown-list-${reactId}`;
    const triggerId = `cads-dropdown-trigger-${reactId}`;
    // State (not only ref) so Popper re-renders when the trigger mounts —
    // required for defaultOpen / controlled open on first paint.
    // Ignore null ref callbacks (React Strict Mode remount) so we don't keep
    // open=true with a cleared anchor and a missing menu.
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const anchorRef = useRef<HTMLButtonElement | null>(null);
    const setAnchor = useCallback((node: HTMLButtonElement | null) => {
      if (!node) return;
      anchorRef.current = node;
      setAnchorEl((prev) => (prev === node ? prev : node));
    }, []);
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
    const open = openProp ?? uncontrolledOpen;

    useLayoutEffect(() => {
      if (!open) return;
      const node =
        anchorRef.current ??
        (document.getElementById(triggerId) as HTMLButtonElement | null);
      if (node) setAnchor(node);
    }, [open, triggerId, setAnchor]);
    /** Keyboard / pointer highlight index; -1 = none (avoid a stuck “hover”). */
    const [activeIndex, setActiveIndex] = useState(-1);
    /**
     * Pointer hover vs keyboard focus use different Figma recipes.
     * `data-active` tracks either; `data-keyboard-focus` is keyboard-only.
     */
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
    const isChecklist = isInput && (menuType === "checklist" || inputProps?.menuType === "checklist");
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

    const itemOptions = useMemo(
      () => options.filter(isItemOption),
      [options],
    );

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

    /** Static hug width: longest option / placeholder / checklist summary. */
    const hugCandidates = useMemo(() => {
      if (!isInput) return undefined;
      const placeholder = inputProps?.placeholder ?? "Dropdown";
      const candidates: ReactNode[] = [
        placeholder,
        ...itemOptions.map((o) => o.label),
      ];
      if (isChecklist) {
        candidates.push(`${itemOptions.length} selected`);
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

    // Instant open (no Grow): fixtures disable CSS transitions, which can leave
    // MUI Transition children stuck at opacity 0. disablePortal keeps the menu
    // inside the component tree for deterministic capture regions.
    // Checklist menus size to max-content so the Action Row ("Select all" /
    // "Clear all") always fits on one line; option labels ellipsize.
    const menu = (
      <Popper
        open={open && Boolean(anchorEl)}
        anchorEl={anchorEl}
        placement={placementToPopper(menuPlacement)}
        disablePortal
        style={{
          zIndex: 1400,
          ...(isChecklist ? { width: "max-content", minWidth: "max-content" } : null),
        }}
        modifiers={[
          { name: "offset", options: { offset: [0, 4] } },
        ]}
      >
        <Paper
          id={listId}
          role={isInput ? "listbox" : "menu"}
          aria-labelledby={triggerId}
          aria-multiselectable={isChecklist || undefined}
          data-cads-dropdown-menu=""
          data-menu-type={resolvedMenuType}
          elevation={0}
          onKeyDown={onKeyDown}
          sx={{
            mt: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            border: "1px solid var(--border-neutral-primary)",
            borderRadius: "var(--radius-sm)",
            backgroundColor: "var(--background-neutral-primary)",
            boxShadow: "var(--shadow-md)",
            overflow: "hidden",
            // Checklist (Figma Menu List 971:4280): hug the Action Row so
            // footer labels stay fully visible at every size.
            width: isChecklist ? "max-content" : undefined,
            minWidth: isChecklist ? "max-content" : isInput ? 180 : 120,
            // Icon menus: 4px vertical padding. Checklist: options list owns
            // the vertical padding (pt/pb 4; pb sits above the Action Row).
            py: isChecklist ? 0 : "4px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              // Figma Options List: pt/pb 4 on checklist (pb sits above Action Row).
              paddingTop: isChecklist ? 4 : 0,
              paddingBottom: isChecklist ? 4 : 0,
            }}
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
                    size={size}
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
              style={{
                display: "flex",
                flexWrap: "nowrap",
                // Figma Action Row: large = space-between; else gap 4 + start.
                justifyContent:
                  size === "large" ? "space-between" : "flex-start",
                alignItems: "flex-start",
                borderTop: "1px solid var(--border-neutral-primary)",
                padding: 4,
                gap: 4,
                boxSizing: "border-box",
                width: "100%",
              }}
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
                sx={{
                  flex: "0 0 auto",
                  flexShrink: 0,
                  whiteSpace: "nowrap",
                  minWidth: "max-content",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
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
                sx={{
                  flex: "0 0 auto",
                  flexShrink: 0,
                  whiteSpace: "nowrap",
                  minWidth: "max-content",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Clear all
              </Button>
            </div>
          ) : null}
        </Paper>
      </Popper>
    );

    const triggerStyles = `
.cads-dropdown-trigger {
  outline: none;
}
.cads-dropdown-trigger:hover:not(:disabled) {
  background-color: var(--background-neutral-tertiary) !important;
}
.cads-dropdown-trigger:focus-visible {
  box-shadow: ${FOCUS_RING};
}
/* When a menu item has keyboard focus, move chrome off the trigger (Figma). */
[data-cads-dropdown]:has([data-keyboard-focus="true"]) .cads-dropdown-trigger:focus-visible,
[data-cads-dropdown]:has([data-keyboard-focus="true"]) .MuiButton-root.Mui-focusVisible {
  box-shadow: none !important;
}
/* Pointer hover — Figma Menu Item / Dropdown Button state=hover */
[data-cads-dropdown-item]:not([aria-disabled="true"]):not([aria-selected="true"]):not([data-destructive="true"]):not([data-keyboard-focus="true"]):hover {
  background-color: var(--background-neutral-tertiary) !important;
}
[data-cads-dropdown-item]:not([aria-disabled="true"]):not([aria-selected="true"]):not([data-destructive="true"]):active:not([data-keyboard-focus="true"]) {
  background-color: var(--background-neutral-tertiary) !important;
  color: var(--text-neutral-tertiary) !important;
}
[data-cads-dropdown-item][data-destructive="true"]:not([aria-disabled="true"]):not([data-keyboard-focus="true"]):hover {
  background-color: var(--background-error-light) !important;
}
[data-cads-dropdown-item][data-destructive="true"]:not([aria-disabled="true"]):active:not([data-keyboard-focus="true"]) {
  background-color: var(--background-error-primary) !important;
  color: var(--text-neutral-white-fixed) !important;
}
[data-cads-dropdown-item][aria-selected="true"]:not([data-keyboard-focus="true"]):hover {
  background-color: var(--background-selected-strong) !important;
}
/* Keyboard focus — Figma Menu Item state=focus (2px flush ring, not FOCUS_RING).
   Use outline + negative offset so geometry does not shift like a real border. */
[data-cads-dropdown-item]:not([aria-disabled="true"]):not([aria-selected="true"]):not([data-destructive="true"])[data-keyboard-focus="true"] {
  background-color: var(--background-brand-light) !important;
  outline: 2px solid var(--border-focused-primary);
  outline-offset: -2px;
}
[data-cads-dropdown-item][aria-selected="true"][data-keyboard-focus="true"] {
  background-color: var(--background-selected-primary) !important;
  color: var(--text-selected-primary) !important;
  outline: 2px solid var(--border-selected-primary-inverse);
  outline-offset: -2px;
}
[data-cads-dropdown-item][data-destructive="true"]:not([aria-disabled="true"])[data-keyboard-focus="true"] {
  background-color: var(--background-neutral-primary) !important;
  color: var(--text-error-primary) !important;
  outline: 2px solid var(--border-error-primary);
  outline-offset: -2px;
}
[data-cads-dropdown-action-row] .MuiButton-root {
  white-space: nowrap;
}
`;

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
            className={className}
            style={{
              position: "relative",
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
            <style>{triggerStyles}</style>
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
    return (
      <ClickAwayListener
        onClickAway={() => {
          if (open) setOpen(false);
        }}
      >
        <div
          ref={ref}
          className={className}
          style={{ position: "relative", display: "inline-flex", ...style }}
          data-cads-dropdown="action"
          onKeyDown={onKeyDown}
        >
          <style>{triggerStyles}</style>
          <Button
            ref={setAnchor}
            id={triggerId}
            size={size}
            variant={ap.buttonVariant ?? "contained"}
            color={ap.buttonColor ?? "primary"}
            startIconName={ap.startIconName}
            endIconName="chevron-down"
            disabled={disabled}
            aria-haspopup="menu"
            aria-expanded={open}
            aria-controls={open ? listId : undefined}
            aria-label={ariaLabel}
            onClick={toggleOpen}
          >
            {ap.label ?? "Button"}
          </Button>
          {menu}
        </div>
      </ClickAwayListener>
    );
  },
);
