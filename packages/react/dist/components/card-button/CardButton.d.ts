import { CardButtonProps } from './types';
export type { CardButtonLayout, CardButtonProps, CardButtonSize, } from './types';
/**
 * CADS Card Button — a clickable card for actions, navigation, and choices
 * that need more presence than a Button.
 * Spec: Figma Card Button `17848:283` (layout × size × state × selected).
 *
 * Hugs its content by default (like Button); pass `fullWidth` to fill the
 * container (stacks, grid cells, equal-width tiles). Pass `href` for a link card.
 */
export declare const CardButton: import('react').ForwardRefExoticComponent<Omit<CardButtonProps, "ref"> & import('react').RefAttributes<HTMLButtonElement>>;
//# sourceMappingURL=CardButton.d.ts.map