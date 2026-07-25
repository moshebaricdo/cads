import { TextInputProps } from './types';
export type { TextInputProps, TextInputSize, TextInputColor } from './types';
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
export declare const TextInput: import('react').ForwardRefExoticComponent<TextInputProps & import('react').RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=TextInput.d.ts.map