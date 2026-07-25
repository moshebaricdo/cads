import {
  forwardRef,
  useId,
  type CSSProperties,
  type TextareaHTMLAttributes,
} from "react";
import { FieldWrapper, useFieldContext } from "../field-wrapper/FieldWrapper";
import type { FieldSentiment } from "../field-wrapper/types";
import { FaIcon } from "../../icons/FaIcon";
import {
  resolveFaIconName,
  type FaIconName,
} from "../../icons/faProRegularCodepoints";
import { TEXT_INPUT_SIZE } from "../../shared/controlSize";
import styles from "./textInput.module.scss";
import type { SharedNativeProps, TextInputProps, TextInputSize, TextInputColor } from "./types";

export type { TextInputProps, TextInputSize, TextInputColor } from "./types";

function defaultBorder(color: TextInputColor): string {
  return color === "secondary"
    ? "var(--border-neutral-secondary)"
    : "var(--border-neutral-solid)";
}

function resolveStartIconName(
  name: FaIconName | (string & {}),
): FaIconName {
  return resolveFaIconName(String(name)) ?? "face-smile";
}

function TextInputControl({
  size,
  color,
  multiline,
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
  const showStartIcon = Boolean(startIconName) && !multiline;

  let background = "var(--background-neutral-primary)";
  let borderColor = defaultBorder(color);
  let textColor = "var(--text-neutral-primary)";
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
  const shellCls = [styles.shell, className].filter(Boolean).join(" ");

  const shellStyle: CSSProperties = {
    alignItems: multiline ? "flex-start" : "center",
    gap: showStartIcon ? dims.iconGap : undefined,
    height: multiline ? dims.areaHeight : dims.height,
    paddingInline: dims.paddingInline,
    paddingBlock: dims.paddingBlock,
    borderColor,
    backgroundColor: background,
    color: textColor,
    ...style,
  };

  const controlStyle: CSSProperties = {
    color: textColor,
    fontSize: dims.fontSize,
    lineHeight: dims.lineHeight,
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
    className: styles.control,
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
      {showStartIcon && startIconName ? (
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

/**
 * CADS Text Input — Field Wrapper + Text Input Building Block chrome.
 * Spec: public set `16176:4884` / key `ba50b76d3e6bc3730fcd2b6389ab2c5306a1c3d4`,
 * building block `16146:3517`.
 *
 * Figma `type=field|area` maps to `multiline={false|true}`.
 * Figma `startIcon` boolean is collapsed into presence of `startIconName`
 * (field-only; ignored for areas).
 * Figma `isFilled` / interaction `state` are derived (value / CSS / props).
 */
export const TextInput = forwardRef<HTMLDivElement, TextInputProps>(
  function TextInput(
    {
      size = "medium",
      color = "primary",
      multiline = false,
      startIconName,
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
    );
  },
);
