/**
 * CADS Audit — plugin main thread.
 * Auto-loads CADS catalog → audit selection (findings-only) → optional
 * category-scoped remap review → apply → re-audit.
 */
import type {
  AiSettings,
  ApplyRequest,
  AuditResult,
  CodeToUiMessage,
  FixCategory,
  MappingProposal,
  PluginSettings,
  UiToCodeMessage,
} from "./shared/messages";
import { EMPTY_SETTINGS } from "./shared/messages";
import { auditSelection } from "./main/audit";
import { buildCatalog, type CatalogBuildResult } from "./main/catalog";
import {
  buildStyleCatalog,
  type StyleCatalogResult,
} from "./main/styles";
import { applyMappings } from "./main/apply";
import {
  proposeForRadius,
  proposeForRawPaint,
  proposeForRawText,
  proposeForTextStyle,
  proposeForVariable,
} from "./main/matcher";
import {
  isPrimitiveColorCollection,
  isShapeCollection,
  isShapeVariable,
} from "./data/cadsCatalog";

const SETTINGS_KEY = "variable-remap.settings.v1";

figma.showUI(__html__, { width: 360, height: 560, themeColors: true });

let settings: PluginSettings = EMPTY_SETTINGS;
let catalogResult: CatalogBuildResult | null = null;
let styleCatalog: StyleCatalogResult | null = null;
let lastAudit: AuditResult | null = null;
let sotLibraryName = "";

function post(message: CodeToUiMessage): void {
  figma.ui.postMessage(message);
}

function isCadsLibrary(name: string): boolean {
  return /cads/i.test(name);
}

function postSelection(): void {
  const selection = figma.currentPage.selection;
  const count = selection.length;
  post({
    type: "selection",
    count,
    nodeIds: selection.map((node) => node.id),
    label:
      count === 0
        ? null
        : count === 1
          ? selection[0].name
          : `${count} layers`,
  });
}

figma.on("selectionchange", () => {
  postSelection();
});

async function loadSettings(): Promise<void> {
  try {
    const stored = await figma.clientStorage.getAsync(SETTINGS_KEY);
    if (stored) settings = { ...EMPTY_SETTINGS, ...(stored as PluginSettings) };
  } catch {
    settings = EMPTY_SETTINGS;
  }
}

async function saveSettings(): Promise<void> {
  try {
    await figma.clientStorage.setAsync(SETTINGS_KEY, settings);
  } catch {
    // non-fatal
  }
}

async function findCadsLibraryName(): Promise<string | null> {
  const collections =
    await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
  const names = new Set(collections.map((c) => c.libraryName));
  for (const name of names) {
    if (isCadsLibrary(name)) return name;
  }
  return null;
}

function postCombinedCatalog(): void {
  if (!catalogResult) return;
  post({
    type: "catalog",
    catalog: {
      ...catalogResult.catalog,
      textStyles: styleCatalog?.textStyles ?? [],
      textStyleSource: styleCatalog?.source ?? "none",
    },
  });
}

async function loadCadsCatalog(libraryName: string): Promise<void> {
  sotLibraryName = libraryName;
  settings.libraryName = libraryName;
  await saveSettings();

  post({
    type: "catalog-progress",
    done: 0,
    total: 0,
    label: "Loading variables",
  });

  catalogResult = await buildCatalog(libraryName, (done, total) =>
    post({
      type: "catalog-progress",
      done,
      total,
      label: "Loading variables",
    }),
  );

  post({
    type: "catalog-progress",
    done: 0,
    total: 0,
    label: "Loading text styles",
  });

  // Baked CADS text styles only — no capture / setup flow.
  styleCatalog = await buildStyleCatalog(null, (done, total) =>
    post({
      type: "catalog-progress",
      done,
      total,
      label: "Loading text styles",
    }),
  );

  postCombinedCatalog();
  postSelection();
}

async function handleAudit(): Promise<void> {
  const sotStyleKeys = new Set(
    (styleCatalog?.textStyles ?? []).map((s) => s.key),
  );
  lastAudit = await auditSelection(
    { sotLibraryName, sotStyleKeys },
    (nodesScanned) => post({ type: "audit-progress", nodesScanned }),
  );
  post({ type: "audit", result: lastAudit });
}

function handleProposeMappings(category: FixCategory = "all"): void {
  if (!catalogResult || !lastAudit) {
    throw new Error("Run the audit first.");
  }
  const allTargets = catalogResult.catalog.variables;
  const semanticTargets = allTargets.filter(
    (t) =>
      !(
        t.resolvedType === "COLOR" &&
        isPrimitiveColorCollection(t.collectionName)
      ),
  );
  const shapeTargets = (() => {
    const classified = allTargets.filter(
      (t) =>
        t.resolvedType === "FLOAT" &&
        isShapeCollection(t.collectionName) &&
        isShapeVariable(t.name),
    );
    return classified.length > 0
      ? classified
      : allTargets.filter(
          (t) => t.resolvedType === "FLOAT" && isShapeVariable(t.name),
        );
  })();
  const ctx = { targets: semanticTargets, cache: settings.mappingCache };
  const styleCtx = {
    targets: styleCatalog?.textStyles ?? [],
    cache: settings.mappingCache,
  };

  const wantColors = category === "all" || category === "colors";
  const wantType = category === "all" || category === "typography";
  const wantShape = category === "all" || category === "shape";

  const proposals: MappingProposal[] = [];
  if (wantColors) {
    for (const entry of lastAudit.entries) {
      if (entry.flag === "typographyVariable") continue;
      if (entry.resolvedType !== "COLOR") continue;
      proposals.push(proposeForVariable(entry, ctx));
    }
    for (const style of lastAudit.paintStyles) {
      proposals.push(proposeForRawPaint(style, ctx));
    }
    for (const raw of lastAudit.rawPaints) {
      proposals.push(proposeForRawPaint(raw, ctx));
    }
  }
  if (wantShape) {
    for (const entry of lastAudit.entries) {
      if (entry.flag !== "shapeVariable") continue;
      proposals.push(
        proposeForRadius(entry, shapeTargets, settings.mappingCache),
      );
    }
    for (const raw of lastAudit.rawRadii) {
      proposals.push(proposeForRadius(raw, shapeTargets, settings.mappingCache));
    }
  }
  if (wantType) {
    for (const entry of lastAudit.textStyles) {
      proposals.push(proposeForTextStyle(entry, styleCtx));
    }
    for (const raw of lastAudit.rawTexts) {
      proposals.push(proposeForRawText(raw, styleCtx));
    }
  }
  post({ type: "proposals", proposals, category });
}

async function handleApply(request: ApplyRequest): Promise<void> {
  if (!catalogResult || !lastAudit) {
    throw new Error("Run the audit first.");
  }
  const report = await applyMappings(
    request,
    lastAudit,
    catalogResult.importedByKey,
    styleCatalog?.importedByKey ?? new Map(),
  );

  const cacheKeyById = new Map<string, string>();
  for (const entry of lastAudit.entries) {
    cacheKeyById.set(entry.id, entry.variableKey || entry.id);
  }
  for (const entry of lastAudit.textStyles) {
    cacheKeyById.set(entry.id, entry.styleKey || entry.id);
  }
  for (const mapping of request.mappings) {
    const cacheKey = cacheKeyById.get(mapping.sourceId) ?? mapping.sourceId;
    settings.mappingCache[cacheKey] = mapping.targetKey;
  }
  await saveSettings();

  post({ type: "apply-done", report });
  figma.notify(
    report.failures.length === 0
      ? `Fixed ${report.usagesRebound} usages`
      : `Fixed ${report.usagesRebound} usages — ${report.failures.length} issue(s)`,
  );

  await handleAudit();
}

async function handleSaveAiSettings(ai: AiSettings | null): Promise<void> {
  settings.ai = ai;
  await saveSettings();
  post({ type: "settings", settings });
}

async function bootstrap(): Promise<void> {
  await loadSettings();
  post({ type: "settings", settings });

  const libraryName = await findCadsLibraryName();
  if (!libraryName) {
    post({
      type: "no-library",
      message:
        "Enable the CADS library in this file (Assets → Libraries), then reopen the plugin.",
    });
    postSelection();
    return;
  }

  await loadCadsCatalog(libraryName);
}

figma.ui.onmessage = async (message: UiToCodeMessage) => {
  try {
    switch (message.type) {
      case "init":
        await bootstrap();
        break;
      case "audit":
        await handleAudit();
        break;
      case "clear-selection":
        figma.currentPage.selection = [];
        postSelection();
        break;
      case "locate-layer": {
        const node = await figma.getNodeByIdAsync(message.nodeId);
        if (!node || !("visible" in node)) {
          throw new Error("That layer is no longer available.");
        }
        const sceneNode = node as SceneNode;
        figma.currentPage.selection = [sceneNode];
        figma.viewport.scrollAndZoomIntoView([sceneNode]);
        postSelection();
        break;
      }
      case "propose-mappings":
        handleProposeMappings(message.category ?? "all");
        break;
      case "apply":
        await handleApply(message.request);
        break;
      case "save-ai-settings":
        await handleSaveAiSettings(message.ai);
        break;
      case "notify":
        figma.notify(message.message, { error: message.error === true });
        break;
    }
  } catch (error) {
    post({
      type: "fatal",
      message: String((error as Error).message ?? error),
    });
  }
};
