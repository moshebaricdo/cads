import { IconTooltipProps } from './types';
export type { IconTooltipColor, IconTooltipProps, IconTooltipSize } from './types';
/**
 * CADS Icon Tooltip — an info-style icon that is purely a tooltip affordance.
 * No button chrome (fill/border/press scale); only a required focus ring on
 * keyboard focus. Composes `Tooltip` for positioning/caret — this component
 * only owns the trigger glyph.
 *
 * Spec: Figma Info Tooltip `17051:27346` (size × color × state), authored from
 * this implementation. `placement` / `hasCaret` come from the `Tooltip` set
 * (`1990:7125`); Figma only models the default top placement.
 */
export declare const IconTooltip: import('react').ForwardRefExoticComponent<Omit<IconTooltipProps, "ref"> & import('react').RefAttributes<HTMLButtonElement>>;
//# sourceMappingURL=IconTooltip.d.ts.map