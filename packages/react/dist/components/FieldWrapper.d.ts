import * as react from 'react';
import { ReactNode, CSSProperties } from 'react';
import { FaIconName } from '../icons/faProRegularCodepoints.js';
import { ControlSize } from '../shared/controlSize.js';

type FieldWrapperSize = ControlSize;
type FieldSentiment = "default" | "success" | "warning" | "error";
interface FieldContextValue {
    size: FieldWrapperSize;
    sentiment: FieldSentiment;
    disabled: boolean;
    labelId: string;
    helperId: string;
    controlId: string;
    describedBy?: string;
    error: boolean;
}
declare function useFieldContext(): FieldContextValue | null;
interface FieldWrapperProps {
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
/**
 * CADS Field Wrapper — label + control slot + helper/validation messaging.
 * Spec: Figma Field Wrapper `15857:99804` / key `a76313f790928233bb8afabe35bd6f76f6e9a473`.
 */
declare const FieldWrapper: react.ForwardRefExoticComponent<FieldWrapperProps & react.RefAttributes<HTMLDivElement>>;

export { type FieldContextValue, type FieldSentiment, FieldWrapper, type FieldWrapperProps, type FieldWrapperSize, useFieldContext };
