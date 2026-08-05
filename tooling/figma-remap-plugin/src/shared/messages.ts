/**
 * Message protocol + data model shared between the plugin main thread
 * (src/code.ts) and the UI iframe (src/ui/main.ts).
 *
 * Internal CADS Audit plugin. Findings-only: clean CADS usage is silent.
 * Scope: semantic color remaps, text styles, unbound radii, foreign modes,
 * non-CADS components. Text-style targets come from baked
 * src/data/cadsTextStyles.ts and/or in-plugin capture inside the CADS file.
 */

/** Where a variable (or raw paint / text style) is consumed on a node. */
export type UsageProp =
  | { kind: "paint"; property: "fills" | "strokes"; index: number }
  | { kind: "effect"; index: number }
  | { kind: "field"; field: string }
  | { kind: "textStyle" };

/**
 * Fill behind a paint usage — used to decide white/black → `-fixed` vs
 * `primary` / `primary-inverse`. Chromatic = brand/accent/sentiment (or a
 * saturated raw fill); neutral = gray/black/white/alpha.
 */
export type ColorBackdrop = "chromatic" | "neutral" | "unknown";

/**
 * Theme the matcher assumes when picking theme-aware primary / primary-inverse
 * (and when preferring Light vs Dark mode hexes). Independent of `-fixed`.
 */
export type ColorThemeAssumption = "light" | "dark";

export interface UsageRef {
  nodeId: string;
  nodeName: string;
  nodeType: string;
  prop: UsageProp;
  /** Node lives inside a component instance — rebinding may be rejected by Figma. */
  inInstance: boolean;
  /** The layer itself or one of its ancestors is hidden on the canvas. */
  hidden: boolean;
  /**
   * Nearest solid fill behind this paint (same-node under-fills, then parents).
   * Only set for color paint usages.
   */
  backdrop?: ColorBackdrop;
}

/** One distinct variable finding (issues only — clean SoT is omitted). */
export interface AuditVariableEntry {
  /** Stable id used to key mappings within a session ("var:<id>" or "hex:<hex>"). */
  id: string;
  variableId: string;
  /** Published key (empty for local variables) — used for the persistent mapping cache. */
  variableKey: string;
  name: string;
  resolvedType: "COLOR" | "FLOAT" | "STRING" | "BOOLEAN";
  collectionName: string;
  /** Library display name; "This file" for local, "Unknown library (not enabled)" when unresolvable. */
  libraryName: string;
  remote: boolean;
  /** True when the variable already belongs to the chosen source-of-truth library. */
  isSourceOfTruth: boolean;
  /**
   * Policy flag: "primitive" = SoT primitive color used directly (should be a
   * semantic variable); "typographyVariable" = typography variable bound to
   * text (a text style should be used instead — reported, not variable-remapped).
   */
  flag?: "primitive" | "typographyVariable" | "shapeVariable";
  /** modeName -> display value (hex for colors, stringified otherwise). */
  values: Record<string, string>;
  /**
   * Applied corner-radius px read from the bound node. Used for shape-variable
   * value matching when mode values are missing/unresolvable (e.g. deleted
   * DSCO tokens like br-s), same path as raw radii.
   */
  value?: number;
  usages: UsageRef[];
}

/** A raw (unbound) solid paint found in the selection. */
export interface RawPaintEntry {
  id: string; // "hex:#rrggbb" (or #rrggbbaa)
  hex: string;
  usages: UsageRef[];
}

/** A Figma paint style used where CADS semantic color variables are required. */
export interface AuditPaintStyleEntry {
  id: string;
  styleId: string;
  name: string;
  hex: string;
  usages: UsageRef[];
}

/** An explicit variable mode set on a frame in the selection. */
export interface ExplicitModeEntry {
  nodeId: string;
  nodeName: string;
  collectionId: string;
  collectionName: string;
  libraryName: string;
  modeName: string;
  isSourceOfTruth: boolean;
  /** The layer itself or one of its ancestors is hidden on the canvas. */
  hidden: boolean;
}

/** One distinct text style finding (non-CADS only). */
export interface AuditTextStyleEntry {
  id: string; // "style:<styleId>"
  styleId: string;
  /** Published key (used for the mapping cache). */
  styleKey: string;
  name: string;
  remote: boolean;
  /** True when the style is already in the target catalog (CADS). */
  isSourceOfTruth: boolean;
  /** family / weight / size / lineHeight display values. */
  values: Record<string, string>;
  usages: UsageRef[];
}

/** Text with no style applied, grouped by font signature. */
export interface RawTextEntry {
  id: string; // "font:<family>/<style>/<size>"
  label: string; // e.g. "Barlow Semi Condensed Medium 16"
  values: Record<string, string>;
  usages: UsageRef[];
}

/** An unbound corner-radius value, grouped by px. */
export interface RawRadiusEntry {
  id: string; // "radius:<px>"
  label: string; // e.g. "8px"
  value: number;
  usages: UsageRef[];
}

/** A component whose instances appear in the selection (report-only). */
export interface ComponentUsageEntry {
  key: string;
  name: string;
  /** Key found in the baked CADS component catalog. */
  isCads: boolean;
  /** Main component lives in the audited file itself (not a library). */
  isLocal: boolean;
  instanceCount: number;
  /** Sample of instance layer names (up to 5). */
  sampleNodeNames: string[];
}

/** Font Awesome text using a pre-FA7 family, grouped by font signature. */
export interface FontAwesomeTextEntry {
  id: string; // "fontawesome:<family>/<style>/<size>"
  label: string;
  values: Record<string, string>;
  usages: UsageRef[];
}

/** An unbound corner-radius value, grouped by px (one usage per node). */
export interface RawRadiusEntry {
  id: string; // "radius:<px>"
  label: string; // e.g. "8px"
  value: number;
  usages: UsageRef[];
}

/** A non-CADS component whose instances appear in the selection. */
export interface ComponentUsageEntry {
  key: string;
  name: string;
  /** Key found in the baked CADS component catalog. */
  isCads: boolean;
  /** Main component lives in the audited file itself (not a library). */
  isLocal: boolean;
  instanceCount: number;
  /** Sample of instance layer names (up to 5). */
  sampleNodeNames: string[];
  usages: UsageRef[];
}

/** Ordinary frames/groups whose exact name matches a CADS component. */
export interface DetachedComponentEntry {
  id: string;
  componentName: string;
  usages: UsageRef[];
}

/** Compact counts for the summary-card UI. */
export interface AuditSummary {
  /** Visible warning usages by audit category. */
  colors: number;
  typography: number;
  shape: number;
  modes: number;
  components: number;
  /** Individual audited usages, including both compliant and warning usages. */
  totalUsages: number;
  /** Individual usages backed by CADS variables, styles, or components. */
  passes: number;
  /** Individual usages that produced an audit warning. */
  warnings: number;
  /** Rounded CADS usage percentage (0–100). */
  complianceScore: number;
  /** True when every visible category usage count is 0. */
  passed: boolean;
  /** Total visible warning usages across categories. */
  totalFindings: number;
}

export interface AuditResult {
  selectionLabel: string;
  rootNodeIds: string[];
  /** Resolved Light/Dark CADS mode shared by the audited roots, when detectable. */
  colorModeName: string | null;
  /**
   * Theme assumed for color remap proposals. `dark` when roots already resolve
   * to SoT Dark, or when the selection looks like a hand-built dark UI.
   */
  colorThemeAssumption: ColorThemeAssumption;
  /**
   * True when Dark was inferred from paint density (not from an existing SoT
   * Dark mode). UI preselects “Set frame mode → Dark”.
   */
  manualDarkMode: boolean;
  nodesScanned: number;
  summary: AuditSummary;
  /** Color findings only (foreign + primitive). Typography-variable rows live here with flag. */
  entries: AuditVariableEntry[];
  paintStyles: AuditPaintStyleEntry[];
  rawPaints: RawPaintEntry[];
  textStyles: AuditTextStyleEntry[];
  rawTexts: RawTextEntry[];
  /** Font Awesome text that is not using a Font Awesome 7 family. */
  fontAwesomeTexts: FontAwesomeTextEntry[];
  rawRadii: RawRadiusEntry[];
  /** Non-CADS components only. */
  components: ComponentUsageEntry[];
  /** Heuristic only: detached instances have no durable Figma API marker. */
  detachedComponents: DetachedComponentEntry[];
  /** Foreign explicit modes only. */
  explicitModes: ExplicitModeEntry[];
  /** Text nodes with mixed per-character fills that were skipped. */
  mixedTextSkipped: number;
  /** Text nodes with mixed styles/fonts per character range that were skipped. */
  mixedStyleSkipped: number;
}

/** A library (grouped variable collections) enabled in the current file. */
export interface LibraryInfo {
  libraryName: string;
  collections: { key: string; name: string }[];
}

/** A variable in the chosen source-of-truth library (imported for value access). */
export interface TargetVariable {
  key: string;
  variableId: string;
  name: string;
  resolvedType: "COLOR" | "FLOAT" | "STRING" | "BOOLEAN";
  collectionKey: string;
  collectionName: string;
  values: Record<string, string>;
}

/** A text style in the target catalog (baked metrics or imported). */
export interface TargetTextStyle {
  key: string;
  name: string;
  values: Record<string, string>;
}

export interface TargetCatalog {
  libraryName: string;
  collections: {
    key: string;
    name: string;
    /** modeName list (from the imported collection). */
    modes: string[];
    variableCount: number;
  }[];
  variables: TargetVariable[];
  textStyles: TargetTextStyle[];
  /** Where the text style keys came from. */
  textStyleSource: "captured" | "baked" | "none";
}

/** Persisted result of "capture text styles" run inside the library file. */
export interface CapturedStyleCatalog {
  fileName: string;
  capturedAt: string;
  styles: {
    key: string;
    name: string;
    /** When present, catalog load skips importStyleByKeyAsync for this style. */
    values?: Record<string, string>;
  }[];
}

export type MatchSource =
  | "cache"
  | "rule"
  | "exact-name"
  | "fuzzy-name"
  | "value"
  | "ai"
  | "manual"
  | "none";

export interface MappingProposal {
  /** AuditVariableEntry.id or RawPaintEntry.id */
  sourceId: string;
  /** TargetVariable.key, or null when unresolved / intentionally skipped. */
  targetKey: string | null;
  source: MatchSource;
  confidence: number;
  rationale?: string;
}

export interface ApplyRequest {
  mappings: {
    sourceId: string;
    targetKey: string;
    /** Audit usage indexes selected in the fix-review UI. Omitted means all. */
    usageIndexes?: number[];
  }[];
  /** Set this mode (of the SoT collection) explicitly on the audited root frames. */
  setMode: { collectionKey: string; modeName: string } | null;
  /** Remove explicit modes from non-SoT collections found in the audit. */
  clearForeignModes: boolean;
  /** Category scoped in the fix panel — used for toast messaging. */
  category: FixCategory;
}

export interface ApplyFailure {
  nodeName: string;
  sourceName: string;
  reason: string;
}

export interface ApplyReport {
  usagesRebound: number;
  variablesRemapped: number;
  /** Component instances swapped to CADS (Wave A/B). */
  componentsSwapped: number;
  modesSet: number;
  modesCleared: number;
  failures: ApplyFailure[];
}

export type AiProvider = "anthropic" | "openai";

export interface AiSettings {
  provider: AiProvider;
  model: string;
  apiKey: string;
}

export const DEFAULT_AI_MODELS: Record<AiProvider, string> = {
  anthropic: "claude-sonnet-4-5",
  openai: "gpt-5-mini",
};

export interface PluginSettings {
  /** Chosen source-of-truth library name (per user, per plugin). */
  libraryName: string | null;
  ai: AiSettings | null;
  /** sourceKey ("hex:…", "font:…", or a variable/style key) -> target key. */
  mappingCache: Record<string, string>;
  capturedStyles: CapturedStyleCatalog | null;
}

export const EMPTY_SETTINGS: PluginSettings = {
  libraryName: null,
  ai: null,
  mappingCache: {},
  capturedStyles: null,
};

export type FixCategory =
  | "colors"
  | "typography"
  | "shape"
  | "modes"
  | "components"
  | "all";

export type UiToCodeMessage =
  | { type: "init" }
  | { type: "audit" }
  | { type: "clear-selection" }
  | { type: "locate-layer"; nodeId: string }
  | { type: "propose-mappings"; category?: FixCategory }
  | { type: "apply"; request: ApplyRequest }
  | { type: "save-ai-settings"; ai: AiSettings | null }
  | { type: "notify"; message: string; error?: boolean };

export type CodeToUiMessage =
  | { type: "settings"; settings: PluginSettings }
  | { type: "no-library"; message: string }
  | { type: "catalog-progress"; done: number; total: number; label?: string }
  | { type: "catalog"; catalog: TargetCatalog }
  | { type: "selection"; count: number; label: string | null; nodeIds: string[] }
  | { type: "audit-progress"; nodesScanned: number }
  | { type: "audit"; result: AuditResult }
  | { type: "proposals"; proposals: MappingProposal[]; category: FixCategory }
  | { type: "apply-done"; report: ApplyReport }
  | { type: "fatal"; message: string };
