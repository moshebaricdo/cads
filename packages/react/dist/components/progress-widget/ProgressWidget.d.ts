import { ProgressWidgetProps } from './types';
/**
 * Lab progress widget from the CADS Global Header (Figma 17307:1036).
 *
 * Desktop (≥960px): level dropdown (hugs its label, truncates when the
 * viewport forces it) + cloud sync status + bubble rail + action button.
 * Tablet/mobile (<960px): the rail folds away, the active level's bubble
 * nests inside the dropdown as a small non-interactive start icon, and a
 * leading outlined back button appears when `hasLeftAction` (Figma default).
 */
export declare const ProgressWidget: import('react').ForwardRefExoticComponent<ProgressWidgetProps & import('react').RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=ProgressWidget.d.ts.map