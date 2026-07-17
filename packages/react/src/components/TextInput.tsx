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
import {
  FOCUS_RING,
  TEXT_INPUT_SIZE,
  TRANSITION_COLORS,
  type ControlSize,
} from "../shared/controlSize";
import type { FaIconName } from "../icons/faProRegularCodepoints";

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
   * @default false
   */
  multiline?: boolean;
  /** Visible field label via Field Wrapper. */
  label?: ReactNode;
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

const CONTROL_CLASS = "cads-text-input-control";

function TextInputControl({
  size,
  color,
  multiline,
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

  let background = "var(--background-neutral-primary)";
  let borderColor = defaultBorder(color);
  let textColor = "var(--text-neutral-primary)";

  if (disabled) {
    borderColor = "var(--border-disabled-neutral)";
    textColor = "var(--text-disabled-neutral)";
  } else if (readOnly) {
    background = "var(--background-neutral-secondary)";
    borderColor = "var(--border-neutral-secondary)";
    textColor = "var(--text-neutral-quaternary)";
  } else if (error) {
    borderColor = "var(--border-error-primary)";
  }

  const sharedStyle: CSSProperties = {
    boxSizing: "border-box",
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
    fontFamily: "var(--font-body)",
    fontWeight: 400,
    fontSize: dims.fontSize,
    lineHeight: dims.lineHeight,
    outline: "none",
    transition: TRANSITION_COLORS,
    resize: multiline ? "vertical" : undefined,
    ...style,
  };

  const describedBy = field?.describedBy;
  const cls = [CONTROL_CLASS, className].filter(Boolean).join(" ");
  const commonProps = {
    id,
    disabled,
    readOnly,
    placeholder,
    value,
    defaultValue,
    onChange,
    className: cls,
    "aria-invalid": error || undefined,
    "aria-describedby": describedBy,
    "data-cads-text-input": multiline ? "area" : "field",
    "data-color": color,
    "data-readonly": readOnly ? "true" : undefined,
    "data-error": error ? "true" : undefined,
    style: sharedStyle,
  };

  if (multiline) {
    return (
      <textarea
        {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        {...commonProps}
        rows={rows}
      />
    );
  }

  return <input {...rest} {...commonProps} type={rest.type ?? "text"} />;
}

const INTERACTIVE_STYLES = `
.${CONTROL_CLASS}::placeholder {
  color: var(--text-neutral-placeholder);
  opacity: 1;
}
.${CONTROL_CLASS}:hover:not(:disabled):not([data-readonly="true"]) {
  background-color: var(--background-neutral-secondary) !important;
}
.${CONTROL_CLASS}:focus-visible:not(:disabled) {
  box-shadow: ${FOCUS_RING};
  background-color: var(--background-neutral-primary) !important;
}
.${CONTROL_CLASS}:active:not(:disabled):not([data-readonly="true"]) {
  background-color: var(--background-neutral-primary) !important;
}
`;

/**
 * CADS Text Input — Field Wrapper + Text Input Building Block chrome.
 * Spec: public set `16176:4884` / key `ba50b76d3e6bc3730fcd2b6389ab2c5306a1c3d4`,
 * building block `16146:3517`.
 *
 * Figma `type=field|area` maps to `multiline={false|true}`.
 * Figma `isFilled` / interaction `state` are derived (value / CSS / props).
 */
export const TextInput = forwardRef<HTMLDivElement, TextInputProps>(
  function TextInput(
    {
      size = "medium",
      color = "primary",
      multiline = false,
      label,
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
            disabled={disabled}
            readOnly={readOnly}
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
