/**
 * FontAwesome Glyphs — plugin UI.
 *
 * Catalog comes from `.otf` / `.ttf` files the user adds (setup or Settings)
 * and/or optional FA Kit API sync. Installed-font detection is used solely
 * for the “not installed in Figma” banner — never to populate the picker.
 *
 * Two pickers: FA version (family) and style within that family. An "All"
 * version (always first) unions every added font's glyphs and still exposes
 * each style (Solid, Regular, …) as a filter across those fonts. Kit families
 * are labeled "Custom Kit" in the UI (FA exports them with a hex kit id).
 */
import { parse } from "opentype.js";
import type { IconEntry } from "../data/icons";
import {
  EMPTY_SETTINGS,
  type CodeToUiMessage,
  type FaFont,
  type FaGlyphCacheBlob,
  type FaKitCatalogCache,
  type InsertTarget,
  type PluginSettings,
  type StoredFont,
  type UiToCodeMessage,
} from "../shared/messages";
import {
  FaKitApiError,
  clearFaAccessTokenCache,
  exportOfficialGlyphCache,
  faceKey,
  fetchAccountFaces,
  fetchFaceGlyphs,
  importOfficialGlyphCache,
  invalidateKitGlyphCache,
  isKitGlyphsCached,
  parseFaceKey,
  prefetchAccountKitGlyphs,
  warmFacesGlyphCache,
  type FaKitFace,
  type FaKitSummary,
} from "./faKitApi";

const MAX_RESULTS = 400;

interface Source {
  id: string;
  /** Group header in the dropdown (full family name) */
  family: string;
  style: string;
  /** Item label within the group, e.g. "Solid", "Regular · Custom" */
  itemLabel: string;
  weight: number;
  entries: IconEntry[];
  isCustom: boolean;
  /** True when this face came from Kit API sync (local files are fallback). */
  fromApi: boolean;
}

// --- elements -------------------------------------------------------------

const setupView = document.getElementById("setup-view") as HTMLDivElement;
const mainView = document.getElementById("main-view") as HTMLDivElement;
const settingsView = document.getElementById("settings-view") as HTMLDivElement;
const setupChoice = document.getElementById("setup-choice") as HTMLDivElement;
const setupApiPanel = document.getElementById("setup-api") as HTMLDivElement;
const setupAddBtn = document.getElementById("setup-add-btn") as HTMLButtonElement;
const setupApiBtn = document.getElementById("setup-api-btn") as HTMLButtonElement;
const setupApiBack = document.getElementById("setup-api-back") as HTMLButtonElement;
const setupApiTokenInput = document.getElementById(
  "setup-api-token",
) as HTMLInputElement;
const setupClearTokenBtn = document.getElementById(
  "setup-clear-token-btn",
) as HTMLButtonElement;
const setupLoadKitsBtn = document.getElementById(
  "setup-load-kits-btn",
) as HTMLButtonElement;
const setupKitPicker = document.getElementById(
  "setup-kit-picker",
) as HTMLDivElement;
const setupKitTree = document.getElementById("setup-kit-tree") as HTMLDivElement;
const setupSelectAllBtn = document.getElementById(
  "setup-select-all-btn",
) as HTMLButtonElement;
const setupApiFooter = document.getElementById(
  "setup-api-footer",
) as HTMLDivElement;
const setupSyncKitsBtn = document.getElementById(
  "setup-sync-kits-btn",
) as HTMLButtonElement;
const setupApiStatus = document.getElementById(
  "setup-api-status",
) as HTMLParagraphElement;
const setupNote = document.getElementById("setup-note") as HTMLParagraphElement;
const setupNoteWhy = document.getElementById(
  "setup-note-why",
) as HTMLButtonElement;
const setupNoteMore = document.getElementById(
  "setup-note-more",
) as HTMLSpanElement;
const footerSyncBtn = document.getElementById(
  "footer-sync-btn",
) as HTMLButtonElement;
const searchInput = document.getElementById("search") as HTMLInputElement;
const familyTrigger = document.getElementById("family-trigger") as HTMLButtonElement;
const familyLabel = document.getElementById("family-label") as HTMLSpanElement;
const familyMenu = document.getElementById("family-menu") as HTMLDivElement;
const styleTrigger = document.getElementById("style-trigger") as HTMLButtonElement;
const styleLabel = document.getElementById("style-label") as HTMLSpanElement;
const styleMenu = document.getElementById("style-menu") as HTMLDivElement;
const banner = document.getElementById("banner") as HTMLDivElement;
const grid = document.getElementById("grid") as HTMLDivElement;
const countEl = document.getElementById("count") as HTMLDivElement;
const emptyEl = document.getElementById("empty") as HTMLDivElement;
const emptyVisualEl = document.getElementById("empty-visual") as HTMLDivElement;
const emptySearchMsgEl = document.getElementById(
  "empty-search-msg",
) as HTMLDivElement;
const targetEl = document.getElementById("target") as HTMLDivElement;
const settingsBtn = document.getElementById("settings-btn") as HTMLButtonElement;
const backBtn = document.getElementById("back-btn") as HTMLButtonElement;
const addFontsBtn = document.getElementById("add-fonts-btn") as HTMLButtonElement;
const fontFilesInput = document.getElementById("font-files") as HTMLInputElement;
const fontList = document.getElementById("font-list") as HTMLUListElement;
const preferredStyleTrigger = document.getElementById(
  "preferred-style-trigger",
) as HTMLButtonElement;
const preferredStyleLabel = document.getElementById(
  "preferred-style-label",
) as HTMLSpanElement;
const preferredStyleMenu = document.getElementById(
  "preferred-style-menu",
) as HTMLDivElement;
const faApiTokenInput = document.getElementById(
  "fa-api-token",
) as HTMLInputElement;
const settingsKitTree = document.getElementById(
  "settings-kit-tree",
) as HTMLDivElement;
const settingsKitEmpty = document.getElementById(
  "settings-kit-empty",
) as HTMLParagraphElement;
const settingsKitSelectHint = document.getElementById(
  "settings-kit-select-hint",
) as HTMLParagraphElement;
const kitClearTokenBtn = document.getElementById(
  "kit-clear-token-btn",
) as HTMLButtonElement;
const kitSectionSyncBtn = document.getElementById(
  "kit-section-sync-btn",
) as HTMLButtonElement;

// --- state ----------------------------------------------------------------

let settings: PluginSettings = { ...EMPTY_SETTINGS };
let installedFaFonts: FaFont[] = [];
let sources: Source[] = [];
let activeFamily = "";
let activeSource: Source | null = null;
let target: InsertTarget = { kind: "create" };
/** Settings open (overrides setup / main). */
let settingsOpen = false;
/**
 * Kit token order frozen for the current Settings visit. Reordering (selected
 * first, oldest-added, …) only applies when leaving and re-entering Settings —
 * never mid-selection.
 */
let settingsKitDisplayOrder: string[] | null = null;
/** Once the user picks a family/style this session, don't re-apply preferred. */
let userPickedSource = false;
/** Kits loaded from the FA API (session cache). */
let loadedKits: FaKitSummary[] = [];
/** All importable faces across the account (session cache). */
let accountFaces: FaKitFace[] = [];
/** Setup: expanded kit tokens in the accordion tree. */
let setupExpandedKits = new Set<string>();
/** Settings: expanded kit tokens in the accordion tree (user-toggled only). */
let settingsExpandedKits = new Set<string>();
/** Setup: checked face keys (`kit|family|style`) across any kits. */
let setupCheckedFaceKeys = new Set<string>();
/** Setup: Select all was clicked — button shows Clear all until selection changes. */
let setupSelectAllActive = false;
/** Faces queued for background import (checkbox stays checked optimistically). */
const importQueue = new Map<string, FaKitFace>();
/** Faces currently downloading (also shown as selected). */
const inflightFaceKeys = new Set<string>();
/**
 * Faces the user unchecked (or auth cleared) while a batch was already in flight.
 * `drainImportQueue` snaps the queue into a batch before await — without this set,
 * uncheck only cleared the UI and the finished import still wrote every style.
 */
const cancelledFaceKeys = new Set<string>();
/**
 * Kit tokens in the order the user first selected a style this session.
 * Used to rank selected-but-not-yet-persisted kits (oldest selection first).
 */
const kitSelectOrder: string[] = [];
/**
 * Bumped on token clear / hard reset. In-flight importFaces / drain / setup sync
 * must discard results when the epoch no longer matches (prevents zombie persists
 * after clear → re-auth → select fewer styles).
 */
let importEpoch = 0;
let drainingImportQueue = false;
let prefetchGeneration = 0;
let prefetchRunning = false;
/** True while footer/settings sync buttons are locked. */
let syncButtonsBusy = false;
/** True while setup “Load selected kits/styles” is importing. */
let setupSyncBusy = false;
const SETUP_SYNC_LABEL = "Load selected kits/styles";
const LOAD_KITS_LABEL = "Load kits";
const SYNC_SPINNER_SVG =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M23 4v6h-6" /><path d="M1 20v-6h6" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>';
/** Catalog/glyph blobs may arrive before settings on init — apply once token is known. */
let pendingKitCatalog: FaKitCatalogCache | null | undefined;
let pendingGlyphCache: FaGlyphCacheBlob | null | undefined;

function hasImportedApiFaces(): boolean {
  return importedApiFaceIds().size > 0;
}

/**
 * Settings API row: “Load kits” until the account catalog is in memory, then
 * the sync icon (even when nothing is selected yet). Busy/loading always uses
 * the 26px sync chrome so the control doesn’t stay Load-kits-wide.
 */
function updateKitSectionSyncButton() {
  const hasToken = Boolean(faApiTokenInput.value.trim());
  const loadMode = accountFaces.length === 0;

  if (loadMode && !syncButtonsBusy) {
    kitSectionSyncBtn.classList.remove("kit-section-sync", "syncing");
    kitSectionSyncBtn.classList.add("primary-btn");
    kitSectionSyncBtn.removeAttribute("aria-busy");
    kitSectionSyncBtn.textContent = LOAD_KITS_LABEL;
    kitSectionSyncBtn.title = LOAD_KITS_LABEL;
    kitSectionSyncBtn.setAttribute("aria-label", LOAD_KITS_LABEL);
    kitSectionSyncBtn.disabled = !hasToken;
    return;
  }

  kitSectionSyncBtn.classList.remove("primary-btn");
  kitSectionSyncBtn.classList.add("kit-section-sync");
  kitSectionSyncBtn.innerHTML = SYNC_SPINNER_SVG;
  kitSectionSyncBtn.classList.toggle("syncing", syncButtonsBusy);
  kitSectionSyncBtn.disabled = syncButtonsBusy || (loadMode && !hasToken);
  if (loadMode && syncButtonsBusy) {
    kitSectionSyncBtn.title = "Loading kits";
    kitSectionSyncBtn.setAttribute("aria-label", "Loading kits");
    kitSectionSyncBtn.setAttribute("aria-busy", "true");
    return;
  }
  kitSectionSyncBtn.title = "Sync selected kits";
  kitSectionSyncBtn.setAttribute("aria-label", "Sync selected kits");
  if (syncButtonsBusy) {
    kitSectionSyncBtn.setAttribute("aria-busy", "true");
  } else {
    kitSectionSyncBtn.removeAttribute("aria-busy");
  }
}

function setSyncButtonsBusy(busy: boolean) {
  syncButtonsBusy = busy;
  footerSyncBtn.classList.toggle("syncing", busy);
  footerSyncBtn.disabled = busy;
  updateKitSectionSyncButton();
}

async function mapPool<T>(
  items: T[],
  concurrency: number,
  worker: (item: T, index: number) => Promise<void>,
): Promise<void> {
  if (items.length === 0) return;
  let next = 0;
  const limit = Math.max(1, Math.min(concurrency, items.length));
  const runners = Array.from({ length: limit }, async () => {
    while (next < items.length) {
      const index = next;
      next += 1;
      await worker(items[index]!, index);
    }
  });
  await Promise.all(runners);
}

function send(message: UiToCodeMessage) {
  parent.postMessage({ pluginMessage: message }, "*");
}

// --- source building --------------------------------------------------------

function weightForStyle(style: string): number {
  const s = style.toLowerCase();
  if (/solid|black|heavy|bold/.test(s)) return 900;
  if (/semibold/.test(s)) return 600;
  if (/medium/.test(s)) return 500;
  if (/light/.test(s)) return /extra|ultra/.test(s) ? 200 : 300;
  if (/thin/.test(s)) return 100;
  return 400;
}

const ALL_FAMILY = "__all__";

/** Only fonts whose family name contains "Kit" are treated as custom-icon sources. */
function isKitFamily(family: string): boolean {
  return /\bkit\b/i.test(family);
}

/** "Font Awesome 7 Pro" → "7 Pro"; kit ids → "Custom Kit". */
function displayFamily(family: string, familyList: string[] = families()): string {
  if (family === ALL_FAMILY) return "All";
  if (isKitFamily(family)) {
    const kits = familyList.filter(isKitFamily);
    if (kits.length <= 1) return "Custom Kit";
    const id = family.match(/kit\s+([a-f0-9]+)/i)?.[1];
    return id ? `Custom Kit (${id.slice(0, 6)})` : "Custom Kit";
  }
  const short = family.replace(/^font awesome\s*/i, "").trim();
  return short || family;
}

function entriesFromGlyphs(glyphs: Record<string, string>): IconEntry[] {
  const entries: IconEntry[] = [];
  for (const [name, codepoint] of Object.entries(glyphs)) {
    if (name.length <= 1) continue; // single letters/digits are font plumbing
    if (name.startsWith(".u") || name.startsWith(".")) continue; // liga scaffolding
    entries.push({ name, codepoint, aliases: [] });
  }
  entries.sort((a, b) => a.name.localeCompare(b.name));
  return entries;
}

function faceIdentityKey(family: string, style: string): string {
  return `${family.toLowerCase()}|${style.toLowerCase()}`;
}

/**
 * Build picker sources. When API-synced faces and local files overlap, API
 * wins for the face (and for each shortcode); local only fills gaps.
 */
function sourcesFromStoredFonts(fonts: StoredFont[]): Source[] {
  type FaceMerge = {
    family: string;
    style: string;
    glyphs: Record<string, string>;
    fromApi: boolean;
  };
  const byFace = new Map<string, FaceMerge>();

  const upsert = (font: StoredFont, fromApi: boolean) => {
    const key = faceIdentityKey(font.family, font.style);
    const existing = byFace.get(key);
    if (!existing) {
      byFace.set(key, {
        family: font.family,
        style: font.style,
        glyphs: { ...font.glyphs },
        fromApi,
      });
      return;
    }
    if (fromApi && !existing.fromApi) {
      // API face replaces a local-only face; keep local-only shortcodes.
      const glyphs = { ...font.glyphs };
      for (const [name, code] of Object.entries(existing.glyphs)) {
        if (!(name in glyphs)) glyphs[name] = code;
      }
      byFace.set(key, {
        family: font.family,
        style: font.style,
        glyphs,
        fromApi: true,
      });
      return;
    }
    if (!fromApi && existing.fromApi) {
      // Local fallback — only add shortcodes the API face doesn't have.
      for (const [name, code] of Object.entries(font.glyphs)) {
        if (!(name in existing.glyphs)) existing.glyphs[name] = code;
      }
      return;
    }
    // Same provenance: last write wins per shortcode (refresh / re-add).
    Object.assign(existing.glyphs, font.glyphs);
  };

  // API first so insertion order favors synced faces, then local fallbacks.
  for (const font of fonts) {
    if (!isLocalFileFont(font)) upsert(font, true);
  }
  for (const font of fonts) {
    if (isLocalFileFont(font)) upsert(font, false);
  }

  const built: Source[] = [];
  for (const face of byFace.values()) {
    const entries = entriesFromGlyphs(face.glyphs);
    if (entries.length === 0) continue;
    built.push({
      family: face.family,
      style: face.style,
      weight: weightForStyle(face.style),
      id: `${face.family}/${face.style}`,
      itemLabel: face.style,
      entries,
      isCustom: isKitFamily(face.family),
      fromApi: face.fromApi,
    });
  }
  sortSources(built);
  return built;
}

function sortSources(list: Source[]) {
  list.sort((a, b) => {
    if (a.family === ALL_FAMILY) return -1;
    if (b.family === ALL_FAMILY) return 1;
    const aKit = isKitFamily(a.family) ? 1 : 0;
    const bKit = isKitFamily(b.family) ? 1 : 0;
    if (aKit !== bKit) return aKit - bKit; // kit after stock
    const aBrands = /brands/i.test(a.family) ? 1 : 0;
    const bBrands = /brands/i.test(b.family) ? 1 : 0;
    if (aBrands !== bBrands) return aBrands - bBrands;
    // Synced faces before local-file fallbacks within the same tier.
    if (a.fromApi !== b.fromApi) return a.fromApi ? -1 : 1;
    if (a.family !== b.family) return a.family.localeCompare(b.family);
    if (a.isCustom !== b.isCustom) return a.isCustom ? 1 : -1;
    return b.weight - a.weight;
  });
}

/** Stable API-before-local ordering for All-view merges (first shortcode wins). */
function preferApiSources(list: Source[]): Source[] {
  return [...list].sort((a, b) => Number(b.fromApi) - Number(a.fromApi));
}

/**
 * Stamp the originating face onto an entry so All-family browsing can still
 * preview and insert with a real desktop font.
 */
function stampEntryFace(entry: IconEntry, source: Source): IconEntry {
  return {
    ...entry,
    fontFamily: source.family,
    fontStyle: source.style,
    fontWeight: source.weight,
  };
}

/**
 * Build the All catalog (style = All).
 *
 * For shortcodes that exist in multiple stock faces (Solid/Regular/…), prefer
 * the user's default style, then fall back to other stock faces (heavier
 * first). Families that don't offer that style — Custom Kit, Brands, a
 * Solid-only pack, etc. — still contribute every glyph; they just don't
 * override a stock match on the same shortcode.
 */
function buildAllSource(parts: Source[]): Source {
  const preferred = (settings.preferredStyle || EMPTY_SETTINGS.preferredStyle).trim();
  const byName = new Map<string, { entry: IconEntry; priority: number }>();

  const take = (source: Source, priority: number) => {
    for (const entry of source.entries) {
      const prev = byName.get(entry.name);
      if (prev && prev.priority <= priority) continue;
      byName.set(entry.name, {
        priority,
        entry: stampEntryFace(entry, source),
      });
    }
  };

  // Within each tier, synced faces beat local-file fallbacks (first wins).
  const stock = preferApiSources(
    parts.filter(
      (source) => !isKitFamily(source.family) && !/brands/i.test(source.family),
    ),
  );
  const brands = preferApiSources(
    parts.filter((source) => /brands/i.test(source.family)),
  );
  const kits = preferApiSources(
    parts.filter((source) => isKitFamily(source.family)),
  );

  const preferSpecific = Boolean(preferred) && preferred.toLowerCase() !== "all";

  // 1) Preferred stock face (e.g. all Regular Pro glyphs)
  if (preferSpecific) {
    for (const source of stock) {
      if (styleMatchesPreferred(source.style, preferred)) take(source, 0);
    }
  }

  // 2) Other stock faces — fills icons that family doesn't offer in the
  //    preferred style (and the whole stock set when preferred is All)
  for (const source of stock) {
    if (preferSpecific && styleMatchesPreferred(source.style, preferred)) continue;
    take(source, 10 + (1000 - source.weight));
  }

  // 3) Brands + Kit last so they never hide a stock glyph, but every
  //    kit-only / brand-only shortcode still lands in All.
  for (const source of brands) take(source, 1000);
  for (const source of kits) take(source, 2000);

  const entries = Array.from(byName.values())
    .map(({ entry }) => entry)
    .sort((a, b) => a.name.localeCompare(b.name));
  return {
    id: "all",
    family: ALL_FAMILY,
    style: "All",
    itemLabel: "All",
    weight: 900,
    entries,
    isCustom: false,
    fromApi: parts.some((source) => source.fromApi),
  };
}

/**
 * Union every added face that shares `styleName` (e.g. all Solid fonts) so the
 * All family can still filter by style without locking the style picker.
 */
function buildAllStyleSource(parts: Source[], styleName: string): Source {
  const matching = parts.filter((source) =>
    styleMatchesPreferred(source.style, styleName),
  );
  // Stock first, then brands, then kits; API before local — first shortcode wins.
  const ordered = [...matching].sort((a, b) => {
    const aKit = isKitFamily(a.family) ? 1 : 0;
    const bKit = isKitFamily(b.family) ? 1 : 0;
    if (aKit !== bKit) return aKit - bKit;
    const aBrands = /brands/i.test(a.family) ? 1 : 0;
    const bBrands = /brands/i.test(b.family) ? 1 : 0;
    if (aBrands !== bBrands) return aBrands - bBrands;
    if (a.fromApi !== b.fromApi) return a.fromApi ? -1 : 1;
    return a.family.localeCompare(b.family);
  });

  const byName = new Map<string, IconEntry>();
  for (const source of ordered) {
    for (const entry of source.entries) {
      if (byName.has(entry.name)) continue;
      byName.set(entry.name, stampEntryFace(entry, source));
    }
  }

  const entries = Array.from(byName.values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
  return {
    id: `${ALL_FAMILY}/${styleName}`,
    family: ALL_FAMILY,
    style: styleName,
    itemLabel: styleName,
    weight: weightForStyle(styleName),
    entries,
    isCustom: false,
    fromApi: matching.some((source) => source.fromApi),
  };
}

/** All-family sources: the merged "All" style, then each unique face style. */
function buildAllFamilySources(parts: Source[]): Source[] {
  const styleNames = new Map<string, number>();
  for (const part of parts) {
    if (!part.style) continue;
    const weight = weightForStyle(part.style);
    const prev = styleNames.get(part.style);
    if (prev == null || weight > prev) styleNames.set(part.style, weight);
  }
  const styleSources = Array.from(styleNames.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([name]) => buildAllStyleSource(parts, name));
  return [buildAllSource(parts), ...styleSources];
}

function families(): string[] {
  const seen = new Set<string>();
  const list: string[] = [];
  for (const source of sources) {
    if (!seen.has(source.family)) {
      seen.add(source.family);
      list.push(source.family);
    }
  }
  // All first; kit last among the rest
  list.sort((a, b) => {
    if (a === ALL_FAMILY) return -1;
    if (b === ALL_FAMILY) return 1;
    const aKit = isKitFamily(a) ? 1 : 0;
    const bKit = isKitFamily(b) ? 1 : 0;
    if (aKit !== bKit) return aKit - bKit;
    const aBrands = /brands/i.test(a) ? 1 : 0;
    const bBrands = /brands/i.test(b) ? 1 : 0;
    if (aBrands !== bBrands) return aBrands - bBrands;
    return a.localeCompare(b);
  });
  return list;
}

function stylesForFamily(family: string): Source[] {
  return sources.filter((source) => source.family === family);
}

/** Unique face style names from added fonts (Solid, Regular, …), sorted by weight. */
function availableStyleNames(): string[] {
  const byName = new Map<string, number>();
  for (const font of settings.fonts) {
    if (!font.style) continue;
    const weight = weightForStyle(font.style);
    const prev = byName.get(font.style);
    if (prev == null || weight > prev) byName.set(font.style, weight);
  }
  return Array.from(byName.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([name]) => name);
}

function styleMatchesPreferred(style: string, preferred: string): boolean {
  return style.toLowerCase() === preferred.toLowerCase();
}

/**
 * On open, land on All so Kit / Brands / other single-face packs stay in
 * view. Within All, honor the preferred style when it isn't "All". The
 * preferred style also shapes the All merge and which face is selected when
 * the user later picks a specific version family.
 */
function pickPreferredSource(familyList: string[]): {
  family: string;
  source: Source | null;
} {
  const preferred = (settings.preferredStyle || EMPTY_SETTINGS.preferredStyle).trim();
  if (familyList.includes(ALL_FAMILY)) {
    const styleList = stylesForFamily(ALL_FAMILY);
    const preferredInAll =
      preferred && preferred.toLowerCase() !== "all"
        ? styleList.find((source) => styleMatchesPreferred(source.style, preferred))
        : null;
    return {
      family: ALL_FAMILY,
      source: preferredInAll ?? styleList[0] ?? null,
    };
  }
  const fallbackFamily = familyList[0] ?? "";
  const fallbackSource = stylesForFamily(fallbackFamily)[0] ?? null;
  if (!preferred || preferred.toLowerCase() === "all") {
    return { family: fallbackFamily, source: fallbackSource };
  }
  const match = sources.find(
    (source) =>
      source.family !== ALL_FAMILY &&
      !isKitFamily(source.family) &&
      !/brands/i.test(source.family) &&
      styleMatchesPreferred(source.style, preferred),
  );
  if (match) return { family: match.family, source: match };
  return { family: fallbackFamily, source: fallbackSource };
}

function rebuildSources() {
  const previousId = activeSource?.id;
  const previousFamily = activeFamily;
  const previousStyleLabel = activeSource?.itemLabel;
  const parts =
    settings.fonts.length > 0 ? sourcesFromStoredFonts(settings.fonts) : [];

  sources = parts.length > 0 ? [...buildAllFamilySources(parts), ...parts] : [];

  const familyList = families();

  if (userPickedSource && familyList.includes(previousFamily)) {
    activeFamily = previousFamily;
    const styleList = stylesForFamily(activeFamily);
    activeSource =
      styleList.find((source) => source.id === previousId) ??
      styleList.find((source) => source.itemLabel === previousStyleLabel) ??
      styleList.find((source) =>
        styleMatchesPreferred(
          source.style,
          settings.preferredStyle || EMPTY_SETTINGS.preferredStyle,
        ),
      ) ??
      styleList[0] ??
      null;
  } else {
    const picked = pickPreferredSource(familyList);
    activeFamily = picked.family;
    activeSource = picked.source;
  }

  renderPreferredStyleSelect();
  renderPickers();
  renderBanner();
  renderGrid();
  renderTarget();
  updateShell();
}

// --- version + style dropdowns -----------------------------------------------

function setMenuOpen(
  menu: HTMLDivElement,
  trigger: HTMLButtonElement,
  open: boolean,
) {
  menu.hidden = !open;
  trigger.setAttribute("aria-expanded", String(open));
}

/** `HTMLElement.hidden` is `boolean | "until-found"` under newer DOM libs (TS 6+). */
function isHidden(el: HTMLElement): boolean {
  return Boolean(el.hidden);
}

function closeAllMenus() {
  setMenuOpen(familyMenu, familyTrigger, false);
  setMenuOpen(styleMenu, styleTrigger, false);
  setMenuOpen(preferredStyleMenu, preferredStyleTrigger, false);
}

function fillMenu(
  menu: HTMLDivElement,
  items: { id: string; label: string; count?: number; selected: boolean; onSelect: () => void }[],
) {
  menu.textContent = "";
  // Gap/flex live on an inner list so .dd-menu can stay display-free and
  // honor [hidden] (author `display: flex` on the menu would keep it open).
  const list = document.createElement("div");
  list.className = "dd-list";
  for (const item of items) {
    const button = document.createElement("button");
    button.className = "dd-item";
    button.setAttribute("role", "option");
    button.setAttribute("aria-selected", String(item.selected));
    const label = document.createElement("span");
    label.textContent = item.label;
    button.appendChild(label);
    if (item.count != null) {
      const count = document.createElement("span");
      count.className = "dd-count";
      count.textContent = String(item.count);
      button.appendChild(count);
    }
    button.addEventListener("click", item.onSelect);
    list.appendChild(button);
  }
  menu.appendChild(list);
}

/** Footer sync only when API styles are imported (not local-files-only). */
function updateFooterSyncVisibility() {
  footerSyncBtn.hidden = !hasImportedApiFaces();
}

function setPickerControlsEnabled(enabled: boolean) {
  searchInput.disabled = !enabled;
  familyTrigger.disabled = !enabled;
  styleTrigger.disabled = !enabled;
  updateFooterSyncVisibility();
  if (!enabled) closeAllMenus();
}

function renderPickers() {
  const familyList = families();
  const hasCatalog = settings.fonts.length > 0;
  setPickerControlsEnabled(hasCatalog);
  familyLabel.textContent = activeFamily ? displayFamily(activeFamily, familyList) : "—";
  familyLabel.title =
    activeFamily === ALL_FAMILY
      ? "All added fonts"
      : activeFamily || "";
  styleLabel.textContent = activeSource?.itemLabel ?? "—";

  fillMenu(
    familyMenu,
    familyList.map((family) => ({
      id: family,
      label: displayFamily(family, familyList),
      selected: family === activeFamily,
      onSelect: () => {
        userPickedSource = true;
        activeFamily = family;
        const styleList = stylesForFamily(family);
        const preferred = settings.preferredStyle || EMPTY_SETTINGS.preferredStyle;
        // Keep the same style name when switching versions; else preferred; else first.
        activeSource =
          styleList.find((source) => source.itemLabel === activeSource?.itemLabel) ??
          styleList.find((source) => styleMatchesPreferred(source.style, preferred)) ??
          styleList[0] ??
          null;
        closeAllMenus();
        renderPickers();
        renderBanner();
        renderGrid();
      },
    })),
  );

  fillMenu(
    styleMenu,
    stylesForFamily(activeFamily).map((source) => ({
      id: source.id,
      label: source.itemLabel,
      count: source.entries.length,
      selected: source === activeSource,
      onSelect: () => {
        userPickedSource = true;
        activeSource = source;
        closeAllMenus();
        renderPickers();
        renderBanner();
        renderGrid();
      },
    })),
  );
}

function preferredStyleOptions(): string[] {
  const styles = availableStyleNames();
  const current = settings.preferredStyle || EMPTY_SETTINGS.preferredStyle;
  const options = ["All", ...styles];
  // Keep a saved preference even if that face was temporarily removed.
  if (current && !options.some((name) => styleMatchesPreferred(name, current))) {
    options.push(current);
  }
  return options;
}

function applyPreferredStyle(name: string) {
  settings.preferredStyle = name || EMPTY_SETTINGS.preferredStyle;
  userPickedSource = false;
  persistSettings();
  rebuildSources();
}

function renderPreferredStyleSelect() {
  const current = settings.preferredStyle || EMPTY_SETTINGS.preferredStyle;
  const options = preferredStyleOptions();
  const selected =
    options.find((name) => styleMatchesPreferred(name, current)) ?? options[0] ?? "All";
  // No imported faces (token cleared, or token with zero kits selected).
  const enabled = settings.fonts.length > 0;
  preferredStyleTrigger.disabled = !enabled;
  preferredStyleLabel.textContent = enabled ? selected : "—";
  if (!enabled) {
    setMenuOpen(preferredStyleMenu, preferredStyleTrigger, false);
    preferredStyleMenu.textContent = "";
    return;
  }
  fillMenu(
    preferredStyleMenu,
    options.map((name) => ({
      id: name,
      label: name,
      selected: styleMatchesPreferred(name, selected),
      onSelect: () => {
        closeAllMenus();
        applyPreferredStyle(name);
      },
    })),
  );
}

// --- main view rendering -----------------------------------------------------

function matches(entry: IconEntry, tokens: string[]): boolean {
  if (tokens.length === 0) return true;
  const haystack = [entry.name, ...entry.aliases].join(" ");
  return tokens.every((token) => haystack.includes(token));
}

function renderGrid() {
  const tokens = searchInput.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const all = activeSource?.entries ?? [];
  const results: IconEntry[] = [];
  for (const entry of all) {
    if (matches(entry, tokens)) {
      results.push(entry);
      if (results.length > MAX_RESULTS) break;
    }
  }

  const truncated = results.length > MAX_RESULTS;
  const shown = truncated ? results.slice(0, MAX_RESULTS) : results;

  grid.textContent = "";
  const fragment = document.createDocumentFragment();
  for (const entry of shown) {
    const button = document.createElement("button");
    button.className = "icon-btn";
    button.title = entry.name;
    button.addEventListener("click", () => insert(entry));

    const glyph = document.createElement("span");
    glyph.className = "glyph";
    // Prefer the entry's own face (set when browsing All); never fall back to
    // the synthetic All family name — that would drop Kit/Brands previews.
    const family =
      entry.fontFamily && entry.fontFamily !== ALL_FAMILY
        ? entry.fontFamily
        : activeSource && activeSource.family !== ALL_FAMILY
          ? activeSource.family
          : undefined;
    const weight =
      entry.fontWeight ??
      (activeSource && activeSource.family !== ALL_FAMILY
        ? activeSource.weight
        : undefined);
    if (family) {
      glyph.style.fontFamily = `"${family}"`;
    }
    if (weight != null) {
      glyph.style.fontWeight = String(weight);
    }
    glyph.textContent = String.fromCodePoint(parseInt(entry.codepoint, 16));
    button.appendChild(glyph);
    fragment.appendChild(button);
  }
  grid.appendChild(fragment);

  if (shown.length > 0) {
    emptyEl.hidden = true;
    emptyVisualEl.hidden = true;
    emptySearchMsgEl.hidden = true;
  } else if (settings.fonts.length === 0) {
    // Catalog empty — centered visual; footer still carries the settings hint.
    emptyEl.hidden = false;
    emptyVisualEl.hidden = false;
    emptySearchMsgEl.hidden = true;
  } else {
    emptyEl.hidden = false;
    emptyVisualEl.hidden = true;
    emptySearchMsgEl.hidden = false;
  }
  countEl.textContent = truncated
    ? `Showing first ${MAX_RESULTS} — refine your search`
    : shown.length > 0
      ? `${shown.length} icon${shown.length === 1 ? "" : "s"}`
      : "";
}

function insert(entry: IconEntry) {
  if (!activeSource) return;
  const family = entry.fontFamily ?? activeSource.family;
  const style = entry.fontStyle ?? activeSource.style;
  if (family === ALL_FAMILY) return;
  send({
    type: "insert",
    name: entry.name,
    fontName: { family, style },
  });
}

function renderTarget() {
  // Empty catalog: footer carries the empty-state copy; sync stays hidden.
  if (settings.fonts.length === 0) {
    targetEl.hidden = false;
    updateFooterSyncVisibility();
    targetEl.textContent = "No kits imported, add in settings.";
    return;
  }
  targetEl.hidden = false;
  updateFooterSyncVisibility();
  if (target.kind === "instance") {
    if (target.textProps.length === 0) {
      targetEl.innerHTML = `Selected instance <strong></strong> has no text props — select a text layer inside it instead.`;
      targetEl.querySelector("strong")!.textContent = target.nodeName;
      return;
    }
    // Instance with no layer picked: fill the first TEXT prop. Select the icon
    // text layer itself to target a specific prop (start vs end icon, etc.).
    const prop = target.textProps[0]!;
    targetEl.textContent = "";
    targetEl.append("Sets ");
    const propLabel = document.createElement("strong");
    propLabel.textContent = prop.label;
    targetEl.append(propLabel, ` on ${target.nodeName}`);
    return;
  }
  if (target.kind === "text") {
    if (target.count && target.count > 1) {
      targetEl.innerHTML = `Replaces text in <strong></strong> layers`;
      targetEl.querySelector("strong")!.textContent = String(target.count);
      return;
    }
    targetEl.innerHTML = `Replaces text in <strong></strong>`;
    targetEl.querySelector("strong")!.textContent =
      target.propName ?? target.nodeName;
    return;
  }
  targetEl.textContent =
    "Insert an icon or select a text layer to replace.";
}

function renderBanner() {
  const source = activeSource;
  if (!source || source.family === ALL_FAMILY) {
    banner.classList.remove("visible");
    return;
  }
  const installed = installedFaFonts.some(
    (font) => font.family === source.family && font.styles.includes(source.style),
  );
  if (!installed) {
    banner.textContent = `"${source.family} ${source.style}" isn't installed in Figma — inserted shortcodes will show as plain text until it is.`;
    banner.classList.add("visible");
  } else {
    banner.classList.remove("visible");
  }
}

// --- views -------------------------------------------------------------------

function updateShell() {
  const hasFonts = settings.fonts.length > 0;
  const hasApiToken = Boolean(settings.faApiToken?.trim());
  // Setup is first-run / post-token-clear only. Keeping a token with zero
  // styles selected should land on the empty picker, not the setup screen.
  const showSetup = !hasFonts && !hasApiToken;
  if (settingsOpen) {
    setupView.hidden = true;
    mainView.hidden = true;
    settingsView.hidden = false;
    return;
  }
  setupView.hidden = !showSetup;
  mainView.hidden = showSetup;
  settingsView.hidden = true;
  if (!showSetup && hasFonts && !searchInput.disabled) searchInput.focus();
}

function showSettings(show: boolean) {
  settingsOpen = show;
  if (show) {
    captureSettingsKitDisplayOrder();
    renderPreferredStyleSelect();
    renderFontList();
    renderKitSettings();
  } else {
    settingsKitDisplayOrder = null;
  }
  updateShell();
}

/** Persist settings silently — actions save themselves; no toast. */
function persistSettings() {
  syncTokenIntoSettings();
  send({ type: "save-settings", settings });
}

function notify(message: string, error = false) {
  send({ type: "notify", message, error });
}

function syncTokenIntoSettings() {
  const token =
    faApiTokenInput.value.trim() || setupApiTokenInput.value.trim();
  if (token) settings.faApiToken = token;
  else if (!faApiTokenInput.value && settingsOpen) delete settings.faApiToken;
}

/** Keep only disk-imported fonts; drop API-synced faces from the catalog. */
function retainLocalFileFontsOnly(): boolean {
  const localOnly = settings.fonts.filter(isLocalFileFont);
  if (localOnly.length === settings.fonts.length) return false;
  settings.fonts = localOnly;
  delete settings.kitToken;
  delete settings.kitSyncedAt;
  return true;
}

/** Abort every in-flight import/prefetch and bump epochs so completions are no-ops. */
function abortAllApiImports() {
  importEpoch += 1;
  importQueue.clear();
  inflightFaceKeys.clear();
  cancelledFaceKeys.clear();
  kitSelectOrder.length = 0;
  // While Settings stays open, keep a freeze marker (`[]` = re-freeze when the
  // catalog returns). Nulling here made every post-token-paste render use live
  // selected-first sorting and jump kits as soon as one was checked.
  settingsKitDisplayOrder = settingsOpen ? [] : null;
  prefetchGeneration += 1;
  prefetchRunning = false;
  invalidateKitGlyphCache();
  clearFaAccessTokenCache();
}

/** Drop API auth + kit caches. Keep local .otf/.ttf fonts as the picker fallback. */
function clearApiAuthAndSyncedFonts() {
  // Epoch first — any await that resumes after this must not persist.
  abortAllApiImports();
  faApiTokenInput.value = "";
  setupApiTokenInput.value = "";
  loadedKits = [];
  accountFaces = [];
  setupExpandedKits.clear();
  settingsExpandedKits.clear();
  setupCheckedFaceKeys.clear();
  setupSelectAllActive = false;
  pendingKitCatalog = null;
  pendingGlyphCache = null;
  delete settings.faApiToken;
  retainLocalFileFontsOnly();
  send({ type: "save-kit-catalog", catalog: null });
  send({ type: "save-glyph-cache", cache: null });
  persistSettings();
  updateTokenClearVisibility();
  updateSetupLoadKitsEnabled();
  updateSetupSyncButton();
  updateSetupSelectAllButton();
  setSetupApiStatus("");
  renderFontList();
  renderKitSettings();
  rebuildSources();
  updateShell();
  setupKitPicker.hidden = true;
  setupKitTree.textContent = "";
  setupApiFooter.hidden = true;
  updateSetupNoteVisibility();
}

function faceStillWanted(face: FaKitFace, epoch: number): boolean {
  if (epoch !== importEpoch) return false;
  if (!settings.faApiToken) return false;
  const id = faceKey(face.kitToken, face.family, face.style);
  return !cancelledFaceKeys.has(id);
}

function apiErrorMessage(error: unknown): string {
  if (error instanceof FaKitApiError) return error.message;
  if (error instanceof Error) return error.message;
  return String(error);
}

function guessKitTokenFromInstall(): string | undefined {
  for (const font of installedFaFonts) {
    if (!isKitFamily(font.family)) continue;
    const id = kitIdFromFamily(font.family);
    if (id) return id;
  }
  return undefined;
}

function titleCaseStyle(value: string): string {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function majorFaVersion(version: string): number {
  const match = version.match(/(\d+)/);
  return match ? Number(match[1]) : 7;
}

/**
 * Resolve the account-face id for a stored font.
 *
 * Prefer explicit api* fields (current writes). Fall back to fileName shapes
 * from earlier API sync (`api:kit:TOKEN`, `api:TOKEN:family:style`) and to the
 * kit id embedded in desktop family names so older imports still check in the
 * settings dropdown.
 */
function apiFaceIdFromStored(font: StoredFont): string | null {
  if (font.apiKitToken && font.apiFamily && font.apiStyle) {
    return faceKey(font.apiKitToken, font.apiFamily, font.apiStyle);
  }

  const fileName = font.fileName?.trim() ?? "";
  // Current: api:<kitToken>:<family>:<style>
  const modern = fileName.match(/^api:([^:]+):([^:]+):([^:]+)$/i);
  if (modern) {
    const [, kitToken, family, style] = modern;
    if (kitToken && family && style) return faceKey(kitToken, family, style);
  }
  // Legacy custom-only sync: api:kit:<token> / api:kit-duotone:<token>
  const legacy = fileName.match(/^api:(kit|kit-duotone):(.+)$/i);
  if (legacy) {
    const [, family, kitToken] = legacy;
    if (family && kitToken) return faceKey(kitToken, family, "custom");
  }

  if (font.source === "api" || fileName.startsWith("api:")) {
    const kitToken = kitIdFromFamily(font.family);
    if (kitToken) {
      const family = /duotone/i.test(font.family) ? "kit-duotone" : "kit";
      return faceKey(kitToken, family, "custom");
    }
  }

  return null;
}

/** Backfill api* metadata so checklist matching / refresh stay reliable. */
function normalizeApiFontMetadata(fonts: StoredFont[]): {
  fonts: StoredFont[];
  changed: boolean;
} {
  let changed = false;
  const next = fonts.map((font) => {
    const id = apiFaceIdFromStored(font);
    if (!id) return font;
    const parsed = parseFaceKey(id);
    if (!parsed) return font;
    const needsMeta =
      font.source !== "api" ||
      font.apiKitToken !== parsed.kitToken ||
      font.apiFamily !== parsed.family ||
      font.apiStyle !== parsed.style ||
      !font.fileName?.startsWith("api:");
    if (!needsMeta) return font;
    changed = true;
    return {
      ...font,
      source: "api" as const,
      apiKitToken: parsed.kitToken,
      apiFamily: parsed.family,
      apiStyle: parsed.style,
      fileName:
        font.fileName?.startsWith("api:")
          ? font.fileName
          : `api:${parsed.kitToken}:${parsed.family}:${parsed.style}`,
    };
  });
  return { fonts: next, changed };
}

function importedApiFaceIds(): Set<string> {
  const ids = new Set<string>();
  for (const font of settings.fonts) {
    const id = apiFaceIdFromStored(font);
    if (id) ids.add(id);
  }
  return ids;
}

function resolveKitFontFace(
  kitToken: string,
  duotone: boolean,
): { family: string; style: string } {
  const needle = kitToken.toLowerCase();
  const match = installedFaFonts.find((font) => {
    if (!isKitFamily(font.family)) return false;
    if (!font.family.toLowerCase().includes(needle)) return false;
    const isDuo = /duotone/i.test(font.family);
    return duotone ? isDuo : !isDuo;
  });
  if (match) {
    return {
      family: match.family,
      style: match.styles[0] ?? "Regular",
    };
  }
  return {
    family: duotone
      ? `Font Awesome Kit Duotone ${kitToken}`
      : `Font Awesome Kit ${kitToken}`,
    style: "Regular",
  };
}

function resolveDesktopFace(face: FaKitFace): { family: string; style: string } {
  if (face.family === "kit") return resolveKitFontFace(face.kitToken, false);
  if (face.family === "kit-duotone") return resolveKitFontFace(face.kitToken, true);

  const n = majorFaVersion(face.version);
  let familyName: string;
  let styleName = titleCaseStyle(face.style);

  if (face.family === "classic" && face.style === "brands") {
    familyName = `Font Awesome ${n} Brands`;
    styleName = "Regular";
  } else if (face.family === "classic") {
    familyName = `Font Awesome ${n} Pro`;
  } else if (face.family === "duotone") {
    familyName = `Font Awesome ${n} Duotone`;
  } else if (face.family === "sharp") {
    familyName = `Font Awesome ${n} Sharp`;
  } else if (face.family === "sharp-duotone") {
    familyName = `Font Awesome ${n} Sharp Duotone`;
  } else {
    familyName = `Font Awesome ${n} ${titleCaseStyle(face.family)}`;
  }

  const exact = installedFaFonts.find(
    (font) =>
      font.family === familyName &&
      font.styles.some((s) => s.toLowerCase() === styleName.toLowerCase()),
  );
  if (exact) {
    const style =
      exact.styles.find((s) => s.toLowerCase() === styleName.toLowerCase()) ??
      exact.styles[0]!;
    return { family: exact.family, style };
  }

  const fuzzy = installedFaFonts.find((font) => {
    const f = font.family.toLowerCase();
    if (!f.includes("font awesome")) return false;
    if (face.style === "brands") return f.includes("brands");
    if (face.family === "duotone") return f.includes("duotone") && !f.includes("sharp");
    if (face.family === "sharp-duotone") {
      return f.includes("sharp") && f.includes("duotone");
    }
    if (face.family === "sharp") return f.includes("sharp") && !f.includes("duotone");
    return f.includes("pro") && !f.includes("kit");
  });
  if (fuzzy) {
    const style =
      fuzzy.styles.find((s) => s.toLowerCase() === styleName.toLowerCase()) ??
      fuzzy.styles[0] ??
      styleName;
    return { family: fuzzy.family, style };
  }

  return { family: familyName, style: styleName };
}

async function buildStoredFontFromFace(
  apiToken: string,
  face: FaKitFace,
): Promise<StoredFont | null> {
  const glyphs = await fetchFaceGlyphs(apiToken, face);
  if (Object.keys(glyphs).length === 0) return null;
  const desktop = resolveDesktopFace(face);
  return {
    family: desktop.family,
    style: desktop.style,
    glyphs,
    fileName: `api:${face.kitToken}:${face.family}:${face.style}`,
    source: "api",
    apiKitToken: face.kitToken,
    apiFamily: face.family,
    apiStyle: face.style,
    apiKitName: face.kitName,
  };
}

async function importFaces(
  apiToken: string,
  faces: FaKitFace[],
  onProgress?: (message: string) => void,
): Promise<{ iconCount: number; faceCount: number; missingInstall: boolean }> {
  if (faces.length === 0) {
    return { iconCount: 0, faceCount: 0, missingInstall: false };
  }

  const epoch = importEpoch;
  const wanted = () =>
    faces.filter((face) => faceStillWanted(face, epoch));

  // Warm kit glyph maps once up front — subsequent face builds are local.
  // Only warm kits still wanted (uncheck / clear mid-flight skips the rest).
  let pending = wanted();
  if (pending.length === 0) {
    return { iconCount: 0, faceCount: 0, missingInstall: false };
  }

  const coldKits = [
    ...new Set(
      pending
        .filter((face) => face.kind === "official")
        .map((face) => face.kitToken)
        .filter((token) => !isKitGlyphsCached(token)),
    ),
  ];
  if (coldKits.length > 0) {
    onProgress?.(
      coldKits.length === 1
        ? "Downloading kit icons from Font Awesome…"
        : `Downloading icons for ${coldKits.length} kits…`,
    );
  }
  await warmFacesGlyphCache(apiToken, pending);
  if (epoch !== importEpoch) {
    return { iconCount: 0, faceCount: 0, missingInstall: false };
  }

  pending = wanted();
  if (pending.length === 0) {
    return { iconCount: 0, faceCount: 0, missingInstall: false };
  }

  const pendingIds = new Set(
    pending.map((face) => faceKey(face.kitToken, face.family, face.style)),
  );

  let fonts = settings.fonts.filter((font) => {
    if (font.source !== "api") return true;
    const id = apiFaceIdFromStored(font);
    if (!id) return true;
    return !pendingIds.has(id);
  });

  let iconCount = 0;
  let faceCount = 0;
  let missingInstall = false;

  for (let i = 0; i < pending.length; i++) {
    const face = pending[i]!;
    if (!faceStillWanted(face, epoch)) continue;
    onProgress?.(
      pending.length === 1
        ? `Loading ${face.label}…`
        : `Loading ${face.label} (${i + 1}/${pending.length})…`,
    );
    const stored = await buildStoredFontFromFace(apiToken, face);
    if (epoch !== importEpoch) {
      return { iconCount: 0, faceCount: 0, missingInstall: false };
    }
    if (!faceStillWanted(face, epoch) || !stored) continue;
    noteKitSelected(face.kitToken);
    fonts.push(stored);
    faceCount += 1;
    iconCount += Object.keys(stored.glyphs).length;
    const installed = installedFaFonts.some(
      (font) =>
        font.family === stored.family && font.styles.includes(stored.style),
    );
    if (!installed) missingInstall = true;
  }

  if (epoch !== importEpoch || !settings.faApiToken) {
    return { iconCount: 0, faceCount: 0, missingInstall: false };
  }

  // Drop anything cancelled while we were building stored faces.
  fonts = fonts.filter((font) => {
    const id = apiFaceIdFromStored(font);
    if (!id || font.source !== "api") return true;
    return !cancelledFaceKeys.has(id);
  });

  settings.fonts = fonts;
  if (faceCount > 0) {
    settings.kitSyncedAt = new Date().toISOString();
    const preferred =
      pending.find((face) => face.kitToken === guessKitTokenFromInstall())
        ?.kitToken ?? pending[0]?.kitToken;
    if (preferred) settings.kitToken = preferred;
  }
  return { iconCount, faceCount, missingInstall };
}

function isFaceSelected(id: string): boolean {
  // Cancelled wins over an in-flight batch snapshot still listed in inflight.
  if (cancelledFaceKeys.has(id)) return false;
  return (
    importedApiFaceIds().has(id) ||
    importQueue.has(id) ||
    inflightFaceKeys.has(id)
  );
}

function selectedKitTokens(): string[] {
  const imported = importedApiFaceIds();
  return loadedKits
    .filter((kit) =>
      facesForKit(kit.token).some((face) =>
        imported.has(faceKey(face.kitToken, face.family, face.style)),
      ),
    )
    .map((kit) => kit.token);
}

function persistKitCatalog() {
  const token = settings.faApiToken;
  if (!token || accountFaces.length === 0) return;
  const catalog: FaKitCatalogCache = {
    apiToken: token,
    fetchedAt: new Date().toISOString(),
    kits: loadedKits.map((kit) => ({ token: kit.token, name: kit.name })),
    faces: accountFaces.map((face) => ({ ...face })),
  };
  send({ type: "save-kit-catalog", catalog });
}

function persistGlyphCache() {
  const token = settings.faApiToken;
  if (!token) return;
  const kitTokens = selectedKitTokens();
  if (kitTokens.length === 0) {
    send({ type: "save-glyph-cache", cache: null });
    return;
  }
  const cache: FaGlyphCacheBlob = {
    apiToken: token,
    kits: exportOfficialGlyphCache(kitTokens),
  };
  send({ type: "save-glyph-cache", cache });
}

function hydrateKitCatalog(catalog: FaKitCatalogCache | null | undefined) {
  if (catalog === undefined) return;
  if (!settings.faApiToken) {
    pendingKitCatalog = catalog;
    return;
  }
  pendingKitCatalog = undefined;
  if (!catalog?.apiToken || catalog.apiToken !== settings.faApiToken) return;
  if (accountFaces.length > 0) return;
  loadedKits = catalog.kits.map((kit) => ({ ...kit }));
  accountFaces = catalog.faces.map((face) => ({ ...face }));
}

function hydrateGlyphCache(cache: FaGlyphCacheBlob | null | undefined) {
  if (cache === undefined) return;
  if (!settings.faApiToken) {
    pendingGlyphCache = cache;
    return;
  }
  pendingGlyphCache = undefined;
  if (!cache?.apiToken || cache.apiToken !== settings.faApiToken) return;
  importOfficialGlyphCache(cache.kits);
}

function hydratePendingCaches() {
  if (pendingKitCatalog !== undefined) hydrateKitCatalog(pendingKitCatalog);
  if (pendingGlyphCache !== undefined) hydrateGlyphCache(pendingGlyphCache);
}

function updateTokenClearVisibility() {
  kitClearTokenBtn.hidden = !faApiTokenInput.value.trim();
  setupClearTokenBtn.hidden = !setupApiTokenInput.value.trim();
}

/** Only warm kits the user already selected — unused kits stay cold. */
function startBackgroundPrefetch(apiToken: string) {
  const prioritized = selectedKitTokens().filter(
    (token) => !isKitGlyphsCached(token),
  );
  if (prioritized.length === 0 || prefetchRunning) return;

  const generation = ++prefetchGeneration;
  prefetchRunning = true;

  void prefetchAccountKitGlyphs(apiToken, prioritized, (done, total) => {
    if (generation !== prefetchGeneration) return;
    if (settingsOpen) renderSettingsKitList();
    if (done >= total) persistGlyphCache();
  }).then(
    () => {
      if (generation === prefetchGeneration) {
        prefetchRunning = false;
        persistGlyphCache();
      }
    },
    () => {
      if (generation === prefetchGeneration) prefetchRunning = false;
    },
  );
}

function enqueueFaceImports(faces: FaKitFace[]) {
  for (const face of faces) {
    const id = faceKey(face.kitToken, face.family, face.style);
    cancelledFaceKeys.delete(id);
    noteKitSelected(face.kitToken);
    if (importedApiFaceIds().has(id) || inflightFaceKeys.has(id)) continue;
    importQueue.set(id, face);
  }
  void drainImportQueue();
}

function cancelQueuedFace(id: string) {
  importQueue.delete(id);
  inflightFaceKeys.delete(id);
  // Survives the drainImportQueue batch snapshot so in-flight importFaces skips it.
  cancelledFaceKeys.add(id);
}

async function drainImportQueue() {
  if (drainingImportQueue) return;
  const token = settings.faApiToken;
  if (!token || importQueue.size === 0) return;

  drainingImportQueue = true;
  setSyncButtonsBusy(true);
  try {
    while (importQueue.size > 0) {
      if (!settings.faApiToken) break;
      const epoch = importEpoch;
      const batch = [...importQueue.values()].filter(
        (face) => !cancelledFaceKeys.has(faceKey(face.kitToken, face.family, face.style)),
      );
      importQueue.clear();
      if (batch.length === 0) continue;

      for (const face of batch) {
        inflightFaceKeys.add(faceKey(face.kitToken, face.family, face.style));
      }
      if (settingsOpen) renderSettingsKitList();

      try {
        await importFaces(token, batch);
        // Token clear / hard abort while awaiting — do not persist zombie fonts.
        if (epoch !== importEpoch || !settings.faApiToken) {
          for (const face of batch) {
            inflightFaceKeys.delete(
              faceKey(face.kitToken, face.family, face.style),
            );
          }
          break;
        }
        // Strip anything unchecked during the await (before clearing cancel marks).
        let stripped = false;
        for (const face of batch) {
          const id = faceKey(face.kitToken, face.family, face.style);
          inflightFaceKeys.delete(id);
          if (!cancelledFaceKeys.has(id)) continue;
          removeApiFace(face);
          cancelledFaceKeys.delete(id);
          stripped = true;
        }
        for (const face of batch) {
          cancelledFaceKeys.delete(
            faceKey(face.kitToken, face.family, face.style),
          );
        }
        if (
          stripped ||
          batch.some((face) =>
            importedApiFaceIds().has(
              faceKey(face.kitToken, face.family, face.style),
            ),
          )
        ) {
          persistSettings();
          persistGlyphCache();
        }
        renderFontList();
        rebuildSources();
        updateShell();
        if (settingsOpen) renderSettingsKitList();
      } catch (error) {
        for (const face of batch) {
          const id = faceKey(face.kitToken, face.family, face.style);
          inflightFaceKeys.delete(id);
          // Leave unchecked on failure unless it somehow imported.
          if (!importedApiFaceIds().has(id)) importQueue.delete(id);
        }
        if (epoch !== importEpoch || !settings.faApiToken) break;
        if (settingsOpen) renderSettingsKitList();
        notify(apiErrorMessage(error), true);
        break;
      }
    }
  } finally {
    drainingImportQueue = false;
    setSyncButtonsBusy(false);
    // Drain anything queued while we were busy (and auth is still valid).
    if (importQueue.size > 0 && settings.faApiToken) void drainImportQueue();
  }
}

/** Resolve currently imported API faces from catalog and/or stored fonts. */
function resolveImportedFaces(): FaKitFace[] {
  const importedIds = importedApiFaceIds();
  if (importedIds.size === 0) return [];

  const byId = new Map<string, FaKitFace>();
  for (const face of accountFaces) {
    const id = faceKey(face.kitToken, face.family, face.style);
    if (importedIds.has(id)) byId.set(id, face);
  }

  for (const font of settings.fonts) {
    const id = apiFaceIdFromStored(font);
    if (!id || byId.has(id) || !importedIds.has(id)) continue;
    const parsed = parseFaceKey(id);
    if (!parsed) continue;
    const kind: FaKitFace["kind"] =
      parsed.family === "kit" || parsed.family === "kit-duotone"
        ? "custom"
        : "official";
    byId.set(id, {
      kitToken: parsed.kitToken,
      kitName: font.apiKitName || parsed.kitToken,
      family: parsed.family,
      style: parsed.style,
      label: font.style || titleCaseStyle(parsed.style),
      version: String(majorFaVersion(font.family)) + ".x",
      kind,
    });
  }

  return [...byId.values()];
}

function removeApiFace(face: FaKitFace) {
  const id = faceKey(face.kitToken, face.family, face.style);
  settings.fonts = settings.fonts.filter(
    (font) => apiFaceIdFromStored(font) !== id,
  );
}

function applyAccountFaces(faces: FaKitFace[]) {
  accountFaces = faces;
  const kitMap = new Map<string, string>();
  for (const face of accountFaces) kitMap.set(face.kitToken, face.kitName);
  loadedKits = Array.from(kitMap.entries())
    .map(([token, name]) => ({ token, name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

async function ensureAccountFaces(
  apiToken: string,
  options: { force?: boolean } = {},
): Promise<FaKitFace[]> {
  if (!options.force && accountFaces.length > 0) return accountFaces;
  const faces = await fetchAccountFaces(apiToken);
  applyAccountFaces(faces);
  persistKitCatalog();
  return accountFaces;
}

function kitHasSelectedStyles(kitToken: string): boolean {
  return facesForKit(kitToken).some((face) =>
    isFaceSelected(faceKey(face.kitToken, face.family, face.style)),
  );
}

function noteKitSelected(kitToken: string) {
  if (!kitSelectOrder.includes(kitToken)) kitSelectOrder.push(kitToken);
}

/** Seed addition order from persisted fonts (oldest face first). Append-only. */
function hydrateKitSelectOrderFromFonts() {
  for (const font of settings.fonts) {
    if (font.apiKitToken) {
      noteKitSelected(font.apiKitToken);
      continue;
    }
    const id = apiFaceIdFromStored(font);
    if (!id) continue;
    const parsed = parseFaceKey(id);
    if (parsed) noteKitSelected(parsed.kitToken);
  }
}

/** Rank for sorting selected kits — oldest-added first (stable across re-sync). */
function kitSelectedRank(kitToken: string): number {
  const at = kitSelectOrder.indexOf(kitToken);
  return at >= 0 ? at : Number.POSITIVE_INFINITY;
}

function syncSettingsKitParentCheckbox(
  kitToken: string,
  checkbox: HTMLInputElement,
) {
  const faces = facesForKit(kitToken);
  const checked = faces.filter((face) =>
    isFaceSelected(faceKey(face.kitToken, face.family, face.style)),
  ).length;
  checkbox.checked = faces.length > 0 && checked === faces.length;
  checkbox.indeterminate = checked > 0 && checked < faces.length;
}

/** Ideal sort for a fresh Settings visit (selected / oldest-added / name). */
function computeSettingsKitOrder(): FaKitSummary[] {
  return [...loadedKits].sort((a, b) => {
    const aSelected = kitHasSelectedStyles(a.token) ? 0 : 1;
    const bSelected = kitHasSelectedStyles(b.token) ? 0 : 1;
    if (aSelected !== bSelected) return aSelected - bSelected;
    if (aSelected === 0) {
      const byAdded = kitSelectedRank(a.token) - kitSelectedRank(b.token);
      if (byAdded !== 0) return byAdded;
    }
    return a.name.localeCompare(b.name);
  });
}

/** On Settings enter only — selected kits can lead. */
function captureSettingsKitDisplayOrder() {
  settingsKitDisplayOrder = computeSettingsKitOrder().map((kit) => kit.token);
}

/** Mid-visit catalog arrival — name order only (never reshuffle by selection). */
function freezeSettingsKitDisplayOrderByName() {
  settingsKitDisplayOrder = [...loadedKits]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((kit) => kit.token);
}

/**
 * While Settings is open, keep the card list in the order captured on entry.
 * New kits that appear mid-visit append at the bottom (no reshuffle).
 */
function orderedSettingsKits(): FaKitSummary[] {
  if (!settingsOpen) {
    return computeSettingsKitOrder();
  }
  if (settingsKitDisplayOrder == null) {
    settingsKitDisplayOrder = [];
  }

  // Catalog arrived after open / after token replace — freeze once, by name.
  if (settingsKitDisplayOrder.length === 0 && loadedKits.length > 0) {
    freezeSettingsKitDisplayOrderByName();
  }

  const byToken = new Map(loadedKits.map((kit) => [kit.token, kit]));
  const ordered: FaKitSummary[] = [];
  for (const token of settingsKitDisplayOrder) {
    const kit = byToken.get(token);
    if (!kit) continue;
    ordered.push(kit);
    byToken.delete(token);
  }
  const extras = [...byToken.values()].sort((a, b) =>
    a.name.localeCompare(b.name),
  );
  for (const kit of extras) {
    settingsKitDisplayOrder.push(kit.token);
    ordered.push(kit);
  }
  return ordered;
}

function toggleSettingsFace(face: FaKitFace, enabled: boolean) {
  const id = faceKey(face.kitToken, face.family, face.style);
  if (enabled) {
    enqueueFaceImports([face]);
    return;
  }
  cancelQueuedFace(id);
  removeApiFace(face);
  // Last style off this kit — drop in-flight / cached warm so opt-out sticks.
  if (!kitHasSelectedStyles(face.kitToken)) {
    invalidateKitGlyphCache(face.kitToken);
    persistGlyphCache();
  }
  persistSettings();
  renderFontList();
  rebuildSources();
  updateShell();
  renderSettingsKitList();
}

function toggleSettingsKitFaces(kitToken: string, enabled: boolean) {
  const faces = facesForKit(kitToken);
  if (faces.length === 0) return;

  if (enabled) {
    const missing = faces.filter(
      (face) => !isFaceSelected(faceKey(face.kitToken, face.family, face.style)),
    );
    if (missing.length === 0) return;
    enqueueFaceImports(missing);
    renderSettingsKitList();
    return;
  }

  for (const face of faces) {
    cancelQueuedFace(faceKey(face.kitToken, face.family, face.style));
    removeApiFace(face);
  }
  // Parent unchecked — abort kit warm/cache so a large accidental select is undone.
  invalidateKitGlyphCache(kitToken);
  persistSettings();
  persistGlyphCache();
  renderFontList();
  rebuildSources();
  updateShell();
  renderSettingsKitList();
}

function updateSettingsKitSelectHint() {
  if (accountFaces.length === 0) {
    settingsKitSelectHint.hidden = true;
    return;
  }
  const anySelected = accountFaces.some((face) =>
    isFaceSelected(faceKey(face.kitToken, face.family, face.style)),
  );
  settingsKitSelectHint.hidden = anySelected;
}

function renderSettingsKitList() {
  const hasToken = Boolean(
    faApiTokenInput.value.trim() || settings.faApiToken,
  );
  const imported = importedApiFaceIds();
  settingsKitTree.textContent = "";
  settingsKitSelectHint.hidden = true;

  if (!hasToken) {
    settingsKitEmpty.hidden = false;
    settingsKitEmpty.textContent = "Add an API token to load kits…";
    updateKitSectionSyncButton();
    return;
  }

  if (accountFaces.length === 0) {
    settingsKitEmpty.hidden = false;
    settingsKitEmpty.textContent =
      imported.size > 0
        ? `Loading kits… (${imported.size} style${imported.size === 1 ? "" : "s"} already imported)`
        : "Loading kits…";
    updateKitSectionSyncButton();
    return;
  }

  settingsKitEmpty.hidden = true;
  updateSettingsKitSelectHint();

  for (const kit of orderedSettingsKits()) {
    const faces = facesForKit(kit.token);
    const expanded = settingsExpandedKits.has(kit.token);
    const selectedCount = faces.filter((face) =>
      isFaceSelected(faceKey(face.kitToken, face.family, face.style)),
    ).length;

    const card = document.createElement("div");
    card.className = expanded ? "setup-kit-card is-expanded" : "setup-kit-card";
    card.dataset.kitToken = kit.token;

    const top = document.createElement("div");
    top.className = "setup-kit-card-top";
    top.title = expanded ? "Collapse styles" : "Expand styles";

    const parentCheck = document.createElement("input");
    parentCheck.type = "checkbox";
    parentCheck.title = `Select all styles in ${kit.name}`;
    parentCheck.addEventListener("click", (event) => event.stopPropagation());
    parentCheck.addEventListener("change", () => {
      toggleSettingsKitFaces(kit.token, parentCheck.checked);
    });
    syncSettingsKitParentCheckbox(kit.token, parentCheck);

    const source = document.createElement("div");
    source.className = "setup-kit-card-source";
    const name = document.createElement("span");
    name.className = "setup-kit-name";
    name.textContent = kit.name;
    const metaLine = document.createElement("div");
    metaLine.className = "setup-kit-meta-line";
    const id = document.createElement("span");
    id.className = "setup-kit-id";
    id.textContent = kit.token;
    const count = document.createElement("span");
    count.className = "setup-kit-count";
    count.textContent =
      selectedCount > 0
        ? `${selectedCount}/${faces.length} selected`
        : `${faces.length} styles`;
    metaLine.append(id, count);
    source.append(name, metaLine);

    const expand = document.createElement("span");
    expand.className = "setup-kit-expand";
    expand.setAttribute("aria-hidden", "true");
    expand.innerHTML =
      '<svg class="chevron" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>';

    top.addEventListener("click", (event) => {
      if (event.target === parentCheck) return;
      if (settingsExpandedKits.has(kit.token)) settingsExpandedKits.delete(kit.token);
      else settingsExpandedKits.add(kit.token);
      renderSettingsKitList();
    });

    top.append(parentCheck, source, expand);
    card.appendChild(top);

    if (expanded) {
      const styles = document.createElement("div");
      styles.className = "setup-kit-styles";
      for (const face of faces) {
        const faceId = faceKey(face.kitToken, face.family, face.style);
        const row = document.createElement("label");
        row.className = "setup-kit-style";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = faceId;
        checkbox.checked = isFaceSelected(faceId);
        checkbox.addEventListener("change", () => {
          toggleSettingsFace(face, checkbox.checked);
          // Keep the expanded list snappy without a full re-sort mid-toggle.
          syncSettingsKitParentCheckbox(kit.token, parentCheck);
          const selected = faces.filter((f) =>
            isFaceSelected(faceKey(f.kitToken, f.family, f.style)),
          ).length;
          count.textContent =
            selected > 0
              ? `${selected}/${faces.length} selected`
              : `${faces.length} styles`;
          updateSettingsKitSelectHint();
          updateKitSectionSyncButton();
        });
        const styleName = document.createElement("span");
        styleName.className = "setup-kit-name";
        styleName.textContent = face.label;
        row.append(checkbox, styleName);
        styles.appendChild(row);
      }
      card.appendChild(styles);
    }

    settingsKitTree.appendChild(card);
  }

  updateKitSectionSyncButton();
}

async function loadAccountFacesIntoSettings(options: { force?: boolean } = {}) {
  const token = faApiTokenInput.value.trim() || settings.faApiToken;
  if (!token) return;
  if (syncButtonsBusy) return;
  settings.faApiToken = token;
  updateTokenClearVisibility();

  // Cached catalog → paint immediately; optional force refresh happens after.
  if (!options.force && accountFaces.length > 0) {
    renderSettingsKitList();
    startBackgroundPrefetch(token);
    return;
  }

  renderSettingsKitList();
  setSyncButtonsBusy(true);
  try {
    await ensureAccountFaces(token, { force: options.force });
    persistSettings();
    renderSettingsKitList();
    startBackgroundPrefetch(token);
  } catch (error) {
    notify(apiErrorMessage(error), true);
    if (accountFaces.length === 0) {
      settingsKitTree.textContent = "";
      settingsKitEmpty.hidden = false;
      settingsKitSelectHint.hidden = true;
      settingsKitEmpty.textContent =
        "Couldn't load kits. Check the token and try again.";
    }
  } finally {
    setSyncButtonsBusy(false);
  }
}

/**
 * Footer / settings sync.
 * Fast path (picker): refresh selected-kit glyphs in parallel — no catalog wait.
 * Settings: also refreshes the kit catalog (in parallel with glyph downloads).
 */
async function refreshImportedApiFaces(
  options: { refreshCatalog?: boolean } = {},
) {
  if (syncButtonsBusy) return;

  const token =
    faApiTokenInput.value.trim() ||
    setupApiTokenInput.value.trim() ||
    settings.faApiToken;
  if (!token) {
    notify("Add an API token first.", true);
    return;
  }
  settings.faApiToken = token;
  const epoch = importEpoch;

  let faces = resolveImportedFaces();
  if (faces.length === 0 && accountFaces.length === 0) {
    // Cold start — need the catalog once to know what to refresh.
    setSyncButtonsBusy(true);
    try {
      await ensureAccountFaces(token);
      if (epoch !== importEpoch || !settings.faApiToken) {
        setSyncButtonsBusy(false);
        return;
      }
      faces = resolveImportedFaces();
    } catch (error) {
      notify(apiErrorMessage(error), true);
      setSyncButtonsBusy(false);
      return;
    }
  }

  if (faces.length === 0) {
    // Kits catalog may be loaded with nothing selected yet — guide via the
    // settings helper instead of an error toast.
    if (settingsOpen) renderSettingsKitList();
    setSyncButtonsBusy(false);
    return;
  }

  const refreshCatalog = options.refreshCatalog ?? settingsOpen;
  const facesByKit = new Map<string, FaKitFace[]>();
  for (const face of faces) {
    const list = facesByKit.get(face.kitToken) ?? [];
    list.push(face);
    facesByKit.set(face.kitToken, list);
  }
  const selectedKits = selectedKitTokens();
  const kitOrder = [
    ...selectedKits.filter((kitToken) => facesByKit.has(kitToken)),
    ...[...facesByKit.keys()].filter((kitToken) => !selectedKits.includes(kitToken)),
  ];

  setSyncButtonsBusy(true);
  try {
    // Catalog refresh (settings) runs alongside glyph downloads — don't block.
    const catalogPromise = refreshCatalog
      ? ensureAccountFaces(token, { force: true })
      : Promise.resolve(accountFaces);

    for (const kitToken of kitOrder) invalidateKitGlyphCache(kitToken);

    await mapPool(kitOrder, 2, async (kitToken) => {
      if (epoch !== importEpoch) return;
      const kitFaces = facesByKit.get(kitToken) ?? [];
      await warmFacesGlyphCache(token, kitFaces);
    });

    if (epoch !== importEpoch || !settings.faApiToken) return;

    await catalogPromise;
    if (epoch !== importEpoch || !settings.faApiToken) return;
    if (settingsOpen) renderSettingsKitList();

    // Prefer refreshed catalog metadata when available.
    const importedIds = importedApiFaceIds();
    const latestById = new Map<string, FaKitFace>();
    for (const face of resolveImportedFaces()) {
      const id = faceKey(face.kitToken, face.family, face.style);
      if (importedIds.has(id)) latestById.set(id, face);
    }
    const orderedFaces: FaKitFace[] = [];
    for (const kitToken of kitOrder) {
      for (const face of facesByKit.get(kitToken) ?? []) {
        const id = faceKey(face.kitToken, face.family, face.style);
        orderedFaces.push(latestById.get(id) ?? face);
      }
    }

    await importFaces(token, orderedFaces);
    if (epoch !== importEpoch || !settings.faApiToken) return;

    persistSettings();
    persistGlyphCache();
    renderFontList();
    rebuildSources();
    updateShell();
    if (settingsOpen) renderSettingsKitList();
    notify("Sync successful");
  } catch (error) {
    if (epoch === importEpoch && settings.faApiToken) {
      notify(apiErrorMessage(error), true);
    }
  } finally {
    setSyncButtonsBusy(false);
  }
}

function renderKitSettings() {
  faApiTokenInput.value = settings.faApiToken ?? "";
  updateTokenClearVisibility();
  renderSettingsKitList();
  updateKitSectionSyncButton();

  if (settings.faApiToken && accountFaces.length === 0) {
    void loadAccountFacesIntoSettings();
  } else if (settings.faApiToken && accountFaces.length > 0) {
    startBackgroundPrefetch(settings.faApiToken);
  }
}

// --- first-run setup (files or kit API) --------------------------------------

type SetupPanel = "choice" | "api";

function updateSetupLoadKitsEnabled() {
  setupLoadKitsBtn.disabled = !setupApiTokenInput.value.trim();
}

function updateSetupSyncButton() {
  if (setupSyncBusy) {
    setupSyncKitsBtn.disabled = true;
    return;
  }
  setupSyncKitsBtn.disabled = setupCheckedFaceKeys.size === 0;
}

function setSetupSyncBusy(busy: boolean) {
  setupSyncBusy = busy;
  setupSyncKitsBtn.classList.toggle("syncing", busy);
  if (busy) {
    setupSyncKitsBtn.disabled = true;
    setupSyncKitsBtn.innerHTML = SYNC_SPINNER_SVG;
    setupSyncKitsBtn.setAttribute("aria-busy", "true");
    setupSyncKitsBtn.setAttribute("aria-label", "Loading selected kits/styles");
    return;
  }
  setupSyncKitsBtn.removeAttribute("aria-busy");
  setupSyncKitsBtn.removeAttribute("aria-label");
  setupSyncKitsBtn.textContent = SETUP_SYNC_LABEL;
  updateSetupSyncButton();
}

function allSetupFacesSelected(): boolean {
  return (
    accountFaces.length > 0 &&
    accountFaces.every((face) =>
      setupCheckedFaceKeys.has(faceKey(face.kitToken, face.family, face.style)),
    )
  );
}

function updateSetupSelectAllButton() {
  // Drop out of Clear-all mode as soon as the full selection is broken.
  if (setupSelectAllActive && !allSetupFacesSelected()) {
    setupSelectAllActive = false;
  }
  setupSelectAllBtn.textContent = setupSelectAllActive ? "Clear all" : "Select all";
}

function setSetupPanel(panel: SetupPanel) {
  setupChoice.hidden = panel !== "choice";
  setupApiPanel.hidden = panel !== "api";
  if (panel === "api" && settings.faApiToken && !setupApiTokenInput.value) {
    setupApiTokenInput.value = settings.faApiToken;
  }
  if (panel === "api") {
    updateSetupLoadKitsEnabled();
    updateTokenClearVisibility();
  }
  updateSetupNoteVisibility();
}

function setSetupApiStatus(message: string, kind: "ok" | "error" | "" = "") {
  setupApiStatus.textContent = message;
  setupApiStatus.classList.toggle("is-error", kind === "error");
}

function updateSetupNoteVisibility() {
  // Hide the sticky note on the API screen once kits are loaded (picker needs the space).
  const kitsVisible = !setupApiPanel.hidden && !setupKitPicker.hidden;
  setupNote.hidden = kitsVisible;
  setupApiFooter.hidden = setupKitPicker.hidden;
}

function facesForKit(kitToken: string): FaKitFace[] {
  return accountFaces.filter((face) => face.kitToken === kitToken);
}

function syncKitParentCheckbox(
  kitToken: string,
  checkbox: HTMLInputElement,
) {
  const faces = facesForKit(kitToken);
  const checked = faces.filter((face) =>
    setupCheckedFaceKeys.has(faceKey(face.kitToken, face.family, face.style)),
  ).length;
  checkbox.checked = faces.length > 0 && checked === faces.length;
  checkbox.indeterminate = checked > 0 && checked < faces.length;
}

function renderSetupKitList(kits: FaKitSummary[], resetSelection = false) {
  // Fresh kit loads start with nothing selected — user opts in explicitly.
  if (resetSelection) {
    setupCheckedFaceKeys.clear();
    setupSelectAllActive = false;
  }

  setupKitTree.textContent = "";
  for (const kit of kits) {
    const faces = facesForKit(kit.token);
    const expanded = setupExpandedKits.has(kit.token);
    const selectedCount = faces.filter((face) =>
      setupCheckedFaceKeys.has(faceKey(face.kitToken, face.family, face.style)),
    ).length;

    const card = document.createElement("div");
    card.className = expanded ? "setup-kit-card is-expanded" : "setup-kit-card";
    card.dataset.kitToken = kit.token;

    const top = document.createElement("div");
    top.className = "setup-kit-card-top";
    top.title = expanded ? "Collapse styles" : "Expand styles";

    const parentCheck = document.createElement("input");
    parentCheck.type = "checkbox";
    parentCheck.title = `Select all styles in ${kit.name}`;
    parentCheck.addEventListener("click", (event) => event.stopPropagation());
    parentCheck.addEventListener("change", () => {
      for (const face of faces) {
        const id = faceKey(face.kitToken, face.family, face.style);
        if (parentCheck.checked) setupCheckedFaceKeys.add(id);
        else setupCheckedFaceKeys.delete(id);
      }
      renderSetupKitList(kits);
    });
    syncKitParentCheckbox(kit.token, parentCheck);

    const source = document.createElement("div");
    source.className = "setup-kit-card-source";
    const name = document.createElement("span");
    name.className = "setup-kit-name";
    name.textContent = kit.name;
    const metaLine = document.createElement("div");
    metaLine.className = "setup-kit-meta-line";
    const id = document.createElement("span");
    id.className = "setup-kit-id";
    id.textContent = kit.token;
    const count = document.createElement("span");
    count.className = "setup-kit-count";
    count.textContent =
      selectedCount > 0
        ? `${selectedCount}/${faces.length} selected`
        : `${faces.length} styles`;
    metaLine.append(id, count);
    source.append(name, metaLine);

    const expand = document.createElement("span");
    expand.className = "setup-kit-expand";
    expand.setAttribute("aria-hidden", "true");
    expand.innerHTML =
      '<svg class="chevron" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>';

    top.addEventListener("click", (event) => {
      if (event.target === parentCheck) return;
      if (setupExpandedKits.has(kit.token)) setupExpandedKits.delete(kit.token);
      else setupExpandedKits.add(kit.token);
      renderSetupKitList(kits);
    });

    top.append(parentCheck, source, expand);
    card.appendChild(top);

    if (expanded) {
      const styles = document.createElement("div");
      styles.className = "setup-kit-styles";
      for (const face of faces) {
        const faceId = faceKey(face.kitToken, face.family, face.style);
        const row = document.createElement("label");
        row.className = "setup-kit-style";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = faceId;
        checkbox.checked = setupCheckedFaceKeys.has(faceId);
        checkbox.addEventListener("change", () => {
          if (checkbox.checked) setupCheckedFaceKeys.add(faceId);
          else setupCheckedFaceKeys.delete(faceId);
          const selected = faces.filter((f) =>
            setupCheckedFaceKeys.has(
              faceKey(f.kitToken, f.family, f.style),
            ),
          ).length;
          syncKitParentCheckbox(kit.token, parentCheck);
          count.textContent =
            selected > 0
              ? `${selected}/${faces.length} selected`
              : `${faces.length} styles`;
          updateSetupSyncButton();
          updateSetupSelectAllButton();
        });
        const styleName = document.createElement("span");
        styleName.className = "setup-kit-name";
        styleName.textContent = face.label;
        row.append(checkbox, styleName);
        styles.appendChild(row);
      }
      card.appendChild(styles);
    }

    setupKitTree.appendChild(card);
  }

  setupKitPicker.hidden = kits.length === 0;
  updateSetupNoteVisibility();
  updateSetupSyncButton();
  updateSetupSelectAllButton();
}

function selectedSetupFaces(): FaKitFace[] {
  return accountFaces.filter((face) =>
    setupCheckedFaceKeys.has(faceKey(face.kitToken, face.family, face.style)),
  );
}

function selectAllSetupFaces() {
  for (const face of accountFaces) {
    setupCheckedFaceKeys.add(faceKey(face.kitToken, face.family, face.style));
  }
  for (const kit of loadedKits) setupExpandedKits.add(kit.token);
  setupSelectAllActive = true;
  renderSetupKitList(loadedKits);
}

function clearAllSetupFaces() {
  setupCheckedFaceKeys.clear();
  setupSelectAllActive = false;
  renderSetupKitList(loadedKits);
}

function toggleSetupSelectAll() {
  if (setupSelectAllActive) clearAllSetupFaces();
  else selectAllSetupFaces();
}

async function setupLoadKits() {
  const token = setupApiTokenInput.value.trim();
  if (!token) {
    setSetupApiStatus("Paste a Font Awesome account API token first.", "error");
    updateSetupLoadKitsEnabled();
    return;
  }
  settings.faApiToken = token;
  faApiTokenInput.value = token;
  setupLoadKitsBtn.disabled = true;
  setSetupApiStatus("Loading kits & styles…");
  try {
    accountFaces = [];
    setupExpandedKits.clear();
    setupCheckedFaceKeys.clear();
    await ensureAccountFaces(token);
    persistSettings();
    renderSetupKitList(loadedKits, true);
    if (loadedKits.length === 0) {
      setSetupApiStatus("No kits on this account.", "error");
    } else {
      setSetupApiStatus("");
      startBackgroundPrefetch(token);
    }
  } catch (error) {
    setSetupApiStatus(apiErrorMessage(error), "error");
  } finally {
    updateSetupLoadKitsEnabled();
  }
}

async function setupSyncSelectedStyles() {
  const token = setupApiTokenInput.value.trim();
  const faces = selectedSetupFaces();
  if (!token) {
    setSetupApiStatus("Paste a Font Awesome account API token first.", "error");
    return;
  }
  if (faces.length === 0) {
    setSetupApiStatus("Select at least one style to load.", "error");
    return;
  }

  settings.faApiToken = token;
  const epoch = importEpoch;
  // Explicit setup import wins over any leftover settings-queue work.
  importQueue.clear();
  inflightFaceKeys.clear();
  for (const face of faces) {
    cancelledFaceKeys.delete(
      faceKey(face.kitToken, face.family, face.style),
    );
  }
  setSetupSyncBusy(true);
  setSetupApiStatus("");
  try {
    await importFaces(token, faces);
    if (epoch !== importEpoch || !settings.faApiToken) {
      setSetupApiStatus("Import cancelled.", "error");
      return;
    }
    persistSettings();
    persistGlyphCache();
    renderFontList();
    rebuildSources();
    if (settings.fonts.length === 0) {
      setSetupApiStatus(
        "No icons found for those styles. Try Select all, or Add local font files.",
        "error",
      );
      return;
    }
    notify("Sync successful");
    setSetupPanel("choice");
    updateShell();
  } catch (error) {
    if (epoch === importEpoch) {
      setSetupApiStatus(apiErrorMessage(error), "error");
    }
  } finally {
    setSetupSyncBusy(false);
  }
}

function kitIdFromFamily(family: string): string | undefined {
  // FA kit desktop families embed the kit token (usually hex, sometimes
  // broader alphanumerics). Prefer the longest token-looking segment.
  const matches = family.match(/\b([a-z0-9]{8,})\b/gi);
  if (!matches || matches.length === 0) return undefined;
  return matches.sort((a, b) => b.length - a.length)[0];
}

/** Settings list label — kit ids shown separately under the title. */
function settingsGroupTitle(family: string): string {
  if (!isKitFamily(family)) return family;
  if (/duotone/i.test(family)) return "Custom Kit Duotone";
  return "Custom Kit";
}

/** True for fonts loaded from disk (not FA Kit API sync). */
function isLocalFileFont(font: StoredFont): boolean {
  if (font.source === "file") return true;
  if (font.source === "api") return false;
  // Legacy / backfilled API rows (api:* fileName or recoverable face id).
  if (apiFaceIdFromStored(font)) return false;
  return !String(font.fileName ?? "").startsWith("api:");
}

function renderFontList() {
  fontList.textContent = "";
  // API-synced styles belong under API Sync — keep this list file-only.
  const localFonts = settings.fonts.filter(isLocalFileFont);
  if (localFonts.length === 0) return;

  // Group faces by family so Pro Solid/Regular share one card, etc.
  const groups = new Map<string, StoredFont[]>();
  for (const font of localFonts) {
    const list = groups.get(font.family) ?? [];
    list.push(font);
    groups.set(font.family, list);
  }

  const familyOrder = Array.from(groups.keys()).sort((a, b) => {
    const aKit = isKitFamily(a) ? 1 : 0;
    const bKit = isKitFamily(b) ? 1 : 0;
    if (aKit !== bKit) return aKit - bKit;
    const aBrands = /brands/i.test(a) ? 1 : 0;
    const bBrands = /brands/i.test(b) ? 1 : 0;
    if (aBrands !== bBrands) return aBrands - bBrands;
    return a.localeCompare(b);
  });

  for (const family of familyOrder) {
    const faces = groups.get(family)!;
    faces.sort((a, b) => weightForStyle(b.style) - weightForStyle(a.style));

    const group = document.createElement("li");
    group.className = "font-group";

    const header = document.createElement("div");
    header.className = "font-group-header";
    const title = document.createElement("div");
    title.className = "font-group-title";
    title.textContent = settingsGroupTitle(family);
    title.title = family;
    header.appendChild(title);
    const kitId = isKitFamily(family) ? kitIdFromFamily(family) : undefined;
    if (kitId) {
      const idEl = document.createElement("div");
      idEl.className = "font-group-id";
      idEl.textContent = kitId;
      header.appendChild(idEl);
    }
    group.appendChild(header);

    for (const font of faces) {
      const row = document.createElement("div");
      row.className = "font-style-row";

      const main = document.createElement("div");
      main.className = "font-style-main";
      const styleName = document.createElement("span");
      styleName.className = "font-style-name";
      styleName.textContent = font.style;
      const meta = document.createElement("span");
      meta.className = "font-style-meta";
      meta.textContent = `${entriesFromGlyphs(font.glyphs).length} icons`;
      main.append(styleName, meta);

      const remove = document.createElement("button");
      remove.className = "remove-btn";
      remove.title = `Remove ${font.style}`;
      remove.setAttribute("aria-label", `Remove ${family} ${font.style}`);
      remove.innerHTML =
        '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>';
      remove.addEventListener("click", () => {
        // Only drop this local file row — never an API-synced face that
        // happens to share the same family/style name.
        settings.fonts = settings.fonts.filter((f) => {
          if (!isLocalFileFont(f)) return true;
          if (font.fileName) return f.fileName !== font.fileName;
          return !(f.family === font.family && f.style === font.style);
        });
        persistSettings();
        renderFontList();
        rebuildSources();
        if (settingsOpen) renderSettingsKitList();
        updateShell();
      });

      row.append(main, remove);
      group.appendChild(row);
    }

    fontList.appendChild(group);
  }
}

type NameTable = Record<string, Record<string, string> | undefined>;

/**
 * opentype.js 2.x nests name records under `windows` / `macintosh`
 * (1.x was flat). Check all shapes; prefer typographic ("preferred") names —
 * they match what Figma shows (e.g. family "Font Awesome 7 Pro", style "Solid").
 */
function nameFromTable(
  names: Record<string, unknown>,
  preferred: string,
  fallback: string,
): string {
  const tables = [names.windows, names.macintosh, names] as (NameTable | undefined)[];
  const read = (key: string) => {
    for (const table of tables) {
      const value = table?.[key];
      if (value) return value.en ?? Object.values(value)[0];
    }
    return undefined;
  };
  return read(preferred) ?? read(fallback) ?? "";
}

async function addFontFiles(files: FileList) {
  const failures: string[] = [];
  for (const file of Array.from(files)) {
    try {
      const buffer = await file.arrayBuffer();
      const font = parse(buffer);
      const names = font.names as unknown as Record<string, unknown>;
      const family = nameFromTable(names, "preferredFamily", "fontFamily");
      const style = nameFromTable(names, "preferredSubfamily", "fontSubfamily");
      if (!family) throw new Error("no family name in font");

      const glyphs: Record<string, string> = {};
      for (let i = 0; i < font.glyphs.length; i += 1) {
        const glyph = font.glyphs.get(i);
        if (glyph.name && glyph.unicode != null) {
          glyphs[glyph.name] = glyph.unicode.toString(16);
        }
      }
      if (Object.keys(glyphs).length === 0) throw new Error("no named glyphs found");

      const stored: StoredFont = {
        family,
        style,
        glyphs,
        fileName: file.name,
        source: "file",
      };
      const existing = settings.fonts.findIndex(
        (f) => f.family === family && f.style === style,
      );
      if (existing >= 0) settings.fonts[existing] = stored;
      else settings.fonts.push(stored);

      // Register for previews in this session (persisted sessions rely on the
      // OS-installed font of the same family).
      try {
        const face = new FontFace(family, buffer, {
          weight: String(weightForStyle(style)),
        });
        await face.load();
        document.fonts.add(face);
      } catch {
        // Preview registration is best-effort.
      }
    } catch (error) {
      failures.push(file.name);
      console.warn("Could not parse font file", file.name, error);
    }
  }
  persistSettings();
  if (failures.length > 0) {
    notify(`Couldn't read: ${failures.join(", ")}`, true);
  }
  renderFontList();
  rebuildSources();
}

// --- wiring -------------------------------------------------------------------

window.onmessage = (event: MessageEvent) => {
  const message = event.data?.pluginMessage as CodeToUiMessage | undefined;
  if (!message) return;
  if (message.type === "selection") {
    target = message.target;
    renderTarget();
  } else if (message.type === "fonts") {
    installedFaFonts = message.faFonts;
    renderBanner();
    if (settingsOpen) renderSettingsKitList();
  } else if (message.type === "settings") {
    settings = {
      ...EMPTY_SETTINGS,
      ...message.settings,
      preferredStyle:
        message.settings.preferredStyle || EMPTY_SETTINGS.preferredStyle,
    };
    // Backfill api* ids in memory (legacy API imports omitted them).
    const normalized = normalizeApiFontMetadata(settings.fonts);
    settings.fonts = normalized.fonts;
    // Token was cleared previously (or never set) — don't keep orphaned API faces.
    let purgedOrphans = false;
    if (!settings.faApiToken) {
      purgedOrphans = retainLocalFileFontsOnly();
      if (purgedOrphans) {
        send({ type: "save-kit-catalog", catalog: null });
        send({ type: "save-glyph-cache", cache: null });
        invalidateKitGlyphCache();
      }
    }
    if (normalized.changed || purgedOrphans) persistSettings();
    kitSelectOrder.length = 0;
    hydrateKitSelectOrderFromFonts();
    hydratePendingCaches();
    rebuildSources();
    updateTokenClearVisibility();
    if (settingsOpen) renderKitSettings();
  } else if (message.type === "kit-catalog") {
    hydrateKitCatalog(message.catalog);
    if (settingsOpen || accountFaces.length > 0) renderSettingsKitList();
  } else if (message.type === "glyph-cache") {
    hydrateGlyphCache(message.cache);
    if (settingsOpen) {
      renderSettingsKitList();
      if (settings.faApiToken) startBackgroundPrefetch(settings.faApiToken);
    }
  }
  // "inserted" results surface via figma.notify toasts; no inline status.
};

setupNoteWhy.addEventListener("click", () => {
  const expanded = setupNoteWhy.getAttribute("aria-expanded") === "true";
  const next = !expanded;
  setupNoteWhy.setAttribute("aria-expanded", String(next));
  setupNoteWhy.textContent = next ? "Less" : "Why?";
  setupNoteMore.hidden = !next;
});

searchInput.addEventListener("input", renderGrid);
familyTrigger.addEventListener("click", (event) => {
  event.stopPropagation();
  const open = isHidden(familyMenu);
  closeAllMenus();
  setMenuOpen(familyMenu, familyTrigger, open);
});
styleTrigger.addEventListener("click", (event) => {
  event.stopPropagation();
  const open = isHidden(styleMenu);
  closeAllMenus();
  setMenuOpen(styleMenu, styleTrigger, open);
});
preferredStyleTrigger.addEventListener("click", (event) => {
  event.stopPropagation();
  if (preferredStyleTrigger.disabled) return;
  const open = isHidden(preferredStyleMenu);
  closeAllMenus();
  setMenuOpen(preferredStyleMenu, preferredStyleTrigger, open);
});
document.addEventListener("click", (event) => {
  const targetNode = event.target as Node;
  const inFamily =
    familyTrigger.contains(targetNode) || familyMenu.contains(targetNode);
  const inStyle =
    styleTrigger.contains(targetNode) || styleMenu.contains(targetNode);
  const inPreferred =
    preferredStyleTrigger.contains(targetNode) ||
    preferredStyleMenu.contains(targetNode);
  if (!inFamily && !inStyle && !inPreferred) closeAllMenus();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeAllMenus();
});
settingsBtn.addEventListener("click", () => showSettings(true));
backBtn.addEventListener("click", () => showSettings(false));
footerSyncBtn.addEventListener("click", () =>
  void refreshImportedApiFaces({ refreshCatalog: false }),
);
kitSectionSyncBtn.addEventListener("click", () => {
  // No catalog yet → Load kits. Catalog loaded but nothing imported → refresh
  // the kit list. Imported styles → full glyph sync.
  if (accountFaces.length === 0 || !hasImportedApiFaces()) {
    void loadAccountFacesIntoSettings({ force: true });
    return;
  }
  void refreshImportedApiFaces({ refreshCatalog: true });
});
setupAddBtn.addEventListener("click", () => fontFilesInput.click());
setupApiBtn.addEventListener("click", () => {
  setSetupPanel("api");
  setSetupApiStatus("");
  if (loadedKits.length > 0) renderSetupKitList(loadedKits);
});
setupApiBack.addEventListener("click", () => {
  setSetupPanel("choice");
  setSetupApiStatus("");
});
setupApiTokenInput.addEventListener("input", () => {
  updateSetupLoadKitsEnabled();
  updateTokenClearVisibility();
});
setupApiTokenInput.addEventListener("change", () => {
  // Cleared by hand (not just the ×) — same cleanup as the clear button.
  if (!setupApiTokenInput.value.trim()) {
    if (settings.faApiToken || settings.fonts.some((f) => !isLocalFileFont(f))) {
      clearApiAuthAndSyncedFonts();
    } else {
      updateTokenClearVisibility();
      updateSetupLoadKitsEnabled();
    }
  }
});
setupClearTokenBtn.addEventListener("click", () => {
  clearApiAuthAndSyncedFonts();
});
setupLoadKitsBtn.addEventListener("click", () => void setupLoadKits());
setupSelectAllBtn.addEventListener("click", () => toggleSetupSelectAll());
setupSyncKitsBtn.addEventListener("click", () => void setupSyncSelectedStyles());
addFontsBtn.addEventListener("click", () => fontFilesInput.click());
fontFilesInput.addEventListener("change", () => {
  if (fontFilesInput.files?.length) void addFontFiles(fontFilesInput.files);
  fontFilesInput.value = "";
});
kitClearTokenBtn.addEventListener("click", () => {
  clearApiAuthAndSyncedFonts();
});
faApiTokenInput.addEventListener("input", () => {
  updateTokenClearVisibility();
  updateKitSectionSyncButton();
});
faApiTokenInput.addEventListener("change", () => {
  const token = faApiTokenInput.value.trim();
  updateTokenClearVisibility();
  updateKitSectionSyncButton();
  // Cleared by hand (not just the ×) — same cleanup as the clear button.
  if (!token) {
    if (settings.faApiToken || settings.fonts.some((f) => !isLocalFileFont(f))) {
      clearApiAuthAndSyncedFonts();
    }
    return;
  }
  // Don't wipe the catalog when the field blurs with the same token.
  if (token === settings.faApiToken && accountFaces.length > 0) {
    persistSettings();
    return;
  }
  const tokenChanged = token !== settings.faApiToken;
  settings.faApiToken = token;
  if (tokenChanged) {
    abortAllApiImports();
    accountFaces = [];
    loadedKits = [];
    settingsExpandedKits.clear();
    // Keep local files; drop API faces tied to the previous token.
    retainLocalFileFontsOnly();
    send({ type: "save-kit-catalog", catalog: null });
    send({ type: "save-glyph-cache", cache: null });
    persistSettings();
  }
  void loadAccountFacesIntoSettings({ force: tokenChanged });
});

setSetupPanel("choice");
send({ type: "init" });
rebuildSources();
renderTarget();
updateShell();
