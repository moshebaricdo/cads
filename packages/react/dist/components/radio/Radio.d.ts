import { RadioProps } from './types';
export type { RadioProps, RadioSize, RadioLabelStyle } from './types';
/**
 * CADS Radio — circular radio with selected ring + inner dot (not a filled square).
 * Spec: Figma Radio Button + Label `4675:6352` / Radio Buttons Block `13257:411`.
 * Interaction states via CSS pseudo-classes — no `state` React prop.
 * Group with MUI `RadioGroup` when needed.
 */
export declare const Radio: import('react').ForwardRefExoticComponent<Omit<RadioProps, "ref"> & import('react').RefAttributes<HTMLButtonElement>>;
//# sourceMappingURL=Radio.d.ts.map