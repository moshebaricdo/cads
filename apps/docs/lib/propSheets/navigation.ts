import type { NestedPlaygroundTarget, PropSheet } from "./types";

const BREADCRUMB_ITEM_PROPS: PropSheet["props"] = [
  {
    name: "label",
    type: "ReactNode",
    required: true,
    description: "Crumb text or content.",
  },
  {
    name: "href",
    type: "string",
    description: "Link destination; omit when current.",
  },
  {
    name: "iconName",
    type: "FaIconName",
    description: "Optional leading icon on any crumb.",
  },
  {
    name: "iconOnly",
    type: "boolean",
    description: "Hide label visually; keep accessible name.",
  },
  {
    name: "current",
    type: "boolean",
    description: "Current page — rendered as text, not a link.",
  },
  {
    name: "disabled",
    type: "boolean",
    description: "Disables this crumb.",
  },
  {
    name: "key",
    type: "string",
    description: "Stable React key override.",
  },
  {
    name: "onClick",
    type: "(event) => void",
    description: "Click handler when href is omitted.",
  },
];

const TAB_ITEM_PROPS: PropSheet["props"] = [
  {
    name: "value",
    type: "string",
    required: true,
    description: "Unique tab identifier.",
  },
  {
    name: "label",
    type: "ReactNode",
    required: true,
    description: "Tab label text.",
  },
  {
    name: "startIconName",
    type: "FaIconName",
    description: "Leading icon.",
  },
  {
    name: "endIconName",
    type: "FaIconName",
    description: "Trailing icon.",
  },
  {
    name: "iconOnly",
    type: "boolean",
    description: "Hide label visually; requires aria-label.",
  },
  {
    name: "dismissible",
    type: "boolean",
    description: "Show close control on this tab.",
  },
  {
    name: "disabled",
    type: "boolean",
    description: "Disables this tab.",
  },
  {
    name: "aria-label",
    type: "string",
    description: "Required when iconOnly is true.",
  },
];

/** Prop sheets for Navigation section components. */
export const NAVIGATION_PROP_SHEETS: Record<string, PropSheet[]> = {
  Link: [
    {
      title: "Props — Link",
      props: [
        {
          name: "size",
          type: '"large" | "medium" | "small" | "extraSmall" | "extraExtraSmall"',
          default: '"medium"',
          description: "extraExtraSmall is Link-only (body/xxs).",
        },
        {
          name: "type",
          type: '"primary" | "secondary"',
          default: '"primary"',
          description:
            "Figma type axis — primary uses brand text; secondary uses neutral.",
        },
        {
          name: "isExternal",
          type: "boolean",
          default: "true",
          description: "Shows up-right-from-square end icon.",
        },
        {
          name: "href",
          type: "string",
          description: "Destination URL.",
        },
        {
          name: "disabled",
          type: "boolean",
          description: "Disables interaction.",
        },
        {
          name: "children",
          type: "ReactNode",
          required: true,
          description: "Link label text.",
        },
      ],
    },
  ],
  Breadcrumbs: [
    {
      title: "Props — Breadcrumbs",
      props: [
        {
          name: "size",
          type: '"large" | "medium" | "small" | "extraSmall"',
          default: '"medium"',
          description: "Control height. Default medium (40).",
        },
        {
          name: "items",
          type: "BreadcrumbItem[]",
          required: true,
          description:
            "Trail items. Optional per-item iconName, iconOnly, current, href/onClick.",
        },
        {
          name: "maxItems",
          type: "number",
          default: "8",
          description:
            "Collapse middle into overflow ellipsis when exceeded.",
        },
        {
          name: "itemsBeforeCollapse",
          type: "number",
          default: "1",
          description: "Crumb count kept before the overflow ellipsis.",
        },
        {
          name: "itemsAfterCollapse",
          type: "number",
          default: "1",
          description: "Crumb count kept after the overflow ellipsis.",
        },
        {
          name: "expandText",
          type: "string",
          default: '"Show path"',
          description: "Accessible name for the overflow trigger.",
        },
        {
          name: "aria-label",
          type: "string",
          default: '"Breadcrumb"',
          description: "Accessible name for the trail.",
        },
      ],
    },
    {
      title: "Props — Breadcrumb Item",
      props: BREADCRUMB_ITEM_PROPS,
    },
  ],
  Tabs: [
    {
      title: "Props — Tabs",
      props: [
        {
          name: "type",
          type: '"primary" | "secondary"',
          default: '"primary"',
          description: "primary = underline; secondary = contained.",
        },
        {
          name: "size",
          type: '"large" | "medium" | "small" | "extraSmall"',
          default: '"medium"',
          description: "Control height. Default medium (40).",
        },
        {
          name: "items",
          type: "TabsItem[]",
          required: true,
          description: "Tab definitions passed to the group.",
        },
        {
          name: "value",
          type: "string",
          description: "Controlled selected tab value.",
        },
        {
          name: "defaultValue",
          type: "string",
          description: "Initial selected tab (uncontrolled).",
        },
        {
          name: "onChange",
          type: "(value: string) => void",
          description: "Called when selection changes.",
        },
        {
          name: "onItemDismiss",
          type: "(value: string) => void",
          description: "Called when a dismissible tab is closed.",
        },
        {
          name: "aria-label",
          type: "string",
          description: "Accessible name for the tablist.",
        },
      ],
    },
    {
      title: "Props — Tab Item",
      props: TAB_ITEM_PROPS,
    },
  ],
  Pagination: [
    {
      title: "Props — Pagination",
      muiDocsUrl: "https://mui.com/material-ui/api/pagination/",
      props: [
        {
          name: "size",
          type: '"large" | "medium" | "small" | "extraSmall"',
          default: '"medium"',
          description: "Control height. Default medium (40).",
        },
        {
          name: "count",
          type: "number",
          required: true,
          description: "Total number of pages.",
        },
        {
          name: "page",
          type: "number",
          description: "1-based current page (controlled).",
        },
        {
          name: "defaultPage",
          type: "number",
          description: "Initial page when uncontrolled.",
        },
        {
          name: "onChange",
          type: "(event, page: number) => void",
          description: "Called when the page changes.",
        },
        {
          name: "layout",
          type: '"auto" | "segmented" | "compact"',
          default: '"auto"',
          description:
            "Narrow-container behavior. auto swaps to compact (prev + Page X of Y + next) when the segmented trail would overflow.",
        },
        {
          name: "labelCompactPages",
          type: "(args: { page: number; count: number }) => ReactNode",
          description: 'Formats the compact-mode label. Default "Page X of Y".',
        },
        {
          name: "showFirstButton",
          type: "boolean",
          default: "true",
          description: "Show jump-to-first (Figma hasFirstLast).",
        },
        {
          name: "showLastButton",
          type: "boolean",
          default: "true",
          description: "Show jump-to-last (Figma hasFirstLast).",
        },
        {
          name: "siblingCount",
          type: "number",
          default: "1",
          description: "Pages shown on each side of the current page.",
        },
        {
          name: "boundaryCount",
          type: "number",
          default: "1",
          description: "Pages always shown at the start and end.",
        },
        {
          name: "disabled",
          type: "boolean",
          description: "Disables all items.",
        },
        {
          name: "aria-label",
          type: "string",
          description: "Accessible name for the pagination navigation.",
        },
      ],
    },
    {
      title: "Props — TablePagination",
      muiDocsUrl: "https://mui.com/material-ui/api/table-pagination/",
      props: [
        {
          name: "size",
          type: '"large" | "medium" | "small" | "extraSmall"',
          default: '"medium"',
          description: "Control height. Default medium (40).",
        },
        {
          name: "count",
          type: "number",
          required: true,
          description: "Total number of rows.",
        },
        {
          name: "page",
          type: "number",
          required: true,
          description: "0-based page index (MUI TablePagination).",
        },
        {
          name: "rowsPerPage",
          type: "number",
          required: true,
          description: "Rows shown per page.",
        },
        {
          name: "onPageChange",
          type: "(event, newPage: number) => void",
          required: true,
          description: "Called when prev/next changes the page.",
        },
        {
          name: "onRowsPerPageChange",
          type: "(event) => void",
          description: "Called when the rows-per-page Dropdown changes.",
        },
        {
          name: "rowsPerPageOptions",
          type: "Array<number | { value: number; label: string }>",
          default: "[10, 25, 50, 100]",
          description: "Options for the rows-per-page Dropdown.",
        },
        {
          name: "labelRowsPerPage",
          type: "ReactNode",
          default: '"Rows per page"',
          description: "Label before the rows-per-page control.",
        },
        {
          name: "labelDisplayedRows",
          type: "(args) => ReactNode",
          description: "Formats the range text (from-to of count).",
        },
        {
          name: "disabled",
          type: "boolean",
          description: "Disables controls.",
        },
        {
          name: "aria-label",
          type: "string",
          description: "Accessible name for the table pagination region.",
        },
      ],
    },
  ],
};

export const NAVIGATION_NESTED_TARGETS: Record<
  string,
  NestedPlaygroundTarget[]
> = {
  Breadcrumbs: [
    {
      id: "breadcrumbItem",
      label: "Breadcrumb Item",
      props: BREADCRUMB_ITEM_PROPS,
    },
  ],
  Tabs: [
    {
      id: "tabItem",
      label: "Tab Item",
      props: TAB_ITEM_PROPS,
    },
  ],
};
