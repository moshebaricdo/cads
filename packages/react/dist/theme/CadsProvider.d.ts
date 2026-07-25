import * as react from 'react';
import { ReactNode } from 'react';

interface CadsProviderProps {
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
declare function CadsProvider({ children, baseline, experimentalMotion, }: CadsProviderProps): react.JSX.Element;

export { CadsProvider, type CadsProviderProps };
