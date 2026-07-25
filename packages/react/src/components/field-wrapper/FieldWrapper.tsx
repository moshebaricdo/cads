import {
  createContext,
  forwardRef,
  useContext,
  useId,
  useMemo,
} from "react";
import { FaIcon } from "../../icons/FaIcon";
import type { FaIconName } from "../../icons/faProRegularCodepoints";
import { FIELD_WRAPPER_SIZE } from "../../shared/controlSize";
import type {
  FieldContextValue,
  FieldSentiment,
  FieldWrapperProps,
} from "./types";

export type { FieldContextValue, FieldSentiment, FieldWrapperProps, FieldWrapperSize } from "./types";

const FieldContext = createContext<FieldContextValue | null>(null);

export function useFieldContext(): FieldContextValue | null {
  return useContext(FieldContext);
}

const SENTIMENT_ICON: Record<
  Exclude<FieldSentiment, "default">,
  FaIconName
> = {
  success: "circle-check",
  warning: "circle-exclamation",
  error: "circle-xmark",
};

function helperColors(
  sentiment: FieldSentiment,
  disabled: boolean,
): {
  text: string;
  icon: string;
} {
  if (disabled) {
    return {
      text: "var(--text-disabled-neutral)",
      icon: "var(--text-disabled-neutral)",
    };
  }
  switch (sentiment) {
    case "success":
      return {
        text: "var(--text-success-primary-fixed)",
        icon: "var(--text-success-primary-fixed)",
      };
    case "error":
      return {
        text: "var(--text-error-primary-fixed)",
        icon: "var(--text-error-primary-fixed)",
      };
    case "warning":
      return {
        text: "var(--text-neutral-tertiary)",
        icon: "var(--text-warning-primary-fixed)",
      };
    default:
      return {
        text: "var(--text-neutral-tertiary)",
        icon: "var(--text-neutral-tertiary)",
      };
  }
}

/**
 * CADS Field Wrapper — label + control slot + helper/validation messaging.
 * Spec: Figma Field Wrapper `15857:99804` / key `a76313f790928233bb8afabe35bd6f76f6e9a473`.
 */
export const FieldWrapper = forwardRef<HTMLDivElement, FieldWrapperProps>(
  function FieldWrapper(
    {
      size = "medium",
      sentiment = "default",
      label,
      required = false,
      helperText,
      helperIconName = "smile",
      showHelper = true,
      htmlFor,
      disabled = false,
      children,
      className,
      style,
    },
    ref,
  ) {
    const reactId = useId();
    const controlId = htmlFor ?? `cads-field-${reactId}`;
    const labelId = `${controlId}-label`;
    const helperId = `${controlId}-helper`;
    const dims = FIELD_WRAPPER_SIZE[size];
    const colors = helperColors(sentiment, disabled);
    const labelColor = disabled
      ? "var(--text-disabled-neutral)"
      : "var(--text-neutral-primary)";

    const shouldShowHelper =
      Boolean(helperText) &&
      (sentiment !== "default" ? true : showHelper);

    const context = useMemo<FieldContextValue>(
      () => ({
        size,
        sentiment,
        disabled,
        labelId,
        helperId,
        controlId,
        describedBy: shouldShowHelper ? helperId : undefined,
        error: sentiment === "error",
      }),
      [
        size,
        sentiment,
        disabled,
        labelId,
        helperId,
        controlId,
        shouldShowHelper,
      ],
    );

    const iconName: FaIconName | (string & {}) =
      sentiment === "default"
        ? helperIconName
        : SENTIMENT_ICON[sentiment];

    return (
      <FieldContext.Provider value={context}>
        <div
          ref={ref}
          className={className}
          data-cads-field-wrapper=""
          data-disabled={disabled ? "true" : undefined}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            gap: "2px",
            position: "relative",
            width: "100%",
            fontFamily: "var(--font-family-main)",
            ...style,
          }}
        >
          {label != null && label !== "" ? (
            <label
              id={labelId}
              htmlFor={controlId}
              style={{
                display: "block",
                fontFamily: "var(--font-family-main)",
                fontWeight: "var(--font-weight-semi-bold)" as unknown as number,
                fontSize: dims.labelFontSize,
                lineHeight: dims.labelLineHeight,
                color: labelColor,
                margin: 0,
              }}
            >
              {label}
              {required ? <span aria-hidden="true">*</span> : null}
            </label>
          ) : null}

          <div data-cads-field-slot="" style={{ width: "100%", minWidth: 0 }}>
            {children}
          </div>

          {shouldShowHelper ? (
            <div
              id={helperId}
              data-cads-field-helper=""
              style={{
                display: "flex",
                alignItems: "center",
                gap: dims.helperGap,
                width: "100%",
                color: colors.text,
              }}
            >
              <span
                aria-hidden
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: dims.helperIconSlot,
                  height: dims.helperIconSlot,
                  flexShrink: 0,
                  color: colors.icon,
                }}
              >
                <FaIcon name={iconName} fontSize={dims.helperIconPx} />
              </span>
              <span
                style={{
                  fontFamily: "var(--font-family-main)",
                  fontWeight: 400,
                  fontSize: dims.helperFontSize,
                  lineHeight: dims.helperLineHeight,
                  color: colors.text,
                }}
              >
                {helperText}
              </span>
            </div>
          ) : null}
        </div>
      </FieldContext.Provider>
    );
  },
);
