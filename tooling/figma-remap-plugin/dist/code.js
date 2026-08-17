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
  var DEFAULT_AI_MODELS = {
    anthropic: "claude-sonnet-4-5",
    openai: "gpt-5-mini"
  };
  var EMPTY_SETTINGS = {
    libraryName: null,
    ai: null,
    mappingCache: {},
    capturedStyles: null
  };

  // src/shared/surfaces.ts
  var SURFACE_SUFFIX = /^(.*)::(text|background|border)$/;
  function colorSurfaceOfUsage(usage) {
    if (usage.prop.kind === "paint") {
      if (usage.prop.property === "strokes") return "border";
      if (usage.nodeType === "TEXT") return "text";
      return "background";
    }
    return "background";
  }
  function inferColorSurface(usages) {
    let background = 0;
    let text = 0;
    let border = 0;
    for (const usage of usages) {
      const surface = colorSurfaceOfUsage(usage);
      if (surface === "border") border++;
      else if (surface === "text") text++;
      else background++;
    }
    if (text >= background && text >= border && text > 0) return "text";
    if (border >= background && border >= text && border > 0) return "border";
    return "background";
  }
  function splitUsageIndexesBySurface(usages) {
    var _a;
    const map = /* @__PURE__ */ new Map();
    for (let index = 0; index < usages.length; index++) {
      const surface = colorSurfaceOfUsage(usages[index]);
      const list = (_a = map.get(surface)) != null ? _a : [];
      list.push(index);
      map.set(surface, list);
    }
    return map;
  }
  function composeSurfaceSourceId(baseId, surface) {
    return `${baseId}::${surface}`;
  }
  function parseSurfaceSourceId(sourceId) {
    const match = sourceId.match(SURFACE_SUFFIX);
    if (!match) return { baseId: sourceId, surface: null };
    return { baseId: match[1], surface: match[2] };
  }
  function surfaceFromTokenName(name) {
    const n = name.trim().toLowerCase();
    if (n.startsWith("text/")) return "text";
    if (n.startsWith("border/")) return "border";
    if (n.startsWith("background/")) return "background";
    return null;
  }

  // src/shared/teamAi.ts
  function readDefine(value) {
    return typeof value === "string" ? value.trim() : "";
  }
  function getTeamAiSettings() {
    const apiKey = readDefine(
      true ? "" : ""
    );
    if (!apiKey) return null;
    const providerRaw = readDefine(
      true ? "openai" : "anthropic"
    ).toLowerCase();
    const provider = providerRaw === "openai" ? "openai" : "anthropic";
    const model = readDefine(
      true ? "" : ""
    ) || DEFAULT_AI_MODELS[provider];
    return { provider, model, apiKey };
  }

  // src/data/cadsCatalog.ts
  var PRIMITIVE_COLOR_COLLECTIONS = ["Primitive Colors"];
  var PRIMITIVE_COLLECTION_PATTERN = /primitive/i;
  var SPECIAL_ALPHA_COLLECTIONS = ["Z: Special Alpha"];
  var SPECIAL_ALPHA_COLLECTION_PATTERN = /special\s*alpha/i;
  var TYPOGRAPHY_COLLECTIONS = ["Typography"];
  var TYPOGRAPHY_COLLECTION_PATTERN = /typograph|font/i;
  var SHAPE_COLLECTIONS = ["Spacing & Shape"];
  var SHAPE_COLLECTION_PATTERN = /shape|radius/i;
  function isPrimitiveColorCollection(name) {
    return PRIMITIVE_COLOR_COLLECTIONS.includes(name) || PRIMITIVE_COLLECTION_PATTERN.test(name);
  }
  function isSpecialAlphaCollection(name) {
    return SPECIAL_ALPHA_COLLECTIONS.includes(name) || SPECIAL_ALPHA_COLLECTION_PATTERN.test(name);
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
    { name: "Breadcrumb Overflow", key: "0c72bc56f292a8ce053884db725c62f836ba7ea5" },
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
    // Published chrome nav (replaces stale Lab Nav catalog target)
    { name: "Studio Global Nav", key: "87b0de9d9552690c5a2e3ffa7254cf48584f8537" },
    { name: "lesson metadata", key: "7d8941155e574f6974d13ca665a3287b0e82d57f" },
    { name: "Footer", key: "b3c9f21d2b5b988b32fd9494695ce40e48b21b1e" },
    { name: "Footer", key: "e02ff15b18fec8ac1ddbb7517bb04235675d0879" },
    // Shell / layout — keys refreshed 2026-08-05 after DSCO → CADS cut/paste
    { name: "Sidebar V2", key: "7f574489e4ac7b9b7ad75668c69acbdf46e32b67" },
    { name: "Sidebar Tab Item V2", key: "47b4f1b285cd77d5dcdc3395f2fd926959947356" },
    { name: "Sidebar Control", key: "e0b7ec1aa4a942e8dcd6476a7d246090e9862796" },
    { name: "Sidebar Tab Group V2", key: "ffa62449ad79ffa1f333d7da9969587df378cf6d" },
    { name: "File Manager V2", key: "bbd20817dad550e09561f89f01952b51d49b551f" },
    { name: "File Item", key: "10117e91041fa1bd328c5f23ca3b15336c1b9e06" },
    { name: "File Item Icons", key: "b82914c73a737d8e36b94886cfe99a962c5e4b43" },
    { name: "File Tab Row Item", key: "1b39cf6c28c499b483267d06c86896924b08123d" },
    { name: "Panel Header V2", key: "67e620bd29f2c6a44ddc694cf12dbb73b27aad38" },
    { name: "Panel Header Building Block", key: "d61d75975c911e76662127b0cd0f331047445f17" },
    { name: "AI Chat Input", key: "21631db16f6743b826a673366f733746b019284f" },
    { name: "AI Chat Message", key: "2e5573fb8a81ad428869ea8b04621747b1787a64" },
    { name: "AI Chat File Chip", key: "5bfa5b80e991b7413e03faa32def297190dd2efc" },
    { name: "Chat File Remove Button", key: "964982bddf995c79023e3baad45b8a15e3f83716" },
    { name: "Font Awesome Icon v7", key: "a12ee7f3f8351e10c18d87a72faa3029fbe11622" },
    { name: "Font Awesome Duotone Icon v7", key: "602c2b566f07ec87710b9ba8a9609dab2e87d53e" },
    { name: "resourceItem", key: "49ac972ae6bd99f2b8cee0fbf7227b7619b123a5" },
    { name: "Size", key: "a7839503584b5ff2a946861a85e26fe080b5393c" },
    { name: "Bracket Guide", key: "e7f6bc9973fb3094855d4b6f4aba50526c8d0265" },
    { name: "Header", key: "67c596ff289a71901524fd7186a6f0ddafc34b80" }
  ];
  var cadsComponentKeyAliases = [
    // Sidebar / panel / file (2026-08-04 keys, superseded by cut/paste)
    "a2f4af3436221940c13404ae7201bf3151cb40e7",
    // Sidebar V2
    "f0272599a858b7b4f5c0e3f5155fe696324e4416",
    // Sidebar Tab Item V2
    "a7251af1ab08bcc859eec25ce5ccaad43efa83db",
    // Sidebar Control
    "2522edcc270a34403f65cccfe596464f5086b13f",
    // Sidebar Tab Group V2
    "abb54f5f763ce07b0013c77610be9284aa76c7cb",
    // File Manager V2
    "fab16010bc26130ca9812bd19e67c33ff02306cc",
    // File Item
    "031b78440362d1725ee2541876e770b3fe74ef3a",
    // File Item Icons
    "9ef24ef709b07a90e4519db55ecfb53c2e04a7ba",
    // File Tab Row Item
    "fed5f8b995c5b598a033c5068316f3a1857793ad",
    // Panel Header V2
    "3deb83c08dbb6ec9731beacb41afc7bb02e541b0",
    // Panel Header Building Block
    "ad8f55903b9e05ebb90bf62be928a8a3c8b79b5d",
    // Resize Handle (removed from file)
    // Lab Nav local set (🔴 Lab Global Nav) — successor is Studio Global Nav
    "d55c0edf1cdf9da3fbf0ed7874cd8b0412dc5dc0",
    // Lab Nav
    // AI (2026-08-04 keys)
    "6b24728a35b36a560fa1a078f47416e7bb0481e9",
    // AI Tutor Chat Input
    "5df8b5202273c79891767beb6ba7bd6c55e1b4b0",
    // AI Chat Messages
    "6115fa90ad8516c35630a89a3dfb31c724d5c2d9",
    // AI Chat File Chip
    "2d79bdb562eb8dfd06541936a1e172fc45744a51",
    // AI Chat File Chip (dup)
    "c3750d3440beb1d5a90a7ac8d38070f43b446a61",
    // AI Shortcut Chip
    "dc266a0e284b4ce45df247eb561d49a8dc34011d",
    // AI Support Indicator (removed)
    "2acbc590b735b611c8ba6e6c8a86adb8d3ac9275",
    // AI File Chip Close Button
    "fe3226e7d739fa31c14ef3ae414ac909c049a77b",
    // AI Chat File Item (removed)
    "cf5fe5c10ba6e9963eb4415d3527518d282e58fe"
    // Breadcrumb Overflow (pre-2026-08-17 republish)
  ];
  var cadsComponentKeys = /* @__PURE__ */ new Set([
    ...cadsComponents.map((c) => c.key),
    ...cadsComponentKeyAliases
  ]);
  var cadsComponentNames = new Set(
    cadsComponents.map((c) => c.name.trim().toLocaleLowerCase())
  );
  function isKnownCadsComponentName(name) {
    return cadsComponentNames.has(name.trim().toLocaleLowerCase());
  }

  // src/data/dscoComponents.ts
  var DSCO_COMPONENTS_FILE_KEY = "ahYTsb3I7rsJNW0n2vnXm6";
  var dscoComponents = [
    // Actions
    { key: "cbc707599ceb83eaa1cee51d698831793e0ebde6", name: "Button", cadsName: "Button" },
    {
      key: "0478bc835a0e7e1593fc0e6f3044f54730b66861",
      name: "Destructive Button",
      cadsName: "Button"
    },
    {
      key: "385632d619eb1dffc825a323a3f596b2011f8bb7",
      name: "Close Icon Button",
      cadsName: "Close Icon Button"
    },
    {
      key: "148a82188be79992d7015f52492071c21a21f705",
      name: "Segmented Button Group",
      cadsName: "Segmented Button Group"
    },
    {
      key: "25783a815c161998fb765a4242de17ddfcef2e81",
      name: "Segmented Button Block",
      cadsName: "Segmented Button Block"
    },
    {
      key: "1ba27ea5b212558f4281b0278785db09d2b65262",
      name: "Icon Toggle Button",
      cadsName: "Icon Toggle"
    },
    {
      key: "c134c8ce1f97a8067852366746163bf5a49cfa07",
      name: "Icon Toggle Group",
      cadsName: "Icon Toggle + Label"
    },
    // Forms
    {
      key: "57fb424c2504d5c1f7c18f185a1c36e8bf872508",
      name: "Text Field",
      cadsName: "Text Input"
    },
    {
      key: "84db09de35208651719ba49035c8eb3e2383fc68",
      name: "Text Area",
      cadsName: "Text Input"
    },
    {
      key: "80f93b64131f10c8f805fd5ce3bd3833436bd24a",
      name: "Dropdown Field",
      cadsName: "Dropdown"
    },
    {
      key: "12a72e8b7d28b78b26d6d85e0884146524eb3001",
      name: "Input Dropdown",
      // Nested trigger in DSCO Dropdown Field → CADS Dropdown Button.
      cadsName: "Dropdown Button"
    },
    {
      key: "ab47ef51db67847667cab7b99707f8e777d64551",
      name: "Action Dropdown",
      cadsName: "Dropdown"
    },
    {
      key: "b976343862b4c66015dec46d68395f42739ea9a5",
      name: "Dropdown Menu Button",
      cadsName: "Dropdown Button"
    },
    {
      key: "e2274d238ee69542f85d9e9476e11e88c0bde612",
      name: "Dropdown Menu List",
      cadsName: "Dropdown Menu List"
    },
    {
      key: "0cdd5bf757831059deb7ae24d9b7cf39f86f21d2",
      name: "Dropdown Menu Items",
      cadsName: "Dropdown Menu Item"
    },
    {
      key: "d1962e3d41cdec427b9b37396990ce826fe5a377",
      name: "Checkbox",
      cadsName: "Checkbox + Label"
    },
    {
      key: "bc82043dae67f96dfbbe8f1e20d02ea7ebe1d458",
      name: "Checkbox Blocks",
      cadsName: "Checkbox"
    },
    {
      key: "2d0d2e869049a5a77b70dcf6813aa48737c1a911",
      name: "Radio Button",
      cadsName: "Radio Button + Label"
    },
    {
      key: "dc3161c47faf5241fa98a42e7c5ada717119f365",
      name: "Radio Buttons Blocks",
      cadsName: "Radio Buttons Block"
    },
    {
      key: "cb3807d24d76a019695d82bf799811edf15ff5f6",
      name: "Toggle",
      cadsName: "Toggle + Label"
    },
    {
      key: "125d017876c50813f0359990eaaf45d1982ef739",
      name: "Toggle Building Block",
      cadsName: "Toggle"
    },
    {
      key: "2c50539a1e47e54eb7ab1474e6eeb085cca393c0",
      name: "Slider",
      cadsName: "Slider"
    },
    {
      key: "e425e8b498f0675603eaca40dcf39343fedcb62e",
      name: "Slider Bar",
      cadsName: "Slider Bar"
    },
    {
      key: "64b2b6fca4e117da33d3d88304783c529687df7e",
      name: "Slider Stepper",
      cadsName: "Slider Stepper"
    },
    // Selection / chips
    { key: "341373d642bfd3c0e0cbb35c1130b146945a2321", name: "Chip", cadsName: "Chip" },
    {
      key: "7aa7d44bba4b5dc76d69cc1d81c167cc03608832",
      name: "Chip Group",
      cadsName: "Chip Group"
    },
    { key: "8314a929103d75e027acd08445eb326299d24b74", name: "Link", cadsName: "Link" },
    { key: "6da8599310350b4a87b2a2f8e08d34ae3376a1d1", name: "Tag", cadsName: "Tag" },
    // Navigation
    {
      key: "1d12e71986a41db4dcc4e567b6923d7ed043abdd",
      name: "Breadcrumbs",
      cadsName: "Breadcrumbs"
    },
    {
      key: "1f49b8bd60a1d0351739d42dff1644522002ea00",
      name: "Breadcrumb Link",
      cadsName: "Breadcrumb Links"
    },
    {
      key: "d8b09d58c31343f8ad588e1edda6e650de6c423f",
      name: "Breadcrumbs Blocks",
      cadsName: "Breadcrumb Separators"
    },
    { key: "3046d24d897ea7a8fef82b9df239e2d2b7b45f7c", name: "Tab", cadsName: "Tab Item" },
    {
      key: "046a167c72e8ce57d1fb39e003531928d0309feb",
      name: "Tab Group",
      cadsName: "Tab Group"
    },
    {
      key: "a66d7f369b0b0440f0b73ba48f1dd56548d5aec1",
      name: "Pagination Dots",
      // No DSCO→CADS Pagination migration (CADS Pagination is net-new).
      cadsName: null
    },
    {
      key: "b610aa8d09ccc8931662c7fba5cb0f734a3807f0",
      name: "Pagination Group",
      cadsName: null
    },
    // Feedback / overlays
    { key: "3133f83a3f98b68c1f3081132b2e90bb5d1dc59a", name: "Alert", cadsName: "Alert" },
    { key: "949e2949033f60df26231b2f73985b488f9f78fe", name: "Toast", cadsName: "Toast" },
    {
      key: "64993adac217e2c6daab4eb131f94531d02e65a9",
      name: "Notification Banner",
      cadsName: "Notification Banner"
    },
    {
      key: "d9e848e2167cade785a34c19aff53552645fa03d",
      name: "Tooltip",
      cadsName: "Tooltip"
    },
    {
      key: "a1831764f91754253ef7a8e9581f7c3fbdc5227a",
      name: "Tooltip Icon",
      // DSCO building block nested in Tooltip only — not CADS Icon Tooltip.
      cadsName: null
    },
    {
      key: "b26928dc5394b83a3f950653339218583b9cfccc",
      name: "Tooltip Tails",
      cadsName: null
    },
    {
      key: "354d944bb976f7104bbcd34cf8a733aff3124964",
      name: "Popover",
      cadsName: "Popover"
    },
    {
      key: "a635748a7e91721d93fde00682cac982b8cc1742",
      name: "Popover Building Blocks",
      // Nested caret helper only — never standalone; Core remapped via parent Popover.
      cadsName: null
    },
    {
      key: "402577f53a413426e8fbdb59d73a7750b64ddd79",
      name: "Drawer",
      cadsName: "Drawer"
    },
    {
      key: "6fd36a39efde8f927febe94b2d20a77cca842844",
      name: "Dialog",
      cadsName: "Dialog"
    },
    { key: "5978e70b44d30d937b300a136fd1e5c46a8a70c1", name: "Modal", cadsName: "Modal" },
    {
      key: "e6e3c0cfea5a588c0e936ab7dca00b3919c28a07",
      name: "Content Divider",
      cadsName: "Content Divider"
    },
    // Media
    { key: "8c94db45d91aaa619d204ea00fc8c72986182cfc", name: "Video", cadsName: "Video" },
    {
      key: "fa1a30885e3ac8a208c390bb1d0c79b2fef659d0",
      name: "Play Button",
      cadsName: "Play Button"
    },
    {
      key: "645a7bf0fba836e19dcdc0afbfd1f74bc0d85cf5",
      name: "Carousel",
      cadsName: "Carousel"
    },
    {
      key: "9e43cc3f8b484812e1265cf6bcaa3e4176965cdf",
      name: "Carousal Nav Buttons",
      cadsName: "Carousal Nav Buttons"
    },
    {
      key: "2606e5170df63663236d53010e2260932e3b9445",
      name: "Action Block",
      cadsName: "Action Block"
    },
    {
      key: "868d8d3e54e28e95ae284876db38d7271651be4f",
      name: "Action Block Group",
      cadsName: "Action Block Group"
    },
    {
      key: "f8f95d95f31825a834ca1a08ee78a10bbdfabee4",
      name: "Action Block Carousel",
      cadsName: "Action Block Carousel"
    },
    // Shell / layout
    {
      key: "284b25f1184ef019c06cc629e4fdaa38e75249f1",
      name: "Lab Nav",
      cadsName: "Studio Global Nav"
    },
    {
      key: "21391676db29a79461cdf45ec70bba6641772d5b",
      name: "Sidebar V2",
      cadsName: "Sidebar V2"
    },
    {
      key: "14b1e0b45ce2bf6a0dd67668e9960490605e62b9",
      name: "Sidebar Tab Item V2",
      cadsName: "Sidebar Tab Item V2"
    },
    {
      key: "36742e65b461a7717434e4d0589ecfb3158bd56c",
      name: "Sidebar Tab Group V2",
      cadsName: "Sidebar Tab Group V2"
    },
    {
      key: "f668e066487a10529ee420c65d14ea5ad4bd5eee",
      name: "Sidebar Control",
      cadsName: "Sidebar Control"
    },
    {
      key: "b15d0603786020456041d9dfc6ce5fbc1ea8a795",
      name: "File Manager V2",
      cadsName: "File Manager V2"
    },
    {
      key: "f228313a492b61b8a0809cee51776cdffe280dbe",
      name: "File Item",
      cadsName: "File Item"
    },
    {
      key: "bb9040fe00af46f8f26380c8bd789587209f92f5",
      name: "File Item Icons",
      cadsName: "File Item Icons"
    },
    {
      key: "6080fcf2f90e8cac1b083dc62ea7cb7a1cb747db",
      name: "File Tab Row Item",
      cadsName: "File Tab Row Item"
    },
    {
      key: "965f87360ad7d05dc3f3589361e40bb7cd11b5de",
      name: "Panel Header V2",
      cadsName: "Panel Header V2"
    },
    {
      key: "182556a60cdf5211857d30c94e575e35aa13aef7",
      name: "Panel Header Building Block",
      cadsName: "Panel Header Building Block"
    },
    {
      key: "cab3283affeb303907a9a172225e382b759f68dd",
      name: "Resize Handle",
      cadsName: null
    },
    { key: "908f98448d94d05c5a172f575d47cf2398a2299f", name: "Logo", cadsName: null },
    // AI
    {
      key: "7dd35ac4dfa58413fcd9520dc8bf091b1cd617bf",
      name: "AI Tutor Chat Input",
      cadsName: "AI Tutor Chat Input"
    },
    {
      key: "1968b2a676cdb5194012c76a0290bd1e72410cb1",
      name: "AI Chat Messages",
      cadsName: "AI Chat Messages"
    },
    {
      key: "657aa0a29f7ad03f01ae4a21119471ca28714a8a",
      name: "AI Chat File Chip",
      cadsName: "AI Chat File Chip"
    },
    {
      key: "642b5ebddbdd848f3f0174950db780003a344040",
      name: "AI Chat File Chip",
      cadsName: "AI Chat File Chip"
    },
    {
      key: "fc8d56dba42d05aee6a8c1baf7f7ceab48caaaf9",
      name: "AI Shortcut Chip",
      cadsName: "AI Shortcut Chip"
    },
    {
      key: "4bd2e86e9492638295155f36675a8549e23f2547",
      name: "AI Support Indicator",
      cadsName: null
    },
    {
      key: "fa8a60054807a87521a0207d968f29b4acb6db89",
      name: "AI File Chip Close Button",
      cadsName: "AI File Chip Close Button"
    },
    {
      key: "5cc57671aeafa2f61aec50f6a630297347b3a26f",
      name: "AI Chat File Item",
      cadsName: null
    },
    { key: "b8baba99082dcb77c42cb4f599869b9471a5aab7", name: "AI Bot", cadsName: null },
    // Icons
    {
      key: "051a05d840dcf0a8220c056833c040fc581dff41",
      name: "Font Awesome Icon",
      cadsName: "Font Awesome Icon v7"
    },
    {
      key: "2073beaaf6394b66220e04a5588a35e08d66daf2",
      name: "Font Awesome Duotone Icon",
      cadsName: "Font Awesome Duotone Icon v7"
    }
  ];
  var dscoComponentKeys = new Set(dscoComponents.map((c) => c.key));
  var cadsNameByNormalized = new Map(
    cadsComponents.map((component) => [
      component.name.trim().toLocaleLowerCase(),
      component.name
    ])
  );
  var cadsByDscoKey = new Map(
    dscoComponents.filter((entry) => entry.cadsName).map((entry) => [entry.key, entry.cadsName])
  );
  var DSCO_NAME_REWRITES = {
    "destructive button": "Button",
    "icon toggle button": "Icon Toggle",
    "icon toggle group": "Icon Toggle + Label",
    "text field": "Text Input",
    "text area": "Text Input",
    "dropdown field": "Dropdown",
    "input dropdown": "Dropdown Button",
    "action dropdown": "Dropdown",
    "dropdown menu button": "Dropdown Button",
    "dropdown menu items": "Dropdown Menu Item",
    checkbox: "Checkbox + Label",
    "checkbox blocks": "Checkbox",
    "checkbox blocks ": "Checkbox",
    "radio button": "Radio Button + Label",
    "radio buttons blocks": "Radio Buttons Block",
    toggle: "Toggle + Label",
    "toggle building block": "Toggle",
    tab: "Tab Item",
    "breadcrumb link": "Breadcrumb Links",
    "breadcrumbs blocks": "Breadcrumb Separators",
    "lab nav": "Studio Global Nav",
    "studio global nav": "Studio Global Nav",
    "font awesome icon": "Font Awesome Icon v7",
    "font awesome duotone icon": "Font Awesome Duotone Icon v7"
  };
  function normalizeName(name) {
    return name.trim().toLocaleLowerCase();
  }
  function suggestCadsComponent(source) {
    var _a;
    if (source.key) {
      const byKey = cadsByDscoKey.get(source.key);
      if (byKey) return byKey;
      if (dscoComponentKeys.has(source.key)) return null;
    }
    const normalized = normalizeName(source.name);
    const rewrite = DSCO_NAME_REWRITES[normalized];
    if (rewrite) return rewrite;
    return (_a = cadsNameByNormalized.get(normalized)) != null ? _a : null;
  }

  // src/shared/fontAwesome.ts
  var FA_FAMILY_TARGET_PREFIX = "fontfamily:";
  function isFontAwesomeFamily(family) {
    return /^font awesome\b/i.test(family.trim());
  }
  function isFontAwesomeKitFamily(family) {
    return isFontAwesomeFamily(family) && /\bkit\b/i.test(family);
  }
  function isFontAwesome7Family(family) {
    return /^font awesome\s+7\b/i.test(family.trim());
  }
  function isFontAwesomeCurrentFamily(family) {
    return isFontAwesome7Family(family) || isFontAwesomeKitFamily(family);
  }
  function toFontAwesome7Family(family) {
    const trimmed = family.trim();
    if (!isFontAwesomeFamily(trimmed) || isFontAwesomeCurrentFamily(trimmed)) {
      return null;
    }
    const withVersion = trimmed.match(/^font awesome\s+\d+\s+(.+)$/i);
    if (withVersion) {
      return `Font Awesome 7 ${withVersion[1].trim()}`;
    }
    const withoutVersion = trimmed.match(/^font awesome\s+(.+)$/i);
    if (withoutVersion) {
      const rest = withoutVersion[1].trim();
      if (/^\d+\b/.test(rest)) {
        return `Font Awesome 7 ${rest.replace(/^\d+\s+/, "")}`;
      }
      return `Font Awesome 7 ${rest}`;
    }
    return null;
  }
  function faFamilyTargetKey(family) {
    return `${FA_FAMILY_TARGET_PREFIX}${family}`;
  }
  function parseFaFamilyTargetKey(targetKey) {
    if (!targetKey.startsWith(FA_FAMILY_TARGET_PREFIX)) return null;
    const family = targetKey.slice(FA_FAMILY_TARGET_PREFIX.length).trim();
    return family || null;
  }

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
  var CADS_FILE_KEY = "DGekOeToRVifvFAhfqpeC1";
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
  function isCadsComponent(key, name) {
    if (cadsComponentKeys.has(key)) return true;
    if (dscoComponentKeys.has(key)) return false;
    return isKnownCadsComponentName(name);
  }
  function isFigmaComponentOutlineHex(hex) {
    return /^#9747ff([0-9a-f]{2})?$/i.test(hex.trim());
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
    if (isSpecialAlphaCollection(entry.collectionName)) return false;
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
    const silenceLocalComponents = figma.fileKey !== DSCO_COMPONENTS_FILE_KEY;
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
          if (isFontAwesomeCurrentFamily(font2.family)) {
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
        recordCompliance(
          existing.isCads || existing.isLocal && silenceLocalComponents,
          usage.hidden
        );
        if (existing.sampleNodeNames.length < 5 && !existing.sampleNodeNames.includes(node.name)) {
          existing.sampleNodeNames.push(node.name);
        }
        return;
      }
      const entry = {
        key,
        name: owner.name,
        isCads: isCadsComponent(key, owner.name),
        isLocal: !main.remote,
        instanceCount: 1,
        sampleNodeNames: [node.name],
        usages: [usage]
      };
      components.set(key, entry);
      recordCompliance(
        entry.isCads || entry.isLocal && silenceLocalComponents,
        usage.hidden
      );
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
        if (!inInstance || !silenceLocalComponents) await visitInstance(node);
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
    const findingComponents = Array.from(components.values()).filter((c) => !c.isCads && !(c.isLocal && silenceLocalComponents)).sort((a, b) => b.instanceCount - a.instanceCount);
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
  var LOCAL_SOT_LIBRARY_NAME = "This file";
  var CACHE_KEY = "cads-variable-catalog-v1";
  var IMPORT_CONCURRENCY = 24;
  function isCadsSourceFile() {
    return figma.fileKey === CADS_FILE_KEY;
  }
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
  async function buildLocalCatalog(onProgress) {
    var _a, _b;
    const collections = await figma.variables.getLocalVariableCollectionsAsync();
    const locals = await figma.variables.getLocalVariablesAsync();
    if (collections.length === 0) {
      throw new Error(
        "This CADS file has no local variable collections to audit against."
      );
    }
    const collectionById = new Map(
      collections.map((collection) => [collection.id, collection])
    );
    const countByCollectionId = /* @__PURE__ */ new Map();
    const variables = [];
    const importedByKey = /* @__PURE__ */ new Map();
    const total = locals.length;
    let done = 0;
    onProgress(0, Math.max(total, 1));
    await new Promise((resolve) => setTimeout(resolve, 0));
    for (const variable of locals) {
      const collectionId = safeVariableCollectionId(variable);
      const collection = collectionId ? (_a = collectionById.get(collectionId)) != null ? _a : null : null;
      if (!collection) {
        done++;
        continue;
      }
      countByCollectionId.set(
        collection.id,
        ((_b = countByCollectionId.get(collection.id)) != null ? _b : 0) + 1
      );
      importedByKey.set(variable.key, variable);
      variables.push({
        key: variable.key,
        variableId: variable.id,
        name: variable.name,
        resolvedType: variable.resolvedType,
        collectionKey: collection.key,
        collectionName: collection.name,
        values: await resolveDisplayValues(variable, collection)
      });
      done++;
      if (done % IMPORT_CONCURRENCY === 0 || done === total) {
        onProgress(done, total);
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }
    onProgress(total, total);
    return {
      catalog: {
        libraryName: LOCAL_SOT_LIBRARY_NAME,
        collections: collections.map((collection) => {
          var _a2;
          return {
            key: collection.key,
            name: collection.name,
            modes: collection.modes.map((mode) => mode.name),
            variableCount: (_a2 = countByCollectionId.get(collection.id)) != null ? _a2 : 0
          };
        }),
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
  async function applyFontFamily(usage, family) {
    const node = await getNode(usage.nodeId);
    if (!node) throw new Error("node no longer exists");
    if (node.type !== "TEXT") throw new Error("no longer a text node");
    const text = node;
    if (text.fontName === figma.mixed) {
      throw new Error("mixed font on layer \u2014 apply per-character in Figma");
    }
    const style = text.fontName.style;
    try {
      await figma.loadFontAsync({ family, style });
    } catch (e) {
      throw new Error(
        `The font "${family} ${style}" could not be loaded \u2014 install the FA7 desktop font (or use your Kit face; kits are already current)`
      );
    }
    text.fontName = { family, style };
  }
  function isStyleSource(baseSourceId) {
    return baseSourceId.startsWith("style:") || baseSourceId.startsWith("font:");
  }
  function isFontAwesomeSource(baseSourceId) {
    return baseSourceId.startsWith("fontawesome:");
  }
  async function resolveTargetVariable(key, importedByKey) {
    const cached = importedByKey.get(key);
    if (cached) return cached;
    try {
      const imported = await figma.variables.importVariableByKeyAsync(key);
      importedByKey.set(key, imported);
      return imported;
    } catch (e) {
    }
    try {
      const locals = await figma.variables.getLocalVariablesAsync();
      for (const variable of locals) {
        if (variable.key === key) {
          importedByKey.set(key, variable);
          return variable;
        }
      }
    } catch (e) {
    }
    return null;
  }
  async function resolveTargetTextStyle(key, importedStylesByKey) {
    const cached = importedStylesByKey.get(key);
    if (cached) return cached;
    try {
      const imported = await figma.importStyleByKeyAsync(key);
      if (imported.type === "TEXT") {
        importedStylesByKey.set(key, imported);
        return imported;
      }
    } catch (e) {
    }
    try {
      const locals = await figma.getLocalTextStylesAsync();
      for (const style of locals) {
        if (style.key === key) {
          importedStylesByKey.set(key, style);
          return style;
        }
      }
    } catch (e) {
    }
    return null;
  }
  async function applyMappings(request, audit, importedByKey, importedStylesByKey) {
    var _a, _b, _c, _d, _e;
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
    for (const fa of audit.fontAwesomeTexts) {
      sourceById.set(fa.id, { name: fa.label, usages: fa.usages });
    }
    for (const raw of audit.rawRadii) {
      sourceById.set(raw.id, { name: `radius ${raw.label}`, usages: raw.usages });
    }
    for (const mapping of request.mappings) {
      const { baseId } = parseSurfaceSourceId(mapping.sourceId);
      const source = sourceById.get(baseId);
      const faFamily = parseFaFamilyTargetKey(mapping.targetKey);
      const styleTarget = isStyleSource(baseId);
      const faTarget = isFontAwesomeSource(baseId) || Boolean(faFamily);
      let variable = null;
      let style = null;
      if (faTarget) {
      } else if (styleTarget) {
        style = await resolveTargetTextStyle(
          mapping.targetKey,
          importedStylesByKey
        );
      } else {
        variable = await resolveTargetVariable(mapping.targetKey, importedByKey);
      }
      if (!source || (faTarget ? !faFamily : !variable && !style)) {
        failures.push({
          nodeName: "\u2014",
          sourceName: (_a = source == null ? void 0 : source.name) != null ? _a : mapping.sourceId,
          reason: faTarget ? "target Font Awesome 7 family missing" : styleTarget ? "target text style could not be imported" : "target variable could not be imported"
        });
        continue;
      }
      let reboundForSource = 0;
      const usages = mapping.usageIndexes === void 0 ? source.usages : mapping.usageIndexes.map((index) => source.usages[index]).filter((usage) => Boolean(usage));
      for (const usage of usages) {
        try {
          if (faFamily) await applyFontFamily(usage, faFamily);
          else if (style) await applyTextStyle(usage, style);
          else await rebindUsage(usage, variable);
          reboundForSource++;
        } catch (error) {
          failures.push({
            nodeName: usage.nodeName,
            sourceName: source.name,
            reason: usage.inInstance ? `inside a component instance \u2014 fix at the source component (${String(
              (_b = error.message) != null ? _b : error
            )})` : String((_c = error.message) != null ? _c : error)
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
                reason: String((_d = error.message) != null ? _d : error)
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
            reason: String((_e = error.message) != null ? _e : error)
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
    Focused: "focus",
    focused: "focus",
    Pressed: "press",
    pressed: "press",
    Press: "press",
    press: "press",
    Disabled: "disabled",
    disabled: "disabled",
    Visited: "visited",
    visited: "visited",
    Error: "error",
    error: "error",
    "Read Only": "readOnly",
    "Read-only": "readOnly",
    ReadOnly: "readOnly",
    readOnly: "readOnly",
    Activated: "press",
    activated: "press"
  };
  var STATE_CHECKBOX_BLOCK = __spreadProps(__spreadValues({}, STATE_DEFAULT), {
    Focused: "focused",
    focused: "focused",
    Pressed: "pressed",
    pressed: "pressed"
  });
  var YES_NO = {
    Yes: "yes",
    No: "no",
    yes: "yes",
    no: "no",
    true: "yes",
    false: "no"
  };
  var YES_NO_CAP = {
    Yes: "Yes",
    No: "No",
    yes: "Yes",
    no: "No",
    true: "Yes",
    false: "No"
  };
  var THICK_THIN = {
    Thick: "thick",
    Thin: "thin",
    thick: "thick",
    thin: "thin"
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
    Aqua: "brand"
  };
  var FIELD_COLOR = {
    Black: "primary",
    White: "primary",
    Gray: "secondary",
    Grey: "secondary",
    primary: "primary",
    secondary: "secondary"
  };
  var DROPDOWN_BTN_COLOR = {
    Black: "primary",
    White: "secondary",
    Grey: "secondary",
    Gray: "secondary",
    primary: "primary",
    secondary: "secondary"
  };
  var ICON_TOGGLE_COLOR = {
    Gray: "primary",
    Black: "secondary",
    White: "secondary",
    Teal: "brand",
    Negative: "error",
    Affirmative: "success",
    primary: "primary",
    secondary: "secondary",
    brand: "brand",
    error: "error",
    success: "success"
  };
  var POSITION = {
    First: "first",
    Middle: "middle",
    Last: "last",
    first: "first",
    middle: "middle",
    last: "last"
  };
  var SIZE_TABLE = { size: SIZE_LMXS, Size: SIZE_LMXS };
  var STATE_TABLE = { state: STATE_DEFAULT, State: STATE_DEFAULT };
  function sizeStateTables(extra) {
    return __spreadValues(__spreadValues(__spreadValues({}, SIZE_TABLE), STATE_TABLE), extra);
  }
  var componentSwapRules = [
    // ═══ Wave A/B (shipped + fix) ═══
    {
      dscoKey: "cbc707599ceb83eaa1cee51d698831793e0ebde6",
      dscoName: "Button",
      cadsName: "Button",
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
        iconOnly: YES_NO_CAP,
        "Icon Only": YES_NO_CAP
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
        iconOnly: YES_NO_CAP
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
        state: STATE_DEFAULT,
        State: STATE_DEFAULT,
        color: {
          Default: "primary",
          Strong: "secondary",
          "Solid Black": "primary",
          "Solid White": "primary",
          primary: "primary",
          secondary: "secondary"
        },
        Color: {
          Default: "primary",
          Strong: "secondary",
          "Solid Black": "primary",
          "Solid White": "primary"
        }
      }
    },
    {
      dscoKey: "341373d642bfd3c0e0cbb35c1130b146945a2321",
      dscoName: "Chip",
      cadsName: "Chip",
      special: "chipColorSelected",
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
        selected: YES_NO,
        Selected: YES_NO,
        color: {
          Black: "primary",
          Gray: "secondary",
          Selected: "selected (n/a)",
          primary: "primary",
          secondary: "secondary",
          "selected (n/a)": "selected (n/a)"
        },
        Color: {
          Black: "primary",
          Gray: "secondary",
          Selected: "selected (n/a)"
        },
        labelStyle: THICK_THIN,
        Type: THICK_THIN,
        state: STATE_DEFAULT,
        State: STATE_DEFAULT
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
        state: STATE_DEFAULT,
        State: STATE_DEFAULT
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
        sentiment: MEANING_TO_SENTIMENT,
        Meaning: MEANING_TO_SENTIMENT,
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
    {
      dscoKey: "6315f244285e23cac76df5c8e3c807276fdc0da4",
      dscoName: "Font Awesome Icon",
      cadsName: "Font Awesome Icon v7"
    },
    // ═══ Wave C — flat High remaps ═══
    {
      dscoKey: "148a82188be79992d7015f52492071c21a21f705",
      dscoName: "Segmented Button Group",
      cadsName: "Segmented Button Group",
      propNames: {
        Size: "size",
        "Icon Only": "iconOnly",
        IconOnly: "iconOnly"
      },
      variantValues: {
        size: SIZE_LMXS,
        Size: SIZE_LMXS,
        iconOnly: YES_NO,
        "Icon Only": YES_NO
      }
    },
    {
      dscoKey: "25783a815c161998fb765a4242de17ddfcef2e81",
      dscoName: "Segmented Button Block",
      cadsName: "Segmented Button Block",
      special: "segmentedBlockActive",
      propNames: {
        Label: "label",
        "Left Icon": "startIconName",
        "Right Icon": "endIconName",
        "Show Left Icon": "startIcon",
        "Show Right Icon": "endIcon",
        Size: "size",
        Position: "position",
        "Icon Only": "iconOnly",
        IconOnly: "iconOnly",
        State: "state"
      },
      variantValues: {
        size: SIZE_LMXS,
        Size: SIZE_LMXS,
        position: POSITION,
        Position: POSITION,
        iconOnly: YES_NO,
        "Icon Only": YES_NO,
        state: STATE_DEFAULT,
        State: STATE_DEFAULT
      }
    },
    {
      dscoKey: "1ba27ea5b212558f4281b0278785db09d2b65262",
      dscoName: "Icon Toggle Button",
      cadsName: "Icon Toggle",
      special: "iconToggleIsOn",
      propNames: {
        Icon: "iconName",
        Size: "size",
        Color: "color",
        Type: "isOn",
        State: "state"
      },
      variantValues: {
        size: SIZE_LMXS,
        Size: SIZE_LMXS,
        color: ICON_TOGGLE_COLOR,
        Color: ICON_TOGGLE_COLOR,
        isOn: {
          "Off to On": "off",
          "On to Off": "on",
          Off: "off",
          On: "on",
          off: "off",
          on: "on"
        },
        Type: {
          "Off to On": "off",
          "On to Off": "on",
          Off: "off",
          On: "on"
        },
        state: STATE_DEFAULT,
        State: STATE_DEFAULT
      }
    },
    {
      dscoKey: "c134c8ce1f97a8067852366746163bf5a49cfa07",
      dscoName: "Icon Toggle Group",
      cadsName: "Icon Toggle + Label",
      propNames: {
        Label: "labelText",
        "Show Label": "hasLabel",
        "2nd Button": "hasTwoToggles",
        Size: "size"
      },
      variantValues: sizeStateTables()
    },
    {
      dscoKey: "12a72e8b7d28b78b26d6d85e0884146524eb3001",
      dscoName: "Input Dropdown",
      cadsName: "Dropdown Button",
      propNames: {
        Size: "size",
        Color: "color",
        State: "state"
      },
      variantValues: {
        size: SIZE_LMXS,
        Size: SIZE_LMXS,
        color: DROPDOWN_BTN_COLOR,
        Color: DROPDOWN_BTN_COLOR,
        state: STATE_DEFAULT,
        State: STATE_DEFAULT
      }
    },
    {
      dscoKey: "ab47ef51db67847667cab7b99707f8e777d64551",
      dscoName: "Action Dropdown",
      cadsName: "Dropdown",
      special: "actionDropdown",
      forceVariants: { role: "action", menuType: "default" },
      propNames: {
        Size: "size",
        Alignment: "menuPlacement",
        Open: "open"
      },
      variantValues: {
        size: SIZE_LMXS,
        Size: SIZE_LMXS,
        menuPlacement: {
          Left: "bottomLeft",
          Right: "bottomRight",
          bottomLeft: "bottomLeft",
          bottomRight: "bottomRight"
        },
        Alignment: { Left: "bottomLeft", Right: "bottomRight" }
      }
    },
    {
      dscoKey: "b976343862b4c66015dec46d68395f42739ea9a5",
      dscoName: "Dropdown Menu Button",
      cadsName: "Dropdown Button",
      propNames: {
        Label: "label",
        "Icon Name": "iconName",
        "Show Icon": "startIcon",
        Size: "size",
        Thickness: "labelStyle",
        Color: "color",
        State: "state"
      },
      variantValues: {
        size: SIZE_LMXS,
        Size: SIZE_LMXS,
        labelStyle: THICK_THIN,
        Thickness: THICK_THIN,
        color: DROPDOWN_BTN_COLOR,
        Color: DROPDOWN_BTN_COLOR,
        state: STATE_DEFAULT,
        State: STATE_DEFAULT
      }
    },
    {
      dscoKey: "e2274d238ee69542f85d9e9476e11e88c0bde612",
      dscoName: "Dropdown Menu List",
      cadsName: "Dropdown Menu List",
      special: "menuListType",
      propNames: {
        "Show Action Items": "showActionRow",
        Size: "size",
        Type: "menuType"
      },
      variantValues: {
        size: SIZE_LMXS,
        Size: SIZE_LMXS,
        menuType: {
          "Icon List": "default",
          "Checkbox List": "checklist",
          default: "default",
          checklist: "checklist"
        },
        Type: {
          "Icon List": "default",
          "Checkbox List": "checklist"
        }
      }
    },
    {
      dscoKey: "0cdd5bf757831059deb7ae24d9b7cf39f86f21d2",
      dscoName: "Dropdown Menu Items",
      cadsName: "Dropdown Menu Item",
      special: "menuItemType",
      forceContent: { hasStartIcon: true },
      propNames: {
        Icon: "iconName",
        "List Item Text": "label",
        Size: "size",
        Type: "itemType",
        State: "selected"
      },
      variantValues: {
        size: SIZE_LMXS,
        Size: SIZE_LMXS,
        selected: {
          Selected: "yes",
          Unselected: "no",
          Default: "no",
          yes: "yes",
          no: "no"
        },
        State: {
          Selected: "yes",
          Unselected: "no",
          Default: "no"
        }
      }
    },
    {
      dscoKey: "d1962e3d41cdec427b9b37396990ce826fe5a377",
      dscoName: "Checkbox",
      cadsName: "Checkbox + Label",
      retargetWhenFalse: { sourceProp: "Show Text", cadsName: "Checkbox" },
      propNames: {
        Text: "Text",
        Size: "size",
        "Label Weight": "labelStyle"
      },
      variantValues: {
        size: SIZE_LMXS,
        Size: SIZE_LMXS,
        labelStyle: THICK_THIN,
        "Label Weight": THICK_THIN
      },
      nestedApply: [
        {
          matchNames: ["Checkbox"],
          special: "checkboxStatus",
          propNames: { Size: "size", State: "state" },
          variantValues: {
            size: SIZE_LMXS,
            Size: SIZE_LMXS,
            state: STATE_CHECKBOX_BLOCK,
            State: STATE_CHECKBOX_BLOCK
          }
        }
      ]
    },
    {
      dscoKey: "bc82043dae67f96dfbbe8f1e20d02ea7ebe1d458",
      dscoName: "Checkbox Blocks",
      cadsName: "Checkbox",
      special: "checkboxStatus",
      propNames: {
        Size: "size",
        State: "state",
        Selected: "status",
        Indeterminate: "status"
      },
      variantValues: {
        size: SIZE_LMXS,
        Size: SIZE_LMXS,
        state: STATE_CHECKBOX_BLOCK,
        State: STATE_CHECKBOX_BLOCK
      }
    },
    {
      dscoKey: "2d0d2e869049a5a77b70dcf6813aa48737c1a911",
      dscoName: "Radio Button",
      cadsName: "Radio Button + Label",
      retargetWhenFalse: {
        sourceProp: "Show Text",
        cadsName: "Radio Buttons Block"
      },
      propNames: {
        Text: "Text",
        Size: "size",
        "Label Weight": "labelStyle"
      },
      variantValues: {
        size: SIZE_LMXS,
        Size: SIZE_LMXS,
        labelStyle: THICK_THIN,
        "Label Weight": THICK_THIN
      },
      nestedApply: [
        {
          matchNames: ["Radio Buttons Block", "Radio Button"],
          special: "radioSelected",
          propNames: { Size: "size", State: "state", Type: "selected" },
          variantValues: {
            size: SIZE_LMXS,
            Size: SIZE_LMXS,
            state: STATE_DEFAULT,
            State: STATE_DEFAULT,
            selected: {
              Selected: "yes",
              Unselected: "no",
              Yes: "yes",
              No: "no",
              yes: "yes",
              no: "no"
            },
            Type: {
              Selected: "yes",
              Unselected: "no"
            }
          }
        }
      ]
    },
    {
      dscoKey: "dc3161c47faf5241fa98a42e7c5ada717119f365",
      dscoName: "Radio Buttons Blocks",
      cadsName: "Radio Buttons Block",
      propNames: {
        Size: "size",
        Selected: "selected",
        State: "state"
      },
      variantValues: {
        size: SIZE_LMXS,
        Size: SIZE_LMXS,
        selected: YES_NO,
        Selected: YES_NO,
        state: STATE_DEFAULT,
        State: STATE_DEFAULT
      }
    },
    {
      dscoKey: "cb3807d24d76a019695d82bf799811edf15ff5f6",
      dscoName: "Toggle",
      cadsName: "Toggle + Label",
      retargetWhenFalse: { sourceProp: "Show Label", cadsName: "Toggle" },
      propNames: {
        Text: "labelText",
        Size: "size",
        "Label Position": "labelPlacement"
      },
      variantValues: {
        size: SIZE_LMXS,
        Size: SIZE_LMXS,
        labelPlacement: {
          Left: "left",
          Right: "right",
          left: "left",
          right: "right"
        },
        "Label Position": { Left: "left", Right: "right" }
      },
      nestedApply: [
        {
          matchNames: ["Toggle"],
          special: "toggleOn",
          forceContent: {
            hasIcons: true,
            onIcon: "check",
            offIcon: "xmark"
          },
          propNames: { Size: "size", "On/Off": "isOn", Status: "isOn" },
          variantValues: {
            size: SIZE_LMXS,
            Size: SIZE_LMXS,
            isOn: { On: "on", Off: "off", on: "on", off: "off" },
            "On/Off": { On: "on", Off: "off" },
            Status: { On: "on", Off: "off", on: "on", off: "off" }
          }
        }
      ]
    },
    {
      dscoKey: "125d017876c50813f0359990eaaf45d1982ef739",
      dscoName: "Toggle Building Block",
      cadsName: "Toggle",
      forceContent: { hasIcons: true, onIcon: "check", offIcon: "xmark" },
      propNames: {
        Size: "size",
        Status: "isOn",
        State: "state"
      },
      variantValues: {
        size: SIZE_LMXS,
        Size: SIZE_LMXS,
        isOn: { On: "on", Off: "off", on: "on", off: "off" },
        Status: { On: "on", Off: "off", on: "on", off: "off" },
        state: STATE_DEFAULT,
        State: STATE_DEFAULT
      }
    },
    {
      dscoKey: "e425e8b498f0675603eaca40dcf39343fedcb62e",
      dscoName: "Slider Bar",
      cadsName: "Slider Bar",
      propNames: {
        "% Filled": "percentFilled",
        "Starts From": "startsFrom",
        State: "state"
      },
      variantValues: {
        percentFilled: {
          "100": "100% (side)",
          "75": "75% (side)",
          "50": "50% (side)",
          "25": "25% (side)",
          "0": "0% (both)",
          "100%": "100% (side)",
          "75%": "75% (side)",
          "50%": "50% (side)",
          "25%": "25% (side)",
          "0%": "0% (both)",
          "100% (side)": "100% (side)",
          "75% (side)": "75% (side)",
          "50% (side)": "50% (side)",
          "25% (side)": "25% (side)",
          "0% (both)": "0% (both)",
          "-50% (center)": "-50% (center)",
          "-100% (center)": "-100% (center)",
          "+50% (center)": "+50% (center)",
          "+100% (center)": "+100% (center)"
        },
        "% Filled": {
          "100": "100% (side)",
          "75": "75% (side)",
          "50": "50% (side)",
          "25": "25% (side)",
          "0": "0% (both)",
          "100%": "100% (side)",
          "75%": "75% (side)",
          "50%": "50% (side)",
          "25%": "25% (side)",
          "0%": "0% (both)"
        },
        startsFrom: {
          Side: "side",
          Middle: "center",
          Center: "center",
          side: "side",
          center: "center"
        },
        "Starts From": { Side: "side", Middle: "center", Center: "center" },
        state: {
          Default: "default",
          Error: "error",
          Disabled: "disabled",
          default: "default",
          error: "error",
          disabled: "disabled"
        },
        State: {
          Default: "default",
          Error: "error",
          Disabled: "disabled"
        }
      }
    },
    {
      dscoKey: "64b2b6fca4e117da33d3d88304783c529687df7e",
      dscoName: "Slider Stepper",
      cadsName: "Slider Stepper",
      propNames: { Count: "stepCount" },
      variantValues: {
        stepCount: { "3": "3", "4": "4", "5": "5", "6": "6" },
        Count: { "3": "3", "4": "4", "5": "5", "6": "6" }
      }
    },
    {
      dscoKey: "1f49b8bd60a1d0351739d42dff1644522002ea00",
      dscoName: "Breadcrumb Link",
      cadsName: "Breadcrumb Links",
      special: "breadcrumbLink",
      captureText: true,
      textCaptureTarget: "pageName",
      propNames: {
        Size: "size",
        Type: "iconOnly",
        State: "isCurrent",
        "Icon Name": "iconName",
        Icon: "iconName"
      },
      variantValues: {
        size: SIZE_LMXS,
        Size: SIZE_LMXS,
        iconOnly: {
          Icon: "yes",
          Text: "no",
          yes: "yes",
          no: "no"
        },
        Type: { Icon: "yes", Text: "no" },
        isCurrent: {
          Active: "Yes",
          Default: "No",
          Visited: "No",
          Yes: "Yes",
          No: "No",
          yes: "Yes",
          no: "No"
        },
        State: {
          Active: "Yes",
          Default: "No",
          Visited: "No"
        }
      }
    },
    {
      dscoKey: "d8b09d58c31343f8ad588e1edda6e650de6c423f",
      dscoName: "Breadcrumbs Blocks",
      cadsName: "Breadcrumb Separators",
      propNames: { Size: "size" },
      variantValues: SIZE_TABLE
    },
    {
      dscoKey: "3046d24d897ea7a8fef82b9df239e2d2b7b45f7c",
      dscoName: "Tab",
      cadsName: "Tab Item",
      special: "tabCurrent",
      propNames: {
        Label: "labelText",
        "Left Icon": "startIconName",
        "Right Icon": "endIconName",
        "Show Left Icon": "startIcon",
        "Show Right Icon": "endIcon",
        Closeable: "isDismissible",
        Size: "size",
        Type: "type",
        "ONLY Icon": "iconOnly",
        "Icon Only": "iconOnly",
        State: "isCurrent"
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
        iconOnly: YES_NO_CAP,
        "ONLY Icon": YES_NO_CAP,
        "Icon Only": YES_NO_CAP,
        isCurrent: {
          Active: "yes",
          Default: "no",
          yes: "yes",
          no: "no"
        },
        State: { Active: "yes", Default: "no" }
      }
    },
    {
      dscoKey: "046a167c72e8ce57d1fb39e003531928d0309feb",
      dscoName: "Tab Group",
      cadsName: "Tab Group",
      propNames: { Size: "size", Type: "type" },
      variantValues: {
        size: SIZE_LMXS,
        Size: SIZE_LMXS,
        type: {
          Primary: "primary",
          Secondary: "secondary",
          primary: "primary",
          secondary: "secondary"
        },
        Type: { Primary: "primary", Secondary: "secondary" }
      }
    },
    {
      dscoKey: "d9e848e2167cade785a34c19aff53552645fa03d",
      dscoName: "Tooltip",
      cadsName: "Tooltip",
      special: "tooltipType",
      propNames: {
        "Tooltip Text": "text",
        "Has Tail": "hasCaret",
        Type: "startIcon",
        Direction: "caretPlacement"
      },
      variantValues: {
        // DSCO Direction = tooltip relative to anchor (OnBottom = below target →
        // caret on top of bubble). CADS caretPlacement = caret side on bubble.
        caretPlacement: {
          OnBottom: "top",
          OnTop: "bottom",
          OnLeft: "right",
          OnRight: "left",
          bottom: "bottom",
          top: "top",
          left: "left",
          right: "right"
        },
        Direction: {
          OnBottom: "top",
          OnTop: "bottom",
          OnLeft: "right",
          OnRight: "left"
        }
      }
    },
    {
      dscoKey: "402577f53a413426e8fbdb59d73a7750b64ddd79",
      dscoName: "Drawer",
      cadsName: "Drawer",
      special: "drawerType",
      propNames: {
        Title: "titleText",
        Description: "descriptionText",
        "Show Description": "hasDescription",
        "Show Action Row": "hasActionRow",
        "Has Custom Content": "type"
      },
      variantValues: {
        type: {
          Yes: "customContent",
          No: "textOnly",
          yes: "customContent",
          no: "textOnly",
          customContent: "customContent",
          textOnly: "textOnly"
        },
        "Has Custom Content": {
          Yes: "customContent",
          No: "textOnly"
        }
      }
    },
    {
      dscoKey: "6fd36a39efde8f927febe94b2d20a77cca842844",
      dscoName: "Dialog",
      cadsName: "Dialog",
      special: "dialogType",
      propNames: {
        Title: "titleText",
        Text: "descriptionText",
        "Show Secondary": "hasSecondaryAction",
        "Top Icon": "topIconName",
        "Show Image": "hasImage",
        Closeable: "isDismissable",
        Type: "type"
      },
      variantValues: {
        type: {
          Default: "default",
          "Icon Top": "iconTop",
          default: "default",
          iconTop: "iconTop"
        },
        Type: { Default: "default", "Icon Top": "iconTop" }
      }
    },
    // ═══ Wave E — composed / nested ═══
    {
      dscoKey: "57fb424c2504d5c1f7c18f185a1c36e8bf872508",
      dscoName: "Text Field",
      cadsName: "Text Input",
      forceVariants: { type: "field" },
      propNames: { Size: "size" },
      variantValues: SIZE_TABLE,
      nestedApply: [
        {
          matchNames: ["Field Wrapper"],
          propNames: {
            "Label Text": "labelText",
            "Help Message": "helperText",
            "Show Help Text": "showHelper",
            "Show Icon": "showHelper",
            "Icon Name": "helperIcon",
            Size: "size"
          },
          variantValues: SIZE_TABLE
        },
        {
          matchNames: ["Text Input Building Block"],
          propNames: {
            FieldText: "placeholderText",
            "Field Text": "placeholderText",
            "Show field text": "hasPlaceholder",
            Color: "color",
            State: "state",
            Size: "size"
          },
          variantValues: {
            size: SIZE_LMXS,
            Size: SIZE_LMXS,
            color: FIELD_COLOR,
            Color: FIELD_COLOR,
            state: STATE_DEFAULT,
            State: STATE_DEFAULT
          },
          forceVariants: { type: "field" }
        }
      ]
    },
    {
      dscoKey: "84db09de35208651719ba49035c8eb3e2383fc68",
      dscoName: "Text Area",
      cadsName: "Text Input",
      forceVariants: { type: "area" },
      propNames: { Size: "size" },
      variantValues: SIZE_TABLE,
      nestedApply: [
        {
          matchNames: ["Field Wrapper"],
          propNames: {
            "Label Text": "labelText",
            "Help Message": "helperText",
            "Show Help Text": "showHelper",
            "Show Icon": "showHelper",
            "Icon Name": "helperIcon",
            Size: "size"
          },
          variantValues: SIZE_TABLE
        },
        {
          matchNames: ["Text Input Building Block"],
          propNames: {
            FieldText: "placeholderText",
            "Field Text": "placeholderText",
            "Show field text": "hasPlaceholder",
            Color: "color",
            State: "state",
            Size: "size"
          },
          variantValues: {
            size: SIZE_LMXS,
            Size: SIZE_LMXS,
            color: FIELD_COLOR,
            Color: FIELD_COLOR,
            state: STATE_DEFAULT,
            State: STATE_DEFAULT
          },
          forceVariants: { type: "area" }
        }
      ]
    },
    {
      dscoKey: "80f93b64131f10c8f805fd5ce3bd3833436bd24a",
      dscoName: "Dropdown Field",
      cadsName: "Dropdown",
      forceVariants: { role: "input" },
      propNames: { Size: "size" },
      variantValues: SIZE_TABLE,
      nestedApply: [
        {
          matchNames: ["Field Wrapper"],
          propNames: {
            "Label Text": "labelText",
            Label: "labelText",
            "Help Message": "helperText",
            "Show Help Text": "showHelper",
            "Icon Name": "helperIcon",
            Size: "size"
          },
          variantValues: SIZE_TABLE
        },
        {
          matchNames: ["Dropdown Button"],
          propNames: {
            Color: "color",
            State: "state",
            Size: "size"
          },
          variantValues: {
            size: SIZE_LMXS,
            Size: SIZE_LMXS,
            color: FIELD_COLOR,
            Color: FIELD_COLOR,
            state: STATE_DEFAULT,
            State: STATE_DEFAULT
          }
        }
      ]
    },
    {
      dscoKey: "7aa7d44bba4b5dc76d69cc1d81c167cc03608832",
      dscoName: "Chip Group",
      cadsName: "Chip Group",
      propNames: {
        Size: "size",
        Type: "labelStyle",
        Color: "color"
      },
      variantValues: {
        size: SIZE_LMXS,
        Size: SIZE_LMXS,
        labelStyle: THICK_THIN,
        Type: THICK_THIN,
        color: {
          Black: "primary",
          Gray: "secondary",
          primary: "primary",
          secondary: "secondary"
        },
        Color: { Black: "primary", Gray: "secondary" }
      },
      nestedApply: [
        {
          matchNames: ["Field Wrapper"],
          propNames: {
            "Group Label": "labelText",
            Label: "labelText",
            Size: "size"
          },
          variantValues: SIZE_TABLE
        }
      ]
    },
    {
      dscoKey: "1d12e71986a41db4dcc4e567b6923d7ed043abdd",
      dscoName: "Breadcrumbs",
      cadsName: "Breadcrumbs",
      propNames: { Size: "size" },
      variantValues: SIZE_TABLE,
      // Nested Breadcrumb Link/Blocks remapped best-effort via nestedApply
      nestedApply: [
        {
          matchNames: ["Breadcrumb Link", "Breadcrumb Links"],
          propNames: { Size: "size" },
          variantValues: SIZE_TABLE
        },
        {
          matchNames: ["Breadcrumb Separator", "Breadcrumb Separators"],
          propNames: { Size: "size" },
          variantValues: SIZE_TABLE
        }
      ]
    },
    {
      dscoKey: "2c50539a1e47e54eb7ab1474e6eeb085cca393c0",
      dscoName: "Slider",
      cadsName: "Slider",
      special: "sliderControls",
      propNames: {
        "Slider Label": "labelText",
        "Show Label": "showLabelRow",
        "Show Stepper": "showStepper",
        "Input Value": "displayValue",
        "Show Tooltip Icon": "showHelper"
      },
      nestedApply: [
        {
          matchNames: ["Slider Bar"],
          special: "sliderStartsFrom",
          propNames: {
            "% Filled": "percentFilled",
            "Starts From": "startsFrom",
            Type: "startsFrom",
            State: "state"
          },
          variantValues: {
            startsFrom: {
              Range: "side",
              Centered: "center",
              Side: "side",
              Middle: "center",
              side: "side",
              center: "center"
            },
            Type: { Range: "side", Centered: "center" },
            "Starts From": { Side: "side", Middle: "center" },
            state: {
              Default: "default",
              Error: "error",
              Disabled: "disabled",
              default: "default",
              error: "error",
              disabled: "disabled"
            },
            State: {
              Default: "default",
              Error: "error",
              Disabled: "disabled"
            }
          }
        }
      ]
    },
    {
      dscoKey: "354d944bb976f7104bbcd34cf8a733aff3124964",
      dscoName: "Popover",
      cadsName: "Popover",
      special: "popoverCaret",
      propNames: {
        Direction: "caretPlacement"
      },
      variantValues: {
        // Same invert as Tooltip: DSCO Direction = vs anchor; CADS = caret side.
        caretPlacement: {
          None: "bottomLeft",
          OnBottom: "topCenter",
          OnTop: "bottomCenter",
          OnLeft: "rightCenter",
          OnRight: "leftCenter",
          Bottom: "topCenter",
          Top: "bottomCenter",
          Left: "rightCenter",
          Right: "leftCenter"
        },
        Direction: {
          None: "bottomLeft",
          OnBottom: "topCenter",
          OnTop: "bottomCenter",
          OnLeft: "rightCenter",
          OnRight: "leftCenter"
        }
      },
      nestedApply: [
        {
          matchNames: ["Popover Core"],
          propNames: {
            Text: "bodyText",
            Title: "titleText",
            "Show Actions": "hasActionRow",
            "Show Action Row": "hasActionRow",
            "Show Primary": "hasPrimaryAction",
            "Show Secondary": "hasSecondaryAction",
            Closeable: "isDismissible",
            "Show Stepper": "hasStepper"
          }
        }
      ]
    },
    {
      dscoKey: "5978e70b44d30d937b300a136fd1e5c46a8a70c1",
      dscoName: "Modal",
      cadsName: "Modal",
      special: "modalType",
      propNames: {
        Title: "titleText",
        Closeable: "isDismissable",
        "Show Secondary": "hasSecondaryAction",
        "Show 2ary": "hasSecondaryAction",
        Type: "type"
      },
      variantValues: {
        type: {
          Default: "default",
          "Image Top": "verticalImage",
          "Image Inline": "horizontalImage",
          default: "default",
          verticalImage: "verticalImage",
          horizontalImage: "horizontalImage"
        },
        Type: {
          Default: "default",
          "Image Top": "verticalImage",
          "Image Inline": "horizontalImage"
        }
      },
      slotText: [
        { matchName: "customContent", fromProp: "Content" }
      ]
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
  function mergeCheckboxStatus(captured) {
    var _a, _b;
    const indeterminate = (_a = captured.variants.Indeterminate) != null ? _a : captured.variants.indeterminate;
    const selected = (_b = captured.variants.Selected) != null ? _b : captured.variants.selected;
    if (indeterminate === "Yes" || indeterminate === "yes" || indeterminate === "true") {
      return "indeterminate";
    }
    if (selected === "Yes" || selected === "yes" || selected === "true") {
      return "selected";
    }
    return "unselected";
  }
  function applySpecialVariants(rule, captured, out) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q;
    const result = __spreadValues({}, out);
    switch (rule.special) {
      case "chipColorSelected": {
        const selectedRaw = (_a = captured.variants.Selected) != null ? _a : captured.variants.selected;
        const colorRaw = (_b = captured.variants.Color) != null ? _b : captured.variants.color;
        const isSelected = selectedRaw === "Yes" || selectedRaw === "yes" || colorRaw === "Selected";
        if (isSelected) {
          result.selected = "yes";
          result.color = "selected (n/a)";
        } else {
          result.selected = "no";
          if (colorRaw === "Black") result.color = "primary";
          else if (colorRaw === "Gray" || colorRaw === "Grey")
            result.color = "secondary";
        }
        break;
      }
      case "segmentedBlockActive": {
        const state = (_c = captured.variants.State) != null ? _c : captured.variants.state;
        result.isActive = state === "Pressed" || state === "pressed" ? "yes" : "no";
        result.state = "default";
        break;
      }
      case "iconToggleIsOn": {
        const type = (_d = captured.variants.Type) != null ? _d : captured.variants.type;
        if (type === "Off to On" || type === "Off") result.isOn = "off";
        else if (type === "On to Off" || type === "On") result.isOn = "on";
        delete result.Type;
        delete result.type;
        break;
      }
      case "menuItemType": {
        const type = (_f = (_e = captured.variants.Type) != null ? _e : captured.variants.type) != null ? _f : "";
        if (type.includes("Checkbox")) {
          result.role = "input";
          result.itemType = "checkbox";
        } else if (type.includes("Destructive")) {
          result.role = "action";
          result.itemType = "defaultError";
        } else if (type.includes("Action")) {
          result.role = "action";
          result.itemType = "default";
        } else {
          result.role = "input";
          result.itemType = "default";
        }
        const state = (_g = captured.variants.State) != null ? _g : captured.variants.state;
        if (state === "Selected") result.selected = "yes";
        else if (state && state !== "Selected") result.selected = "no";
        delete result.Type;
        delete result.type;
        break;
      }
      case "menuListType": {
        const type = (_i = (_h = captured.variants.Type) != null ? _h : captured.variants.type) != null ? _i : "";
        if (type.includes("Checkbox")) {
          result.menuType = "checklist";
          result.role = "input";
        } else {
          result.menuType = "default";
          result.role = "action";
        }
        delete result.Type;
        delete result.type;
        break;
      }
      case "actionDropdown": {
        result.role = "action";
        if (!result.menuType) result.menuType = "default";
        break;
      }
      case "tooltipType": {
        const type = (_k = (_j = captured.variants.Type) != null ? _j : captured.variants.type) != null ? _k : "";
        if (type === "Label" || type.toLowerCase() === "label") {
        }
        break;
      }
      case "popoverCaret": {
        const dir = (_l = captured.variants.Direction) != null ? _l : captured.variants.direction;
        if (dir === "None" || dir === "none") {
          delete result.caretPlacement;
        }
        break;
      }
      case "breadcrumbLink": {
        const state = (_m = captured.variants.State) != null ? _m : captured.variants.state;
        if (state === "Active") result.isCurrent = "Yes";
        else result.isCurrent = "No";
        delete result.state;
        delete result.State;
        break;
      }
      case "tabCurrent": {
        const state = (_n = captured.variants.State) != null ? _n : captured.variants.state;
        if (state === "Active") result.isCurrent = "yes";
        else result.isCurrent = "no";
        delete result.state;
        delete result.State;
        break;
      }
      case "drawerType": {
        const custom = (_o = captured.variants["Has Custom Content"]) != null ? _o : captured.variants.hasCustomContent;
        if (custom === "Yes" || custom === "yes" || custom === "true") {
          result.type = "customContent";
        } else if (custom === "No" || custom === "no" || custom === "false") {
          result.type = "textOnly";
        }
        break;
      }
      case "dialogType": {
        const type = (_p = captured.variants.Type) != null ? _p : captured.variants.type;
        if (type === "Icon Top") result.type = "iconTop";
        else if (type === "Default") result.type = "default";
        break;
      }
      case "modalType": {
        const type = (_q = captured.variants.Type) != null ? _q : captured.variants.type;
        if (type === "Image Top") result.type = "verticalImage";
        else if (type === "Image Inline") result.type = "horizontalImage";
        else if (type === "Default") result.type = "default";
        break;
      }
      case "sliderControls": {
        break;
      }
      default:
        break;
    }
    if (rule.special === "checkboxStatus" || rule.dscoName === "Checkbox Blocks") {
      result.status = mergeCheckboxStatus(captured);
      delete result.Selected;
      delete result.selected;
      delete result.Indeterminate;
      delete result.indeterminate;
    }
    return result;
  }
  function remapVariants(rule, captured) {
    var _a, _b;
    const out = {};
    for (const [axis, value] of Object.entries(captured.variants)) {
      const targetAxis = (_b = (_a = rule.propNames) == null ? void 0 : _a[axis]) != null ? _b : axis;
      const remapped = remapVariantValue(rule, axis, value);
      const alsoByTarget = remapVariantValue(rule, targetAxis, remapped);
      if (alsoByTarget === "true" || alsoByTarget === "false" || alsoByTarget === "Yes" || alsoByTarget === "No" || alsoByTarget === "yes" || alsoByTarget === "no") {
        const lower = targetAxis.toLocaleLowerCase();
        if (lower === "hasicon" || lower === "hasaction" || lower === "haslabel" || lower === "hastwotoggles" || lower === "showhelper" || lower === "showlabelrow" || lower === "showstepper" || lower === "showcontrols" || lower === "hasplaceholder" || lower === "starticon" || lower === "endicon" || lower === "open" || lower === "showactionrow" || lower === "hascaret" || lower === "isdismissible" || lower === "isdismissable" || lower === "hasdescription" || lower === "hasactionrow" || lower === "hassecondaryaction" || lower === "hasprimaryaction" || lower === "hasimage" || lower === "hasstarticon") {
          continue;
        }
      }
      if (targetAxis.toLocaleLowerCase() === "state" && (rule.special === "segmentedBlockActive" || rule.special === "breadcrumbLink" || rule.special === "tabCurrent" || rule.special === "menuItemType")) {
        continue;
      }
      if (targetAxis.toLocaleLowerCase() === "state") {
        out[targetAxis] = "default";
        continue;
      }
      if ((axis === "Color" || axis === "color") && (rule.dscoName === "Segmented Button Group" || rule.dscoName === "Segmented Button Block" || rule.dscoName === "Icon Toggle Group" || rule.dscoName === "Slider")) {
        continue;
      }
      out[targetAxis] = alsoByTarget;
    }
    if (rule.forceVariants) {
      for (const [axis, value] of Object.entries(rule.forceVariants)) {
        out[axis] = value;
      }
    }
    const specialized = applySpecialVariants(rule, captured, out);
    if (rule.cadsName === "Button") {
      return applyButtonRestrictedCombos(specialized);
    }
    return specialized;
  }
  function remapNestedVariants(nested, captured) {
    var _a, _b, _c, _d;
    const mini = {
      dscoKey: "",
      dscoName: "",
      cadsName: "",
      propNames: nested.propNames,
      variantValues: nested.variantValues,
      forceVariants: nested.forceVariants
    };
    const out = remapVariants(mini, captured);
    if (nested.special === "checkboxStatus") {
      out.status = mergeCheckboxStatus(captured);
    }
    if (nested.special === "radioSelected") {
      const type = (_a = captured.variants.Type) != null ? _a : captured.variants.selected;
      if (type === "Selected" || type === "Yes" || type === "yes") {
        out.selected = "yes";
      } else if (type === "Unselected" || type === "No" || type === "no") {
        out.selected = "no";
      }
    }
    if (nested.special === "toggleOn") {
      const onOff = (_c = (_b = captured.variants["On/Off"]) != null ? _b : captured.variants.Status) != null ? _c : captured.variants.isOn;
      if (onOff === "On" || onOff === "on") out.isOn = "on";
      else if (onOff === "Off" || onOff === "off") out.isOn = "off";
    }
    if (nested.special === "sliderStartsFrom") {
      const type = (_d = captured.variants.Type) != null ? _d : captured.variants.type;
      if (type === "Range") out.startsFrom = "side";
      else if (type === "Centered") out.startsFrom = "center";
    }
    if (nested.forceVariants) {
      for (const [axis, value] of Object.entries(nested.forceVariants)) {
        out[axis] = value;
      }
    }
    return out;
  }
  function buildContentProperties(rule, captured, targetProps) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
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
    if (rule.special === "tooltipType") {
      const type = (_g = (_f = captured.variants.Type) != null ? _f : captured.variants.type) != null ? _g : "";
      const startKey = findTargetPropKey(targetMeta, "startIcon");
      if (startKey && targetMeta[startKey].type === "BOOLEAN") {
        out[startKey] = type === "IconLeft" || type === "IconRight" || type.toLowerCase().includes("icon");
      }
      if (captured.nestedIconName) {
        const iconKey = findTargetPropKey(targetMeta, "iconName");
        if (iconKey) out[iconKey] = captured.nestedIconName;
      }
      let hasTail = (_h = captured.variants["Has Tail"]) != null ? _h : captured.variants.hasCaret;
      if (hasTail === void 0) {
        for (const [key, value] of Object.entries(captured.properties)) {
          if (propBaseName(key) === "Has Tail") {
            hasTail = value;
            break;
          }
        }
      }
      const caretKey = findTargetPropKey(targetMeta, "hasCaret");
      if (caretKey && hasTail !== void 0 && targetMeta[caretKey].type === "BOOLEAN") {
        out[caretKey] = hasTail === true || hasTail === "Yes" || hasTail === "yes" || hasTail === "true";
      }
    }
    if (rule.special === "popoverCaret") {
      const dir = (_i = captured.variants.Direction) != null ? _i : captured.variants.direction;
      const caretKey = findTargetPropKey(targetMeta, "hasCaret");
      if (caretKey && targetMeta[caretKey].type === "BOOLEAN") {
        out[caretKey] = !(dir === "None" || dir === "none");
      }
    }
    if (rule.special === "sliderControls") {
      const truthy = (v) => v === true || v === "Yes" || v === "yes" || v === "true";
      const left = (_j = captured.variants["Show Left Button"]) != null ? _j : captured.properties["Show Left Button"];
      const right = (_k = captured.variants["Show Right Button"]) != null ? _k : captured.properties["Show Right Button"];
      const key = findTargetPropKey(targetMeta, "showControls");
      if (key && targetMeta[key].type === "BOOLEAN") {
        out[key] = truthy(left) || truthy(right);
      }
    }
    if (rule.forceContent) {
      for (const [base, value] of Object.entries(rule.forceContent)) {
        const key = findTargetPropKey(targetMeta, base);
        if (!key) continue;
        if (targetMeta[key].type === "BOOLEAN") {
          out[key] = Boolean(value);
        } else if (targetMeta[key].type === "TEXT") {
          out[key] = String(value);
        }
      }
    }
    return out;
  }
  function buildNestedContentProperties(nested, captured, targetProps) {
    const mini = {
      dscoKey: "",
      dscoName: "",
      cadsName: "",
      propNames: nested.propNames,
      variantValues: nested.variantValues,
      forceContent: nested.forceContent
    };
    return buildContentProperties(mini, captured, targetProps);
  }
  function buildNestedSwapProperties(nested, captured, targetProps) {
    const targetMeta = __spreadValues({}, targetProps);
    const out = buildNestedContentProperties(nested, captured, targetMeta);
    const variants = remapNestedVariants(nested, captured);
    for (const [axis, value] of Object.entries(variants)) {
      const targetKey = findTargetPropKey(targetMeta, axis);
      if (!targetKey || targetMeta[targetKey].type !== "VARIANT") continue;
      out[targetKey] = value;
    }
    return out;
  }
  function isSourcePropFalsy(captured, sourceProp) {
    for (const [key, value] of Object.entries(captured.properties)) {
      if (propBaseName(key) === sourceProp || key === sourceProp) {
        if (value === false || value === "false" || value === "No" || value === "no")
          return true;
        if (value === true || value === "true" || value === "Yes" || value === "yes")
          return false;
      }
    }
    const v = captured.variants[sourceProp];
    if (v === "No" || v === "no" || v === "false") return true;
    if (v === "Yes" || v === "yes" || v === "true") return false;
    return false;
  }

  // src/main/components.ts
  var importedSets = /* @__PURE__ */ new Map();
  async function findLocalComponentSetByKey(key) {
    for (const page of figma.root.children) {
      try {
        if ("loadAsync" in page) await page.loadAsync();
        const matches = page.findAllWithCriteria({ types: ["COMPONENT_SET"] });
        for (const set of matches) {
          if (set.key === key) return set;
        }
      } catch (e) {
      }
    }
    return null;
  }
  async function importCadsComponentSet(key) {
    const cached = importedSets.get(key);
    if (cached) return cached;
    try {
      const node = await figma.importComponentSetByKeyAsync(key);
      importedSets.set(key, node);
      return node;
    } catch (e) {
      const local = await findLocalComponentSetByKey(key);
      if (local) {
        importedSets.set(key, local);
        return local;
      }
      throw new Error(`CADS component set not found for key ${key.slice(0, 8)}\u2026`);
    }
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
  function targetPropMeta(props) {
    const meta = {};
    for (const [key, prop] of Object.entries(props)) {
      meta[key] = { type: prop.type };
    }
    return meta;
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
    let nestedIconName = null;
    const nestedIcon = findNestedInstances(instance, ["Tooltip Icon"])[0];
    if (nestedIcon) {
      for (const [key, prop] of Object.entries(nestedIcon.componentProperties)) {
        const base = propBaseName(key).toLocaleLowerCase();
        if ((base.includes("icon") || base === "name") && prop.type === "TEXT" && typeof prop.value === "string" && prop.value.trim()) {
          nestedIconName = prop.value.trim();
          break;
        }
      }
    }
    return {
      properties,
      variants,
      capturedText: null,
      tagIconPlacement,
      nestedIconName
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
  function findNestedInstances(root, matchNames) {
    const needles = matchNames.map((n) => n.toLocaleLowerCase());
    const hits = [];
    const walk = (node) => {
      var _a;
      if (node.type === "INSTANCE") {
        const name = node.name.toLocaleLowerCase();
        let setName = "";
        try {
          const main = node.mainComponent;
          if (((_a = main == null ? void 0 : main.parent) == null ? void 0 : _a.type) === "COMPONENT_SET") {
            setName = main.parent.name.toLocaleLowerCase();
          }
        } catch (e) {
        }
        if (needles.some(
          (n) => name.includes(n) || setName.includes(n) || n.includes(name)
        )) {
          hits.push(node);
        }
      }
      if ("children" in node) {
        for (const child of node.children) walk(child);
      }
    };
    walk(root);
    return hits;
  }
  async function applyNestedRules(instance, nestedRules, captured) {
    var _a;
    const warnings = [];
    for (const nested of nestedRules) {
      const targets = findNestedInstances(instance, nested.matchNames);
      if (targets.length === 0) {
        warnings.push(`nested "${nested.matchNames.join("|")}" not found`);
        continue;
      }
      for (const target of targets) {
        try {
          const props = buildNestedSwapProperties(
            nested,
            captured,
            targetPropMeta(target.componentProperties)
          );
          if (Object.keys(props).length > 0) {
            target.setProperties(props);
          }
        } catch (error) {
          warnings.push(
            `nested "${nested.matchNames[0]}" apply failed: ${String((_a = error.message) != null ? _a : error)}`
          );
        }
      }
    }
    return warnings;
  }
  function findTextInSubtree(root, matchName) {
    const needle = matchName.toLocaleLowerCase();
    let found = null;
    const walk = (node) => {
      if (found) return;
      if (node.type === "TEXT" && node.name.toLocaleLowerCase().includes(needle)) {
        found = node;
        return;
      }
      if (node.name.toLocaleLowerCase().includes(needle) && "children" in node) {
        for (const child of node.children) {
          if (child.type === "TEXT") {
            found = child;
            return;
          }
        }
      }
      if ("children" in node) {
        for (const child of node.children) walk(child);
      }
    };
    walk(root);
    return found;
  }
  async function applySlotTextRules(instance, slotRules, captured) {
    var _a;
    const warnings = [];
    for (const slot of slotRules) {
      let textValue = null;
      if (slot.useCapturedText) {
        textValue = captured.capturedText;
      } else if (slot.fromProp) {
        for (const [key, value] of Object.entries(captured.properties)) {
          if (propBaseName(key) === slot.fromProp && (typeof value === "string" || typeof value === "boolean")) {
            textValue = String(value);
            break;
          }
        }
        if (textValue === null) {
          const v = captured.variants[slot.fromProp];
          if (v !== void 0) textValue = v;
        }
      }
      if (textValue === null || textValue === "") continue;
      const textNode = findTextInSubtree(instance, slot.matchName);
      if (!textNode) {
        warnings.push(`slot TEXT "${slot.matchName}" not found`);
        continue;
      }
      try {
        await figma.loadFontAsync(textNode.fontName);
        textNode.characters = textValue;
      } catch (error) {
        warnings.push(
          `slot TEXT "${slot.matchName}" write failed: ${String((_a = error.message) != null ? _a : error)}`
        );
      }
    }
    return warnings;
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
      "role",
      "menuType",
      "menuPlacement",
      "isOn",
      "isActive",
      "isCurrent",
      "status",
      "position",
      "itemType",
      "percentFilled",
      "startsFrom",
      "stepCount",
      "caretPlacement",
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
  function resolveEffectiveRule(rule, captured, cadsKey) {
    if (!rule.retargetWhenFalse) return { rule, cadsKey };
    if (!isSourcePropFalsy(captured, rule.retargetWhenFalse.sourceProp)) {
      return { rule, cadsKey };
    }
    const altName = rule.retargetWhenFalse.cadsName;
    const altKey = resolveCadsComponentKey(altName);
    if (!altKey) return { rule, cadsKey };
    return {
      rule: __spreadProps(__spreadValues({}, rule), { cadsName: altName }),
      cadsKey: altKey
    };
  }
  async function swapSimple(instance, cadsKey) {
    var _a;
    const set = await importCadsComponentSet(cadsKey);
    const target = (_a = set.defaultVariant) != null ? _a : set.children.find((child) => child.type === "COMPONENT");
    if (!target || target.type !== "COMPONENT") {
      throw new Error("CADS component set has no default variant to swap to");
    }
    instance.swapComponent(target);
  }
  async function swapOne(instance, rule, cadsKey) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
    const captured = await captureInstanceProps(instance);
    if (rule.captureText) {
      captured.capturedText = captureFirstText(instance);
    }
    const effective = resolveEffectiveRule(rule, captured, cadsKey);
    const activeRule = effective.rule;
    const activeKey = effective.cadsKey;
    const set = await importCadsComponentSet(activeKey);
    const wantVariants = remapVariants(activeRule, captured);
    const critical = criticalAxes(wantVariants);
    const hasAnyWant = Object.keys(wantVariants).length > 0;
    if (Object.keys(critical).length === 0 && !hasAnyWant) {
      const fallback = (_a = set.defaultVariant) != null ? _a : set.children.find((child) => child.type === "COMPONENT");
      if (!fallback || fallback.type !== "COMPONENT") {
        throw new Error(
          `could not read variant props from "${instance.name}"`
        );
      }
      instance.swapComponent(fallback);
      const content = buildContentProperties(
        activeRule,
        captured,
        targetPropMeta(instance.componentProperties)
      );
      if (Object.keys(content).length > 0) {
        instance.setProperties(content);
      }
      if ((_b = activeRule.nestedApply) == null ? void 0 : _b.length) {
        await applyNestedRules(instance, activeRule.nestedApply, captured);
      }
      if ((_c = activeRule.slotText) == null ? void 0 : _c.length) {
        await applySlotTextRules(instance, activeRule.slotText, captured);
      }
      return;
    }
    const wantWithDefault = __spreadValues(__spreadValues({}, critical), wantVariants.state ? { state: "default" } : {});
    let target = (_f = (_e = (_d = findMatchingVariant(set, wantWithDefault)) != null ? _d : findMatchingVariant(set, critical)) != null ? _e : findMatchingVariant(set, withoutState(wantVariants))) != null ? _f : findMatchingVariant(set, wantVariants);
    if (!target) {
      target = (_h = (_g = set.defaultVariant) != null ? _g : set.children.find((child) => child.type === "COMPONENT")) != null ? _h : null;
      if (!target || target.type !== "COMPONENT") {
        throw new Error(
          `no CADS "${activeRule.cadsName}" variant for ${Object.entries(
            Object.keys(critical).length > 0 ? critical : wantVariants
          ).map(([k, v]) => `${k}=${v}`).join(", ")}`
        );
      }
      instance.swapComponent(target);
      const all = __spreadValues({}, buildContentProperties(
        activeRule,
        captured,
        targetPropMeta(instance.componentProperties)
      ));
      for (const [axis, value] of Object.entries(wantVariants)) {
        const meta = targetPropMeta(instance.componentProperties);
        for (const [key, prop] of Object.entries(instance.componentProperties)) {
          if (prop.type === "VARIANT" && propBaseName(key) === axis) {
            all[key] = value;
            void meta;
          }
        }
      }
      if (Object.keys(all).length > 0) {
        try {
          instance.setProperties(all);
        } catch (error) {
          throw new Error(
            `swapped (default) but props failed: ${String((_i = error.message) != null ? _i : error)}`
          );
        }
      }
    } else {
      instance.swapComponent(target);
      const content = buildContentProperties(
        activeRule,
        captured,
        targetPropMeta(instance.componentProperties)
      );
      if (Object.keys(content).length > 0) {
        try {
          instance.setProperties(content);
        } catch (error) {
          throw new Error(
            `swapped but content props failed: ${String((_j = error.message) != null ? _j : error)}`
          );
        }
      }
      if (Object.keys(critical).length > 0) {
        let mismatches = variantsMatch(readVariants(instance), critical);
        if (mismatches.length > 0) {
          const retry = (_k = findMatchingVariant(set, wantWithDefault)) != null ? _k : findMatchingVariant(set, critical);
          if (retry) {
            instance.swapComponent(retry);
            const content2 = buildContentProperties(
              activeRule,
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
    const nestedWarnings = ((_l = activeRule.nestedApply) == null ? void 0 : _l.length) ? await applyNestedRules(instance, activeRule.nestedApply, captured) : [];
    const slotWarnings = ((_m = activeRule.slotText) == null ? void 0 : _m.length) ? await applySlotTextRules(instance, activeRule.slotText, captured) : [];
    const warnings = [...nestedWarnings, ...slotWarnings];
    if (warnings.length > 0) {
      throw new Error(`swapped with warnings: ${warnings.join("; ")}`);
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
          if (rule) {
            await swapOne(instance, rule, mapping.targetKey);
          } else {
            await swapSimple(instance, mapping.targetKey);
          }
          swapped++;
        } catch (error) {
          const message = String((_a = error.message) != null ? _a : error);
          if (message.startsWith("swapped but content props failed:") || message.startsWith("swapped but variants drifted:") || message.startsWith("swapped with warnings:") || message.startsWith("swapped (default) but props failed:")) {
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
    if (rule) {
      const targetKey2 = resolveCadsComponentKey(rule.cadsName);
      if (!targetKey2) return null;
      return {
        sourceId: `component:${entry.key}`,
        targetKey: targetKey2,
        source: "rule",
        confidence: 0.95,
        rationale: `Swap ${rule.dscoName} \u2192 ${rule.cadsName} with prop remap`
      };
    }
    const suggested = suggestCadsComponent({ key: entry.key, name: entry.name });
    if (!suggested) {
      return {
        sourceId: `component:${entry.key}`,
        targetKey: null,
        source: "none",
        confidence: 0
      };
    }
    const targetKey = resolveCadsComponentKey(suggested);
    if (!targetKey) {
      return {
        sourceId: `component:${entry.key}`,
        targetKey: null,
        source: "none",
        confidence: 0
      };
    }
    return {
      sourceId: `component:${entry.key}`,
      targetKey,
      source: "exact-name",
      confidence: 0.8,
      rationale: `Name match \u2192 ${suggested} (default variant; verify props)`
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
  function proposeForVariable(entry, ctx, options) {
    var _a, _b, _c;
    const sourceId = (_a = options == null ? void 0 : options.sourceId) != null ? _a : entry.id;
    const usages = (_b = options == null ? void 0 : options.usages) != null ? _b : entry.usages;
    const surface = inferColorSurface(usages);
    const cacheKeyBase = entry.variableKey || entry.id;
    const cacheKey = `${cacheKeyBase}::${surface}`;
    const cached = (_c = ctx.cache[cacheKey]) != null ? _c : (
      // Legacy unscoped cache entries only apply when the rule surface matches.
      ctx.cache[cacheKeyBase]
    );
    if (cached && ctx.targets.some((t) => t.key === cached)) {
      const cachedTarget = ctx.targets.find((t) => t.key === cached);
      const cachedSurface = cachedTarget ? surfaceFromTokenName(cachedTarget.name) : null;
      if (!cachedSurface || cachedSurface === surface) {
        return {
          sourceId,
          targetKey: cached,
          source: "cache",
          confidence: 1,
          rationale: "Previously approved mapping"
        };
      }
    }
    if (entry.resolvedType === "COLOR") {
      if (entry.flag !== "primitive") {
        const ruleName = dscoToCadsColorName(entry.name);
        if (ruleName) {
          const ruleSurface = surfaceFromTokenName(ruleName);
          if (ruleSurface && ruleSurface !== surface) {
            return { sourceId, targetKey: null, source: "none", confidence: 0 };
          }
          const match = findColorTargetByName(ctx.targets, ruleName);
          if (match) {
            return {
              sourceId,
              targetKey: match.key,
              source: "rule",
              confidence: 1,
              rationale: `DSCO \u2192 CADS naming rule: ${entry.name} \u2192 ${match.name}`
            };
          }
        }
      }
      return { sourceId, targetKey: null, source: "none", confidence: 0 };
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
        sourceId,
        targetKey: best.target.key,
        source: best.kind,
        confidence: Math.round(best.score * 100) / 100,
        rationale: best.kind === "exact-name" ? "Names match" : best.kind === "value" ? "Resolved values match" : "Similar name"
      };
    }
    return { sourceId, targetKey: null, source: "none", confidence: 0 };
  }
  function proposeForFontAwesome(entry) {
    var _a;
    const family = (_a = entry.values.family) != null ? _a : "";
    const targetFamily = toFontAwesome7Family(family);
    if (!targetFamily) {
      return {
        sourceId: entry.id,
        targetKey: null,
        source: "none",
        confidence: 0
      };
    }
    return {
      sourceId: entry.id,
      targetKey: faFamilyTargetKey(targetFamily),
      source: "rule",
      confidence: 1,
      rationale: `Upgrade ${family} \u2192 ${targetFamily}`
    };
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
  function proposeForRawPaint(entry, ctx, options) {
    var _a, _b, _c;
    const sourceId = (_a = options == null ? void 0 : options.sourceId) != null ? _a : entry.id;
    const usages = (_b = options == null ? void 0 : options.usages) != null ? _b : entry.usages;
    const surface = inferColorSurface(usages);
    const cacheKey = `${entry.id}::${surface}`;
    const cached = (_c = ctx.cache[cacheKey]) != null ? _c : ctx.cache[entry.id];
    if (cached && ctx.targets.some((t) => t.key === cached)) {
      const cachedTarget = ctx.targets.find((t) => t.key === cached);
      const cachedSurface = cachedTarget ? surfaceFromTokenName(cachedTarget.name) : null;
      if (!cachedSurface || cachedSurface === surface) {
        return {
          sourceId,
          targetKey: cached,
          source: "cache",
          confidence: 1,
          rationale: "Previously approved mapping"
        };
      }
    }
    return { sourceId, targetKey: null, source: "none", confidence: 0 };
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
  function isSameNodeIds(left, right) {
    if (left.length !== right.length) return false;
    const rightIds = new Set(right);
    return left.every((id) => rightIds.has(id));
  }
  function isNodeInsideRoots(node, rootIds) {
    let current = node;
    while (current && current.type !== "PAGE" && current.type !== "DOCUMENT") {
      if (rootIds.has(current.id)) return true;
      current = current.parent;
    }
    return false;
  }
  function auditSelectionRelation(selection, rootNodeIds) {
    const selectionIds = selection.map((node) => node.id);
    if (isSameNodeIds(selectionIds, rootNodeIds)) return "same";
    const rootIds = new Set(rootNodeIds);
    if (selection.every((node) => isNodeInsideRoots(node, rootIds))) {
      return "inside";
    }
    return "outside";
  }
  function postSelection() {
    const selection = figma.currentPage.selection;
    const count = selection.length;
    post({
      type: "selection",
      count,
      nodeIds: selection.map((node) => node.id),
      label: count === 0 ? null : count === 1 ? selection[0].name : `${count} layers`,
      auditRelation: lastAudit && count > 0 ? auditSelectionRelation(selection, lastAudit.rootNodeIds) : void 0
    });
  }
  figma.on("selectionchange", () => {
    postSelection();
  });
  function applyTeamAiDefaults() {
    var _a;
    const team = getTeamAiSettings();
    if (!team) return;
    if ((_a = settings.ai) == null ? void 0 : _a.apiKey) return;
    settings = __spreadProps(__spreadValues({}, settings), { ai: team });
  }
  async function loadSettings() {
    try {
      const stored = await figma.clientStorage.getAsync(SETTINGS_KEY);
      if (stored) settings = __spreadValues(__spreadValues({}, EMPTY_SETTINGS), stored);
    } catch (e) {
      settings = EMPTY_SETTINGS;
    }
    applyTeamAiDefaults();
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
  async function loadStyleCatalog(preferLocalStyles) {
    styleCatalog = await buildStyleCatalog(
      null,
      (done, total) => post({
        type: "catalog-progress",
        done,
        total,
        label: "Loading text styles"
      })
    );
    if (preferLocalStyles && styleCatalog) {
      try {
        const locals = await figma.getLocalTextStylesAsync();
        for (const style of locals) {
          styleCatalog.importedByKey.set(style.key, style);
        }
      } catch (e) {
      }
    }
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
    await loadStyleCatalog(false);
    postCombinedCatalog();
    postSelection();
  }
  async function loadCadsCatalogFromLocal() {
    sotLibraryName = LOCAL_SOT_LIBRARY_NAME;
    settings.libraryName = LOCAL_SOT_LIBRARY_NAME;
    await saveSettings();
    post({
      type: "catalog-progress",
      done: 0,
      total: 0,
      label: "Loading local CADS variables"
    });
    catalogResult = await buildLocalCatalog(
      (done, total) => post({
        type: "catalog-progress",
        done,
        total,
        label: "Loading local CADS variables"
      })
    );
    await loadStyleCatalog(true);
    postCombinedCatalog();
    postSelection();
  }
  async function selectNodesById(nodeIds) {
    const nodes = [];
    for (const id of nodeIds) {
      const node = await figma.getNodeByIdAsync(id);
      if (node && "visible" in node) nodes.push(node);
    }
    if (nodes.length === 0) {
      throw new Error("The audited frame is no longer available.");
    }
    figma.currentPage.selection = nodes;
    postSelection();
  }
  async function handleAudit(nodeIds) {
    var _a;
    if (nodeIds && nodeIds.length > 0) {
      await selectNodesById(nodeIds);
    }
    const sotStyleKeys = new Set(
      ((_a = styleCatalog == null ? void 0 : styleCatalog.textStyles) != null ? _a : []).map((s) => s.key)
    );
    lastAudit = await auditSelection(
      { sotLibraryName, sotStyleKeys },
      (nodesScanned) => post({ type: "audit-progress", nodesScanned })
    );
    post({ type: "audit", result: lastAudit });
  }
  function usagesAt(all, indexes) {
    return indexes.map((index) => all[index]).filter((usage) => Boolean(usage));
  }
  function proposeColorEntry(entry, ctx) {
    var _a, _b, _c;
    const bySurface = splitUsageIndexesBySurface(entry.usages);
    const surfaces = Array.from(bySurface.keys());
    if (surfaces.length <= 1) {
      const surface = (_a = surfaces[0]) != null ? _a : "background";
      const indexes = (_b = bySurface.get(surface)) != null ? _b : entry.usages.map((_, i) => i);
      const usages = usagesAt(entry.usages, indexes);
      if (entry.kind === "variable") {
        return [
          proposeForVariable(entry.variable, ctx, {
            sourceId: entry.id,
            usages
          })
        ];
      }
      return [
        proposeForRawPaint(entry.paint, ctx, {
          sourceId: entry.id,
          usages
        })
      ];
    }
    const proposals = [];
    for (const surface of surfaces) {
      const indexes = (_c = bySurface.get(surface)) != null ? _c : [];
      if (indexes.length === 0) continue;
      const sourceId = composeSurfaceSourceId(entry.id, surface);
      const usages = usagesAt(entry.usages, indexes);
      if (entry.kind === "variable") {
        proposals.push(
          proposeForVariable(entry.variable, ctx, { sourceId, usages })
        );
      } else {
        proposals.push(
          proposeForRawPaint(entry.paint, ctx, { sourceId, usages })
        );
      }
    }
    return proposals;
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
        proposals.push(
          ...proposeColorEntry(
            { id: entry.id, usages: entry.usages, kind: "variable", variable: entry },
            ctx
          )
        );
      }
      for (const style of lastAudit.paintStyles) {
        proposals.push(
          ...proposeColorEntry(
            {
              id: style.id,
              usages: style.usages,
              kind: "paint",
              paint: style
            },
            ctx
          )
        );
      }
      for (const raw of lastAudit.rawPaints) {
        proposals.push(
          ...proposeColorEntry(
            { id: raw.id, usages: raw.usages, kind: "paint", paint: raw },
            ctx
          )
        );
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
      for (const fa of lastAudit.fontAwesomeTexts) {
        proposals.push(proposeForFontAwesome(fa));
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
      const { baseId, surface } = parseSurfaceSourceId(mapping.sourceId);
      const baseKey = (_b = cacheKeyById.get(baseId)) != null ? _b : baseId;
      const cacheKey = surface ? `${baseKey}::${surface}` : baseKey;
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
    await handleAudit(lastAudit.rootNodeIds);
  }
  async function handleSaveAiSettings(ai) {
    var _a;
    settings.ai = ai;
    await saveSettings();
    if (!((_a = settings.ai) == null ? void 0 : _a.apiKey)) {
      applyTeamAiDefaults();
    }
    post({ type: "settings", settings });
  }
  async function bootstrap() {
    await loadSettings();
    post({ type: "settings", settings });
    if (isCadsSourceFile()) {
      await loadCadsCatalogFromLocal();
      return;
    }
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
          await handleAudit(message.nodeIds);
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
