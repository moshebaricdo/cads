(() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));

  // src/shared/messages.ts
  var EMPTY_SETTINGS = {
    libraryName: null,
    ai: null,
    mappingCache: {},
    capturedStyles: null
  };

  // src/data/cadsCatalog.ts
  var PRIMITIVE_COLOR_COLLECTIONS = ["Primitive Colors"];
  var PRIMITIVE_COLLECTION_PATTERN = /primitive/i;
  var TYPOGRAPHY_COLLECTIONS = ["Typography"];
  var TYPOGRAPHY_COLLECTION_PATTERN = /typograph|font/i;
  var SHAPE_COLLECTIONS = ["Spacing & Shape"];
  var SHAPE_COLLECTION_PATTERN = /shape|radius/i;
  function isPrimitiveColorCollection(name) {
    return PRIMITIVE_COLOR_COLLECTIONS.includes(name) || PRIMITIVE_COLLECTION_PATTERN.test(name);
  }
  function isTypographyCollection(name) {
    return TYPOGRAPHY_COLLECTIONS.includes(name) || TYPOGRAPHY_COLLECTION_PATTERN.test(name);
  }
  function isShapeCollection(name) {
    return SHAPE_COLLECTIONS.includes(name) || SHAPE_COLLECTION_PATTERN.test(name);
  }
  function isShapeVariable(name) {
    return /^shape(?:[\/\s_-]|$)/i.test(name.trim());
  }
  var cadsComponents = [
    { name: "Swatch", key: "f6bdac32861511490d279a865fe3b7ccce206d59" },
    { name: "Shadow Swatch", key: "1dd3fa7788620b6c6cdc0d91bcc2bcfb620c6947" },
    { name: "Button", key: "2507b18076b4066c6ff738539115b36a798fd707" },
    { name: "Close Icon Button", key: "c492ad784f39078a3067dde33f2be223d6e30903" },
    { name: "Segmented Button Group", key: "bf599e1bc1d1e651be6aab5bf90ac6a7c26dcfd1" },
    { name: "Segmented Button Block", key: "d8dbdc672ccdc6755ae409e31e5517571424384e" },
    { name: "Icon Toggle + Label", key: "c8bfea2113bc7284cb7ca4b6f407673b945098a8" },
    { name: "Icon Toggle", key: "d08929d02e63b3b286690e87d791199e4545126f" },
    { name: "Field Wrapper", key: "a76313f790928233bb8afabe35bd6f76f6e9a473" },
    { name: "Text Input Building Block", key: "adac7e7bcbeece4cd3ed6f7cd77d7664ea3c9f9e" },
    { name: "Text Input", key: "ba50b76d3e6bc3730fcd2b6389ab2c5306a1c3d4" },
    { name: "Dropdown Menu Item", key: "0f55c81572c70c444efe57746a0bdd095a13633f" },
    { name: "Dropdown Menu List", key: "70c564795ec93c0c6877771cbb277d12698b9481" },
    { name: "Dropdown Button", key: "761c27fdfe664fefad954bf6ecba3e8f6434642d" },
    { name: "Dropdown", key: "d3660d988bcb4702c24ce921128e32cadb6618db" },
    { name: "menuSeparator", key: "cb73840d7ff0d685eed4391d028dbbf20a82ab4f" },
    { name: "menuOptGroup", key: "9eee80af965846ba0305acdd45f7422783fd464c" },
    { name: "Checkbox", key: "3f026982c964b46ca62aab9efcee3a18e12310c3" },
    { name: "Checkbox + Label", key: "503f333f3195d96aa1659225c533b00567e90863" },
    { name: "Radio Buttons Block", key: "a0976858102d86735eb2ef82d3a1efd8f8972ec4" },
    { name: "Radio Button + Label", key: "dae7e8825645a8ec83b8593ab666788be4593ab8" },
    { name: "Toggle", key: "9e957e7fd931d5d068ffecb6f68531d9ebd5ce7c" },
    { name: "Toggle + Label", key: "13f4f08ad10787f9c7c557c0139b200f4d8864a8" },
    { name: "Slider Bar", key: "e5f37ae87fd1f9e92967e6942f11ece4cb3358c9" },
    { name: "Slider Knob", key: "6548f0f89bb01390ce2b273756df118b9fb7a694" },
    { name: "Slider", key: "7659dd566886ab8e61de1cf5c73ff039928b6553" },
    { name: "Slider Stepper", key: "6b0a02539c86256c305835a6a401d7df535fdf14" },
    { name: "Chip", key: "388cba2ed6150b2a9b448f1895ed2f04ca90edb2" },
    { name: "Chip Group", key: "65c61f6f006c06e27b293ca8f5e573d650c69c06" },
    { name: "Link", key: "87b099a460c3dad155731d3983e7ccfecefc5975" },
    { name: "Breadcrumb Overflow", key: "cf5fe5c10ba6e9963eb4415d3527518d282e58fe" },
    { name: "Breadcrumb Separators", key: "4dd84636f0acaca75cb5ec10b2619bc8a27017bf" },
    { name: "Breadcrumb Links", key: "316cd105723e39b3784ddea7d5a376d2200f0276" },
    { name: "Breadcrumbs", key: "43afede0abfd158d2c740e2801b46d13e570a8d0" },
    { name: "Tab Item", key: "6bdc7c7da3d1d1193ec90ba2bf1d52c03cf01e39" },
    { name: "Tab Group", key: "b49fe2d463645f88551c83bd8bff0ab56fcde35e" },
    { name: "Pagination", key: "9f27562cc11f74ff5019ad281149a183c1510ecf" },
    { name: "Alert", key: "dbe516b76486882d3508633715c5e4e999c183db" },
    { name: "Toast", key: "29c36f3d7ec051b81e7dc42a724d9097a680f2ee" },
    { name: "Notification Banner", key: "5f158e59f1188b62d671448be304f22d3a7bde42" },
    { name: "Tag", key: "e4a964357b1eaedfab777db89058ccb4d528ec1c" },
    { name: "Icon Tooltip", key: "2136f83f6a3b9e32d1687b074eda81b74c13b186" },
    { name: "Tooltip", key: "8f604de25a1742f20b6e6f1dd3680bdfdbda2234" },
    { name: "Popover Core", key: "fd92669ea0ca99032fb0015773546ec204c201ff" },
    { name: "Popover", key: "b524d42ecd329068d1cfa45de2b79e874f9f6cf0" },
    { name: "Drawer", key: "b2cd3a35f20d344f38d677d0dfd992d64f503b87" },
    { name: "Dialog", key: "75feff93418c9804cbd3075e8a7f85bce1a5ff1e" },
    { name: "Modal", key: "0fe4d86d9d16ed81da4f995fc1e8fae90f7cf0e5" },
    { name: "Content Divider", key: "6ea2e127b9d3a2356cfcefaf9adc63b0c09df665" },
    { name: "Video", key: "7fd25c618006034331bfd8e0af3786286b1501c1" },
    { name: "Play Button", key: "9c6e3edf9310a94ca86851ff2662e5296870d6d7" },
    { name: "Carousal Nav Buttons", key: "fdfaadbc629a3be3a35614710c9aca70fea61fc1" },
    { name: "Pagination Dots", key: "75b8ec13b1ce224a04602731f236baf65fe7acdf" },
    { name: "Pagination Group", key: "da5d7d85ffcb0a10be3ac17ac7af5de3a7e85d46" },
    { name: "Carousel", key: "948e3bd4e20a36239d03c25c5047755c420e4a12" },
    { name: "Action Block", key: "95ccfd1d74eddccc93c855ab5bdb6f0e106cc174" },
    { name: "Action Block Group", key: "12f091dc2dfbdbc52e2af65515b9e446e299dcb8" },
    { name: "Action Block Carousel", key: "a6e6ff2f0292f164287408f13af685c34523d2c4" },
    { name: "Lab Nav", key: "d55c0edf1cdf9da3fbf0ed7874cd8b0412dc5dc0" },
    { name: "lesson metadata", key: "7d8941155e574f6974d13ca665a3287b0e82d57f" },
    { name: "Footer", key: "b3c9f21d2b5b988b32fd9494695ce40e48b21b1e" },
    { name: "Footer", key: "e02ff15b18fec8ac1ddbb7517bb04235675d0879" },
    { name: "Sidebar V2", key: "a2f4af3436221940c13404ae7201bf3151cb40e7" },
    { name: "Sidebar Tab Item V2", key: "f0272599a858b7b4f5c0e3f5155fe696324e4416" },
    { name: "Sidebar Control", key: "a7251af1ab08bcc859eec25ce5ccaad43efa83db" },
    { name: "Sidebar Tab Group V2", key: "2522edcc270a34403f65cccfe596464f5086b13f" },
    { name: "File Manager V2", key: "abb54f5f763ce07b0013c77610be9284aa76c7cb" },
    { name: "File Item", key: "fab16010bc26130ca9812bd19e67c33ff02306cc" },
    { name: "File Item Icons", key: "031b78440362d1725ee2541876e770b3fe74ef3a" },
    { name: "File Tab Row Item", key: "9ef24ef709b07a90e4519db55ecfb53c2e04a7ba" },
    { name: "Panel Header V2", key: "fed5f8b995c5b598a033c5068316f3a1857793ad" },
    { name: "Panel Header Building Block", key: "3deb83c08dbb6ec9731beacb41afc7bb02e541b0" },
    { name: "Resize Handle", key: "ad8f55903b9e05ebb90bf62be928a8a3c8b79b5d" },
    { name: "AI Tutor Chat Input", key: "6b24728a35b36a560fa1a078f47416e7bb0481e9" },
    { name: "AI Chat Messages", key: "5df8b5202273c79891767beb6ba7bd6c55e1b4b0" },
    { name: "AI Chat File Chip", key: "6115fa90ad8516c35630a89a3dfb31c724d5c2d9" },
    { name: "AI Shortcut Chip", key: "c3750d3440beb1d5a90a7ac8d38070f43b446a61" },
    { name: "AI Support Indicator", key: "dc266a0e284b4ce45df247eb561d49a8dc34011d" },
    { name: "AI File Chip Close Button", key: "2acbc590b735b611c8ba6e6c8a86adb8d3ac9275" },
    { name: "AI Chat File Item", key: "fe3226e7d739fa31c14ef3ae414ac909c049a77b" },
    { name: "AI Chat File Chip", key: "2d79bdb562eb8dfd06541936a1e172fc45744a51" },
    { name: "Font Awesome Icon v7", key: "a12ee7f3f8351e10c18d87a72faa3029fbe11622" },
    { name: "Font Awesome Duotone Icon v7", key: "602c2b566f07ec87710b9ba8a9609dab2e87d53e" },
    { name: "resourceItem", key: "49ac972ae6bd99f2b8cee0fbf7227b7619b123a5" },
    { name: "Size", key: "a7839503584b5ff2a946861a85e26fe080b5393c" },
    { name: "Bracket Guide", key: "e7f6bc9973fb3094855d4b6f4aba50526c8d0265" },
    { name: "Header", key: "67c596ff289a71901524fd7186a6f0ddafc34b80" }
  ];
  var cadsComponentKeys = new Set(cadsComponents.map((c) => c.key));

  // src/main/values.ts
  function rgbaToHex(value) {
    const to2 = (n) => Math.round(Math.max(0, Math.min(1, n)) * 255).toString(16).padStart(2, "0");
    const base = `#${to2(value.r)}${to2(value.g)}${to2(value.b)}`;
    const a = "a" in value ? value.a : 1;
    return a >= 1 ? base : `${base}${to2(a)}`;
  }
  function isAlias(value) {
    return typeof value === "object" && value !== null && "type" in value && value.type === "VARIABLE_ALIAS";
  }
  function isColor(value) {
    return typeof value === "object" && value !== null && "r" in value && "g" in value;
  }
  var variableCache = /* @__PURE__ */ new Map();
  var collectionCache = /* @__PURE__ */ new Map();
  async function getVariableCached(id) {
    var _a;
    if (!variableCache.has(id)) {
      try {
        variableCache.set(id, await figma.variables.getVariableByIdAsync(id));
      } catch (e) {
        variableCache.set(id, null);
      }
    }
    return (_a = variableCache.get(id)) != null ? _a : null;
  }
  async function getCollectionCached(id) {
    var _a;
    if (!collectionCache.has(id)) {
      try {
        collectionCache.set(
          id,
          await figma.variables.getVariableCollectionByIdAsync(id)
        );
      } catch (e) {
        collectionCache.set(id, null);
      }
    }
    return (_a = collectionCache.get(id)) != null ? _a : null;
  }
  async function resolveRaw(variable, modeId, modeName, depth) {
    var _a;
    if (depth > 8) return null;
    const value = variable.valuesByMode[modeId];
    if (value === void 0) return null;
    if (!isAlias(value)) return value;
    const target = await getVariableCached(value.id);
    if (!target) return null;
    const targetCollection = await getCollectionCached(target.variableCollectionId);
    if (!targetCollection) return null;
    const preferred = (_a = targetCollection.modes.find(
      (m) => m.name.toLowerCase() === modeName.toLowerCase()
    )) != null ? _a : targetCollection.modes[0];
    if (!preferred) return null;
    return resolveRaw(target, preferred.modeId, preferred.name, depth + 1);
  }
  async function resolveDisplayValues(variable, collection) {
    const out = {};
    for (const mode of collection.modes) {
      const value = await resolveRaw(variable, mode.modeId, mode.name, 0);
      if (value === null) continue;
      if (isColor(value)) out[mode.name] = rgbaToHex(value);
      else out[mode.name] = String(value);
    }
    return out;
  }

  // src/data/cadsTextStyles.ts
  var bakedTextStyles = [
    { name: "Heading/H1/Bold", key: "936275bca7e31fcfad3aba20d6dcacb1e84a39d0" },
    { name: "Heading/H1/Semi Bold", key: "eeb8780a5f3b4e44b1d476dab09a923f74e8b85a" },
    { name: "Heading/H1/Regular", key: "36e0a0364f9c0864b207ab218fed4d70faa77805" },
    { name: "Heading/H2/Bold", key: "ee4a41c8ef2f03dc6fa1fb90fdd9c6c053983e3e" },
    { name: "Heading/H2/Semi Bold", key: "4859ddaef7ab555451a01831fc85be40e955e12f" },
    { name: "Heading/H2/Regular", key: "a29cc53643fd93332025892ae7e5b633977a18a0" },
    { name: "Heading/H3/Bold", key: "91de6a70a40e86cb439b8053b4ab3ef19c2d9282" },
    { name: "Heading/H3/Semi Bold", key: "aa56723a3e2910f2d17040c823d1742dd35d312a" },
    { name: "Heading/H3/Regular", key: "e513f6907d4000066d236547be3396042aa91e0d" },
    { name: "Heading/H4/Bold", key: "354aff496e2178600cb77ac80680f47e03b459fc" },
    { name: "Heading/H4/Semi Bold", key: "e3379936dabc9f7ecb3ec78a0f293cb1b9b667c0" },
    { name: "Heading/H4/Regular", key: "9a38933ce643083080aec0de36c48805151ee56f" },
    { name: "Heading/H5/Bold", key: "25457cea42ad27b27257a9df323afbec5e7287f7" },
    { name: "Heading/H5/Semi Bold", key: "509bc8bc8825196715b7494d188a0ff36c7a09fe" },
    { name: "Heading/H5/Regular", key: "9b2f63202457c8cf0e0fc54b17f6780c36815ddb" },
    { name: "Heading/H6/Bold", key: "742f9cb42298d3ff17411016f56aea4586b6e9f6" },
    { name: "Heading/H6/Semi Bold", key: "c750a284d17da1e7717eaf3492a2697fc6060d47" },
    { name: "Heading/H6/Regular", key: "5bab8fa17cbbdb8c7691b35b149f7d0606072ccc" },
    { name: "Body/Body 1/Bold", key: "d24f45b078c7b991bb846d53f5aac5e8736b0470" },
    { name: "Body/Body 1/Semi Bold", key: "bd41dcde8355282c93c91e3cab2c02d3d92790d9" },
    { name: "Body/Body 1/Medium", key: "2bcd6d624069a2f1f390e99528e62b8d3c49e253" },
    { name: "Body/Body 1/Regular", key: "01088fd0d3bb6d67baf9deec532326c3d93563f1" },
    { name: "Body/Body 2/Bold", key: "52364c4caf5b56d26b269538cf8446981a8b63aa" },
    { name: "Body/Body 2/Semi Bold", key: "e001af2a0bdaf201dedd5dd568ba920e3d189c27" },
    { name: "Body/Body 2/Regular", key: "710f3598e4bad0482f28fc1d16098dc7c2f21760" },
    { name: "Body/Body 3/Bold", key: "616ebf11fc8918de70450eea30afd6a61a3ca822" },
    { name: "Body/Body 3/Semi Bold", key: "71da1c2a8606f1e3e2e9f5961aa3eec6f1b02601" },
    { name: "Body/Body 3/Regular", key: "e5518262333dab367830a5a016af98f330963e02" },
    { name: "Body/Body 4/Bold", key: "bd980d39eb7c9e2e7efd776fe6399027669f65b9" },
    { name: "Body/Body 4/Semi Bold", key: "4ba37196725defc9d706ac74682ed276b1beff33" },
    { name: "Body/Body 4/Regular", key: "d1b1e768bb3b7c02901ec3420f2027a880107617" },
    { name: "Body/Body 5/Bold", key: "03d228e7a51cd6be106a7ea841b14e9c1dbac101" },
    { name: "Body/Body 5/Semi Bold", key: "7237176ce7f48a12615b2121cd64f4af4a82ea29" },
    { name: "Body/Body 5/Regular", key: "c003c38c50e105d4b5cf9880a6d394bb38054979" },
    { name: "Overline/Overline 1", key: "975152cd057fa073f9c6477c148c63aa24a1b30d" },
    { name: "Overline/Overline 2", key: "2040e6bce25742ecba0d5793a3ef057175e2f87a" },
    { name: "Overline/Overline 3", key: "5b770b696b963399ffb7eab39ec31c29845ec870" },
    { name: "Link/Link 1", key: "6d900fefb3dcfbe6cf7f3a59f13ea0372d223eb9" },
    { name: "Link/Link 2", key: "0fd1876852152c84a4c877ecbba3d6d2d84a3f72" },
    { name: "Link/Link 3", key: "bf84c7488010bf79e185b4b20570cfec19c3e85f" },
    { name: "Link/Link 4", key: "c02a248fa1df7d283036b4455c2bd927c0f2a827" },
    { name: "Link/Link 5", key: "beb95c9d77ba0d60e4bf4460fccf29ef07df2766" },
    { name: "Label/Label 1", key: "fe2c80bbc480ade00a6f96b78eb9bab9a6e99d0a" },
    { name: "Label/Label 2", key: "4ab9224934eb0971c2d8f3ee6e3afa96884350cc" },
    { name: "Label/Label 3", key: "a10cfc3a7f9fd8a5d48d542ce15f1731178a2b96" },
    { name: "Label/Label 4", key: "abeb47e031721ba87b6f02dacb97cf134d6ec679" },
    { name: "Mono/Mono 1/Bold", key: "ac4881d7168dda5130f0b32986b5825d67e9dede" },
    { name: "Mono/Mono 1/Semi Bold", key: "a22bc52ca9cb217d46632f0adb45014e49aa741b" },
    { name: "Mono/Mono 1/Regular", key: "73fb0fcdf6523657b059a6a817fd9bd9738afdac" },
    { name: "Mono/Mono 2/Bold", key: "2a0c58da534f6729be26b1ab3aa9292953ab1a3d" },
    { name: "Mono/Mono 2/Semi Bold", key: "33179c970fb0137403651d4337a9ce6ac145c6a9" },
    { name: "Mono/Mono 2/Regular", key: "70f524e3583cd925a4f568867ce45b518ee6554e" },
    { name: "Mono/Mono 3/Bold", key: "2c41ba0c03e7ff8276da8bbe0708470fd4060a19" },
    { name: "Mono/Mono 3/Semi Bold", key: "f812668bf29f513096ba7b2aea6c18b5dc53bf7b" },
    { name: "Mono/Mono 3/Regular", key: "f70b9597f25d6788360e55f7f8a92b3ac86d5a04" },
    { name: "Mono/Mono 4/Bold", key: "5aecda1875c7deb6d23419745912b0544d66a12a" },
    { name: "Mono/Mono 4/Semi Bold", key: "699bbc87b7931f42cee5a83677270242e4c45b3e" },
    { name: "Mono/Mono 4/Regular", key: "fd118029c9d5a04d0edd96b8a5620397ea2a76c8" },
    { name: "Mono/Mono 5/Bold", key: "dd8525c07de2f6943c82b6aa35d98e32d47de6c5" },
    { name: "Mono/Mono 5/Semi Bold", key: "c3dc3744760afef7dc1abb6d8b82eae7f5392eca" },
    { name: "Mono/Mono 5/Regular", key: "873b38e48e5381d9b5656e5b6e948f3d97a6f63c" }
  ];

  // src/main/styles.ts
  function textStyleValues(style) {
    const values = {
      family: style.fontName.family,
      weight: style.fontName.style,
      size: String(style.fontSize)
    };
    const lh = style.lineHeight;
    if (lh.unit === "PIXELS") values.lineHeight = `${lh.value}px`;
    else if (lh.unit === "PERCENT") values.lineHeight = `${Math.round(lh.value)}%`;
    else values.lineHeight = "auto";
    return values;
  }
  async function buildStyleCatalog(captured, onProgress) {
    var _a;
    const source = captured ? "captured" : bakedTextStyles.length > 0 ? "baked" : "none";
    const known = (_a = captured == null ? void 0 : captured.styles) != null ? _a : bakedTextStyles;
    const textStyles = [];
    const importedByKey = /* @__PURE__ */ new Map();
    let done = 0;
    onProgress(0, known.length);
    await new Promise((resolve) => setTimeout(resolve, 0));
    for (const entry of known) {
      try {
        const style = await figma.importStyleByKeyAsync(entry.key);
        if (style.type === "TEXT") {
          importedByKey.set(entry.key, style);
          textStyles.push({
            key: entry.key,
            name: style.name,
            values: textStyleValues(style)
          });
        }
      } catch (e) {
      }
      done++;
      if (done % 5 === 0 || done === known.length) {
        onProgress(done, known.length);
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }
    onProgress(known.length, known.length);
    return { textStyles, importedByKey, source };
  }

  // src/main/audit.ts
  var LOCAL_LIBRARY = "This file";
  var UNKNOWN_LIBRARY = "Unknown library (not enabled)";
  var cadsComponentNameByNormalized = new Map(
    cadsComponents.map((component) => [
      component.name.trim().toLocaleLowerCase(),
      component.name
    ])
  );
  function isFontAwesomeFamily(family) {
    return /^font awesome\b/i.test(family.trim());
  }
  function isFontAwesome7Family(family) {
    return /^font awesome\s+7\b/i.test(family.trim());
  }
  var SKIP_FIELDS = /* @__PURE__ */ new Set([
    "fills",
    "strokes",
    "effects",
    "textRangeFills",
    "textRangeStrokes",
    "componentProperties",
    "layoutGrids"
  ]);
  var RADIUS_FIELDS = [
    "topLeftRadius",
    "topRightRadius",
    "bottomLeftRadius",
    "bottomRightRadius"
  ];
  function isAliasLike(value) {
    return typeof value === "object" && value !== null && value.type === "VARIABLE_ALIAS" && typeof value.id === "string";
  }
  function isEffectivelyHidden(node) {
    let current = node;
    while (current && current.type !== "PAGE" && current.type !== "DOCUMENT") {
      if ("visible" in current && current.visible === false) return true;
      current = current.parent;
    }
    return false;
  }
  function hasComponentAncestor(node) {
    let current = node.parent;
    while (current && current.type !== "PAGE" && current.type !== "DOCUMENT") {
      if (current.type === "COMPONENT" || current.type === "COMPONENT_SET" || current.type === "INSTANCE") {
        return true;
      }
      current = current.parent;
    }
    return false;
  }
  function isColorFinding(entry) {
    if (entry.resolvedType !== "COLOR") return false;
    if (entry.flag === "primitive") return true;
    return !entry.isSourceOfTruth;
  }
  function isTypographyVariableFinding(entry) {
    return entry.flag === "typographyVariable";
  }
  function isShapeVariableFinding(entry) {
    return entry.flag === "shapeVariable" && (!entry.isSourceOfTruth || !isShapeCollection(entry.collectionName));
  }
  function isRadiusUsage(usage) {
    return usage.prop.kind === "field" && RADIUS_FIELDS.includes(usage.prop.field);
  }
  async function auditSelection({ sotLibraryName: sotLibraryName2, sotStyleKeys }, onProgress) {
    var _a, _b;
    const selection = figma.currentPage.selection;
    if (selection.length === 0) {
      throw new Error("Select at least one frame to audit.");
    }
    const libraryByCollectionKey = /* @__PURE__ */ new Map();
    try {
      const libraryCollections = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
      for (const c of libraryCollections) {
        libraryByCollectionKey.set(c.key, c.libraryName);
      }
    } catch (e) {
    }
    const entries = /* @__PURE__ */ new Map();
    const paintStyles = /* @__PURE__ */ new Map();
    const rawPaints = /* @__PURE__ */ new Map();
    const textStyles = /* @__PURE__ */ new Map();
    const rawTexts = /* @__PURE__ */ new Map();
    const fontAwesomeTexts = /* @__PURE__ */ new Map();
    const rawRadii = /* @__PURE__ */ new Map();
    const components = /* @__PURE__ */ new Map();
    const detachedComponents = /* @__PURE__ */ new Map();
    const styleCache = /* @__PURE__ */ new Map();
    const paintStyleCache = /* @__PURE__ */ new Map();
    const explicitModes = [];
    const styledTextNodeIds = /* @__PURE__ */ new Set();
    const fontAwesomeNodeIds = /* @__PURE__ */ new Set();
    const typographyVariableNodeIds = /* @__PURE__ */ new Set();
    let mixedTextSkipped = 0;
    let mixedStyleSkipped = 0;
    let nodesScanned = 0;
    let visibleNodesScanned = 0;
    let compliancePasses = 0;
    let complianceWarnings = 0;
    function recordCompliance(passed, hidden = false) {
      if (hidden) return;
      if (passed) compliancePasses++;
      else complianceWarnings++;
    }
    function recordVariableCompliance(entry, hidden) {
      if (entry.flag === "typographyVariable") {
        recordCompliance(false, hidden);
        return;
      }
      if (entry.flag === "shapeVariable") {
        recordCompliance(!isShapeVariableFinding(entry), hidden);
        return;
      }
      if (entry.resolvedType === "COLOR") {
        recordCompliance(!isColorFinding(entry), hidden);
      }
    }
    async function getTextStyle(styleId) {
      var _a2;
      if (!styleCache.has(styleId)) {
        try {
          const style = await figma.getStyleByIdAsync(styleId);
          styleCache.set(
            styleId,
            style && style.type === "TEXT" ? style : null
          );
        } catch (e) {
          styleCache.set(styleId, null);
        }
      }
      return (_a2 = styleCache.get(styleId)) != null ? _a2 : null;
    }
    async function getPaintStyle(styleId) {
      var _a2;
      if (!paintStyleCache.has(styleId)) {
        try {
          const style = await figma.getStyleByIdAsync(styleId);
          paintStyleCache.set(
            styleId,
            style && style.type === "PAINT" ? style : null
          );
        } catch (e) {
          paintStyleCache.set(styleId, null);
        }
      }
      return (_a2 = paintStyleCache.get(styleId)) != null ? _a2 : null;
    }
    async function visitText(node) {
      const usage = {
        nodeId: node.id,
        nodeName: node.name,
        nodeType: node.type,
        prop: { kind: "textStyle" },
        inInstance: false,
        hidden: isEffectivelyHidden(node)
      };
      const styleId = node.textStyleId;
      if (styleId === figma.mixed) {
        mixedStyleSkipped++;
        return;
      }
      if (node.fontName !== figma.mixed && node.fontSize !== figma.mixed) {
        const font2 = node.fontName;
        const size2 = node.fontSize;
        if (isFontAwesomeFamily(font2.family)) {
          fontAwesomeNodeIds.add(node.id);
          if (isFontAwesome7Family(font2.family)) {
            recordCompliance(true, usage.hidden);
            return;
          }
          const id2 = `fontawesome:${font2.family}/${font2.style}/${size2}`;
          const existing2 = fontAwesomeTexts.get(id2);
          if (existing2) {
            existing2.usages.push(usage);
          } else {
            fontAwesomeTexts.set(id2, {
              id: id2,
              label: `${font2.family} ${font2.style}`,
              values: {
                family: font2.family,
                weight: font2.style,
                size: String(size2)
              },
              usages: [usage]
            });
          }
          recordCompliance(false, usage.hidden);
          return;
        }
      }
      if (styleId) {
        styledTextNodeIds.add(node.id);
        const id2 = `style:${styleId}`;
        const existing2 = textStyles.get(id2);
        if (existing2) {
          existing2.usages.push(usage);
          recordCompliance(existing2.isSourceOfTruth, usage.hidden);
          return;
        }
        const style = await getTextStyle(styleId);
        if (!style) return;
        const entry = {
          id: id2,
          styleId,
          styleKey: style.key,
          name: style.name,
          remote: style.remote,
          isSourceOfTruth: sotStyleKeys.has(style.key),
          values: textStyleValues(style),
          usages: [usage]
        };
        textStyles.set(id2, entry);
        recordCompliance(entry.isSourceOfTruth, usage.hidden);
        return;
      }
      if (node.fontName === figma.mixed || node.fontSize === figma.mixed) {
        mixedStyleSkipped++;
        return;
      }
      const font = node.fontName;
      const size = node.fontSize;
      const id = `font:${font.family}/${font.style}/${size}`;
      const existing = rawTexts.get(id);
      if (existing) {
        existing.usages.push(usage);
        return;
      }
      const values = {
        family: font.family,
        weight: font.style,
        size: String(size)
      };
      const lh = node.lineHeight;
      if (lh !== figma.mixed) {
        if (lh.unit === "PIXELS") values.lineHeight = `${lh.value}px`;
        else if (lh.unit === "PERCENT") values.lineHeight = `${Math.round(lh.value)}%`;
        else values.lineHeight = "auto";
      }
      rawTexts.set(id, {
        id,
        label: `${font.family} ${font.style} ${size}`,
        values,
        usages: [usage]
      });
    }
    async function recordVariableUsage(variableId, usage) {
      var _a2, _b2;
      const id = `var:${variableId}`;
      const existing = entries.get(id);
      if (existing) {
        if (existing.flag === "shapeVariable" && !isRadiusUsage(usage)) return;
        if (isRadiusUsage(usage)) {
          if (existing.flag !== "shapeVariable") existing.usages = [];
          existing.flag = "shapeVariable";
          if (existing.usages.some(
            (existingUsage) => existingUsage.nodeId === usage.nodeId
          )) {
            return;
          }
        }
        if (existing.flag === "typographyVariable" && (usage.nodeType !== "TEXT" || styledTextNodeIds.has(usage.nodeId) || fontAwesomeNodeIds.has(usage.nodeId))) {
          return;
        }
        if (existing.flag === "typographyVariable") {
          typographyVariableNodeIds.add(usage.nodeId);
        }
        existing.usages.push(usage);
        recordVariableCompliance(existing, usage.hidden);
        return;
      }
      const variable = await getVariableCached(variableId);
      if (!variable) return;
      const collection = await getCollectionCached(variable.variableCollectionId);
      const libraryName = variable.remote ? (_a2 = collection && libraryByCollectionKey.get(collection.key)) != null ? _a2 : UNKNOWN_LIBRARY : LOCAL_LIBRARY;
      const collectionName = (_b2 = collection == null ? void 0 : collection.name) != null ? _b2 : "?";
      const isSourceOfTruth = sotLibraryName2 !== null && libraryName === sotLibraryName2;
      let flag;
      if (variable.resolvedType === "COLOR" && isSourceOfTruth && isPrimitiveColorCollection(collectionName)) {
        flag = "primitive";
      } else if (isRadiusUsage(usage)) {
        flag = "shapeVariable";
      } else if (isTypographyCollection(collectionName)) {
        flag = "typographyVariable";
      }
      if (flag === "typographyVariable" && (usage.nodeType !== "TEXT" || styledTextNodeIds.has(usage.nodeId) || fontAwesomeNodeIds.has(usage.nodeId))) {
        return;
      }
      if (flag === "typographyVariable") {
        typographyVariableNodeIds.add(usage.nodeId);
      }
      const entry = {
        id,
        variableId,
        variableKey: variable.key,
        name: variable.name,
        resolvedType: variable.resolvedType,
        collectionName,
        libraryName,
        remote: variable.remote,
        isSourceOfTruth,
        flag,
        values: collection ? await resolveDisplayValues(variable, collection) : {},
        usages: [usage]
      };
      entries.set(id, entry);
      recordVariableCompliance(entry, usage.hidden);
    }
    function recordRawPaint(hex, usage) {
      const id = `hex:${hex}`;
      const existing = rawPaints.get(id);
      if (existing) existing.usages.push(usage);
      else rawPaints.set(id, { id, hex, usages: [usage] });
      recordCompliance(false, usage.hidden);
    }
    async function visitPaints(node, property) {
      var _a2, _b2, _c;
      if (!(property in node)) return;
      const paints = node[property];
      if (paints === figma.mixed) {
        if (node.type === "TEXT" && property === "fills") mixedTextSkipped++;
        return;
      }
      if (!Array.isArray(paints)) return;
      const styleField = property === "fills" ? "fillStyleId" : "strokeStyleId";
      const styleId = node[styleField];
      if (typeof styleId === "string" && styleId) {
        const style = await getPaintStyle(styleId);
        const solidIndex = paints.findIndex(
          (paint) => paint.type === "SOLID" && paint.visible !== false
        );
        if (style && solidIndex >= 0) {
          const paint = paints[solidIndex];
          const usage = {
            nodeId: node.id,
            nodeName: node.name,
            nodeType: node.type,
            prop: { kind: "paint", property, index: solidIndex },
            inInstance: false,
            hidden: isEffectivelyHidden(node)
          };
          const id = `paintStyle:${styleId}`;
          const existing = paintStyles.get(id);
          if (existing) existing.usages.push(usage);
          else {
            paintStyles.set(id, {
              id,
              styleId,
              name: style.name,
              hex: rgbaToHex(__spreadProps(__spreadValues({}, paint.color), { a: (_a2 = paint.opacity) != null ? _a2 : 1 })),
              usages: [usage]
            });
          }
          recordCompliance(false, usage.hidden);
          return;
        }
      }
      for (let index = 0; index < paints.length; index++) {
        const paint = paints[index];
        if (paint.type !== "SOLID" || paint.visible === false) continue;
        const usage = {
          nodeId: node.id,
          nodeName: node.name,
          nodeType: node.type,
          prop: { kind: "paint", property, index },
          inInstance: false,
          hidden: isEffectivelyHidden(node)
        };
        const alias = (_b2 = paint.boundVariables) == null ? void 0 : _b2.color;
        if (alias && isAliasLike(alias)) {
          await recordVariableUsage(alias.id, usage);
        } else {
          recordRawPaint(rgbaToHex(__spreadProps(__spreadValues({}, paint.color), { a: (_c = paint.opacity) != null ? _c : 1 })), usage);
        }
      }
    }
    function visitRadii(node) {
      const record = node;
      const bound = node.boundVariables;
      const unboundByValue = /* @__PURE__ */ new Map();
      for (const field of RADIUS_FIELDS) {
        const value = record[field];
        if (typeof value !== "number" || value <= 0) continue;
        if (bound && bound[field]) {
          continue;
        }
        if (!unboundByValue.has(value)) unboundByValue.set(value, field);
      }
      for (const [value, field] of unboundByValue) {
        const id = `radius:${value}`;
        const usage = {
          nodeId: node.id,
          nodeName: node.name,
          nodeType: node.type,
          prop: { kind: "field", field },
          inInstance: false,
          hidden: isEffectivelyHidden(node)
        };
        const existing = rawRadii.get(id);
        if (existing) existing.usages.push(usage);
        else rawRadii.set(id, { id, label: `${value}px`, value, usages: [usage] });
        recordCompliance(false, usage.hidden);
      }
    }
    async function visitInstance(node) {
      const usage = {
        nodeId: node.id,
        nodeName: node.name,
        nodeType: node.type,
        prop: { kind: "field", field: "component" },
        inInstance: false,
        hidden: isEffectivelyHidden(node)
      };
      let main = null;
      try {
        main = await node.getMainComponentAsync();
      } catch (e) {
        return;
      }
      if (!main) return;
      const owner = main.parent && main.parent.type === "COMPONENT_SET" ? main.parent : main;
      const key = owner.key;
      const existing = components.get(key);
      if (existing) {
        existing.instanceCount++;
        existing.usages.push(usage);
        recordCompliance(existing.isCads, usage.hidden);
        if (existing.sampleNodeNames.length < 5 && !existing.sampleNodeNames.includes(node.name)) {
          existing.sampleNodeNames.push(node.name);
        }
        return;
      }
      const entry = {
        key,
        name: owner.name,
        isCads: cadsComponentKeys.has(key),
        isLocal: !main.remote,
        instanceCount: 1,
        sampleNodeNames: [node.name],
        usages: [usage]
      };
      components.set(key, entry);
      recordCompliance(entry.isCads, usage.hidden);
    }
    function visitPossibleDetachedComponent(node) {
      if (node.type !== "FRAME" && node.type !== "GROUP") return;
      if (hasComponentAncestor(node)) return;
      const componentName = cadsComponentNameByNormalized.get(
        node.name.trim().toLocaleLowerCase()
      );
      if (!componentName) return;
      const id = `detached:${componentName.toLocaleLowerCase()}`;
      const usage = {
        nodeId: node.id,
        nodeName: node.name,
        nodeType: node.type,
        prop: { kind: "field", field: "possibleDetachedComponent" },
        inInstance: false,
        hidden: isEffectivelyHidden(node)
      };
      const existing = detachedComponents.get(id);
      if (existing) existing.usages.push(usage);
      else detachedComponents.set(id, { id, componentName, usages: [usage] });
      recordCompliance(false, usage.hidden);
    }
    async function visitSurfaceNode(node) {
      var _a2, _b2, _c;
      visitPossibleDetachedComponent(node);
      await visitPaints(node, "fills");
      await visitPaints(node, "strokes");
      visitRadii(node);
      if (node.type === "TEXT") await visitText(node);
      if ("effects" in node && Array.isArray(node.effects)) {
        for (let index = 0; index < node.effects.length; index++) {
          const effect = node.effects[index];
          const alias = (_a2 = effect.boundVariables) == null ? void 0 : _a2.color;
          if (alias && isAliasLike(alias)) {
            await recordVariableUsage(alias.id, {
              nodeId: node.id,
              nodeName: node.name,
              nodeType: node.type,
              prop: { kind: "effect", index },
              inInstance: false,
              hidden: isEffectivelyHidden(node)
            });
          }
        }
      }
      const bound = node.boundVariables;
      if (bound) {
        for (const field of Object.keys(bound)) {
          if (SKIP_FIELDS.has(field)) continue;
          const value = bound[field];
          if (!isAliasLike(value)) continue;
          await recordVariableUsage(value.id, {
            nodeId: node.id,
            nodeName: node.name,
            nodeType: node.type,
            prop: { kind: "field", field },
            inInstance: false,
            hidden: isEffectivelyHidden(node)
          });
        }
      }
      if ("explicitVariableModes" in node) {
        const modes = node.explicitVariableModes;
        for (const collectionId of Object.keys(modes != null ? modes : {})) {
          const collection = await getCollectionCached(collectionId);
          if (!collection) continue;
          const mode = collection.modes.find(
            (m) => m.modeId === modes[collectionId]
          );
          const libraryName = collection.remote ? (_b2 = libraryByCollectionKey.get(collection.key)) != null ? _b2 : UNKNOWN_LIBRARY : LOCAL_LIBRARY;
          explicitModes.push({
            nodeId: node.id,
            nodeName: node.name,
            collectionId,
            collectionName: collection.name,
            libraryName,
            modeName: (_c = mode == null ? void 0 : mode.name) != null ? _c : "?",
            isSourceOfTruth: sotLibraryName2 !== null && libraryName === sotLibraryName2,
            hidden: isEffectivelyHidden(node)
          });
          recordCompliance(
            sotLibraryName2 !== null && libraryName === sotLibraryName2,
            isEffectivelyHidden(node)
          );
        }
      }
    }
    const stack = [...selection];
    while (stack.length > 0) {
      const node = stack.pop();
      nodesScanned++;
      if (!isEffectivelyHidden(node)) visibleNodesScanned++;
      if (nodesScanned % 250 === 0) {
        onProgress(nodesScanned);
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
      if (node.type === "INSTANCE") {
        await visitInstance(node);
        continue;
      }
      await visitSurfaceNode(node);
      if ("children" in node) {
        for (const child of node.children) stack.push(child);
      }
    }
    const resolvedRootModes = /* @__PURE__ */ new Set();
    for (const root of selection) {
      const resolvedModes = root.resolvedVariableModes;
      for (const [collectionId, modeId] of Object.entries(resolvedModes != null ? resolvedModes : {})) {
        const collection = await getCollectionCached(collectionId);
        if (!collection) continue;
        const libraryName = collection.remote ? (_a = libraryByCollectionKey.get(collection.key)) != null ? _a : UNKNOWN_LIBRARY : LOCAL_LIBRARY;
        if (sotLibraryName2 === null || libraryName !== sotLibraryName2) continue;
        const modeName = (_b = collection.modes.find(
          (mode) => mode.modeId === modeId
        )) == null ? void 0 : _b.name;
        if (modeName && /^(light|dark)$/i.test(modeName.trim())) {
          resolvedRootModes.add(modeName);
        }
      }
    }
    const colorModeName = resolvedRootModes.size === 1 ? Array.from(resolvedRootModes)[0] : null;
    for (const [id, entry] of rawTexts) {
      entry.usages = entry.usages.filter(
        (usage) => !typographyVariableNodeIds.has(usage.nodeId)
      );
      if (entry.usages.length === 0) {
        rawTexts.delete(id);
        continue;
      }
      for (const usage of entry.usages) recordCompliance(false, usage.hidden);
    }
    const findingEntries = Array.from(entries.values()).filter(
      (e) => isColorFinding(e) || isTypographyVariableFinding(e) || isShapeVariableFinding(e)
    ).sort(
      (a, b) => `${a.libraryName}/${a.collectionName}/${a.name}`.localeCompare(
        `${b.libraryName}/${b.collectionName}/${b.name}`
      )
    );
    const findingTextStyles = Array.from(textStyles.values()).filter((s) => !s.isSourceOfTruth).sort((a, b) => a.name.localeCompare(b.name));
    const findingRawTexts = Array.from(rawTexts.values()).sort(
      (a, b) => b.usages.length - a.usages.length
    );
    const findingFontAwesomeTexts = Array.from(fontAwesomeTexts.values()).sort(
      (a, b) => b.usages.length - a.usages.length
    );
    const findingRawPaints = Array.from(rawPaints.values()).sort(
      (a, b) => b.usages.length - a.usages.length
    );
    const findingPaintStyles = Array.from(paintStyles.values()).sort(
      (a, b) => a.name.localeCompare(b.name)
    );
    const findingRadii = Array.from(rawRadii.values()).sort(
      (a, b) => a.value - b.value
    );
    const findingComponents = Array.from(components.values()).filter((c) => !c.isCads).sort((a, b) => b.instanceCount - a.instanceCount);
    const findingDetachedComponents = Array.from(detachedComponents.values()).sort(
      (a, b) => b.usages.length - a.usages.length
    );
    const findingModes = explicitModes.filter((m) => !m.isSourceOfTruth);
    const visibleUsageCount = (entry) => entry.usages.filter((usage) => !usage.hidden).length;
    const colorCount = findingEntries.filter(isColorFinding).reduce((total, entry) => total + visibleUsageCount(entry), 0) + findingRawPaints.reduce(
      (total, entry) => total + visibleUsageCount(entry),
      0
    ) + findingPaintStyles.reduce(
      (total, entry) => total + visibleUsageCount(entry),
      0
    );
    const typographyCount = findingEntries.filter(isTypographyVariableFinding).reduce((total, entry) => total + visibleUsageCount(entry), 0) + findingTextStyles.reduce(
      (total, entry) => total + visibleUsageCount(entry),
      0
    ) + findingRawTexts.reduce(
      (total, entry) => total + visibleUsageCount(entry),
      0
    ) + findingFontAwesomeTexts.reduce(
      (total, entry) => total + visibleUsageCount(entry),
      0
    );
    const shapeCount = findingEntries.filter(isShapeVariableFinding).reduce((total, entry) => total + visibleUsageCount(entry), 0) + findingRadii.reduce(
      (total, entry) => total + visibleUsageCount(entry),
      0
    );
    const modesCount = findingModes.filter((mode) => !mode.hidden).length;
    const componentsCount = findingDetachedComponents.reduce(
      (total, component) => total + visibleUsageCount(component),
      0
    ) + findingComponents.reduce(
      (total, component) => total + visibleUsageCount(component),
      0
    );
    const totalFindings = colorCount + typographyCount + shapeCount + modesCount + componentsCount;
    const totalUsages = compliancePasses + complianceWarnings;
    const summary = {
      colors: colorCount,
      typography: typographyCount,
      shape: shapeCount,
      modes: modesCount,
      components: componentsCount,
      totalUsages,
      passes: compliancePasses,
      warnings: complianceWarnings,
      complianceScore: totalUsages === 0 ? 100 : Math.round(compliancePasses / totalUsages * 100),
      passed: totalFindings === 0,
      totalFindings
    };
    const selectionLabel = selection.length === 1 ? selection[0].name : `${selection.length} selected layers`;
    return {
      selectionLabel,
      rootNodeIds: selection.map((n) => n.id),
      colorModeName,
      nodesScanned: visibleNodesScanned,
      summary,
      entries: findingEntries,
      paintStyles: findingPaintStyles,
      rawPaints: findingRawPaints,
      textStyles: findingTextStyles,
      rawTexts: findingRawTexts,
      fontAwesomeTexts: findingFontAwesomeTexts,
      rawRadii: findingRadii,
      components: findingComponents,
      detachedComponents: findingDetachedComponents,
      explicitModes: findingModes,
      mixedTextSkipped,
      mixedStyleSkipped
    };
  }

  // src/main/catalog.ts
  async function buildCatalog(libraryName, onProgress) {
    const allCollections = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
    const collections = allCollections.filter(
      (c) => c.libraryName === libraryName
    );
    if (collections.length === 0) {
      throw new Error(
        `No variable collections found for library "${libraryName}". Make sure it is enabled in this file.`
      );
    }
    const collectionVariables = await Promise.all(
      collections.map(
        (c) => figma.teamLibrary.getVariablesInLibraryCollectionAsync(c.key)
      )
    );
    const total = collectionVariables.reduce((sum, v) => sum + v.length, 0);
    const variables = [];
    const importedByKey = /* @__PURE__ */ new Map();
    const catalogCollections = [];
    let done = 0;
    onProgress(0, total);
    await new Promise((resolve) => setTimeout(resolve, 0));
    for (let i = 0; i < collections.length; i++) {
      const collection = collections[i];
      let modes = [];
      for (const libVar of collectionVariables[i]) {
        try {
          const imported = await figma.variables.importVariableByKeyAsync(
            libVar.key
          );
          importedByKey.set(libVar.key, imported);
          const importedCollection = await getCollectionCached(
            imported.variableCollectionId
          );
          if (importedCollection && modes.length === 0) {
            modes = importedCollection.modes.map((m) => m.name);
          }
          variables.push({
            key: libVar.key,
            variableId: imported.id,
            name: imported.name,
            resolvedType: imported.resolvedType,
            collectionKey: collection.key,
            collectionName: collection.name,
            values: importedCollection ? await resolveDisplayValues(imported, importedCollection) : {}
          });
        } catch (e) {
        }
        done++;
        if (done % 5 === 0 || done === total) {
          onProgress(done, total);
          await new Promise((resolve) => setTimeout(resolve, 0));
        }
      }
      catalogCollections.push({
        key: collection.key,
        name: collection.name,
        modes,
        variableCount: collectionVariables[i].length
      });
    }
    onProgress(total, total);
    return {
      catalog: {
        libraryName,
        collections: catalogCollections,
        variables,
        // Text styles are merged in by code.ts from the style catalog.
        textStyles: [],
        textStyleSource: "none"
      },
      importedByKey
    };
  }

  // src/main/apply.ts
  var nodeCache = /* @__PURE__ */ new Map();
  async function getNode(id) {
    var _a;
    if (!nodeCache.has(id)) {
      try {
        nodeCache.set(id, await figma.getNodeByIdAsync(id));
      } catch (e) {
        nodeCache.set(id, null);
      }
    }
    return (_a = nodeCache.get(id)) != null ? _a : null;
  }
  async function rebindUsage(usage, variable) {
    const node = await getNode(usage.nodeId);
    if (!node) throw new Error("node no longer exists");
    if (usage.prop.kind === "paint") {
      const { property, index } = usage.prop;
      const paints = node[property];
      if (paints === figma.mixed || !Array.isArray(paints)) {
        throw new Error(`${property} changed since audit`);
      }
      const next = paints.slice();
      const paint = next[index];
      if (!paint || paint.type !== "SOLID") {
        throw new Error(`${property}[${index}] changed since audit`);
      }
      next[index] = figma.variables.setBoundVariableForPaint(
        paint,
        "color",
        variable
      );
      node[property] = next;
      return;
    }
    if (usage.prop.kind === "effect") {
      const { index } = usage.prop;
      if (!("effects" in node) || !Array.isArray(node.effects)) {
        throw new Error("effects changed since audit");
      }
      const next = node.effects.slice();
      const effect = next[index];
      if (!effect) throw new Error(`effects[${index}] changed since audit`);
      next[index] = figma.variables.setBoundVariableForEffect(
        effect,
        "color",
        variable
      );
      node.effects = next;
      return;
    }
    if (usage.prop.kind !== "field") {
      throw new Error("text style usages must be applied via a style mapping");
    }
    node.setBoundVariable(usage.prop.field, variable);
  }
  async function applyTextStyle(usage, style) {
    const node = await getNode(usage.nodeId);
    if (!node) throw new Error("node no longer exists");
    if (node.type !== "TEXT") throw new Error("no longer a text node");
    await node.setTextStyleIdAsync(style.id);
  }
  function isStyleSource(sourceId) {
    return sourceId.startsWith("style:") || sourceId.startsWith("font:");
  }
  async function applyMappings(request, audit, importedByKey, importedStylesByKey) {
    var _a, _b, _c, _d, _e, _f, _g;
    nodeCache.clear();
    const failures = [];
    let usagesRebound = 0;
    let variablesRemapped = 0;
    const sourceById = /* @__PURE__ */ new Map();
    for (const entry of audit.entries) {
      sourceById.set(entry.id, { name: entry.name, usages: entry.usages });
    }
    for (const style of audit.paintStyles) {
      sourceById.set(style.id, { name: style.name, usages: style.usages });
    }
    for (const raw of audit.rawPaints) {
      sourceById.set(raw.id, { name: raw.hex, usages: raw.usages });
    }
    for (const entry of audit.textStyles) {
      sourceById.set(entry.id, { name: entry.name, usages: entry.usages });
    }
    for (const raw of audit.rawTexts) {
      sourceById.set(raw.id, { name: raw.label, usages: raw.usages });
    }
    for (const raw of audit.rawRadii) {
      sourceById.set(raw.id, { name: `radius ${raw.label}`, usages: raw.usages });
    }
    for (const mapping of request.mappings) {
      const source = sourceById.get(mapping.sourceId);
      const styleTarget = isStyleSource(mapping.sourceId);
      let variable = null;
      let style = null;
      if (styleTarget) {
        style = (_a = importedStylesByKey.get(mapping.targetKey)) != null ? _a : await figma.importStyleByKeyAsync(mapping.targetKey).catch(() => null);
      } else {
        variable = (_b = importedByKey.get(mapping.targetKey)) != null ? _b : await figma.variables.importVariableByKeyAsync(mapping.targetKey).catch(() => null);
      }
      if (!source || !variable && !style) {
        failures.push({
          nodeName: "\u2014",
          sourceName: (_c = source == null ? void 0 : source.name) != null ? _c : mapping.sourceId,
          reason: styleTarget ? "target text style could not be imported" : "target variable could not be imported"
        });
        continue;
      }
      let reboundForSource = 0;
      const usages = mapping.usageIndexes === void 0 ? source.usages : mapping.usageIndexes.map((index) => source.usages[index]).filter((usage) => Boolean(usage));
      for (const usage of usages) {
        try {
          if (style) await applyTextStyle(usage, style);
          else await rebindUsage(usage, variable);
          reboundForSource++;
        } catch (error) {
          failures.push({
            nodeName: usage.nodeName,
            sourceName: source.name,
            reason: usage.inInstance ? `inside a component instance \u2014 fix at the source component (${String(
              (_d = error.message) != null ? _d : error
            )})` : String((_e = error.message) != null ? _e : error)
          });
        }
      }
      usagesRebound += reboundForSource;
      if (reboundForSource > 0) variablesRemapped++;
    }
    let modesSet = 0;
    let modesCleared = 0;
    if (request.setMode) {
      const anyImported = Array.from(importedByKey.values())[0];
      let targetCollection = null;
      for (const variable of importedByKey.values()) {
        const collection = await getCollectionCached(variable.variableCollectionId);
        if (collection && collection.key === request.setMode.collectionKey) {
          targetCollection = collection;
          break;
        }
      }
      if (!targetCollection && anyImported) {
        targetCollection = await getCollectionCached(
          anyImported.variableCollectionId
        );
      }
      const modeName = request.setMode.modeName;
      const mode = targetCollection == null ? void 0 : targetCollection.modes.find((m) => m.name === modeName);
      if (targetCollection && mode) {
        for (const rootId of audit.rootNodeIds) {
          const node = await getNode(rootId);
          if (node && "setExplicitVariableModeForCollection" in node) {
            try {
              node.setExplicitVariableModeForCollection(targetCollection, mode.modeId);
              modesSet++;
            } catch (error) {
              failures.push({
                nodeName: node.name,
                sourceName: `mode \u2192 ${modeName}`,
                reason: String((_f = error.message) != null ? _f : error)
              });
            }
          }
        }
      } else {
        failures.push({
          nodeName: "\u2014",
          sourceName: `mode \u2192 ${modeName}`,
          reason: "mode not found in the source-of-truth collection"
        });
      }
    }
    if (request.clearForeignModes) {
      const seen = /* @__PURE__ */ new Set();
      for (const entry of audit.explicitModes) {
        if (entry.isSourceOfTruth) continue;
        const dedupeKey = `${entry.nodeId}/${entry.collectionId}`;
        if (seen.has(dedupeKey)) continue;
        seen.add(dedupeKey);
        const node = await getNode(entry.nodeId);
        const collection = await getCollectionCached(entry.collectionId);
        if (!node || !collection) continue;
        if (!("clearExplicitVariableModeForCollection" in node)) continue;
        try {
          node.clearExplicitVariableModeForCollection(collection);
          modesCleared++;
        } catch (error) {
          failures.push({
            nodeName: entry.nodeName,
            sourceName: `clear ${entry.collectionName} mode`,
            reason: String((_g = error.message) != null ? _g : error)
          });
        }
      }
    }
    return { usagesRebound, variablesRemapped, modesSet, modesCleared, failures };
  }

  // src/main/matcher.ts
  function normalizeSegments(name) {
    return name.toLowerCase().replace(/([a-z])([0-9])/g, "$1 $2").split(/[^a-z0-9]+/).filter(Boolean);
  }
  function normalizedKey(name) {
    return normalizeSegments(name).join("/");
  }
  function jaccard(a, b) {
    const setA = new Set(a);
    const setB = new Set(b);
    let inter = 0;
    for (const s of setA) if (setB.has(s)) inter++;
    const union = setA.size + setB.size - inter;
    return union === 0 ? 0 : inter / union;
  }
  function nameScore(source, target) {
    const a = normalizeSegments(source);
    const b = normalizeSegments(target);
    if (a.join("/") === b.join("/")) return 1;
    let score = jaccard(a, b);
    if (a.length && b.length && a[a.length - 1] === b[b.length - 1]) {
      score = Math.min(0.95, score + 0.2);
    }
    return score;
  }
  function valueScore(source, target) {
    const sourceModes = Object.keys(source);
    if (sourceModes.length === 0) return 0;
    const targetValues = new Set(Object.values(target).map((v) => v.toLowerCase()));
    let matched = 0;
    let modeNameMatched = 0;
    for (const mode of sourceModes) {
      const value = source[mode].toLowerCase();
      if (!targetValues.has(value)) continue;
      matched++;
      const sameModeTarget = Object.keys(target).find(
        (m) => m.toLowerCase() === mode.toLowerCase()
      );
      if (sameModeTarget && target[sameModeTarget].toLowerCase() === value) {
        modeNameMatched++;
      }
    }
    const coverage = matched / sourceModes.length;
    if (coverage === 0) return 0;
    const base = sourceModes.length > 1 ? 0.92 : 0.72;
    const modeBonus = modeNameMatched === sourceModes.length ? 0.05 : 0;
    return Math.min(0.97, coverage * base + modeBonus);
  }
  function proposeForVariable(entry, ctx) {
    const cacheKey = entry.variableKey || entry.id;
    const cached = ctx.cache[cacheKey];
    if (cached && ctx.targets.some((t) => t.key === cached)) {
      return {
        sourceId: entry.id,
        targetKey: cached,
        source: "cache",
        confidence: 1,
        rationale: "Previously approved mapping"
      };
    }
    const candidates = ctx.targets.filter(
      (t) => t.resolvedType === entry.resolvedType
    );
    let best = null;
    const sourceKey = normalizedKey(entry.name);
    for (const target of candidates) {
      const nScore = nameScore(entry.name, target.name);
      const vScore = valueScore(entry.values, target.values);
      let score;
      let kind;
      if (normalizedKey(target.name) === sourceKey) {
        score = 1;
        kind = "exact-name";
      } else if (vScore >= nScore) {
        score = Math.min(0.98, vScore + nScore * 0.1);
        kind = "value";
      } else {
        score = Math.min(0.95, nScore + vScore * 0.15);
        kind = "fuzzy-name";
      }
      if (!best || score > best.score) best = { target, score, kind };
    }
    if (best && best.score >= 0.55) {
      return {
        sourceId: entry.id,
        targetKey: best.target.key,
        source: best.kind,
        confidence: Math.round(best.score * 100) / 100,
        rationale: best.kind === "exact-name" ? "Names match" : best.kind === "value" ? "Resolved values match" : "Similar name"
      };
    }
    return { sourceId: entry.id, targetKey: null, source: "none", confidence: 0 };
  }
  function fontValueScore(source, target) {
    var _a;
    if (!source.family || source.family.toLowerCase() !== ((_a = target.family) != null ? _a : "").toLowerCase()) {
      return 0;
    }
    let score = 0.35;
    if (source.weight && source.weight === target.weight) score += 0.25;
    if (source.size && source.size === target.size) score += 0.25;
    if (source.lineHeight && source.lineHeight === target.lineHeight) score += 0.1;
    return score;
  }
  function proposeForTextStyle(entry, ctx) {
    const cacheKey = entry.styleKey || entry.id;
    const cached = ctx.cache[cacheKey];
    if (cached && ctx.targets.some((t) => t.key === cached)) {
      return {
        sourceId: entry.id,
        targetKey: cached,
        source: "cache",
        confidence: 1,
        rationale: "Previously approved mapping"
      };
    }
    const sourceKey = normalizeSegments(entry.name).join("/");
    let best = null;
    for (const target of ctx.targets) {
      const nScore = nameScore(entry.name, target.name);
      const vScore = fontValueScore(entry.values, target.values);
      let score;
      let kind;
      if (normalizeSegments(target.name).join("/") === sourceKey) {
        score = 1;
        kind = "exact-name";
      } else if (vScore >= nScore) {
        score = Math.min(0.95, vScore + nScore * 0.15);
        kind = "value";
      } else {
        score = Math.min(0.95, nScore + vScore * 0.15);
        kind = "fuzzy-name";
      }
      if (!best || score > best.score) best = { target, score, kind };
    }
    if (best && best.score >= 0.55) {
      return {
        sourceId: entry.id,
        targetKey: best.target.key,
        source: best.kind,
        confidence: Math.round(best.score * 100) / 100,
        rationale: best.kind === "exact-name" ? "Style names match" : best.kind === "value" ? "Font properties match" : "Similar style name"
      };
    }
    return { sourceId: entry.id, targetKey: null, source: "none", confidence: 0 };
  }
  function proposeForRawText(entry, ctx) {
    const cached = ctx.cache[entry.id];
    if (cached && ctx.targets.some((t) => t.key === cached)) {
      return {
        sourceId: entry.id,
        targetKey: cached,
        source: "cache",
        confidence: 1,
        rationale: "Previously approved mapping"
      };
    }
    let best = null;
    for (const target of ctx.targets) {
      const score = fontValueScore(entry.values, target.values);
      if (!best || score > best.score) best = { target, score };
    }
    if (best && best.score >= 0.6) {
      return {
        sourceId: entry.id,
        targetKey: best.target.key,
        source: "value",
        confidence: Math.round(best.score * 100) / 100,
        rationale: "Font properties match \u2014 verify the semantic role"
      };
    }
    return { sourceId: entry.id, targetKey: null, source: "none", confidence: 0 };
  }
  function shapeRuleName(value) {
    if (value >= 3 && value <= 5) return "sm";
    if (value >= 6 && value <= 7) return "md";
    if (value >= 8 && value <= 9) return "lg";
    if (value >= 10 && value <= 16) return "xl";
    if (value >= 24) return "round";
    return null;
  }
  function proposeForRadius(entry, shapeTargets, cache) {
    var _a;
    const radiusTargets = shapeTargets.filter(
      (target) => normalizeSegments(target.name)[0] === "shape"
    );
    const cacheKey = entry.variableKey || entry.id;
    const cached = cache[cacheKey];
    if (cached && radiusTargets.some((t) => t.key === cached)) {
      return {
        sourceId: entry.id,
        targetKey: cached,
        source: "cache",
        confidence: 1,
        rationale: "Previously approved mapping"
      };
    }
    const sourceValues = entry.value !== void 0 ? [entry.value] : Object.values((_a = entry.values) != null ? _a : {}).map(Number).filter(Number.isFinite);
    const exactMatch = radiusTargets.find((target) => {
      const targetValues = new Set(
        Object.values(target.values).map(Number).filter(Number.isFinite)
      );
      return sourceValues.length > 0 && sourceValues.every((value) => targetValues.has(value));
    });
    if (exactMatch) {
      return {
        sourceId: entry.id,
        targetKey: exactMatch.key,
        source: "value",
        confidence: 1,
        rationale: `${sourceValues.join("/")}px exactly matches ${exactMatch.name}`
      };
    }
    const ruleNames = new Set(sourceValues.map(shapeRuleName));
    if (sourceValues.length === 0 || ruleNames.size !== 1 || ruleNames.has(null)) {
      return {
        sourceId: entry.id,
        targetKey: null,
        source: "none",
        confidence: 0,
        rationale: "Radius falls outside the agreed migration bands"
      };
    }
    const ruleName = Array.from(ruleNames)[0];
    const match = radiusTargets.find((target) => {
      const segments = normalizeSegments(target.name);
      return segments[segments.length - 1] === ruleName;
    });
    if (!match) {
      return {
        sourceId: entry.id,
        targetKey: null,
        source: "none",
        confidence: 0,
        rationale: `CADS shape/${ruleName} is unavailable`
      };
    }
    return {
      sourceId: entry.id,
      targetKey: match.key,
      source: "rule",
      confidence: 1,
      rationale: `${sourceValues.join("/")}px maps to shape/${ruleName} by the DSCO \u2192 CADS migration rule`
    };
  }
  function proposeForRawPaint(entry, ctx) {
    const cached = ctx.cache[entry.id];
    if (cached && ctx.targets.some((t) => t.key === cached)) {
      return {
        sourceId: entry.id,
        targetKey: cached,
        source: "cache",
        confidence: 1,
        rationale: "Previously approved mapping"
      };
    }
    const hex = entry.hex.toLowerCase();
    let best = null;
    for (const target of ctx.targets) {
      if (target.resolvedType !== "COLOR") continue;
      const modes = Object.values(target.values).filter(
        (v) => v.toLowerCase() === hex
      ).length;
      if (modes > 0 && (!best || modes > best.modes)) best = { target, modes };
    }
    if (best) {
      return {
        sourceId: entry.id,
        targetKey: best.target.key,
        source: "value",
        confidence: 0.7,
        rationale: `Hex matches ${best.modes > 1 ? "all modes" : "one mode"} \u2014 verify the semantic role`
      };
    }
    return { sourceId: entry.id, targetKey: null, source: "none", confidence: 0 };
  }

  // src/code.ts
  var SETTINGS_KEY = "variable-remap.settings.v1";
  figma.showUI(__html__, { width: 360, height: 560, themeColors: true });
  var settings = EMPTY_SETTINGS;
  var catalogResult = null;
  var styleCatalog = null;
  var lastAudit = null;
  var sotLibraryName = "";
  function post(message) {
    figma.ui.postMessage(message);
  }
  function isCadsLibrary(name) {
    return /cads/i.test(name);
  }
  function postSelection() {
    const selection = figma.currentPage.selection;
    const count = selection.length;
    post({
      type: "selection",
      count,
      nodeIds: selection.map((node) => node.id),
      label: count === 0 ? null : count === 1 ? selection[0].name : `${count} layers`
    });
  }
  figma.on("selectionchange", () => {
    postSelection();
  });
  async function loadSettings() {
    try {
      const stored = await figma.clientStorage.getAsync(SETTINGS_KEY);
      if (stored) settings = __spreadValues(__spreadValues({}, EMPTY_SETTINGS), stored);
    } catch (e) {
      settings = EMPTY_SETTINGS;
    }
  }
  async function saveSettings() {
    try {
      await figma.clientStorage.setAsync(SETTINGS_KEY, settings);
    } catch (e) {
    }
  }
  async function findCadsLibraryName() {
    const collections = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
    const names = new Set(collections.map((c) => c.libraryName));
    for (const name of names) {
      if (isCadsLibrary(name)) return name;
    }
    return null;
  }
  function postCombinedCatalog() {
    var _a, _b;
    if (!catalogResult) return;
    post({
      type: "catalog",
      catalog: __spreadProps(__spreadValues({}, catalogResult.catalog), {
        textStyles: (_a = styleCatalog == null ? void 0 : styleCatalog.textStyles) != null ? _a : [],
        textStyleSource: (_b = styleCatalog == null ? void 0 : styleCatalog.source) != null ? _b : "none"
      })
    });
  }
  async function loadCadsCatalog(libraryName) {
    sotLibraryName = libraryName;
    settings.libraryName = libraryName;
    await saveSettings();
    post({
      type: "catalog-progress",
      done: 0,
      total: 0,
      label: "Loading variables"
    });
    catalogResult = await buildCatalog(
      libraryName,
      (done, total) => post({
        type: "catalog-progress",
        done,
        total,
        label: "Loading variables"
      })
    );
    post({
      type: "catalog-progress",
      done: 0,
      total: 0,
      label: "Loading text styles"
    });
    styleCatalog = await buildStyleCatalog(
      null,
      (done, total) => post({
        type: "catalog-progress",
        done,
        total,
        label: "Loading text styles"
      })
    );
    postCombinedCatalog();
    postSelection();
  }
  async function handleAudit() {
    var _a;
    const sotStyleKeys = new Set(
      ((_a = styleCatalog == null ? void 0 : styleCatalog.textStyles) != null ? _a : []).map((s) => s.key)
    );
    lastAudit = await auditSelection(
      { sotLibraryName, sotStyleKeys },
      (nodesScanned) => post({ type: "audit-progress", nodesScanned })
    );
    post({ type: "audit", result: lastAudit });
  }
  function handleProposeMappings(category = "all") {
    var _a;
    if (!catalogResult || !lastAudit) {
      throw new Error("Run the audit first.");
    }
    const allTargets = catalogResult.catalog.variables;
    const semanticTargets = allTargets.filter(
      (t) => !(t.resolvedType === "COLOR" && isPrimitiveColorCollection(t.collectionName))
    );
    const shapeTargets = (() => {
      const classified = allTargets.filter(
        (t) => t.resolvedType === "FLOAT" && isShapeCollection(t.collectionName) && isShapeVariable(t.name)
      );
      return classified.length > 0 ? classified : allTargets.filter(
        (t) => t.resolvedType === "FLOAT" && isShapeVariable(t.name)
      );
    })();
    const ctx = { targets: semanticTargets, cache: settings.mappingCache };
    const styleCtx = {
      targets: (_a = styleCatalog == null ? void 0 : styleCatalog.textStyles) != null ? _a : [],
      cache: settings.mappingCache
    };
    const wantColors = category === "all" || category === "colors";
    const wantType = category === "all" || category === "typography";
    const wantShape = category === "all" || category === "shape";
    const proposals = [];
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
          proposeForRadius(entry, shapeTargets, settings.mappingCache)
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
  async function handleApply(request) {
    var _a, _b;
    if (!catalogResult || !lastAudit) {
      throw new Error("Run the audit first.");
    }
    const report = await applyMappings(
      request,
      lastAudit,
      catalogResult.importedByKey,
      (_a = styleCatalog == null ? void 0 : styleCatalog.importedByKey) != null ? _a : /* @__PURE__ */ new Map()
    );
    const cacheKeyById = /* @__PURE__ */ new Map();
    for (const entry of lastAudit.entries) {
      cacheKeyById.set(entry.id, entry.variableKey || entry.id);
    }
    for (const entry of lastAudit.textStyles) {
      cacheKeyById.set(entry.id, entry.styleKey || entry.id);
    }
    for (const mapping of request.mappings) {
      const cacheKey = (_b = cacheKeyById.get(mapping.sourceId)) != null ? _b : mapping.sourceId;
      settings.mappingCache[cacheKey] = mapping.targetKey;
    }
    await saveSettings();
    post({ type: "apply-done", report });
    figma.notify(
      report.failures.length === 0 ? `Fixed ${report.usagesRebound} usages` : `Fixed ${report.usagesRebound} usages \u2014 ${report.failures.length} issue(s)`
    );
    await handleAudit();
  }
  async function handleSaveAiSettings(ai) {
    settings.ai = ai;
    await saveSettings();
    post({ type: "settings", settings });
  }
  async function bootstrap() {
    await loadSettings();
    post({ type: "settings", settings });
    const libraryName = await findCadsLibraryName();
    if (!libraryName) {
      post({
        type: "no-library",
        message: "Enable the CADS library in this file (Assets \u2192 Libraries), then reopen the plugin."
      });
      postSelection();
      return;
    }
    await loadCadsCatalog(libraryName);
  }
  figma.ui.onmessage = async (message) => {
    var _a, _b;
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
          const sceneNode = node;
          figma.currentPage.selection = [sceneNode];
          figma.viewport.scrollAndZoomIntoView([sceneNode]);
          postSelection();
          break;
        }
        case "propose-mappings":
          handleProposeMappings((_a = message.category) != null ? _a : "all");
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
        message: String((_b = error.message) != null ? _b : error)
      });
    }
  };
})();
