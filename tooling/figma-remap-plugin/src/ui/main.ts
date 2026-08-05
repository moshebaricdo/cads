/**
 * CADS Audit — UI iframe app.
 * Summary-first findings workspace + category-scoped fix panel.
 */
import type {
  AiSettings,
  ApplyReport,
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
  isPrimitiveColorCollection,
  isShapeCollection,
  isShapeVariable,
} from "../data/cadsCatalog";
import { requestAiSuggestions, type AiSourceInput } from "./ai";
import { icon as faIcon } from "./faIcons";

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
let modeChoiceIndex = -1;
let clearForeignModes = false;
let aiBusy = false;
let auditing = false;
let fixCategory: FixCategory = "all";
let lastReport: ApplyReport | null = null;
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
  $("fix-panel").classList.toggle("show", name === "fix");
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
  lastReport = null;
  audit = null;
  renderMain();
  send({ type: "audit" });
}

function clearAuditSelection(): void {
  audit = null;
  lastReport = null;
  recommendedTargetKeys.clear();
  includedUsageIndexes.clear();
  expandedFixSources.clear();
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
      ? `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M12 3 2.8 20h18.4L12 3Z"/><path d="M12 9v5M12 17.5v.5"/></svg><span>${count} usage${count === 1 ? "" : "s"}</span>`
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
  layers: ColorLayerRef[];
  icon?: "mode" | "typography" | "fontAwesome" | "component" | "shape";
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
  switch (usage.prop.kind) {
    case "paint":
      return `${usage.prop.property === "fills" ? "Fill" : "Stroke"} ${usage.prop.index + 1}`;
    case "effect":
      return `Effect ${usage.prop.index + 1}`;
    case "field":
      return usage.prop.field.replace(/([a-z])([A-Z])/g, "$1 $2");
    case "textStyle":
      return "Text style";
  }
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

function typographyWarningGroups(): TypographyWarningGroup[] {
  if (!audit) return [];
  return [
    {
      id: "variables",
      title: "CADS variables without a style",
      warnings: audit.entries
        .filter((entry) => entry.flag === "typographyVariable")
        .map((entry) => ({
          id: entry.id,
          label: entry.name,
          meta: `CADS typography variable · ${entry.collectionName}`,
          values: [],
          icon: "typography",
          layers: entry.usages.map(colorLayer),
        })),
    },
    {
      id: "styles",
      title: "Non-CADS styles",
      warnings: audit.textStyles.map((entry) => ({
        id: entry.id,
        label: entry.name,
        meta: `${entry.values.family ?? "Unknown font"} · ${entry.values.size ?? "?"}px`,
        values: [],
        icon: "typography",
        layers: entry.usages.map(colorLayer),
      })),
    },
    {
      id: "raw",
      title: "Raw typography",
      warnings: audit.rawTexts.map((entry) => ({
        id: entry.id,
        label: entry.label,
        meta: "No text style",
        values: [],
        icon: "typography",
        layers: entry.usages.map(colorLayer),
      })),
    },
    {
      id: "fontAwesome",
      title: "Outdated Font Awesome",
      warnings: audit.fontAwesomeTexts.map((entry) => ({
        id: entry.id,
        label: entry.label,
        meta: "Use a Font Awesome 7 font",
        values: [],
        icon: "fontAwesome",
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
        icon: "component",
        layers: entry.usages.map(colorLayer),
      })),
    },
    {
      id: "nonCads",
      title: "Non-CADS components",
      warnings: audit.components.map((entry) => ({
        id: `component:${entry.key}`,
        label: entry.name,
        meta: entry.isLocal ? "Local component" : "External library component",
        values: [],
        icon: "component",
        layers: entry.usages.map(colorLayer),
      })),
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
    return '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 0 0 16V4Z"/></svg>';
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
  const trigger = el("button", "warning-trigger") as HTMLButtonElement;
  trigger.type = "button";
  trigger.title = `${warning.label} · ${warning.meta}`;
  const isExpanded = expandedWarnings.has(warning.id);
  trigger.setAttribute("aria-expanded", String(isExpanded));

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
      modeIcon.innerHTML =
        '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 0 0 16V4Z"/></svg>';
    }
    trigger.appendChild(modeIcon);
  }

  const copy = el("span", "warning-copy");
  copy.appendChild(el("span", "warning-name", warning.label));
  trigger.appendChild(copy);
  trigger.appendChild(
    el(
      "span",
      "warning-count",
      `${warning.layers.length} usage${warning.layers.length === 1 ? "" : "s"}`,
    ),
  );
  const chevron = el("span", "warning-chevron");
  chevron.innerHTML = faIcon("caret-down", 12);
  trigger.appendChild(chevron);
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

  trigger.addEventListener("click", () => {
    if (expandedWarnings.has(warning.id)) {
      expandedWarnings.delete(warning.id);
      trigger.setAttribute("aria-expanded", "false");
      layers.hidden = true;
    } else {
      expandedWarnings.add(warning.id);
      trigger.setAttribute("aria-expanded", "true");
      layers.hidden = false;
    }
  });
  return card;
}

function renderColorDetail(): void {
  if (!audit) return;
  const main = $("main");
  const detail = el("div", "category-detail");

  const groups = colorWarningGroups();
  const colorGroups = groups.filter((group) => group.id !== "modes");
  const modeGroups = groups.filter((group) => group.id === "modes");

  const tabs = el("div", "detail-tabs");
  const tabData: { id: "colors" | "modes"; label: string }[] = [
    { id: "colors", label: "Color warnings" },
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

  const header = el("div", "detail-header");
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
  const headerCopy = el("div", "detail-header-copy");
  headerCopy.appendChild(el("h1", "", "Color"));
  header.appendChild(headerCopy);

  const headerActions = el("div", "detail-header-actions");
  headerActions.appendChild(
    el(
      "span",
      visibleUsageCount > 0 ? "detail-header-count" : "detail-header-count pass",
      visibleUsageCount > 0
        ? `${visibleUsageCount} usage${visibleUsageCount === 1 ? "" : "s"}`
        : "Pass",
    ),
  );
  if (visibleDistinctWarningCount > 0) {
    const visibleWarningIds = warnings
      .filter((warning) => warning.layers.some((layer) => !layer.hidden))
      .map((warning) => warning.id);
    const allExpanded = visibleWarningIds.every((id) =>
      expandedColorWarnings.has(id),
    );
    const toggleAll = el("button", "icon-btn detail-expand") as HTMLButtonElement;
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
  detail.appendChild(header);
  detail.appendChild(tabs);

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
    detail.appendChild(empty);
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
    detail.appendChild(groupList);
  }

  if (visibleUsageCount > 0) {
    const actionBar = el("div", "detail-action-bar");
    const suggest = el(
      "button",
      "btn brand detail-suggest",
    ) as HTMLButtonElement;
    suggest.type = "button";
    suggest.innerHTML =
      '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z"/><path d="m19 14 .75 2.25L22 17l-2.25.75L19 20l-.75-2.25L16 17l2.25-.75L19 14Z"/></svg><span>Suggest fixes</span>';
    suggest.addEventListener("click", () =>
      openFixPanel(activeColorTab === "colors" ? "colors" : "modes"),
    );
    actionBar.appendChild(suggest);
    detail.appendChild(actionBar);
  }

  main.appendChild(detail);
}

function renderTypographyDetail(): void {
  if (!audit) return;
  const main = $("main");
  const detail = el("div", "category-detail");
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

  const header = el("div", "detail-header");
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
  const headerCopy = el("div", "detail-header-copy");
  headerCopy.appendChild(el("h1", "", "Typography"));
  header.appendChild(headerCopy);

  const headerActions = el("div", "detail-header-actions");
  headerActions.appendChild(
    el(
      "span",
      visibleUsageCount > 0 ? "detail-header-count" : "detail-header-count pass",
      visibleUsageCount > 0
        ? `${visibleUsageCount} usage${visibleUsageCount === 1 ? "" : "s"}`
        : "Pass",
    ),
  );
  if (visibleWarningIds.length > 0) {
    const allExpanded = visibleWarningIds.every((id) =>
      expandedTypographyWarnings.has(id),
    );
    const toggleAll = el("button", "icon-btn detail-expand") as HTMLButtonElement;
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
  detail.appendChild(header);

  if (warnings.length === 0) {
    const empty = el("div", "detail-empty");
    empty.appendChild(readyCheckIcon());
    empty.appendChild(el("strong", "", "Typography passed"));
    empty.appendChild(
      el("span", "", "No typography warnings were found in this selection."),
    );
    detail.appendChild(empty);
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
    detail.appendChild(groupList);
  }

  if (visibleUsageCount > 0) {
    const actionBar = el("div", "detail-action-bar");
    const suggest = el(
      "button",
      "btn brand detail-suggest",
    ) as HTMLButtonElement;
    suggest.type = "button";
    suggest.innerHTML =
      '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z"/><path d="m19 14 .75 2.25L22 17l-2.25.75L19 20l-.75-2.25L16 17l2.25-.75L19 14Z"/></svg><span>Suggest fixes</span>';
    suggest.addEventListener("click", () => openFixPanel("typography"));
    actionBar.appendChild(suggest);
    detail.appendChild(actionBar);
  }

  main.appendChild(detail);
}

function renderComponentsDetail(): void {
  if (!audit) return;
  const main = $("main");
  const detail = el("div", "category-detail");
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

  const header = el("div", "detail-header");
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
  const headerCopy = el("div", "detail-header-copy");
  headerCopy.appendChild(el("h1", "", "Component usage"));
  header.appendChild(headerCopy);

  const headerActions = el("div", "detail-header-actions");
  headerActions.appendChild(
    el(
      "span",
      visibleUsageCount > 0 ? "detail-header-count" : "detail-header-count pass",
      visibleUsageCount > 0
        ? `${visibleUsageCount} usage${visibleUsageCount === 1 ? "" : "s"}`
        : "Pass",
    ),
  );
  if (visibleWarningIds.length > 0) {
    const allExpanded = visibleWarningIds.every((id) =>
      expandedComponentWarnings.has(id),
    );
    const toggleAll = el("button", "icon-btn detail-expand") as HTMLButtonElement;
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
  detail.appendChild(header);

  if (warnings.length === 0) {
    const empty = el("div", "detail-empty");
    empty.appendChild(readyCheckIcon());
    empty.appendChild(el("strong", "", "Components passed"));
    empty.appendChild(
      el("span", "", "No component warnings were found in this selection."),
    );
    detail.appendChild(empty);
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
    detail.appendChild(groupList);
  }

  main.appendChild(detail);
}

function renderShapeDetail(): void {
  if (!audit) return;
  const main = $("main");
  const detail = el("div", "category-detail");
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

  const header = el("div", "detail-header");
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
  const headerCopy = el("div", "detail-header-copy");
  headerCopy.appendChild(el("h1", "", "Shape"));
  header.appendChild(headerCopy);

  const headerActions = el("div", "detail-header-actions");
  headerActions.appendChild(
    el(
      "span",
      visibleUsageCount > 0 ? "detail-header-count" : "detail-header-count pass",
      visibleUsageCount > 0
        ? `${visibleUsageCount} usage${visibleUsageCount === 1 ? "" : "s"}`
        : "Pass",
    ),
  );
  if (visibleWarningIds.length > 0) {
    const allExpanded = visibleWarningIds.every((id) =>
      expandedShapeWarnings.has(id),
    );
    const toggleAll = el("button", "icon-btn detail-expand") as HTMLButtonElement;
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
  detail.appendChild(header);

  if (warnings.length === 0) {
    const empty = el("div", "detail-empty");
    empty.appendChild(readyCheckIcon());
    empty.appendChild(el("strong", "", "Shape passed"));
    empty.appendChild(
      el("span", "", "No border-radius warnings were found in this selection."),
    );
    detail.appendChild(empty);
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
    detail.appendChild(groupList);
  }

  if (visibleUsageCount > 0) {
    const actionBar = el("div", "detail-action-bar");
    const suggest = el(
      "button",
      "btn brand detail-suggest",
    ) as HTMLButtonElement;
    suggest.type = "button";
    suggest.innerHTML =
      '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z"/><path d="m19 14 .75 2.25L22 17l-2.25.75L19 20l-.75-2.25L16 17l2.25-.75L19 14Z"/></svg><span>Suggest fixes</span>';
    suggest.addEventListener("click", () => openFixPanel("shape"));
    actionBar.appendChild(suggest);
    detail.appendChild(actionBar);
  }

  main.appendChild(detail);
}

function renderAuditOverview(): void {
  if (!audit) return;
  const main = $("main");
  const overview = el("div", "audit-overview");

  const topbar = el("div", "audit-topbar");
  const target = el("div", "audit-target");
  const targetCopy = el("div", "audit-target-copy");
  targetCopy.appendChild(el("span", "audit-target-label", "Auditing:"));
  const targetName = el("div", "audit-target-name", audit.selectionLabel);
  targetName.title = audit.selectionLabel;
  targetCopy.appendChild(targetName);
  target.appendChild(targetCopy);
  topbar.appendChild(target);

  const rerun = el("button", "icon-btn") as HTMLButtonElement;
  rerun.type = "button";
  rerun.title = "Rerun audit";
  rerun.setAttribute("aria-label", "Rerun audit");
  rerun.disabled = selectionCount === 0;
  rerun.innerHTML = OVERVIEW_ICONS.rerun;
  rerun.addEventListener("click", () => runAudit());
  topbar.appendChild(rerun);
  overview.appendChild(topbar);

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
      label: "Warning usages",
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
  overview.appendChild(scoreCard);

  overview.appendChild(el("div", "category-heading", "Audit categories"));
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
  overview.appendChild(categories);

  if (audit.mixedTextSkipped + audit.mixedStyleSkipped > 0) {
    overview.appendChild(
      el(
        "div",
        "muted small",
        `${audit.mixedTextSkipped + audit.mixedStyleSkipped} mixed text layer(s) skipped`,
      ),
    );
  }
  if (lastReport) overview.appendChild(renderReportStrip(lastReport));
  main.appendChild(overview);
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
      el("p", "", "Scanning surface layers — skipping component internals."),
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

function renderReportStrip(report: ApplyReport): HTMLElement {
  const wrap = el("div", "report-strip");
  wrap.appendChild(el("div", "group-title", "Last apply"));
  wrap.appendChild(
    el(
      "div",
      "muted small",
      `${report.usagesRebound} usages fixed` +
        (report.modesCleared ? `, ${report.modesCleared} modes cleared` : "") +
        (report.failures.length ? `, ${report.failures.length} issue(s)` : ""),
    ),
  );
  return wrap;
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
    for (const style of audit.textStyles) {
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
    for (const raw of audit.rawTexts) {
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

  return infos;
}

interface PickTarget {
  key: string;
  name: string;
  values: Record<string, string>;
  groupLabel: string;
}

function pickTargets(sourceType: string): PickTarget[] {
  if (!catalog) return [];
  if (sourceType === "TEXT_STYLE") {
    return catalog.textStyles.map((style) => ({
      key: style.key,
      name: style.name,
      values: style.values,
      groupLabel: "Text style",
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
  if (!key || !catalog) return null;
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
  return null;
}

function modeOptions(): {
  collectionKey: string;
  modeName: string;
  label: string;
}[] {
  if (!catalog) return [];
  const options: {
    collectionKey: string;
    modeName: string;
    label: string;
  }[] = [];
  for (const collection of catalog.collections) {
    for (const modeName of collection.modes) {
      options.push({
        collectionKey: collection.key,
        modeName,
        label: `${collection.name} · ${modeName}`,
      });
    }
  }
  return options;
}

let openCombo: HTMLElement | null = null;

function closeCombo(): void {
  openCombo?.remove();
  openCombo = null;
}

document.addEventListener("click", (event) => {
  if (openCombo && !openCombo.contains(event.target as Node)) closeCombo();
});

function openTargetPicker(
  trigger: HTMLElement,
  sourceType: string,
  recommendedTargetKey: string | null,
  onPick: (target: PickTarget | null) => void,
): void {
  closeCombo();
  if (!catalog) return;
  const menu = el("div", "combo-menu");
  const input = el("input") as HTMLInputElement;
  input.placeholder =
    sourceType === "TEXT_STYLE" ? "Search text styles…" : "Search variables…";
  const options = el("div", "options");
  const candidates = pickTargets(sourceType);

  const renderOptions = (query: string) => {
    options.textContent = "";
    const q = query.trim().toLowerCase();
    const matches = (
      q
        ? candidates.filter(
            (v) =>
              v.name.toLowerCase().includes(q) ||
              v.groupLabel.toLowerCase().includes(q),
          )
        : candidates
    ).slice(0, 60);

    for (const candidate of matches) {
      const option = el("button", "combo-option");
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
      }
      option.appendChild(main);
      if (candidate.key === recommendedTargetKey) {
        option.appendChild(el("span", "combo-recommended", "Recommended"));
      } else if (sourceType !== "RADIUS") {
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
  };

  input.addEventListener("input", () => renderOptions(input.value));
  menu.appendChild(input);
  menu.appendChild(options);
  const footer = el("div", "combo-footer");
  const skip = el("button", "combo-skip") as HTMLButtonElement;
  skip.type = "button";
  skip.textContent = "Skip this mapping";
  skip.addEventListener("click", () => {
    onPick(null);
    closeCombo();
  });
  footer.appendChild(skip);
  menu.appendChild(footer);
  document.body.appendChild(menu);

  const rect = trigger.getBoundingClientRect();
  const viewportGap = 4;
  const availableBelow =
    window.innerHeight - rect.bottom - viewportGap * 2;
  const availableAbove = rect.top - viewportGap * 2;
  const desiredHeight = 240;
  const placeBelow =
    availableBelow >= desiredHeight || availableBelow >= availableAbove;
  const availableHeight = placeBelow ? availableBelow : availableAbove;
  menu.style.maxHeight = `${Math.max(
    0,
    Math.min(desiredHeight, availableHeight),
  )}px`;
  menu.style.width = `${rect.width}px`;
  menu.style.left = `${Math.max(
    viewportGap,
    Math.min(rect.left, window.innerWidth - rect.width - viewportGap),
  )}px`;
  const renderedMenuHeight = menu.getBoundingClientRect().height;
  menu.style.top = placeBelow
    ? `${rect.bottom + viewportGap}px`
    : `${rect.top - renderedMenuHeight - viewportGap}px`;

  renderOptions("");
  input.focus();
  openCombo = menu;
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

function openFixPanel(category: FixCategory): void {
  fixCategory = category;
  const titles: Record<FixCategory, string> = {
    all: "Review all fixes",
    colors: "Fix colors",
    typography: "Fix typography",
    shape: "Fix shape",
    modes: "Fix modes",
  };
  $("fix-title").textContent = titles[category];
  showBanner(null);
  send({ type: "propose-mappings", category });
}

function renderFixCard(info: SourceInfo): HTMLElement {
  const proposal = proposals.get(info.id);
  const card = el("div", "fix-card");
  const selected =
    includedUsageIndexes.get(info.id) ??
    new Set<number>(info.usages.map((_, index) => index));
  includedUsageIndexes.set(info.id, selected);

  const top = el("div", "fix-card-top");
  const checkbox = el("input") as HTMLInputElement;
  checkbox.type = "checkbox";
  checkbox.setAttribute("aria-label", `Include all ${info.name} usages`);
  top.appendChild(checkbox);

  const source = el("div", "fix-card-source");
  const nameRow = el("div", "fix-card-name-row");
  const sourceName = el("span", "var-name", info.name);
  sourceName.title = `${info.libraryName}\n${info.usageSummary}\n${Object.entries(info.values)
    .map(([mode, value]) => `${mode}: ${value}`)
    .join("\n")}`;
  nameRow.appendChild(sourceName);
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
      recommendedTargetKeys.get(info.id) ?? null,
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
        for (let index = 0; index < info.usages.length; index++) {
          selected.add(index);
        }
      }
      renderTrigger();
      syncSelectionState();
      updateApplyButton();
      },
    );
  });
  combo.appendChild(trigger);
  targetRow.appendChild(combo);
  card.appendChild(targetRow);

  const usageList = el("div", "fix-usage-list");
  usageList.hidden = !isExpanded;
  info.usages.forEach((usage, index) => {
    const layer = colorLayer(usage);
    const row = el("div", "fix-usage-row");
    const usageCheckbox = el("input") as HTMLInputElement;
    usageCheckbox.type = "checkbox";
    usageCheckbox.checked = selected.has(index);
    usageCheckbox.setAttribute(
      "aria-label",
      `Include ${usage.nodeName} in this fix`,
    );
    usageCheckbox.addEventListener("change", () => {
      if (usageCheckbox.checked) selected.add(index);
      else selected.delete(index);
      syncSelectionState();
      updateApplyButton();
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
    usageList.appendChild(row);
  });
  card.appendChild(usageList);

  function syncSelectionState(): void {
    const count = selected.size;
    checkbox.checked = count === info.usages.length && count > 0;
    checkbox.indeterminate = count > 0 && count < info.usages.length;
    if (count > 0) included.add(info.id);
    else included.delete(info.id);
    card.classList.toggle("excluded", count === 0);
    expandCount.textContent =
      count === info.usages.length ? `${count}×` : `${count}/${info.usages.length}`;
    for (let index = 0; index < usageList.children.length; index++) {
      const input = usageList.children[index].querySelector(
        'input[type="checkbox"]',
      ) as HTMLInputElement | null;
      if (input) input.checked = selected.has(index);
    }
  }

  checkbox.addEventListener("change", () => {
    selected.clear();
    if (checkbox.checked) {
      for (let index = 0; index < info.usages.length; index++) {
        selected.add(index);
      }
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
  if (showModes) {
    const panel = el("div", "mode-panel");
    panel.appendChild(el("div", "group-title", "Modes"));
    const modeRow = el("div", "row");
    modeRow.appendChild(el("span", "muted small", "Set frame mode"));
    const select = el("select", "native") as HTMLSelectElement;
    const noneOption = el("option", "", "Don't change") as HTMLOptionElement;
    noneOption.value = "-1";
    select.appendChild(noneOption);
    modeOptions().forEach((option, index) => {
      const node = el("option", "", option.label) as HTMLOptionElement;
      node.value = String(index);
      select.appendChild(node);
    });
    select.value = String(modeChoiceIndex);
    select.addEventListener("change", () => {
      modeChoiceIndex = Number(select.value);
      updateApplyButton();
    });
    modeRow.appendChild(select);
    panel.appendChild(modeRow);

    const foreignModes = audit.explicitModes;
    const clearRow = el("label", "row");
    const clearInput = el("input") as HTMLInputElement;
    clearInput.type = "checkbox";
    clearInput.checked = clearForeignModes;
    clearInput.disabled = foreignModes.length === 0;
    clearInput.addEventListener("change", () => {
      clearForeignModes = clearInput.checked;
      updateApplyButton();
    });
    clearRow.appendChild(clearInput);
    clearRow.appendChild(
      el(
        "span",
        foreignModes.length === 0 ? "muted" : "",
        `Clear foreign modes (${foreignModes.length})`,
      ),
    );
    panel.appendChild(clearRow);
    body.appendChild(panel);
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
  ];
  const groups = new Map<string, SourceInfo[]>();
  for (const info of infos) {
    const key = info.groupLabel;
    const list = groups.get(key) ?? [];
    list.push(info);
    groups.set(key, list);
  }

  const keys = groupOrder.filter((key) => groups.has(key));

  for (const key of keys) {
    const section = el("section", "warning-group fix-section");
    const groupHeader = el("div", "warning-group-header");
    const titleRow = el("div", "warning-group-title-row");
    titleRow.appendChild(el("h2", "", key));
    titleRow.appendChild(
      el("span", "warning-group-count", String(groups.get(key)?.length ?? 0)),
    );
    groupHeader.appendChild(titleRow);
    section.appendChild(groupHeader);
    const list = el("div", "fix-list warning-list");
    for (const info of groups.get(key) ?? []) {
      list.appendChild(renderFixCard(info));
    }
    section.appendChild(list);
    body.appendChild(section);
  }

  updateApplyButton();
}

// ---------------------------------------------------------------------------
// AI

function openAiModal(): void {
  const ai = settings.ai;
  ($("ai-provider") as HTMLSelectElement).value = ai?.provider ?? "anthropic";
  ($("ai-model") as HTMLInputElement).value =
    ai?.model ?? DEFAULT_AI_MODELS[ai?.provider ?? "anthropic"];
  ($("ai-key") as HTMLInputElement).value = ai?.apiKey ?? "";
  $("ai-modal").classList.add("show");
}

async function runAiSuggest(): Promise<void> {
  if (!settings.ai?.apiKey) {
    openAiModal();
    return;
  }
  if (!catalog || aiBusy) return;
  const infos = sourceInfos(fixCategory);
  const unresolved = infos.filter(
    (info) => included.has(info.id) && !proposals.get(info.id)?.targetKey,
  );
  if (unresolved.length === 0) {
    send({
      type: "notify",
      message: "Nothing unresolved — all rows already have a proposed target.",
    });
    return;
  }
  aiBusy = true;
  const button = $("ai-suggest") as HTMLButtonElement;
  button.disabled = true;
  button.textContent = "Asking AI…";
  try {
    const sources: AiSourceInput[] = unresolved.slice(0, 80).map((info) => ({
      sourceId: info.id,
      name: info.name,
      type: info.type,
      values: info.values,
      usageSummary: info.usageSummary,
    }));
    const types = new Set(sources.map((s) => s.type));
    const targets: {
      name: string;
      type: string;
      values: Record<string, string>;
    }[] = [];
    for (const type of types) {
      for (const candidate of pickTargets(type)) {
        targets.push({ name: candidate.name, type, values: candidate.values });
      }
    }
    const typeById = new Map(infos.map((info) => [info.id, info.type]));
    const suggestions = await requestAiSuggestions(settings.ai, sources, targets);
    let applied = 0;
    for (const suggestion of suggestions) {
      const current = proposals.get(suggestion.sourceId);
      if (!current || current.targetKey) continue;
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
      applied++;
    }
    send({
      type: "notify",
      message: `AI suggested ${applied} mapping(s) — review before applying.`,
    });
    renderFixPanel();
  } catch (error) {
    showBanner(`AI request failed: ${String((error as Error).message ?? error)}`);
  } finally {
    aiBusy = false;
    button.disabled = false;
    button.textContent = "AI suggest";
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

$("ai-suggest").addEventListener("click", () => {
  void runAiSuggest();
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
    },
  });
});

$("reaudit-cancel").addEventListener("click", closeReauditDialog);
$("reaudit-confirm").addEventListener("click", () => runAudit(true));
$("reaudit-modal").addEventListener("click", (event) => {
  if (event.target === $("reaudit-modal")) closeReauditDialog();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && $("reaudit-modal").classList.contains("show")) {
    closeReauditDialog();
  }
});

$("ai-settings-btn").addEventListener("click", openAiModal);
$("ai-cancel").addEventListener("click", () =>
  $("ai-modal").classList.remove("show"),
);
$("ai-clear").addEventListener("click", () => {
  send({ type: "save-ai-settings", ai: null });
  $("ai-modal").classList.remove("show");
});
$("ai-save").addEventListener("click", () => {
  const provider = ($("ai-provider") as HTMLSelectElement)
    .value as AiSettings["provider"];
  const model =
    ($("ai-model") as HTMLInputElement).value.trim() ||
    DEFAULT_AI_MODELS[provider];
  const apiKey = ($("ai-key") as HTMLInputElement).value.trim();
  send({
    type: "save-ai-settings",
    ai: apiKey ? { provider, model, apiKey } : null,
  });
  $("ai-modal").classList.remove("show");
});
($("ai-provider") as HTMLSelectElement).addEventListener("change", () => {
  const provider = ($("ai-provider") as HTMLSelectElement)
    .value as AiSettings["provider"];
  ($("ai-model") as HTMLInputElement).value = DEFAULT_AI_MODELS[provider];
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
      recommendedTargetKeys.clear();
      showPanel(null);
      renderMain();
      break;
    }
    case "proposals": {
      fixCategory = message.category;
      proposals = new Map(message.proposals.map((p) => [p.sourceId, p]));
      recommendedTargetKeys = new Map(
        message.proposals
          .filter(
            (proposal): proposal is MappingProposal & { targetKey: string } =>
              Boolean(proposal.targetKey),
          )
          .map((proposal) => [proposal.sourceId, proposal.targetKey]),
      );
      included = new Set(
        message.proposals.filter((p) => p.targetKey).map((p) => p.sourceId),
      );
      includedUsageIndexes = new Map();
      for (const info of sourceInfos(fixCategory)) {
        const proposal = proposals.get(info.id);
        includedUsageIndexes.set(
          info.id,
          new Set(
            proposal?.targetKey
              ? info.usages.map((_, index) => index)
              : [],
          ),
        );
      }
      expandedFixSources.clear();
      clearForeignModes =
        (fixCategory === "all" ||
          fixCategory === "colors" ||
          fixCategory === "modes") &&
        Boolean(audit?.explicitModes.length);
      modeChoiceIndex = -1;
      renderFixPanel();
      showPanel("fix");
      break;
    }
    case "apply-done": {
      lastReport = message.report;
      $("apply-btn").textContent = "Apply";
      ($("apply-btn") as HTMLButtonElement).disabled = false;
      break;
    }
    case "fatal": {
      showBanner(message.message);
      auditing = false;
      auditNodesScanned = 0;
      ($("apply-btn") as HTMLButtonElement).disabled = false;
      $("apply-btn").textContent = "Apply";
      renderMain();
      break;
    }
  }
};

renderMain();
send({ type: "init" });
