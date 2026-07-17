import * as react from 'react';
import { TextInputProps, TextInputSize } from './TextInput.js';
import './FieldWrapper.js';
import '../icons/faProRegularCodepoints.js';
import '../shared/controlSize.js';

/**
 * @deprecated Prefer `TextInput`. Kept as a compatibility alias for early pilots.
 */
type TextFieldSize = TextInputSize;
/**
 * @deprecated Prefer `TextInput`. Kept as a compatibility alias for early pilots.
 */
type TextFieldProps = TextInputProps;
/**
 * @deprecated Prefer `TextInput`. Compatibility alias that forwards to TextInput.
 * Spec source: CADS Figma Text Input (`16176:4884`).
 */
declare const TextField: react.ForwardRefExoticComponent<TextInputProps & react.RefAttributes<HTMLDivElement>>;

export { TextField, type TextFieldProps, type TextFieldSize };
