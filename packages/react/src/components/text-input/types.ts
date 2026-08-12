import type {
  ChangeEvent,
  CSSProperties,
  InputHTMLAttributes,
  ReactNode,
} from "react";
import type { FaIconName } from "../../icons/faProRegularCodepoints";
import type { FieldSentiment } from "../field-wrapper/types";
import type { ControlSize } from "../../shared/controlSize";

export type TextInputSize = ControlSize;
export type TextInputColor = "primary" | "secondary";

export type SharedNativeProps = Omit<
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
   * Start icon is field-only and ignored when multiline.
   * @default false
   */
  multiline?: boolean;
  /**
   * Leading FA icon inside the field (Figma building-block `startIcon` +
   * `startIconName`). Field-only; ignored for multiline areas. Omit for no
   * icon (Figma's boolean is collapsed into presence of this prop).
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
  /**
   * Optional Field Wrapper helper icon for default sentiment. Omit for no
   * icon; non-default sentiments use fixed icons.
   */
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
