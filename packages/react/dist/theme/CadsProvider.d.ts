import * as react from 'react';
import { ReactNode } from 'react';

interface CadsProviderProps {
    children: ReactNode;
    /** When true, injects MUI CssBaseline. Default true. */
    baseline?: boolean;
}
/**
 * Provides the CADS MUI theme. Pair with `@codeai/cads-variables/variables.css`
 * and toggle `.dark` on an ancestor for dark mode.
 */
declare function CadsProvider({ children, baseline }: CadsProviderProps): react.JSX.Element;

export { CadsProvider, type CadsProviderProps };
