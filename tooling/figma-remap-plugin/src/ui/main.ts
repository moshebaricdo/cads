/**
 * CADS Audit — UI iframe app.
 * Summary-first findings workspace + category-scoped fix panel.
 */
import type {
  AiProvider,
  AuditResult,
  CodeToUiMessage,
  FixCategory,
  MappingProposal,
  PluginSettings,
  TargetCatalog,
  UiToCodeMessage,
  UsageRef,
} from "../shared/messages";
import { DEFAULT_AI_MODELS, EMPTY_SETTINGS } from "../shared/messages";
import {
  cadsComponents,
  isPrimitiveColorCollection,
  isShapeCollection,
  isShapeVariable,
} from "../data/cadsCatalog";
import { isSwappableComponentKey } from "../data/componentSwaps";
import {
  isDscoComponentKey,
  suggestCadsComponent,
} from "../data/dscoComponents";
import { requestAiSuggestions, type AiSourceInput } from "./ai";
import { icon as faIcon } from "./faIcons";

const cadsComponentNameByKey = new Map(
  cadsComponents.map((component) => [component.key, component.name]),
);

function send(message: UiToCodeMessage): void {
  parent.postMessage({ pluginMessage: message }, "*");
}

function $(id: string): HTMLElement {
  const node = document.getElementById(id);
  if (!node) throw new Error(`missing #${id}`);
  return node;
}

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// ---------------------------------------------------------------------------
// State

let settings: PluginSettings = EMPTY_SETTINGS;
let catalog: TargetCatalog | null = null;
let audit: AuditResult | null = null;
let proposals = new Map<string, MappingProposal>();
let recommendedTargetKeys = new Map<string, string>();
let included = new Set<string>();
let includedUsageIndexes = new Map<string, Set<number>>();
let expandedFixSources = new Set<string>();
/** Fix-card source ids whose mixed hidden usages are revealed. */
let shownHiddenFixSources = new Set<string>();
/** Fix-panel group labels whose hidden-only mappings are revealed. */
let shownHiddenFixGroups = new Set<string>();
/**
 * Category whose Prepare fixes is in flight (propose + optional AI).
 * Button shows a spinner until the fix panel opens.
 */
let preparingFixes: FixCategory | null = null;
let modeChoiceIndex = -1;
let clearForeignModes = false;
let aiBusy = false;
let auditing = false;
/** Draft provider while the settings modal is open. */
let aiProviderDraft: AiProvider = "anthropic";

const AI_PROVIDER_OPTIONS: { value: AiProvider; label: string }[] = [
  { value: "anthropic", label: "Anthropic" },
  { value: "openai", label: "OpenAI" },
];
let fixCategory: FixCategory = "all";
let catalogProgress = { done: 0, total: 0, label: "Loading CADS" };
let auditNodesScanned = 0;
let libraryMissingMessage: string | null = null;
let selectionCount = 0;
let selectionLabel: string | null = null;
let selectionNodeIds: string[] = [];
let activeOverviewCategory: OverviewCategory | null = null;
let expandedColorWarnings = new Set<string>();
let activeColorTab: "colors" | "modes" = "colors";
let shownHiddenColorGroups = new Set<string>();
let expandedTypographyWarnings = new Set<string>();
let shownHiddenTypographyGroups = new Set<string>();
let expandedComponentWarnings = new Set<string>();
let shownHiddenComponentGroups = new Set<string>();
let expandedShapeWarnings = new Set<string>();
let shownHiddenShapeGroups = new Set<string>();

function showBanner(message: string | null): void {
  const banner = $("banner");
  banner.classList.toggle("show", message !== null);
  banner.textContent = message ?? "";
}

function showPanel(name: "fix" | null): void {
  const show = name === "fix";
  $("fix-panel").classList.toggle("show", show);
  $("main").hidden = show;
}

function setMainCentered(centered: boolean): void {
  $("main").classList.toggle("centered", centered);
}

function spinnerIcon(): HTMLElement {
  const wrap = el("div", "hero-icon");
  wrap.innerHTML = faIcon("spinner", 22, "icon-spin");
  return wrap;
}

function cursorIcon(): HTMLElement {
  const wrap = el("div", "hero-icon");
  wrap.innerHTML = faIcon("bullseye-pointer", 22);
  return wrap;
}

function readyCheckIcon(): HTMLElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "check");
  svg.setAttribute("width", "14");
  svg.setAttribute("height", "14");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "2.5");
  svg.setAttribute("aria-hidden", "true");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M20 6L9 17l-5-5");
  svg.appendChild(path);
  return svg as unknown as HTMLElement;
}

function isSameSelection(left: string[], right: string[]): boolean {
  if (left.length !== right.length) return false;
  const rightIds = new Set(right);
  return left.every((id) => rightIds.has(id));
}

function closeReauditDialog(): void {
  $("reaudit-modal").classList.remove("show");
}

function openReauditDialog(): void {
  if (!audit) return;
  $("reaudit-message").textContent =
    `You selected “${selectionLabel ?? "a new layer"}”. ` +
    `Running again will replace the results for “${audit.selectionLabel}”.`;
  $("reaudit-modal").classList.add("show");
  ($("reaudit-confirm") as HTMLButtonElement).focus();
}

function runAudit(forceNewSelection = false): void {
  if (!catalog || selectionCount === 0 || auditing) return;
  if (
    audit &&
    !forceNewSelection &&
    !isSameSelection(selectionNodeIds, audit.rootNodeIds)
  ) {
    openReauditDialog();
    return;
  }
  closeReauditDialog();
  showBanner(null);
  auditing = true;
  auditNodesScanned = 0;
  audit = null;
  renderMain();
  send({ type: "audit" });
}

function clearAuditSelection(): void {
  audit = null;
  recommendedTargetKeys.clear();
  includedUsageIndexes.clear();
  expandedFixSources.clear();
  shownHiddenFixSources.clear();
  shownHiddenFixGroups.clear();
  preparingFixes = null;
  activeOverviewCategory = null;
  expandedColorWarnings.clear();
  activeColorTab = "colors";
  shownHiddenColorGroups.clear();
  expandedTypographyWarnings.clear();
  shownHiddenTypographyGroups.clear();
  expandedComponentWarnings.clear();
  shownHiddenComponentGroups.clear();
  expandedShapeWarnings.clear();
  shownHiddenShapeGroups.clear();
  selectionCount = 0;
  selectionLabel = null;
  selectionNodeIds = [];
  showPanel(null);
  send({ type: "clear-selection" });
  renderMain();
}

function updateStatusFooter(): void {
  const status = $("footer-status");
  status.textContent = "";

  if (libraryMissingMessage) {
    status.textContent = "CADS library missing";
    return;
  }
  if (!catalog) {
    status.textContent = "Initializing…";
    return;
  }
  if (auditing) {
    status.textContent =
      auditNodesScanned > 0
        ? `Auditing… ${auditNodesScanned} layers`
        : "Auditing…";
    return;
  }
  if (audit) {
    const clear = el("button", "footer-clear", "Clear selection") as HTMLButtonElement;
    clear.type = "button";
    clear.addEventListener("click", clearAuditSelection);
    status.appendChild(clear);
    return;
  }
  if (selectionCount > 0) {
    status.appendChild(readyCheckIcon());
    const label = el("span", "", "");
    label.innerHTML = "<strong>Ready</strong>";
    status.appendChild(label);
    return;
  }
  status.innerHTML = "<strong>Initialized</strong> · Awaiting selection.";
}

// ---------------------------------------------------------------------------
// Shared helpers

function isHexColor(value: string): boolean {
  return /^#[0-9a-f]{6}([0-9a-f]{2})?$/i.test(value);
}

function colorValueForAuditMode(values: Record<string, string>): string[] {
  const colors = Object.entries(values).filter(([, value]) =>
    isHexColor(value),
  );
  if (colors.length === 0) return [];
  const modeName = audit?.colorModeName?.trim().toLowerCase();
  const themed = modeName
    ? colors.find(([name]) => name.trim().toLowerCase() === modeName)
    : null;
  return [themed?.[1] ?? colors[0][1]];
}

function swatches(values: string[]): HTMLElement {
  const wrap = el("div", "swatches");
  for (const value of values.slice(0, 2)) {
    const s = el("span", "swatch");
    s.style.background = value;
    s.title = value;
    wrap.appendChild(s);
  }
  return wrap;
}

function entrySwatches(values: Record<string, string>): HTMLElement {
  return swatches(Object.values(values).filter(isHexColor));
}

// ---------------------------------------------------------------------------
// Main summary view

function renderLoadingHero(): void {
  const main = $("main");
  setMainCentered(true);
  const hero = el("div", "hero");
  hero.appendChild(spinnerIcon());
  hero.appendChild(el("h2", "", "Loading CADS"));
  hero.appendChild(
    el("p", "", "Just a sec, importing the latest CADS specs."),
  );
  const progressWrap = el("div", "hero-progress");
  const bar = el("div", "bar");
  const fill = el("div");
  fill.id = "main-progress-bar";
  const { done, total, label } = catalogProgress;
  const percent = total > 0 ? Math.round((done / total) * 100) : 8;
  fill.style.width = `${Math.max(percent, total > 0 ? 0 : 8)}%`;
  bar.appendChild(fill);
  progressWrap.appendChild(bar);
  const meta = el("div", "meta");
  meta.id = "main-progress-meta";
  meta.textContent =
    total > 0
      ? `${label} — ${done} of ${total}`
      : label
        ? `${label}…`
        : "Connecting to CADS…";
  progressWrap.appendChild(meta);
  hero.appendChild(progressWrap);
  main.appendChild(hero);
}

function renderReadyHero(): void {
  const main = $("main");
  setMainCentered(true);
  const hero = el("div", "hero");
  hero.appendChild(cursorIcon());
  const hasSelection = selectionCount > 0;
  if (hasSelection) {
    hero.appendChild(
      el("h2", "", `Audit: ${selectionLabel ?? "Selection"}`),
    );
    hero.appendChild(
      el("p", "", "Hit “Audit selection” when you’re ready."),
    );
  } else {
    hero.appendChild(el("h2", "", "Select a frame."));
    hero.appendChild(
      el("p", "", "Start by selecting a frame on the canvas."),
    );
  }
  const cta = el("div", "cta");
  const btn = el("button", "btn brand", "Audit selection") as HTMLButtonElement;
  btn.disabled = !hasSelection;
  btn.addEventListener("click", () => runAudit());
  cta.appendChild(btn);
  hero.appendChild(cta);
  main.appendChild(hero);
}

type OverviewCategory = "colors" | "typography" | "components" | "shape";

const OVERVIEW_ICONS: Record<OverviewCategory | "frame" | "rerun", string> = {
  colors: faIcon("palette", 15),
  typography: faIcon("font", 15),
  components: faIcon("diamonds-4", 15),
  shape: faIcon("square", 15),
  frame: faIcon("table-layout", 13),
  rerun: faIcon("rotate-left", 14),
};

function renderCategoryCard(
  id: OverviewCategory,
  title: string,
  count: number,
  onOpen?: () => void,
): HTMLElement {
  const card = onOpen
    ? (el("button", "category-card interactive") as HTMLButtonElement)
    : el("div", "category-card");
  if (card instanceof HTMLButtonElement && onOpen) {
    card.type = "button";
    card.addEventListener("click", onOpen);
  }
  const icon = el(
    "div",
    count > 0 ? "category-icon warning" : "category-icon pass",
  );
  icon.innerHTML = OVERVIEW_ICONS[id];
  card.appendChild(icon);

  const copy = el("div", "category-copy");
  copy.appendChild(el("div", "category-title", title));
  card.appendChild(copy);

  const status = el(
    "div",
    count > 0 ? "category-status warning" : "category-status pass",
  );
  status.innerHTML =
    count > 0
      ? `${faIcon("circle-exclamation", 11)}<span>${count} usage${count === 1 ? "" : "s"}</span>`
      : '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg><span>Pass</span>';
  card.appendChild(status);

  if (onOpen) {
    const chevron = el("span", "category-chevron");
    chevron.innerHTML = faIcon("caret-down", 11, "icon-rotate-neg90");
    card.appendChild(chevron);
  }
  return card;
}

interface ColorLayerRef {
  nodeId: string;
  nodeName: string;
  nodeType: string;
  detail: string;
  hidden: boolean;
}

interface ColorWarning {
  id: string;
  label: string;
  meta: string;
  values: string[];
  /** Gray secondary label shown next to the name (e.g. "14px"). */
  sizeLabel?: string;
  layers: ColorLayerRef[];
  icon?: "mode" | "typography" | "fontAwesome" | "component" | "shape";
  /** Suggested CADS component name for component findings (null = no suggestion). */
  suggestedSwap?: string | null;
}

interface ColorWarningGroup {
  id: "foreign" | "primitive" | "styles" | "raw" | "modes";
  title: string;
  warnings: ColorWarning[];
}

interface TypographyWarningGroup {
  id: "variables" | "styles" | "raw" | "fontAwesome";
  title: string;
  warnings: ColorWarning[];
}

interface ComponentWarningGroup {
  id: "detached" | "nonCads";
  title: string;
  warnings: ColorWarning[];
}

interface ShapeWarningGroup {
  id: "variables" | "raw";
  title: string;
  warnings: ColorWarning[];
}

function usageDetail(usage: UsageRef): string {
  let detail: string;
  switch (usage.prop.kind) {
    case "paint":
      detail = `${usage.prop.property === "fills" ? "Fill" : "Stroke"} ${usage.prop.index + 1}`;
      break;
    case "effect":
      detail = `Effect ${usage.prop.index + 1}`;
      break;
    case "field":
      detail = usage.prop.field.replace(/([a-z])([A-Z])/g, "$1 $2");
      break;
    case "textStyle":
      detail = "Text style";
      break;
  }
  return usage.inInstance ? `${detail} · in instance` : detail;
}

function colorLayer(usage: UsageRef): ColorLayerRef {
  return {
    nodeId: usage.nodeId,
    nodeName: usage.nodeName,
    nodeType: usage.nodeType,
    detail: usageDetail(usage),
    hidden: usage.hidden,
  };
}

function colorWarningGroups(): ColorWarningGroup[] {
  if (!audit) return [];
  const colorEntries = audit.entries.filter(
    (entry) =>
      entry.resolvedType === "COLOR" && entry.flag !== "typographyVariable",
  );
  const variableWarning = (
    entry: (typeof colorEntries)[number],
  ): ColorWarning => ({
    id: entry.id,
    label: entry.name,
    meta:
      entry.flag === "primitive"
        ? `CADS primitive · ${entry.collectionName}`
        : `${entry.libraryName} · ${entry.collectionName}`,
    values: colorValueForAuditMode(entry.values),
    layers: entry.usages.map(colorLayer),
  });

  return [
    {
      id: "primitive",
      title: "CADS primitives",
      warnings: colorEntries
        .filter((entry) => entry.flag === "primitive")
        .map(variableWarning),
    },
    {
      id: "foreign",
      title: "Non-CADS variables",
      warnings: colorEntries
        .filter((entry) => entry.flag !== "primitive")
        .map(variableWarning),
    },
    {
      id: "styles",
      title: "Color styles",
      warnings: audit.paintStyles.map((entry) => ({
        id: entry.id,
        label: entry.name,
        meta: "Figma color style",
        values: [entry.hex],
        layers: entry.usages.map(colorLayer),
      })),
    },
    {
      id: "raw",
      title: "Raw hex values",
      warnings: audit.rawPaints.map((entry) => ({
        id: entry.id,
        label: entry.hex,
        meta: "Unbound color",
        values: [entry.hex],
        layers: entry.usages.map(colorLayer),
      })),
    },
    {
      id: "modes",
      title: "Color mode overrides",
      warnings: audit.explicitModes.map((entry, index) => ({
        id: `mode:${entry.nodeId}:${entry.collectionId}:${index}`,
        label: `${entry.collectionName} · ${entry.modeName}`,
        meta: entry.libraryName,
        values: [],
        icon: "mode",
        layers: [
          {
            nodeId: entry.nodeId,
            nodeName: entry.nodeName,
            nodeType: "FRAME",
            detail: "Explicit mode",
            hidden: entry.hidden,
          },
        ],
      })),
    },
  ];
}

/** Parse a px font size for sorting (unknowns sink to the end). */
function typographySizeKey(
  values: Record<string, string> | undefined,
  fallbackLabel?: string,
): number {
  if (values?.size) {
    const fromSize = Number(String(values.size).replace(/px$/i, "").trim());
    if (Number.isFinite(fromSize) && fromSize > 0) return fromSize;
  }
  if (values) {
    for (const value of Object.values(values)) {
      const n = Number(String(value).replace(/px$/i, "").trim());
      // Font sizes — skip hex/colors and absurd outliers.
      if (Number.isFinite(n) && n >= 6 && n <= 200) return n;
    }
  }
  if (fallbackLabel) {
    const match = /(\d+(?:\.\d+)?)\s*(?:px)?\s*$/i.exec(fallbackLabel);
    if (match) {
      const n = Number(match[1]);
      if (Number.isFinite(n) && n >= 6 && n <= 200) return n;
    }
  }
  return Number.NaN;
}

function typographySizeLabel(
  values: Record<string, string> | undefined,
  fallbackLabel?: string,
): string | undefined {
  const size = typographySizeKey(values, fallbackLabel);
  if (!Number.isFinite(size)) return undefined;
  const display = Number.isInteger(size) ? String(size) : String(size);
  return `${display}px`;
}

/** Biggest → smallest; unknown sizes last. */
function sortByTypographySize<T>(
  items: T[],
  sizeOf: (item: T) => number,
  nameOf: (item: T) => string,
): T[] {
  return [...items].sort((a, b) => {
    const sizeA = sizeOf(a);
    const sizeB = sizeOf(b);
    const aUnknown = !Number.isFinite(sizeA);
    const bUnknown = !Number.isFinite(sizeB);
    if (aUnknown && bUnknown) return nameOf(a).localeCompare(nameOf(b));
    if (aUnknown) return 1;
    if (bUnknown) return -1;
    if (sizeA !== sizeB) return sizeB - sizeA;
    return nameOf(a).localeCompare(nameOf(b));
  });
}

function typographyWarningGroups(): TypographyWarningGroup[] {
  if (!audit) return [];
  return [
    {
      id: "variables",
      title: "CADS variables without a style",
      warnings: sortByTypographySize(
        audit.entries.filter((entry) => entry.flag === "typographyVariable"),
        (entry) => typographySizeKey(entry.values, entry.name),
        (entry) => entry.name,
      ).map((entry) => ({
        id: entry.id,
        label: entry.name,
        meta: `CADS typography variable · ${entry.collectionName}`,
        values: [],
        sizeLabel: typographySizeLabel(entry.values, entry.name),
        icon: "typography" as const,
        layers: entry.usages.map(colorLayer),
      })),
    },
    {
      id: "styles",
      title: "Non-CADS styles",
      warnings: sortByTypographySize(
        audit.textStyles,
        (entry) => typographySizeKey(entry.values, entry.name),
        (entry) => entry.name,
      ).map((entry) => ({
        id: entry.id,
        label: entry.name,
        meta: entry.values.family ?? "Unknown font",
        values: [],
        sizeLabel: typographySizeLabel(entry.values, entry.name),
        icon: "typography" as const,
        layers: entry.usages.map(colorLayer),
      })),
    },
    {
      id: "raw",
      title: "Raw typography",
      warnings: sortByTypographySize(
        audit.rawTexts,
        (entry) => typographySizeKey(entry.values, entry.label),
        (entry) => entry.label,
      ).map((entry) => ({
        id: entry.id,
        label: entry.label,
        meta: "No text style",
        values: [],
        sizeLabel: typographySizeLabel(entry.values, entry.label),
        icon: "typography" as const,
        layers: entry.usages.map(colorLayer),
      })),
    },
    {
      id: "fontAwesome",
      title: "Outdated Font Awesome",
      warnings: sortByTypographySize(
        audit.fontAwesomeTexts,
        (entry) => typographySizeKey(entry.values, entry.label),
        (entry) => entry.label,
      ).map((entry) => ({
        id: entry.id,
        label: entry.label,
        meta: "Use a Font Awesome 7 font",
        values: [],
        sizeLabel: typographySizeLabel(entry.values, entry.label),
        icon: "fontAwesome" as const,
        layers: entry.usages.map(colorLayer),
      })),
    },
  ];
}

function componentWarningGroups(): ComponentWarningGroup[] {
  if (!audit) return [];
  return [
    {
      id: "detached",
      title: "Possible detached CADS components",
      warnings: audit.detachedComponents.map((entry) => ({
        id: entry.id,
        label: entry.componentName,
        meta: "Exact CADS name match · verify before replacing",
        values: [],
        icon: "component" as const,
        layers: entry.usages.map(colorLayer),
        suggestedSwap: entry.componentName,
      })),
    },
    {
      id: "nonCads",
      title: "Non-CADS components",
      warnings: audit.components.map((entry) => {
        const isDsco = isDscoComponentKey(entry.key);
        const suggestedSwap = suggestCadsComponent({
          key: entry.key,
          name: entry.name,
        });
        let meta: string;
        if (entry.isLocal) meta = "Local component";
        else if (isDsco) meta = "DSCO component";
        else meta = "External library component";
        return {
          id: `component:${entry.key}`,
          label: entry.name,
          meta,
          values: [],
          icon: "component" as const,
          layers: entry.usages.map(colorLayer),
          suggestedSwap,
        };
      }),
    },
  ];
}

function shapeWarningGroups(): ShapeWarningGroup[] {
  if (!audit) return [];
  return [
    {
      id: "variables",
      title: "Non-CADS shape tokens",
      warnings: audit.entries
        .filter((entry) => entry.flag === "shapeVariable")
        .map((entry) => ({
          id: entry.id,
          label: entry.name,
          meta: `${entry.libraryName} · ${entry.collectionName}`,
          values: [],
          icon: "shape",
          layers: entry.usages.map(colorLayer),
        })),
    },
    {
      id: "raw",
      title: "Raw border radii",
      warnings: audit.rawRadii.map((entry) => ({
        id: entry.id,
        label: entry.label,
        meta: "No CADS shape token",
        values: [],
        icon: "shape",
        layers: entry.usages.map(colorLayer),
      })),
    },
  ];
}

function layerContextIcon(layer: ColorLayerRef): string {
  if (layer.detail === "Explicit mode") {
    return faIcon("circle-half-stroke", 12);
  }
  if (layer.nodeType === "TEXT") {
    return faIcon("font", 12);
  }
  if (layer.nodeType === "INSTANCE") {
    return OVERVIEW_ICONS.components;
  }
  if (layer.detail.startsWith("Stroke")) {
    return faIcon("border-top-left", 12);
  }
  if (layer.detail.startsWith("Effect")) {
    return '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z"/><path d="m19 14 .75 2.25L22 17l-2.25.75L19 20l-.75-2.25L16 17l2.25-.75L19 14Z"/></svg>';
  }
  if (
    layer.nodeType === "FRAME" ||
    layer.nodeType === "SECTION" ||
    layer.nodeType === "GROUP"
  ) {
    return OVERVIEW_ICONS.frame;
  }
  return faIcon("bezier-curve", 12);
}

function renderWarning(
  warning: ColorWarning,
  expandedWarnings: Set<string>,
): HTMLElement {
  const card = el("article", "warning-card");
  const trigger = el("div", "warning-trigger");
  trigger.title = `${warning.label} · ${warning.meta}`;
  const isExpanded = expandedWarnings.has(warning.id);

  if (warning.values.length > 0) {
    trigger.appendChild(swatches(warning.values));
  } else {
    const modeIcon = el("span", "warning-mode-icon");
    if (warning.icon === "fontAwesome") {
      modeIcon.innerHTML = faIcon("font", 14);
    } else if (warning.icon === "typography") {
      modeIcon.innerHTML = OVERVIEW_ICONS.typography;
    } else if (warning.icon === "component") {
      modeIcon.innerHTML = OVERVIEW_ICONS.components;
    } else if (warning.icon === "shape") {
      modeIcon.innerHTML = OVERVIEW_ICONS.shape;
    } else {
      modeIcon.innerHTML = faIcon("circle-half-stroke", 14);
    }
    trigger.appendChild(modeIcon);
  }

  const copy = el("span", "warning-copy");
  const nameRow = el("span", "warning-name-row");
  nameRow.appendChild(el("span", "warning-name", warning.label));
  if (warning.sizeLabel) {
    nameRow.appendChild(el("span", "combo-option-value", warning.sizeLabel));
  }
  copy.appendChild(nameRow);
  if (warning.suggestedSwap !== undefined) {
    const suggestRow = el("span", "warning-suggest");
    const arrow = el("span", "warning-suggest-arrow");
    arrow.innerHTML = faIcon("arrow-turn-down-right", 10);
    suggestRow.appendChild(arrow);
    if (warning.suggestedSwap) {
      suggestRow.appendChild(
        el("span", "warning-suggest-target", warning.suggestedSwap),
      );
    } else {
      suggestRow.appendChild(
        el("span", "warning-suggest-none", "No suggestion"),
      );
    }
    copy.appendChild(suggestRow);
  }
  trigger.appendChild(copy);

  const expand = el("button", "fix-expand") as HTMLButtonElement;
  expand.type = "button";
  const expandCount = el(
    "span",
    "warning-count",
    `${warning.layers.length}×`,
  );
  const expandChevron = el("span", "warning-chevron");
  expandChevron.innerHTML = faIcon("caret-down", 12);
  expand.appendChild(expandCount);
  expand.appendChild(expandChevron);
  expand.setAttribute("aria-expanded", String(isExpanded));
  expand.title = isExpanded ? "Collapse usages" : "Expand usages";
  expand.setAttribute("aria-label", expand.title);
  trigger.appendChild(expand);
  card.appendChild(trigger);

  const layers = el("div", "warning-layers");
  layers.hidden = !isExpanded;
  for (const layer of warning.layers) {
    const row = el("div", "warning-layer");
    const layerIcon = el("span", "warning-layer-icon");
    layerIcon.innerHTML = layerContextIcon(layer);
    layerIcon.title = `${layer.nodeType} · ${layer.detail}`;
    row.appendChild(layerIcon);
    const layerCopy = el("span", "warning-layer-copy");
    const name = el("span", "warning-layer-name", layer.nodeName);
    name.title = layer.nodeName;
    layerCopy.appendChild(name);
    row.appendChild(layerCopy);
    const locate = el("button", "warning-locate") as HTMLButtonElement;
    locate.type = "button";
    locate.title = "Locate on canvas";
    locate.setAttribute("aria-label", `Locate ${layer.nodeName} on canvas`);
    locate.innerHTML = faIcon("crosshairs", 13);
    locate.addEventListener("click", () => {
      send({ type: "locate-layer", nodeId: layer.nodeId });
    });
    row.appendChild(locate);
    layers.appendChild(row);
  }
  card.appendChild(layers);

  const setExpanded = (next: boolean): void => {
    if (next) expandedWarnings.add(warning.id);
    else expandedWarnings.delete(warning.id);
    expand.setAttribute("aria-expanded", String(next));
    expand.title = next ? "Collapse usages" : "Expand usages";
    expand.setAttribute("aria-label", expand.title);
    layers.hidden = !next;
  };

  expand.addEventListener("click", (event) => {
    event.stopPropagation();
    setExpanded(!expandedWarnings.has(warning.id));
  });
  trigger.addEventListener("click", () => {
    setExpanded(!expandedWarnings.has(warning.id));
  });
  return card;
}

function renderColorDetail(): void {
  if (!audit) return;
  const main = $("main");
  const page = el("div", "app-page");
  const body = el("div", "app-page-body");

  const groups = colorWarningGroups();
  const colorGroups = groups.filter((group) => group.id !== "modes");
  const modeGroups = groups.filter((group) => group.id === "modes");

  const tabs = el("div", "detail-tabs");
  const tabData: { id: "colors" | "modes"; label: string }[] = [
    { id: "colors", label: "Colors" },
    { id: "modes", label: "Modes" },
  ];
  for (const item of tabData) {
    const tab = el("button", "detail-tab") as HTMLButtonElement;
    tab.type = "button";
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-selected", String(activeColorTab === item.id));
    tab.appendChild(el("span", "", item.label));
    tab.addEventListener("click", () => {
      activeColorTab = item.id;
      renderMain();
    });
    tabs.appendChild(tab);
  }
  tabs.setAttribute("role", "tablist");
  tabs.setAttribute("aria-label", "Color audit sections");

  const visibleGroups = activeColorTab === "colors" ? colorGroups : modeGroups;
  const warnings: ColorWarning[] = [];
  for (const group of visibleGroups) warnings.push(...group.warnings);
  const usageCount = warnings.reduce(
    (total, warning) => total + warning.layers.length,
    0,
  );
  const hiddenUsageCount = warnings.reduce(
    (total, warning) =>
      total + warning.layers.filter((layer) => layer.hidden).length,
    0,
  );
  const visibleUsageCount = usageCount - hiddenUsageCount;
  const visibleDistinctWarningCount = warnings.filter((warning) =>
    warning.layers.some((layer) => !layer.hidden),
  ).length;

  const header = el("div", "app-topbar");
  const back = el("button", "icon-btn") as HTMLButtonElement;
  back.type = "button";
  back.title = "Back to audit overview";
  back.setAttribute("aria-label", "Back to audit overview");
  back.innerHTML = faIcon("arrow-left", 14);
  back.addEventListener("click", () => {
    activeOverviewCategory = null;
    renderMain();
  });
  header.appendChild(back);
  header.appendChild(el("h1", "app-topbar-title", "Color"));

  const headerActions = el("div", "app-topbar-actions");
  if (visibleDistinctWarningCount > 0) {
    const visibleWarningIds = warnings
      .filter((warning) => warning.layers.some((layer) => !layer.hidden))
      .map((warning) => warning.id);
    const allExpanded = visibleWarningIds.every((id) =>
      expandedColorWarnings.has(id),
    );
    const toggleAll = el("button", "icon-btn") as HTMLButtonElement;
    toggleAll.type = "button";
    toggleAll.title = allExpanded ? "Collapse all warnings" : "Expand all warnings";
    toggleAll.setAttribute("aria-label", toggleAll.title);
    toggleAll.innerHTML = allExpanded
      ? faIcon("arrows-to-dotted-line", 13)
      : faIcon("arrows-from-dotted-line", 13);
    toggleAll.addEventListener("click", () => {
      if (allExpanded) {
        for (const id of visibleWarningIds) expandedColorWarnings.delete(id);
      } else {
        for (const id of visibleWarningIds) expandedColorWarnings.add(id);
      }
      renderMain();
    });
    headerActions.appendChild(toggleAll);
  }
  header.appendChild(headerActions);
  page.appendChild(header);
  body.appendChild(tabs);

  if (warnings.length === 0) {
    const empty = el("div", "detail-empty");
    empty.appendChild(readyCheckIcon());
    empty.appendChild(
      el(
        "strong",
        "",
        activeColorTab === "colors" ? "Color passed" : "Modes passed",
      ),
    );
    empty.appendChild(
      el(
        "span",
        "",
        activeColorTab === "colors"
          ? "No color warnings were found in this selection."
          : "No mode warnings were found in this selection.",
      ),
    );
    body.appendChild(empty);
  } else {
    const groupList = el("div", "warning-groups");
    for (const group of visibleGroups) {
      if (group.warnings.length === 0) continue;
      const visibleWarnings = group.warnings
        .map((warning) => ({
          ...warning,
          layers: warning.layers.filter((layer) => !layer.hidden),
        }))
        .filter((warning) => warning.layers.length > 0);
      const hiddenWarnings = group.warnings
        .map((warning) => ({
          ...warning,
          layers: warning.layers.filter((layer) => layer.hidden),
        }))
        .filter((warning) => warning.layers.length > 0);
      const hiddenLayers = hiddenWarnings.reduce(
        (total, warning) => total + warning.layers.length,
        0,
      );
      const section = el("section", "warning-group");
      const groupHeader = el("div", "warning-group-header");
      const titleRow = el("div", "warning-group-title-row");
      titleRow.appendChild(el("h2", "", group.title));
      if (visibleWarnings.length > 0) {
        titleRow.appendChild(
          el("span", "warning-group-count", String(visibleWarnings.length)),
        );
      }
      groupHeader.appendChild(titleRow);
      section.appendChild(groupHeader);
      if (visibleWarnings.length > 0) {
        const cards = el("div", "warning-list");
        for (const warning of visibleWarnings) {
          cards.appendChild(renderWarning(warning, expandedColorWarnings));
        }
        section.appendChild(cards);
      }
      if (hiddenLayers > 0) {
        const hiddenShown = shownHiddenColorGroups.has(group.id);
        const toggleHidden = el(
          "button",
          "hidden-layers-toggle",
        ) as HTMLButtonElement;
        toggleHidden.type = "button";
        toggleHidden.setAttribute("aria-expanded", String(hiddenShown));
        toggleHidden.innerHTML =
          `<span>${hiddenShown ? "Hide" : "Show"} ${hiddenLayers} hidden layer${hiddenLayers === 1 ? "" : "s"}</span>` +
          faIcon("caret-down", 11);
        toggleHidden.addEventListener("click", () => {
          if (hiddenShown) shownHiddenColorGroups.delete(group.id);
          else shownHiddenColorGroups.add(group.id);
          renderMain();
        });
        section.appendChild(toggleHidden);
        if (hiddenShown) {
          const hiddenCards = el("div", "warning-list hidden-warning-list");
          for (const warning of hiddenWarnings) {
            hiddenCards.appendChild(renderWarning(warning, expandedColorWarnings));
          }
          section.appendChild(hiddenCards);
        }
      }
      groupList.appendChild(section);
    }
    body.appendChild(groupList);
  }

  page.appendChild(body);
  if (visibleUsageCount > 0) {
    const actionBar = el("div", "app-page-footer");
    actionBar.appendChild(
      createPrepareFixesButton(
        activeColorTab === "colors" ? "colors" : "modes",
      ),
    );
    page.appendChild(actionBar);
  }
  main.appendChild(page);
}

function renderTypographyDetail(): void {
  if (!audit) return;
  const main = $("main");
  const page = el("div", "app-page");
  const body = el("div", "app-page-body");
  const groups = typographyWarningGroups();
  const warnings: ColorWarning[] = [];
  for (const group of groups) warnings.push(...group.warnings);
  const visibleUsageCount = warnings.reduce(
    (total, warning) =>
      total + warning.layers.filter((layer) => !layer.hidden).length,
    0,
  );
  const visibleWarningIds = warnings
    .filter((warning) => warning.layers.some((layer) => !layer.hidden))
    .map((warning) => warning.id);

  const header = el("div", "app-topbar");
  const back = el("button", "icon-btn") as HTMLButtonElement;
  back.type = "button";
  back.title = "Back to audit overview";
  back.setAttribute("aria-label", back.title);
  back.innerHTML = faIcon("arrow-left", 14);
  back.addEventListener("click", () => {
    activeOverviewCategory = null;
    renderMain();
  });
  header.appendChild(back);
  header.appendChild(el("h1", "app-topbar-title", "Typography"));

  const headerActions = el("div", "app-topbar-actions");
  if (visibleWarningIds.length > 0) {
    const allExpanded = visibleWarningIds.every((id) =>
      expandedTypographyWarnings.has(id),
    );
    const toggleAll = el("button", "icon-btn") as HTMLButtonElement;
    toggleAll.type = "button";
    toggleAll.title = allExpanded
      ? "Collapse all warnings"
      : "Expand all warnings";
    toggleAll.setAttribute("aria-label", toggleAll.title);
    toggleAll.innerHTML = allExpanded
      ? faIcon("arrows-to-dotted-line", 13)
      : faIcon("arrows-from-dotted-line", 13);
    toggleAll.addEventListener("click", () => {
      if (allExpanded) {
        for (const id of visibleWarningIds) {
          expandedTypographyWarnings.delete(id);
        }
      } else {
        for (const id of visibleWarningIds) {
          expandedTypographyWarnings.add(id);
        }
      }
      renderMain();
    });
    headerActions.appendChild(toggleAll);
  }
  header.appendChild(headerActions);
  page.appendChild(header);

  if (warnings.length === 0) {
    const empty = el("div", "detail-empty");
    empty.appendChild(readyCheckIcon());
    empty.appendChild(el("strong", "", "Typography passed"));
    empty.appendChild(
      el("span", "", "No typography warnings were found in this selection."),
    );
    body.appendChild(empty);
  } else {
    const groupList = el("div", "warning-groups");
    for (const group of groups) {
      if (group.warnings.length === 0) continue;
      const visibleWarnings = group.warnings
        .map((warning) => ({
          ...warning,
          layers: warning.layers.filter((layer) => !layer.hidden),
        }))
        .filter((warning) => warning.layers.length > 0);
      const hiddenWarnings = group.warnings
        .map((warning) => ({
          ...warning,
          layers: warning.layers.filter((layer) => layer.hidden),
        }))
        .filter((warning) => warning.layers.length > 0);
      const hiddenLayers = hiddenWarnings.reduce(
        (total, warning) => total + warning.layers.length,
        0,
      );
      const section = el("section", "warning-group");
      const groupHeader = el("div", "warning-group-header");
      const titleRow = el("div", "warning-group-title-row");
      titleRow.appendChild(el("h2", "", group.title));
      if (visibleWarnings.length > 0) {
        titleRow.appendChild(
          el("span", "warning-group-count", String(visibleWarnings.length)),
        );
      }
      groupHeader.appendChild(titleRow);
      section.appendChild(groupHeader);
      if (visibleWarnings.length > 0) {
        const cards = el("div", "warning-list");
        for (const warning of visibleWarnings) {
          cards.appendChild(renderWarning(warning, expandedTypographyWarnings));
        }
        section.appendChild(cards);
      }
      if (hiddenLayers > 0) {
        const hiddenShown = shownHiddenTypographyGroups.has(group.id);
        const toggleHidden = el(
          "button",
          "hidden-layers-toggle",
        ) as HTMLButtonElement;
        toggleHidden.type = "button";
        toggleHidden.setAttribute("aria-expanded", String(hiddenShown));
        toggleHidden.innerHTML =
          `<span>${hiddenShown ? "Hide" : "Show"} ${hiddenLayers} hidden layer${hiddenLayers === 1 ? "" : "s"}</span>` +
          faIcon("caret-down", 11);
        toggleHidden.addEventListener("click", () => {
          if (hiddenShown) shownHiddenTypographyGroups.delete(group.id);
          else shownHiddenTypographyGroups.add(group.id);
          renderMain();
        });
        section.appendChild(toggleHidden);
        if (hiddenShown) {
          const hiddenCards = el("div", "warning-list hidden-warning-list");
          for (const warning of hiddenWarnings) {
            hiddenCards.appendChild(
              renderWarning(warning, expandedTypographyWarnings),
            );
          }
          section.appendChild(hiddenCards);
        }
      }
      groupList.appendChild(section);
    }
    body.appendChild(groupList);
  }

  page.appendChild(body);
  if (visibleUsageCount > 0) {
    const actionBar = el("div", "app-page-footer");
    actionBar.appendChild(createPrepareFixesButton("typography"));
    page.appendChild(actionBar);
  }
  main.appendChild(page);
}

function renderComponentsDetail(): void {
  if (!audit) return;
  const main = $("main");
  const page = el("div", "app-page");
  const body = el("div", "app-page-body");
  const groups = componentWarningGroups();
  const warnings: ColorWarning[] = [];
  for (const group of groups) warnings.push(...group.warnings);
  const visibleUsageCount = warnings.reduce(
    (total, warning) =>
      total + warning.layers.filter((layer) => !layer.hidden).length,
    0,
  );
  const visibleWarningIds = warnings
    .filter((warning) => warning.layers.some((layer) => !layer.hidden))
    .map((warning) => warning.id);

  const header = el("div", "app-topbar");
  const back = el("button", "icon-btn") as HTMLButtonElement;
  back.type = "button";
  back.title = "Back to audit overview";
  back.setAttribute("aria-label", back.title);
  back.innerHTML = faIcon("arrow-left", 14);
  back.addEventListener("click", () => {
    activeOverviewCategory = null;
    renderMain();
  });
  header.appendChild(back);
  header.appendChild(el("h1", "app-topbar-title", "Component usage"));

  const headerActions = el("div", "app-topbar-actions");
  if (visibleWarningIds.length > 0) {
    const allExpanded = visibleWarningIds.every((id) =>
      expandedComponentWarnings.has(id),
    );
    const toggleAll = el("button", "icon-btn") as HTMLButtonElement;
    toggleAll.type = "button";
    toggleAll.title = allExpanded
      ? "Collapse all warnings"
      : "Expand all warnings";
    toggleAll.setAttribute("aria-label", toggleAll.title);
    toggleAll.innerHTML = allExpanded
      ? faIcon("arrows-to-dotted-line", 13)
      : faIcon("arrows-from-dotted-line", 13);
    toggleAll.addEventListener("click", () => {
      if (allExpanded) {
        for (const id of visibleWarningIds) expandedComponentWarnings.delete(id);
      } else {
        for (const id of visibleWarningIds) expandedComponentWarnings.add(id);
      }
      renderMain();
    });
    headerActions.appendChild(toggleAll);
  }
  header.appendChild(headerActions);
  page.appendChild(header);

  if (warnings.length === 0) {
    const empty = el("div", "detail-empty");
    empty.appendChild(readyCheckIcon());
    empty.appendChild(el("strong", "", "Components passed"));
    empty.appendChild(
      el("span", "", "No component warnings were found in this selection."),
    );
    body.appendChild(empty);
  } else {
    const groupList = el("div", "warning-groups");
    for (const group of groups) {
      if (group.warnings.length === 0) continue;
      const visibleWarnings = group.warnings
        .map((warning) => ({
          ...warning,
          layers: warning.layers.filter((layer) => !layer.hidden),
        }))
        .filter((warning) => warning.layers.length > 0);
      const hiddenWarnings = group.warnings
        .map((warning) => ({
          ...warning,
          layers: warning.layers.filter((layer) => layer.hidden),
        }))
        .filter((warning) => warning.layers.length > 0);
      const hiddenLayers = hiddenWarnings.reduce(
        (total, warning) => total + warning.layers.length,
        0,
      );
      const section = el("section", "warning-group");
      const groupHeader = el("div", "warning-group-header");
      const titleRow = el("div", "warning-group-title-row");
      titleRow.appendChild(el("h2", "", group.title));
      if (visibleWarnings.length > 0) {
        titleRow.appendChild(
          el("span", "warning-group-count", String(visibleWarnings.length)),
        );
      }
      groupHeader.appendChild(titleRow);
      section.appendChild(groupHeader);
      if (visibleWarnings.length > 0) {
        const cards = el("div", "warning-list");
        for (const warning of visibleWarnings) {
          cards.appendChild(renderWarning(warning, expandedComponentWarnings));
        }
        section.appendChild(cards);
      }
      if (hiddenLayers > 0) {
        const hiddenShown = shownHiddenComponentGroups.has(group.id);
        const toggleHidden = el(
          "button",
          "hidden-layers-toggle",
        ) as HTMLButtonElement;
        toggleHidden.type = "button";
        toggleHidden.setAttribute("aria-expanded", String(hiddenShown));
        toggleHidden.innerHTML =
          `<span>${hiddenShown ? "Hide" : "Show"} ${hiddenLayers} hidden layer${hiddenLayers === 1 ? "" : "s"}</span>` +
          faIcon("caret-down", 11);
        toggleHidden.addEventListener("click", () => {
          if (hiddenShown) shownHiddenComponentGroups.delete(group.id);
          else shownHiddenComponentGroups.add(group.id);
          renderMain();
        });
        section.appendChild(toggleHidden);
        if (hiddenShown) {
          const hiddenCards = el("div", "warning-list hidden-warning-list");
          for (const warning of hiddenWarnings) {
            hiddenCards.appendChild(
              renderWarning(warning, expandedComponentWarnings),
            );
          }
          section.appendChild(hiddenCards);
        }
      }
      groupList.appendChild(section);
    }
    body.appendChild(groupList);
  }

  page.appendChild(body);
  if (visibleUsageCount > 0) {
    const swappableCount = audit.components.reduce((total, entry) => {
      if (!isSwappableComponentKey(entry.key)) return total;
      return total + entry.usages.filter((usage) => !usage.hidden).length;
    }, 0);
    const actionBar = el("div", "app-page-footer");
    if (swappableCount > 0) {
      actionBar.appendChild(createPrepareFixesButton("components"));
    }
    const manualLeft = visibleUsageCount - swappableCount;
    if (manualLeft > 0 || swappableCount === 0) {
      actionBar.appendChild(
        el(
          "p",
          "detail-footer-note",
          swappableCount > 0
            ? `${manualLeft} instance${manualLeft === 1 ? "" : "s"} still need a manual update (no automatic swap yet).`
            : "No automatic swaps for these components yet — update them manually.",
        ),
      );
    }
    page.appendChild(actionBar);
  }
  main.appendChild(page);
}

function renderShapeDetail(): void {
  if (!audit) return;
  const main = $("main");
  const page = el("div", "app-page");
  const body = el("div", "app-page-body");
  const groups = shapeWarningGroups();
  const warnings: ColorWarning[] = [];
  for (const group of groups) warnings.push(...group.warnings);
  const visibleUsageCount = warnings.reduce(
    (total, warning) =>
      total + warning.layers.filter((layer) => !layer.hidden).length,
    0,
  );
  const visibleWarningIds = warnings
    .filter((warning) => warning.layers.some((layer) => !layer.hidden))
    .map((warning) => warning.id);

  const header = el("div", "app-topbar");
  const back = el("button", "icon-btn") as HTMLButtonElement;
  back.type = "button";
  back.title = "Back to audit overview";
  back.setAttribute("aria-label", back.title);
  back.innerHTML = faIcon("arrow-left", 14);
  back.addEventListener("click", () => {
    activeOverviewCategory = null;
    renderMain();
  });
  header.appendChild(back);
  header.appendChild(el("h1", "app-topbar-title", "Shape"));

  const headerActions = el("div", "app-topbar-actions");
  if (visibleWarningIds.length > 0) {
    const allExpanded = visibleWarningIds.every((id) =>
      expandedShapeWarnings.has(id),
    );
    const toggleAll = el("button", "icon-btn") as HTMLButtonElement;
    toggleAll.type = "button";
    toggleAll.title = allExpanded
      ? "Collapse all warnings"
      : "Expand all warnings";
    toggleAll.setAttribute("aria-label", toggleAll.title);
    toggleAll.innerHTML = allExpanded
      ? faIcon("arrows-to-dotted-line", 13)
      : faIcon("arrows-from-dotted-line", 13);
    toggleAll.addEventListener("click", () => {
      if (allExpanded) {
        for (const id of visibleWarningIds) expandedShapeWarnings.delete(id);
      } else {
        for (const id of visibleWarningIds) expandedShapeWarnings.add(id);
      }
      renderMain();
    });
    headerActions.appendChild(toggleAll);
  }
  header.appendChild(headerActions);
  page.appendChild(header);

  if (warnings.length === 0) {
    const empty = el("div", "detail-empty");
    empty.appendChild(readyCheckIcon());
    empty.appendChild(el("strong", "", "Shape passed"));
    empty.appendChild(
      el("span", "", "No border-radius warnings were found in this selection."),
    );
    body.appendChild(empty);
  } else {
    const groupList = el("div", "warning-groups");
    for (const group of groups) {
      if (group.warnings.length === 0) continue;
      const visibleWarnings = group.warnings
        .map((warning) => ({
          ...warning,
          layers: warning.layers.filter((layer) => !layer.hidden),
        }))
        .filter((warning) => warning.layers.length > 0);
      const hiddenWarnings = group.warnings
        .map((warning) => ({
          ...warning,
          layers: warning.layers.filter((layer) => layer.hidden),
        }))
        .filter((warning) => warning.layers.length > 0);
      const hiddenLayers = hiddenWarnings.reduce(
        (total, warning) => total + warning.layers.length,
        0,
      );
      const section = el("section", "warning-group");
      const groupHeader = el("div", "warning-group-header");
      const titleRow = el("div", "warning-group-title-row");
      titleRow.appendChild(el("h2", "", group.title));
      if (visibleWarnings.length > 0) {
        titleRow.appendChild(
          el("span", "warning-group-count", String(visibleWarnings.length)),
        );
      }
      groupHeader.appendChild(titleRow);
      section.appendChild(groupHeader);
      if (visibleWarnings.length > 0) {
        const cards = el("div", "warning-list");
        for (const warning of visibleWarnings) {
          cards.appendChild(renderWarning(warning, expandedShapeWarnings));
        }
        section.appendChild(cards);
      }
      if (hiddenLayers > 0) {
        const hiddenShown = shownHiddenShapeGroups.has(group.id);
        const toggleHidden = el(
          "button",
          "hidden-layers-toggle",
        ) as HTMLButtonElement;
        toggleHidden.type = "button";
        toggleHidden.setAttribute("aria-expanded", String(hiddenShown));
        toggleHidden.innerHTML =
          `<span>${hiddenShown ? "Hide" : "Show"} ${hiddenLayers} hidden layer${hiddenLayers === 1 ? "" : "s"}</span>` +
          faIcon("caret-down", 11);
        toggleHidden.addEventListener("click", () => {
          if (hiddenShown) shownHiddenShapeGroups.delete(group.id);
          else shownHiddenShapeGroups.add(group.id);
          renderMain();
        });
        section.appendChild(toggleHidden);
        if (hiddenShown) {
          const hiddenCards = el("div", "warning-list hidden-warning-list");
          for (const warning of hiddenWarnings) {
            hiddenCards.appendChild(
              renderWarning(warning, expandedShapeWarnings),
            );
          }
          section.appendChild(hiddenCards);
        }
      }
      groupList.appendChild(section);
    }
    body.appendChild(groupList);
  }

  page.appendChild(body);
  if (visibleUsageCount > 0) {
    const actionBar = el("div", "app-page-footer");
    actionBar.appendChild(createPrepareFixesButton("shape"));
    page.appendChild(actionBar);
  }
  main.appendChild(page);
}

function renderAuditOverview(): void {
  if (!audit) return;
  const main = $("main");
  const page = el("div", "app-page");
  const body = el("div", "app-page-body");

  const topbar = el("div", "app-topbar");
  const targetCopy = el("div", "app-topbar-copy");
  targetCopy.appendChild(el("span", "audit-target-label", "Auditing:"));
  const targetName = el("div", "audit-target-name", audit.selectionLabel);
  targetName.title = audit.selectionLabel;
  targetCopy.appendChild(targetName);
  topbar.appendChild(targetCopy);

  const actions = el("div", "app-topbar-actions");
  const rerun = el("button", "icon-btn") as HTMLButtonElement;
  rerun.type = "button";
  rerun.title = "Rerun audit";
  rerun.setAttribute("aria-label", "Rerun audit");
  rerun.disabled = selectionCount === 0;
  rerun.innerHTML = OVERVIEW_ICONS.rerun;
  rerun.addEventListener("click", () => runAudit());
  actions.appendChild(rerun);
  topbar.appendChild(actions);
  page.appendChild(topbar);

  const scoreCard = el("section", "score-card");
  const scoreMain = el("div", "score-main");
  const scoreCopy = el("div", "score-copy");
  scoreCopy.appendChild(el("h2", "", "CADS compliance"));
  scoreCopy.appendChild(
    el(
      "p",
      "",
      audit.summary.totalUsages > 0
        ? `${audit.summary.passes} of ${audit.summary.totalUsages} audited usages use CADS.`
        : "No auditable design-system usages found.",
    ),
  );
  scoreMain.appendChild(scoreCopy);
  const scoreRing = el("div", "score-ring");
  scoreRing.style.setProperty("--score", String(audit.summary.complianceScore));
  scoreRing.appendChild(
    el("span", "score-value", `${audit.summary.complianceScore}%`),
  );
  scoreMain.appendChild(scoreRing);
  scoreCard.appendChild(scoreMain);

  const stats = el("div", "score-stats");
  const statData = [
    { value: audit.nodesScanned, label: "Total layers", cls: "" },
    {
      value: audit.summary.warnings,
      label: "Warnings",
      cls: "warning",
    },
    { value: audit.summary.passes, label: "CADS usages", cls: "pass" },
  ];
  for (const item of statData) {
    const stat = el("div", item.cls ? `score-stat ${item.cls}` : "score-stat");
    stat.appendChild(el("div", "score-stat-value", String(item.value)));
    stat.appendChild(el("div", "score-stat-label", item.label));
    stats.appendChild(stat);
  }
  scoreCard.appendChild(stats);
  body.appendChild(scoreCard);

  body.appendChild(el("div", "category-heading", "Audit categories"));
  const categories = el("div", "category-cards");
  categories.appendChild(
    renderCategoryCard(
      "colors",
      "Color",
      audit.summary.colors + audit.summary.modes,
      () => {
        activeOverviewCategory = "colors";
        activeColorTab = "colors";
        renderMain();
      },
    ),
  );
  categories.appendChild(
    renderCategoryCard(
      "typography",
      "Typography",
      audit.summary.typography,
      () => {
        activeOverviewCategory = "typography";
        renderMain();
      },
    ),
  );
  categories.appendChild(
    renderCategoryCard(
      "components",
      "Component usage",
      audit.summary.components,
      () => {
        activeOverviewCategory = "components";
        renderMain();
      },
    ),
  );
  categories.appendChild(
    renderCategoryCard(
      "shape",
      "Shape",
      audit.summary.shape,
      () => {
        activeOverviewCategory = "shape";
        renderMain();
      },
    ),
  );
  body.appendChild(categories);

  if (audit.mixedTextSkipped + audit.mixedStyleSkipped > 0) {
    body.appendChild(
      el(
        "div",
        "muted small",
        `${audit.mixedTextSkipped + audit.mixedStyleSkipped} mixed text layer(s) skipped`,
      ),
    );
  }
  page.appendChild(body);
  main.appendChild(page);
}

function renderMain(): void {
  const main = $("main");
  main.textContent = "";

  if (libraryMissingMessage) {
    setMainCentered(true);
    const hero = el("div", "hero");
    const icon = el("div", "hero-icon warn", "!");
    hero.appendChild(icon);
    hero.appendChild(el("h2", "", "CADS library not enabled"));
    hero.appendChild(el("p", "", libraryMissingMessage));
    main.appendChild(hero);
    updateStatusFooter();
    return;
  }

  if (!catalog) {
    renderLoadingHero();
    updateStatusFooter();
    return;
  }

  if (auditing) {
    setMainCentered(true);
    const hero = el("div", "hero");
    hero.appendChild(spinnerIcon());
    hero.appendChild(el("h2", "", "Auditing selection"));
    hero.appendChild(
      el(
        "p",
        "",
        "Scanning layers and colors inside instances — typography/shape stay surface-only.",
      ),
    );
    if (auditNodesScanned > 0) {
      const meta = el("div", "hero-progress");
      meta.appendChild(
        el("div", "meta", `${auditNodesScanned} layers scanned`),
      );
      hero.appendChild(meta);
    }
    main.appendChild(hero);
    updateStatusFooter();
    return;
  }

  if (!audit) {
    renderReadyHero();
    updateStatusFooter();
    return;
  }

  setMainCentered(false);
  if (activeOverviewCategory === "colors") {
    renderColorDetail();
  } else if (activeOverviewCategory === "typography") {
    renderTypographyDetail();
  } else if (activeOverviewCategory === "components") {
    renderComponentsDetail();
  } else if (activeOverviewCategory === "shape") {
    renderShapeDetail();
  } else {
    renderAuditOverview();
  }
  updateStatusFooter();
}

// ---------------------------------------------------------------------------
// Fix panel

interface SourceInfo {
  id: string;
  name: string;
  type: string;
  groupLabel: string;
  libraryName: string;
  values: Record<string, string>;
  usageCount: number;
  usageSummary: string;
  usages: UsageRef[];
}

function sourceInfos(category: FixCategory): SourceInfo[] {
  if (!audit) return [];
  const infos: SourceInfo[] = [];
  const wantColors = category === "all" || category === "colors";
  const wantType = category === "all" || category === "typography";
  const wantShape = category === "all" || category === "shape";
  const wantComponents = category === "all" || category === "components";

  if (wantColors) {
    for (const entry of audit.entries) {
      if (entry.flag === "typographyVariable") continue;
      if (entry.resolvedType !== "COLOR") continue;
      const layers = Array.from(new Set(entry.usages.map((u) => u.nodeName))).slice(
        0,
        5,
      );
      infos.push({
        id: entry.id,
        name: entry.name,
        type: "COLOR",
        groupLabel:
          entry.flag === "primitive"
            ? "CADS primitives"
            : "Non-CADS variables",
        libraryName:
          entry.flag === "primitive" ? "CADS primitive" : entry.libraryName,
        values: entry.values,
        usageCount: entry.usages.length,
        usageSummary: `${entry.usages.length}× on ${layers.join(", ")}`,
        usages: entry.usages,
      });
    }
    for (const style of audit.paintStyles) {
      const layers = Array.from(
        new Set(style.usages.map((usage) => usage.nodeName)),
      ).slice(0, 5);
      infos.push({
        id: style.id,
        name: style.name,
        type: "COLOR",
        groupLabel: "Color styles",
        libraryName: "Figma color style",
        values: { value: style.hex },
        usageCount: style.usages.length,
        usageSummary: `${style.usages.length}× on ${layers.join(", ")}`,
        usages: style.usages,
      });
    }
    for (const raw of audit.rawPaints) {
      const layers = Array.from(new Set(raw.usages.map((u) => u.nodeName))).slice(
        0,
        5,
      );
      infos.push({
        id: raw.id,
        name: raw.hex,
        type: "COLOR",
        groupLabel: "Raw hex values",
        libraryName: "Unbound",
        values: { value: raw.hex },
        usageCount: raw.usages.length,
        usageSummary: `${raw.usages.length}× unbound on ${layers.join(", ")}`,
        usages: raw.usages,
      });
    }
  }

  if (wantType) {
    for (const style of sortByTypographySize(
      audit.textStyles,
      (entry) => typographySizeKey(entry.values, entry.name),
      (entry) => entry.name,
    )) {
      const layers = Array.from(new Set(style.usages.map((u) => u.nodeName))).slice(
        0,
        5,
      );
      infos.push({
        id: style.id,
        name: style.name,
        type: "TEXT_STYLE",
        groupLabel: "Non-CADS styles",
        libraryName: style.remote ? "Library style" : "Local style",
        values: style.values,
        usageCount: style.usages.length,
        usageSummary: `${style.usages.length}× on ${layers.join(", ")}`,
        usages: style.usages,
      });
    }
    for (const raw of sortByTypographySize(
      audit.rawTexts,
      (entry) => typographySizeKey(entry.values, entry.label),
      (entry) => entry.label,
    )) {
      const layers = Array.from(new Set(raw.usages.map((u) => u.nodeName))).slice(
        0,
        5,
      );
      infos.push({
        id: raw.id,
        name: raw.label,
        type: "TEXT_STYLE",
        groupLabel: "Raw typography",
        libraryName: "Unstyled",
        values: raw.values,
        usageCount: raw.usages.length,
        usageSummary: `${raw.usages.length}× on ${layers.join(", ")}`,
        usages: raw.usages,
      });
    }
  }

  if (wantShape) {
    for (const entry of audit.entries) {
      if (entry.flag !== "shapeVariable") continue;
      const layers = Array.from(
        new Set(entry.usages.map((usage) => usage.nodeName)),
      ).slice(0, 5);
      infos.push({
        id: entry.id,
        name: entry.name,
        type: "RADIUS",
        groupLabel: "Non-CADS shape tokens",
        libraryName: `${entry.libraryName} / ${entry.collectionName}`,
        values: entry.values,
        usageCount: entry.usages.length,
        usageSummary: `${entry.usages.length}× on ${layers.join(", ")}`,
        usages: entry.usages,
      });
    }
    for (const raw of audit.rawRadii) {
      const layers = Array.from(new Set(raw.usages.map((u) => u.nodeName))).slice(
        0,
        5,
      );
      infos.push({
        id: raw.id,
        name: `radius ${raw.label}`,
        type: "RADIUS",
        groupLabel: "Raw border radii",
        libraryName: "Unbound",
        values: { value: raw.label },
        usageCount: raw.usages.length,
        usageSummary: `${raw.usages.length}× on ${layers.join(", ")}`,
        usages: raw.usages,
      });
    }
  }

  if (wantComponents) {
    for (const entry of audit.components) {
      if (!isSwappableComponentKey(entry.key)) continue;
      const cadsName = suggestCadsComponent(entry) ?? "CADS";
      const layers = Array.from(
        new Set(entry.usages.map((usage) => usage.nodeName)),
      ).slice(0, 5);
      infos.push({
        id: `component:${entry.key}`,
        name: entry.name,
        type: "COMPONENT",
        groupLabel: "Component swaps",
        libraryName: isDscoComponentKey(entry.key)
          ? "DSCO → CADS"
          : "External → CADS",
        values: { target: cadsName },
        usageCount: entry.usages.length,
        usageSummary: `${entry.usages.length}× → ${cadsName} · ${layers.join(", ")}`,
        usages: entry.usages,
      });
    }
  }

  return infos;
}

interface PickTarget {
  key: string;
  name: string;
  values: Record<string, string>;
  groupLabel: string;
}

/**
 * Divider groups for the typography picker:
 * - Weighted families → per level (Heading/H3, Body/Body 1, Mono/Mono 2)
 * - Single-weight families → whole family (Overline, Link, Label stay together)
 */
function textStyleSubgroup(name: string): string {
  const parts = name
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean);
  const family = (parts[0] ?? "").toLowerCase();
  if (family === "overline" || family === "link" || family === "label") {
    return parts[0] ?? name;
  }
  if (parts.length >= 2) return `${parts[0]}/${parts[1]}`;
  return parts[0] ?? name;
}

const TEXT_STYLE_FAMILY_ORDER = [
  "heading",
  "body",
  "overline",
  "link",
  "label",
  "mono",
];

function textStyleFamilyOrder(name: string): number {
  const family = name.split("/")[0]?.trim().toLowerCase() ?? "";
  const index = TEXT_STYLE_FAMILY_ORDER.indexOf(family);
  return index < 0 ? TEXT_STYLE_FAMILY_ORDER.length : index;
}

function textStyleLevelOrder(name: string): number {
  const parts = name.split("/").map((part) => part.trim());
  const level = parts[1] ?? parts[0] ?? "";
  const match = /(\d+)/.exec(level);
  return match ? Number(match[1]) : 0;
}

/** Regular → Medium → Semi Bold → Bold; styles without a weight leaf last. */
function textStyleWeightOrder(name: string): number {
  const leaf = name.split("/").pop()?.trim().toLowerCase() ?? "";
  if (leaf === "regular") return 0;
  if (leaf === "medium") return 1;
  if (leaf === "semi bold" || leaf === "semibold") return 2;
  if (leaf === "bold") return 3;
  return 4;
}

function compareCadsTextStyleNames(a: string, b: string): number {
  const family = textStyleFamilyOrder(a) - textStyleFamilyOrder(b);
  if (family !== 0) return family;
  const level = textStyleLevelOrder(a) - textStyleLevelOrder(b);
  if (level !== 0) return level;
  const weight = textStyleWeightOrder(a) - textStyleWeightOrder(b);
  if (weight !== 0) return weight;
  return a.localeCompare(b);
}

function pickTargets(sourceType: string): PickTarget[] {
  if (!catalog) return [];
  if (sourceType === "TEXT_STYLE") {
    return [...catalog.textStyles]
      .sort((a, b) => compareCadsTextStyleNames(a.name, b.name))
      .map((style) => ({
        key: style.key,
        name: style.name,
        values: style.values,
        groupLabel: textStyleSubgroup(style.name),
      }));
  }
  let candidates: typeof catalog.variables;
  if (sourceType === "RADIUS") {
    const shape = catalog.variables.filter(
      (v) =>
        v.resolvedType === "FLOAT" &&
        isShapeCollection(v.collectionName) &&
        isShapeVariable(v.name),
    );
    candidates =
      shape.length > 0
        ? shape
        : catalog.variables.filter(
            (v) => v.resolvedType === "FLOAT" && isShapeVariable(v.name),
          );
    const shapeOrder = ["shape/sm", "shape/md", "shape/lg", "shape/xl", "shape/round"];
    candidates.sort((a, b) => {
      const aIndex = shapeOrder.indexOf(a.name.toLowerCase());
      const bIndex = shapeOrder.indexOf(b.name.toLowerCase());
      return (
        (aIndex < 0 ? Number.MAX_SAFE_INTEGER : aIndex) -
        (bIndex < 0 ? Number.MAX_SAFE_INTEGER : bIndex)
      );
    });
  } else if (sourceType === "COLOR") {
    candidates = catalog.variables.filter(
      (v) =>
        v.resolvedType === "COLOR" &&
        !isPrimitiveColorCollection(v.collectionName),
    );
  } else {
    candidates = catalog.variables.filter((v) => v.resolvedType === sourceType);
  }
  return candidates.map((v) => ({
    key: v.key,
    name: v.name,
    values: v.values,
    groupLabel: v.collectionName,
  }));
}

function targetByKey(key: string | null): PickTarget | null {
  if (!key) return null;
  if (catalog) {
    const variable = catalog.variables.find((v) => v.key === key);
    if (variable) {
      return {
        key: variable.key,
        name: variable.name,
        values: variable.values,
        groupLabel: variable.collectionName,
      };
    }
    const style = catalog.textStyles.find((s) => s.key === key);
    if (style) {
      return {
        key: style.key,
        name: style.name,
        values: style.values,
        groupLabel: "Text style",
      };
    }
  }
  const componentName = cadsComponentNameByKey.get(key);
  if (componentName) {
    return {
      key,
      name: componentName,
      values: {},
      groupLabel: "CADS component",
    };
  }
  return null;
}

function modeOptions(): {
  collectionKey: string;
  modeName: string;
  label: string;
}[] {
  if (!catalog) return [];
  const candidates: {
    collectionKey: string;
    modeName: string;
    collectionName: string;
  }[] = [];
  for (const collection of catalog.collections) {
    for (const modeName of collection.modes) {
      // Frame mode apply only supports CADS Light/Dark — hide other modes.
      if (!/^(light|dark)$/i.test(modeName.trim())) continue;
      candidates.push({
        collectionKey: collection.key,
        modeName,
        collectionName: collection.name,
      });
    }
  }
  // Prefer Semantic Colors over primitives / unrelated collections.
  const collectionScore = (name: string): number => {
    if (/semantic/i.test(name) && /color/i.test(name)) return 0;
    if (/color/i.test(name) && !/primitive/i.test(name)) return 1;
    if (/primitive/i.test(name)) return 3;
    return 2;
  };
  candidates.sort(
    (a, b) =>
      collectionScore(a.collectionName) - collectionScore(b.collectionName) ||
      a.modeName.localeCompare(b.modeName),
  );
  const seen = new Set<string>();
  const options: {
    collectionKey: string;
    modeName: string;
    label: string;
  }[] = [];
  for (const candidate of candidates) {
    const key = candidate.modeName.trim().toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    options.push({
      collectionKey: candidate.collectionKey,
      modeName: candidate.modeName,
      label: candidate.modeName,
    });
  }
  options.sort((a, b) => {
    const rank = (name: string) => (/^light$/i.test(name) ? 0 : 1);
    return rank(a.modeName) - rank(b.modeName);
  });
  return options;
}

let openCombo: HTMLElement | null = null;
let openComboTrigger: HTMLElement | null = null;

function closeCombo(): void {
  openComboTrigger?.setAttribute("aria-expanded", "false");
  openCombo?.remove();
  openCombo = null;
  openComboTrigger = null;
}

document.addEventListener("click", (event) => {
  if (openCombo && !openCombo.contains(event.target as Node)) closeCombo();
});

function openTargetPicker(
  trigger: HTMLElement,
  sourceType: string,
  selection: {
    selectedTargetKey?: string | null;
    recommendedTargetKey?: string | null;
  },
  onPick: (target: PickTarget | null) => void,
): void {
  // Trigger click uses stopPropagation, so outside-click can't toggle it closed.
  if (openCombo && openComboTrigger === trigger) {
    closeCombo();
    return;
  }
  closeCombo();
  if (!catalog) return;
  const selectedTargetKey = selection.selectedTargetKey ?? null;
  const recommendedTargetKey = selection.recommendedTargetKey ?? null;
  const menu = el("div", "combo-menu");
  const input = el("input") as HTMLInputElement;
  input.placeholder =
    sourceType === "TEXT_STYLE" ? "Search text styles…" : "Search variables…";
  const options = el("div", "options");
  const candidates = pickTargets(sourceType);

  const renderOptions = (query: string) => {
    options.textContent = "";
    const q = query.trim().toLowerCase();
    const filtered = q
      ? candidates.filter(
          (v) =>
            v.name.toLowerCase().includes(q) ||
            v.groupLabel.toLowerCase().includes(q),
        )
      : candidates;
    // Keep the full typography ramp available; cap only dense variable lists.
    const matches =
      sourceType === "TEXT_STYLE" ? filtered : filtered.slice(0, 60);

    let selectedOption: HTMLElement | null = null;
    let lastSubgroup: string | null = null;

    for (const candidate of matches) {
      if (sourceType === "TEXT_STYLE") {
        const subgroup = textStyleSubgroup(candidate.name);
        if (lastSubgroup && subgroup !== lastSubgroup) {
          options.appendChild(el("div", "combo-divider"));
        }
        lastSubgroup = subgroup;
      }

      const option = el("button", "combo-option") as HTMLButtonElement;
      option.type = "button";
      if (candidate.key === selectedTargetKey) {
        option.classList.add("is-selected");
        selectedOption = option;
      }
      option.appendChild(entrySwatches(candidate.values));
      const main = el("span", "combo-option-main");
      const value = el("span", "value", candidate.name);
      value.title = Object.entries(candidate.values)
        .map(([mode, v]) => `${mode}: ${v}`)
        .join("\n");
      main.appendChild(value);
      if (sourceType === "RADIUS") {
        const values = Array.from(
          new Set(
            Object.values(candidate.values)
              .map(Number)
              .filter(Number.isFinite),
          ),
        );
        if (values.length > 0) {
          main.appendChild(
            el("span", "combo-option-value", `${values.join("/")}px`),
          );
        }
      } else if (sourceType === "TEXT_STYLE") {
        const sizeLabel = typographySizeLabel(candidate.values, candidate.name);
        if (sizeLabel) {
          main.appendChild(el("span", "combo-option-value", sizeLabel));
        }
      }
      option.appendChild(main);
      if (candidate.key === recommendedTargetKey) {
        option.appendChild(el("span", "combo-recommended", "Recommended"));
      } else if (sourceType !== "RADIUS" && sourceType !== "TEXT_STYLE") {
        option.appendChild(el("span", "muted small", candidate.groupLabel));
      }
      option.addEventListener("click", () => {
        onPick(candidate);
        closeCombo();
      });
      options.appendChild(option);
    }
    if (matches.length === 0) {
      options.appendChild(el("div", "combo-option muted", "No matches"));
    }
    return selectedOption;
  };

  const layoutMenu = () => {
    // Clear prior size so we measure natural content height.
    menu.style.height = "auto";
    menu.style.maxHeight = "none";
    // flex:1 + basis 0% collapses options when the parent height is auto;
    // temporarily size to content so scrollHeight reflects the real list.
    options.style.flex = "none";

    const rect = trigger.getBoundingClientRect();
    const viewportGap = 4;
    const viewportMargin = 4;
    const maxMenuHeight = 240;
    const availableBelow =
      window.innerHeight - rect.bottom - viewportGap - viewportMargin;
    const availableAbove = rect.top - viewportGap - viewportMargin;
    const naturalHeight =
      input.offsetHeight + 12 + options.scrollHeight + 2;
    const desiredHeight = Math.min(maxMenuHeight, naturalHeight);
    const placeBelow =
      availableBelow >= desiredHeight ||
      (availableAbove < desiredHeight && availableBelow >= availableAbove);
    const availableHeight = Math.max(
      0,
      placeBelow ? availableBelow : availableAbove,
    );
    const menuHeight = Math.min(desiredHeight, availableHeight);

    options.style.flex = "";
    menu.style.height = `${menuHeight}px`;
    menu.style.maxHeight = `${menuHeight}px`;
    menu.style.width = `${rect.width}px`;
    menu.style.left = `${Math.max(
      viewportMargin,
      Math.min(rect.left, window.innerWidth - rect.width - viewportMargin),
    )}px`;
    menu.style.top = placeBelow
      ? `${rect.bottom + viewportGap}px`
      : `${rect.top - menuHeight - viewportGap}px`;
  };

  input.addEventListener("input", () => {
    const selectedOption = renderOptions(input.value);
    layoutMenu();
    selectedOption?.scrollIntoView({ block: "nearest" });
  });
  menu.appendChild(input);
  menu.appendChild(options);
  document.body.appendChild(menu);

  // Measure after options exist — empty list underestimates height and
  // incorrectly prefers placing below even when the trigger is near the bottom.
  const selectedOption = renderOptions("");
  layoutMenu();
  selectedOption?.scrollIntoView({ block: "center" });
  input.focus();
  openCombo = menu;
  openComboTrigger = trigger;
}

function layoutComboMenu(
  menu: HTMLElement,
  options: HTMLElement,
  trigger: HTMLElement,
  naturalHeight: number,
): void {
  menu.style.height = "auto";
  menu.style.maxHeight = "none";
  options.style.flex = "none";

  const rect = trigger.getBoundingClientRect();
  const viewportGap = 4;
  const viewportMargin = 4;
  const maxMenuHeight = 240;
  const availableBelow =
    window.innerHeight - rect.bottom - viewportGap - viewportMargin;
  const availableAbove = rect.top - viewportGap - viewportMargin;
  const desiredHeight = Math.min(maxMenuHeight, naturalHeight);
  const placeBelow =
    availableBelow >= desiredHeight ||
    (availableAbove < desiredHeight && availableBelow >= availableAbove);
  const availableHeight = Math.max(
    0,
    placeBelow ? availableBelow : availableAbove,
  );
  const menuHeight = Math.min(desiredHeight, availableHeight);

  options.style.flex = "";
  menu.style.height = `${menuHeight}px`;
  menu.style.maxHeight = `${menuHeight}px`;
  menu.style.width = `${rect.width}px`;
  menu.style.left = `${Math.max(
    viewportMargin,
    Math.min(rect.left, window.innerWidth - rect.width - viewportMargin),
  )}px`;
  menu.style.top = placeBelow
    ? `${rect.bottom + viewportGap}px`
    : `${rect.top - menuHeight - viewportGap}px`;
}

function openChoicePicker<T extends string>(
  trigger: HTMLElement,
  choices: { value: T; label: string }[],
  selected: T,
  onPick: (value: T) => void,
): void {
  if (openCombo && openComboTrigger === trigger) {
    closeCombo();
    return;
  }
  closeCombo();
  const menu = el("div", "combo-menu");
  menu.setAttribute("role", "listbox");
  const options = el("div", "options");

  let selectedOption: HTMLElement | null = null;
  for (const choice of choices) {
    const option = el("button", "combo-option") as HTMLButtonElement;
    option.type = "button";
    option.setAttribute("role", "option");
    option.setAttribute(
      "aria-selected",
      String(choice.value === selected),
    );
    if (choice.value === selected) {
      option.classList.add("is-selected");
      selectedOption = option;
    }
    option.appendChild(el("span", "value", choice.label));
    option.addEventListener("click", () => {
      onPick(choice.value);
      closeCombo();
    });
    options.appendChild(option);
  }
  menu.appendChild(options);
  document.body.appendChild(menu);

  layoutComboMenu(menu, options, trigger, options.scrollHeight + 2);
  selectedOption?.scrollIntoView({ block: "nearest" });
  trigger.setAttribute("aria-expanded", "true");
  openCombo = menu;
  openComboTrigger = trigger;
}

function openModePicker(
  trigger: HTMLElement,
  onPick: (index: number) => void,
): void {
  const choices: { value: string; label: string }[] = [
    { value: "-1", label: "Don't change" },
    ...modeOptions().map((option, index) => ({
      value: String(index),
      label: option.label,
    })),
  ];
  openChoicePicker(trigger, choices, String(modeChoiceIndex), (value) => {
    onPick(Number(value));
  });
}

function updateApplyButton(): void {
  const anyMapping = Array.from(included).some(
    (id) =>
      proposals.get(id)?.targetKey &&
      (includedUsageIndexes.get(id)?.size ?? 0) > 0,
  );
  const anyMode =
    (fixCategory === "all" ||
      fixCategory === "colors" ||
      fixCategory === "modes") &&
    (modeChoiceIndex >= 0 || clearForeignModes);
  ($("apply-btn") as HTMLButtonElement).disabled = !(anyMapping || anyMode);
  const count = Array.from(included).reduce(
    (total, id) =>
      proposals.get(id)?.targetKey
        ? total + (includedUsageIndexes.get(id)?.size ?? 0)
        : total,
    0,
  );
  $("apply-btn").textContent =
    count > 0 ? `Apply ${count} fix${count === 1 ? "" : "es"}` : "Apply";
}

function visibleUsageIndexes(usages: UsageRef[]): number[] {
  return usages
    .map((usage, index) => (usage.hidden ? -1 : index))
    .filter((index) => index >= 0);
}

function inferFixColorSurface(
  usages: UsageRef[],
): "background" | "text" | "border" {
  let background = 0;
  let text = 0;
  let border = 0;
  for (const usage of usages) {
    if (usage.prop.kind !== "paint") continue;
    if (usage.prop.property === "strokes") {
      border++;
      continue;
    }
    if (usage.nodeType === "TEXT") text++;
    else background++;
  }
  if (text >= background && text >= border && text > 0) return "text";
  if (border >= background && border >= text && border > 0) return "border";
  return "background";
}

function majorityBackdrop(
  usages: UsageRef[],
): "chromatic" | "neutral" | "unknown" {
  let chromatic = 0;
  let neutral = 0;
  for (const usage of usages) {
    if (usage.backdrop === "chromatic") chromatic++;
    else if (usage.backdrop === "neutral") neutral++;
  }
  if (chromatic === 0 && neutral === 0) return "unknown";
  return chromatic > neutral ? "chromatic" : "neutral";
}

function slimColorTargetValues(
  values: Record<string, string>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [mode, value] of Object.entries(values)) {
    if (/light|dark/i.test(mode)) out[mode] = value;
  }
  return Object.keys(out).length > 0 ? out : values;
}

function createPrepareFixesButton(
  category: FixCategory,
): HTMLButtonElement {
  const suggest = el(
    "button",
    "btn brand detail-suggest",
  ) as HTMLButtonElement;
  suggest.type = "button";
  // Component swaps are deterministic — never send them to AI.
  const useAi =
    Boolean(settings.ai?.apiKey) && category !== "components";
  const busy = preparingFixes === category;
  if (busy) {
    suggest.disabled = true;
    suggest.innerHTML = faIcon("spinner", 14, "icon-spin");
    suggest.title = useAi ? "Analyzing with AI…" : "Preparing fixes…";
    suggest.setAttribute("aria-label", suggest.title);
    suggest.classList.add("detail-suggest-busy");
  } else if (useAi) {
    suggest.innerHTML = `${faIcon("sparkle", 13)}<span>Prepare fixes</span>`;
    suggest.title = "Prepare fixes with AI analysis";
    suggest.setAttribute("aria-label", suggest.title);
  } else {
    suggest.textContent = "Prepare fixes";
  }
  if (!busy) {
    suggest.addEventListener("click", () => openFixPanel(category));
  }
  return suggest;
}

function openFixPanel(category: FixCategory): void {
  if (preparingFixes) return;
  fixCategory = category;
  const titles: Record<FixCategory, string> = {
    all: "Review all fixes",
    colors: "Fix colors",
    typography: "Fix typography",
    shape: "Fix shape",
    modes: "Fix modes",
    components: "Swap components",
  };
  $("fix-title").textContent = titles[category];
  showBanner(null);
  preparingFixes = category;
  // Stay on the category page with a spinner until propose (+ AI) finish.
  renderMain();
  send({ type: "propose-mappings", category });
}

async function handleProposalsMessage(
  category: FixCategory,
  nextProposals: MappingProposal[],
): Promise<void> {
  fixCategory = category;
  proposals = new Map(nextProposals.map((p) => [p.sourceId, p]));
  recommendedTargetKeys = new Map(
    nextProposals
      .filter(
        (proposal): proposal is MappingProposal & { targetKey: string } =>
          Boolean(proposal.targetKey),
      )
      .map((proposal) => [proposal.sourceId, proposal.targetKey]),
  );
  included = new Set(
    nextProposals.filter((p) => p.targetKey).map((p) => p.sourceId),
  );
  includedUsageIndexes = new Map();
  shownHiddenFixSources.clear();
  shownHiddenFixGroups.clear();
  for (const info of sourceInfos(fixCategory)) {
    const proposal = proposals.get(info.id);
    includedUsageIndexes.set(
      info.id,
      new Set(proposal?.targetKey ? visibleUsageIndexes(info.usages) : []),
    );
  }
  expandedFixSources.clear();
  clearForeignModes =
    (fixCategory === "all" ||
      fixCategory === "colors" ||
      fixCategory === "modes") &&
    Boolean(audit?.explicitModes.length);
  modeChoiceIndex = -1;
  if (audit?.manualDarkMode) {
    const darkIndex = modeOptions().findIndex((option) =>
      /^dark$/i.test(option.modeName.trim()),
    );
    if (darkIndex >= 0) modeChoiceIndex = darkIndex;
  }

  // Component swaps are deterministic Wave A/B rules — don't send them to AI.
  const shouldRunAi =
    preparingFixes != null &&
    preparingFixes !== "components" &&
    Boolean(settings.ai?.apiKey);
  try {
    if (shouldRunAi) {
      // Keep category page + spinner visible while AI runs.
      await runAiSuggest({ fromPrepareFixes: true });
    }
  } finally {
    preparingFixes = null;
  }
  showPanel("fix");
  renderFixPanel();
}

function renderFixUsageRow(
  usage: UsageRef,
  index: number,
  selected: Set<number>,
  onChange: () => void,
): HTMLElement {
  const layer = colorLayer(usage);
  const row = el("div", "fix-usage-row");
  const usageCheckbox = el("input") as HTMLInputElement;
  usageCheckbox.type = "checkbox";
  usageCheckbox.checked = selected.has(index);
  usageCheckbox.dataset.usageIndex = String(index);
  usageCheckbox.setAttribute(
    "aria-label",
    `Include ${usage.nodeName} in this fix`,
  );
  usageCheckbox.addEventListener("change", () => {
    if (usageCheckbox.checked) selected.add(index);
    else selected.delete(index);
    onChange();
  });
  row.appendChild(usageCheckbox);
  const layerIcon = el("span", "warning-layer-icon");
  layerIcon.innerHTML = layerContextIcon(layer);
  layerIcon.title = `${layer.nodeType} · ${layer.detail}`;
  row.appendChild(layerIcon);
  const layerName = el("span", "warning-layer-name", layer.nodeName);
  layerName.title = layer.nodeName;
  row.appendChild(layerName);
  const locate = el("button", "warning-locate") as HTMLButtonElement;
  locate.type = "button";
  locate.title = "Locate on canvas";
  locate.setAttribute("aria-label", `Locate ${layer.nodeName} on canvas`);
  locate.innerHTML = faIcon("crosshairs", 13);
  locate.addEventListener("click", () =>
    send({ type: "locate-layer", nodeId: layer.nodeId }),
  );
  row.appendChild(locate);
  return row;
}

function renderFixCard(
  info: SourceInfo,
  options?: { revealHiddenOnly?: boolean },
): HTMLElement {
  const proposal = proposals.get(info.id);
  const card = el("div", "fix-card");
  const revealHiddenOnly = Boolean(options?.revealHiddenOnly);
  const visibleIndexes = revealHiddenOnly
    ? info.usages.map((_, index) => index)
    : visibleUsageIndexes(info.usages);
  const hiddenIndexes = revealHiddenOnly
    ? []
    : info.usages
        .map((usage, index) => (usage.hidden ? index : -1))
        .filter((index) => index >= 0);
  const selected =
    includedUsageIndexes.get(info.id) ??
    new Set<number>(
      proposal?.targetKey && !revealHiddenOnly ? visibleIndexes : [],
    );
  includedUsageIndexes.set(info.id, selected);

  const top = el("div", "fix-card-top");
  const checkbox = el("input") as HTMLInputElement;
  checkbox.type = "checkbox";
  checkbox.setAttribute("aria-label", `Include visible ${info.name} usages`);
  top.appendChild(checkbox);

  const source = el("div", "fix-card-source");
  const nameRow = el("div", "fix-card-name-row");
  const sourceName = el("span", "var-name", info.name);
  sourceName.title = `${info.libraryName}\n${info.usageSummary}\n${Object.entries(info.values)
    .map(([mode, value]) => `${mode}: ${value}`)
    .join("\n")}`;
  nameRow.appendChild(sourceName);
  if (info.type === "TEXT_STYLE") {
    const sizeLabel = typographySizeLabel(info.values, info.name);
    if (sizeLabel) {
      nameRow.appendChild(el("span", "combo-option-value", sizeLabel));
    }
  }
  source.appendChild(nameRow);
  top.appendChild(source);

  const expand = el("button", "fix-expand") as HTMLButtonElement;
  expand.type = "button";
  const expandCount = el("span", "warning-count");
  const expandChevron = el("span", "warning-chevron");
  expandChevron.innerHTML = faIcon("caret-down", 12);
  expand.appendChild(expandCount);
  expand.appendChild(expandChevron);
  const isExpanded = expandedFixSources.has(info.id);
  expand.setAttribute("aria-expanded", String(isExpanded));
  expand.title = isExpanded ? "Collapse usages" : "Expand usages";
  expand.setAttribute("aria-label", expand.title);
  top.appendChild(expand);
  card.appendChild(top);

  const targetRow = el("div", "fix-card-target");
  const swapArrow = el("span", "arrow");
  swapArrow.innerHTML = faIcon("arrow-turn-down-right", 12);
  targetRow.appendChild(swapArrow);

  if (info.type === "COMPONENT") {
    const target = targetByKey(proposals.get(info.id)!.targetKey);
    const locked = el("div", "combo");
    const label = el(
      "span",
      "combo-trigger locked",
      target?.name ?? info.values.target ?? "CADS",
    );
    label.title = proposals.get(info.id)?.rationale ?? "CADS component swap";
    locked.appendChild(label);
    targetRow.appendChild(locked);
  } else {
    const combo = el("div", "combo");
    const trigger = el("button", "combo-trigger");
    const renderTrigger = () => {
      trigger.textContent = "";
      const target = targetByKey(proposals.get(info.id)!.targetKey);
      if (target) {
        trigger.appendChild(entrySwatches(target.values));
        const value = el("span", "value", target.name);
        value.title = Object.entries(target.values)
          .map(([mode, v]) => `${mode}: ${v}`)
          .join("\n");
        trigger.appendChild(value);
      } else {
        trigger.appendChild(el("span", "value placeholder", "Choose target…"));
      }
      trigger.appendChild(el("span", "muted", "▾"));
    };
    renderTrigger();
    trigger.addEventListener("click", (event) => {
      event.stopPropagation();
      openTargetPicker(
        trigger,
        info.type,
        {
          selectedTargetKey: proposals.get(info.id)?.targetKey ?? null,
          recommendedTargetKey: recommendedTargetKeys.get(info.id) ?? null,
        },
        (target) => {
          const current = proposals.get(info.id)!;
          proposals.set(info.id, {
            ...current,
            targetKey: target?.key ?? null,
            source: target ? "manual" : "none",
            confidence: target ? 1 : 0,
            rationale: target ? "Chosen by you" : undefined,
          });
          if (!target) {
            selected.clear();
          } else if (selected.size === 0) {
            for (const index of visibleIndexes) selected.add(index);
          }
          renderTrigger();
          syncSelectionState();
          updateApplyButton();
        },
      );
    });
    combo.appendChild(trigger);
    targetRow.appendChild(combo);
  }
  card.appendChild(targetRow);

  const usageList = el("div", "fix-usage-list");
  usageList.hidden = !isExpanded;
  const visibleList = el("div", "warning-list");
  for (const index of visibleIndexes) {
    visibleList.appendChild(
      renderFixUsageRow(info.usages[index], index, selected, () => {
        syncSelectionState();
        updateApplyButton();
      }),
    );
  }
  usageList.appendChild(visibleList);

  const hiddenList = el("div", "warning-list hidden-warning-list");
  if (hiddenIndexes.length > 0) {
    const hiddenShown = shownHiddenFixSources.has(info.id);
    const hiddenToggle = el(
      "button",
      "hidden-layers-toggle",
    ) as HTMLButtonElement;
    hiddenToggle.type = "button";
    const renderHiddenToggle = (shown: boolean) => {
      hiddenToggle.setAttribute("aria-expanded", String(shown));
      hiddenToggle.innerHTML =
        `<span>${shown ? "Hide" : "Show"} ${hiddenIndexes.length} hidden layer${hiddenIndexes.length === 1 ? "" : "s"}</span>` +
        faIcon("caret-down", 11);
      hiddenList.hidden = !shown;
    };
    for (const index of hiddenIndexes) {
      hiddenList.appendChild(
        renderFixUsageRow(info.usages[index], index, selected, () => {
          syncSelectionState();
          updateApplyButton();
        }),
      );
    }
    renderHiddenToggle(hiddenShown);
    hiddenToggle.addEventListener("click", () => {
      const next = !shownHiddenFixSources.has(info.id);
      if (next) shownHiddenFixSources.add(info.id);
      else shownHiddenFixSources.delete(info.id);
      renderHiddenToggle(next);
      syncSelectionState();
    });
    usageList.appendChild(hiddenToggle);
    usageList.appendChild(hiddenList);
  }
  card.appendChild(usageList);

  function selectableIndexes(): number[] {
    return shownHiddenFixSources.has(info.id)
      ? [...visibleIndexes, ...hiddenIndexes]
      : [...visibleIndexes];
  }

  function syncSelectionState(): void {
    const selectable = selectableIndexes();
    const count = selected.size;
    const allSelectableSelected =
      selectable.length > 0 && selectable.every((index) => selected.has(index));
    checkbox.checked = allSelectableSelected;
    checkbox.indeterminate = count > 0 && !allSelectableSelected;
    if (count > 0) included.add(info.id);
    else included.delete(info.id);
    card.classList.toggle("excluded", count === 0);
    const visibleCount = visibleIndexes.length;
    expandCount.textContent =
      count === visibleCount && hiddenIndexes.every((i) => !selected.has(i))
        ? `${count}×`
        : `${count}/${info.usages.length}`;
    for (const input of usageList.querySelectorAll(
      "input[data-usage-index]",
    )) {
      const elInput = input as HTMLInputElement;
      const index = Number(elInput.dataset.usageIndex);
      elInput.checked = selected.has(index);
    }
  }

  checkbox.addEventListener("change", () => {
    selected.clear();
    if (checkbox.checked) {
      for (const index of selectableIndexes()) selected.add(index);
    }
    syncSelectionState();
    updateApplyButton();
  });
  expand.addEventListener("click", () => {
    const expanded = !expandedFixSources.has(info.id);
    if (expanded) expandedFixSources.add(info.id);
    else expandedFixSources.delete(info.id);
    expand.setAttribute("aria-expanded", String(expanded));
    expand.title = expanded ? "Collapse usages" : "Expand usages";
    expand.setAttribute("aria-label", expand.title);
    usageList.hidden = !expanded;
    updateFixExpandAll(
      sourceInfos(fixCategory).filter((item) => proposals.has(item.id)),
    );
  });
  syncSelectionState();

  if (!proposal) card.style.display = "none";
  return card;
}

function updateFixExpandAll(infos: SourceInfo[]): void {
  const button = $("fix-expand-all") as HTMLButtonElement;
  const ids = infos.map((info) => info.id);
  button.hidden = ids.length === 0;
  if (ids.length === 0) return;
  const allExpanded = ids.every((id) => expandedFixSources.has(id));
  button.title = allExpanded ? "Collapse all usages" : "Expand all usages";
  button.setAttribute("aria-label", button.title);
  button.innerHTML = allExpanded
    ? faIcon("arrows-to-dotted-line", 13)
    : faIcon("arrows-from-dotted-line", 13);
}

function renderFixPanel(): void {
  const body = $("fix-body");
  body.textContent = "";
  if (!audit || !catalog) return;

  const showModes =
    fixCategory === "all" ||
    fixCategory === "colors" ||
    fixCategory === "modes";
  if (showModes && fixCategory !== "components") {
    const section = el("section", "warning-group fix-section");
    const groupHeader = el("div", "warning-group-header");
    const titleRow = el("div", "warning-group-title-row");
    titleRow.appendChild(el("h2", "", "Modes"));
    groupHeader.appendChild(titleRow);
    section.appendChild(groupHeader);

    if (audit.manualDarkMode) {
      section.appendChild(
        el(
          "p",
          "muted small mode-hint",
          "This selection looks like manual dark mode. Color proposals assume CADS Dark; Apply can set the frame mode below.",
        ),
      );
    } else if (audit.colorThemeAssumption === "dark") {
      section.appendChild(
        el(
          "p",
          "muted small mode-hint",
          "Roots already resolve to CADS Dark — theme-aware white/black map to primary (not primary-inverse).",
        ),
      );
    }

    const panel = el("div", "mode-panel");
    const modeField = el("div", "mode-panel-field");
    modeField.appendChild(el("span", "muted small", "Set frame mode"));
    const combo = el("div", "combo");
    const trigger = el("button", "combo-trigger");
    const renderModeTrigger = () => {
      trigger.textContent = "";
      const options = modeOptions();
      const label =
        modeChoiceIndex >= 0
          ? (options[modeChoiceIndex]?.label ?? "Don't change")
          : "Don't change";
      trigger.appendChild(el("span", "value", label));
      trigger.appendChild(el("span", "muted", "▾"));
    };
    renderModeTrigger();
    trigger.addEventListener("click", (event) => {
      event.stopPropagation();
      openModePicker(trigger, (index) => {
        modeChoiceIndex = index;
        renderModeTrigger();
        updateApplyButton();
      });
    });
    combo.appendChild(trigger);
    modeField.appendChild(combo);
    panel.appendChild(modeField);

    const foreignModes = audit.explicitModes;
    if (foreignModes.length > 0) {
      const clearRow = el("label", "mode-panel-row");
      const clearInput = el("input") as HTMLInputElement;
      clearInput.type = "checkbox";
      clearInput.checked = clearForeignModes;
      clearInput.addEventListener("change", () => {
        clearForeignModes = clearInput.checked;
        updateApplyButton();
      });
      clearRow.appendChild(clearInput);
      clearRow.appendChild(
        el("span", "", `Clear foreign modes (${foreignModes.length})`),
      );
      panel.appendChild(clearRow);
    }
    section.appendChild(panel);
    body.appendChild(section);
  }

  const infos = sourceInfos(fixCategory).filter((info) =>
    proposals.has(info.id),
  );
  updateFixExpandAll(infos);
  if (infos.length === 0 && !showModes) {
    body.appendChild(el("p", "muted", "Nothing to remap in this category."));
    updateApplyButton();
    return;
  }

  const groupOrder = [
    "CADS primitives",
    "Non-CADS variables",
    "Color styles",
    "Raw hex values",
    "Non-CADS styles",
    "Raw typography",
    "Non-CADS shape tokens",
    "Raw border radii",
    "Component swaps",
  ];
  const groups = new Map<string, SourceInfo[]>();
  for (const info of infos) {
    const key = info.groupLabel;
    const list = groups.get(key) ?? [];
    list.push(info);
    groups.set(key, list);
  }

  const keys = [
    ...groupOrder.filter((key) => groups.has(key)),
    ...Array.from(groups.keys()).filter((key) => !groupOrder.includes(key)),
  ];

  for (const key of keys) {
    const groupInfos = groups.get(key) ?? [];
    const visibleInfos = groupInfos.filter((info) =>
      info.usages.some((usage) => !usage.hidden),
    );
    const hiddenOnlyInfos = groupInfos.filter(
      (info) =>
        info.usages.length > 0 && info.usages.every((usage) => usage.hidden),
    );
    const hiddenLayerCount = hiddenOnlyInfos.reduce(
      (total, info) => total + info.usages.length,
      0,
    );

    const section = el("section", "warning-group fix-section");
    const groupHeader = el("div", "warning-group-header");
    const titleRow = el("div", "warning-group-title-row");
    titleRow.appendChild(el("h2", "", key));
    if (visibleInfos.length > 0) {
      titleRow.appendChild(
        el("span", "warning-group-count", String(visibleInfos.length)),
      );
    }
    groupHeader.appendChild(titleRow);
    section.appendChild(groupHeader);

    if (visibleInfos.length > 0) {
      const list = el("div", "fix-list warning-list");
      for (const info of visibleInfos) {
        list.appendChild(renderFixCard(info));
      }
      section.appendChild(list);
    }

    if (hiddenLayerCount > 0) {
      const hiddenShown = shownHiddenFixGroups.has(key);
      const toggleHidden = el(
        "button",
        "hidden-layers-toggle",
      ) as HTMLButtonElement;
      toggleHidden.type = "button";
      toggleHidden.setAttribute("aria-expanded", String(hiddenShown));
      toggleHidden.innerHTML =
        `<span>${hiddenShown ? "Hide" : "Show"} ${hiddenLayerCount} hidden layer${hiddenLayerCount === 1 ? "" : "s"}</span>` +
        faIcon("caret-down", 11);
      toggleHidden.addEventListener("click", () => {
        if (hiddenShown) shownHiddenFixGroups.delete(key);
        else shownHiddenFixGroups.add(key);
        renderFixPanel();
      });
      section.appendChild(toggleHidden);
      if (hiddenShown) {
        const hiddenList = el("div", "fix-list warning-list hidden-warning-list");
        for (const info of hiddenOnlyInfos) {
          hiddenList.appendChild(
            renderFixCard(info, { revealHiddenOnly: true }),
          );
        }
        section.appendChild(hiddenList);
      }
    }

    body.appendChild(section);
  }

  updateApplyButton();
}

// ---------------------------------------------------------------------------
// Settings / AI

function aiProviderLabel(provider: AiProvider): string {
  return (
    AI_PROVIDER_OPTIONS.find((option) => option.value === provider)?.label ??
    provider
  );
}

function renderAiProviderTrigger(): void {
  $("ai-provider-value").textContent = aiProviderLabel(aiProviderDraft);
}

function closeSettingsModal(): void {
  closeCombo();
  $("ai-provider-trigger").setAttribute("aria-expanded", "false");
  $("ai-modal").classList.remove("show");
}

function openAiModal(): void {
  const ai = settings.ai;
  aiProviderDraft = ai?.provider ?? "anthropic";
  renderAiProviderTrigger();
  ($("ai-model") as HTMLInputElement).value =
    ai?.model ?? DEFAULT_AI_MODELS[aiProviderDraft];
  ($("ai-key") as HTMLInputElement).value = ai?.apiKey ?? "";
  $("ai-modal").classList.add("show");
}

async function runAiSuggest(options?: {
  fromPrepareFixes?: boolean;
}): Promise<void> {
  if (!settings.ai?.apiKey) {
    if (!options?.fromPrepareFixes) openAiModal();
    return;
  }
  if (!catalog || aiBusy) return;
  const infos = sourceInfos(fixCategory);
  const unresolved = infos.filter(
    (info) => !proposals.get(info.id)?.targetKey,
  );
  if (unresolved.length === 0) {
    if (!options?.fromPrepareFixes) {
      send({
        type: "notify",
        message: "Nothing unresolved — all rows already have a proposed target.",
      });
    }
    return;
  }
  aiBusy = true;
  try {
    const sources: AiSourceInput[] = unresolved.slice(0, 80).map((info) => {
      const base: AiSourceInput = {
        sourceId: info.id,
        name: info.name,
        type: info.type,
        values: info.values,
        usageSummary: info.usageSummary,
        groupLabel: info.groupLabel,
      };
      if (info.type === "COLOR") {
        base.surface = inferFixColorSurface(info.usages);
        base.backdrop = majorityBackdrop(info.usages);
        base.themeAssumption = audit?.colorThemeAssumption ?? "light";
      }
      return base;
    });
    const types = new Set(sources.map((s) => s.type));
    const targets: {
      name: string;
      type: string;
      values: Record<string, string>;
    }[] = [];
    for (const type of types) {
      for (const candidate of pickTargets(type)) {
        targets.push({
          name: candidate.name,
          type,
          values:
            type === "COLOR"
              ? slimColorTargetValues(candidate.values)
              : candidate.values,
        });
      }
    }
    const typeById = new Map(infos.map((info) => [info.id, info.type]));
    const infoById = new Map(infos.map((info) => [info.id, info]));
    const suggestions = await requestAiSuggestions(
      settings.ai,
      sources,
      targets,
    );
    let applied = 0;
    for (const suggestion of suggestions) {
      const current = proposals.get(suggestion.sourceId);
      if (
        !current ||
        current.targetKey ||
        current.source === "rule" ||
        current.source === "cache"
      ) {
        continue;
      }
      const sourceType = typeById.get(suggestion.sourceId);
      const target =
        suggestion.targetName && sourceType
          ? pickTargets(sourceType).find((t) => t.name === suggestion.targetName)
          : null;
      if (!target) continue;
      proposals.set(suggestion.sourceId, {
        ...current,
        targetKey: target.key,
        source: "ai",
        confidence: suggestion.confidence,
        rationale: suggestion.rationale || "AI suggestion",
      });
      recommendedTargetKeys.set(suggestion.sourceId, target.key);
      const info = infoById.get(suggestion.sourceId);
      if (info) {
        included.add(info.id);
        includedUsageIndexes.set(
          info.id,
          new Set(visibleUsageIndexes(info.usages)),
        );
      }
      applied++;
    }
    send({
      type: "notify",
      message: `AI suggested ${applied} mapping(s) — review before applying.`,
    });
  } catch (error) {
    showBanner(`AI request failed: ${String((error as Error).message ?? error)}`);
  } finally {
    aiBusy = false;
  }
}

// ---------------------------------------------------------------------------
// Wiring

$("fix-back").innerHTML = faIcon("arrow-left", 14);
$("ai-settings-btn").innerHTML = faIcon("gear", 14);

$("fix-back").addEventListener("click", () => {
  showPanel(null);
  renderMain();
});

$("fix-expand-all").addEventListener("click", () => {
  const infos = sourceInfos(fixCategory).filter((info) =>
    proposals.has(info.id),
  );
  const ids = infos.map((info) => info.id);
  const allExpanded =
    ids.length > 0 && ids.every((id) => expandedFixSources.has(id));
  if (allExpanded) {
    for (const id of ids) expandedFixSources.delete(id);
  } else {
    for (const id of ids) expandedFixSources.add(id);
  }
  renderFixPanel();
});

$("apply-btn").addEventListener("click", () => {
  const mappings = Array.from(included)
    .map((id) => proposals.get(id))
    .filter((p): p is MappingProposal => Boolean(p?.targetKey))
    .map((p) => ({
      sourceId: p.sourceId,
      targetKey: p.targetKey!,
      usageIndexes: Array.from(
        includedUsageIndexes.get(p.sourceId) ?? [],
      ).sort((a, b) => a - b),
    }))
    .filter((mapping) => mapping.usageIndexes.length > 0);
  const options = modeOptions();
  const mode = modeChoiceIndex >= 0 ? options[modeChoiceIndex] : null;
  const applyModes =
    fixCategory === "all" ||
    fixCategory === "colors" ||
    fixCategory === "modes";
  ($("apply-btn") as HTMLButtonElement).disabled = true;
  $("apply-btn").textContent = "Applying…";
  send({
    type: "apply",
    request: {
      mappings,
      setMode:
        applyModes && mode
          ? { collectionKey: mode.collectionKey, modeName: mode.modeName }
          : null,
      clearForeignModes: applyModes && clearForeignModes,
      category: fixCategory,
    },
  });
});

$("reaudit-cancel").addEventListener("click", closeReauditDialog);
$("reaudit-confirm").addEventListener("click", () => runAudit(true));
$("reaudit-modal").addEventListener("click", (event) => {
  if (event.target === $("reaudit-modal")) closeReauditDialog();
});

$("ai-settings-btn").addEventListener("click", openAiModal);
$("ai-cancel").addEventListener("click", closeSettingsModal);
$("ai-clear").addEventListener("click", () => {
  settings = { ...settings, ai: null };
  send({ type: "save-ai-settings", ai: null });
  closeSettingsModal();
  if (audit && !$("fix-panel").classList.contains("show")) renderMain();
});
$("ai-save").addEventListener("click", () => {
  const provider = aiProviderDraft;
  const model =
    ($("ai-model") as HTMLInputElement).value.trim() ||
    DEFAULT_AI_MODELS[provider];
  const apiKey = ($("ai-key") as HTMLInputElement).value.trim();
  settings = {
    ...settings,
    ai: apiKey ? { provider, model, apiKey } : null,
  };
  send({
    type: "save-ai-settings",
    ai: settings.ai,
  });
  closeSettingsModal();
  // Refresh Prepare fixes sparkle if a category page is open.
  if (audit && !$("fix-panel").classList.contains("show")) renderMain();
});
$("ai-provider-trigger").addEventListener("click", (event) => {
  event.stopPropagation();
  openChoicePicker(
    $("ai-provider-trigger"),
    AI_PROVIDER_OPTIONS,
    aiProviderDraft,
    (provider) => {
      aiProviderDraft = provider;
      renderAiProviderTrigger();
      ($("ai-model") as HTMLInputElement).value = DEFAULT_AI_MODELS[provider];
    },
  );
});
$("ai-modal").addEventListener("click", (event) => {
  if (event.target === $("ai-modal")) closeSettingsModal();
});
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (openCombo) {
    closeCombo();
    return;
  }
  if ($("ai-modal").classList.contains("show")) {
    closeSettingsModal();
    return;
  }
  if ($("reaudit-modal").classList.contains("show")) {
    closeReauditDialog();
  }
});

// ---------------------------------------------------------------------------
// Messages

window.onmessage = (event: MessageEvent) => {
  const message = event.data?.pluginMessage as CodeToUiMessage | undefined;
  if (!message) return;
  switch (message.type) {
    case "settings": {
      settings = message.settings;
      break;
    }
    case "no-library": {
      libraryMissingMessage = message.message;
      catalog = null;
      showPanel(null);
      renderMain();
      break;
    }
    case "catalog-progress": {
      const label = message.label ?? "Loading CADS";
      catalogProgress = {
        done: message.done,
        total: message.total,
        label,
      };
      const percent =
        message.total === 0
          ? 0
          : Math.round((message.done / message.total) * 100);
      if (!catalog && !libraryMissingMessage) {
        const meta = document.getElementById("main-progress-meta");
        const bar = document.getElementById("main-progress-bar");
        if (meta && bar) {
          meta.textContent =
            message.total > 0
              ? `${label} — ${message.done} of ${message.total}`
              : `${label}…`;
          bar.style.width = `${Math.max(percent, message.total > 0 ? 0 : 8)}%`;
        } else {
          renderMain();
        }
      }
      updateStatusFooter();
      break;
    }
    case "catalog": {
      libraryMissingMessage = null;
      catalog = message.catalog;
      catalogProgress = { done: 0, total: 0, label: "Loading CADS" };
      showPanel(null);
      renderMain();
      break;
    }
    case "selection": {
      selectionCount = message.count;
      selectionLabel = message.label;
      selectionNodeIds = message.nodeIds;
      if (
        audit &&
        (selectionCount === 0 ||
          isSameSelection(selectionNodeIds, audit.rootNodeIds))
      ) {
        closeReauditDialog();
      }
      // Stay on results until the user re-audits; refresh ready/loading heroes.
      if (!auditing && !audit) {
        renderMain();
      } else {
        updateStatusFooter();
      }
      break;
    }
    case "audit-progress": {
      auditNodesScanned = message.nodesScanned;
      if (auditing) {
        const meta = document.querySelector("#main .hero-progress .meta");
        if (meta) {
          meta.textContent = `${message.nodesScanned} layers scanned`;
        } else {
          renderMain();
        }
      }
      updateStatusFooter();
      break;
    }
    case "audit": {
      auditing = false;
      auditNodesScanned = 0;
      audit = message.result;
      activeOverviewCategory = null;
      expandedColorWarnings.clear();
      activeColorTab = "colors";
      shownHiddenColorGroups.clear();
      expandedTypographyWarnings.clear();
      shownHiddenTypographyGroups.clear();
      expandedComponentWarnings.clear();
      shownHiddenComponentGroups.clear();
      expandedShapeWarnings.clear();
      shownHiddenShapeGroups.clear();
      includedUsageIndexes.clear();
      expandedFixSources.clear();
      shownHiddenFixSources.clear();
      shownHiddenFixGroups.clear();
      preparingFixes = null;
      recommendedTargetKeys.clear();
      showPanel(null);
      renderMain();
      break;
    }
    case "proposals": {
      void handleProposalsMessage(message.category, message.proposals);
      break;
    }
    case "apply-done": {
      $("apply-btn").textContent = "Apply";
      ($("apply-btn") as HTMLButtonElement).disabled = false;
      break;
    }
    case "fatal": {
      showBanner(message.message);
      auditing = false;
      auditNodesScanned = 0;
      preparingFixes = null;
      ($("apply-btn") as HTMLButtonElement).disabled = false;
      $("apply-btn").textContent = "Apply";
      renderMain();
      break;
    }
  }
};

renderMain();
send({ type: "init" });
