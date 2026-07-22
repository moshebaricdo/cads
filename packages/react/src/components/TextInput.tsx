import {
  forwardRef,
  useId,
  type ChangeEvent,
  type CSSProperties,
  type ReactNode,
  type TextareaHTMLAttributes,
  type InputHTMLAttributes,
} from "react";
import {
  FieldWrapper,
  useFieldContext,
  type FieldSentiment,
} from "./FieldWrapper";
import { FaIcon } from "../icons/FaIcon";
import {
  resolveFaIconName,
  type FaIconName,
} from "../icons/faProRegularCodepoints";
import {
  FOCUS_RING,
  TEXT_INPUT_SIZE,
  TRANSITION_COLORS,
  type ControlSize,
} from "../shared/controlSize";

export type TextInputSize = ControlSize;
export type TextInputColor = "primary" | "secondary";

type SharedNativeProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "color" | "value" | "defaultValue" | "onChange" | "children"
>;

export interface TextInputProps extends SharedNativeProps {
  /**
   * Control height: large 48 / medium 40 / small 32 / extraSmall 24.
   * @default "medium"
   */
  size?: TextInputSize;
  /**
   * Border emphasis (Figma building-block `color`).
   * primary = solid border; secondary = soft border.
   * @default "primary"
   */
  color?: TextInputColor;
  /**
   * When true, renders a multiline area (Figma `type=area`).
   * Start icon is field-only and ignored when multiline.
   * @default false
   */
  multiline?: boolean;
  /**
   * Leading FA icon inside the field (Figma building-block `startIcon`).
   * Field-only; ignored for multiline areas.
   * @default false
   */
  startIcon?: boolean;
  /**
   * FA icon when `startIcon` (Figma `startIconName`; `smile` → `face-smile`).
   * @default "face-smile"
   */
  startIconName?: FaIconName | (string & {});
  /** Visible field label via Field Wrapper. */
  label?: ReactNode;
  /**
   * Native required + Field Wrapper label asterisk (`*`).
   * @default false
   */
  required?: boolean;
  /** Helper / validation text via Field Wrapper. */
  helperText?: ReactNode;
  helperIconName?: FaIconName | (string & {});
  showHelper?: boolean;
  /**
   * Field Wrapper sentiment. `error` also drives building-block error chrome.
   * @default "default"
   */
  sentiment?: FieldSentiment;
  /** Convenience alias that sets sentiment=error. */
  error?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  rows?: number;
  readOnly?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  style?: CSSProperties;
  /** Optional override for the native control id. */
  id?: string;
}

function defaultBorder(color: TextInputColor): string {
  return color === "secondary"
    ? "var(--border-neutral-secondary)"
    : "var(--border-neutral-solid)";
}

const SHELL_CLASS = "cads-text-input-shell";
const CONTROL_CLASS = "cads-text-input-control";

function resolveStartIconName(
  name: FaIconName | (string & {}) | undefined,
): FaIconName {
  if (!name) return "face-smile";
  return resolveFaIconName(String(name)) ?? "face-smile";
}

function TextInputControl({
  size,
  color,
  multiline,
  startIcon,
  startIconName,
  disabled,
  readOnly,
  error,
  value,
  defaultValue,
  onChange,
  placeholder,
  rows,
  id,
  className,
  style,
  ...rest
}: {
  size: TextInputSize;
  color: TextInputColor;
  multiline: boolean;
  startIcon: boolean;
  startIconName?: FaIconName | (string & {});
  disabled: boolean;
  readOnly: boolean;
  error: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: TextInputProps["onChange"];
  placeholder?: string;
  rows?: number;
  id: string;
  className?: string;
  style?: CSSProperties;
} & SharedNativeProps) {
  const field = useFieldContext();
  const dims = TEXT_INPUT_SIZE[size];
  const showStartIcon = startIcon && !multiline;

  let background = "var(--background-neutral-primary)";
  let borderColor = defaultBorder(color);
  let textColor = "var(--text-neutral-primary)";
  // Primary: --text-neutral-primary (incl. readOnly). Secondary: --text-neutral-placeholder.
  let iconColor =
    color === "secondary"
      ? "var(--text-neutral-placeholder)"
      : "var(--text-neutral-primary)";

  if (disabled) {
    borderColor = "var(--border-disabled-neutral)";
    textColor = "var(--text-disabled-neutral)";
    iconColor = "var(--text-disabled-neutral)";
  } else if (readOnly) {
    background = "var(--background-neutral-secondary)";
    borderColor = "var(--border-neutral-secondary)";
    textColor = "var(--text-neutral-quaternary)";
  } else if (error) {
    borderColor = "var(--border-error-primary)";
  }

  const describedBy = field?.describedBy;
  const shellCls = [SHELL_CLASS, className].filter(Boolean).join(" ");

  const shellStyle: CSSProperties = {
    boxSizing: "border-box",
    display: "flex",
    alignItems: multiline ? "flex-start" : "center",
    gap: showStartIcon ? dims.iconGap : undefined,
    width: "100%",
    minWidth: 0,
    height: multiline ? dims.areaHeight : dims.height,
    paddingInline: dims.paddingInline,
    paddingBlock: dims.paddingBlock,
    borderRadius: "var(--radius-sm)",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor,
    backgroundColor: background,
    color: textColor,
    overflow: "clip",
    transition: TRANSITION_COLORS,
    ...style,
  };

  const controlStyle: CSSProperties = {
    boxSizing: "border-box",
    flex: "1 1 0",
    minWidth: 0,
    width: "100%",
    height: multiline ? "100%" : "100%",
    margin: 0,
    padding: 0,
    border: "none",
    borderRadius: 0,
    backgroundColor: "transparent",
    color: textColor,
    fontFamily: "var(--font-body)",
    fontWeight: 400,
    fontSize: dims.fontSize,
    lineHeight: dims.lineHeight,
    outline: "none",
    resize: multiline ? "vertical" : undefined,
    alignSelf: multiline ? "stretch" : undefined,
  };

  const commonControlProps = {
    id,
    disabled,
    readOnly,
    placeholder,
    value,
    defaultValue,
    onChange,
    className: CONTROL_CLASS,
    "aria-invalid": error || undefined,
    "aria-describedby": describedBy,
    style: controlStyle,
  };

  const control = multiline ? (
    <textarea
      {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
      {...commonControlProps}
      rows={rows}
    />
  ) : (
    <input {...rest} {...commonControlProps} type={rest.type ?? "text"} />
  );

  return (
    <div
      className={shellCls}
      data-cads-text-input={multiline ? "area" : "field"}
      data-color={color}
      data-readonly={readOnly ? "true" : undefined}
      data-error={error ? "true" : undefined}
      data-disabled={disabled ? "true" : undefined}
      data-start-icon={showStartIcon ? "true" : undefined}
      style={shellStyle}
    >
      {showStartIcon ? (
        <FaIcon
          name={resolveStartIconName(startIconName)}
          family="solid"
          fontSize={dims.iconPx}
          style={{
            flexShrink: 0,
            color: iconColor,
            lineHeight: 1.25,
          }}
        />
      ) : null}
      {control}
    </div>
  );
}

const INTERACTIVE_STYLES = `
.${CONTROL_CLASS}::placeholder {
  color: var(--text-neutral-placeholder);
  opacity: 1;
}
.${SHELL_CLASS}[data-disabled="true"] .${CONTROL_CLASS}::placeholder {
  color: var(--text-disabled-neutral);
}
.${SHELL_CLASS}:hover:not([data-disabled="true"]):not([data-readonly="true"]) {
  background-color: var(--background-neutral-secondary) !important;
}
.${SHELL_CLASS}:focus-within:not([data-disabled="true"]) {
  box-shadow: ${FOCUS_RING};
  background-color: var(--background-neutral-primary) !important;
}
.${SHELL_CLASS}:active:not([data-disabled="true"]):not([data-readonly="true"]) {
  background-color: var(--background-neutral-primary) !important;
}
.${SHELL_CLASS} .${CONTROL_CLASS} {
  cursor: inherit;
}
.${SHELL_CLASS}[data-disabled="true"] {
  cursor: not-allowed;
}
.${SHELL_CLASS}[data-disabled="true"] .${CONTROL_CLASS} {
  cursor: not-allowed;
}
.${SHELL_CLASS}[data-readonly="true"] .${CONTROL_CLASS} {
  cursor: default;
}
`;

/**
 * CADS Text Input — Field Wrapper + Text Input Building Block chrome.
 * Spec: public set `16176:4884` / key `ba50b76d3e6bc3730fcd2b6389ab2c5306a1c3d4`,
 * building block `16146:3517`.
 *
 * Figma `type=field|area` maps to `multiline={false|true}`.
 * Figma `startIcon` / `startIconName` are field-only (ignored for areas).
 * Figma `isFilled` / interaction `state` are derived (value / CSS / props).
 */
export const TextInput = forwardRef<HTMLDivElement, TextInputProps>(
  function TextInput(
    {
      size = "medium",
      color = "primary",
      multiline = false,
      startIcon = false,
      startIconName = "face-smile",
      label,
      required = false,
      helperText,
      helperIconName,
      showHelper = true,
      sentiment: sentimentProp = "default",
      error = false,
      value,
      defaultValue,
      onChange,
      placeholder = "Placeholder",
      rows = 3,
      readOnly = false,
      disabled = false,
      className,
      style,
      id: idProp,
      ...rest
    },
    ref,
  ) {
    const reactId = useId();
    const controlId = idProp ?? `cads-text-input-${reactId}`;
    const sentiment: FieldSentiment = error ? "error" : sentimentProp;
    const isError = error || sentiment === "error";

    return (
      <>
        <style>{INTERACTIVE_STYLES}</style>
        <FieldWrapper
          ref={ref}
          size={size}
          sentiment={sentiment}
          label={label}
          required={required}
          helperText={helperText}
          helperIconName={helperIconName}
          showHelper={showHelper}
          htmlFor={controlId}
          disabled={disabled}
          className={className}
          style={style}
        >
          <TextInputControl
            {...rest}
            id={controlId}
            size={size}
            color={color}
            multiline={multiline}
            startIcon={startIcon}
            startIconName={startIconName}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            error={isError}
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
          />
        </FieldWrapper>
      </>
    );
  },
);
