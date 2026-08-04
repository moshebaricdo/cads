/**
 * FontAwesome Glyphs — plugin main thread.
 *
 * Inserts FA shortcodes as *text* (never vectors), so component instances are
 * never detached and text-scoped semantic color variables keep working:
 *  1. Instance selected  → set a TEXT component property (sidebar prop).
 *  2. Text layer selected → replace its characters with the shortcode.
 *  3. Nothing selected    → create a new FA text layer at the viewport center.
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

function currentTarget(): InsertTarget {
  const node = figma.currentPage.selection[0];
  if (!node) return { kind: "create" };
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

async function loadExistingFonts(node: TextNode): Promise<void> {
  const fonts =
    node.characters.length > 0
      ? node.getRangeAllFontNames(0, node.characters.length)
      : [node.fontName as FontName];
  await Promise.all(fonts.map((font) => figma.loadFontAsync(font)));
}

async function insertIntoTextNode(
  node: TextNode,
  name: string,
  fontName: FontNameLike,
): Promise<string> {
  const [font] = await Promise.all([
    loadFontOrExplain(fontName),
    loadExistingFonts(node),
  ]);
  node.fontName = font;
  node.characters = name;
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

async function insertIntoInstance(
  instance: InstanceNode,
  name: string,
  propKey: string | undefined,
): Promise<string> {
  const textProps = instanceTextProps(instance);
  if (textProps.length === 0) {
    throw new Error(`"${instance.name}" has no text properties to fill.`);
  }
  const prop = textProps.find((p) => p.key === propKey) ?? textProps[0];
  instance.setProperties({ [prop.key]: name });
  return `Set "${prop.label}" to "${name}" on "${instance.name}"`;
}

async function handleInsert(
  name: string,
  fontName: FontNameLike,
  propKey: string | undefined,
): Promise<void> {
  try {
    const node = figma.currentPage.selection[0];
    let detail: string;
    if (node && node.type === "INSTANCE") {
      detail = await insertIntoInstance(node, name, propKey);
    } else if (node && node.type === "TEXT") {
      // Prop-bound text inside an instance: set the property (don't detach / edit internals).
      const propRef = node.componentPropertyReferences?.characters;
      const instance = propRef ? findAncestorInstance(node) : null;
      detail =
        propRef && instance
          ? await insertIntoInstance(instance, name, propRef)
          : await insertIntoTextNode(node, name, fontName);
    } else {
      detail = await insertAsNewLayer(name, fontName);
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
