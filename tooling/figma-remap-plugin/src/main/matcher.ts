/**
 * Deterministic mapping proposals: cache -> exact name -> value -> fuzzy name.
 * Pure functions (no Figma API) so the pipeline is unit-testable.
 */
import type {
  AuditTextStyleEntry,
  AuditVariableEntry,
  MappingProposal,
  RawPaintEntry,
  RawTextEntry,
  TargetTextStyle,
  TargetVariable,
} from "../shared/messages";

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
}

export function proposeForVariable(
  entry: AuditVariableEntry,
  ctx: MatchContext,
): MappingProposal {
  const cacheKey = entry.variableKey || entry.id;
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

  const candidates = ctx.targets.filter(
    (t) => t.resolvedType === entry.resolvedType,
  );
  let best: { target: TargetVariable; score: number; kind: "exact-name" | "fuzzy-name" | "value" } | null =
    null;
  const sourceKey = normalizedKey(entry.name);

  for (const target of candidates) {
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
      sourceId: entry.id,
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
  return { sourceId: entry.id, targetKey: null, source: "none", confidence: 0 };
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

export interface StyleMatchContext {
  targets: TargetTextStyle[];
  cache: Record<string, string>;
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
  const sourceKey = normalizeSegments(entry.name).join("/");
  let best: {
    target: TargetTextStyle;
    score: number;
    kind: "exact-name" | "fuzzy-name" | "value";
  } | null = null;
  for (const target of ctx.targets) {
    const nScore = nameScore(entry.name, target.name);
    const vScore = fontValueScore(entry.values, target.values);
    let score: number;
    let kind: "exact-name" | "fuzzy-name" | "value";
    if (normalizeSegments(target.name).join("/") === sourceKey) {
      score = 1;
      kind = "exact-name";
    } else if (vScore >= nScore) {
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
        best.kind === "exact-name"
          ? "Style names match"
          : best.kind === "value"
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

/**
 * DSCO/raw radius -> CADS shape token using the agreed migration bands.
 * Every resolved mode must land in the same band; otherwise we leave it for
 * human review rather than guessing.
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

  const sourceValues =
    entry.value !== undefined
      ? [entry.value]
      : Object.values(entry.values ?? {})
          .map(Number)
          .filter(Number.isFinite);
  const exactMatch = radiusTargets.find((target) => {
    const targetValues = new Set(
      Object.values(target.values).map(Number).filter(Number.isFinite),
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

export function proposeForRawPaint(
  entry: RawPaintEntry,
  ctx: MatchContext,
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
  const hex = entry.hex.toLowerCase();
  let best: { target: TargetVariable; modes: number } | null = null;
  for (const target of ctx.targets) {
    if (target.resolvedType !== "COLOR") continue;
    const modes = Object.values(target.values).filter(
      (v) => v.toLowerCase() === hex,
    ).length;
    if (modes > 0 && (!best || modes > best.modes)) best = { target, modes };
  }
  if (best) {
    return {
      sourceId: entry.id,
      targetKey: best.target.key,
      source: "value",
      confidence: 0.7,
      rationale: `Hex matches ${best.modes > 1 ? "all modes" : "one mode"} — verify the semantic role`,
    };
  }
  return { sourceId: entry.id, targetKey: null, source: "none", confidence: 0 };
}
