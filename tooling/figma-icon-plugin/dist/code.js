(() => {
  // src/shared/messages.ts
  var EMPTY_SETTINGS = { fonts: [] };

  // src/code.ts
  figma.showUI(__html__, { width: 380, height: 540, themeColors: true });
  var SETTINGS_KEY = "settings";
  async function postSettings() {
    var _a;
    const stored = await figma.clientStorage.getAsync(SETTINGS_KEY);
    const settings = {
      fonts: (_a = stored == null ? void 0 : stored.fonts) != null ? _a : EMPTY_SETTINGS.fonts
    };
    post({ type: "settings", settings });
  }
  async function saveSettings(settings) {
    await figma.clientStorage.setAsync(SETTINGS_KEY, settings);
    figma.notify("Settings saved");
  }
  function post(message) {
    figma.ui.postMessage(message);
  }
  async function postInstalledFaFonts() {
    var _a;
    const fonts = await figma.listAvailableFontsAsync();
    const byFamily = /* @__PURE__ */ new Map();
    for (const font of fonts) {
      const { family, style } = font.fontName;
      if (!/^font awesome/i.test(family)) continue;
      const styles = (_a = byFamily.get(family)) != null ? _a : [];
      if (!styles.includes(style)) styles.push(style);
      byFamily.set(family, styles);
    }
    const faFonts = Array.from(byFamily.entries()).map(
      ([family, styles]) => ({ family, styles })
    );
    post({ type: "fonts", faFonts });
  }
  function instanceTextProps(instance) {
    const props = [];
    let properties;
    try {
      properties = instance.componentProperties;
    } catch (e) {
      return props;
    }
    for (const [key, definition] of Object.entries(properties)) {
      if (definition.type === "TEXT") {
        props.push({
          key,
          label: key.split("#")[0],
          value: String(definition.value)
        });
      }
    }
    return props;
  }
  function currentTarget() {
    var _a;
    const node = figma.currentPage.selection[0];
    if (!node) return { kind: "create" };
    if (node.type === "INSTANCE") {
      return {
        kind: "instance",
        nodeName: node.name,
        textProps: instanceTextProps(node)
      };
    }
    if (node.type === "TEXT") {
      const propRef = (_a = node.componentPropertyReferences) == null ? void 0 : _a.characters;
      return {
        kind: "text",
        nodeName: node.name,
        propName: propRef ? propRef.split("#")[0] : void 0
      };
    }
    return { kind: "create" };
  }
  function findAncestorInstance(node) {
    let current = node.parent;
    while (current && current.type !== "PAGE") {
      if (current.type === "INSTANCE") return current;
      current = "parent" in current ? current.parent : null;
    }
    return null;
  }
  function postSelection() {
    post({ type: "selection", target: currentTarget() });
  }
  async function loadFontOrExplain(fontName) {
    const font = { family: fontName.family, style: fontName.style };
    try {
      await figma.loadFontAsync(font);
      return font;
    } catch (e) {
      throw new Error(
        `"${font.family} ${font.style}" isn't available in Figma \u2014 install the font first.`
      );
    }
  }
  async function loadExistingFonts(node) {
    const fonts = node.characters.length > 0 ? node.getRangeAllFontNames(0, node.characters.length) : [node.fontName];
    await Promise.all(fonts.map((font) => figma.loadFontAsync(font)));
  }
  async function insertIntoTextNode(node, name, fontName) {
    const [font] = await Promise.all([
      loadFontOrExplain(fontName),
      loadExistingFonts(node)
    ]);
    node.fontName = font;
    node.characters = name;
    return `Replaced text in "${node.name}" with "${name}"`;
  }
  async function insertAsNewLayer(name, fontName) {
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
  async function insertIntoInstance(instance, name, propKey) {
    var _a;
    const textProps = instanceTextProps(instance);
    if (textProps.length === 0) {
      throw new Error(`"${instance.name}" has no text properties to fill.`);
    }
    const prop = (_a = textProps.find((p) => p.key === propKey)) != null ? _a : textProps[0];
    instance.setProperties({ [prop.key]: name });
    return `Set "${prop.label}" to "${name}" on "${instance.name}"`;
  }
  async function handleInsert(name, fontName, propKey) {
    var _a;
    try {
      const node = figma.currentPage.selection[0];
      let detail;
      if (node && node.type === "INSTANCE") {
        detail = await insertIntoInstance(node, name, propKey);
      } else if (node && node.type === "TEXT") {
        const propRef = (_a = node.componentPropertyReferences) == null ? void 0 : _a.characters;
        const instance = propRef ? findAncestorInstance(node) : null;
        detail = propRef && instance ? await insertIntoInstance(instance, name, propRef) : await insertIntoTextNode(node, name, fontName);
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
  figma.ui.onmessage = (message) => {
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
})();
