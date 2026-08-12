/**
 * Row-band packing engine for the CodeAI symbol mosaic.
 *
 * The symbol is sliced into horizontal bands whose exact bounds come from
 * the triangle's edge lines / the pill's box (analytic, no hit-testing).
 *
 * Sizing model: components are rendered at LOCKED size props — `small` for
 * atoms (buttons, chips, tags, toggles, segmented), `medium` for fillers
 * (fields, dropdowns, alerts, chat, sliders) — inside a reference band of
 * REF_HEIGHT px. The whole band is then zoomed so the reference height maps
 * onto the actual row height, so components scale as a unit and always fit.
 *
 * Inside a band: atoms sit in neutral "chrome" cards that fill the band
 * height; filler components stretch (width and height) to fill their slot;
 * primitive color swatches absorb any leftover so bands end flush with the
 * silhouette.
 */

export type Tone = "brand" | "pink" | "orange" | "success" | "info" | "neutral";

export type ComponentKind =
  | "alert"
  | "field"
  | "dropdown"
  | "chatMessage"
  | "chatInput"
  | "chatFile"
  | "slider"
  | "button"
  | "chip"
  | "tag"
  | "toggle"
  | "segmented";

export type PackedComponent = {
  type: "component";
  kind: ComponentKind;
  variant: number;
  label: string;
  tone: Tone;
  /** fixed = natural width; grow = stretches between minWidth/maxWidth. */
  sizing: "fixed" | "grow";
  /** Wrap in a neutral chrome card that fills the band height. */
  chrome: boolean;
  minWidth?: number;
  maxWidth?: number;
};

/** Swatches are always fixed 1:1 squares (side = band height). */
export type PackedSwatch = {
  type: "swatch";
  varName: string;
  label: string;
};

export type PackedItem = {
  id: string;
  content: PackedComponent | PackedSwatch;
};

export type Band = {
  id: string;
  /** px, relative to the stage (or to the pill box for pill bands). */
  x: number;
  y: number;
  width: number;
  height: number;
  items: PackedItem[];
  justify: "flex-start" | "center" | "space-between";
};

export type SymbolLayout = {
  stage: number;
  /** Global zoom applied inside every band (rowHeight / REF_HEIGHT). */
  zoom: number;
  bands: Band[];
  pill: {
    x: number;
    y: number;
    width: number;
    height: number;
    radius: number;
    bands: Band[];
  };
};

/**
 * Reference band height (px, pre-zoom) — exactly the medium control height
 * (DS scale: 24 / 32 / 40 / 48). Grow components at size medium fill it
 * flush with no air.
 */
export const REF_HEIGHT = 40;

/* ------------------------------------------------------------------ */
/* Primitive swatch palettes                                           */
/* ------------------------------------------------------------------ */

const PURPLES = ["--brand-purple-40", "--brand-purple-50", "--brand-purple-60"];
const PINKS = ["--brand-pink-40", "--brand-pink-50", "--brand-pink-60"];
const ORANGES = ["--brand-orange-40", "--brand-orange-50"];
const SENTIMENTS = [
  "--sentiment-success-50",
  "--sentiment-information-50",
  "--sentiment-warning-40",
];

export const SWATCH_PALETTES = {
  brand: [...PURPLES],
  accents: [...PINKS, ...ORANGES],
  sentiment: [...SENTIMENTS],
  all: [...PURPLES, ...PINKS, ...ORANGES],
} as const;

export type SwatchPalette = keyof typeof SWATCH_PALETTES;

/** Weighted pop pick: mostly purple, pink next, orange as the rare spark. */
function pickPop(rng: () => number, palette: SwatchPalette): string {
  if (palette !== "all") {
    return pick(rng, SWATCH_PALETTES[palette]);
  }
  const r = rng();
  if (r < 0.5) return pick(rng, PURPLES);
  if (r < 0.82) return pick(rng, PINKS);
  return pick(rng, ORANGES);
}

function pickTone(rng: () => number): Tone {
  const r = rng();
  if (r < 0.44) return "brand";
  if (r < 0.62) return "neutral";
  if (r < 0.78) return "pink";
  if (r < 0.88) return "orange";
  if (r < 0.94) return "success";
  return "info";
}

/* ------------------------------------------------------------------ */
/* Copy pools                                                          */
/* ------------------------------------------------------------------ */

const BUTTON_LABELS = ["Run", "Generate", "Try AI", "Build", "Ship it"];
const CHIP_LABELS = ["AI", "Lab", "Live", "Beta", "New"];
const TAG_LABELS = ["Info", "Beta", "New", "AI"];
const ALERT_COPY = [
  "Lesson draft ready",
  "Synced to CADS",
  "3 tips for loops",
  "New AI reply",
  "Saved",
];
const CHAT_HUMAN = ["Warm-up for Unit 3?", "Explain this loop", "Why 0?"];
const CHAT_AI = ["Try a 10× loop", "Check line 4", "Here's a starter"];
const FIELD_LABELS = ["Prompt", "Lesson", "Search"];
const DROPDOWN_LABELS = ["Grade", "Unit", "Model"];
const FILE_NAMES = ["loops.py", "sprite.png", "demo.js"];

/* ------------------------------------------------------------------ */
/* Width estimation (reference scale: small atoms / medium fillers)     */
/* ------------------------------------------------------------------ */

/** Approx char width at small/medium type (~14px). */
const CHAR_W = 7.2;
/** Horizontal padding added by the chrome card around atoms. */
const CARD_PAD = 24;

type ItemSpec = {
  kind: ComponentKind;
  label: string;
  sizing: "fixed" | "grow";
  chrome: boolean;
  minWidth: number;
  maxWidth?: number;
};

function specFor(
  kind: ComponentKind,
  rng: () => number,
  maxRoom: number,
): ItemSpec | null {
  const fitLabel = (labels: string[], base: number): string | null => {
    const fitting = labels.filter((l) => base + l.length * CHAR_W <= maxRoom);
    return fitting.length > 0 ? pick(rng, fitting) : null;
  };

  switch (kind) {
    case "button": {
      const base = CARD_PAD + 46;
      const label = fitLabel(BUTTON_LABELS, base);
      if (!label) return null;
      return {
        kind,
        label,
        sizing: "fixed",
        chrome: true,
        minWidth: base + label.length * CHAR_W,
      };
    }
    case "chip": {
      const base = CARD_PAD + 42;
      const label = fitLabel(CHIP_LABELS, base);
      if (!label) return null;
      return {
        kind,
        label,
        sizing: "fixed",
        chrome: true,
        minWidth: base + label.length * CHAR_W,
      };
    }
    case "tag": {
      const base = CARD_PAD + 32;
      const label = fitLabel(TAG_LABELS, base);
      if (!label) return null;
      return {
        kind,
        label,
        sizing: "fixed",
        chrome: true,
        minWidth: base + label.length * 6.2,
      };
    }
    case "toggle": {
      const withLabel = maxRoom >= 132;
      if (!withLabel && maxRoom < 66) return null;
      return {
        kind,
        label: withLabel ? "AI assist" : "",
        sizing: "fixed",
        chrome: true,
        minWidth: withLabel ? 132 : 66,
      };
    }
    case "segmented": {
      const wide = maxRoom >= 216;
      if (!wide && maxRoom < 158) return null;
      return {
        kind,
        label: wide ? "3" : "2",
        sizing: "fixed",
        chrome: true,
        minWidth: wide ? 216 : 158,
      };
    }
    case "chatFile": {
      const base = CARD_PAD + 92;
      const label = fitLabel(FILE_NAMES, base);
      if (!label) return null;
      return {
        kind,
        label,
        sizing: "fixed",
        chrome: true,
        minWidth: base + label.length * CHAR_W,
      };
    }
    case "chatMessage": {
      const label = fitLabel(rng() < 0.5 ? CHAT_HUMAN : CHAT_AI, 58);
      if (!label) return null;
      const min = 58 + label.length * 7.6;
      return {
        kind,
        label,
        sizing: "grow",
        chrome: false,
        minWidth: min,
        maxWidth: min * 1.5 + 40,
      };
    }
    case "field": {
      if (maxRoom < 150) return null;
      return {
        kind,
        label: pick(rng, FIELD_LABELS),
        sizing: "grow",
        chrome: false,
        minWidth: 150,
        maxWidth: 270,
      };
    }
    case "dropdown": {
      if (maxRoom < 162) return null;
      return {
        kind,
        label: pick(rng, DROPDOWN_LABELS),
        sizing: "grow",
        chrome: false,
        minWidth: 162,
        maxWidth: 260,
      };
    }
    case "slider": {
      if (maxRoom < 124) return null;
      return {
        kind,
        label: "",
        sizing: "grow",
        chrome: true,
        minWidth: 124,
        maxWidth: 230,
      };
    }
    case "chatInput": {
      if (maxRoom < 250) return null;
      return {
        kind,
        label: "Ask CodeAI…",
        sizing: "grow",
        chrome: false,
        minWidth: 250,
        maxWidth: 460,
      };
    }
    case "alert": {
      const base = 66;
      const label = fitLabel(ALERT_COPY, base);
      if (!label) return null;
      return {
        kind,
        label,
        sizing: "grow",
        chrome: false,
        minWidth: base + label.length * CHAR_W,
        maxWidth: 340,
      };
    }
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/* Band themes — each reads like a plausible slice of product UI        */
/* ------------------------------------------------------------------ */

type Theme = {
  name: string;
  /** Ordered kinds; the packer keeps what fits, in order. */
  sequence: ComponentKind[];
};

const THEMES: Theme[] = [
  { name: "chat", sequence: ["chatMessage", "chip", "chatMessage", "tag"] },
  { name: "compose", sequence: ["chatInput", "button"] },
  { name: "form", sequence: ["dropdown", "field", "toggle", "button"] },
  { name: "actions", sequence: ["button", "segmented", "tag", "chip"] },
  { name: "status", sequence: ["alert", "tag", "button"] },
  { name: "media", sequence: ["chatFile", "slider", "chip", "chatFile"] },
];

/* ------------------------------------------------------------------ */
/* Symbol geometry (viewBox 0 0 16 16, from codeai.svg)                 */
/* ------------------------------------------------------------------ */

const TRI_APEX_Y = 2.88;
const TRI_BOTTOM_Y = 13.2065;
const TRI_SLOPE = 0.5544; // |dx/dy| of both edges
const TRI_LEFT_ANCHOR = { x: 5.193, y: 3.098 };
const TRI_RIGHT_ANCHOR = { x: 6.2268, y: 3.098 };
const TRI_MIN_X = 0.075;
const TRI_MAX_X = 11.344;

const PILL = { x0: 12.512, x1: 16, y0: 2.794, y1: 13.2065, r: 0.573 };

function triangleRunAt(y: number): { x0: number; x1: number } | null {
  if (y < TRI_APEX_Y || y > TRI_BOTTOM_Y) return null;
  const yEff = Math.max(y, TRI_LEFT_ANCHOR.y);
  let x0 = TRI_LEFT_ANCHOR.x - TRI_SLOPE * (yEff - TRI_LEFT_ANCHOR.y);
  let x1 = TRI_RIGHT_ANCHOR.x + TRI_SLOPE * (yEff - TRI_RIGHT_ANCHOR.y);
  // Rounded bottom corners: pull in slightly near the base
  if (y > 12.7) {
    const t = (y - 12.7) / (TRI_BOTTOM_Y - 12.7);
    x0 += 0.35 * t * t;
    x1 -= 0.35 * t * t;
  }
  x0 = Math.max(x0, TRI_MIN_X);
  x1 = Math.min(x1, TRI_MAX_X);
  if (x1 - x0 <= 0.15) return null;
  return { x0, x1 };
}

/* ------------------------------------------------------------------ */
/* RNG helpers                                                          */
/* ------------------------------------------------------------------ */

function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rng: () => number, items: readonly T[]): T {
  return items[Math.floor(rng() * items.length)]!;
}

function shortLabel(varName: string): string {
  return varName.replace(/^--/, "").split("-").slice(-2).join("-");
}

/* ------------------------------------------------------------------ */
/* Band packing (all widths in reference px — pre-zoom)                 */
/* ------------------------------------------------------------------ */

type PackOptions = {
  rng: () => number;
  gap: number;
  popRatio: number;
  palette: SwatchPalette;
  enabled: Record<ComponentKind, boolean>;
};

let itemCounter = 0;

/** Square swatch side in reference px (bands are REF_HEIGHT tall). */
const SQ = REF_HEIGHT;

function swatchItem(rng: () => number, palette: SwatchPalette): PackedItem {
  const varName = pickPop(rng, palette);
  return {
    id: `i${itemCounter++}`,
    content: {
      type: "swatch",
      varName,
      label: shortLabel(varName),
    },
  };
}

function componentItem(spec: ItemSpec, rng: () => number): PackedItem {
  return {
    id: `i${itemCounter++}`,
    content: {
      type: "component",
      kind: spec.kind,
      variant: Math.floor(rng() * 8),
      label: spec.label,
      tone: pickTone(rng),
      sizing: spec.sizing,
      chrome: spec.chrome,
      minWidth: spec.minWidth,
      maxWidth: spec.maxWidth,
    },
  };
}

type PackedBandContent = {
  items: PackedItem[];
  justify: Band["justify"];
};

/** A centered row of 1:1 swatch squares, as many as fit. */
function swatchRow(
  width: number,
  rng: () => number,
  palette: SwatchPalette,
  gap: number,
): PackedBandContent {
  const n = Math.max(1, Math.floor((width + gap) / (SQ + gap)));
  return {
    items: Array.from({ length: n }, () => swatchItem(rng, palette)),
    justify: "center",
  };
}

/**
 * Pack one band of `width` reference px. Components are added in theme
 * order while their minimum widths fit; 1:1 swatch squares slot in as the
 * pops/mortar; remaining slack goes to grow components, extra squares, or
 * `space-between` so the band always ends flush with the silhouette.
 */
function packBand(
  width: number,
  theme: Theme,
  opts: PackOptions,
): PackedBandContent {
  const { rng, gap, popRatio, palette, enabled } = opts;

  // Narrow band (near the apex): a single centered atom reads better than
  // a component squeezed against a swatch.
  if (width < 130) {
    const atoms: ComponentKind[] = (
      ["tag", "chip", "button"] as ComponentKind[]
    ).filter((k) => enabled[k]);
    for (const kind of atoms.sort(() => rng() - 0.5)) {
      const spec = specFor(kind, rng, width - 6);
      if (spec) return { items: [componentItem(spec, rng)], justify: "center" };
    }
    return swatchRow(width, rng, palette, gap);
  }

  const items: PackedItem[] = [];
  let used = 0;
  let growCount = 0;

  const room = () => width - used - (items.length > 0 ? gap : 0);

  const sequence = theme.sequence.filter((k) => enabled[k]);
  // Loop the sequence so wide bands get more than one pass of the theme
  const queue = [...sequence, ...sequence];

  for (const kind of queue) {
    // Occasionally drop a square swatch pop before the next component
    if (items.length > 0 && rng() < popRatio && room() > SQ + 70) {
      items.push(swatchItem(rng, palette));
      used += SQ + gap;
    }

    const available = room();
    if (available < 40) break;
    const spec = specFor(kind, rng, available);
    if (!spec) continue;
    if (spec.minWidth + (items.length > 0 ? gap : 0) > width - used) continue;

    used += spec.minWidth + (items.length > 0 ? gap : 0);
    items.push(componentItem(spec, rng));
    if (spec.sizing === "grow") growCount += 1;
  }

  if (items.length === 0) {
    return swatchRow(width, rng, palette, gap);
  }

  // Fill leftover slack with more squares (at random interior positions),
  // then let grow components or space-between absorb the final few px.
  let slack = width - used;
  while (slack >= SQ + gap) {
    const idx = 1 + Math.floor(rng() * items.length);
    items.splice(idx, 0, swatchItem(rng, palette));
    slack -= SQ + gap;
  }

  const justify: Band["justify"] =
    growCount === 0 && slack > 4 && items.length > 1
      ? "space-between"
      : "flex-start";

  return { items, justify };
}

/* ------------------------------------------------------------------ */
/* Pill: same component assembly as the triangle, in a rounded stack    */
/* ------------------------------------------------------------------ */

/** Themes narrow enough to yield something inside the pill's width. */
const PILL_THEMES = ["actions", "media", "chat", "form", "status"];

function buildPillBands(
  widthPx: number,
  heightPx: number,
  rowHeight: number,
  gapPx: number,
  zoom: number,
  opts: PackOptions,
): Band[] {
  const bands: Band[] = [];
  // Exact rowHeight bands here too; the vertical gap flexes instead.
  const count = Math.max(
    2,
    Math.floor((heightPx + gapPx) / (rowHeight + gapPx)),
  );
  const h = rowHeight;
  const vGap = count > 1 ? (heightPx - count * h) / (count - 1) : 0;
  const { rng, palette } = opts;

  for (let i = 0; i < count; i++) {
    // Cap bands sit against the pill's rounded ends. Components there would
    // get their corners shaved by the pill's clipping, so caps are always
    // swatch squares stretched edge to edge — clipped color reads as design.
    const isCap = i === 0 || i === count - 1;
    const widthRef = widthPx / zoom;

    let content: PackedBandContent;
    if (isCap) {
      content = swatchRow(widthRef, rng, palette, opts.gap);
      if (content.items.length > 1) content.justify = "space-between";
    } else if (rng() < 0.22) {
      // Occasional all-square band keeps color pops in the pill's story
      content = swatchRow(widthRef, rng, palette, opts.gap);
    } else {
      const themeName = pick(rng, PILL_THEMES);
      content = packBand(widthRef, THEMES.find((t) => t.name === themeName)!, opts);
    }

    bands.push({
      id: `p${i}`,
      x: 0,
      y: i * (h + vGap),
      width: widthPx,
      height: h,
      items: content.items,
      justify: content.justify,
    });
  }

  return bands;
}

/* ------------------------------------------------------------------ */
/* Entry point                                                          */
/* ------------------------------------------------------------------ */

export function buildSymbolLayout(options: {
  stage: number;
  rowHeight: number;
  gap: number;
  seed: number;
  popRatio: number;
  palette: SwatchPalette;
  enabledComponents: Record<ComponentKind, boolean>;
}): SymbolLayout {
  const { stage, rowHeight, gap, seed, popRatio, palette } = options;
  const rng = mulberry32(seed);
  itemCounter = 0;

  const zoom = rowHeight / REF_HEIGHT;
  const k = stage / 16;
  const packOpts: PackOptions = {
    rng,
    gap: gap / zoom,
    popRatio,
    palette,
    enabled: options.enabledComponents,
  };

  const bands: Band[] = [];
  const topPx = TRI_APEX_Y * k;
  const bottomPx = TRI_BOTTOM_Y * k;
  let themeCursor = Math.floor(rng() * THEMES.length);

  // Bands are always EXACTLY rowHeight (a DS 8px-scale value), so medium
  // grow components and chrome cards fill them flush. The vertical gaps —
  // not the bands — flex to absorb the remainder, keeping the base flush.
  const total = bottomPx - topPx;
  const n = Math.max(1, Math.floor((total + gap) / (rowHeight + gap)));
  const bandH = rowHeight;
  const vGap = n > 1 ? (total - n * bandH) / (n - 1) : 0;

  for (let i = 0; i < n; i++) {
    const yPx = topPx + i * (bandH + vGap);
    const theme = THEMES[themeCursor % THEMES.length]!;
    themeCursor += 1;

    // Evaluate run bounds a touch above the band's vertical middle so the
    // band mostly nests inside the diagonal
    const yEvalUnits = (yPx + bandH * 0.42) / k;
    const run = triangleRunAt(yEvalUnits);
    if (!run) continue;

    const x0 = run.x0 * k;
    const x1 = run.x1 * k;
    const width = x1 - x0;
    const widthRef = width / zoom;

    if (widthRef < 52) {
      // Apex tip: a single square swatch centered on the symbol axis
      const cx = (x0 + x1) / 2;
      bands.push({
        id: `b${i}`,
        x: cx - bandH / 2,
        y: yPx,
        width: bandH,
        height: bandH,
        items: [swatchItem(rng, palette)],
        justify: "center",
      });
    } else {
      const content = packBand(widthRef, theme, packOpts);
      bands.push({
        id: `b${i}`,
        x: x0,
        y: yPx,
        width,
        height: bandH,
        items: content.items,
        justify: content.justify,
      });
    }
  }

  const pillX = PILL.x0 * k;
  const pillY = PILL.y0 * k;
  const pillW = (PILL.x1 - PILL.x0) * k;
  const pillH = (PILL.y1 - PILL.y0) * k;

  return {
    stage,
    zoom,
    bands,
    pill: {
      x: pillX,
      y: pillY,
      width: pillW,
      height: pillH,
      radius: PILL.r * k,
      bands: buildPillBands(pillW, pillH, rowHeight, gap, zoom, packOpts),
    },
  };
}
