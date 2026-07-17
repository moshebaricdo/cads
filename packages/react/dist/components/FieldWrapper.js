import { jsx, jsxs } from 'react/jsx-runtime';
import { createContext, forwardRef, useId, useMemo, useContext } from 'react';
import { FaIcon } from '../icons/FaIcon.js';
import { FIELD_WRAPPER_SIZE } from '../shared/controlSize.js';

const FieldContext = createContext(null);
function useFieldContext() {
  return useContext(FieldContext);
}
const SENTIMENT_ICON = {
  success: "circle-check",
  warning: "circle-exclamation",
  error: "circle-xmark"
};
function helperColors(sentiment) {
  switch (sentiment) {
    case "success":
      return {
        text: "var(--text-success-primary-fixed)",
        icon: "var(--text-success-primary-fixed)"
      };
    case "error":
      return {
        text: "var(--text-error-primary-fixed)",
        icon: "var(--text-error-primary-fixed)"
      };
    case "warning":
      return {
        text: "var(--text-neutral-tertiary)",
        icon: "var(--text-warning-primary-fixed)"
      };
    default:
      return {
        text: "var(--text-neutral-tertiary)",
        icon: "var(--text-neutral-tertiary)"
      };
  }
}
const FieldWrapper = forwardRef(
  function FieldWrapper2({
    size = "medium",
    sentiment = "default",
    label,
    helperText,
    helperIconName = "smile",
    showHelper = true,
    htmlFor,
    disabled = false,
    children,
    className,
    style
  }, ref) {
    const reactId = useId();
    const controlId = htmlFor ?? `cads-field-${reactId}`;
    const labelId = `${controlId}-label`;
    const helperId = `${controlId}-helper`;
    const dims = FIELD_WRAPPER_SIZE[size];
    const colors = helperColors(sentiment);
    const shouldShowHelper = Boolean(helperText) && (sentiment !== "default" ? true : showHelper);
    const context = useMemo(
      () => ({
        size,
        sentiment,
        disabled,
        labelId,
        helperId,
        controlId,
        describedBy: shouldShowHelper ? helperId : void 0,
        error: sentiment === "error"
      }),
      [
        size,
        sentiment,
        disabled,
        labelId,
        helperId,
        controlId,
        shouldShowHelper
      ]
    );
    const iconName = sentiment === "default" ? helperIconName : SENTIMENT_ICON[sentiment];
    return /* @__PURE__ */ jsx(FieldContext.Provider, { value: context, children: /* @__PURE__ */ jsxs(
      "div",
      {
        ref,
        className,
        "data-cads-field-wrapper": "",
        style: {
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          gap: "2px",
          position: "relative",
          width: "100%",
          fontFamily: "var(--font-body)",
          ...style
        },
        children: [
          label != null && label !== "" ? /* @__PURE__ */ jsx(
            "label",
            {
              id: labelId,
              htmlFor: controlId,
              style: {
                display: "block",
                fontFamily: "var(--font-body)",
                fontWeight: "var(--font-weight-semibold)",
                fontSize: dims.labelFontSize,
                lineHeight: dims.labelLineHeight,
                color: "var(--text-neutral-primary)",
                margin: 0
              },
              children: label
            }
          ) : null,
          /* @__PURE__ */ jsx("div", { "data-cads-field-slot": "", style: { width: "100%", minWidth: 0 }, children }),
          shouldShowHelper ? /* @__PURE__ */ jsxs(
            "div",
            {
              id: helperId,
              "data-cads-field-helper": "",
              style: {
                display: "flex",
                alignItems: "center",
                gap: dims.helperGap,
                width: "100%",
                color: colors.text
              },
              children: [
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    "aria-hidden": true,
                    style: {
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: dims.helperIconSlot,
                      height: dims.helperIconSlot,
                      flexShrink: 0,
                      color: colors.icon
                    },
                    children: /* @__PURE__ */ jsx(FaIcon, { name: iconName, fontSize: dims.helperIconPx })
                  }
                ),
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    style: {
                      fontFamily: "var(--font-body)",
                      fontWeight: 400,
                      fontSize: dims.helperFontSize,
                      lineHeight: dims.helperLineHeight,
                      color: colors.text
                    },
                    children: helperText
                  }
                )
              ]
            }
          ) : null
        ]
      }
    ) });
  }
);

export { FieldWrapper, useFieldContext };
//# sourceMappingURL=FieldWrapper.js.map
//# sourceMappingURL=FieldWrapper.js.map