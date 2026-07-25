import * as react from 'react';
import { motion } from '@codeai/cads-variables';
import { Transition } from 'motion/react';

/**
 * When true, Press / Surface / Indicator recipes apply.
 * Default false — opt in via `CadsProvider experimentalMotion`.
 */
declare const ExperimentalMotionContext: react.Context<boolean>;
declare function useExperimentalMotion(): boolean;
type MotionSpringName = keyof typeof motion.spring;
/**
 * Motion spring transition from CADS presets. Snaps when reduced motion.
 */
declare function springTransition(name: MotionSpringName, reduceMotion: boolean | null | undefined): Transition;
/** Read `--motion-surface-duration` from the document (fallback 200ms = medium). */
declare function readSurfaceDurationMs(): number;
/**
 * Keeps a Surface mounted through its exit animation when experimental motion
 * is on. When the flag is off, `mounted` mirrors `open` with no exit phase.
 */
declare function useSurfacePresence(open: boolean): {
    mounted: boolean;
    exiting: boolean;
};
/**
 * Recipes applied while this stylesheet is injected (see CadsProvider).
 * Selectors intentionally do **not** require a `[data-cads-experimental-motion]`
 * ancestor — MUI Popper portals overlays to `document.body`, so descendant
 * selectors would miss Popover / future Dialog surfaces.
 */
declare const EXPERIMENTAL_MOTION_CSS = "\n[data-cads-press] {\n  transition: var(--transition-colors), var(--transition-press);\n}\n/*\n * Dropdown triggers skip Press scale \u2014 movement is reserved for the menu\n * Surface. Input omits data-cads-press; action keeps Button's attr but\n * drops scale + press transition so the trigger doesn't compete on open.\n */\n[data-cads-dropdown] > [data-cads-press],\n[data-cads-dropdown-trigger][data-cads-press] {\n  transition: var(--transition-colors);\n}\n@media (hover: hover) and (pointer: fine) {\n  [data-cads-press]:active:not(:disabled):not(.Mui-disabled):not([aria-disabled=\"true\"]) {\n    transform: scale(var(--motion-press-scale));\n  }\n  [data-cads-dropdown] > [data-cads-press]:active:not(:disabled):not(.Mui-disabled):not([aria-disabled=\"true\"]),\n  [data-cads-dropdown-trigger][data-cads-press]:active:not(:disabled):not(.Mui-disabled):not([aria-disabled=\"true\"]) {\n    transform: none;\n  }\n}\n[data-cads-surface]:not([data-cads-surface-state=\"exit\"]) {\n  transform-origin: var(--cads-surface-origin, center);\n  animation: cads-surface-in var(--motion-surface-duration) var(--motion-surface-easing) both;\n}\n[data-cads-surface][data-cads-surface-state=\"exit\"] {\n  transform-origin: var(--cads-surface-origin, center);\n  animation: cads-surface-out var(--motion-surface-duration) var(--motion-surface-easing) both;\n}\n/*\n * Tooltips use MUI Grow for symmetric enter/exit (CSS keyframes fought the\n * Transition and made close feel delayed). Class only pins transform-origin.\n */\n.cads-tooltip-surface {\n  transform-origin: var(--cads-surface-origin, center) !important;\n}\n@keyframes cads-surface-in {\n  from {\n    opacity: 0;\n    transform: scale(var(--motion-surface-from-scale));\n  }\n  to {\n    opacity: 1;\n    transform: scale(1);\n  }\n}\n@keyframes cads-surface-out {\n  from {\n    opacity: 1;\n    transform: scale(1);\n  }\n  to {\n    opacity: 0;\n    transform: scale(var(--motion-surface-from-scale));\n  }\n}\n/*\n * CSS Indicator fallback. Spring path sets data-cads-indicator-spring and\n * drives transform via Motion \u2014 skip the CSS transition so they don\u2019t fight.\n */\n[data-cads-indicator]:not([data-cads-indicator-spring]) {\n  transition: var(--transition-indicator);\n}\n/* Tabs primary underline: match selected-strong on hover of the selected tab. */\n[data-cads-tabs]:has([role=\"tab\"][aria-selected=\"true\"]:hover:not(.Mui-disabled))\n  [data-cads-tabs-indicator=\"primary\"] {\n  background-color: var(--border-selected-strong);\n}\n/*\n * Toggle handle press-scale. Spring path nests the painted face so Motion\u2019s\n * x transform and CSS scale don\u2019t clobber each other.\n */\n@media (hover: hover) and (pointer: fine) {\n  [data-cads-toggle]:active:not(.Mui-disabled) [data-cads-indicator]:not([data-cads-indicator-spring]) {\n    transform: scale(var(--motion-press-scale));\n  }\n  [data-cads-toggle]:active:not(.Mui-disabled) [data-cads-indicator-face] {\n    transform: scale(var(--motion-press-scale));\n  }\n}\n[data-cads-indicator-face] {\n  display: block;\n  width: 100%;\n  height: 100%;\n  border-radius: inherit;\n  background: inherit;\n  transition: transform var(--motion-press-duration) var(--motion-press-easing);\n}\n@media (prefers-reduced-motion: reduce) {\n  [data-cads-press]:active:not(:disabled):not(.Mui-disabled):not([aria-disabled=\"true\"]) {\n    transform: none;\n  }\n  [data-cads-toggle]:active:not(.Mui-disabled) [data-cads-indicator]:not([data-cads-indicator-spring]),\n  [data-cads-toggle]:active:not(.Mui-disabled) [data-cads-indicator-face] {\n    transform: none;\n  }\n  [data-cads-indicator-face] {\n    transition: none;\n  }\n  [data-cads-surface] {\n    animation: none;\n    opacity: 1;\n    transform: none;\n  }\n}\n";

export { EXPERIMENTAL_MOTION_CSS, ExperimentalMotionContext, type MotionSpringName, readSurfaceDurationMs, springTransition, useExperimentalMotion, useSurfacePresence };
