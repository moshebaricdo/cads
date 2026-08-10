(() => {
  // src/shared/messages.ts
  var EMPTY_SETTINGS = {
    fonts: [],
    preferredStyle: "Solid"
  };

  // src/code.ts
  figma.showUI(__html__, { width: 380, height: 540, themeColors: true });
  var SETTINGS_KEY = "settings";
  var KIT_CATALOG_KEY = "fa-kit-catalog";
  var GLYPH_CACHE_KEY = "fa-glyph-cache";
  async function postSettings() {
    var _a, _b;
    const stored = await figma.clientStorage.getAsync(SETTINGS_KEY);
    const settings = {
      fonts: (_a = stored == null ? void 0 : stored.fonts) != null ? _a : EMPTY_SETTINGS.fonts,
      preferredStyle: (_b = stored == null ? void 0 : stored.preferredStyle) != null ? _b : EMPTY_SETTINGS.preferredStyle,
      faApiToken: stored == null ? void 0 : stored.faApiToken,
      kitToken: stored == null ? void 0 : stored.kitToken,
      kitSyncedAt: stored == null ? void 0 : stored.kitSyncedAt
    };
    post({ type: "settings", settings });
  }
  async function postKitCatalog() {
    const catalog = await figma.clientStorage.getAsync(KIT_CATALOG_KEY);
    post({ type: "kit-catalog", catalog: catalog != null ? catalog : null });
  }
  async function postGlyphCache() {
    const cache = await figma.clientStorage.getAsync(GLYPH_CACHE_KEY);
    post({ type: "glyph-cache", cache: cache != null ? cache : null });
  }
  async function saveSettings(settings) {
    await figma.clientStorage.setAsync(SETTINGS_KEY, settings);
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
  function selectedTextNodes() {
    return figma.currentPage.selection.filter(
      (node) => node.type === "TEXT"
    );
  }
  function currentTarget() {
    var _a;
    const selection = figma.currentPage.selection;
    if (selection.length === 0) return { kind: "create" };
    const textNodes = selectedTextNodes();
    if (textNodes.length >= 2 && textNodes.length === selection.length) {
      return {
        kind: "text",
        nodeName: `${textNodes.length} layers`,
        count: textNodes.length
      };
    }
    const node = selection[0];
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
  async function applyFontAndCharacters(node, name, fontName) {
    const font = await loadFontOrExplain(fontName);
    node.fontName = font;
    node.characters = name;
  }
  async function insertIntoTextNode(node, name, fontName) {
    await applyFontAndCharacters(node, name, fontName);
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
  function findTextNodesForProp(instance, propKey) {
    const results = [];
    const walk = (node) => {
      var _a;
      if (node.type === "TEXT") {
        const ref = (_a = node.componentPropertyReferences) == null ? void 0 : _a.characters;
        if (ref === propKey) results.push(node);
      }
      if ("children" in node) {
        for (const child of node.children) walk(child);
      }
    };
    for (const child of instance.children) walk(child);
    return results;
  }
  async function applyFontToBoundText(instance, propKey, fontName) {
    const bound = findTextNodesForProp(instance, propKey);
    if (bound.length === 0) return;
    const font = await loadFontOrExplain(fontName);
    for (const textNode of bound) {
      textNode.fontName = font;
    }
  }
  async function insertIntoInstance(instance, name, propKey, fontName) {
    var _a;
    const textProps = instanceTextProps(instance);
    if (textProps.length === 0) {
      throw new Error(`"${instance.name}" has no text properties to fill.`);
    }
    const prop = (_a = textProps.find((p) => p.key === propKey)) != null ? _a : textProps[0];
    instance.setProperties({ [prop.key]: name });
    await applyFontToBoundText(instance, prop.key, fontName);
    return `Set "${prop.label}" to "${name}" on "${instance.name}"`;
  }
  async function insertIntoSelectedText(node, name, fontName) {
    var _a;
    const propRef = (_a = node.componentPropertyReferences) == null ? void 0 : _a.characters;
    const instance = propRef ? findAncestorInstance(node) : null;
    if (propRef && instance) {
      return insertIntoInstance(instance, name, propRef, fontName);
    }
    return insertIntoTextNode(node, name, fontName);
  }
  async function handleInsert(name, fontName, propKey) {
    try {
      const selection = figma.currentPage.selection;
      const textNodes = selectedTextNodes();
      let detail;
      if (textNodes.length >= 2 && textNodes.length === selection.length) {
        await Promise.all(
          textNodes.map((node) => insertIntoSelectedText(node, name, fontName))
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
  figma.ui.onmessage = (message) => {
    if (message.type === "init") {
      postSelection();
      void postInstalledFaFonts();
      void postSettings();
      void postKitCatalog();
      void postGlyphCache();
      return;
    }
    if (message.type === "save-settings") {
      void saveSettings(message.settings);
      return;
    }
    if (message.type === "notify") {
      figma.notify(message.message, message.error ? { error: true } : void 0);
      return;
    }
    if (message.type === "save-kit-catalog") {
      void (async () => {
        if (message.catalog) {
          await figma.clientStorage.setAsync(KIT_CATALOG_KEY, message.catalog);
        } else {
          await figma.clientStorage.deleteAsync(KIT_CATALOG_KEY);
        }
      })();
      return;
    }
    if (message.type === "save-glyph-cache") {
      void (async () => {
        if (message.cache) {
          await figma.clientStorage.setAsync(GLYPH_CACHE_KEY, message.cache);
        } else {
          await figma.clientStorage.deleteAsync(GLYPH_CACHE_KEY);
        }
      })();
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
