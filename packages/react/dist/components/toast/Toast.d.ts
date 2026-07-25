import { ToastProps } from './types';
export type { ToastPlacement, ToastProps, ToastSentiment } from './types';
/**
 * CADS Toast — temporary elevated feedback notification.
 * Spec: Figma Toast `10587:14942` / key `29c36f3d7ec051b81e7dc42a724d9097a680f2ee`.
 *
 * Presentational when `open` is omitted (fixtures). Pass `open` to host via
 * MUI Snackbar with viewport `placement` + `offset`.
 */
export declare const Toast: import('react').ForwardRefExoticComponent<ToastProps & import('react').RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=Toast.d.ts.map