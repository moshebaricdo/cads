import * as react from 'react';
import { InputHTMLAttributes, ReactNode, ChangeEvent, CSSProperties } from 'react';
import { FieldSentiment } from './FieldWrapper.js';
import { FaIconName } from '../icons/faProRegularCodepoints.js';
import { ControlSize } from '../shared/controlSize.js';

type TextInputSize = ControlSize;
type TextInputColor = "primary" | "secondary";
type SharedNativeProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "color" | "value" | "defaultValue" | "onChange" | "children">;
interface TextInputProps extends SharedNativeProps {
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
     * Leading FA icon inside the field (Figma building-block `startIcon` +
     * `startIconName`). Field-only; ignored for multiline areas. Omit for no
     * icon (Figma’s boolean is collapsed into presence of this prop).
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
    onChange?: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    rows?: number;
    readOnly?: boolean;
    disabled?: boolean;
    placeholder?: string;
    className?: string;
    style?: CSSProperties;
    /** Optional override for the native control id. */
    id?: string;
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
declare const TextInput: react.ForwardRefExoticComponent<TextInputProps & react.RefAttributes<HTMLDivElement>>;

export { TextInput, type TextInputColor, type TextInputProps, type TextInputSize };
