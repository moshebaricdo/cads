/**
 * Published (OLD) DSCO Components → CADS component suggestions.
 *
 * Harvested 2026-08-04 via Figma `search_design_system` against library
 * `(OLD) DSCO Components`
 * (`lk-cc085940…`). Mapped to published CADS names in `cadsCatalog.ts`.
 *
 * Matching priority for suggestions:
 * 1. Published DSCO component key (durable across renames in consumer files)
 * 2. Known DSCO → CADS name rewrite
 * 3. Exact CADS name match
 */

import { cadsComponents } from "./cadsCatalog";

export interface DscoComponentMapping {
  key: string;
  name: string;
  /** Published CADS successor name, or null when none. */
  cadsName: string | null;
}

/**
 * Top-level published DSCO component sets with CADS successors.
 * Duplicate names with different keys (e.g. two AI Chat File Chip sets) are
 * listed separately when both appear in the published library.
 */
export const dscoComponents: DscoComponentMapping[] = [
  // Actions
  { key: "cbc707599ceb83eaa1cee51d698831793e0ebde6", name: "Button", cadsName: "Button" },
  {
    key: "0478bc835a0e7e1593fc0e6f3044f54730b66861",
    name: "Destructive Button",
    cadsName: "Button",
  },
  {
    key: "385632d619eb1dffc825a323a3f596b2011f8bb7",
    name: "Close Icon Button",
    cadsName: "Close Icon Button",
  },
  {
    key: "148a82188be79992d7015f52492071c21a21f705",
    name: "Segmented Button Group",
    cadsName: "Segmented Button Group",
  },
  {
    key: "25783a815c161998fb765a4242de17ddfcef2e81",
    name: "Segmented Button Block",
    cadsName: "Segmented Button Block",
  },
  {
    key: "1ba27ea5b212558f4281b0278785db09d2b65262",
    name: "Icon Toggle Button",
    cadsName: "Icon Toggle",
  },
  {
    key: "c134c8ce1f97a8067852366746163bf5a49cfa07",
    name: "Icon Toggle Group",
    cadsName: "Icon Toggle + Label",
  },

  // Forms
  {
    key: "57fb424c2504d5c1f7c18f185a1c36e8bf872508",
    name: "Text Field",
    cadsName: "Text Input",
  },
  {
    key: "84db09de35208651719ba49035c8eb3e2383fc68",
    name: "Text Area",
    cadsName: "Text Input",
  },
  {
    key: "80f93b64131f10c8f805fd5ce3bd3833436bd24a",
    name: "Dropdown Field",
    cadsName: "Dropdown",
  },
  {
    key: "12a72e8b7d28b78b26d6d85e0884146524eb3001",
    name: "Input Dropdown",
    cadsName: "Dropdown",
  },
  {
    key: "ab47ef51db67847667cab7b99707f8e777d64551",
    name: "Action Dropdown",
    cadsName: "Dropdown",
  },
  {
    key: "b976343862b4c66015dec46d68395f42739ea9a5",
    name: "Dropdown Menu Button",
    cadsName: "Dropdown Button",
  },
  {
    key: "e2274d238ee69542f85d9e9476e11e88c0bde612",
    name: "Dropdown Menu List",
    cadsName: "Dropdown Menu List",
  },
  {
    key: "0cdd5bf757831059deb7ae24d9b7cf39f86f21d2",
    name: "Dropdown Menu Items",
    cadsName: "Dropdown Menu Item",
  },
  {
    key: "d1962e3d41cdec427b9b37396990ce826fe5a377",
    name: "Checkbox",
    cadsName: "Checkbox + Label",
  },
  {
    key: "bc82043dae67f96dfbbe8f1e20d02ea7ebe1d458",
    name: "Checkbox Blocks",
    cadsName: "Checkbox",
  },
  {
    key: "2d0d2e869049a5a77b70dcf6813aa48737c1a911",
    name: "Radio Button",
    cadsName: "Radio Button + Label",
  },
  {
    key: "dc3161c47faf5241fa98a42e7c5ada717119f365",
    name: "Radio Buttons Blocks",
    cadsName: "Radio Buttons Block",
  },
  { key: "cb3807d24d76a019695d82bf799811edf15ff5f6", name: "Toggle", cadsName: "Toggle" },
  {
    key: "125d017876c50813f0359990eaaf45d1982ef739",
    name: "Toggle Building Block",
    cadsName: "Toggle",
  },
  {
    key: "2c50539a1e47e54eb7ab1474e6eeb085cca393c0",
    name: "Slider",
    cadsName: "Slider",
  },
  {
    key: "e425e8b498f0675603eaca40dcf39343fedcb62e",
    name: "Slider Bar",
    cadsName: "Slider Bar",
  },
  {
    key: "64b2b6fca4e117da33d3d88304783c529687df7e",
    name: "Slider Stepper",
    cadsName: "Slider Stepper",
  },

  // Selection / chips
  { key: "341373d642bfd3c0e0cbb35c1130b146945a2321", name: "Chip", cadsName: "Chip" },
  {
    key: "7aa7d44bba4b5dc76d69cc1d81c167cc03608832",
    name: "Chip Group",
    cadsName: "Chip Group",
  },
  { key: "8314a929103d75e027acd08445eb326299d24b74", name: "Link", cadsName: "Link" },
  { key: "6da8599310350b4a87b2a2f8e08d34ae3376a1d1", name: "Tag", cadsName: "Tag" },

  // Navigation
  {
    key: "1d12e71986a41db4dcc4e567b6923d7ed043abdd",
    name: "Breadcrumbs",
    cadsName: "Breadcrumbs",
  },
  {
    key: "1f49b8bd60a1d0351739d42dff1644522002ea00",
    name: "Breadcrumb Link",
    cadsName: "Breadcrumb Links",
  },
  {
    key: "d8b09d58c31343f8ad588e1edda6e650de6c423f",
    name: "Breadcrumbs Blocks",
    cadsName: "Breadcrumb Separators",
  },
  { key: "3046d24d897ea7a8fef82b9df239e2d2b7b45f7c", name: "Tab", cadsName: "Tab Item" },
  {
    key: "046a167c72e8ce57d1fb39e003531928d0309feb",
    name: "Tab Group",
    cadsName: "Tab Group",
  },
  {
    key: "a66d7f369b0b0440f0b73ba48f1dd56548d5aec1",
    name: "Pagination Dots",
    cadsName: "Pagination Dots",
  },
  {
    key: "b610aa8d09ccc8931662c7fba5cb0f734a3807f0",
    name: "Pagination Group",
    cadsName: "Pagination Group",
  },

  // Feedback / overlays
  { key: "3133f83a3f98b68c1f3081132b2e90bb5d1dc59a", name: "Alert", cadsName: "Alert" },
  { key: "949e2949033f60df26231b2f73985b488f9f78fe", name: "Toast", cadsName: "Toast" },
  {
    key: "64993adac217e2c6daab4eb131f94531d02e65a9",
    name: "Notification Banner",
    cadsName: "Notification Banner",
  },
  {
    key: "d9e848e2167cade785a34c19aff53552645fa03d",
    name: "Tooltip",
    cadsName: "Tooltip",
  },
  {
    key: "a1831764f91754253ef7a8e9581f7c3fbdc5227a",
    name: "Tooltip Icon",
    cadsName: "Icon Tooltip",
  },
  {
    key: "b26928dc5394b83a3f950653339218583b9cfccc",
    name: "Tooltip Tails",
    cadsName: null,
  },
  {
    key: "354d944bb976f7104bbcd34cf8a733aff3124964",
    name: "Popover",
    cadsName: "Popover",
  },
  {
    key: "a635748a7e91721d93fde00682cac982b8cc1742",
    name: "Popover Building Blocks",
    cadsName: "Popover Core",
  },
  {
    key: "402577f53a413426e8fbdb59d73a7750b64ddd79",
    name: "Drawer",
    cadsName: "Drawer",
  },
  {
    key: "6fd36a39efde8f927febe94b2d20a77cca842844",
    name: "Dialog",
    cadsName: "Dialog",
  },
  { key: "5978e70b44d30d937b300a136fd1e5c46a8a70c1", name: "Modal", cadsName: "Modal" },
  {
    key: "e6e3c0cfea5a588c0e936ab7dca00b3919c28a07",
    name: "Content Divider",
    cadsName: "Content Divider",
  },

  // Media
  { key: "8c94db45d91aaa619d204ea00fc8c72986182cfc", name: "Video", cadsName: "Video" },
  {
    key: "fa1a30885e3ac8a208c390bb1d0c79b2fef659d0",
    name: "Play Button",
    cadsName: "Play Button",
  },
  {
    key: "645a7bf0fba836e19dcdc0afbfd1f74bc0d85cf5",
    name: "Carousel",
    cadsName: "Carousel",
  },
  {
    key: "9e43cc3f8b484812e1265cf6bcaa3e4176965cdf",
    name: "Carousal Nav Buttons",
    cadsName: "Carousal Nav Buttons",
  },
  {
    key: "2606e5170df63663236d53010e2260932e3b9445",
    name: "Action Block",
    cadsName: "Action Block",
  },
  {
    key: "868d8d3e54e28e95ae284876db38d7271651be4f",
    name: "Action Block Group",
    cadsName: "Action Block Group",
  },
  {
    key: "f8f95d95f31825a834ca1a08ee78a10bbdfabee4",
    name: "Action Block Carousel",
    cadsName: "Action Block Carousel",
  },

  // Shell / layout
  {
    key: "284b25f1184ef019c06cc629e4fdaa38e75249f1",
    name: "Lab Nav",
    cadsName: "Lab Nav",
  },
  {
    key: "21391676db29a79461cdf45ec70bba6641772d5b",
    name: "Sidebar V2",
    cadsName: "Sidebar V2",
  },
  {
    key: "14b1e0b45ce2bf6a0dd67668e9960490605e62b9",
    name: "Sidebar Tab Item V2",
    cadsName: "Sidebar Tab Item V2",
  },
  {
    key: "36742e65b461a7717434e4d0589ecfb3158bd56c",
    name: "Sidebar Tab Group V2",
    cadsName: "Sidebar Tab Group V2",
  },
  {
    key: "f668e066487a10529ee420c65d14ea5ad4bd5eee",
    name: "Sidebar Control",
    cadsName: "Sidebar Control",
  },
  {
    key: "b15d0603786020456041d9dfc6ce5fbc1ea8a795",
    name: "File Manager V2",
    cadsName: "File Manager V2",
  },
  {
    key: "f228313a492b61b8a0809cee51776cdffe280dbe",
    name: "File Item",
    cadsName: "File Item",
  },
  {
    key: "bb9040fe00af46f8f26380c8bd789587209f92f5",
    name: "File Item Icons",
    cadsName: "File Item Icons",
  },
  {
    key: "6080fcf2f90e8cac1b083dc62ea7cb7a1cb747db",
    name: "File Tab Row Item",
    cadsName: "File Tab Row Item",
  },
  {
    key: "965f87360ad7d05dc3f3589361e40bb7cd11b5de",
    name: "Panel Header V2",
    cadsName: "Panel Header V2",
  },
  {
    key: "182556a60cdf5211857d30c94e575e35aa13aef7",
    name: "Panel Header Building Block",
    cadsName: "Panel Header Building Block",
  },
  {
    key: "cab3283affeb303907a9a172225e382b759f68dd",
    name: "Resize Handle",
    cadsName: "Resize Handle",
  },
  { key: "908f98448d94d05c5a172f575d47cf2398a2299f", name: "Logo", cadsName: null },

  // AI
  {
    key: "7dd35ac4dfa58413fcd9520dc8bf091b1cd617bf",
    name: "AI Tutor Chat Input",
    cadsName: "AI Tutor Chat Input",
  },
  {
    key: "1968b2a676cdb5194012c76a0290bd1e72410cb1",
    name: "AI Chat Messages",
    cadsName: "AI Chat Messages",
  },
  {
    key: "657aa0a29f7ad03f01ae4a21119471ca28714a8a",
    name: "AI Chat File Chip",
    cadsName: "AI Chat File Chip",
  },
  {
    key: "642b5ebddbdd848f3f0174950db780003a344040",
    name: "AI Chat File Chip",
    cadsName: "AI Chat File Chip",
  },
  {
    key: "fc8d56dba42d05aee6a8c1baf7f7ceab48caaaf9",
    name: "AI Shortcut Chip",
    cadsName: "AI Shortcut Chip",
  },
  {
    key: "4bd2e86e9492638295155f36675a8549e23f2547",
    name: "AI Support Indicator",
    cadsName: "AI Support Indicator",
  },
  {
    key: "fa8a60054807a87521a0207d968f29b4acb6db89",
    name: "AI File Chip Close Button",
    cadsName: "AI File Chip Close Button",
  },
  {
    key: "5cc57671aeafa2f61aec50f6a630297347b3a26f",
    name: "AI Chat File Item",
    cadsName: "AI Chat File Item",
  },
  { key: "b8baba99082dcb77c42cb4f599869b9471a5aab7", name: "AI Bot", cadsName: null },

  // Icons
  {
    key: "051a05d840dcf0a8220c056833c040fc581dff41",
    name: "Font Awesome Icon",
    cadsName: "Font Awesome Icon v7",
  },
  {
    key: "2073beaaf6394b66220e04a5588a35e08d66daf2",
    name: "Font Awesome Duotone Icon",
    cadsName: "Font Awesome Duotone Icon v7",
  },
];

export const dscoComponentKeys = new Set(dscoComponents.map((c) => c.key));

const cadsNameByNormalized = new Map(
  cadsComponents.map((component) => [
    component.name.trim().toLocaleLowerCase(),
    component.name,
  ]),
);

const cadsByDscoKey = new Map(
  dscoComponents
    .filter((entry) => entry.cadsName)
    .map((entry) => [entry.key, entry.cadsName as string]),
);

/** DSCO display-name rewrites when the published key isn't available. */
const DSCO_NAME_REWRITES: Record<string, string> = {
  "destructive button": "Button",
  "icon toggle button": "Icon Toggle",
  "icon toggle group": "Icon Toggle + Label",
  "text field": "Text Input",
  "text area": "Text Input",
  "dropdown field": "Dropdown",
  "input dropdown": "Dropdown",
  "action dropdown": "Dropdown",
  "dropdown menu button": "Dropdown Button",
  "dropdown menu items": "Dropdown Menu Item",
  checkbox: "Checkbox + Label",
  "checkbox blocks": "Checkbox",
  "checkbox blocks ": "Checkbox",
  "radio button": "Radio Button + Label",
  "radio buttons blocks": "Radio Buttons Block",
  "toggle building block": "Toggle",
  tab: "Tab Item",
  "breadcrumb link": "Breadcrumb Links",
  "breadcrumbs blocks": "Breadcrumb Separators",
  "tooltip icon": "Icon Tooltip",
  "popover building blocks": "Popover Core",
  "font awesome icon": "Font Awesome Icon v7",
  "font awesome duotone icon": "Font Awesome Duotone Icon v7",
};

function normalizeName(name: string): string {
  return name.trim().toLocaleLowerCase();
}

/**
 * Suggest a published CADS component for a non-CADS instance.
 * Returns null when there is no known successor.
 */
export function suggestCadsComponent(source: {
  key?: string;
  name: string;
}): string | null {
  if (source.key) {
    const byKey = cadsByDscoKey.get(source.key);
    if (byKey) return byKey;
    // Known DSCO key with explicit null successor.
    if (dscoComponentKeys.has(source.key)) return null;
  }

  const normalized = normalizeName(source.name);
  const rewrite = DSCO_NAME_REWRITES[normalized];
  if (rewrite) return rewrite;

  return cadsNameByNormalized.get(normalized) ?? null;
}

export function isDscoComponentKey(key: string): boolean {
  return dscoComponentKeys.has(key);
}
