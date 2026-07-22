import {
  createContext,
  forwardRef,
  useContext,
  useId,
  useMemo,
  type CSSProperties,
  type ReactNode,
} from "react";
import { FaIcon } from "../icons/FaIcon";
import type { FaIconName } from "../icons/faProRegularCodepoints";
import {
  FIELD_WRAPPER_SIZE,
  type ControlSize,
} from "../shared/controlSize";

export type FieldWrapperSize = ControlSize;
export type FieldSentiment = "default" | "success" | "warning" | "error";

export interface FieldContextValue {
  size: FieldWrapperSize;
  sentiment: FieldSentiment;
  disabled: boolean;
  labelId: string;
  helperId: string;
  controlId: string;
  describedBy?: string;
  error: boolean;
}

const FieldContext = createContext<FieldContextValue | null>(null);

export function useFieldContext(): FieldContextValue | null {
  return useContext(FieldContext);
}

export interface FieldWrapperProps {
  /**
   * Control height scale for label/helper typography.
   * @default "medium"
   */
  size?: FieldWrapperSize;
  /**
   * Validation / messaging tone (Figma `sentiment`).
   * @default "default"
   */
  sentiment?: FieldSentiment;
  /** Visible field label. */
  label?: ReactNode;
  /**
   * Marks the field as required. Appends a `*` after the label (same type style,
   * no extra gap) and is intended to pair with a native `required` on the control.
   * @default false
   */
  required?: boolean;
  /** Helper / validation text below the control slot. */
  helperText?: ReactNode;
  /**
   * Icon for default sentiment helper. Sentiment overrides use fixed icons.
   * Figma shortcode `smile` is accepted.
   */
  helperIconName?: FaIconName | (string & {});
  /**
   * When false, helper row is hidden even if helperText is set.
   * Non-default sentiments always show helper when helperText is present.
   * @default true
   */
  showHelper?: boolean;
  /** Associates the label with a control id when children are not auto-wired. */
  htmlFor?: string;
  disabled?: boolean;
  /** Nested input / control (Figma `inputType` slot). */
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
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

    const iconName =
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
            fontFamily: "var(--font-body)",
            ...style,
          }}
        >
          {label != null && label !== "" ? (
            <label
              id={labelId}
              htmlFor={controlId}
              style={{
                display: "block",
                fontFamily: "var(--font-body)",
                fontWeight: "var(--font-weight-semibold)" as unknown as number,
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
                  fontFamily: "var(--font-body)",
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
