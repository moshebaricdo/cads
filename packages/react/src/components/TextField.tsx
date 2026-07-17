import { forwardRef } from "react";
import { TextInput, type TextInputProps, type TextInputSize } from "./TextInput";

/**
 * @deprecated Prefer `TextInput`. Kept as a compatibility alias for early pilots.
 */
export type TextFieldSize = TextInputSize;

/**
 * @deprecated Prefer `TextInput`. Kept as a compatibility alias for early pilots.
 */
export type TextFieldProps = TextInputProps;

/**
 * @deprecated Prefer `TextInput`. Compatibility alias that forwards to TextInput.
 * Spec source: CADS Figma Text Input (`16176:4884`).
 */
export const TextField = forwardRef<HTMLDivElement, TextFieldProps>(
  function TextField(props, ref) {
    return <TextInput ref={ref} {...props} />;
  },
);
