"use client";

import { motion as motionVars } from "@codeai/cads-variables";
import type { Transition } from "motion/react";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

/**
 * When true, Press / Surface / Indicator recipes apply.
 * Default false — opt in via `CadsProvider experimentalMotion`.
 */
export const ExperimentalMotionContext = createContext(false);

export function useExperimentalMotion(): boolean {
  return useContext(ExperimentalMotionContext);
}

export type MotionSpringName = keyof typeof motionVars.spring;

/**
 * Motion spring transition from CADS presets. Snaps when reduced motion.
 */
export function springTransition(
  name: MotionSpringName,
  reduceMotion: boolean | null | undefined,
): Transition {
  if (reduceMotion) return { duration: 0 };
  return motionVars.spring[name];
}

/** Read `--motion-surface-duration` from the document (fallback 200ms = medium). */
export function readSurfaceDurationMs(): number {
  if (typeof document === "undefined") return 200;
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--motion-surface-duration")
    .trim();
  if (raw.endsWith("ms")) {
    const n = Number.parseFloat(raw);
    return Number.isFinite(n) ? n : 200;
  }
  if (raw.endsWith("s")) {
    const n = Number.parseFloat(raw) * 1000;
    return Number.isFinite(n) ? n : 200;
  }
  return 200;
}

/**
 * Keeps a Surface mounted through its exit animation when experimental motion
 * is on. When the flag is off, `mounted` mirrors `open` with no exit phase.
 */
export function useSurfacePresence(open: boolean): {
  mounted: boolean;
  exiting: boolean;
} {
  const experimentalMotion = useExperimentalMotion();
  const [mounted, setMounted] = useState(open);
  const [exiting, setExiting] = useState(false);
  const mountedRef = useRef(open);

  useEffect(() => {
    if (!experimentalMotion) {
      mountedRef.current = open;
      setMounted(open);
      setExiting(false);
      return;
    }
    if (open) {
      mountedRef.current = true;
      setMounted(true);
      setExiting(false);
      return;
    }
    if (!mountedRef.current) return;
    setExiting(true);
    const ms = readSurfaceDurationMs();
    const id = window.setTimeout(() => {
      mountedRef.current = false;
      setMounted(false);
      setExiting(false);
    }, ms);
    return () => window.clearTimeout(id);
  }, [open, experimentalMotion]);

  if (!experimentalMotion) {
    return { mounted: open, exiting: false };
  }
  return { mounted, exiting };
}

/**
 * Recipes applied while this stylesheet is injected (see CadsProvider).
 * Selectors intentionally do **not** require a `[data-cads-experimental-motion]`
 * ancestor — MUI Popper portals overlays to `document.body`, so descendant
 * selectors would miss Popover / future Dialog surfaces.
 */
export const EXPERIMENTAL_MOTION_CSS = `
[data-cads-press] {
  transition: var(--transition-colors), var(--transition-press);
}
/*
 * Dropdown triggers skip Press scale — movement is reserved for the menu
 * Surface. Input omits data-cads-press; action keeps Button's attr but
 * drops scale + press transition so the trigger doesn't compete on open.
 */
[data-cads-dropdown] > [data-cads-press],
[data-cads-dropdown-trigger][data-cads-press] {
  transition: var(--transition-colors);
}
@media (hover: hover) and (pointer: fine) {
  [data-cads-press]:active:not(:disabled):not(.Mui-disabled):not([aria-disabled="true"]) {
    transform: scale(var(--motion-press-scale));
  }
  [data-cads-dropdown] > [data-cads-press]:active:not(:disabled):not(.Mui-disabled):not([aria-disabled="true"]),
  [data-cads-dropdown-trigger][data-cads-press]:active:not(:disabled):not(.Mui-disabled):not([aria-disabled="true"]) {
    transform: none;
  }
}
[data-cads-surface]:not([data-cads-surface-state="exit"]) {
  transform-origin: var(--cads-surface-origin, center);
  animation: cads-surface-in var(--motion-surface-duration) var(--motion-surface-easing) both;
}
[data-cads-surface][data-cads-surface-state="exit"] {
  transform-origin: var(--cads-surface-origin, center);
  animation: cads-surface-out var(--motion-surface-duration) var(--motion-surface-easing) both;
}
/*
 * Tooltips use MUI Grow for symmetric enter/exit (CSS keyframes fought the
 * Transition and made close feel delayed). Class only pins transform-origin.
 */
.cads-tooltip-surface {
  transform-origin: var(--cads-surface-origin, center) !important;
}
@keyframes cads-surface-in {
  from {
    opacity: 0;
    transform: scale(var(--motion-surface-from-scale));
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes cads-surface-out {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(var(--motion-surface-from-scale));
  }
}
/*
 * CSS Indicator fallback. Spring path sets data-cads-indicator-spring and
 * drives transform via Motion — skip the CSS transition so they don’t fight.
 */
[data-cads-indicator]:not([data-cads-indicator-spring]) {
  transition: var(--transition-indicator);
}
/* Tabs primary underline: match selected-strong on hover of the selected tab. */
[data-cads-tabs]:has([role="tab"][aria-selected="true"]:hover:not(.Mui-disabled))
  [data-cads-tabs-indicator="primary"] {
  background-color: var(--border-selected-strong);
}
/*
 * Toggle handle press-scale. Spring path nests the painted face so Motion’s
 * x transform and CSS scale don’t clobber each other.
 */
@media (hover: hover) and (pointer: fine) {
  [data-cads-toggle]:active:not(.Mui-disabled) [data-cads-indicator]:not([data-cads-indicator-spring]) {
    transform: scale(var(--motion-press-scale));
  }
  [data-cads-toggle]:active:not(.Mui-disabled) [data-cads-indicator-face] {
    transform: scale(var(--motion-press-scale));
  }
}
[data-cads-indicator-face] {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  background: inherit;
  transition: transform var(--motion-press-duration) var(--motion-press-easing);
}
@media (prefers-reduced-motion: reduce) {
  [data-cads-press]:active:not(:disabled):not(.Mui-disabled):not([aria-disabled="true"]) {
    transform: none;
  }
  [data-cads-toggle]:active:not(.Mui-disabled) [data-cads-indicator]:not([data-cads-indicator-spring]),
  [data-cads-toggle]:active:not(.Mui-disabled) [data-cads-indicator-face] {
    transform: none;
  }
  [data-cads-indicator-face] {
    transition: none;
  }
  [data-cads-surface] {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
`;
