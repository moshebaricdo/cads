import { ProgressWidgetProps } from './types';
/**
 * Lab progress widget from the CADS Global Header (Figma 17307:1036).
 *
 * Desktop (≥992px): level dropdown (hugs its label, truncates when the
 * viewport forces it) + cloud sync status + bubble rail + action button.
 * Tablet (768–991px): leading back button · dropdown + cloud · the active
 * level bubble in its own slot · action.
 * Compact (<768px): back + ellipsis "More" menu · active bubble · action —
 * the dropdown and cloud fold away (Figma `<768px`, saveStatus `n/a`).
 * `version="template"` renders three blank slots in the same chrome.
 */
export declare const ProgressWidget: import('react').ForwardRefExoticComponent<ProgressWidgetProps & import('react').RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=ProgressWidget.d.ts.map