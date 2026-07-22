import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
import { forwardRef, useId } from 'react';
import { FieldWrapper, useFieldContext } from './FieldWrapper.js';
import { FaIcon } from '../icons/FaIcon.js';
import { resolveFaIconName } from '../icons/faProRegularCodepoints.js';
import { FOCUS_RING, TEXT_INPUT_SIZE, TRANSITION_COLORS } from '../shared/controlSize.js';

function defaultBorder(color) {
  return color === "secondary" ? "var(--border-neutral-secondary)" : "var(--border-neutral-solid)";
}
const SHELL_CLASS = "cads-text-input-shell";
const CONTROL_CLASS = "cads-text-input-control";
function resolveStartIconName(name) {
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
}) {
  const field = useFieldContext();
  const dims = TEXT_INPUT_SIZE[size];
  const showStartIcon = startIcon && !multiline;
  let background = "var(--background-neutral-primary)";
  let borderColor = defaultBorder(color);
  let textColor = "var(--text-neutral-primary)";
  let iconColor = color === "secondary" ? "var(--text-neutral-placeholder)" : "var(--text-neutral-primary)";
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
  const shellStyle = {
    boxSizing: "border-box",
    display: "flex",
    alignItems: multiline ? "flex-start" : "center",
    gap: showStartIcon ? dims.iconGap : void 0,
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
    ...style
  };
  const controlStyle = {
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
    resize: multiline ? "vertical" : void 0,
    alignSelf: multiline ? "stretch" : void 0
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
    "aria-invalid": error || void 0,
    "aria-describedby": describedBy,
    style: controlStyle
  };
  const control = multiline ? /* @__PURE__ */ jsx(
    "textarea",
    {
      ...rest,
      ...commonControlProps,
      rows
    }
  ) : /* @__PURE__ */ jsx("input", { ...rest, ...commonControlProps, type: rest.type ?? "text" });
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: shellCls,
      "data-cads-text-input": multiline ? "area" : "field",
      "data-color": color,
      "data-readonly": readOnly ? "true" : void 0,
      "data-error": error ? "true" : void 0,
      "data-disabled": disabled ? "true" : void 0,
      "data-start-icon": showStartIcon ? "true" : void 0,
      style: shellStyle,
      children: [
        showStartIcon ? /* @__PURE__ */ jsx(
          FaIcon,
          {
            name: resolveStartIconName(startIconName),
            family: "solid",
            fontSize: dims.iconPx,
            style: {
              flexShrink: 0,
              color: iconColor,
              lineHeight: 1.25
            }
          }
        ) : null,
        control
      ]
    }
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
const TextInput = forwardRef(
  function TextInput2({
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
  }, ref) {
    const reactId = useId();
    const controlId = idProp ?? `cads-text-input-${reactId}`;
    const sentiment = error ? "error" : sentimentProp;
    const isError = error || sentiment === "error";
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("style", { children: INTERACTIVE_STYLES }),
      /* @__PURE__ */ jsx(
        FieldWrapper,
        {
          ref,
          size,
          sentiment,
          label,
          required,
          helperText,
          helperIconName,
          showHelper,
          htmlFor: controlId,
          disabled,
          className,
          style,
          children: /* @__PURE__ */ jsx(
            TextInputControl,
            {
              ...rest,
              id: controlId,
              size,
              color,
              multiline,
              startIcon,
              startIconName,
              disabled,
              readOnly,
              required,
              error: isError,
              value,
              defaultValue,
              onChange,
              placeholder,
              rows
            }
          )
        }
      )
    ] });
  }
);

export { TextInput };
//# sourceMappingURL=TextInput.js.map
//# sourceMappingURL=TextInput.js.map