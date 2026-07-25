import { ReactNode } from 'react';
export interface CadsProviderProps {
    children: ReactNode;
    /** When true, injects MUI CssBaseline. Default true. */
    baseline?: boolean;
    /**
     * Opt into experimental micro-interaction recipes (Press, Surface,
     * Indicator, Highlight chase). Default false — API/feel may change.
     */
    experimentalMotion?: boolean;
}
/**
 * Provides the CADS MUI theme. Pair with `@codeai/cads-variables/variables.css`
 * and toggle `.dark` on an ancestor for dark mode.
 */
export declare function CadsProvider({ children, baseline, experimentalMotion, }: CadsProviderProps): import("react").JSX.Element;
//# sourceMappingURL=CadsProvider.d.ts.map