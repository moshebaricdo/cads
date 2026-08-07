/**
 * Baked CADS library facts used to tailor the audit:
 *
 * - Collection classification drives policy: primitive colors are flagged
 *   (semantic variables should be used), typography variables are flagged
 *   (a text style should be used), the shape collection is the target pool
 *   for corner-radius mapping.
 * - Component keys identify CADS instances so everything else can be flagged
 *   as non-CADS in the component audit.
 *
 * Harvested 2026-08-05 via Figma MCP from the live CADS file
 * (DGekOeToRVifvFAhfqpeC1); key audit 2026-08-06 (Studio Global Nav +
 * import-by-key verify). Collections Primitive Colors (113) / Semantic
 * Colors (148) / Typography (32) / Spacing & Shape (13) / Z: Special Alpha,
 * plus top-level components & component sets.
 *
 * Cut/paste (⌘X) from another library file into CADS mints **new** published
 * keys. Detection therefore uses current keys + historical aliases + exact
 * name match (excluding known DSCO keys — see `isCadsComponent` in audit).
 *
 * The name-pattern fallbacks keep the plugin functional against a renamed or
 * different SoT library.
 */

/** Collections whose color variables are primitives — never a remap target. */
export const PRIMITIVE_COLOR_COLLECTIONS = ["Primitive Colors"];
export const PRIMITIVE_COLLECTION_PATTERN = /primitive/i;

/**
 * CADS special-alpha colors (e.g. `focus-alpha`) used for focus-ring chrome on
 * fill-less frames. Treated as compliant SoT even when the collection is not
 * published / attributable via teamLibrary (common for Z: Special Alpha).
 */
export const SPECIAL_ALPHA_COLLECTIONS = ["Z: Special Alpha"];
export const SPECIAL_ALPHA_COLLECTION_PATTERN = /special\s*alpha/i;

/** Collections whose variables are typography primitives — use a text style instead. */
export const TYPOGRAPHY_COLLECTIONS = ["Typography"];
export const TYPOGRAPHY_COLLECTION_PATTERN = /typograph|font/i;

/** Collections that own radius/shape values — the target pool for corner radii. */
export const SHAPE_COLLECTIONS = ["Spacing & Shape"];
export const SHAPE_COLLECTION_PATTERN = /shape|radius/i;

export function isPrimitiveColorCollection(name: string): boolean {
  return (
    PRIMITIVE_COLOR_COLLECTIONS.includes(name) ||
    PRIMITIVE_COLLECTION_PATTERN.test(name)
  );
}

export function isSpecialAlphaCollection(name: string): boolean {
  return (
    SPECIAL_ALPHA_COLLECTIONS.includes(name) ||
    SPECIAL_ALPHA_COLLECTION_PATTERN.test(name)
  );
}

export function isTypographyCollection(name: string): boolean {
  return (
    TYPOGRAPHY_COLLECTIONS.includes(name) ||
    TYPOGRAPHY_COLLECTION_PATTERN.test(name)
  );
}

export function isShapeCollection(name: string): boolean {
  return SHAPE_COLLECTIONS.includes(name) || SHAPE_COLLECTION_PATTERN.test(name);
}

/** Radius variables only; excludes spacing variables in the shared collection. */
export function isShapeVariable(name: string): boolean {
  return /^shape(?:[\/\s_-]|$)/i.test(name.trim());
}

export interface BakedComponent {
  key: string;
  name: string;
}

/** Top-level components & component sets in the CADS file (variant children excluded). */
export const cadsComponents: BakedComponent[] = [
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
  { name: "Header", key: "67c596ff289a71901524fd7186a6f0ddafc34b80" },
];

/**
 * Pre-cut/paste published keys (and removed components that may still appear
 * as remote instances). Detection-only — swap targets use `cadsComponents`.
 */
export const cadsComponentKeyAliases: readonly string[] = [
  // Sidebar / panel / file (2026-08-04 keys, superseded by cut/paste)
  "a2f4af3436221940c13404ae7201bf3151cb40e7", // Sidebar V2
  "f0272599a858b7b4f5c0e3f5155fe696324e4416", // Sidebar Tab Item V2
  "a7251af1ab08bcc859eec25ce5ccaad43efa83db", // Sidebar Control
  "2522edcc270a34403f65cccfe596464f5086b13f", // Sidebar Tab Group V2
  "abb54f5f763ce07b0013c77610be9284aa76c7cb", // File Manager V2
  "fab16010bc26130ca9812bd19e67c33ff02306cc", // File Item
  "031b78440362d1725ee2541876e770b3fe74ef3a", // File Item Icons
  "9ef24ef709b07a90e4519db55ecfb53c2e04a7ba", // File Tab Row Item
  "fed5f8b995c5b598a033c5068316f3a1857793ad", // Panel Header V2
  "3deb83c08dbb6ec9731beacb41afc7bb02e541b0", // Panel Header Building Block
  "ad8f55903b9e05ebb90bf62be928a8a3c8b79b5d", // Resize Handle (removed from file)
  // Lab Nav local set (🔴 Lab Global Nav) — successor is Studio Global Nav
  "d55c0edf1cdf9da3fbf0ed7874cd8b0412dc5dc0", // Lab Nav
  // AI (2026-08-04 keys)
  "6b24728a35b36a560fa1a078f47416e7bb0481e9", // AI Tutor Chat Input
  "5df8b5202273c79891767beb6ba7bd6c55e1b4b0", // AI Chat Messages
  "6115fa90ad8516c35630a89a3dfb31c724d5c2d9", // AI Chat File Chip
  "2d79bdb562eb8dfd06541936a1e172fc45744a51", // AI Chat File Chip (dup)
  "c3750d3440beb1d5a90a7ac8d38070f43b446a61", // AI Shortcut Chip
  "dc266a0e284b4ce45df247eb561d49a8dc34011d", // AI Support Indicator (removed)
  "2acbc590b735b611c8ba6e6c8a86adb8d3ac9275", // AI File Chip Close Button
  "fe3226e7d739fa31c14ef3ae414ac909c049a77b", // AI Chat File Item (removed)
];

export const cadsComponentKeys = new Set([
  ...cadsComponents.map((c) => c.key),
  ...cadsComponentKeyAliases,
]);

/** Normalized display names for cut/paste key-churn fallback. */
export const cadsComponentNames = new Set(
  cadsComponents.map((c) => c.name.trim().toLocaleLowerCase()),
);

export function isKnownCadsComponentName(name: string): boolean {
  return cadsComponentNames.has(name.trim().toLocaleLowerCase());
}
