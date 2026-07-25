import { motion as u } from "@codeai/cads-variables";
import { createContext as f, useState as n, useRef as m, useEffect as l, useContext as p } from "react";
const g = f(!1);
function b() {
  return p(g);
}
function y(a, t) {
  return t ? { duration: 0 } : u.spring[a];
}
function v() {
  if (typeof document > "u") return 200;
  const a = getComputedStyle(document.documentElement).getPropertyValue("--motion-surface-duration").trim();
  if (a.endsWith("ms")) {
    const t = Number.parseFloat(a);
    return Number.isFinite(t) ? t : 200;
  }
  if (a.endsWith("s")) {
    const t = Number.parseFloat(a) * 1e3;
    return Number.isFinite(t) ? t : 200;
  }
  return 200;
}
function S(a) {
  const t = b(), [o, s] = n(a), [i, e] = n(!1), r = m(a);
  return l(() => {
    if (!t) {
      r.current = a, s(a), e(!1);
      return;
    }
    if (a) {
      r.current = !0, s(!0), e(!1);
      return;
    }
    if (!r.current) return;
    e(!0);
    const d = v(), c = window.setTimeout(() => {
      r.current = !1, s(!1), e(!1);
    }, d);
    return () => window.clearTimeout(c);
  }, [a, t]), t ? { mounted: o, exiting: i } : { mounted: a, exiting: !1 };
}
const x = `
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
export {
  x as EXPERIMENTAL_MOTION_CSS,
  g as ExperimentalMotionContext,
  v as readSurfaceDurationMs,
  y as springTransition,
  b as useExperimentalMotion,
  S as useSurfacePresence
};
//# sourceMappingURL=experimentalMotion.js.map
