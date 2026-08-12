"use client";

import { motion as motionVars } from "@moshebaricdo/cads-variables";
import type { Transition } from "motion/react";
import {
  createContext,
  useContext,
  useLayoutEffect,
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
 *
 * `entering` is true only for a real open transition — not when motion is
 * toggled on while the surface is already open (avoids replaying enter).
 */
export function useSurfacePresence(open: boolean): {
  mounted: boolean;
  exiting: boolean;
  entering: boolean;
} {
  const experimentalMotion = useExperimentalMotion();
  const [mounted, setMounted] = useState(open);
  const [exiting, setExiting] = useState(false);
  const [entering, setEntering] = useState(false);
  const mountedRef = useRef(open);
  const motionWasOnRef = useRef(experimentalMotion);

  useLayoutEffect(() => {
    if (!experimentalMotion) {
      mountedRef.current = open;
      motionWasOnRef.current = false;
      setMounted(open);
      setExiting(false);
      setEntering(false);
      return;
    }

    const motionJustEnabled = !motionWasOnRef.current;
    motionWasOnRef.current = true;

    // Motion opted in while already open — stay put, do not replay enter.
    if (motionJustEnabled && open && mountedRef.current) {
      setMounted(true);
      setExiting(false);
      setEntering(false);
      return;
    }

    if (open) {
      mountedRef.current = true;
      setMounted(true);
      setExiting(false);
      setEntering(true);
      const ms = readSurfaceDurationMs();
      const id = window.setTimeout(() => setEntering(false), ms);
      return () => window.clearTimeout(id);
    }
    if (!mountedRef.current) return;
    setEntering(false);
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
    return { mounted: open, exiting: false, entering: false };
  }
  return { mounted, exiting, entering };
}

/** `data-cads-surface-state` for enter/exit CSS recipes (omit when settled). */
export function surfaceMotionStateAttrs(
  entering: boolean,
  exiting: boolean,
): { "data-cads-surface-state"?: "enter" | "exit" } {
  if (exiting) return { "data-cads-surface-state": "exit" };
  if (entering) return { "data-cads-surface-state": "enter" };
  return {};
}

/**
 * Mark portaled hosts so scoped motion CSS still applies outside the
 * provider’s DOM subtree (MUI Popper → `document.body`).
 */
export function experimentalMotionHostAttrs(enabled: boolean): {
  "data-cads-experimental-motion"?: "";
} {
  return enabled ? { "data-cads-experimental-motion": "" } : {};
}

/**
 * Recipes are scoped to `[data-cads-experimental-motion]` (self or ancestor)
 * so nested demos can opt out via `[data-cads-experimental-motion-scope="off"]`
 * without competing with a docs-wide or sibling provider’s stylesheet.
 *
 * Portaled overlays must self-mark with `experimentalMotionHostAttrs(true)`.
 */
export const EXPERIMENTAL_MOTION_CSS = `
/* —— Press —— */
[data-cads-experimental-motion] [data-cads-press],
[data-cads-experimental-motion][data-cads-press] {
  transition: var(--transition-colors), var(--transition-press);
}
[data-cads-experimental-motion] [data-cads-dropdown] > [data-cads-press],
[data-cads-experimental-motion] [data-cads-dropdown-trigger][data-cads-press],
[data-cads-experimental-motion][data-cads-dropdown] > [data-cads-press],
[data-cads-experimental-motion][data-cads-dropdown-trigger][data-cads-press] {
  transition: var(--transition-colors);
}
@media (hover: hover) and (pointer: fine) {
  [data-cads-experimental-motion] [data-cads-press]:active:not(:disabled):not(.Mui-disabled):not([aria-disabled="true"]),
  [data-cads-experimental-motion][data-cads-press]:active:not(:disabled):not(.Mui-disabled):not([aria-disabled="true"]) {
    transform: scale(var(--motion-press-scale));
  }
  [data-cads-experimental-motion] [data-cads-dropdown] > [data-cads-press]:active:not(:disabled):not(.Mui-disabled):not([aria-disabled="true"]),
  [data-cads-experimental-motion] [data-cads-dropdown-trigger][data-cads-press]:active:not(:disabled):not(.Mui-disabled):not([aria-disabled="true"]),
  [data-cads-experimental-motion][data-cads-dropdown] > [data-cads-press]:active:not(:disabled):not(.Mui-disabled):not([aria-disabled="true"]),
  [data-cads-experimental-motion][data-cads-dropdown-trigger][data-cads-press]:active:not(:disabled):not(.Mui-disabled):not([aria-disabled="true"]) {
    transform: none;
  }
}

/* —— Surface —— */
[data-cads-experimental-motion] [data-cads-surface][data-cads-surface-state="enter"],
[data-cads-experimental-motion][data-cads-surface][data-cads-surface-state="enter"] {
  transform-origin: var(--cads-surface-origin, center);
  animation: cads-surface-in var(--motion-surface-duration) var(--motion-surface-easing) both;
}
[data-cads-experimental-motion] [data-cads-surface][data-cads-surface-state="exit"],
[data-cads-experimental-motion][data-cads-surface][data-cads-surface-state="exit"] {
  transform-origin: var(--cads-surface-origin, center);
  animation: cads-surface-out var(--motion-surface-duration) var(--motion-surface-easing) both;
}

/* —— Nested opt-out (e.g. In Action preview off while docs-wide motion is on) —— */
[data-cads-experimental-motion-scope="off"] [data-cads-press],
[data-cads-experimental-motion-scope="off"][data-cads-press] {
  transition: var(--transition-colors);
}
@media (hover: hover) and (pointer: fine) {
  [data-cads-experimental-motion-scope="off"] [data-cads-press]:active:not(:disabled):not(.Mui-disabled):not([aria-disabled="true"]),
  [data-cads-experimental-motion-scope="off"][data-cads-press]:active:not(:disabled):not(.Mui-disabled):not([aria-disabled="true"]) {
    transform: none;
  }
  [data-cads-experimental-motion-scope="off"] [data-cads-toggle]:active:not(.Mui-disabled) [data-cads-indicator]:not([data-cads-indicator-spring]),
  [data-cads-experimental-motion-scope="off"] [data-cads-toggle]:active:not(.Mui-disabled) [data-cads-indicator-face] {
    transform: none;
  }
}
[data-cads-experimental-motion-scope="off"] [data-cads-surface][data-cads-surface-state="enter"],
[data-cads-experimental-motion-scope="off"] [data-cads-surface][data-cads-surface-state="exit"],
[data-cads-experimental-motion-scope="off"][data-cads-surface][data-cads-surface-state="enter"],
[data-cads-experimental-motion-scope="off"][data-cads-surface][data-cads-surface-state="exit"] {
  animation: none;
  opacity: 1;
  transform: none;
}
[data-cads-experimental-motion-scope="off"] [data-cads-indicator]:not([data-cads-indicator-spring]) {
  transition: none;
}

/* Re-enable motion islands nested inside an off scope (Recipe demos under docs-off). */
[data-cads-experimental-motion-scope="off"] [data-cads-experimental-motion] [data-cads-press],
[data-cads-experimental-motion-scope="off"] [data-cads-experimental-motion][data-cads-press] {
  transition: var(--transition-colors), var(--transition-press);
}
[data-cads-experimental-motion-scope="off"] [data-cads-experimental-motion] [data-cads-dropdown] > [data-cads-press],
[data-cads-experimental-motion-scope="off"] [data-cads-experimental-motion] [data-cads-dropdown-trigger][data-cads-press] {
  transition: var(--transition-colors);
}
@media (hover: hover) and (pointer: fine) {
  [data-cads-experimental-motion-scope="off"] [data-cads-experimental-motion] [data-cads-press]:active:not(:disabled):not(.Mui-disabled):not([aria-disabled="true"]),
  [data-cads-experimental-motion-scope="off"] [data-cads-experimental-motion][data-cads-press]:active:not(:disabled):not(.Mui-disabled):not([aria-disabled="true"]) {
    transform: scale(var(--motion-press-scale));
  }
  [data-cads-experimental-motion-scope="off"] [data-cads-experimental-motion] [data-cads-dropdown] > [data-cads-press]:active:not(:disabled):not(.Mui-disabled):not([aria-disabled="true"]),
  [data-cads-experimental-motion-scope="off"] [data-cads-experimental-motion] [data-cads-dropdown-trigger][data-cads-press]:active:not(:disabled):not(.Mui-disabled):not([aria-disabled="true"]) {
    transform: none;
  }
  [data-cads-experimental-motion-scope="off"] [data-cads-experimental-motion] [data-cads-toggle]:active:not(.Mui-disabled) [data-cads-indicator]:not([data-cads-indicator-spring]),
  [data-cads-experimental-motion-scope="off"] [data-cads-experimental-motion] [data-cads-toggle]:active:not(.Mui-disabled) [data-cads-indicator-face] {
    transform: scale(var(--motion-press-scale));
  }
}
[data-cads-experimental-motion-scope="off"] [data-cads-experimental-motion] [data-cads-surface][data-cads-surface-state="enter"],
[data-cads-experimental-motion-scope="off"] [data-cads-experimental-motion][data-cads-surface][data-cads-surface-state="enter"] {
  transform-origin: var(--cads-surface-origin, center);
  animation: cads-surface-in var(--motion-surface-duration) var(--motion-surface-easing) both;
}
[data-cads-experimental-motion-scope="off"] [data-cads-experimental-motion] [data-cads-surface][data-cads-surface-state="exit"],
[data-cads-experimental-motion-scope="off"] [data-cads-experimental-motion][data-cads-surface][data-cads-surface-state="exit"] {
  transform-origin: var(--cads-surface-origin, center);
  animation: cads-surface-out var(--motion-surface-duration) var(--motion-surface-easing) both;
}
[data-cads-experimental-motion-scope="off"] [data-cads-experimental-motion] [data-cads-indicator]:not([data-cads-indicator-spring]) {
  transition: var(--transition-indicator);
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
[data-cads-experimental-motion] [data-cads-indicator]:not([data-cads-indicator-spring]),
[data-cads-experimental-motion][data-cads-indicator]:not([data-cads-indicator-spring]) {
  transition: var(--transition-indicator);
}
/* Tabs primary underline: match selected-strong on hover of the selected tab. */
[data-cads-experimental-motion] [data-cads-tabs]:has([role="tab"][aria-selected="true"]:hover:not(.Mui-disabled))
  [data-cads-tabs-indicator="primary"],
[data-cads-experimental-motion][data-cads-tabs]:has([role="tab"][aria-selected="true"]:hover:not(.Mui-disabled))
  [data-cads-tabs-indicator="primary"] {
  background-color: var(--border-selected-strong);
}
@media (hover: hover) and (pointer: fine) {
  [data-cads-experimental-motion] [data-cads-toggle]:active:not(.Mui-disabled) [data-cads-indicator]:not([data-cads-indicator-spring]),
  [data-cads-experimental-motion] [data-cads-toggle]:active:not(.Mui-disabled) [data-cads-indicator-face] {
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
  [data-cads-experimental-motion] [data-cads-press]:active:not(:disabled):not(.Mui-disabled):not([aria-disabled="true"]),
  [data-cads-experimental-motion][data-cads-press]:active:not(:disabled):not(.Mui-disabled):not([aria-disabled="true"]) {
    transform: none;
  }
  [data-cads-experimental-motion] [data-cads-toggle]:active:not(.Mui-disabled) [data-cads-indicator]:not([data-cads-indicator-spring]),
  [data-cads-experimental-motion] [data-cads-toggle]:active:not(.Mui-disabled) [data-cads-indicator-face] {
    transform: none;
  }
  [data-cads-indicator-face] {
    transition: none;
  }
  [data-cads-experimental-motion] [data-cads-surface],
  [data-cads-experimental-motion][data-cads-surface] {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
`;
