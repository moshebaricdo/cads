import { createContext, useContext, useState, useRef, useEffect } from 'react';

const ExperimentalMotionContext = createContext(false);
function useExperimentalMotion() {
  return useContext(ExperimentalMotionContext);
}
function readSurfaceDurationMs() {
  if (typeof document === "undefined") return 180;
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--motion-surface-duration").trim();
  if (raw.endsWith("ms")) {
    const n = Number.parseFloat(raw);
    return Number.isFinite(n) ? n : 180;
  }
  if (raw.endsWith("s")) {
    const n = Number.parseFloat(raw) * 1e3;
    return Number.isFinite(n) ? n : 180;
  }
  return 180;
}
function useSurfacePresence(open) {
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
const EXPERIMENTAL_MOTION_CSS = `
[data-cads-press] {
  transition: var(--transition-colors), var(--transition-press);
}
/*
 * Dropdown triggers skip Press scale \u2014 movement is reserved for the menu
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
[data-cads-indicator] {
  transition: var(--transition-indicator);
}
/* Tabs primary underline: match selected-strong on hover of the selected tab. */
[data-cads-tabs]:has([role="tab"][aria-selected="true"]:hover:not(.Mui-disabled))
  [data-cads-tabs-indicator="primary"] {
  background-color: var(--border-selected-strong);
}
/* Toggle handle: slight press-scale while the switch is held. */
@media (hover: hover) and (pointer: fine) {
  [data-cads-toggle]:active:not(.Mui-disabled) [data-cads-indicator] {
    transform: scale(var(--motion-press-scale));
  }
}
@media (prefers-reduced-motion: reduce) {
  [data-cads-press]:active:not(:disabled):not(.Mui-disabled):not([aria-disabled="true"]) {
    transform: none;
  }
  [data-cads-toggle]:active:not(.Mui-disabled) [data-cads-indicator] {
    transform: none;
  }
  [data-cads-surface] {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
`;

export { EXPERIMENTAL_MOTION_CSS, ExperimentalMotionContext, readSurfaceDurationMs, useExperimentalMotion, useSurfacePresence };
//# sourceMappingURL=experimentalMotion.js.map
//# sourceMappingURL=experimentalMotion.js.map