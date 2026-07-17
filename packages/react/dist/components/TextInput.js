import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
import { forwardRef, useId } from 'react';
import { FieldWrapper, useFieldContext } from './FieldWrapper.js';
import { FOCUS_RING, TEXT_INPUT_SIZE, TRANSITION_COLORS } from '../shared/controlSize.js';

function defaultBorder(color) {
  return color === "secondary" ? "var(--border-neutral-secondary)" : "var(--border-neutral-solid)";
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
}) {
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
  const sharedStyle = {
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
    resize: multiline ? "vertical" : void 0,
    ...style
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
    "aria-invalid": error || void 0,
    "aria-describedby": describedBy,
    "data-cads-text-input": multiline ? "area" : "field",
    "data-color": color,
    "data-readonly": readOnly ? "true" : void 0,
    "data-error": error ? "true" : void 0,
    style: sharedStyle
  };
  if (multiline) {
    return /* @__PURE__ */ jsx(
      "textarea",
      {
        ...rest,
        ...commonProps,
        rows
      }
    );
  }
  return /* @__PURE__ */ jsx("input", { ...rest, ...commonProps, type: rest.type ?? "text" });
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
const TextInput = forwardRef(
  function TextInput2({
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
              disabled,
              readOnly,
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