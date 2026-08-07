/**
 * Deterministic mapping proposals: cache -> exact name -> value -> fuzzy name.
 * Pure functions (no Figma API) so the pipeline is unit-testable.
 */
import { dscoToCadsColorName } from "../data/dscoColors";
import {
  faFamilyTargetKey,
  toFontAwesome7Family,
} from "../shared/fontAwesome";
import type {
  AuditPaintStyleEntry,
  AuditTextStyleEntry,
  AuditVariableEntry,
  ColorThemeAssumption,
  FontAwesomeTextEntry,
  MappingProposal,
  RawPaintEntry,
  RawTextEntry,
  TargetTextStyle,
  TargetVariable,
  UsageRef,
} from "../shared/messages";
import {
  inferColorSurface,
  surfaceFromTokenName,
  type ColorSurface,
} from "../shared/surfaces";

export type MonoTone = "white" | "black";
export type { ColorThemeAssumption };
export type { ColorSurface };
export { inferColorSurface };

export function normalizeSegments(name: string): string[] {
  return name
    .toLowerCase()
    .replace(/([a-z])([0-9])/g, "$1 $2")
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

function normalizedKey(name: string): string {
  return normalizeSegments(name).join("/");
}

function jaccard(a: string[], b: string[]): number {
  const setA = new Set(a);
  const setB = new Set(b);
  let inter = 0;
  for (const s of setA) if (setB.has(s)) inter++;
  const union = setA.size + setB.size - inter;
  return union === 0 ? 0 : inter / union;
}

function nameScore(source: string, target: string): number {
  const a = normalizeSegments(source);
  const b = normalizeSegments(target);
  if (a.join("/") === b.join("/")) return 1;
  let score = jaccard(a, b);
  if (a.length && b.length && a[a.length - 1] === b[b.length - 1]) {
    score = Math.min(0.95, score + 0.2);
  }
  return score;
}

/** Share of source mode values found in the target (mode-name-aware first). */
function valueScore(
  source: Record<string, string>,
  target: Record<string, string>,
): number {
  const sourceModes = Object.keys(source);
  if (sourceModes.length === 0) return 0;
  const targetValues = new Set(Object.values(target).map((v) => v.toLowerCase()));
  let matched = 0;
  let modeNameMatched = 0;
  for (const mode of sourceModes) {
    const value = source[mode].toLowerCase();
    if (!targetValues.has(value)) continue;
    matched++;
    const sameModeTarget = Object.keys(target).find(
      (m) => m.toLowerCase() === mode.toLowerCase(),
    );
    if (sameModeTarget && target[sameModeTarget].toLowerCase() === value) {
      modeNameMatched++;
    }
  }
  const coverage = matched / sourceModes.length;
  if (coverage === 0) return 0;
  // Multi-mode agreement is a much stronger signal than a single shared hex.
  const base = sourceModes.length > 1 ? 0.92 : 0.72;
  const modeBonus = modeNameMatched === sourceModes.length ? 0.05 : 0;
  return Math.min(0.97, coverage * base + modeBonus);
}

export interface MatchContext {
  targets: TargetVariable[];
  /** sourceVariableKey (or "hex:<hex>") -> targetVariableKey */
  cache: Record<string, string>;
  /**
   * Assumed CADS color theme for theme-aware primary / primary-inverse picks.
   * Defaults to light when omitted.
   */
  colorThemeAssumption?: ColorThemeAssumption;
}

function surfacePrefix(surface: ColorSurface): string {
  return surface === "border" ? "border/" : `${surface}/`;
}

export function filterBySurface(
  targets: TargetVariable[],
  surface: ColorSurface,
): TargetVariable[] {
  const prefix = surfacePrefix(surface);
  const filtered = targets.filter(
    (t) =>
      t.resolvedType === "COLOR" &&
      t.name.toLowerCase().startsWith(prefix),
  );
  return filtered.length > 0 ? filtered : targets.filter((t) => t.resolvedType === "COLOR");
}

function parseRgb(hex: string): { r: number; g: number; b: number } | null {
  const raw = hex.trim().toLowerCase().replace(/^#/, "");
  if (!/^[0-9a-f]{6}([0-9a-f]{2})?$/.test(raw)) return null;
  return {
    r: parseInt(raw.slice(0, 2), 16),
    g: parseInt(raw.slice(2, 4), 16),
    b: parseInt(raw.slice(4, 6), 16),
  };
}

/** RGB Euclidean distance in 0–255 channel space. */
export function hexDistance(a: string, b: string): number {
  const aa = parseRgb(a);
  const bb = parseRgb(b);
  if (!aa || !bb) return Number.POSITIVE_INFINITY;
  const dr = aa.r - bb.r;
  const dg = aa.g - bb.g;
  const db = aa.b - bb.b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

/** Max RGB distance accepted for a nearest-hex suggestion (~40 channel units). */
const NEAREST_HEX_THRESHOLD = 40;

function findColorTargetByName(
  targets: TargetVariable[],
  name: string,
): TargetVariable | undefined {
  const key = normalizedKey(name);
  return targets.find(
    (t) => t.resolvedType === "COLOR" && normalizedKey(t.name) === key,
  );
}

function isNearWhite(hex: string): boolean {
  const rgb = parseRgb(hex);
  return !!rgb && rgb.r >= 245 && rgb.g >= 245 && rgb.b >= 245;
}

function isNearBlack(hex: string): boolean {
  const rgb = parseRgb(hex);
  return !!rgb && rgb.r <= 50 && rgb.g <= 50 && rgb.b <= 55;
}

/**
 * Use `-fixed` only when a majority of known backdrops are chromatic
 * (e.g. white icon on brand/accent/sentiment fill). Default to theme-aware
 * primary / primary-inverse otherwise.
 */
export function majorityNeedsFixed(usages: UsageRef[]): boolean {
  let chromatic = 0;
  let known = 0;
  for (const usage of usages) {
    if (usage.backdrop === "chromatic") {
      chromatic++;
      known++;
    } else if (usage.backdrop === "neutral") {
      known++;
    }
  }
  return known > 0 && chromatic > known / 2;
}

/**
 * White/black → CADS semantic path.
 * `-fixed` only on chromatic primary chrome; otherwise theme-aware primary /
 * primary-inverse (swapped when assuming CADS Dark).
 */
export function monoToneSemanticName(
  tone: MonoTone,
  surface: ColorSurface,
  useFixed: boolean,
  theme: ColorThemeAssumption = "light",
): string {
  if (useFixed) {
    if (surface === "text") return `text/neutral/${tone}-fixed`;
    if (surface === "border") return `border/neutral/${tone}-fixed`;
    return `background/neutral/${tone}-fixed`;
  }
  const dark = theme === "dark";
  if (tone === "white") {
    if (surface === "text") {
      return dark ? "text/neutral/primary" : "text/neutral/primary-inverse";
    }
    if (surface === "border") return "border/neutral/primary";
    return dark
      ? "background/neutral/primary-inverse"
      : "background/neutral/primary";
  }
  if (surface === "text") {
    return dark ? "text/neutral/primary-inverse" : "text/neutral/primary";
  }
  if (surface === "border") return "border/neutral/secondary";
  return dark
    ? "background/neutral/primary"
    : "background/neutral/primary-inverse";
}

function detectMonoToneFromStyleName(styleName: string): MonoTone | null {
  const parts = styleName
    .split("/")
    .map((p) => p.trim().toLowerCase())
    .filter(Boolean);
  if (parts.length < 2) return null;
  if (parts[0] !== "light" && parts[0] !== "dark") return null;
  if (parts[1] === "white") return "white";
  if (parts[1] === "black") return "black";
  return null;
}

function detectMonoToneFromTargetName(name: string): MonoTone | null {
  const n = name.toLowerCase();
  if (n.includes("white-fixed") || /(^|\/)white($|\/)/.test(n)) return "white";
  if (n.includes("black-fixed") || /(^|\/)black($|\/)/.test(n)) return "black";
  return null;
}

function themeOf(ctx: MatchContext): ColorThemeAssumption {
  return ctx.colorThemeAssumption === "dark" ? "dark" : "light";
}

/** Higher = better match for the assumed theme's mode name. */
function modeThemeScore(
  modeName: string,
  theme: ColorThemeAssumption,
): number {
  const isDark = /dark/i.test(modeName);
  const isLight = /light/i.test(modeName);
  if (theme === "dark") {
    if (isDark) return 2;
    if (isLight) return 0;
    return 1;
  }
  if (isLight) return 2;
  if (isDark) return 0;
  return 1;
}

function proposeMonoTone(
  sourceId: string,
  tone: MonoTone,
  usages: UsageRef[],
  ctx: MatchContext,
  rationalePrefix: string,
): MappingProposal {
  const surface = inferColorSurface(usages);
  const useFixed = majorityNeedsFixed(usages);
  const theme = themeOf(ctx);
  const targetName = monoToneSemanticName(tone, surface, useFixed, theme);
  const match = findColorTargetByName(ctx.targets, targetName);
  if (!match) {
    return { sourceId, targetKey: null, source: "none", confidence: 0 };
  }
  const themeNote =
    theme === "dark" ? " under CADS Dark" : " under CADS Light";
  return {
    sourceId,
    targetKey: match.key,
    source: "rule",
    confidence: 1,
    rationale: `${rationalePrefix}${match.name}${
      useFixed
        ? " (fixed — on chromatic primary fill)"
        : ` (theme-aware${themeNote} — not on chromatic primary)`
    }`,
  };
}

/** Prefer hex from the assumed theme's mode, else the other, else first. */
function preferredHex(
  values: Record<string, string>,
  theme: ColorThemeAssumption = "light",
): string | null {
  const preferred = Object.entries(values).find(
    ([mode]) => modeThemeScore(mode, theme) === 2 && parseRgb(values[mode]),
  );
  if (preferred) return preferred[1];
  const fallback = Object.entries(values).find(
    ([mode, value]) => modeThemeScore(mode, theme) >= 1 && parseRgb(value),
  );
  if (fallback) return fallback[1];
  for (const value of Object.values(values)) {
    if (parseRgb(value)) return value;
  }
  return null;
}

function proposeColorByHex(
  sourceId: string,
  hex: string,
  usages: UsageRef[],
  ctx: MatchContext,
): MappingProposal {
  // Near-white / near-black: pick fixed vs primary/inverse from backdrop.
  if (isNearWhite(hex)) {
    return proposeMonoTone(
      sourceId,
      "white",
      usages,
      ctx,
      "Near-white hex → ",
    );
  }
  if (isNearBlack(hex)) {
    return proposeMonoTone(
      sourceId,
      "black",
      usages,
      ctx,
      "Near-black hex → ",
    );
  }

  const surface = inferColorSurface(usages);
  const candidates = filterBySurface(ctx.targets, surface);
  const normalized = hex.toLowerCase();
  const theme = themeOf(ctx);

  let exact: { target: TargetVariable; modes: number; score: number } | null =
    null;
  for (const target of candidates) {
    let modes = 0;
    let bestMode = -1;
    for (const [mode, value] of Object.entries(target.values)) {
      if (value.toLowerCase() !== normalized) continue;
      modes++;
      bestMode = Math.max(bestMode, modeThemeScore(mode, theme));
    }
    if (modes === 0) continue;
    const score = modes * 10 + bestMode;
    if (!exact || score > exact.score) exact = { target, modes, score };
  }
  if (exact) {
    const mono = detectMonoToneFromTargetName(exact.target.name);
    if (mono) {
      return proposeMonoTone(
        sourceId,
        mono,
        usages,
        ctx,
        `Hex matches ${mono} token → `,
      );
    }
    return {
      sourceId,
      targetKey: exact.target.key,
      source: "value",
      confidence: exact.modes > 1 ? 0.9 : 0.85,
      rationale: `Hex matches ${exact.modes > 1 ? "multiple modes" : "one mode"} on ${surface} — verify the semantic role`,
    };
  }

  let nearest: {
    target: TargetVariable;
    distance: number;
    modeHex: string;
    modeScore: number;
  } | null = null;
  for (const target of candidates) {
    for (const [mode, modeHex] of Object.entries(target.values)) {
      const distance = hexDistance(normalized, modeHex);
      if (distance > NEAREST_HEX_THRESHOLD) continue;
      const modeScore = modeThemeScore(mode, theme);
      if (
        !nearest ||
        distance < nearest.distance ||
        (distance === nearest.distance && modeScore > nearest.modeScore)
      ) {
        nearest = { target, distance, modeHex, modeScore };
      }
    }
  }
  if (nearest) {
    const mono = detectMonoToneFromTargetName(nearest.target.name);
    if (mono) {
      return proposeMonoTone(
        sourceId,
        mono,
        usages,
        ctx,
        `Nearest hex is a ${mono} token → `,
      );
    }
    const confidence =
      Math.round(
        (0.7 - (nearest.distance / NEAREST_HEX_THRESHOLD) * 0.15) * 100,
      ) / 100;
    return {
      sourceId,
      targetKey: nearest.target.key,
      source: "value",
      confidence,
      rationale: `Nearest ${surface} hex to ${hex} is ${nearest.modeHex} (${nearest.target.name}) — verify the semantic role`,
    };
  }

  return { sourceId, targetKey: null, source: "none", confidence: 0 };
}

export function proposeForVariable(
  entry: AuditVariableEntry,
  ctx: MatchContext,
  options?: { sourceId?: string; usages?: UsageRef[] },
): MappingProposal {
  const sourceId = options?.sourceId ?? entry.id;
  const usages = options?.usages ?? entry.usages;
  const surface = inferColorSurface(usages);
  const cacheKeyBase = entry.variableKey || entry.id;
  const cacheKey = `${cacheKeyBase}::${surface}`;
  const cached =
    ctx.cache[cacheKey] ??
    // Legacy unscoped cache entries only apply when the rule surface matches.
    ctx.cache[cacheKeyBase];
  if (cached && ctx.targets.some((t) => t.key === cached)) {
    const cachedTarget = ctx.targets.find((t) => t.key === cached);
    const cachedSurface = cachedTarget
      ? surfaceFromTokenName(cachedTarget.name)
      : null;
    if (!cachedSurface || cachedSurface === surface) {
      return {
        sourceId,
        targetKey: cached,
        source: "cache",
        confidence: 1,
        rationale: "Previously approved mapping",
      };
    }
  }

  // Colors: only the curated DSCO Variables → CADS alias map (plus cache).
  // Styles, primitives, hex, and white/black need contextual AI / manual pick.
  if (entry.resolvedType === "COLOR") {
    if (entry.flag !== "primitive") {
      const ruleName = dscoToCadsColorName(entry.name);
      if (ruleName) {
        const ruleSurface = surfaceFromTokenName(ruleName);
        // Do not apply a text/* rule to fill usages (or vice versa).
        if (ruleSurface && ruleSurface !== surface) {
          return { sourceId, targetKey: null, source: "none", confidence: 0 };
        }
        const match = findColorTargetByName(ctx.targets, ruleName);
        if (match) {
          return {
            sourceId,
            targetKey: match.key,
            source: "rule",
            confidence: 1,
            rationale: `DSCO → CADS naming rule: ${entry.name} → ${match.name}`,
          };
        }
      }
    }
    return { sourceId, targetKey: null, source: "none", confidence: 0 };
  }

  const typeCandidates = ctx.targets.filter(
    (t) => t.resolvedType === entry.resolvedType,
  );

  let best: {
    target: TargetVariable;
    score: number;
    kind: "exact-name" | "fuzzy-name" | "value";
  } | null = null;
  const sourceKey = normalizedKey(entry.name);

  for (const target of typeCandidates) {
    const nScore = nameScore(entry.name, target.name);
    const vScore = valueScore(entry.values, target.values);
    let score: number;
    let kind: "exact-name" | "fuzzy-name" | "value";
    if (normalizedKey(target.name) === sourceKey) {
      score = 1;
      kind = "exact-name";
    } else if (vScore >= nScore) {
      // Agreement between value + partial name similarity strengthens a value match.
      score = Math.min(0.98, vScore + nScore * 0.1);
      kind = "value";
    } else {
      score = Math.min(0.95, nScore + vScore * 0.15);
      kind = "fuzzy-name";
    }
    if (!best || score > best.score) best = { target, score, kind };
  }

  if (best && best.score >= 0.55) {
    return {
      sourceId,
      targetKey: best.target.key,
      source: best.kind,
      confidence: Math.round(best.score * 100) / 100,
      rationale:
        best.kind === "exact-name"
          ? "Names match"
          : best.kind === "value"
            ? "Resolved values match"
            : "Similar name",
    };
  }
  return { sourceId, targetKey: null, source: "none", confidence: 0 };
}

/** Deterministic FA6 (or older) → FA7 family upgrade. */
export function proposeForFontAwesome(
  entry: FontAwesomeTextEntry,
): MappingProposal {
  const family = entry.values.family ?? "";
  const targetFamily = toFontAwesome7Family(family);
  if (!targetFamily) {
    return {
      sourceId: entry.id,
      targetKey: null,
      source: "none",
      confidence: 0,
    };
  }
  return {
    sourceId: entry.id,
    targetKey: faFamilyTargetKey(targetFamily),
    source: "rule",
    confidence: 1,
    rationale: `Upgrade ${family} → ${targetFamily}`,
  };
}

/** Font-property agreement: family is required, then weight/size/lineHeight. */
function fontValueScore(
  source: Record<string, string>,
  target: Record<string, string>,
): number {
  if (
    !source.family ||
    source.family.toLowerCase() !== (target.family ?? "").toLowerCase()
  ) {
    return 0;
  }
  let score = 0.35;
  if (source.weight && source.weight === target.weight) score += 0.25;
  if (source.size && source.size === target.size) score += 0.25;
  if (source.lineHeight && source.lineHeight === target.lineHeight) score += 0.1;
  return score;
}

type TextRole = "heading" | "body" | "mono" | "link" | "label" | "overline";

function parseFontSize(values: Record<string, string>): number | null {
  const raw = values.size;
  if (!raw) return null;
  const n = Number(String(raw).replace(/px$/i, "").trim());
  return Number.isFinite(n) && n > 0 ? n : null;
}

/** Map font style names onto a 0–3 ladder for nearest-weight matching. */
function weightRank(weight: string | undefined): number {
  const w = (weight ?? "").toLowerCase().replace(/[\s-_]+/g, "");
  if (!w || /regular|book|normal|roman/.test(w)) return 0;
  if (/medium/.test(w)) return 1;
  if (/semibold|demibold|semi/.test(w)) return 2;
  if (/bold|black|heavy|extrabold|extrast?rong/.test(w)) return 3;
  if (/light|thin|hairline/.test(w)) return 0;
  return 0;
}

function isMonoFamily(family: string | undefined): boolean {
  if (!family) return false;
  return /mono|code|consolas|courier|menlo|monaco|jetbrains|fira\s*code|source\s*code|ibm\s*plex\s*mono|roboto\s*mono|space\s*mono|google\s*sans\s*code/i.test(
    family,
  );
}

function styleFamily(name: string): TextRole {
  const head = normalizeSegments(name)[0] ?? "";
  if (head === "heading") return "heading";
  if (head === "mono") return "mono";
  if (head === "link") return "link";
  if (head === "label") return "label";
  if (head === "overline") return "overline";
  return "body";
}

function detectTextRole(
  values: Record<string, string>,
  sourceName?: string,
): TextRole {
  const name = (sourceName ?? "").toLowerCase();
  if (
    isMonoFamily(values.family) ||
    /\bmono\b/.test(name) ||
    /\bcode\b/.test(name)
  ) {
    return "mono";
  }
  if (
    values.textDecoration === "UNDERLINE" ||
    /\blink\b/.test(name)
  ) {
    return "link";
  }
  if (values.textCase === "UPPER" || /\boverline\b/.test(name)) {
    return "overline";
  }
  if (/\blabel\b|\bbutton\b|\bcaption\b/.test(name)) {
    return "label";
  }
  if (/\bheading\b|\btitle\b|\bdisplay\b|\bh[1-6]\b/.test(name)) {
    return "heading";
  }
  return "body";
}

const ROLE_PRIORITY: Record<TextRole, number> = {
  body: 0,
  heading: 1,
  mono: 2,
  label: 3,
  link: 4,
  overline: 5,
};

/**
 * Closest CADS text style by font size, then weight, then semantic role.
 * Equidistant sizes prefer the larger ramp step (13 → Body 3 @ 14, not Body 4 @ 12).
 */
export function closestTextStyle(
  values: Record<string, string>,
  targets: TargetTextStyle[],
  sourceName?: string,
): { target: TargetTextStyle; sizeDist: number; weightDist: number } | null {
  const sourceSize = parseFontSize(values);
  if (sourceSize === null || targets.length === 0) return null;

  const sourceWeight = weightRank(values.weight);
  const role = detectTextRole(values, sourceName);

  type Candidate = {
    target: TargetTextStyle;
    sizeDist: number;
    weightDist: number;
    roleDist: number;
    size: number;
  };

  const candidates: Candidate[] = [];
  for (const target of targets) {
    const size = parseFontSize(target.values);
    if (size === null) continue;
    const family = styleFamily(target.name);
    candidates.push({
      target,
      sizeDist: Math.abs(size - sourceSize),
      weightDist: Math.abs(weightRank(target.values.weight) - sourceWeight),
      // Prefer the detected role; otherwise fall back toward Body.
      roleDist:
        family === role
          ? 0
          : role === "body" && family === "heading"
            ? 2
            : ROLE_PRIORITY[family] + 1,
      size,
    });
  }
  if (candidates.length === 0) return null;

  candidates.sort((a, b) => {
    if (a.sizeDist !== b.sizeDist) return a.sizeDist - b.sizeDist;
    // Tie on distance → prefer the larger CADS size (13→14, not 12).
    if (a.size !== b.size) return b.size - a.size;
    if (a.weightDist !== b.weightDist) return a.weightDist - b.weightDist;
    if (a.roleDist !== b.roleDist) return a.roleDist - b.roleDist;
    return a.target.name.localeCompare(b.target.name);
  });

  const best = candidates[0];
  return {
    target: best.target,
    sizeDist: best.sizeDist,
    weightDist: best.weightDist,
  };
}

function closestMatchProposal(
  sourceId: string,
  values: Record<string, string>,
  ctx: StyleMatchContext,
  sourceName?: string,
): MappingProposal | null {
  const match = closestTextStyle(values, ctx.targets, sourceName);
  if (!match) return null;
  const { target, sizeDist, weightDist } = match;
  const confidence =
    sizeDist === 0
      ? weightDist === 0
        ? 0.95
        : 0.88
      : Math.max(0.6, 0.9 - sizeDist * 0.04 - weightDist * 0.03);
  const sizeLabel = values.size ?? "?";
  return {
    sourceId,
    targetKey: target.key,
    source: "value",
    confidence: Math.round(confidence * 100) / 100,
    rationale:
      sizeDist === 0 && weightDist === 0
        ? `Exact size/weight match → ${target.name}`
        : `${sizeLabel}px → closest CADS style ${target.name}`,
  };
}

export interface StyleMatchContext {
  targets: TargetTextStyle[];
  cache: Record<string, string>;
}

/**
 * DSCO → CADS text-style name rewrite. Covers the published DSCO Variables
 * ramp (42 styles). Returns null when the source isn't a known DSCO pattern.
 *
 * Rules (confirmed from live DSCO Variables + CADS catalogs):
 * - Heading/Hn              → Heading/Hn/Semi Bold
 * - Body/Body N             → Body/Body N/Regular
 * - Body/Body N - Strong    → Body/Body N/Semi Bold
 * - Body/Body N - ExtraStrong → Body/Body N/Bold
 * - Link/Link Body N        → Link/Link N
 * - Mono/Body N             → Mono/Mono N/Regular
 * - Mono/Body N [- ]Strong  → Mono/Mono N/Semi Bold
 * - Label/Label N           → Label/Label N
 * - Overline/Overline N     → Overline/Overline N
 * - Button/Button N         → Body/Body N/Semi Bold (no CADS Button styles)
 * - Caption/Caption 1       → Label/Label 2 (same 14/SemiBold role)
 */
export function dscoToCadsTextStyleName(sourceName: string): string | null {
  const parts = sourceName
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length !== 2) return null;

  const [groupRaw, leafRaw] = parts;
  const group = groupRaw.toLowerCase();
  const leaf = leafRaw.trim();

  const heading = /^h([1-6])$/i.exec(leaf);
  if (group === "heading" && heading) {
    return `Heading/H${heading[1]}/Semi Bold`;
  }

  const body = /^body\s*(\d+)(?:\s*[-–—]?\s*(strong|extrastrong))?$/i.exec(leaf);
  if (group === "body" && body) {
    const n = body[1];
    const weight = (body[2] ?? "").toLowerCase();
    const cadsWeight =
      weight === "extrastrong" ? "Bold" : weight === "strong" ? "Semi Bold" : "Regular";
    return `Body/Body ${n}/${cadsWeight}`;
  }

  const link = /^link\s*body\s*(\d+)$/i.exec(leaf);
  if (group === "link" && link) {
    return `Link/Link ${link[1]}`;
  }

  const mono = /^body\s*(\d+)(?:\s*[-–—]?\s*(strong))?$/i.exec(leaf);
  if (group === "mono" && mono) {
    const n = mono[1];
    const cadsWeight = mono[2] ? "Semi Bold" : "Regular";
    return `Mono/Mono ${n}/${cadsWeight}`;
  }

  const label = /^label\s*(\d+)$/i.exec(leaf);
  if (group === "label" && label) {
    return `Label/Label ${label[1]}`;
  }

  const overline = /^overline\s*(\d+)$/i.exec(leaf);
  if (group === "overline" && overline) {
    return `Overline/Overline ${overline[1]}`;
  }

  const button = /^button\s*(\d+)$/i.exec(leaf);
  if (group === "button" && button) {
    return `Body/Body ${button[1]}/Semi Bold`;
  }

  if (group === "caption" && /^caption\s*1$/i.test(leaf)) {
    return "Label/Label 2";
  }

  return null;
}

function findTextStyleByName(
  targets: TargetTextStyle[],
  name: string,
): TargetTextStyle | undefined {
  const key = normalizeSegments(name).join("/");
  return targets.find((target) => normalizeSegments(target.name).join("/") === key);
}

export function proposeForTextStyle(
  entry: AuditTextStyleEntry,
  ctx: StyleMatchContext,
): MappingProposal {
  const cacheKey = entry.styleKey || entry.id;
  const cached = ctx.cache[cacheKey];
  if (cached && ctx.targets.some((t) => t.key === cached)) {
    return {
      sourceId: entry.id,
      targetKey: cached,
      source: "cache",
      confidence: 1,
      rationale: "Previously approved mapping",
    };
  }

  const ruleName = dscoToCadsTextStyleName(entry.name);
  if (ruleName) {
    const match = findTextStyleByName(ctx.targets, ruleName);
    if (match) {
      return {
        sourceId: entry.id,
        targetKey: match.key,
        source: "rule",
        confidence: 1,
        rationale: `DSCO → CADS naming rule: ${entry.name} → ${match.name}`,
      };
    }
  }

  const sourceKey = normalizeSegments(entry.name).join("/");
  const exact = ctx.targets.find(
    (target) => normalizeSegments(target.name).join("/") === sourceKey,
  );
  if (exact) {
    return {
      sourceId: entry.id,
      targetKey: exact.key,
      source: "exact-name",
      confidence: 1,
      rationale: "Style names match",
    };
  }

  // Non-DSCO / foreign styles: closest CADS ramp by size + weight (+ role).
  const closest = closestMatchProposal(
    entry.id,
    entry.values,
    ctx,
    entry.name,
  );
  if (closest) return closest;

  // Last resort: same-family font props or fuzzy name (rare without size).
  let best: {
    target: TargetTextStyle;
    score: number;
    kind: "fuzzy-name" | "value";
  } | null = null;
  for (const target of ctx.targets) {
    const nScore = nameScore(entry.name, target.name);
    const vScore = fontValueScore(entry.values, target.values);
    let score: number;
    let kind: "fuzzy-name" | "value";
    if (vScore >= nScore) {
      score = Math.min(0.95, vScore + nScore * 0.15);
      kind = "value";
    } else {
      score = Math.min(0.95, nScore + vScore * 0.15);
      kind = "fuzzy-name";
    }
    if (!best || score > best.score) best = { target, score, kind };
  }
  if (best && best.score >= 0.55) {
    return {
      sourceId: entry.id,
      targetKey: best.target.key,
      source: best.kind,
      confidence: Math.round(best.score * 100) / 100,
      rationale:
        best.kind === "value"
          ? "Font properties match"
          : "Similar style name",
    };
  }
  return { sourceId: entry.id, targetKey: null, source: "none", confidence: 0 };
}

export function proposeForRawText(
  entry: RawTextEntry,
  ctx: StyleMatchContext,
): MappingProposal {
  const cached = ctx.cache[entry.id];
  if (cached && ctx.targets.some((t) => t.key === cached)) {
    return {
      sourceId: entry.id,
      targetKey: cached,
      source: "cache",
      confidence: 1,
      rationale: "Previously approved mapping",
    };
  }

  const closest = closestMatchProposal(entry.id, entry.values, ctx, entry.label);
  if (closest) return closest;

  // Same-family exact props only (no cross-family guessing without size).
  let best: { target: TargetTextStyle; score: number } | null = null;
  for (const target of ctx.targets) {
    const score = fontValueScore(entry.values, target.values);
    if (!best || score > best.score) best = { target, score };
  }
  if (best && best.score >= 0.6) {
    return {
      sourceId: entry.id,
      targetKey: best.target.key,
      source: "value",
      confidence: Math.round(best.score * 100) / 100,
      rationale: "Font properties match — verify the semantic role",
    };
  }
  return { sourceId: entry.id, targetKey: null, source: "none", confidence: 0 };
}

function shapeRuleName(value: number): "sm" | "md" | "lg" | "xl" | "round" | null {
  if (value >= 3 && value <= 5) return "sm";
  if (value >= 6 && value <= 7) return "md";
  if (value >= 8 && value <= 9) return "lg";
  if (value >= 10 && value <= 16) return "xl";
  if (value >= 24) return "round";
  return null;
}

/** Parse a radius display value ("4", "4px", 4) into px. */
export function parseRadiusPx(raw: string | number | undefined | null): number | null {
  if (raw === undefined || raw === null) return null;
  if (typeof raw === "number") return Number.isFinite(raw) ? raw : null;
  const trimmed = String(raw).trim();
  if (!trimmed) return null;
  const withUnit = /^(-?\d+(?:\.\d+)?)\s*px$/i.exec(trimmed);
  if (withUnit) {
    const n = Number(withUnit[1]);
    return Number.isFinite(n) ? n : null;
  }
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
}

function radiusSourceValues(entry: {
  value?: number;
  values?: Record<string, string>;
}): number[] {
  // Prefer the applied node px (same signal raw radii use) so deleted/foreign
  // tokens like DSCO br-s still map when mode values are empty or unparseable.
  if (entry.value !== undefined) {
    const applied = parseRadiusPx(entry.value);
    if (applied !== null) return [applied];
  }
  const fromModes = Object.values(entry.values ?? {})
    .map(parseRadiusPx)
    .filter((n): n is number => n !== null);
  return [...new Set(fromModes)];
}

/**
 * DSCO/raw radius -> CADS shape token using the agreed migration bands.
 * Every resolved mode must land in the same band; otherwise we leave it for
 * human review rather than guessing.
 *
 * Non-CADS / deleted shape variables use the same value path as raw radii:
 * applied px (or resolved mode values) → exact match → band rule.
 */
export function proposeForRadius(
  entry: {
    id: string;
    variableKey?: string;
    value?: number;
    values?: Record<string, string>;
  },
  shapeTargets: TargetVariable[],
  cache: Record<string, string>,
): MappingProposal {
  const radiusTargets = shapeTargets.filter(
    (target) => normalizeSegments(target.name)[0] === "shape",
  );
  const cacheKey = entry.variableKey || entry.id;
  const cached = cache[cacheKey];
  if (cached && radiusTargets.some((t) => t.key === cached)) {
    return {
      sourceId: entry.id,
      targetKey: cached,
      source: "cache",
      confidence: 1,
      rationale: "Previously approved mapping",
    };
  }

  const sourceValues = radiusSourceValues(entry);
  const exactMatch = radiusTargets.find((target) => {
    const targetValues = new Set(
      Object.values(target.values)
        .map(parseRadiusPx)
        .filter((n): n is number => n !== null),
    );
    return (
      sourceValues.length > 0 &&
      sourceValues.every((value) => targetValues.has(value))
    );
  });
  if (exactMatch) {
    return {
      sourceId: entry.id,
      targetKey: exactMatch.key,
      source: "value",
      confidence: 1,
      rationale: `${sourceValues.join("/")}px exactly matches ${exactMatch.name}`,
    };
  }

  const ruleNames = new Set(sourceValues.map(shapeRuleName));
  if (sourceValues.length === 0 || ruleNames.size !== 1 || ruleNames.has(null)) {
    return {
      sourceId: entry.id,
      targetKey: null,
      source: "none",
      confidence: 0,
      rationale: "Radius falls outside the agreed migration bands",
    };
  }

  const ruleName = Array.from(ruleNames)[0];
  const match = radiusTargets.find((target) => {
    const segments = normalizeSegments(target.name);
    return segments[segments.length - 1] === ruleName;
  });
  if (!match) {
    return {
      sourceId: entry.id,
      targetKey: null,
      source: "none",
      confidence: 0,
      rationale: `CADS shape/${ruleName} is unavailable`,
    };
  }
  return {
    sourceId: entry.id,
    targetKey: match.key,
    source: "rule",
    confidence: 1,
    rationale: `${sourceValues.join("/")}px maps to shape/${ruleName} by the DSCO → CADS migration rule`,
  };
}

type PaintLikeEntry = Pick<RawPaintEntry, "id" | "hex" | "usages"> & {
  /** Present on paint styles — enables DSCO Styles / variable name rules. */
  name?: string;
};

export function proposeForRawPaint(
  entry: PaintLikeEntry | AuditPaintStyleEntry,
  ctx: MatchContext,
  options?: { sourceId?: string; usages?: UsageRef[] },
): MappingProposal {
  const sourceId = options?.sourceId ?? entry.id;
  const usages = options?.usages ?? entry.usages;
  const surface = inferColorSurface(usages);
  const cacheKey = `${entry.id}::${surface}`;
  const cached = ctx.cache[cacheKey] ?? ctx.cache[entry.id];
  if (cached && ctx.targets.some((t) => t.key === cached)) {
    const cachedTarget = ctx.targets.find((t) => t.key === cached);
    const cachedSurface = cachedTarget
      ? surfaceFromTokenName(cachedTarget.name)
      : null;
    if (!cachedSurface || cachedSurface === surface) {
      return {
        sourceId,
        targetKey: cached,
        source: "cache",
        confidence: 1,
        rationale: "Previously approved mapping",
      };
    }
  }

  // Paint styles / raw hex need contextual AI (or manual pick) — not heuristics.
  return { sourceId, targetKey: null, source: "none", confidence: 0 };
}
