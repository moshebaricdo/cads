import { CSSProperties, ReactNode } from 'react';
import { FaIconName } from '../../icons/faProRegularCodepoints';
import { ControlSize } from '../../shared/controlSize';
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
     * Optional icon beside default-sentiment helper text. Omit for no icon
     * (Figma `showHelperIcon` collapsed into presence of this prop).
     * Non-default sentiments always use fixed icons and ignore this prop.
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
//# sourceMappingURL=types.d.ts.map