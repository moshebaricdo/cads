import { motion as v } from "@codeai/cads-variables";
import { createContext as M, useContext as h, useState as n, useRef as r, useLayoutEffect as w } from "react";
const y = M(!1);
function S() {
  return h(y);
}
function C(a, t) {
  return t ? { duration: 0 } : v.spring[a];
}
function c() {
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
function k(a) {
  const t = S(), [m, o] = n(a), [f, e] = n(!1), [l, s] = n(!1), d = r(a), i = r(t);
  return w(() => {
    if (!t) {
      d.current = a, i.current = !1, o(a), e(!1), s(!1);
      return;
    }
    const p = !i.current;
    if (i.current = !0, p && a && d.current) {
      o(!0), e(!1), s(!1);
      return;
    }
    if (a) {
      d.current = !0, o(!0), e(!1), s(!0);
      const b = c(), g = window.setTimeout(() => s(!1), b);
      return () => window.clearTimeout(g);
    }
    if (!d.current) return;
    s(!1), e(!0);
    const u = c(), x = window.setTimeout(() => {
      d.current = !1, o(!1), e(!1);
    }, u);
    return () => window.clearTimeout(x);
  }, [a, t]), t ? { mounted: m, exiting: f, entering: l } : { mounted: a, exiting: !1, entering: !1 };
}
function N(a, t) {
  return t ? { "data-cads-surface-state": "exit" } : a ? { "data-cads-surface-state": "enter" } : {};
}
function R(a) {
  return a ? { "data-cads-experimental-motion": "" } : {};
}
const I = `
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
export {
  I as EXPERIMENTAL_MOTION_CSS,
  y as ExperimentalMotionContext,
  R as experimentalMotionHostAttrs,
  c as readSurfaceDurationMs,
  C as springTransition,
  N as surfaceMotionStateAttrs,
  S as useExperimentalMotion,
  k as useSurfacePresence
};
//# sourceMappingURL=experimentalMotion.js.map
