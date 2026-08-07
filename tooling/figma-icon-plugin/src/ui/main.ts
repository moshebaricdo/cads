/**
 * FontAwesome Glyphs — plugin UI.
 *
 * Catalog comes only from `.otf` / `.ttf` files the user adds (setup or
 * Settings). Installed-font detection is used solely for the “not installed
 * in Figma” banner — never to populate the picker.
 *
 * Two pickers: FA version (family) and style within that family. An "All"
 * version (always first) unions every added font's glyphs. Kit families are
 * labeled "Custom Kit" in the UI (FA exports them with a hex kit id).
 */
import { parse } from "opentype.js";
import type { IconEntry } from "../data/icons";
import {
  EMPTY_SETTINGS,
  type CodeToUiMessage,
  type FaFont,
  type InsertTarget,
  type PluginSettings,
  type StoredFont,
  type UiToCodeMessage,
} from "../shared/messages";

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
}

// --- elements -------------------------------------------------------------

const setupView = document.getElementById("setup-view") as HTMLDivElement;
const mainView = document.getElementById("main-view") as HTMLDivElement;
const settingsView = document.getElementById("settings-view") as HTMLDivElement;
const setupAddBtn = document.getElementById("setup-add-btn") as HTMLButtonElement;
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
const targetEl = document.getElementById("target") as HTMLDivElement;
const settingsBtn = document.getElementById("settings-btn") as HTMLButtonElement;
const backBtn = document.getElementById("back-btn") as HTMLButtonElement;
const addFontsBtn = document.getElementById("add-fonts-btn") as HTMLButtonElement;
const fontFilesInput = document.getElementById("font-files") as HTMLInputElement;
const fontList = document.getElementById("font-list") as HTMLUListElement;
const fontDirHint = document.getElementById("font-dir-hint") as HTMLSpanElement;
const saveBtn = document.getElementById("save-btn") as HTMLButtonElement;
const saveNote = document.getElementById("save-note") as HTMLSpanElement;
const preferredStyleTrigger = document.getElementById(
  "preferred-style-trigger",
) as HTMLButtonElement;
const preferredStyleLabel = document.getElementById(
  "preferred-style-label",
) as HTMLSpanElement;
const preferredStyleMenu = document.getElementById(
  "preferred-style-menu",
) as HTMLDivElement;

// --- state ----------------------------------------------------------------

let settings: PluginSettings = { ...EMPTY_SETTINGS };
let installedFaFonts: FaFont[] = [];
let sources: Source[] = [];
let activeFamily = "";
let activeSource: Source | null = null;
let target: InsertTarget = { kind: "create" };
/** Settings open (overrides setup / main). */
let settingsOpen = false;
/** Once the user picks a family/style this session, don't re-apply preferred. */
let userPickedSource = false;

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

function sourcesFromStoredFonts(fonts: StoredFont[]): Source[] {
  const built: Source[] = [];
  for (const font of fonts) {
    const entries = entriesFromGlyphs(font.glyphs);
    if (entries.length === 0) continue;
    const custom = isKitFamily(font.family);
    built.push({
      family: font.family,
      style: font.style,
      weight: weightForStyle(font.style),
      id: `${font.family}/${font.style}`,
      itemLabel: font.style,
      entries,
      isCustom: custom,
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
    if (a.family !== b.family) return a.family.localeCompare(b.family);
    if (a.isCustom !== b.isCustom) return a.isCustom ? 1 : -1;
    return b.weight - a.weight;
  });
}

/**
 * Build the All catalog.
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
        entry: {
          ...entry,
          fontFamily: source.family,
          fontStyle: source.style,
          fontWeight: source.weight,
        },
      });
    }
  };

  const stock = parts.filter(
    (source) => !isKitFamily(source.family) && !/brands/i.test(source.family),
  );
  const brands = parts.filter((source) => /brands/i.test(source.family));
  const kits = parts.filter((source) => isKitFamily(source.family));

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
  };
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
 * view. The preferred style shapes the All merge and which face is selected
 * when the user later picks a specific version family.
 */
function pickPreferredSource(familyList: string[]): {
  family: string;
  source: Source | null;
} {
  if (familyList.includes(ALL_FAMILY)) {
    return {
      family: ALL_FAMILY,
      source: stylesForFamily(ALL_FAMILY)[0] ?? null,
    };
  }
  const preferred = (settings.preferredStyle || EMPTY_SETTINGS.preferredStyle).trim();
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
  const parts =
    settings.fonts.length > 0 ? sourcesFromStoredFonts(settings.fonts) : [];

  sources = parts.length > 0 ? [buildAllSource(parts), ...parts] : [];

  const familyList = families();

  if (userPickedSource && familyList.includes(previousFamily)) {
    activeFamily = previousFamily;
    const styleList = stylesForFamily(activeFamily);
    activeSource =
      styleList.find((source) => source.id === previousId) ??
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
    menu.appendChild(button);
  }
}

function renderPickers() {
  const familyList = families();
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
  preferredStyleLabel.textContent = selected;
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

  emptyEl.hidden = shown.length > 0;
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
    "Insert a new icon or select an existing text layer to replace";
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
  const ready = settings.fonts.length > 0;
  if (settingsOpen) {
    setupView.hidden = true;
    mainView.hidden = true;
    settingsView.hidden = false;
    return;
  }
  setupView.hidden = ready;
  mainView.hidden = !ready;
  settingsView.hidden = true;
  if (ready) searchInput.focus();
}

function showSettings(show: boolean) {
  settingsOpen = show;
  if (show) {
    saveNote.textContent = "";
    renderPreferredStyleSelect();
    renderFontList();
  }
  updateShell();
}

function persistSettings(note = "Saved") {
  send({ type: "save-settings", settings });
  saveNote.textContent = note;
}

function kitIdFromFamily(family: string): string | undefined {
  return family.match(/\b([a-f0-9]{8,})\b/i)?.[1];
}

/** Settings list label — kit ids shown separately under the title. */
function settingsGroupTitle(family: string): string {
  if (!isKitFamily(family)) return family;
  if (/duotone/i.test(family)) return "Custom Kit Duotone";
  return "Custom Kit";
}

function renderFontList() {
  fontList.textContent = "";
  if (settings.fonts.length === 0) {
    const li = document.createElement("li");
    li.className = "empty-note";
    li.textContent = "None yet — add the .otf files you use (picker stays empty until then).";
    fontList.appendChild(li);
    return;
  }

  // Group faces by family so Pro Solid/Regular share one card, etc.
  const groups = new Map<string, StoredFont[]>();
  for (const font of settings.fonts) {
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
        settings.fonts = settings.fonts.filter(
          (f) => !(f.family === font.family && f.style === font.style),
        );
        persistSettings();
        renderFontList();
        rebuildSources();
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

      const stored: StoredFont = { family, style, glyphs, fileName: file.name };
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
  persistSettings(
    failures.length > 0 ? `Couldn't read: ${failures.join(", ")}` : "Saved",
  );
  renderFontList();
  rebuildSources();
}

function renderFontDirHint() {
  const isMac = /mac/i.test(navigator.platform);
  fontDirHint.innerHTML = isMac
    ? `Files usually live in <code>~/Library/Fonts</code> (press <code>⌘⇧G</code> in the picker and paste).`
    : `Files usually live in <code>C:\\Windows\\Fonts</code>.`;
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
  } else if (message.type === "settings") {
    settings = {
      ...EMPTY_SETTINGS,
      ...message.settings,
      preferredStyle:
        message.settings.preferredStyle || EMPTY_SETTINGS.preferredStyle,
    };
    rebuildSources();
  }
  // "inserted" results surface via figma.notify toasts; no inline status.
};

searchInput.addEventListener("input", renderGrid);
familyTrigger.addEventListener("click", (event) => {
  event.stopPropagation();
  const open = familyMenu.hidden;
  closeAllMenus();
  setMenuOpen(familyMenu, familyTrigger, open);
});
styleTrigger.addEventListener("click", (event) => {
  event.stopPropagation();
  const open = styleMenu.hidden;
  closeAllMenus();
  setMenuOpen(styleMenu, styleTrigger, open);
});
preferredStyleTrigger.addEventListener("click", (event) => {
  event.stopPropagation();
  const open = preferredStyleMenu.hidden;
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
setupAddBtn.addEventListener("click", () => fontFilesInput.click());
addFontsBtn.addEventListener("click", () => fontFilesInput.click());
fontFilesInput.addEventListener("change", () => {
  if (fontFilesInput.files?.length) void addFontFiles(fontFilesInput.files);
  fontFilesInput.value = "";
});
saveBtn.addEventListener("click", () => persistSettings());

renderFontDirHint();
send({ type: "init" });
rebuildSources();
renderTarget();
updateShell();
