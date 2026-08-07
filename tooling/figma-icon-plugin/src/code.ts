/**
 * FontAwesome Glyphs — plugin main thread.
 *
 * Inserts FA shortcodes as *text* (never vectors), so component instances are
 * never detached and text-scoped semantic color variables keep working:
 *  1. Instance selected       → set a TEXT component property (sidebar prop).
 *  2. Text layer(s) selected  → replace characters (all layers in multi-edit).
 *  3. Nothing selected        → create a new FA text layer at the viewport center.
 *
 * The UI derives its style tabs from the FA fonts actually installed on this
 * machine (reported here via listAvailableFontsAsync), so any FA flavor works
 * (Pro, Sharp, Duotone, a merged internal font, …), not a hardcoded three.
 */
import {
  EMPTY_SETTINGS,
  type CodeToUiMessage,
  type FaFont,
  type FontNameLike,
  type InsertTarget,
  type InstanceTextProp,
  type PluginSettings,
  type UiToCodeMessage,
} from "./shared/messages";

figma.showUI(__html__, { width: 380, height: 540, themeColors: true });

const SETTINGS_KEY = "settings";

async function postSettings(): Promise<void> {
  const stored = (await figma.clientStorage.getAsync(SETTINGS_KEY)) as
    | (Partial<PluginSettings> & { faApiToken?: string })
    | undefined;
  const settings: PluginSettings = {
    fonts: stored?.fonts ?? EMPTY_SETTINGS.fonts,
    preferredStyle: stored?.preferredStyle ?? EMPTY_SETTINGS.preferredStyle,
  };
  post({ type: "settings", settings });
}

async function saveSettings(settings: PluginSettings): Promise<void> {
  await figma.clientStorage.setAsync(SETTINGS_KEY, settings);
  figma.notify("Settings saved");
}

function post(message: CodeToUiMessage) {
  figma.ui.postMessage(message);
}

async function postInstalledFaFonts(): Promise<void> {
  const fonts = await figma.listAvailableFontsAsync();
  const byFamily = new Map<string, string[]>();
  for (const font of fonts) {
    const { family, style } = font.fontName;
    if (!/^font awesome/i.test(family)) continue;
    const styles = byFamily.get(family) ?? [];
    if (!styles.includes(style)) styles.push(style);
    byFamily.set(family, styles);
  }
  const faFonts: FaFont[] = Array.from(byFamily.entries()).map(
    ([family, styles]) => ({ family, styles }),
  );
  post({ type: "fonts", faFonts });
}

function instanceTextProps(instance: InstanceNode): InstanceTextProp[] {
  const props: InstanceTextProp[] = [];
  let properties: ComponentProperties;
  try {
    properties = instance.componentProperties;
  } catch {
    return props;
  }
  for (const [key, definition] of Object.entries(properties)) {
    if (definition.type === "TEXT") {
      props.push({
        key,
        label: key.split("#")[0],
        value: String(definition.value),
      });
    }
  }
  return props;
}

function selectedTextNodes(): TextNode[] {
  return figma.currentPage.selection.filter(
    (node): node is TextNode => node.type === "TEXT",
  );
}

function currentTarget(): InsertTarget {
  const selection = figma.currentPage.selection;
  if (selection.length === 0) return { kind: "create" };

  // Multi-edit / multi-select: every selected node is a text layer.
  const textNodes = selectedTextNodes();
  if (textNodes.length >= 2 && textNodes.length === selection.length) {
    return {
      kind: "text",
      nodeName: `${textNodes.length} layers`,
      count: textNodes.length,
    };
  }

  const node = selection[0];
  if (node.type === "INSTANCE") {
    return {
      kind: "instance",
      nodeName: node.name,
      textProps: instanceTextProps(node),
    };
  }
  if (node.type === "TEXT") {
    const propRef = node.componentPropertyReferences?.characters;
    return {
      kind: "text",
      nodeName: node.name,
      propName: propRef ? propRef.split("#")[0] : undefined,
    };
  }
  return { kind: "create" };
}

function findAncestorInstance(node: BaseNode): InstanceNode | null {
  let current: BaseNode | null = node.parent;
  while (current && current.type !== "PAGE") {
    if (current.type === "INSTANCE") return current;
    current = "parent" in current ? current.parent : null;
  }
  return null;
}

function postSelection() {
  post({ type: "selection", target: currentTarget() });
}

async function loadFontOrExplain(fontName: FontNameLike): Promise<FontName> {
  const font: FontName = { family: fontName.family, style: fontName.style };
  try {
    await figma.loadFontAsync(font);
    return font;
  } catch {
    throw new Error(
      `"${font.family} ${font.style}" isn't available in Figma — install the font first.`,
    );
  }
}

/**
 * Swap the layer to `fontName`, then set characters.
 *
 * Important: setting `.fontName` only requires the *new* font to be loaded.
 * We deliberately do not load the layer's current face first — outdated /
 * uninstalled kit fonts set `hasMissingFont`, and loading them throws, which
 * used to block the swap even though the shortcode could still update via a
 * component property.
 */
async function applyFontAndCharacters(
  node: TextNode,
  name: string,
  fontName: FontNameLike,
): Promise<void> {
  const font = await loadFontOrExplain(fontName);
  node.fontName = font;
  node.characters = name;
}

async function insertIntoTextNode(
  node: TextNode,
  name: string,
  fontName: FontNameLike,
): Promise<string> {
  await applyFontAndCharacters(node, name, fontName);
  return `Replaced text in "${node.name}" with "${name}"`;
}

async function insertAsNewLayer(
  name: string,
  fontName: FontNameLike,
): Promise<string> {
  const font = await loadFontOrExplain(fontName);
  const node = figma.createText();
  node.fontName = font;
  node.fontSize = 24;
  node.characters = name;
  node.name = name;
  const center = figma.viewport.center;
  node.x = Math.round(center.x - node.width / 2);
  node.y = Math.round(center.y - node.height / 2);
  figma.currentPage.selection = [node];
  return `Created a new "${name}" text layer`;
}

/** Text layers inside an instance that are bound to a given TEXT property. */
function findTextNodesForProp(
  instance: InstanceNode,
  propKey: string,
): TextNode[] {
  const results: TextNode[] = [];
  const walk = (node: SceneNode) => {
    if (node.type === "TEXT") {
      const ref = node.componentPropertyReferences?.characters;
      if (ref === propKey) results.push(node);
    }
    if ("children" in node) {
      for (const child of node.children) walk(child);
    }
  };
  for (const child of instance.children) walk(child);
  return results;
}

async function applyFontToBoundText(
  instance: InstanceNode,
  propKey: string,
  fontName: FontNameLike,
): Promise<void> {
  const bound = findTextNodesForProp(instance, propKey);
  if (bound.length === 0) return;
  // Only the destination face is required — same missing-kit case as
  // applyFontAndCharacters (old kit uninstalled after a kit refresh).
  const font = await loadFontOrExplain(fontName);
  for (const textNode of bound) {
    textNode.fontName = font;
  }
}

async function insertIntoInstance(
  instance: InstanceNode,
  name: string,
  propKey: string | undefined,
  fontName: FontNameLike,
): Promise<string> {
  const textProps = instanceTextProps(instance);
  if (textProps.length === 0) {
    throw new Error(`"${instance.name}" has no text properties to fill.`);
  }
  const prop = textProps.find((p) => p.key === propKey) ?? textProps[0];
  // Set the shortcode via the component property (never detach), then swap
  // the bound layer's font so kit / other-face glyphs actually render.
  instance.setProperties({ [prop.key]: name });
  await applyFontToBoundText(instance, prop.key, fontName);
  return `Set "${prop.label}" to "${name}" on "${instance.name}"`;
}

/** Insert into one text layer — via component prop when bound, else replace characters. */
async function insertIntoSelectedText(
  node: TextNode,
  name: string,
  fontName: FontNameLike,
): Promise<string> {
  const propRef = node.componentPropertyReferences?.characters;
  const instance = propRef ? findAncestorInstance(node) : null;
  if (propRef && instance) {
    return insertIntoInstance(instance, name, propRef, fontName);
  }
  return insertIntoTextNode(node, name, fontName);
}

async function handleInsert(
  name: string,
  fontName: FontNameLike,
  propKey: string | undefined,
): Promise<void> {
  try {
    const selection = figma.currentPage.selection;
    const textNodes = selectedTextNodes();
    let detail: string;

    // Figma multi-edit / multi-select text: write into every selected text layer.
    if (textNodes.length >= 2 && textNodes.length === selection.length) {
      await Promise.all(
        textNodes.map((node) => insertIntoSelectedText(node, name, fontName)),
      );
      detail = `Replaced text in ${textNodes.length} layers with "${name}"`;
    } else {
      const node = selection[0];
      if (node && node.type === "INSTANCE") {
        detail = await insertIntoInstance(node, name, propKey, fontName);
      } else if (node && node.type === "TEXT") {
        detail = await insertIntoSelectedText(node, name, fontName);
      } else {
        detail = await insertAsNewLayer(name, fontName);
      }
    }
    post({ type: "inserted", ok: true, detail });
    figma.notify(detail);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    post({ type: "inserted", ok: false, detail });
    figma.notify(detail, { error: true });
  }
}

figma.ui.onmessage = (message: UiToCodeMessage) => {
  if (message.type === "init") {
    postSelection();
    void postInstalledFaFonts();
    void postSettings();
    return;
  }
  if (message.type === "save-settings") {
    void saveSettings(message.settings);
    return;
  }
  if (message.type === "insert") {
    void handleInsert(message.name, message.fontName, message.propKey);
  }
};

figma.on("selectionchange", postSelection);
postSelection();
void postInstalledFaFonts();
