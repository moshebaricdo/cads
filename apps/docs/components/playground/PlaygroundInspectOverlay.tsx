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
import styles from "./PlaygroundInspectOverlay.module.css";

const POPOVER_GAP = 6;
const RULER_STEP = 8;
const RULER_LABEL_STEP = 32;
/** Above Dropdown menu (1400) and typical MUI layers. */
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
  if (color.startsWith("#")) return color.toLowerCase();
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
): string {
  const shorthand = authoredOr(authored, [kind]);
  if (shorthand) return shorthand;

  const block = authoredOr(authored, [`${kind}-block`]);
  const inline = authoredOr(authored, [`${kind}-inline`]);
  if (block != null || inline != null) {
    if (block != null && inline != null) {
      if (block === inline) return block;
      return `${block} ${inline}`;
    }
    return block ?? inline ?? formatSidesPx(computed);
  }

  const top =
    authoredOr(authored, [`${kind}-top`, `${kind}-block-start`]) ??
    `${px(computed.top)}px`;
  const right =
    authoredOr(authored, [`${kind}-right`, `${kind}-inline-end`]) ??
    `${px(computed.right)}px`;
  const bottom =
    authoredOr(authored, [`${kind}-bottom`, `${kind}-block-end`]) ??
    `${px(computed.bottom)}px`;
  const left =
    authoredOr(authored, [`${kind}-left`, `${kind}-inline-start`]) ??
    `${px(computed.left)}px`;

  if (top === right && right === bottom && bottom === left) return top;
  if (top === bottom && left === right) return `${top} ${left}`;
  return `${top} ${right} ${bottom} ${left}`;
}

/** Pull `--token` out of `var(--token)` / shorthands. */
function extractCssVar(value: string): string | null {
  const m = value.match(/var\(\s*(--[\w-]+)\s*(?:,[^)]+)?\)/);
  return m?.[1] ?? null;
}

/** `var(--space-xs)` → `--space-xs` (keeps rem/em/multi-value lists intact). */
function unwrapCssVars(value: string): string {
  return value.replace(/var\(\s*(--[\w-]+)\s*(?:,[^)]+)?\)/g, "$1");
}

type ColorRole = "text" | "background" | "border";

type ColorVarCache = { dark: boolean; byHex: Map<string, string[]> };
let colorVarCache: ColorVarCache | null = null;

function collectColorVarNames(rules: CSSRuleList, into: Set<string>) {
  for (const rule of rules) {
    if (rule instanceof CSSMediaRule || rule instanceof CSSSupportsRule) {
      collectColorVarNames(rule.cssRules, into);
      continue;
    }
    if (!(rule instanceof CSSStyleRule)) continue;
    const sel = rule.selectorText;
    if (sel !== ":root" && sel !== ".dark" && sel !== ":root.dark") continue;
    for (let i = 0; i < rule.style.length; i++) {
      const prop = rule.style.item(i);
      if (
        prop &&
        (prop.startsWith("--background-") ||
          prop.startsWith("--text-") ||
          prop.startsWith("--border-"))
      ) {
        into.add(prop);
      }
    }
  }
}

/** Map resolved hex → all matching `--tokens` from the active theme. */
function getColorVarsByHex(): Map<string, string[]> {
  const dark = document.documentElement.classList.contains("dark");
  if (colorVarCache?.dark === dark) return colorVarCache.byHex;

  const names = new Set<string>();
  for (const sheet of document.styleSheets) {
    try {
      collectColorVarNames(sheet.cssRules, names);
    } catch {
      /* cross-origin */
    }
  }

  const root = getComputedStyle(document.documentElement);
  const byHex = new Map<string, string[]>();
  for (const name of names) {
    const raw = root.getPropertyValue(name).trim();
    if (!raw || isTransparentColor(raw)) continue;
    const hex = rgbToHex(raw.startsWith("rgb") ? raw : raw);
    if (!hex.startsWith("#")) continue;
    const key = hex.toLowerCase();
    const list = byHex.get(key);
    if (list) list.push(name);
    else byHex.set(key, [name]);
  }

  colorVarCache = { dark, byHex };
  return byHex;
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
): string | null {
  if (authored) {
    const tidy = tidyAuthored(authored);
    if (tidy === "none" || tidy === "initial" || tidy === "transparent") {
      // fall through to computed / token lookup
    } else {
      const fromAuthored = extractCssVar(tidy);
      if (fromAuthored) return fromAuthored;
      if (/(?:rem|em|%)/.test(tidy)) return tidy;
    }
  }

  if (isTransparentColor(computed)) return null;

  const hex = rgbToHex(computed);
  if (hex.startsWith("#")) {
    const tokens = getColorVarsByHex().get(hex.toLowerCase());
    if (tokens?.length) {
      const picked = pickTokenForRole(tokens, role);
      if (picked) return picked;
    }
  }
  return hex;
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
  const rect = el.getBoundingClientRect();
  const padding = readSides(styles, "padding");
  const margin = readSides(styles, "margin");
  const gap = parsePx(styles.gap || styles.columnGap || styles.rowGap);

  const gapAuthored = authoredOr(authored, ["gap", "row-gap", "column-gap"]);
  const radiusAuthored = authoredOr(authored, [
    "border-radius",
    "border-top-left-radius",
  ]);
  const radiusComputed = styles.borderRadius;
  const radiusRaw =
    radiusAuthored ??
    (radiusComputed && radiusComputed !== "0px" ? radiusComputed : null);

  const backgroundText = formatColorText(
    authoredOr(authored, ["background-color", "background"]),
    styles.backgroundColor,
    "background",
  );
  const colorText = formatColorText(
    authoredColorUpTree(el, authoredFor),
    styles.color,
    "text",
  );

  const fontSizeAuth = authoredOr(authored, ["font-size"]) ?? styles.fontSize;
  const lineHeightAuth =
    authoredOr(authored, ["line-height"]) ??
    (styles.lineHeight === "normal" ? "normal" : styles.lineHeight);
  const fontWeightAuth =
    authoredOr(authored, ["font-weight"]) ?? styles.fontWeight;
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
    paddingText: unwrapCssVars(formatBoxText(authored, "padding", padding)),
    marginText: unwrapCssVars(formatBoxText(authored, "margin", margin)),
    gapText:
      gap > 0 || gapAuthored
        ? unwrapCssVars(gapAuthored ?? `${px(gap)}px`)
        : null,
    radiusText:
      radiusRaw && radiusRaw !== "0px" && radiusRaw !== "0"
        ? unwrapCssVars(radiusRaw)
        : null,
    backgroundText,
    colorText,
    fontSizeText: showType ? unwrapCssVars(fontSizeAuth) : null,
    lineHeightText: showType ? unwrapCssVars(lineHeightAuth) : null,
    fontFamilyText: showType ? shortFontFamily(fontFamilyAuth) : null,
    fontWeightText: showType ? unwrapCssVars(fontWeightAuth) : null,
    letterSpacingText: showType
      ? unwrapCssVars(letterSpacingText ?? "0")
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
 * Primary preview component for idle inspect (Fluid Functionalism-style):
 * prefer the preview’s direct child (the control root), else largest node.
 */
function pickDefaultTarget(stage: HTMLElement): HTMLElement | null {
  const root = previewRoot(stage);

  for (const child of Array.from(root.children)) {
    if (child instanceof HTMLElement && isInspectableNode(stage, child)) {
      return child;
    }
  }

  let best: HTMLElement | null = null;
  let bestArea = 0;
  for (const node of root.querySelectorAll<HTMLElement>("*")) {
    if (!isInspectableNode(stage, node)) continue;
    const rect = node.getBoundingClientRect();
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
  /** Primary preview component — rulers always show this when idle. */
  const [defaultMeasure, setDefaultMeasure] = useState<Measure | null>(null);
  /** Hovered node — drives guides / popover; also overrides ruler span. */
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

    return () => {
      stageEl.removeEventListener("mousemove", onMove);
      stageEl.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
      ro.disconnect();
    };
  }, [enabled, stageRef]);

  if (!enabled || !mounted || !stage) return null;

  // Idle: primary component on rulers. Hover: that node’s span + grid guides.
  const measure = hoverMeasure ?? defaultMeasure;
  const hovering = hoverMeasure != null;
  const spanLeft = measure ? measure.left - stage.left : 0;
  const spanTop = measure ? measure.top - stage.top : 0;
  const hSpanMarks = measure ? spanRulerMarks(measure.width) : [];
  const vSpanMarks = measure ? spanRulerMarks(measure.height) : [];

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
      {/* Span-only rulers: ticks hang from the stage edge over the component’s
          occupied range. Idle = ticks + numbers; hover adds the shade. */}
      <div
        className={styles.stageFrame}
        style={{
          top: stage.top,
          left: stage.left,
          width: stage.width,
          height: stage.height,
        }}
      >
        {measure ? (
          <>
            <div
              className={styles.rulerH}
              style={{ left: spanLeft, width: measure.width }}
            >
              {hovering ? <div className={styles.rulerShade} /> : null}
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
              style={{ top: spanTop, height: measure.height }}
            >
              {hovering ? <div className={styles.rulerShade} /> : null}
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
