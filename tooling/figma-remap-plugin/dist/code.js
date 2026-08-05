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
  var __objRest = (source, exclude) => {
    var target = {};
    for (var prop in source)
      if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
        target[prop] = source[prop];
    if (source != null && __getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(source)) {
        if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
          target[prop] = source[prop];
      }
    return target;
  };

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
  function safeVariableCollectionId(variable) {
    try {
      const id = variable.variableCollectionId;
      return typeof id === "string" && id ? id : null;
    } catch (e) {
      return null;
    }
  }
  async function resolveRaw(variable, modeId, modeName, depth) {
    var _a;
    if (depth > 8) return null;
    const value = variable.valuesByMode[modeId];
    if (value === void 0) return null;
    if (!isAlias(value)) return value;
    const target = await getVariableCached(value.id);
    if (!target) return null;
    const collectionId = safeVariableCollectionId(target);
    if (!collectionId) return null;
    const targetCollection = await getCollectionCached(collectionId);
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
    {
      "key": "936275bca7e31fcfad3aba20d6dcacb1e84a39d0",
      "name": "Heading/H1/Bold",
      "values": {
        "family": "Space Grotesk",
        "weight": "Bold",
        "size": "48",
        "textCase": "ORIGINAL",
        "textDecoration": "NONE",
        "lineHeight": "52px"
      }
    },
    {
      "key": "36e0a0364f9c0864b207ab218fed4d70faa77805",
      "name": "Heading/H1/Regular",
      "values": {
        "family": "Space Grotesk",
        "weight": "Regular",
        "size": "48",
        "textCase": "ORIGINAL",
        "textDecoration": "NONE",
        "lineHeight": "52px"
      }
    },
    {
      "key": "eeb8780a5f3b4e44b1d476dab09a923f74e8b85a",
      "name": "Heading/H1/Semi Bold",
      "values": {
        "family": "Space Grotesk",
        "weight": "SemiBold",
        "size": "48",
        "textCase": "ORIGINAL",
        "textDecoration": "NONE",
        "lineHeight": "52px"
      }
    },
    {
      "key": "ee4a41c8ef2f03dc6fa1fb90fdd9c6c053983e3e",
      "name": "Heading/H2/Bold",
      "values": {
        "family": "Space Grotesk",
        "weight": "Bold",
        "size": "38",
        "textCase": "ORIGINAL",
        "textDecoration": "NONE",
        "lineHeight": "40px"
      }
    },
    {
      "key": "a29cc53643fd93332025892ae7e5b633977a18a0",
      "name": "Heading/H2/Regular",
      "values": {
        "family": "Space Grotesk",
        "weight": "Regular",
        "size": "38",
        "textCase": "ORIGINAL",
        "textDecoration": "NONE",
        "lineHeight": "40px"
      }
    },
    {
      "key": "4859ddaef7ab555451a01831fc85be40e955e12f",
      "name": "Heading/H2/Semi Bold",
      "values": {
        "family": "Space Grotesk",
        "weight": "SemiBold",
        "size": "38",
        "textCase": "ORIGINAL",
        "textDecoration": "NONE",
        "lineHeight": "40px"
      }
    },
    {
      "key": "91de6a70a40e86cb439b8053b4ab3ef19c2d9282",
      "name": "Heading/H3/Bold",
      "values": {
        "family": "Geist",
        "weight": "Bold",
        "size": "28",
        "textCase": "ORIGINAL",
        "textDecoration": "NONE",
        "lineHeight": "36px"
      }
    },
    {
      "key": "e513f6907d4000066d236547be3396042aa91e0d",
      "name": "Heading/H3/Regular",
      "values": {
        "family": "Geist",
        "weight": "Regular",
        "size": "28",
        "textCase": "ORIGINAL",
        "textDecoration": "NONE",
        "lineHeight": "36px"
      }
    },
    {
      "key": "aa56723a3e2910f2d17040c823d1742dd35d312a",
      "name": "Heading/H3/Semi Bold",
      "values": {
        "family": "Geist",
        "weight": "SemiBold",
        "size": "28",
        "textCase": "ORIGINAL",
        "textDecoration": "NONE",
        "lineHeight": "36px"
      }
    },
    {
      "key": "354aff496e2178600cb77ac80680f47e03b459fc",
      "name": "Heading/H4/Bold",
      "values": {
        "family": "Geist",
        "weight": "Bold",
        "size": "24",
        "textCase": "ORIGINAL",
        "textDecoration": "NONE",
        "lineHeight": "32px"
      }
    },
    {
      "key": "9a38933ce643083080aec0de36c48805151ee56f",
      "name": "Heading/H4/Regular",
      "values": {
        "family": "Geist",
        "weight": "Regular",
        "size": "24",
        "textCase": "ORIGINAL",
        "textDecoration": "NONE",
        "lineHeight": "32px"
      }
    },
    {
      "key": "e3379936dabc9f7ecb3ec78a0f293cb1b9b667c0",
      "name": "Heading/H4/Semi Bold",
      "values": {
        "family": "Geist",
        "weight": "SemiBold",
        "size": "24",
        "textCase": "ORIGINAL",
        "textDecoration": "NONE",
        "lineHeight": "32px"
      }
    },
    {
      "key": "25457cea42ad27b27257a9df323afbec5e7287f7",
      "name": "Heading/H5/Bold",
      "values": {
        "family": "Geist",
        "weight": "Bold",
        "size": "22",
        "textCase": "ORIGINAL",
        "textDecoration": "NONE",
        "lineHeight": "30px"
      }
    },
    {
      "key": "9b2f63202457c8cf0e0fc54b17f6780c36815ddb",
      "name": "Heading/H5/Regular",
      "values": {
        "family": "Geist",
        "weight": "Regular",
        "size": "22",
        "textCase": "ORIGINAL",
        "textDecoration": "NONE",
        "lineHeight": "30px"
      }
    },
    {
      "key": "509bc8bc8825196715b7494d188a0ff36c7a09fe",
      "name": "Heading/H5/Semi Bold",
      "values": {
        "family": "Geist",
        "weight": "SemiBold",
        "size": "22",
        "textCase": "ORIGINAL",
        "textDecoration": "NONE",
        "lineHeight": "30px"
      }
    },
    {
      "key": "742f9cb42298d3ff17411016f56aea4586b6e9f6",
      "name": "Heading/H6/Bold",
      "values": {
        "family": "Geist",
        "weight": "Bold",
        "size": "20",
        "textCase": "ORIGINAL",
        "textDecoration": "NONE",
        "lineHeight": "28px"
      }
    },
    {
      "key": "5bab8fa17cbbdb8c7691b35b149f7d0606072ccc",
      "name": "Heading/H6/Regular",
      "values": {
        "family": "Geist",
        "weight": "Regular",
        "size": "20",
        "textCase": "ORIGINAL",
        "textDecoration": "NONE",
        "lineHeight": "28px"
      }
    },
    {
      "key": "c750a284d17da1e7717eaf3492a2697fc6060d47",
      "name": "Heading/H6/Semi Bold",
      "values": {
        "family": "Geist",
        "weight": "SemiBold",
        "size": "20",
        "textCase": "ORIGINAL",
        "textDecoration": "NONE",
        "lineHeight": "28px"
      }
    },
    {
      "key": "d24f45b078c7b991bb846d53f5aac5e8736b0470",
      "name": "Body/Body 1/Bold",
      "values": {
        "family": "Geist",
        "weight": "Bold",
        "size": "18",
        "textCase": "ORIGINAL",
        "textDecoration": "NONE",
        "lineHeight": "28px"
      }
    },
    {
      "key": "01088fd0d3bb6d67baf9deec532326c3d93563f1",
      "name": "Body/Body 1/Regular",
      "values": {
        "family": "Geist",
        "weight": "Regular",
        "size": "18",
        "textCase": "ORIGINAL",
        "textDecoration": "NONE",
        "lineHeight": "28px"
      }
    },
    {
      "key": "bd41dcde8355282c93c91e3cab2c02d3d92790d9",
      "name": "Body/Body 1/Semi Bold",
      "values": {
        "family": "Geist",
        "weight": "SemiBold",
        "size": "18",
        "textCase": "ORIGINAL",
        "textDecoration": "NONE",
        "lineHeight": "28px"
      }
    },
    {
      "key": "52364c4caf5b56d26b269538cf8446981a8b63aa",
      "name": "Body/Body 2/Bold",
      "values": {
        "family": "Geist",
        "weight": "Bold",
        "size": "16",
        "textCase": "ORIGINAL",
        "textDecoration": "NONE",
        "lineHeight": "24px"
      }
    },
    {
      "key": "710f3598e4bad0482f28fc1d16098dc7c2f21760",
      "name": "Body/Body 2/Regular",
      "values": {
        "family": "Geist",
        "weight": "Regular",
        "size": "16",
        "textCase": "ORIGINAL",
        "textDecoration": "NONE",
        "lineHeight": "24px"
      }
    },
    {
      "key": "e001af2a0bdaf201dedd5dd568ba920e3d189c27",
      "name": "Body/Body 2/Semi Bold",
      "values": {
        "family": "Geist",
        "weight": "SemiBold",
        "size": "16",
        "textCase": "ORIGINAL",
        "textDecoration": "NONE",
        "lineHeight": "24px"
      }
    },
    {
      "key": "616ebf11fc8918de70450eea30afd6a61a3ca822",
      "name": "Body/Body 3/Bold",
      "values": {
        "family": "Geist",
        "weight": "Bold",
        "size": "14",
        "textCase": "ORIGINAL",
        "textDecoration": "NONE",
        "lineHeight": "22px"
      }
    },
    {
      "key": "e5518262333dab367830a5a016af98f330963e02",
      "name": "Body/Body 3/Regular",
      "values": {
        "family": "Geist",
        "weight": "Regular",
        "size": "14",
        "textCase": "ORIGINAL",
        "textDecoration": "NONE",
        "lineHeight": "22px"
      }
    },
    {
      "key": "71da1c2a8606f1e3e2e9f5961aa3eec6f1b02601",
      "name": "Body/Body 3/Semi Bold",
      "values": {
        "family": "Geist",
        "weight": "SemiBold",
        "size": "14",
        "textCase": "ORIGINAL",
        "textDecoration": "NONE",
        "lineHeight": "22px"
      }
    },
    {
      "key": "bd980d39eb7c9e2e7efd776fe6399027669f65b9",
      "name": "Body/Body 4/Bold",
      "values": {
        "family": "Geist",
        "weight": "Bold",
        "size": "12",
        "textCase": "ORIGINAL",
        "textDecoration": "NONE",
        "lineHeight": "18px"
      }
    },
    {
      "key": "d1b1e768bb3b7c02901ec3420f2027a880107617",
      "name": "Body/Body 4/Regular",
      "values": {
        "family": "Geist",
        "weight": "Regular",
        "size": "12",
        "textCase": "ORIGINAL",
        "textDecoration": "NONE",
        "lineHeight": "18px"
      }
    },
    {
      "key": "4ba37196725defc9d706ac74682ed276b1beff33",
      "name": "Body/Body 4/Semi Bold",
      "values": {
        "family": "Geist",
        "weight": "SemiBold",
        "size": "12",
        "textCase": "ORIGINAL",
        "textDecoration": "NONE",
        "lineHeight": "18px"
      }
    },
    {
      "key": "03d228e7a51cd6be106a7ea841b14e9c1dbac101",
      "name": "Body/Body 5/Bold",
      "values": {
        "family": "Geist",
        "weight": "Bold",
        "size": "10",
        "textCase": "ORIGINAL",
        "textDecoration": "NONE",
        "lineHeight": "16px"
      }
    },
    {
      "key": "c003c38c50e105d4b5cf9880a6d394bb38054979",
      "name": "Body/Body 5/Regular",
      "values": {
        "family": "Geist",
        "weight": "Regular",
        "size": "10",
        "textCase": "ORIGINAL",
        "textDecoration": "NONE",
        "lineHeight": "16px"
      }
    },
    {
      "key": "7237176ce7f48a12615b2121cd64f4af4a82ea29",
      "name": "Body/Body 5/Semi Bold",
      "values": {
        "family": "Geist",
        "weight": "SemiBold",
        "size": "10",
        "textCase": "ORIGINAL",
        "textDecoration": "NONE",
        "lineHeight": "16px"
      }
    },
    {
      "key": "975152cd057fa073f9c6477c148c63aa24a1b30d",
      "name": "Overline/Overline 1",
      "values": {
        "family": "Geist",
        "weight": "SemiBold",
        "size": "14",
        "textCase": "UPPER",
        "textDecoration": "NONE",
        "lineHeight": "22px"
      }
    },
    {
      "key": "2040e6bce25742ecba0d5793a3ef057175e2f87a",
      "name": "Overline/Overline 2",
      "values": {
        "family": "Geist",
        "weight": "SemiBold",
        "size": "12",
        "textCase": "UPPER",
        "textDecoration": "NONE",
        "lineHeight": "18px"
      }
    },
    {
      "key": "5b770b696b963399ffb7eab39ec31c29845ec870",
      "name": "Overline/Overline 3",
      "values": {
        "family": "Geist",
        "weight": "SemiBold",
        "size": "10",
        "textCase": "UPPER",
        "textDecoration": "NONE",
        "lineHeight": "16px"
      }
    },
    {
      "key": "6d900fefb3dcfbe6cf7f3a59f13ea0372d223eb9",
      "name": "Link/Link 1",
      "values": {
        "family": "Geist",
        "weight": "SemiBold",
        "size": "18",
        "textCase": "ORIGINAL",
        "textDecoration": "UNDERLINE",
        "lineHeight": "28px"
      }
    },
    {
      "key": "0fd1876852152c84a4c877ecbba3d6d2d84a3f72",
      "name": "Link/Link 2",
      "values": {
        "family": "Geist",
        "weight": "SemiBold",
        "size": "16",
        "textCase": "ORIGINAL",
        "textDecoration": "UNDERLINE",
        "lineHeight": "24px"
      }
    },
    {
      "key": "bf84c7488010bf79e185b4b20570cfec19c3e85f",
      "name": "Link/Link 3",
      "values": {
        "family": "Geist",
        "weight": "SemiBold",
        "size": "14",
        "textCase": "ORIGINAL",
        "textDecoration": "UNDERLINE",
        "lineHeight": "22px"
      }
    },
    {
      "key": "c02a248fa1df7d283036b4455c2bd927c0f2a827",
      "name": "Link/Link 4",
      "values": {
        "family": "Geist",
        "weight": "SemiBold",
        "size": "12",
        "textCase": "ORIGINAL",
        "textDecoration": "UNDERLINE",
        "lineHeight": "18px"
      }
    },
    {
      "key": "beb95c9d77ba0d60e4bf4460fccf29ef07df2766",
      "name": "Link/Link 5",
      "values": {
        "family": "Geist",
        "weight": "SemiBold",
        "size": "10",
        "textCase": "ORIGINAL",
        "textDecoration": "UNDERLINE",
        "lineHeight": "16px"
      }
    },
    {
      "key": "fe2c80bbc480ade00a6f96b78eb9bab9a6e99d0a",
      "name": "Label/Label 1",
      "values": {
        "family": "Geist",
        "weight": "SemiBold",
        "size": "16",
        "textCase": "ORIGINAL",
        "textDecoration": "NONE",
        "lineHeight": "24px"
      }
    },
    {
      "key": "4ab9224934eb0971c2d8f3ee6e3afa96884350cc",
      "name": "Label/Label 2",
      "values": {
        "family": "Geist",
        "weight": "SemiBold",
        "size": "14",
        "textCase": "ORIGINAL",
        "textDecoration": "NONE",
        "lineHeight": "22px"
      }
    },
    {
      "key": "a10cfc3a7f9fd8a5d48d542ce15f1731178a2b96",
      "name": "Label/Label 3",
      "values": {
        "family": "Geist",
        "weight": "SemiBold",
        "size": "12",
        "textCase": "ORIGINAL",
        "textDecoration": "NONE",
        "lineHeight": "18px"
      }
    },
    {
      "key": "abeb47e031721ba87b6f02dacb97cf134d6ec679",
      "name": "Label/Label 4",
      "values": {
        "family": "Geist",
        "weight": "SemiBold",
        "size": "10",
        "textCase": "ORIGINAL",
        "textDecoration": "NONE",
        "lineHeight": "16px"
      }
    },
    {
      "key": "ac4881d7168dda5130f0b32986b5825d67e9dede",
      "name": "Mono/Mono 1/Bold",
      "values": {
        "family": "Google Sans Code",
        "weight": "Bold",
        "size": "18",
        "textCase": "ORIGINAL",
        "textDecoration": "NONE",
        "lineHeight": "28px"
      }
    },
    {
      "key": "73fb0fcdf6523657b059a6a817fd9bd9738afdac",
      "name": "Mono/Mono 1/Regular",
      "values": {
        "family": "Google Sans Code",
        "weight": "Regular",
        "size": "18",
        "textCase": "ORIGINAL",
        "textDecoration": "NONE",
        "lineHeight": "28px"
      }
    },
    {
      "key": "a22bc52ca9cb217d46632f0adb45014e49aa741b",
      "name": "Mono/Mono 1/Semi Bold",
      "values": {
        "family": "Google Sans Code",
        "weight": "SemiBold",
        "size": "18",
        "textCase": "ORIGINAL",
        "textDecoration": "NONE",
        "lineHeight": "28px"
      }
    },
    {
      "key": "2a0c58da534f6729be26b1ab3aa9292953ab1a3d",
      "name": "Mono/Mono 2/Bold",
      "values": {
        "family": "Google Sans Code",
        "weight": "Bold",
        "size": "16",
        "textCase": "ORIGINAL",
        "textDecoration": "NONE",
        "lineHeight": "24px"
      }
    },
    {
      "key": "70f524e3583cd925a4f568867ce45b518ee6554e",
      "name": "Mono/Mono 2/Regular",
      "values": {
        "family": "Google Sans Code",
        "weight": "Regular",
        "size": "16",
        "textCase": "ORIGINAL",
        "textDecoration": "NONE",
        "lineHeight": "24px"
      }
    },
    {
      "key": "33179c970fb0137403651d4337a9ce6ac145c6a9",
      "name": "Mono/Mono 2/Semi Bold",
      "values": {
        "family": "Google Sans Code",
        "weight": "SemiBold",
        "size": "16",
        "textCase": "ORIGINAL",
        "textDecoration": "NONE",
        "lineHeight": "24px"
      }
    },
    {
      "key": "2c41ba0c03e7ff8276da8bbe0708470fd4060a19",
      "name": "Mono/Mono 3/Bold",
      "values": {
        "family": "Google Sans Code",
        "weight": "Bold",
        "size": "14",
        "textCase": "ORIGINAL",
        "textDecoration": "NONE",
        "lineHeight": "22px"
      }
    },
    {
      "key": "f70b9597f25d6788360e55f7f8a92b3ac86d5a04",
      "name": "Mono/Mono 3/Regular",
      "values": {
        "family": "Google Sans Code",
        "weight": "Regular",
        "size": "14",
        "textCase": "ORIGINAL",
        "textDecoration": "NONE",
        "lineHeight": "22px"
      }
    },
    {
      "key": "f812668bf29f513096ba7b2aea6c18b5dc53bf7b",
      "name": "Mono/Mono 3/Semi Bold",
      "values": {
        "family": "Google Sans Code",
        "weight": "SemiBold",
        "size": "14",
        "textCase": "ORIGINAL",
        "textDecoration": "NONE",
        "lineHeight": "22px"
      }
    },
    {
      "key": "5aecda1875c7deb6d23419745912b0544d66a12a",
      "name": "Mono/Mono 4/Bold",
      "values": {
        "family": "Google Sans Code",
        "weight": "Bold",
        "size": "12",
        "textCase": "ORIGINAL",
        "textDecoration": "NONE",
        "lineHeight": "18px"
      }
    },
    {
      "key": "fd118029c9d5a04d0edd96b8a5620397ea2a76c8",
      "name": "Mono/Mono 4/Regular",
      "values": {
        "family": "Google Sans Code",
        "weight": "Regular",
        "size": "12",
        "textCase": "ORIGINAL",
        "textDecoration": "NONE",
        "lineHeight": "18px"
      }
    },
    {
      "key": "699bbc87b7931f42cee5a83677270242e4c45b3e",
      "name": "Mono/Mono 4/Semi Bold",
      "values": {
        "family": "Google Sans Code",
        "weight": "SemiBold",
        "size": "12",
        "textCase": "ORIGINAL",
        "textDecoration": "NONE",
        "lineHeight": "18px"
      }
    },
    {
      "key": "dd8525c07de2f6943c82b6aa35d98e32d47de6c5",
      "name": "Mono/Mono 5/Bold",
      "values": {
        "family": "Google Sans Code",
        "weight": "Bold",
        "size": "10",
        "textCase": "ORIGINAL",
        "textDecoration": "NONE",
        "lineHeight": "16px"
      }
    },
    {
      "key": "873b38e48e5381d9b5656e5b6e948f3d97a6f63c",
      "name": "Mono/Mono 5/Regular",
      "values": {
        "family": "Google Sans Code",
        "weight": "Regular",
        "size": "10",
        "textCase": "ORIGINAL",
        "textDecoration": "NONE",
        "lineHeight": "16px"
      }
    },
    {
      "key": "c3dc3744760afef7dc1abb6d8b82eae7f5392eca",
      "name": "Mono/Mono 5/Semi Bold",
      "values": {
        "family": "Google Sans Code",
        "weight": "SemiBold",
        "size": "10",
        "textCase": "ORIGINAL",
        "textDecoration": "NONE",
        "lineHeight": "16px"
      }
    }
  ];

  // src/main/styles.ts
  function textStyleValues(style) {
    const values = {
      family: style.fontName.family,
      weight: style.fontName.style,
      size: String(style.fontSize),
      textCase: style.textCase,
      textDecoration: style.textDecoration
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
    const withValues = known.filter(
      (entry) => Boolean(entry.values && Object.keys(entry.values).length > 0)
    );
    const needsImport = known.filter(
      (entry) => !(entry.values && Object.keys(entry.values).length > 0)
    );
    for (const entry of withValues) {
      textStyles.push({
        key: entry.key,
        name: entry.name,
        values: entry.values
      });
    }
    if (needsImport.length === 0) {
      onProgress(known.length, known.length);
      return { textStyles, importedByKey, source };
    }
    let done = withValues.length;
    const total = known.length;
    onProgress(done, total);
    await new Promise((resolve) => setTimeout(resolve, 0));
    for (const entry of needsImport) {
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
      if (done % 5 === 0 || done === total) {
        onProgress(done, total);
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }
    onProgress(total, total);
    textStyles.sort((a, b) => a.name.localeCompare(b.name));
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
  function isFigmaComponentOutlineHex(hex) {
    return /^#9747ff([0-9a-f]{2})?$/i.test(hex.trim());
  }
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
  function hexChroma(hex) {
    const raw = hex.replace(/^#/, "").toLowerCase();
    if (!/^[0-9a-f]{6}/.test(raw)) return 0;
    const r = parseInt(raw.slice(0, 2), 16);
    const g = parseInt(raw.slice(2, 4), 16);
    const b = parseInt(raw.slice(4, 6), 16);
    return Math.max(r, g, b) - Math.min(r, g, b);
  }
  function parseHexRgb(hex) {
    const raw = hex.replace(/^#/, "").toLowerCase();
    if (!/^[0-9a-f]{6}/.test(raw)) return null;
    return {
      r: parseInt(raw.slice(0, 2), 16),
      g: parseInt(raw.slice(2, 4), 16),
      b: parseInt(raw.slice(4, 6), 16)
    };
  }
  function hexLuminance(hex) {
    const rgb = parseHexRgb(hex);
    if (!rgb) return null;
    const channel = (c) => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * channel(rgb.r) + 0.7152 * channel(rgb.g) + 0.0722 * channel(rgb.b);
  }
  function isNeutralDarkHex(hex) {
    const lum = hexLuminance(hex);
    return lum != null && lum < 0.22 && hexChroma(hex) < 45;
  }
  function isNeutralLightHex(hex) {
    const lum = hexLuminance(hex);
    return lum != null && lum > 0.75 && hexChroma(hex) < 45;
  }
  function isNearWhiteHex(hex) {
    const rgb = parseHexRgb(hex);
    return !!rgb && rgb.r >= 245 && rgb.g >= 245 && rgb.b >= 245;
  }
  function isNearBlackHex(hex) {
    const rgb = parseHexRgb(hex);
    return !!rgb && rgb.r <= 50 && rgb.g <= 50 && rgb.b <= 55;
  }
  function firstColorHex(values) {
    for (const value of Object.values(values)) {
      if (parseHexRgb(value)) return value;
    }
    return null;
  }
  function inferColorThemeAssumption(colorModeName, selection, colorEntries, paintStyles, rawPaints) {
    var _a, _b;
    if (colorModeName && /^dark$/i.test(colorModeName.trim())) {
      return { colorThemeAssumption: "dark", manualDarkMode: false };
    }
    let darkBg = 0;
    let lightBg = 0;
    let whiteText = 0;
    let blackText = 0;
    let visiblePaintUsages = 0;
    let darkStyleBoost = 0;
    const countHexUsages = (hex, usages) => {
      for (const usage of usages) {
        if (usage.hidden) continue;
        if (usage.prop.kind !== "paint" || usage.prop.property !== "fills") {
          continue;
        }
        visiblePaintUsages++;
        if (usage.nodeType === "TEXT") {
          if (isNearWhiteHex(hex)) whiteText++;
          else if (isNearBlackHex(hex)) blackText++;
          continue;
        }
        if (isNeutralDarkHex(hex)) darkBg++;
        else if (isNeutralLightHex(hex)) lightBg++;
      }
    };
    for (const entry of colorEntries) {
      if (entry.resolvedType !== "COLOR") continue;
      const hex = firstColorHex(entry.values);
      if (hex) countHexUsages(hex, entry.usages);
    }
    for (const style of paintStyles) {
      countHexUsages(style.hex, style.usages);
      if (/^dark\//i.test(style.name.trim())) darkStyleBoost++;
    }
    for (const raw of rawPaints) {
      countHexUsages(raw.hex, raw.usages);
    }
    let rootDark = 0;
    let rootLight = 0;
    for (const root of selection) {
      if (!("fills" in root)) continue;
      const fills = root.fills;
      if (!Array.isArray(fills)) continue;
      for (let i = fills.length - 1; i >= 0; i--) {
        const paint = fills[i];
        if (paint.type !== "SOLID" || paint.visible === false) continue;
        if (((_a = paint.opacity) != null ? _a : 1) < 0.08) continue;
        const hex = rgbaToHex(__spreadProps(__spreadValues({}, paint.color), { a: (_b = paint.opacity) != null ? _b : 1 }));
        if (isNeutralDarkHex(hex)) rootDark++;
        else if (isNeutralLightHex(hex)) rootLight++;
        break;
      }
    }
    const rootsLookDark = rootDark > 0 && rootDark >= rootLight;
    const bgTotal = darkBg + lightBg;
    const textTotal = whiteText + blackText;
    const darkBgRatio = bgTotal > 0 ? darkBg / bgTotal : 0;
    const whiteTextDominates = textTotal > 0 && whiteText > blackText;
    const densityHit = visiblePaintUsages >= 8 && bgTotal >= 3 && textTotal >= 2 && darkBgRatio >= 0.65 && whiteTextDominates;
    const rootBoostHit = rootsLookDark && visiblePaintUsages >= 6 && bgTotal >= 2 && darkBgRatio >= 0.5 && whiteTextDominates;
    const styleBoostHit = darkStyleBoost >= 4 && darkBgRatio >= 0.5 && whiteTextDominates && visiblePaintUsages >= 6;
    if (densityHit || rootBoostHit || styleBoostHit) {
      return { colorThemeAssumption: "dark", manualDarkMode: true };
    }
    return { colorThemeAssumption: "light", manualDarkMode: false };
  }
  function classifyColorNameBackdrop(name) {
    const n = name.toLowerCase().replace(/\\/g, "/");
    if (/neutral|disabled|alpha|black-fixed|white-fixed|true-base|placeholder/.test(
      n
    )) {
      return "neutral";
    }
    if (/(^|\/)(brand|accent|error|warning|success|info|selected)(\/|$)/.test(n) || /(^|\/)(aqua|teal|purple|orange|pink|strawberry|affirmative|caution)(\/|$)/.test(
      n
    )) {
      return "chromatic";
    }
    return null;
  }
  function classifyStyleNameBackdrop(styleName) {
    const parts = styleName.split("/").map((p) => p.trim().toLowerCase()).filter(Boolean);
    if (parts.length < 2) return null;
    const family = parts[1];
    if (family === "gray" || family === "black" || family === "white" || family === "neutral") {
      return "neutral";
    }
    if ([
      "aqua",
      "teal",
      "purple",
      "orange",
      "pink",
      "strawberry",
      "affirmative",
      "caution",
      "info",
      "brand",
      "error",
      "warning",
      "success"
    ].includes(family)) {
      return "chromatic";
    }
    return null;
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
    async function classifySolidPaint(paint, host) {
      var _a2, _b2, _c;
      if (paint.type !== "SOLID" || paint.visible === false) return null;
      if (((_a2 = paint.opacity) != null ? _a2 : 1) < 0.08) return null;
      const alias = (_b2 = paint.boundVariables) == null ? void 0 : _b2.color;
      if (alias && isAliasLike(alias)) {
        try {
          const variable = await getVariableCached(alias.id);
          if (variable) {
            const byName = classifyColorNameBackdrop(variable.name);
            if (byName) return byName;
          }
        } catch (e) {
        }
      }
      const styleId = host.fillStyleId;
      if (typeof styleId === "string" && styleId) {
        const style = await getPaintStyle(styleId);
        if (style) {
          const byStyle = classifyStyleNameBackdrop(style.name);
          if (byStyle) return byStyle;
        }
      }
      const hex = rgbaToHex(__spreadProps(__spreadValues({}, paint.color), {
        a: (_c = paint.opacity) != null ? _c : 1
      }));
      return hexChroma(hex) >= 28 ? "chromatic" : "neutral";
    }
    async function classifyBackdrop(node, property, index) {
      if ("fills" in node) {
        const fills = node.fills;
        if (Array.isArray(fills)) {
          const start = property === "fills" ? index - 1 : fills.length - 1;
          for (let i = start; i >= 0; i--) {
            const kind = await classifySolidPaint(fills[i], node);
            if (kind) return kind;
          }
        }
      }
      let current = node.parent;
      while (current && current.type !== "PAGE" && current.type !== "DOCUMENT") {
        if ("fills" in current) {
          const fills = current.fills;
          if (Array.isArray(fills)) {
            for (let i = fills.length - 1; i >= 0; i--) {
              const kind = await classifySolidPaint(
                fills[i],
                current
              );
              if (kind) return kind;
            }
          }
        }
        current = current.parent;
      }
      return "unknown";
    }
    async function paintUsage(node, property, index, inInstance) {
      return {
        nodeId: node.id,
        nodeName: node.name,
        nodeType: node.type,
        prop: { kind: "paint", property, index },
        inInstance,
        hidden: isEffectivelyHidden(node),
        backdrop: await classifyBackdrop(node, property, index)
      };
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
      if (node.textCase !== figma.mixed) values.textCase = String(node.textCase);
      if (node.textDecoration !== figma.mixed) {
        values.textDecoration = String(node.textDecoration);
      }
      rawTexts.set(id, {
        id,
        label: `${font.family} ${font.style} ${size}`,
        values,
        usages: [usage]
      });
    }
    async function recordVariableUsage(variableId, usage, appliedRadius) {
      var _a2, _b2;
      const id = `var:${variableId}`;
      const existing = entries.get(id);
      if (existing) {
        if (existing.flag === "shapeVariable" && !isRadiusUsage(usage)) return;
        if (isRadiusUsage(usage)) {
          if (existing.flag !== "shapeVariable") existing.usages = [];
          existing.flag = "shapeVariable";
          if (existing.value === void 0 && appliedRadius !== void 0 && appliedRadius > 0) {
            existing.value = appliedRadius;
          }
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
      if (!variable) {
        if (isRadiusUsage(usage) && appliedRadius !== void 0 && appliedRadius > 0) {
          recordRawRadius(appliedRadius, usage);
        }
        return;
      }
      const collectionId = safeVariableCollectionId(variable);
      if (!collectionId) return;
      const collection = await getCollectionCached(collectionId);
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
      if (flag === "shapeVariable" && appliedRadius !== void 0 && appliedRadius > 0) {
        entry.value = appliedRadius;
      }
      entries.set(id, entry);
      recordVariableCompliance(entry, usage.hidden);
    }
    function recordRawPaint(hex, usage) {
      if (isFigmaComponentOutlineHex(hex)) return;
      const id = `hex:${hex}`;
      const existing = rawPaints.get(id);
      if (existing) existing.usages.push(usage);
      else rawPaints.set(id, { id, hex, usages: [usage] });
      recordCompliance(false, usage.hidden);
    }
    async function visitPaints(node, property, inInstance = false) {
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
          const hex = rgbaToHex(__spreadProps(__spreadValues({}, paint.color), { a: (_a2 = paint.opacity) != null ? _a2 : 1 }));
          if (isFigmaComponentOutlineHex(hex)) return;
          const usage = await paintUsage(node, property, solidIndex, inInstance);
          const id = `paintStyle:${styleId}`;
          const existing = paintStyles.get(id);
          if (existing) existing.usages.push(usage);
          else {
            paintStyles.set(id, {
              id,
              styleId,
              name: style.name,
              hex,
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
        const usage = await paintUsage(node, property, index, inInstance);
        const alias = (_b2 = paint.boundVariables) == null ? void 0 : _b2.color;
        if (alias && isAliasLike(alias)) {
          await recordVariableUsage(alias.id, usage);
        } else {
          recordRawPaint(
            rgbaToHex(__spreadProps(__spreadValues({}, paint.color), { a: (_c = paint.opacity) != null ? _c : 1 })),
            usage
          );
        }
      }
    }
    function recordRawRadius(value, usage) {
      if (!(value > 0)) return;
      const id = `radius:${value}`;
      const existing = rawRadii.get(id);
      if (existing) existing.usages.push(usage);
      else rawRadii.set(id, { id, label: `${value}px`, value, usages: [usage] });
      recordCompliance(false, usage.hidden);
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
        recordRawRadius(value, {
          nodeId: node.id,
          nodeName: node.name,
          nodeType: node.type,
          prop: { kind: "field", field },
          inInstance: false,
          hidden: isEffectivelyHidden(node)
        });
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
      await visitPaints(node, "fills", false);
      await visitPaints(node, "strokes", false);
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
        const record = node;
        for (const field of Object.keys(bound)) {
          if (SKIP_FIELDS.has(field)) continue;
          const value = bound[field];
          if (!isAliasLike(value)) continue;
          const appliedRadius = RADIUS_FIELDS.includes(field) && typeof record[field] === "number" ? record[field] : void 0;
          await recordVariableUsage(
            value.id,
            {
              nodeId: node.id,
              nodeName: node.name,
              nodeType: node.type,
              prop: { kind: "field", field },
              inInstance: false,
              hidden: isEffectivelyHidden(node)
            },
            appliedRadius
          );
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
    const stack = selection.map(
      (node) => ({ node, inInstance: false })
    );
    while (stack.length > 0) {
      const { node, inInstance } = stack.pop();
      nodesScanned++;
      if (!isEffectivelyHidden(node)) visibleNodesScanned++;
      if (nodesScanned % 250 === 0) {
        onProgress(nodesScanned);
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
      if (node.type === "INSTANCE") {
        if (!inInstance) await visitInstance(node);
        await visitPaints(node, "fills", true);
        await visitPaints(node, "strokes", true);
        for (const child of node.children) {
          stack.push({ node: child, inInstance: true });
        }
        continue;
      }
      if (inInstance) {
        await visitPaints(node, "fills", true);
        await visitPaints(node, "strokes", true);
        if ("children" in node) {
          for (const child of node.children) {
            stack.push({ node: child, inInstance: true });
          }
        }
        continue;
      }
      await visitSurfaceNode(node);
      if ("children" in node) {
        for (const child of node.children) {
          stack.push({ node: child, inInstance: false });
        }
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
    const fontSizeKey = (values, label) => {
      var _a2;
      const fromSize = Number(String((_a2 = values.size) != null ? _a2 : "").replace(/px$/i, "").trim());
      if (Number.isFinite(fromSize) && fromSize > 0) return fromSize;
      const match = /(\d+(?:\.\d+)?)\s*(?:px)?\s*$/i.exec(label);
      if (match) {
        const n = Number(match[1]);
        if (Number.isFinite(n) && n >= 6 && n <= 200) return n;
      }
      return Number.POSITIVE_INFINITY;
    };
    const byFontSize = (a, b) => {
      var _a2, _b2, _c, _d;
      const aLabel = (_b2 = (_a2 = a.name) != null ? _a2 : a.label) != null ? _b2 : "";
      const bLabel = (_d = (_c = b.name) != null ? _c : b.label) != null ? _d : "";
      const sizeDiff = fontSizeKey(a.values, aLabel) - fontSizeKey(b.values, bLabel);
      if (sizeDiff !== 0) return sizeDiff;
      return aLabel.localeCompare(bLabel);
    };
    const findingTextStyles = Array.from(textStyles.values()).filter((s) => !s.isSourceOfTruth).sort(byFontSize);
    const findingRawTexts = Array.from(rawTexts.values()).sort(byFontSize);
    const findingFontAwesomeTexts = Array.from(fontAwesomeTexts.values()).sort(
      byFontSize
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
    const theme = inferColorThemeAssumption(
      colorModeName,
      selection,
      findingEntries,
      findingPaintStyles,
      findingRawPaints
    );
    return {
      selectionLabel,
      rootNodeIds: selection.map((n) => n.id),
      colorModeName,
      colorThemeAssumption: theme.colorThemeAssumption,
      manualDarkMode: theme.manualDarkMode,
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

  // src/data/cadsVariables.ts
  var bakedVariablesFetchedAt = null;
  var bakedVariableCollections = [];
  var bakedVariables = [];

  // src/main/catalog.ts
  var CACHE_KEY = "cads-variable-catalog-v1";
  var IMPORT_CONCURRENCY = 24;
  async function mapPool(items, concurrency, fn) {
    const results = new Array(items.length);
    let next = 0;
    async function worker() {
      while (next < items.length) {
        const index = next++;
        results[index] = await fn(items[index], index);
      }
    }
    const workers = Array.from(
      { length: Math.min(concurrency, Math.max(items.length, 1)) },
      () => worker()
    );
    await Promise.all(workers);
    return results;
  }
  function collectionSignature(collections) {
    return collections.map((c) => `${c.key}:${c.variableCount}`).sort().join("|");
  }
  function fromBaked(libraryName) {
    if (bakedVariables.length === 0 || bakedVariableCollections.length === 0) {
      return null;
    }
    return {
      catalog: {
        libraryName,
        collections: bakedVariableCollections,
        variables: bakedVariables.map((entry) => ({
          key: entry.key,
          variableId: "",
          name: entry.name,
          resolvedType: entry.resolvedType,
          collectionKey: entry.collectionKey,
          collectionName: entry.collectionName,
          values: entry.values
        })),
        textStyles: [],
        textStyleSource: "none"
      },
      importedByKey: /* @__PURE__ */ new Map()
    };
  }
  async function readCache(libraryName, signature) {
    var _a, _b;
    try {
      const cached = await figma.clientStorage.getAsync(
        CACHE_KEY
      );
      if (!cached || cached.libraryName !== libraryName || cached.signature !== signature || !((_b = (_a = cached.catalog) == null ? void 0 : _a.variables) == null ? void 0 : _b.length)) {
        return null;
      }
      if (bakedVariablesFetchedAt && cached.fetchedAt && cached.fetchedAt < bakedVariablesFetchedAt) {
        return null;
      }
      return {
        catalog: __spreadProps(__spreadValues({}, cached.catalog), {
          textStyles: [],
          textStyleSource: "none"
        }),
        importedByKey: /* @__PURE__ */ new Map()
      };
    } catch (e) {
      return null;
    }
  }
  async function writeCache(libraryName, signature, catalog) {
    try {
      const payload = {
        fetchedAt: bakedVariablesFetchedAt,
        libraryName,
        signature,
        catalog: __spreadProps(__spreadValues({}, catalog), {
          textStyles: [],
          textStyleSource: "none"
        })
      };
      await figma.clientStorage.setAsync(CACHE_KEY, payload);
    } catch (e) {
    }
  }
  async function importCatalog(libraryName, collections, collectionVariables, onProgress) {
    const jobs = [];
    for (let i = 0; i < collections.length; i++) {
      for (const libVar of collectionVariables[i]) {
        jobs.push({ libVar, collection: collections[i] });
      }
    }
    const total = jobs.length;
    const variables = [];
    const importedByKey = /* @__PURE__ */ new Map();
    const modesByCollectionKey = /* @__PURE__ */ new Map();
    let done = 0;
    onProgress(0, total);
    await new Promise((resolve) => setTimeout(resolve, 0));
    await mapPool(jobs, IMPORT_CONCURRENCY, async (job) => {
      try {
        const imported = await figma.variables.importVariableByKeyAsync(
          job.libVar.key
        );
        importedByKey.set(job.libVar.key, imported);
        const collectionId = safeVariableCollectionId(imported);
        const importedCollection = collectionId ? await getCollectionCached(collectionId) : null;
        if (importedCollection && !modesByCollectionKey.has(job.collection.key)) {
          modesByCollectionKey.set(
            job.collection.key,
            importedCollection.modes.map((m) => m.name)
          );
        }
        variables.push({
          key: job.libVar.key,
          variableId: imported.id,
          name: imported.name,
          resolvedType: imported.resolvedType,
          collectionKey: job.collection.key,
          collectionName: job.collection.name,
          values: importedCollection ? await resolveDisplayValues(imported, importedCollection) : {}
        });
      } catch (e) {
      } finally {
        done++;
        if (done % IMPORT_CONCURRENCY === 0 || done === total) {
          onProgress(done, total);
        }
      }
    });
    onProgress(total, total);
    const catalogCollections = collections.map(
      (collection, i) => {
        var _a;
        return {
          key: collection.key,
          name: collection.name,
          modes: (_a = modesByCollectionKey.get(collection.key)) != null ? _a : [],
          variableCount: collectionVariables[i].length
        };
      }
    );
    return {
      catalog: {
        libraryName,
        collections: catalogCollections,
        variables,
        textStyles: [],
        textStyleSource: "none"
      },
      importedByKey
    };
  }
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
    const signature = collectionSignature(
      collections.map((c, i) => ({
        key: c.key,
        variableCount: collectionVariables[i].length
      }))
    );
    const baked = fromBaked(libraryName);
    if (baked) {
      const bakedCount = baked.catalog.variables.length;
      const liveCount = collectionVariables.reduce((sum, v) => sum + v.length, 0);
      if (bakedCount > 0 && bakedCount >= liveCount * 0.9) {
        onProgress(bakedCount, bakedCount);
        return baked;
      }
    }
    const cached = await readCache(libraryName, signature);
    if (cached) {
      onProgress(
        cached.catalog.variables.length,
        cached.catalog.variables.length
      );
      return cached;
    }
    const imported = await importCatalog(
      libraryName,
      collections,
      collectionVariables,
      onProgress
    );
    await writeCache(libraryName, signature, imported.catalog);
    return imported;
  }

  // src/main/apply.ts
  var nodeCache = /* @__PURE__ */ new Map();
  var RADIUS_FIELDS2 = [
    "topLeftRadius",
    "topRightRadius",
    "bottomLeftRadius",
    "bottomRightRadius"
  ];
  function isRadiusField(field) {
    return RADIUS_FIELDS2.includes(field);
  }
  function isAliasLike2(value) {
    return typeof value === "object" && value !== null && value.type === "VARIABLE_ALIAS" && typeof value.id === "string";
  }
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
  function rebindRadiusCorners(node, auditedField, variable) {
    var _a;
    const record = node;
    const bound = (_a = node.boundVariables) != null ? _a : {};
    const auditedAlias = bound[auditedField];
    const fieldsToBind = [];
    if (isAliasLike2(auditedAlias)) {
      for (const field of RADIUS_FIELDS2) {
        const alias = bound[field];
        if (isAliasLike2(alias) && alias.id === auditedAlias.id) {
          fieldsToBind.push(field);
        }
      }
    } else {
      const sourceValue = record[auditedField];
      if (typeof sourceValue !== "number") {
        fieldsToBind.push(auditedField);
      } else {
        for (const field of RADIUS_FIELDS2) {
          if (record[field] !== sourceValue) continue;
          if (isAliasLike2(bound[field])) continue;
          fieldsToBind.push(field);
        }
      }
    }
    if (fieldsToBind.length === 0) {
      fieldsToBind.push(auditedField);
    }
    for (const field of fieldsToBind) {
      node.setBoundVariable(field, variable);
    }
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
    const bindable = node;
    if (isRadiusField(usage.prop.field)) {
      rebindRadiusCorners(bindable, usage.prop.field, variable);
      return;
    }
    bindable.setBoundVariable(usage.prop.field, variable);
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
        const collectionId = safeVariableCollectionId(variable);
        if (!collectionId) continue;
        const collection = await getCollectionCached(collectionId);
        if (collection && collection.key === request.setMode.collectionKey) {
          targetCollection = collection;
          break;
        }
      }
      if (!targetCollection && anyImported) {
        const fallbackId = safeVariableCollectionId(anyImported);
        if (fallbackId) {
          targetCollection = await getCollectionCached(fallbackId);
        }
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
    return {
      usagesRebound,
      variablesRemapped,
      componentsSwapped: 0,
      modesSet,
      modesCleared,
      failures
    };
  }

  // src/data/componentSwaps.ts
  var SIZE_LMXS = {
    L: "large",
    M: "medium",
    S: "small",
    XS: "extraSmall",
    large: "large",
    medium: "medium",
    small: "small",
    extraSmall: "extraSmall"
  };
  var STATE_DEFAULT = {
    Default: "default",
    default: "default",
    Hover: "hover",
    hover: "hover",
    Focus: "focus",
    focus: "focus",
    Pressed: "pressed",
    pressed: "pressed",
    Press: "press",
    press: "press",
    Disabled: "disabled",
    disabled: "disabled",
    Visited: "visited",
    visited: "visited"
  };
  var MEANING_TO_SENTIMENT = {
    Primary: "brand",
    Brand: "brand",
    Success: "success",
    Danger: "error",
    Error: "error",
    Warning: "warning",
    Info: "info",
    Gray: "neutral",
    Aqua: "pink"
  };
  var MEANING_TO_TOAST_SENTIMENT = {
    Primary: "primary",
    Success: "success",
    Danger: "error",
    Warning: "warning",
    Info: "info",
    Gray: "neutral"
  };
  var componentSwapRules = [
    {
      dscoKey: "cbc707599ceb83eaa1cee51d698831793e0ebde6",
      dscoName: "Button",
      cadsName: "Button",
      // Current published DSCO Button ≈ CADS (same axes). Stale consumer
      // instances may still carry older names/values (Size/S, startIcon Name).
      propNames: {
        "startIcon Name": "startIconName",
        "endIcon Name": "endIconName",
        Size: "size",
        State: "state",
        Color: "color",
        Variant: "variant",
        "Icon Only": "iconOnly",
        IconOnly: "iconOnly"
      },
      variantValues: {
        // Current: large/medium/small/extraSmall. Legacy: L/M/S/XS.
        size: SIZE_LMXS,
        Size: SIZE_LMXS,
        state: STATE_DEFAULT,
        State: STATE_DEFAULT,
        color: {
          primary: "primary",
          secondary: "secondary",
          tertiary: "tertiary",
          "white (deprecated)": "secondary",
          white: "secondary",
          error: "error",
          Primary: "primary",
          Secondary: "secondary",
          Tertiary: "tertiary",
          Error: "error"
        },
        Color: {
          primary: "primary",
          secondary: "secondary",
          tertiary: "tertiary",
          "white (deprecated)": "secondary",
          white: "secondary",
          Primary: "primary",
          Secondary: "secondary",
          Tertiary: "tertiary"
        },
        variant: {
          contained: "contained",
          outlined: "outlined",
          text: "text",
          Contained: "contained",
          Outlined: "outlined",
          Text: "text",
          filled: "contained",
          Filled: "contained"
        },
        Variant: {
          contained: "contained",
          outlined: "outlined",
          text: "text",
          Contained: "contained",
          Outlined: "outlined",
          Text: "text",
          filled: "contained",
          Filled: "contained"
        },
        iconOnly: { No: "No", Yes: "Yes", no: "No", yes: "Yes", false: "No", true: "Yes" },
        "Icon Only": { No: "No", Yes: "Yes", no: "No", yes: "Yes" }
      }
    },
    {
      dscoKey: "0478bc835a0e7e1593fc0e6f3044f54730b66861",
      dscoName: "Destructive Button",
      cadsName: "Button",
      forceVariants: { color: "error" },
      propNames: {
        "startIcon Name": "startIconName",
        "endIcon Name": "endIconName",
        Size: "size",
        State: "state",
        Color: "color",
        Variant: "variant",
        "Icon Only": "iconOnly",
        IconOnly: "iconOnly"
      },
      variantValues: {
        size: SIZE_LMXS,
        Size: SIZE_LMXS,
        state: STATE_DEFAULT,
        State: STATE_DEFAULT,
        variant: {
          contained: "contained",
          outlined: "outlined",
          text: "text",
          Contained: "contained",
          Outlined: "outlined",
          Text: "text",
          filled: "contained",
          Filled: "contained"
        },
        Variant: {
          contained: "contained",
          outlined: "outlined",
          text: "text",
          Contained: "contained",
          Outlined: "outlined",
          Text: "text",
          filled: "contained",
          Filled: "contained"
        },
        iconOnly: { No: "No", Yes: "Yes", no: "No", yes: "Yes", false: "No", true: "Yes" }
      }
    },
    {
      dscoKey: "385632d619eb1dffc825a323a3f596b2011f8bb7",
      dscoName: "Close Icon Button",
      cadsName: "Close Icon Button",
      propNames: {
        Size: "size",
        State: "state",
        Color: "color"
      },
      variantValues: {
        size: SIZE_LMXS,
        Size: SIZE_LMXS,
        state: __spreadProps(__spreadValues({}, STATE_DEFAULT), {
          Pressed: "press",
          pressed: "press"
        }),
        State: __spreadProps(__spreadValues({}, STATE_DEFAULT), {
          Pressed: "press",
          pressed: "press"
        }),
        color: {
          Default: "primary",
          Strong: "secondary",
          "Solid Black": "primary",
          "Solid White": "secondary",
          primary: "primary",
          secondary: "secondary"
        },
        Color: {
          Default: "primary",
          Strong: "secondary",
          "Solid Black": "primary",
          "Solid White": "secondary"
        }
      }
    },
    {
      dscoKey: "341373d642bfd3c0e0cbb35c1130b146945a2321",
      dscoName: "Chip",
      cadsName: "Chip",
      propNames: {
        Text: "label",
        Size: "size",
        Selected: "selected",
        Color: "color",
        State: "state",
        Type: "labelStyle"
      },
      variantValues: {
        size: SIZE_LMXS,
        Size: SIZE_LMXS,
        selected: { No: "no", Yes: "yes", no: "no", yes: "yes" },
        Selected: { No: "no", Yes: "yes" },
        color: {
          Gray: "primary",
          Black: "secondary",
          Selected: "primary",
          primary: "primary",
          secondary: "secondary"
        },
        Color: {
          Gray: "primary",
          Black: "secondary",
          Selected: "primary"
        },
        labelStyle: { Thick: "thick", Thin: "thin", thick: "thick", thin: "thin" },
        Type: { Thick: "thick", Thin: "thin" },
        state: __spreadProps(__spreadValues({}, STATE_DEFAULT), {
          Pressed: "press",
          pressed: "press"
        }),
        State: __spreadProps(__spreadValues({}, STATE_DEFAULT), {
          Pressed: "press",
          pressed: "press"
        })
      }
    },
    {
      dscoKey: "8314a929103d75e027acd08445eb326299d24b74",
      dscoName: "Link",
      cadsName: "Link",
      captureText: true,
      textCaptureTarget: "linkText",
      propNames: {
        Size: "size",
        State: "state",
        Type: "type"
      },
      variantValues: {
        size: SIZE_LMXS,
        Size: SIZE_LMXS,
        type: {
          Primary: "primary",
          Secondary: "secondary",
          primary: "primary",
          secondary: "secondary"
        },
        Type: { Primary: "primary", Secondary: "secondary" },
        state: __spreadProps(__spreadValues({}, STATE_DEFAULT), {
          Pressed: "press",
          pressed: "press"
        }),
        State: __spreadProps(__spreadValues({}, STATE_DEFAULT), {
          Pressed: "press",
          pressed: "press"
        })
      }
    },
    {
      dscoKey: "6da8599310350b4a87b2a2f8e08d34ae3376a1d1",
      dscoName: "Tag",
      cadsName: "Tag",
      propNames: {
        Label: "labelText",
        "Icon Name": "startIconName",
        Size: "size",
        Color: "color",
        "Is Removable": "isDismissible"
      },
      variantValues: {
        size: SIZE_LMXS,
        Size: SIZE_LMXS,
        color: {
          Teal: "brand",
          Purple: "pink",
          Aqua: "info",
          Error: "error",
          Warning: "warning",
          Success: "success",
          Gray: "neutral",
          Disabled: "neutral",
          brand: "brand",
          neutral: "neutral",
          pink: "pink",
          orange: "orange",
          success: "success",
          error: "error",
          warning: "warning",
          info: "info"
        },
        Color: {
          Teal: "brand",
          Purple: "pink",
          Aqua: "info",
          Error: "error",
          Warning: "warning",
          Success: "success",
          Gray: "neutral",
          Disabled: "neutral"
        }
      }
    },
    {
      dscoKey: "3133f83a3f98b68c1f3081132b2e90bb5d1dc59a",
      dscoName: "Alert",
      cadsName: "Alert",
      propNames: {
        Size: "size",
        Meaning: "sentiment",
        hasLink: "hasAction",
        hasIcon: "hasIcon"
      },
      variantValues: {
        size: SIZE_LMXS,
        Size: SIZE_LMXS,
        sentiment: MEANING_TO_SENTIMENT,
        Meaning: MEANING_TO_SENTIMENT,
        hasIcon: { Yes: "true", No: "false", yes: "true", no: "false" }
      }
    },
    {
      dscoKey: "949e2949033f60df26231b2f73985b488f9f78fe",
      dscoName: "Toast",
      cadsName: "Toast",
      propNames: {
        alertText: "toastText",
        alertIcon: "toastIcon",
        Meaning: "sentiment",
        hasLink: "hasAction",
        hasIcon: "hasIcon"
      },
      variantValues: {
        sentiment: MEANING_TO_TOAST_SENTIMENT,
        Meaning: MEANING_TO_TOAST_SENTIMENT,
        hasIcon: { Yes: "true", No: "false", yes: "true", no: "false" }
      }
    },
    {
      dscoKey: "64993adac217e2c6daab4eb131f94531d02e65a9",
      dscoName: "Notification Banner",
      cadsName: "Notification Banner",
      propNames: {
        Title: "titleText",
        Description: "descriptionText",
        Icon: "iconName",
        "Secondary Action": "hasSecondaryAction",
        "Primary Action": "hasPrimaryAction",
        "Dismissible   ": "isDismissible",
        Dismissible: "isDismissible",
        Meaning: "sentiment",
        Style: "fillStyle"
      },
      variantValues: {
        sentiment: MEANING_TO_SENTIMENT,
        Meaning: MEANING_TO_SENTIMENT,
        fillStyle: { Default: "none", Color: "color", none: "none", color: "color" },
        Style: { Default: "none", Color: "color" }
      }
    },
    // FA Icon → v7: identical prop surface (icon-name TEXT + style/padding/scale).
    {
      dscoKey: "051a05d840dcf0a8220c056833c040fc581dff41",
      dscoName: "Font Awesome Icon",
      cadsName: "Font Awesome Icon v7"
    },
    {
      dscoKey: "2073beaaf6394b66220e04a5588a35e08d66daf2",
      dscoName: "Font Awesome Duotone Icon",
      cadsName: "Font Awesome Duotone Icon v7"
    },
    // Pegasus FA Icon shares the same published prop surface as DSCO.
    {
      dscoKey: "6315f244285e23cac76df5c8e3c807276fdc0da4",
      dscoName: "Font Awesome Icon",
      cadsName: "Font Awesome Icon v7"
    }
  ];
  var ruleByDscoKey = new Map(
    componentSwapRules.map((rule) => [rule.dscoKey, rule])
  );
  var cadsKeyByName = new Map(
    cadsComponents.map((component) => [component.name, component.key])
  );
  function propBaseName(key) {
    var _a;
    return (_a = key.split("#")[0]) != null ? _a : key;
  }
  function parseVariantName(name) {
    const result = {};
    if (!name.includes("=")) return result;
    for (const part of name.split(",")) {
      const eq = part.indexOf("=");
      if (eq === -1) continue;
      const key = part.slice(0, eq).trim();
      const value = part.slice(eq + 1).trim();
      if (key) result[key] = value;
    }
    return result;
  }
  function normalizeSizeValue(value) {
    var _a, _b;
    return (_b = (_a = SIZE_LMXS[value]) != null ? _a : SIZE_LMXS[value.trim()]) != null ? _b : value;
  }
  function getComponentSwapRule(dscoKey) {
    var _a;
    return (_a = ruleByDscoKey.get(dscoKey)) != null ? _a : null;
  }
  function resolveCadsComponentKey(cadsName) {
    var _a;
    return (_a = cadsKeyByName.get(cadsName)) != null ? _a : null;
  }
  function normalizePropBase(name) {
    return name.replace(/\s+/g, "").toLocaleLowerCase();
  }
  function findTargetPropKey(targetProps, baseName) {
    if (targetProps[baseName]) return baseName;
    const lower = baseName.toLocaleLowerCase();
    const compacted = normalizePropBase(baseName);
    for (const key of Object.keys(targetProps)) {
      const base = propBaseName(key);
      if (base.toLocaleLowerCase() === lower) return key;
      if (normalizePropBase(base) === compacted) return key;
    }
    return null;
  }
  function remapVariantValue(rule, axis, value) {
    var _a;
    const table = (_a = rule.variantValues) == null ? void 0 : _a[axis];
    if (table && table[value] !== void 0) return table[value];
    if (table) {
      const hit = Object.entries(table).find(
        ([from]) => from.toLocaleLowerCase() === value.toLocaleLowerCase()
      );
      if (hit) return hit[1];
    }
    if (axis.toLocaleLowerCase() === "size") {
      return normalizeSizeValue(value);
    }
    return value;
  }
  function applyButtonRestrictedCombos(variants) {
    const out = __spreadValues({}, variants);
    const variant = out.variant;
    const color = out.color;
    const iconOnly = out.iconOnly;
    if (color === "tertiary") {
      const tertiaryOk = variant === "text" && iconOnly === "Yes";
      if (!tertiaryOk) out.color = "secondary";
    }
    if (out.color === "orange" && variant !== "contained") {
      out.color = "primary";
    }
    if (variant === "outlined" && iconOnly === "Yes") {
      if (out.color === "tertiary" || out.color === "orange") {
        out.color = out.color === "orange" ? "primary" : "secondary";
      }
    }
    return out;
  }
  function remapVariants(rule, captured) {
    var _a, _b;
    const out = {};
    for (const [axis, value] of Object.entries(captured.variants)) {
      const targetAxis = (_b = (_a = rule.propNames) == null ? void 0 : _a[axis]) != null ? _b : axis;
      const remapped = remapVariantValue(rule, axis, value);
      const alsoByTarget = remapVariantValue(rule, targetAxis, remapped);
      if (alsoByTarget === "true" || alsoByTarget === "false" || alsoByTarget === "Yes" || alsoByTarget === "No" || alsoByTarget === "yes" || alsoByTarget === "no") {
        if (targetAxis.toLocaleLowerCase() === "hasicon") continue;
      }
      if (targetAxis.toLocaleLowerCase() === "state") {
        out[targetAxis] = "default";
        continue;
      }
      out[targetAxis] = alsoByTarget;
    }
    if (rule.forceVariants) {
      for (const [axis, value] of Object.entries(rule.forceVariants)) {
        out[axis] = value;
      }
    }
    if (rule.cadsName === "Button") {
      return applyButtonRestrictedCombos(out);
    }
    return out;
  }
  function buildContentProperties(rule, captured, targetProps) {
    var _a, _b, _c, _d, _e;
    const targetMeta = __spreadValues({}, targetProps);
    const out = {};
    for (const [sourceKey, value] of Object.entries(captured.properties)) {
      const sourceBase = propBaseName(sourceKey);
      const targetBase = (_b = (_a = rule.propNames) == null ? void 0 : _a[sourceBase]) != null ? _b : sourceBase;
      const targetKey = findTargetPropKey(targetMeta, targetBase);
      if (!targetKey) continue;
      const targetType = targetMeta[targetKey].type;
      if (targetType === "VARIANT") continue;
      if (targetType === "BOOLEAN") {
        if (typeof value === "boolean") out[targetKey] = value;
        else if (value === "true" || value === "Yes" || value === "yes")
          out[targetKey] = true;
        else if (value === "false" || value === "No" || value === "no")
          out[targetKey] = false;
        continue;
      }
      if (targetType === "TEXT" && (typeof value === "string" || typeof value === "boolean")) {
        out[targetKey] = String(value);
      }
    }
    for (const [axis, value] of Object.entries(captured.variants)) {
      const targetAxis = (_d = (_c = rule.propNames) == null ? void 0 : _c[axis]) != null ? _d : axis;
      const targetKey = findTargetPropKey(targetMeta, targetAxis);
      if (!targetKey || targetMeta[targetKey].type !== "BOOLEAN") continue;
      const remapped = remapVariantValue(rule, axis, value);
      if (remapped === "true" || remapped === "Yes" || remapped === "yes") {
        out[targetKey] = true;
      } else if (remapped === "false" || remapped === "No" || remapped === "no") {
        out[targetKey] = false;
      }
    }
    if (captured.tagIconPlacement) {
      const startKey = findTargetPropKey(targetMeta, "startIcon");
      const endKey = findTargetPropKey(targetMeta, "endIcon");
      if (startKey && targetMeta[startKey].type === "BOOLEAN") {
        out[startKey] = captured.tagIconPlacement === "Left";
      }
      if (endKey && targetMeta[endKey].type === "BOOLEAN") {
        out[endKey] = captured.tagIconPlacement === "Right";
      }
    }
    if (rule.captureText && rule.textCaptureTarget && captured.capturedText) {
      const targetKey = findTargetPropKey(targetMeta, rule.textCaptureTarget);
      if (targetKey) out[targetKey] = captured.capturedText;
    }
    const removable = (_e = captured.variants["Is Removable"]) != null ? _e : captured.variants.isDismissible;
    if (removable !== void 0) {
      const targetKey = findTargetPropKey(targetMeta, "isDismissible");
      if (targetKey && targetMeta[targetKey].type === "BOOLEAN") {
        out[targetKey] = removable === "Yes" || removable === "yes" || removable === "true";
      }
    }
    return out;
  }

  // src/main/components.ts
  var importedSets = /* @__PURE__ */ new Map();
  async function importCadsComponentSet(key) {
    const cached = importedSets.get(key);
    if (cached) return cached;
    const node = await figma.importComponentSetByKeyAsync(key);
    importedSets.set(key, node);
    return node;
  }
  async function getInstance(nodeId) {
    try {
      const node = await figma.getNodeByIdAsync(nodeId);
      if (!node || node.type !== "INSTANCE") return null;
      return node;
    } catch (e) {
      return null;
    }
  }
  function sourceNameFor(audit, sourceId) {
    if (!sourceId.startsWith("component:")) return null;
    const key = sourceId.slice("component:".length);
    const entry = audit.components.find((component) => component.key === key);
    if (!entry) return null;
    return { name: entry.name, usages: entry.usages, dscoKey: entry.key };
  }
  async function captureInstanceProps(instance) {
    var _a;
    const properties = {};
    const variants = {};
    for (const [key, prop] of Object.entries(instance.componentProperties)) {
      if (prop.type === "VARIANT") {
        variants[propBaseName(key)] = String(prop.value).trim();
        properties[key] = String(prop.value);
      } else if (prop.type === "BOOLEAN") {
        properties[key] = Boolean(prop.value);
      } else if (prop.type === "TEXT") {
        properties[key] = String(prop.value);
      }
    }
    if (instance.variantProperties) {
      for (const [axis, value] of Object.entries(instance.variantProperties)) {
        if (typeof value === "string") variants[axis] = value.trim();
      }
    }
    try {
      const main = await instance.getMainComponentAsync();
      if (main) {
        const fromName = parseVariantName(main.name);
        for (const [axis, value] of Object.entries(fromName)) {
          variants[axis] = value.trim();
        }
      }
    } catch (e) {
    }
    const aliases = {
      Size: "size",
      State: "state",
      Color: "color",
      Variant: "variant",
      "Icon Only": "iconOnly",
      IconOnly: "iconOnly",
      Type: "type",
      Selected: "selected"
    };
    for (const [from, to] of Object.entries(aliases)) {
      if (variants[from] !== void 0 && variants[to] === void 0) {
        variants[to] = variants[from];
      }
    }
    let tagIconPlacement = null;
    const iconAxis = (_a = variants.Icon) != null ? _a : variants.icon;
    if (iconAxis === "Left" || iconAxis === "Right" || iconAxis === "None") {
      tagIconPlacement = iconAxis;
    }
    return {
      properties,
      variants,
      capturedText: null,
      tagIconPlacement
    };
  }
  function captureFirstText(instance) {
    const texts = [];
    const walk = (node) => {
      if (node.type === "TEXT") texts.push(node);
      if ("children" in node) {
        for (const child of node.children) walk(child);
      }
    };
    for (const child of instance.children) walk(child);
    const text = texts[0];
    return text && typeof text.characters === "string" ? text.characters : null;
  }
  function targetPropMeta(props) {
    const meta = {};
    for (const [key, prop] of Object.entries(props)) {
      meta[key] = { type: prop.type };
    }
    return meta;
  }
  function findMatchingVariant(set, want) {
    const wantEntries = Object.entries(want);
    if (wantEntries.length === 0) return null;
    const matches = [];
    for (const child of set.children) {
      if (child.type !== "COMPONENT") continue;
      const got = parseVariantName(child.name);
      let ok = true;
      for (const [axis, value] of wantEntries) {
        if (got[axis] !== value) {
          ok = false;
          break;
        }
      }
      if (ok) matches.push(child);
    }
    if (matches.length === 0) return null;
    if (matches.length === 1) return matches[0];
    const defaultState = matches.find((child) => {
      var _a;
      const got = parseVariantName(child.name);
      return ((_a = got.state) != null ? _a : "").toLocaleLowerCase() === "default";
    });
    return defaultState != null ? defaultState : matches[0];
  }
  function readVariants(instance) {
    const out = {};
    if (instance.variantProperties) {
      for (const [axis, value] of Object.entries(instance.variantProperties)) {
        if (typeof value === "string") out[axis] = value;
      }
    }
    for (const [key, prop] of Object.entries(instance.componentProperties)) {
      if (prop.type === "VARIANT") out[propBaseName(key)] = String(prop.value);
    }
    return out;
  }
  function variantsMatch(actual, want) {
    var _a;
    const missing = [];
    for (const [axis, value] of Object.entries(want)) {
      if (actual[axis] !== value) {
        missing.push(`${axis}=${value} (got ${(_a = actual[axis]) != null ? _a : "\u2205"})`);
      }
    }
    return missing;
  }
  function criticalAxes(want) {
    const out = {};
    for (const axis of [
      "size",
      "variant",
      "color",
      "iconOnly",
      "selected",
      "type",
      "labelStyle",
      "sentiment",
      "fillStyle",
      // Font Awesome Icon / Duotone
      "style",
      "padding",
      "scale",
      "family"
    ]) {
      if (want[axis] !== void 0) out[axis] = want[axis];
    }
    return out;
  }
  function withoutState(want) {
    const _a = want, { state: _state } = _a, rest = __objRest(_a, ["state"]);
    return rest;
  }
  async function swapOne(instance, rule, cadsKey) {
    var _a, _b, _c, _d, _e;
    const captured = await captureInstanceProps(instance);
    if (rule.captureText) {
      captured.capturedText = captureFirstText(instance);
    }
    const set = await importCadsComponentSet(cadsKey);
    const wantVariants = remapVariants(rule, captured);
    const critical = criticalAxes(wantVariants);
    if (Object.keys(critical).length === 0 && Object.keys(wantVariants).length === 0) {
      throw new Error(
        `could not read variant props from "${instance.name}"`
      );
    }
    const wantWithDefault = __spreadValues(__spreadValues({}, critical), wantVariants.state ? { state: "default" } : {});
    let target = (_c = (_b = (_a = findMatchingVariant(set, wantWithDefault)) != null ? _a : findMatchingVariant(set, critical)) != null ? _b : findMatchingVariant(set, withoutState(wantVariants))) != null ? _c : findMatchingVariant(set, wantVariants);
    if (!target) {
      throw new Error(
        `no CADS "${rule.cadsName}" variant for ${Object.entries(
          Object.keys(critical).length > 0 ? critical : wantVariants
        ).map(([k, v]) => `${k}=${v}`).join(", ")}`
      );
    }
    instance.swapComponent(target);
    const content = buildContentProperties(
      rule,
      captured,
      targetPropMeta(instance.componentProperties)
    );
    if (Object.keys(content).length > 0) {
      try {
        instance.setProperties(content);
      } catch (error) {
        throw new Error(
          `swapped but content props failed: ${String((_d = error.message) != null ? _d : error)}`
        );
      }
    }
    if (Object.keys(critical).length > 0) {
      let mismatches = variantsMatch(readVariants(instance), critical);
      if (mismatches.length > 0) {
        const retry = (_e = findMatchingVariant(set, wantWithDefault)) != null ? _e : findMatchingVariant(set, critical);
        if (retry) {
          instance.swapComponent(retry);
          const content2 = buildContentProperties(
            rule,
            captured,
            targetPropMeta(instance.componentProperties)
          );
          if (Object.keys(content2).length > 0) {
            try {
              instance.setProperties(content2);
            } catch (e) {
            }
          }
        }
        mismatches = variantsMatch(readVariants(instance), critical);
        if (mismatches.length > 0) {
          throw new Error(
            `swapped but variants drifted: ${mismatches.join("; ")}`
          );
        }
      }
    }
  }
  async function applyComponentSwaps(request, audit) {
    var _a;
    importedSets.clear();
    const failures = [];
    let swapped = 0;
    for (const mapping of request.mappings) {
      if (!mapping.sourceId.startsWith("component:")) continue;
      const source = sourceNameFor(audit, mapping.sourceId);
      if (!source) {
        failures.push({
          nodeName: "\u2014",
          sourceName: mapping.sourceId,
          reason: "component finding no longer in audit"
        });
        continue;
      }
      const rule = getComponentSwapRule(source.dscoKey);
      if (!rule) {
        failures.push({
          nodeName: "\u2014",
          sourceName: source.name,
          reason: "no Wave A/B swap rule for this component"
        });
        continue;
      }
      const usages = mapping.usageIndexes === void 0 ? source.usages : mapping.usageIndexes.map((index) => source.usages[index]).filter((usage) => Boolean(usage));
      for (const usage of usages) {
        const instance = await getInstance(usage.nodeId);
        if (!instance) {
          failures.push({
            nodeName: usage.nodeName,
            sourceName: source.name,
            reason: "instance no longer exists or is not an INSTANCE"
          });
          continue;
        }
        try {
          await swapOne(instance, rule, mapping.targetKey);
          swapped++;
        } catch (error) {
          const message = String((_a = error.message) != null ? _a : error);
          if (message.startsWith("swapped but content props failed:") || message.startsWith("swapped but variants drifted:")) {
            swapped++;
          }
          failures.push({
            nodeName: usage.nodeName,
            sourceName: source.name,
            reason: message
          });
        }
      }
    }
    return { swapped, failures };
  }
  function proposeComponentSwap(entry) {
    const rule = getComponentSwapRule(entry.key);
    if (!rule) return null;
    const targetKey = resolveCadsComponentKey(rule.cadsName);
    if (!targetKey) return null;
    return {
      sourceId: `component:${entry.key}`,
      targetKey,
      source: "rule",
      confidence: 0.95,
      rationale: `Swap ${rule.dscoName} \u2192 ${rule.cadsName} with prop remap`
    };
  }

  // src/data/dscoColors.ts
  var DSCO_COLOR_REWRITES = {
    "background/accent/orange/light": "background/accent/orange/light",
    "background/accent/orange/primary": "background/accent/orange/primary",
    "background/accent/orange/strong": "background/accent/orange/strong",
    "background/accent/strawberry/light": "background/accent/pink/light",
    "background/accent/strawberry/primary": "background/accent/pink/primary",
    "background/accent/strawberry/strong": "background/accent/pink/strong",
    "background/brand/aqua/extra-light": "background/brand/light",
    "background/brand/aqua/light": "background/brand/light",
    "background/brand/aqua/primary": "background/brand/primary",
    "background/brand/aqua/strong": "background/brand/strong",
    "background/brand/purple/extra-light": "background/brand/light",
    "background/brand/purple/hover": "background/brand/light",
    "background/brand/purple/light": "background/brand/light",
    "background/brand/purple/primary": "background/brand/primary",
    "background/brand/purple/primary-fixed": "background/brand/primary",
    "background/brand/purple/strong": "background/brand/strong",
    "background/brand/teal/extra-light": "background/brand/light",
    "background/brand/teal/light": "background/brand/light",
    "background/brand/teal/primary": "background/brand/primary",
    "background/brand/teal/strong": "background/brand/strong",
    "background/error/extra-light": "background/error/light",
    "background/error/light": "background/error/light",
    "background/error/primary": "background/error/primary",
    "background/error/strong": "background/error/strong",
    "background/info/extra-light": "background/info/light",
    "background/info/light": "background/info/light",
    "background/info/primary": "background/info/primary",
    "background/info/strong": "background/info/strong",
    "background/neutral/black-fixed": "background/neutral/black-fixed",
    "background/neutral/disabled": "background/state/disabled/neutral",
    "background/neutral/lab": "background/neutral/primary",
    "background/neutral/octonary": "background/neutral/octonary",
    "background/neutral/primary": "background/neutral/primary",
    "background/neutral/primary-inverse": "background/neutral/primary-inverse",
    "background/neutral/quaternary": "background/neutral/quaternary",
    "background/neutral/quinary": "background/neutral/quinary",
    "background/neutral/secondary": "background/neutral/secondary",
    "background/neutral/senary": "background/neutral/senary",
    "background/neutral/septenary": "background/neutral/septenary",
    "background/neutral/tertiary": "background/neutral/tertiary",
    "background/neutral/true-base": "background/neutral/true-base",
    "background/neutral/white-fixed": "background/neutral/white-fixed",
    "background/success/extra-light": "background/success/light",
    "background/success/light": "background/success/light",
    "background/success/primary": "background/success/primary",
    "background/success/strong": "background/success/strong",
    "background/warning/extra-light": "background/warning/light",
    "background/warning/light": "background/warning/light",
    "background/warning/primary": "background/warning/primary",
    "background/warning/strong": "background/warning/strong",
    "borders/brand/aqua/light": "border/brand/light",
    "borders/brand/aqua/primary": "border/brand/primary",
    "borders/brand/aqua/strong": "border/brand/strong",
    "borders/brand/purple/light": "border/brand/light",
    "borders/brand/purple/primary": "border/brand/primary",
    "borders/brand/purple/strong": "border/brand/strong",
    "borders/brand/teal/light": "border/brand/light",
    "borders/brand/teal/primary": "border/brand/primary",
    "borders/brand/teal/strong": "border/brand/strong",
    "borders/error/light": "border/error/light",
    "borders/error/primary": "border/error/primary",
    "borders/error/strong": "border/error/strong",
    "borders/info/light": "border/info/light",
    "borders/info/primary": "border/info/primary",
    "borders/info/strong": "border/info/strong",
    "borders/neutral/disabled": "border/state/disabled/neutral",
    "borders/neutral/light": "border/neutral/primary",
    "borders/neutral/primary": "border/neutral/primary",
    "borders/neutral/solid": "border/neutral/solid",
    "borders/neutral/strong": "border/neutral/secondary",
    "borders/success/light": "border/success/light",
    "borders/success/primary": "border/success/primary",
    "borders/success/strong": "border/success/strong",
    "borders/warning/light": "border/warning/light",
    "borders/warning/primary": "border/warning/primary",
    "borders/warning/strong": "border/warning/strong",
    "text/brand/aqua/primary": "text/brand/primary",
    "text/brand/aqua/primary-fixed": "text/brand/primary-fixed",
    "text/brand/aqua/secondary": "text/brand/secondary",
    "text/brand/purple/primary": "text/brand/primary",
    "text/brand/purple/primary-fixed": "text/brand/primary-fixed",
    "text/brand/purple/secondary": "text/brand/secondary",
    "text/brand/teal/primary": "text/brand/primary",
    "text/brand/teal/primary-fixed": "text/brand/primary-fixed",
    "text/brand/teal/secondary": "text/brand/secondary",
    "text/error/primary": "text/error/primary",
    "text/error/primary-fixed": "text/error/primary-fixed",
    "text/error/secondary": "text/error/secondary",
    "text/info/primary": "text/info/primary",
    "text/info/primary-fixed": "text/info/primary-fixed",
    "text/info/secondary": "text/info/secondary",
    "text/neutral/black-fixed": "text/neutral/black-fixed",
    "text/neutral/disabled": "text/state/disabled/neutral",
    "text/neutral/disabled-inverse": "text/state/disabled/neutral-inverse",
    "text/neutral/inverse": "text/neutral/primary-inverse",
    "text/neutral/placeholder": "text/neutral/placeholder",
    "text/neutral/primary": "text/neutral/primary",
    "text/neutral/quaternary": "text/neutral/quaternary",
    "text/neutral/secondary": "text/neutral/secondary",
    "text/neutral/tertiary": "text/neutral/tertiary",
    "text/neutral/white-fixed": "text/neutral/white-fixed",
    "text/success/primary": "text/success/primary",
    "text/success/primary-fixed": "text/success/primary-fixed",
    "text/success/secondary": "text/success/secondary",
    "text/warning/primary": "text/warning/primary",
    "text/warning/primary-fixed": "text/warning/primary-fixed",
    "text/warning/secondary": "text/warning/secondary"
  };
  var REWRITE_BY_CSS = (() => {
    const map = /* @__PURE__ */ new Map();
    for (const [source, target] of Object.entries(DSCO_COLOR_REWRITES)) {
      map.set(source.replace(/\//g, "-").toLowerCase(), target);
    }
    return map;
  })();
  function dscoToCadsColorName(sourceName) {
    var _a;
    const trimmed = sourceName.trim();
    if (!trimmed) return null;
    if (DSCO_COLOR_REWRITES[trimmed]) return DSCO_COLOR_REWRITES[trimmed];
    const lower = trimmed.toLowerCase();
    if (DSCO_COLOR_REWRITES[lower]) return DSCO_COLOR_REWRITES[lower];
    const css = lower.replace(/^--+/, "").replace(/[_\s]+/g, "-").replace(/\//g, "-");
    return (_a = REWRITE_BY_CSS.get(css)) != null ? _a : null;
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
  function findColorTargetByName(targets, name) {
    const key = normalizedKey(name);
    return targets.find(
      (t) => t.resolvedType === "COLOR" && normalizedKey(t.name) === key
    );
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
    if (entry.resolvedType === "COLOR") {
      if (entry.flag !== "primitive") {
        const ruleName = dscoToCadsColorName(entry.name);
        if (ruleName) {
          const match = findColorTargetByName(ctx.targets, ruleName);
          if (match) {
            return {
              sourceId: entry.id,
              targetKey: match.key,
              source: "rule",
              confidence: 1,
              rationale: `DSCO \u2192 CADS naming rule: ${entry.name} \u2192 ${match.name}`
            };
          }
        }
      }
      return { sourceId: entry.id, targetKey: null, source: "none", confidence: 0 };
    }
    const typeCandidates = ctx.targets.filter(
      (t) => t.resolvedType === entry.resolvedType
    );
    let best = null;
    const sourceKey = normalizedKey(entry.name);
    for (const target of typeCandidates) {
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
  function parseFontSize(values) {
    const raw = values.size;
    if (!raw) return null;
    const n = Number(String(raw).replace(/px$/i, "").trim());
    return Number.isFinite(n) && n > 0 ? n : null;
  }
  function weightRank(weight) {
    const w = (weight != null ? weight : "").toLowerCase().replace(/[\s-_]+/g, "");
    if (!w || /regular|book|normal|roman/.test(w)) return 0;
    if (/medium/.test(w)) return 1;
    if (/semibold|demibold|semi/.test(w)) return 2;
    if (/bold|black|heavy|extrabold|extrast?rong/.test(w)) return 3;
    if (/light|thin|hairline/.test(w)) return 0;
    return 0;
  }
  function isMonoFamily(family) {
    if (!family) return false;
    return /mono|code|consolas|courier|menlo|monaco|jetbrains|fira\s*code|source\s*code|ibm\s*plex\s*mono|roboto\s*mono|space\s*mono|google\s*sans\s*code/i.test(
      family
    );
  }
  function styleFamily(name) {
    var _a;
    const head = (_a = normalizeSegments(name)[0]) != null ? _a : "";
    if (head === "heading") return "heading";
    if (head === "mono") return "mono";
    if (head === "link") return "link";
    if (head === "label") return "label";
    if (head === "overline") return "overline";
    return "body";
  }
  function detectTextRole(values, sourceName) {
    const name = (sourceName != null ? sourceName : "").toLowerCase();
    if (isMonoFamily(values.family) || /\bmono\b/.test(name) || /\bcode\b/.test(name)) {
      return "mono";
    }
    if (values.textDecoration === "UNDERLINE" || /\blink\b/.test(name)) {
      return "link";
    }
    if (values.textCase === "UPPER" || /\boverline\b/.test(name)) {
      return "overline";
    }
    if (/\blabel\b|\bbutton\b|\bcaption\b/.test(name)) {
      return "label";
    }
    if (/\bheading\b|\btitle\b|\bdisplay\b|\bh[1-6]\b/.test(name)) {
      return "heading";
    }
    return "body";
  }
  var ROLE_PRIORITY = {
    body: 0,
    heading: 1,
    mono: 2,
    label: 3,
    link: 4,
    overline: 5
  };
  function closestTextStyle(values, targets, sourceName) {
    const sourceSize = parseFontSize(values);
    if (sourceSize === null || targets.length === 0) return null;
    const sourceWeight = weightRank(values.weight);
    const role = detectTextRole(values, sourceName);
    const candidates = [];
    for (const target of targets) {
      const size = parseFontSize(target.values);
      if (size === null) continue;
      const family = styleFamily(target.name);
      candidates.push({
        target,
        sizeDist: Math.abs(size - sourceSize),
        weightDist: Math.abs(weightRank(target.values.weight) - sourceWeight),
        // Prefer the detected role; otherwise fall back toward Body.
        roleDist: family === role ? 0 : role === "body" && family === "heading" ? 2 : ROLE_PRIORITY[family] + 1,
        size
      });
    }
    if (candidates.length === 0) return null;
    candidates.sort((a, b) => {
      if (a.sizeDist !== b.sizeDist) return a.sizeDist - b.sizeDist;
      if (a.size !== b.size) return b.size - a.size;
      if (a.weightDist !== b.weightDist) return a.weightDist - b.weightDist;
      if (a.roleDist !== b.roleDist) return a.roleDist - b.roleDist;
      return a.target.name.localeCompare(b.target.name);
    });
    const best = candidates[0];
    return {
      target: best.target,
      sizeDist: best.sizeDist,
      weightDist: best.weightDist
    };
  }
  function closestMatchProposal(sourceId, values, ctx, sourceName) {
    var _a;
    const match = closestTextStyle(values, ctx.targets, sourceName);
    if (!match) return null;
    const { target, sizeDist, weightDist } = match;
    const confidence = sizeDist === 0 ? weightDist === 0 ? 0.95 : 0.88 : Math.max(0.6, 0.9 - sizeDist * 0.04 - weightDist * 0.03);
    const sizeLabel = (_a = values.size) != null ? _a : "?";
    return {
      sourceId,
      targetKey: target.key,
      source: "value",
      confidence: Math.round(confidence * 100) / 100,
      rationale: sizeDist === 0 && weightDist === 0 ? `Exact size/weight match \u2192 ${target.name}` : `${sizeLabel}px \u2192 closest CADS style ${target.name}`
    };
  }
  function dscoToCadsTextStyleName(sourceName) {
    var _a;
    const parts = sourceName.split("/").map((part) => part.trim()).filter(Boolean);
    if (parts.length !== 2) return null;
    const [groupRaw, leafRaw] = parts;
    const group = groupRaw.toLowerCase();
    const leaf = leafRaw.trim();
    const heading = /^h([1-6])$/i.exec(leaf);
    if (group === "heading" && heading) {
      return `Heading/H${heading[1]}/Semi Bold`;
    }
    const body = /^body\s*(\d+)(?:\s*[-–—]?\s*(strong|extrastrong))?$/i.exec(leaf);
    if (group === "body" && body) {
      const n = body[1];
      const weight = ((_a = body[2]) != null ? _a : "").toLowerCase();
      const cadsWeight = weight === "extrastrong" ? "Bold" : weight === "strong" ? "Semi Bold" : "Regular";
      return `Body/Body ${n}/${cadsWeight}`;
    }
    const link = /^link\s*body\s*(\d+)$/i.exec(leaf);
    if (group === "link" && link) {
      return `Link/Link ${link[1]}`;
    }
    const mono = /^body\s*(\d+)(?:\s*[-–—]?\s*(strong))?$/i.exec(leaf);
    if (group === "mono" && mono) {
      const n = mono[1];
      const cadsWeight = mono[2] ? "Semi Bold" : "Regular";
      return `Mono/Mono ${n}/${cadsWeight}`;
    }
    const label = /^label\s*(\d+)$/i.exec(leaf);
    if (group === "label" && label) {
      return `Label/Label ${label[1]}`;
    }
    const overline = /^overline\s*(\d+)$/i.exec(leaf);
    if (group === "overline" && overline) {
      return `Overline/Overline ${overline[1]}`;
    }
    const button = /^button\s*(\d+)$/i.exec(leaf);
    if (group === "button" && button) {
      return `Body/Body ${button[1]}/Semi Bold`;
    }
    if (group === "caption" && /^caption\s*1$/i.test(leaf)) {
      return "Label/Label 2";
    }
    return null;
  }
  function findTextStyleByName(targets, name) {
    const key = normalizeSegments(name).join("/");
    return targets.find((target) => normalizeSegments(target.name).join("/") === key);
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
    const ruleName = dscoToCadsTextStyleName(entry.name);
    if (ruleName) {
      const match = findTextStyleByName(ctx.targets, ruleName);
      if (match) {
        return {
          sourceId: entry.id,
          targetKey: match.key,
          source: "rule",
          confidence: 1,
          rationale: `DSCO \u2192 CADS naming rule: ${entry.name} \u2192 ${match.name}`
        };
      }
    }
    const sourceKey = normalizeSegments(entry.name).join("/");
    const exact = ctx.targets.find(
      (target) => normalizeSegments(target.name).join("/") === sourceKey
    );
    if (exact) {
      return {
        sourceId: entry.id,
        targetKey: exact.key,
        source: "exact-name",
        confidence: 1,
        rationale: "Style names match"
      };
    }
    const closest = closestMatchProposal(
      entry.id,
      entry.values,
      ctx,
      entry.name
    );
    if (closest) return closest;
    let best = null;
    for (const target of ctx.targets) {
      const nScore = nameScore(entry.name, target.name);
      const vScore = fontValueScore(entry.values, target.values);
      let score;
      let kind;
      if (vScore >= nScore) {
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
        rationale: best.kind === "value" ? "Font properties match" : "Similar style name"
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
    const closest = closestMatchProposal(entry.id, entry.values, ctx, entry.label);
    if (closest) return closest;
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
  function parseRadiusPx(raw) {
    if (raw === void 0 || raw === null) return null;
    if (typeof raw === "number") return Number.isFinite(raw) ? raw : null;
    const trimmed = String(raw).trim();
    if (!trimmed) return null;
    const withUnit = /^(-?\d+(?:\.\d+)?)\s*px$/i.exec(trimmed);
    if (withUnit) {
      const n2 = Number(withUnit[1]);
      return Number.isFinite(n2) ? n2 : null;
    }
    const n = Number(trimmed);
    return Number.isFinite(n) ? n : null;
  }
  function radiusSourceValues(entry) {
    var _a;
    if (entry.value !== void 0) {
      const applied = parseRadiusPx(entry.value);
      if (applied !== null) return [applied];
    }
    const fromModes = Object.values((_a = entry.values) != null ? _a : {}).map(parseRadiusPx).filter((n) => n !== null);
    return [...new Set(fromModes)];
  }
  function proposeForRadius(entry, shapeTargets, cache) {
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
    const sourceValues = radiusSourceValues(entry);
    const exactMatch = radiusTargets.find((target) => {
      const targetValues = new Set(
        Object.values(target.values).map(parseRadiusPx).filter((n) => n !== null)
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
    var _a, _b;
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
    const ctx = {
      targets: semanticTargets,
      cache: settings.mappingCache,
      colorThemeAssumption: (_a = lastAudit.colorThemeAssumption) != null ? _a : "light"
    };
    const styleCtx = {
      targets: (_b = styleCatalog == null ? void 0 : styleCatalog.textStyles) != null ? _b : [],
      cache: settings.mappingCache
    };
    const wantColors = category === "all" || category === "colors";
    const wantType = category === "all" || category === "typography";
    const wantShape = category === "all" || category === "shape";
    const wantComponents = category === "all" || category === "components";
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
    if (wantComponents) {
      for (const entry of lastAudit.components) {
        const proposal = proposeComponentSwap(entry);
        if (proposal) proposals.push(proposal);
      }
    }
    post({ type: "proposals", proposals, category });
  }
  async function handleApply(request) {
    var _a, _b, _c, _d;
    if (!catalogResult || !lastAudit) {
      throw new Error("Run the audit first.");
    }
    const tokenMappings = request.mappings.filter(
      (mapping) => !mapping.sourceId.startsWith("component:")
    );
    const componentMappings = request.mappings.filter(
      (mapping) => mapping.sourceId.startsWith("component:")
    );
    const report = await applyMappings(
      __spreadProps(__spreadValues({}, request), { mappings: tokenMappings }),
      lastAudit,
      catalogResult.importedByKey,
      (_a = styleCatalog == null ? void 0 : styleCatalog.importedByKey) != null ? _a : /* @__PURE__ */ new Map()
    );
    if (componentMappings.length > 0) {
      const componentReport = await applyComponentSwaps(
        __spreadProps(__spreadValues({}, request), { mappings: componentMappings }),
        lastAudit
      );
      report.componentsSwapped = componentReport.swapped;
      report.failures.push(...componentReport.failures);
      report.usagesRebound += componentReport.swapped;
    }
    const cacheKeyById = /* @__PURE__ */ new Map();
    for (const entry of lastAudit.entries) {
      cacheKeyById.set(entry.id, entry.variableKey || entry.id);
    }
    for (const entry of lastAudit.textStyles) {
      cacheKeyById.set(entry.id, entry.styleKey || entry.id);
    }
    for (const mapping of tokenMappings) {
      const cacheKey = (_b = cacheKeyById.get(mapping.sourceId)) != null ? _b : mapping.sourceId;
      settings.mappingCache[cacheKey] = mapping.targetKey;
    }
    await saveSettings();
    post({ type: "apply-done", report });
    const parts = [];
    if (report.componentsSwapped > 0) {
      parts.push(
        `Swapped ${report.componentsSwapped} component${report.componentsSwapped === 1 ? "" : "s"}`
      );
    }
    if (report.usagesRebound > report.componentsSwapped) {
      parts.push(
        `Fixed ${report.usagesRebound - report.componentsSwapped} token usage${report.usagesRebound - report.componentsSwapped === 1 ? "" : "s"}`
      );
    }
    if (parts.length === 0) {
      parts.push("Fixed 0 usages");
    }
    if (report.failures.length > 0) {
      const first = report.failures[0];
      const detail = first ? `${first.sourceName}: ${first.reason}` : `${report.failures.length} issue(s)`;
      parts.push(
        report.failures.length === 1 ? detail : `${report.failures.length} issues \u2014 ${detail}`
      );
    }
    const includeMixedText = request.category === "all" || request.category === "colors";
    const includeMixedStyle = request.category === "all" || request.category === "typography";
    const mixedSkipped = (includeMixedText ? (_c = lastAudit.mixedTextSkipped) != null ? _c : 0 : 0) + (includeMixedStyle ? (_d = lastAudit.mixedStyleSkipped) != null ? _d : 0 : 0);
    if (mixedSkipped > 0) {
      parts.push(`${mixedSkipped} mixed text layer(s) skipped`);
    }
    figma.notify(parts.join(" \u2014 "));
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
