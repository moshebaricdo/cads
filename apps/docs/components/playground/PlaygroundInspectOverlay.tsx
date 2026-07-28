"use client";

import {
  useEffect,
  useLayoutEffect,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import styles from "./PlaygroundInspectOverlay.module.scss";

const POPOVER_GAP = 6;
const RULER_STEP = 8;
const RULER_LABEL_STEP = 32;
/** Above overlay layers (`--z-tooltip` 1500) and typical MUI stacking. */
const INSPECT_Z = 10000;

type BoxSides = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

type GapBand = {
  top: number;
  left: number;
  width: number;
  height: number;
  value: number;
  axis: "row" | "column";
};

type InspectKind = "text" | "control" | "container" | "icon" | "generic";

type Measure = {
  tag: string;
  kind: InspectKind;
  top: number;
  left: number;
  width: number;
  height: number;
  display: string;
  flexDirection: string;
  padding: BoxSides;
  margin: BoxSides;
  gap: number;
  gapBands: GapBand[];
  /** Popover values — prefer authored units (rem/em/var) over computed px. */
  paddingText: string;
  marginText: string;
  gapText: string | null;
  radiusText: string | null;
  backgroundText: string | null;
  colorText: string | null;
  fontSizeText: string | null;
  lineHeightText: string | null;
  fontFamilyText: string | null;
  fontWeightText: string | null;
  letterSpacingText: string | null;
};

type StageBounds = {
  top: number;
  left: number;
  width: number;
  height: number;
};

function px(n: number): string {
  return `${Math.round(n * 100) / 100}`;
}

function parsePx(value: string): number {
  const n = Number.parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

function readSides(
  styles: CSSStyleDeclaration,
  prefix: "padding" | "margin",
): BoxSides {
  return {
    top: parsePx(styles[`${prefix}Top` as "paddingTop"]),
    right: parsePx(styles[`${prefix}Right` as "paddingRight"]),
    bottom: parsePx(styles[`${prefix}Bottom` as "paddingBottom"]),
    left: parsePx(styles[`${prefix}Left` as "paddingLeft"]),
  };
}

function formatSidesPx(sides: BoxSides): string {
  const { top, right, bottom, left } = sides;
  if (top === right && right === bottom && bottom === left) {
    return `${px(top)}px`;
  }
  if (top === bottom && left === right) {
    return `${px(top)}px ${px(left)}px`;
  }
  return `${px(top)}px ${px(right)}px ${px(bottom)}px ${px(left)}px`;
}

function shortFontFamily(family: string): string {
  const first = family.split(",")[0]?.trim() ?? family;
  return first.replace(/^["']|["']$/g, "");
}

function rgbToHex(color: string): string {
  if (color.startsWith("#")) {
    const hex = color.toLowerCase();
    // Expand shorthand (#fff → #ffffff) so lookup keys always agree.
    if (/^#[0-9a-f]{3}$/.test(hex)) {
      return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
    }
    return hex;
  }
  if (color === "white") return "#ffffff";
  if (color === "black") return "#000000";
  const m = color.match(
    /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/,
  );
  if (!m) return color;
  const a = m[4] != null ? Number(m[4]) : 1;
  if (a === 0) return "transparent";
  const hex = [m[1], m[2], m[3]]
    .map((v) => Number(v).toString(16).padStart(2, "0"))
    .join("");
  if (a < 1) return `${color}`; // keep rgba when partially transparent
  return `#${hex}`;
}

function isTransparentColor(color: string): boolean {
  if (!color || color === "transparent") return true;
  const m = color.match(
    /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/,
  );
  if (m && m[4] != null && Number(m[4]) === 0) return true;
  return false;
}

/** Compact authored values: collapse whitespace, keep rem/em/var as written. */
function tidyAuthored(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

/**
 * Collect cascaded authored declarations (not computed px) so rem/em/var()
 * survive into the popover. Later matching rules override earlier ones; inline wins.
 */
function collectAuthored(el: HTMLElement): Map<string, string> {
  const found = new Map<string, string>();

  function applyStyle(style: CSSStyleDeclaration) {
    for (let i = 0; i < style.length; i++) {
      const prop = style.item(i);
      if (!prop) continue;
      const val = style.getPropertyValue(prop).trim();
      if (val) found.set(prop, val);
    }
  }

  function walkRules(rules: CSSRuleList) {
    for (const rule of rules) {
      if (rule instanceof CSSMediaRule) {
        if (window.matchMedia(rule.conditionText).matches) {
          walkRules(rule.cssRules);
        }
        continue;
      }
      if (rule instanceof CSSSupportsRule) {
        walkRules(rule.cssRules);
        continue;
      }
      if (!(rule instanceof CSSStyleRule)) continue;
      try {
        if (!el.matches(rule.selectorText)) continue;
      } catch {
        continue;
      }
      applyStyle(rule.style);
    }
  }

  for (const sheet of document.styleSheets) {
    try {
      walkRules(sheet.cssRules);
    } catch {
      // Cross-origin stylesheets throw — ignore.
    }
  }

  applyStyle(el.style);
  return found;
}

function authoredOr(
  authored: Map<string, string>,
  props: string[],
): string | null {
  for (const prop of props) {
    const val = authored.get(prop);
    if (val) return tidyAuthored(val);
  }
  return null;
}

function formatBoxText(
  authored: Map<string, string>,
  kind: "padding" | "margin",
  computed: BoxSides,
  el: HTMLElement,
  authoredFor: AuthoredFor,
): string {
  const validate = (text: string, sides: BoxSides) =>
    boxTextMatchesComputed(text, sides, el, authoredFor);

  const shorthand = authoredOr(authored, [kind]);
  if (shorthand && validate(shorthand, computed)) return shorthand;

  const block = authoredOr(authored, [`${kind}-block`]);
  const inline = authoredOr(authored, [`${kind}-inline`]);
  if (block != null || inline != null) {
    const candidate =
      block != null && inline != null
        ? block === inline
          ? block
          : `${block} ${inline}`
        : (block ?? inline);
    if (candidate != null && validate(candidate, computed)) return candidate;
  }

  const side = (props: string[], expected: number): string => {
    const value = authoredOr(authored, props);
    if (
      value != null &&
      valueMatchesComputed(value, expected, el, authoredFor)
    ) {
      return value;
    }
    return `${px(expected)}px`;
  };

  const top = side([`${kind}-top`, `${kind}-block-start`], computed.top);
  const right = side([`${kind}-right`, `${kind}-inline-end`], computed.right);
  const bottom = side(
    [`${kind}-bottom`, `${kind}-block-end`],
    computed.bottom,
  );
  const left = side([`${kind}-left`, `${kind}-inline-start`], computed.left);

  if (top === right && right === bottom && bottom === left) return top;
  if (top === bottom && left === right) return `${top} ${left}`;
  return `${top} ${right} ${bottom} ${left}`;
}

/** Pull `--token` out of `var(--token)` / shorthands. */
function extractCssVar(value: string): string | null {
  const m = value.match(/var\(\s*(--[\w-]+)\s*(?:,[^)]+)?\)/);
  return m?.[1] ?? null;
}

type ColorRole = "text" | "background" | "border";

type DesignVarCache = {
  dark: boolean;
  /** Every custom property defined on `:root` / `.dark` (the design variables). */
  names: Set<string>;
  /** Resolved hex → all matching color `--tokens` from the active theme. */
  byHex: Map<string, string[]>;
  /** Color `--token` → resolved hex (for validating chased candidates). */
  hexByName: Map<string, string>;
  /** Normalized dimension (px-resolved) → all matching `--tokens`. */
  byDimension: Map<string, string[]>;
  /** Dimension `--token` → normalized value (for validating candidates). */
  dimensionByName: Map<string, string>;
};
let designVarCache: DesignVarCache | null = null;

/** Theme-scope selectors — `:root`, `.dark`, and prod's `[data-theme=…]`. */
function isThemeScopeSelector(selectorText: string): boolean {
  return selectorText.split(",").some((part) => {
    const sel = part.trim();
    return (
      sel === ":root" ||
      sel === ".dark" ||
      sel === ":root.dark" ||
      sel.startsWith("[data-theme")
    );
  });
}

function collectRootVarNames(rules: CSSRuleList, into: Set<string>) {
  for (const rule of rules) {
    if (rule instanceof CSSMediaRule || rule instanceof CSSSupportsRule) {
      collectRootVarNames(rule.cssRules, into);
      continue;
    }
    if (!(rule instanceof CSSStyleRule)) continue;
    if (!isThemeScopeSelector(rule.selectorText)) continue;
    for (let i = 0; i < rule.style.length; i++) {
      const prop = rule.style.item(i);
      if (prop?.startsWith("--")) into.add(prop);
    }
  }
}

/**
 * Normalize a single dimension so `0.375rem` and `6px` share the same lookup
 * key. em/unitless values keep their literal form (tracking, weights).
 */
function normalizeDimension(value: string, rootFontSize: number): string | null {
  const m = value.trim().match(/^(-?[\d.]+)(px|rem|em)?$/);
  if (!m) return null;
  const n = Number.parseFloat(m[1]!);
  if (!Number.isFinite(n)) return null;
  const unit = m[2];
  if (unit === "px") return `${Math.round(n * 100) / 100}px`;
  if (unit === "rem") return `${Math.round(n * rootFontSize * 100) / 100}px`;
  if (unit === "em") return `${n}em`;
  return `${n}`;
}

/** Theme-scoped reverse lookups: resolved value → design variable names. */
function getDesignVarCache(): DesignVarCache {
  const dark = document.documentElement.classList.contains("dark");
  if (designVarCache?.dark === dark) return designVarCache;

  const names = new Set<string>();
  for (const sheet of document.styleSheets) {
    try {
      collectRootVarNames(sheet.cssRules, names);
    } catch {
      /* cross-origin */
    }
  }

  const root = getComputedStyle(document.documentElement);
  const rootFontSize = Number.parseFloat(root.fontSize) || 16;
  const byHex = new Map<string, string[]>();
  const hexByName = new Map<string, string>();
  const byDimension = new Map<string, string[]>();
  const dimensionByName = new Map<string, string>();
  for (const name of names) {
    const raw = root.getPropertyValue(name).trim();
    if (!raw) continue;

    if (
      name.startsWith("--background-") ||
      name.startsWith("--text-") ||
      name.startsWith("--border-")
    ) {
      if (isTransparentColor(raw)) continue;
      const hex = rgbToHex(raw);
      if (!hex.startsWith("#")) continue;
      const key = hex.toLowerCase();
      hexByName.set(name, key);
      const list = byHex.get(key);
      if (list) list.push(name);
      else byHex.set(key, [name]);
      continue;
    }

    const dim = normalizeDimension(raw, rootFontSize);
    if (dim != null) {
      dimensionByName.set(name, dim);
      const list = byDimension.get(dim);
      if (list) list.push(name);
      else byDimension.set(dim, [name]);
    }
  }

  designVarCache = {
    dark,
    names,
    byHex,
    hexByName,
    byDimension,
    dimensionByName,
  };
  return designVarCache;
}

type AuthoredFor = (node: HTMLElement) => Map<string, string>;

/** Authored value of a custom property, checking the element then ancestors. */
function lookupCustomProp(
  el: HTMLElement,
  varName: string,
  authoredFor: AuthoredFor,
): string | null {
  let node: HTMLElement | null = el;
  while (node) {
    const inline = node.style.getPropertyValue(varName).trim();
    if (inline) return inline;
    const authored = authoredFor(node).get(varName)?.trim();
    if (authored) return authored;
    node = node.parentElement;
  }
  return null;
}

type ChaseResult = { token: string } | { value: string } | null;

/**
 * Follow component-local var chains (e.g. `--btn-bg: var(--background-brand-primary)`
 * set inline) until we land on a design variable or a concrete value.
 */
function chaseVar(
  el: HTMLElement,
  startName: string,
  authoredFor: AuthoredFor,
): ChaseResult {
  const cache = getDesignVarCache();
  let name = startName;
  for (let depth = 0; depth < 5; depth++) {
    if (cache.names.has(name)) return { token: name };
    const value = lookupCustomProp(el, name, authoredFor);
    if (!value) return null;
    const next = extractCssVar(value);
    if (!next) return { value: tidyAuthored(value) };
    name = next;
  }
  return null;
}

/**
 * Resolve one authored part (`var()` or concrete) to a px number for
 * validation against computed values. null = can't resolve.
 */
function resolvePartPx(
  part: string,
  el: HTMLElement,
  authoredFor: AuthoredFor,
): number | null {
  const cache = getDesignVarCache();
  let concrete = part;

  const varName = extractCssVar(part);
  if (varName) {
    if (cache.names.has(varName)) {
      const key = cache.dimensionByName.get(varName);
      if (!key) return null;
      concrete = key;
    } else {
      const chased = chaseVar(el, varName, authoredFor);
      if (chased && "token" in chased) {
        const key = cache.dimensionByName.get(chased.token);
        if (!key) return null;
        concrete = key;
      } else if (chased && "value" in chased) {
        concrete = chased.value;
      } else {
        return null;
      }
    }
  }

  const rootFontSize =
    Number.parseFloat(getComputedStyle(document.documentElement).fontSize) ||
    16;
  const key = normalizeDimension(concrete, rootFontSize);
  if (key == null || key.endsWith("em")) return null;
  const n = Number.parseFloat(key);
  return Number.isFinite(n) ? n : null;
}

function splitValueParts(text: string): string[] {
  return text.match(/var\([^)]*\)|\S+/g) ?? [];
}

function pxClose(a: number, b: number): boolean {
  return Math.abs(a - b) < 0.75;
}

/**
 * Does an authored (possibly shorthand) box value resolve to the computed
 * sides? The authored map is cascade-order only, so a rule that loses on
 * specificity (e.g. MUI Emotion `padding: 6px 8px`) can shadow the CADS
 * module value that actually renders. null parts = can't tell → accept.
 */
function boxTextMatchesComputed(
  text: string,
  computed: BoxSides,
  el: HTMLElement,
  authoredFor: AuthoredFor,
): boolean {
  const parts = splitValueParts(text).map((p) =>
    resolvePartPx(p, el, authoredFor),
  );
  if (parts.length < 1 || parts.length > 4 || parts.some((p) => p == null)) {
    return true;
  }
  const [a, b = a, c = a, d = b] = parts as number[];
  return (
    pxClose(a, computed.top) &&
    pxClose(b, computed.right) &&
    pxClose(c, computed.bottom) &&
    pxClose(d, computed.left)
  );
}

/** Single-value flavor for gap / radius / font-size / line-height. */
function valueMatchesComputed(
  text: string,
  computedPx: number,
  el: HTMLElement,
  authoredFor: AuthoredFor,
): boolean {
  const first = splitValueParts(text)[0];
  if (!first) return true;
  const resolved = resolvePartPx(first, el, authoredFor);
  if (resolved == null) return true;
  return pxClose(resolved, computedPx);
}

function pickDimensionToken(
  tokens: string[],
  prefixes: string[],
): string | null {
  for (const prefix of prefixes) {
    const matches = tokens.filter((t) => t.startsWith(prefix)).sort();
    if (matches[0]) return matches[0];
  }
  return null;
}

/**
 * Rewrite one value part (a `var()` or concrete dimension) as its design
 * variable when one represents it — local var chains are chased first, then
 * the resolved value is reverse-mapped within the role's variable families.
 */
function formatDimensionPart(
  part: string,
  el: HTMLElement,
  authoredFor: AuthoredFor,
  prefixes: string[],
): string {
  const cache = getDesignVarCache();
  let concrete = part;

  const varName = extractCssVar(part);
  if (varName) {
    if (cache.names.has(varName)) return varName;
    const chased = chaseVar(el, varName, authoredFor);
    if (chased && "token" in chased) return chased.token;
    if (chased && "value" in chased) concrete = chased.value;
    else return varName;
  }

  const rootFontSize =
    Number.parseFloat(getComputedStyle(document.documentElement).fontSize) ||
    16;
  const key = normalizeDimension(concrete, rootFontSize);
  // Don't claim a variable for a plain zero — defaults aren't authored choices.
  if (key != null && key !== "0" && key !== "0px" && key !== "0em") {
    const tokens = cache.byDimension.get(key);
    const picked = tokens ? pickDimensionToken(tokens, prefixes) : null;
    if (picked) return picked;
  }
  return concrete;
}

/**
 * Rewrite every part of a (possibly multi-value) dimension string to design
 * variables where they apply: `6px 12px` → `--shape-sm 12px`.
 */
function formatDimensionText(
  text: string,
  el: HTMLElement,
  authoredFor: AuthoredFor,
  prefixes: string[],
): string {
  const parts = text.match(/var\([^)]*\)|\S+/g);
  if (!parts) return text;
  return parts
    .map((part) => formatDimensionPart(part, el, authoredFor, prefixes))
    .join(" ");
}

function rolePrefix(role: ColorRole): string {
  if (role === "text") return "--text-";
  if (role === "background") return "--background-";
  return "--border-";
}

/** Prefer family match; within family prefer *-white/black-fixed, then *-fixed. */
function pickTokenForRole(tokens: string[], role: ColorRole): string | null {
  if (!tokens.length) return null;
  const prefix = rolePrefix(role);
  const family = tokens.filter((t) => t.startsWith(prefix));
  const pool = family.length ? family : tokens;

  const scored = pool.map((name) => {
    let score = 50;
    if (name.includes("-white-fixed") || name.includes("-black-fixed")) {
      score = 0;
    } else if (name.endsWith("-fixed")) {
      score = 10;
    } else if (name.includes("-primary") && !name.includes("inverse")) {
      score = 20;
    } else if (name.includes("inverse")) {
      score = 40;
    } else if (name.includes("disabled")) {
      score = 45;
    }
    return { name, score };
  });
  scored.sort((a, b) => a.score - b.score || a.name.localeCompare(b.name));
  return scored[0]?.name ?? null;
}

function formatColorText(
  authored: string | null,
  computed: string,
  role: ColorRole,
  el: HTMLElement,
  authoredFor: AuthoredFor,
): string | null {
  const cache = getDesignVarCache();
  const computedHex = isTransparentColor(computed) ? null : rgbToHex(computed);

  /** Token candidates must agree with the rendered color — the authored map
   *  is cascade-order only, so a losing rule (e.g. MUI Emotion) can shadow
   *  the CADS module value that actually wins on specificity. */
  const validated = (token: string): string | null => {
    const tokenHex = cache.hexByName.get(token);
    if (!tokenHex) return token;
    return computedHex != null && tokenHex === computedHex ? token : null;
  };

  if (authored) {
    const tidy = tidyAuthored(authored);
    if (tidy === "none" || tidy === "initial" || tidy === "transparent") {
      // fall through to computed / token lookup
    } else {
      const fromAuthored = extractCssVar(tidy);
      if (fromAuthored) {
        // Design variable used directly — show it. Component-local vars
        // (--btn-bg, …) get chased to the design variable they carry.
        if (cache.names.has(fromAuthored)) {
          const ok = validated(fromAuthored);
          if (ok) return ok;
        } else {
          const chased = chaseVar(el, fromAuthored, authoredFor);
          if (chased && "token" in chased) {
            const ok = validated(chased.token);
            if (ok) return ok;
          }
        }
        // Mismatch or unresolvable — fall through to hex → token lookup.
      } else if (/(?:rem|em|%)/.test(tidy)) {
        return tidy;
      }
    }
  }

  if (computedHex == null) return null;

  if (computedHex.startsWith("#")) {
    const tokens = cache.byHex.get(computedHex.toLowerCase());
    if (tokens?.length) {
      const picked = pickTokenForRole(tokens, role);
      if (picked) return picked;
    }
  }
  return computedHex;
}

/** Walk up for authored `color` so inherited icon/label color keeps its token. */
function authoredColorUpTree(
  el: HTMLElement,
  authoredFor: (node: HTMLElement) => Map<string, string>,
): string | null {
  let node: HTMLElement | null = el;
  while (node) {
    const direct = authoredOr(authoredFor(node), ["color"]);
    if (direct) return direct;
    if (node.hasAttribute("data-docs-playground-preview")) break;
    node = node.parentElement;
  }
  return null;
}

function labelFor(el: HTMLElement): string {
  if (el.hasAttribute("data-cads-dropdown-item")) return "MENU ITEM";
  if (el.hasAttribute("data-cads-dropdown-trigger")) return "BUTTON";
  if (el.getAttribute("data-cads-dropdown") != null) return "DROPDOWN";
  if (el.hasAttribute("data-docs-inspect-composite")) {
    if (el.querySelector("[data-cads-dropdown]")) return "DROPDOWN";
  }
  const cadsName = el.getAttribute("data-cads-component");
  if (cadsName) {
    return cadsName.replace(/([a-z])([A-Z])/g, "$1 $2").toUpperCase();
  }
  if (el.getAttribute("role") === "switch") return "BUTTON";
  return el.tagName.toUpperCase();
}

function displayLabel(display: string, flexDirection: string): string {
  if (display === "flex" || display === "inline-flex") {
    const dir =
      flexDirection === "column" || flexDirection === "column-reverse"
        ? "col"
        : "row";
    return `${display === "inline-flex" ? "inline-flex" : "flex"} ${dir}`;
  }
  return display || "block";
}

function visibleChildren(el: HTMLElement): HTMLElement[] {
  return Array.from(el.children).filter((child): child is HTMLElement => {
    if (!(child instanceof HTMLElement)) return false;
    const style = getComputedStyle(child);
    if (style.display === "none" || style.visibility === "hidden") return false;
    const rect = child.getBoundingClientRect();
    return rect.width > 0 || rect.height > 0;
  });
}

function inspectKind(
  el: HTMLElement,
  styles: CSSStyleDeclaration,
): InspectKind {
  const tag = el.tagName;
  const role = el.getAttribute("role");

  if (tag === "SVG" || tag === "I") return "icon";
  if (
    tag === "BUTTON" ||
    tag === "INPUT" ||
    tag === "SELECT" ||
    tag === "TEXTAREA" ||
    role === "button" ||
    role === "switch" ||
    role === "checkbox" ||
    role === "radio"
  ) {
    return "control";
  }
  if (
    tag === "SPAN" ||
    tag === "P" ||
    tag === "A" ||
    tag === "LABEL" ||
    tag === "SMALL" ||
    tag === "STRONG" ||
    tag === "EM" ||
    /^H[1-6]$/.test(tag)
  ) {
    return "text";
  }
  if (
    styles.display === "flex" ||
    styles.display === "inline-flex" ||
    styles.display === "grid" ||
    styles.display === "inline-grid" ||
    visibleChildren(el).length > 1
  ) {
    return "container";
  }
  return "generic";
}

function readGapBands(el: HTMLElement, styles: CSSStyleDeclaration): GapBand[] {
  const gap = parsePx(styles.gap || styles.columnGap || styles.rowGap);
  if (gap <= 0) return [];
  const display = styles.display;
  if (display !== "flex" && display !== "inline-flex" && display !== "grid") {
    return [];
  }
  const kids = visibleChildren(el);
  if (kids.length < 2) return [];

  const isCol =
    styles.flexDirection === "column" ||
    styles.flexDirection === "column-reverse";
  const bands: GapBand[] = [];

  for (let i = 0; i < kids.length - 1; i++) {
    const a = kids[i]!.getBoundingClientRect();
    const b = kids[i + 1]!.getBoundingClientRect();
    if (isCol) {
      const top = a.bottom;
      const height = Math.max(0, b.top - a.bottom);
      if (height < 0.5) continue;
      bands.push({
        top,
        left: Math.min(a.left, b.left),
        width: Math.max(a.width, b.width, Math.abs(b.right - a.left)),
        height,
        value: gap,
        axis: "column",
      });
    } else {
      const left = a.right;
      const width = Math.max(0, b.left - a.right);
      if (width < 0.5) continue;
      bands.push({
        top: Math.min(a.top, b.top),
        left,
        width,
        height: Math.max(a.height, b.height, Math.abs(b.bottom - a.top)),
        value: gap,
        axis: "row",
      });
    }
  }
  return bands;
}

function readMeasure(el: HTMLElement): Measure {
  const styles = getComputedStyle(el);
  const authoredFrame = new Map<HTMLElement, Map<string, string>>();
  const authoredFor = (node: HTMLElement) => {
    let map = authoredFrame.get(node);
    if (!map) {
      map = collectAuthored(node);
      authoredFrame.set(node, map);
    }
    return map;
  };
  const authored = authoredFor(el);
  const rect = inspectRect(el);
  const padding = readSides(styles, "padding");
  const margin = readSides(styles, "margin");
  const gap = parsePx(styles.gap || styles.columnGap || styles.rowGap);

  // Authored candidates are cascade-order only — a rule that loses on
  // specificity can shadow the winner, so verify each against computed.
  const checked = (value: string | null, computedPx: number): string | null =>
    value != null && valueMatchesComputed(value, computedPx, el, authoredFor)
      ? value
      : null;

  const gapAuthored = checked(
    authoredOr(authored, ["gap", "row-gap", "column-gap"]),
    gap,
  );
  const radiusComputed = styles.borderRadius;
  const radiusAuthored = checked(
    authoredOr(authored, ["border-radius", "border-top-left-radius"]),
    parsePx(radiusComputed),
  );
  const radiusRaw =
    radiusAuthored ??
    (radiusComputed && radiusComputed !== "0px" ? radiusComputed : null);

  const backgroundText = formatColorText(
    authoredOr(authored, ["background-color", "background"]),
    styles.backgroundColor,
    "background",
    el,
    authoredFor,
  );
  const colorText = formatColorText(
    authoredColorUpTree(el, authoredFor),
    styles.color,
    "text",
    el,
    authoredFor,
  );

  const fontSizeAuth =
    checked(authoredOr(authored, ["font-size"]), parsePx(styles.fontSize)) ??
    styles.fontSize;
  const lineHeightAuth =
    (styles.lineHeight === "normal"
      ? null
      : checked(
          authoredOr(authored, ["line-height"]),
          parsePx(styles.lineHeight),
        )) ?? (styles.lineHeight === "normal" ? "normal" : styles.lineHeight);
  const fontWeightAuth =
    checked(
      authoredOr(authored, ["font-weight"]),
      parsePx(styles.fontWeight),
    ) ?? styles.fontWeight;
  const fontFamilyAuth =
    authoredOr(authored, ["font-family"]) ?? styles.fontFamily;
  const letterSpacingAuth = authoredOr(authored, ["letter-spacing"]);

  const isTextNode =
    el.tagName === "SPAN" ||
    el.tagName === "P" ||
    el.tagName === "A" ||
    (el.tagName === "LABEL" &&
      styles.display !== "flex" &&
      styles.display !== "inline-flex");
  const showType =
    isTextNode ||
    el.tagName === "BUTTON" ||
    el.getAttribute("role") === "button" ||
    el.getAttribute("role") === "switch";

  const letterSpacingText = showType
    ? (letterSpacingAuth ??
      (styles.letterSpacing === "normal" ? "0" : styles.letterSpacing))
    : null;

  const spacingVars = ["--spacing-"];
  const asSpacing = (text: string) =>
    formatDimensionText(text, el, authoredFor, spacingVars);

  const fontFamilyVar = extractCssVar(fontFamilyAuth);

  return {
    tag: labelFor(el),
    kind: inspectKind(el, styles),
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
    display: styles.display,
    flexDirection: styles.flexDirection,
    padding,
    margin,
    gap,
    gapBands: readGapBands(el, styles),
    paddingText: asSpacing(
      formatBoxText(authored, "padding", padding, el, authoredFor),
    ),
    marginText: asSpacing(
      formatBoxText(authored, "margin", margin, el, authoredFor),
    ),
    gapText:
      gap > 0 || gapAuthored
        ? asSpacing(gapAuthored ?? `${px(gap)}px`)
        : null,
    radiusText:
      radiusRaw && radiusRaw !== "0px" && radiusRaw !== "0"
        ? formatDimensionText(radiusRaw, el, authoredFor, ["--shape-"])
        : null,
    backgroundText,
    colorText,
    fontSizeText: showType
      ? formatDimensionText(fontSizeAuth, el, authoredFor, [
          "--font-size-",
          "--text-",
        ])
      : null,
    lineHeightText: showType
      ? formatDimensionText(lineHeightAuth, el, authoredFor, ["--leading-"])
      : null,
    fontFamilyText: showType
      ? (fontFamilyVar ?? shortFontFamily(fontFamilyAuth))
      : null,
    fontWeightText: showType
      ? formatDimensionText(fontWeightAuth, el, authoredFor, [
          "--font-weight-",
        ])
      : null,
    letterSpacingText: showType
      ? formatDimensionText(letterSpacingText ?? "0", el, authoredFor, [
          "--tracking-",
        ])
      : null,
  };
}

function isInspectableNode(stage: HTMLElement, node: Element): node is HTMLElement {
  if (!(node instanceof HTMLElement)) return false;
  if (!stage.contains(node)) return false;
  if (node === stage) return false;
  if (node.hasAttribute("data-docs-playground-preview")) return false;
  if (node.hasAttribute("data-docs-playground-hint")) return false;
  if (node.closest("[data-docs-inspect-root]")) return false;
  if (node.getAttribute("aria-hidden") === "true") return false;
  // Prefer real layout nodes over SVG guts from icons.
  if (node.closest("svg") && node.tagName !== "SVG") return false;
  const style = getComputedStyle(node);
  if (style.display === "none" || style.visibility === "hidden") return false;
  return true;
}

function previewRoot(stage: HTMLElement): HTMLElement {
  const preview = stage.querySelector("[data-docs-playground-preview]");
  return preview instanceof HTMLElement ? preview : stage;
}

/**
 * Floating surfaces (Dropdown Popper menu, Breadcrumbs overflow) are
 * position:absolute / portaled siblings — excluded from the host’s border box.
 * Union them in so rulers span the open chrome.
 */
function inspectRect(el: HTMLElement): {
  top: number;
  left: number;
  width: number;
  height: number;
} {
  const rect = el.getBoundingClientRect();
  let top = rect.top;
  let left = rect.left;
  let right = rect.right;
  let bottom = rect.bottom;

  const floatingSelectors = [
    "[data-cads-dropdown-menu]",
    "[data-cads-breadcrumb-overflow-menu]",
  ];
  for (const selector of floatingSelectors) {
    // Only union menus owned by this host (or nested under it when in-tree).
    const menus = el.querySelectorAll(selector);
    for (const menu of menus) {
      if (!(menu instanceof HTMLElement)) continue;
      const m = menu.getBoundingClientRect();
      if (m.width <= 0 && m.height <= 0) continue;
      top = Math.min(top, m.top);
      left = Math.min(left, m.left);
      right = Math.max(right, m.right);
      bottom = Math.max(bottom, m.bottom);
    }
  }

  return {
    top,
    left,
    width: Math.max(0, right - left),
    height: Math.max(0, bottom - top),
  };
}

/**
 * Outermost `[data-cads-component]` under host (shallowest depth). Falls back
 * to a Dropdown root. Needed for composites like TablePagination that embed a
 * Dropdown + Buttons — without this, rulers lock onto the rows-per-page
 * Dropdown only.
 */
function pickPrimaryControl(host: HTMLElement): HTMLElement | null {
  let best: HTMLElement | null = null;
  let bestDepth = Number.POSITIVE_INFINITY;
  for (const el of host.querySelectorAll<HTMLElement>("[data-cads-component]")) {
    let depth = 0;
    let node: HTMLElement | null = el;
    while (node && node !== host) {
      depth += 1;
      node = node.parentElement;
    }
    if (depth < bestDepth) {
      bestDepth = depth;
      best = el;
    }
  }
  if (best) return best;
  return host.querySelector<HTMLElement>("[data-cads-dropdown]");
}

/**
 * Primary preview component for idle inspect (Fluid Functionalism-style):
 * prefer the preview’s direct child (the control root), else largest node.
 */
function pickDefaultTarget(stage: HTMLElement): HTMLElement | null {
  const root = previewRoot(stage);

  for (const child of Array.from(root.children)) {
    if (!(child instanceof HTMLElement) || !isInspectableNode(stage, child)) {
      continue;
    }
    // Padded inspect composite (Dropdown open menu) — rulers span this box.
    if (child.hasAttribute("data-docs-inspect-composite")) return child;
    // Other wrappers — prefer the outermost control root inside.
    const nested = pickPrimaryControl(child);
    if (nested && isInspectableNode(stage, nested)) return nested;
    return child;
  }

  let best: HTMLElement | null = null;
  let bestArea = 0;
  for (const node of root.querySelectorAll<HTMLElement>("*")) {
    if (!isInspectableNode(stage, node)) continue;
    const rect = inspectRect(node);
    const area = rect.width * rect.height;
    if (area <= 0 || area <= bestArea) continue;
    best = node;
    bestArea = area;
  }
  return best;
}

/**
 * Geometry hit-test (not elementsFromPoint) so inspect still works when the
 * preview is locked with pointer-events: none / inert.
 */
function pickTarget(
  stage: HTMLElement,
  clientX: number,
  clientY: number,
): HTMLElement | null {
  const root = previewRoot(stage);
  let best: HTMLElement | null = null;
  let bestArea = Number.POSITIVE_INFINITY;

  const nodes = root.querySelectorAll<HTMLElement>("*");
  for (const node of nodes) {
    if (!isInspectableNode(stage, node)) continue;
    const rect = node.getBoundingClientRect();
    if (
      clientX < rect.left ||
      clientX > rect.right ||
      clientY < rect.top ||
      clientY > rect.bottom
    ) {
      continue;
    }
    const area = rect.width * rect.height;
    if (area <= 0 || area >= bestArea) continue;
    best = node;
    bestArea = area;
  }

  return best;
}

type RulerMark = {
  /** Offset from the span start (px) — labels always sit on their tick. */
  offset: number;
  major: boolean;
  label: number | null;
};

/**
 * Ruler exists only over the component’s span, so every mark is
 * component-relative: 0 at the near edge, majors every 32px. The ruler
 * runs to the first 8px grid tick at or just past the extent, so it ends
 * on a clean tick without extending far beyond the component.
 */
function spanRulerMarks(extent: number): RulerMark[] {
  if (!(extent > 0)) return [];
  const end = Math.ceil(extent / RULER_STEP) * RULER_STEP;
  const marks: RulerMark[] = [];
  for (let offset = 0; offset <= end; offset += RULER_STEP) {
    const major = offset % RULER_LABEL_STEP === 0;
    marks.push({
      offset,
      major,
      label: major ? offset : null,
    });
  }
  return marks;
}

function hasBoxValue(sides: BoxSides): boolean {
  return (
    sides.top > 0.5 ||
    sides.right > 0.5 ||
    sides.bottom > 0.5 ||
    sides.left > 0.5
  );
}

function popoverLines(measure: Measure): Array<[string, string]> {
  const lines: Array<[string, string]> = [];
  const hasPadding = hasBoxValue(measure.padding);
  const hasMargin = hasBoxValue(measure.margin);

  if (measure.kind === "text") {
    if (measure.fontSizeText) {
      lines.push(["font-size", measure.fontSizeText]);
    }
    return lines;
  }

  if (measure.kind === "icon") {
    if (measure.colorText) lines.push(["color", measure.colorText]);
    return lines;
  }

  if (measure.kind === "container") {
    lines.push([
      "layout",
      displayLabel(measure.display, measure.flexDirection),
    ]);
    if (hasPadding) lines.push(["padding", measure.paddingText]);
    if (measure.gapText) lines.push(["gap", measure.gapText]);
    if (hasMargin) lines.push(["margin", measure.marginText]);
    if (measure.radiusText) lines.push(["radius", measure.radiusText]);
    if (measure.backgroundText) {
      lines.push(["background", measure.backgroundText]);
    }
    return lines;
  }

  if (hasPadding) lines.push(["padding", measure.paddingText]);
  if (measure.gapText) lines.push(["gap", measure.gapText]);
  if (hasMargin) lines.push(["margin", measure.marginText]);
  if (measure.radiusText) lines.push(["radius", measure.radiusText]);
  if (measure.backgroundText) lines.push(["background", measure.backgroundText]);

  if (measure.kind === "control") {
    if (measure.colorText) lines.push(["color", measure.colorText]);
    if (measure.fontSizeText) {
      lines.push(["font-size", measure.fontSizeText]);
    }
  }

  return lines;
}

function PopoverLines({ measure }: { measure: Measure }) {
  const lines = popoverLines(measure);

  return (
    <>
      {lines.map(([prop, value]) => (
        <div key={prop} className={styles.popoverLine}>
          {prop} {value}
        </div>
      ))}
    </>
  );
}

function PaddingOverlays({ measure }: { measure: Measure }) {
  const { padding: p, width, height } = measure;
  const nodes: ReactNode[] = [];

  if (p.top > 0.5) {
    nodes.push(
      <div
        key="pad-t"
        className={`${styles.pad} ${styles.padT}`}
        style={{ height: p.top }}
      >
        <span>{Math.round(p.top)}</span>
      </div>,
    );
  }
  if (p.bottom > 0.5) {
    nodes.push(
      <div
        key="pad-b"
        className={`${styles.pad} ${styles.padB}`}
        style={{ height: p.bottom }}
      >
        <span>{Math.round(p.bottom)}</span>
      </div>,
    );
  }
  if (p.left > 0.5) {
    nodes.push(
      <div
        key="pad-l"
        className={`${styles.pad} ${styles.padL}`}
        style={{
          top: p.top,
          height: Math.max(0, height - p.top - p.bottom),
          width: p.left,
        }}
      >
        <span>{Math.round(p.left)}</span>
      </div>,
    );
  }
  if (p.right > 0.5) {
    nodes.push(
      <div
        key="pad-r"
        className={`${styles.pad} ${styles.padR}`}
        style={{
          top: p.top,
          height: Math.max(0, height - p.top - p.bottom),
          width: p.right,
        }}
      >
        <span>{Math.round(p.right)}</span>
      </div>,
    );
  }

  // Soft content wash when any padding exists
  if (nodes.length > 0) {
    nodes.unshift(
      <div
        key="pad-content"
        className={styles.padContent}
        style={{
          top: p.top,
          left: p.left,
          width: Math.max(0, width - p.left - p.right),
          height: Math.max(0, height - p.top - p.bottom),
        }}
      />,
    );
  }

  return <>{nodes}</>;
}

export function PlaygroundInspectOverlay({
  stageRef,
  enabled,
}: {
  stageRef: RefObject<HTMLDivElement | null>;
  enabled: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  const [stage, setStage] = useState<StageBounds | null>(null);
  /** Primary preview component — rulers always span this (idle + nested hover). */
  const [defaultMeasure, setDefaultMeasure] = useState<Measure | null>(null);
  /** Hovered node — drives guides / popover / ruler highlight band. */
  const [hoverMeasure, setHoverMeasure] = useState<Measure | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!enabled) {
      setStage(null);
      setDefaultMeasure(null);
      setHoverMeasure(null);
      return;
    }

    const stageEl = stageRef.current;
    if (!stageEl) return;

    function syncStage() {
      const el = stageRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setStage({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    }

    function syncDefault() {
      const el = stageRef.current;
      if (!el) return;
      syncStage();
      const target = pickDefaultTarget(el);
      setDefaultMeasure(target ? readMeasure(target) : null);
    }

    syncDefault();

    function onMove(event: MouseEvent) {
      const el = stageRef.current;
      if (!el) return;
      // Keep stage + target rects from the same frame to avoid subpixel drift.
      syncStage();
      const target = pickTarget(el, event.clientX, event.clientY);
      setHoverMeasure(target ? readMeasure(target) : null);
    }

    function onLeave() {
      setHoverMeasure(null);
    }

    function onScrollOrResize() {
      syncDefault();
      setHoverMeasure(null);
    }

    stageEl.addEventListener("mousemove", onMove);
    stageEl.addEventListener("mouseleave", onLeave);
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);

    const ro = new ResizeObserver(syncDefault);
    ro.observe(stageEl);
    const preview = stageEl.querySelector("[data-docs-playground-preview]");
    if (preview) ro.observe(preview);

    // Open menus don't change the preview's layout size — observe them and
    // re-sync when Dropdown/Breadcrumbs mount floating chrome in-tree.
    function observeFloating() {
      const el = stageRef.current;
      if (!el) return;
      for (const menu of el.querySelectorAll(
        "[data-cads-dropdown-menu], [data-cads-breadcrumb-overflow-menu]",
      )) {
        if (menu instanceof HTMLElement) ro.observe(menu);
      }
    }
    observeFloating();
    syncDefault();

    const mo = new MutationObserver(() => {
      observeFloating();
      syncDefault();
    });
    if (preview) {
      mo.observe(preview, { childList: true, subtree: true });
    }

    return () => {
      stageEl.removeEventListener("mousemove", onMove);
      stageEl.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
      ro.disconnect();
      mo.disconnect();
    };
  }, [enabled, stageRef]);

  if (!enabled || !mounted || !stage) return null;

  // Rulers always span the primary component. Hover only shades a band on
  // those rulers + draws guides/box on the nested target.
  const rulerMeasure = defaultMeasure ?? hoverMeasure;
  const measure = hoverMeasure ?? defaultMeasure;
  const hovering = hoverMeasure != null;
  const spanLeft = rulerMeasure ? rulerMeasure.left - stage.left : 0;
  const spanTop = rulerMeasure ? rulerMeasure.top - stage.top : 0;
  const hSpanMarks = rulerMeasure ? spanRulerMarks(rulerMeasure.width) : [];
  const vSpanMarks = rulerMeasure ? spanRulerMarks(rulerMeasure.height) : [];
  const hoverBandH =
    hovering && hoverMeasure && rulerMeasure
      ? {
          left: hoverMeasure.left - rulerMeasure.left,
          width: hoverMeasure.width,
        }
      : null;
  const hoverBandV =
    hovering && hoverMeasure && rulerMeasure
      ? {
          top: hoverMeasure.top - rulerMeasure.top,
          height: hoverMeasure.height,
        }
      : null;

  let popoverStyle: CSSProperties | undefined;
  if (measure && hovering) {
    // Prefer above with a 6px gap; flip below near the viewport / stage top edge.
    const estimatedPopoverH = 26 + popoverLines(measure).length * 14;
    const spaceAboveViewport = measure.top;
    const spaceAboveStage = measure.top - stage.top;
    const placeBelow =
      spaceAboveViewport < estimatedPopoverH + POPOVER_GAP + 8 ||
      spaceAboveStage < estimatedPopoverH + POPOVER_GAP;

    const centerX = measure.left + measure.width / 2;
    const approxWidth = 200;
    const minLeft = 8 + approxWidth / 2;
    const maxLeft = window.innerWidth - 8 - approxWidth / 2;
    const clampedX = Math.min(maxLeft, Math.max(minLeft, centerX));

    popoverStyle = placeBelow
      ? {
          position: "fixed",
          left: clampedX,
          top: measure.top + measure.height + POPOVER_GAP,
          transform: "translateX(-50%)",
          zIndex: INSPECT_Z + 1,
        }
      : {
          position: "fixed",
          left: clampedX,
          bottom: window.innerHeight - measure.top + POPOVER_GAP,
          transform: "translateX(-50%)",
          zIndex: INSPECT_Z + 1,
        };
  }

  const layer = (
    <div
      className={styles.root}
      data-docs-inspect-root=""
      aria-hidden
      style={{ zIndex: INSPECT_Z }}
    >
      {/* Span-only rulers over the primary component. Nested hover shades a
          band on these rulers — it does not shrink the ruler span. */}
      <div
        className={styles.stageFrame}
        style={{
          top: stage.top,
          left: stage.left,
          width: stage.width,
          height: stage.height,
        }}
      >
        {rulerMeasure ? (
          <>
            <div
              className={styles.rulerH}
              style={{ left: spanLeft, width: rulerMeasure.width }}
            >
              {hoverBandH ? (
                <div
                  className={styles.rulerShade}
                  style={{
                    left: hoverBandH.left,
                    width: hoverBandH.width,
                  }}
                />
              ) : null}
              {hSpanMarks.map((mark) => (
                <span
                  key={`h-${mark.offset}`}
                  className={`${styles.tick}${mark.major ? ` ${styles.tickMajor}` : ""}`}
                  style={{ left: mark.offset }}
                >
                  {mark.label != null ? (
                    <span className={styles.tickLabel}>{mark.label}</span>
                  ) : null}
                </span>
              ))}
            </div>
            <div
              className={styles.rulerV}
              style={{ top: spanTop, height: rulerMeasure.height }}
            >
              {hoverBandV ? (
                <div
                  className={styles.rulerShade}
                  style={{
                    top: hoverBandV.top,
                    height: hoverBandV.height,
                  }}
                />
              ) : null}
              {vSpanMarks.map((mark) => (
                <span
                  key={`v-${mark.offset}`}
                  className={`${styles.tick}${mark.major ? ` ${styles.tickMajor}` : ""}`}
                  style={{ top: mark.offset }}
                >
                  {mark.label != null ? (
                    <span className={styles.tickLabel}>{mark.label}</span>
                  ) : null}
                </span>
              ))}
            </div>
          </>
        ) : null}
      </div>

      {measure && hovering ? (
        <>
          {/* Viewport-fixed guides clipped to the stage bounds */}
          <div
            className={`${styles.guide} ${styles.guideH}`}
            style={{
              top: measure.top,
              left: stage.left,
              width: stage.width,
            }}
          />
          <div
            className={`${styles.guide} ${styles.guideH}`}
            style={{
              // -1 overlaps the selection box's bottom border (no 2px double line).
              top: measure.top + measure.height - 1,
              left: stage.left,
              width: stage.width,
            }}
          />
          <div
            className={`${styles.guide} ${styles.guideV}`}
            style={{
              left: measure.left,
              top: stage.top,
              height: stage.height,
            }}
          />
          <div
            className={`${styles.guide} ${styles.guideV}`}
            style={{
              // -1 overlaps the selection box's right border.
              left: measure.left + measure.width - 1,
              top: stage.top,
              height: stage.height,
            }}
          />

          <div
            className={styles.box}
            style={{
              top: measure.top,
              left: measure.left,
              width: measure.width,
              height: measure.height,
            }}
          >
            <PaddingOverlays measure={measure} />
          </div>

          {measure.gapBands.map((band, i) => (
            <div
              key={`gap-${i}`}
              className={styles.gap}
              style={{
                top: band.top,
                left: band.left,
                width: band.width,
                height: band.height,
              }}
            >
              <span>{Math.round(band.value)}</span>
            </div>
          ))}

          {popoverStyle ? (
            <div className={styles.popover} style={popoverStyle}>
              <div className={styles.popoverTitle}>
                {measure.tag} · {Math.round(measure.width)} ×{" "}
                {Math.round(measure.height)}
              </div>
              <PopoverLines measure={measure} />
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );

  return createPortal(layer, document.body);
}
