import type { NestedPlaygroundTarget, PropSheet } from "./types";

const ALERT_PROP_SHEETS: PropSheet[] = [
  {
    title: "Props — Alert",
    props: [
      {
        name: "size",
        type: '"large" | "medium" | "small" | "extraSmall"',
        default: '"large"',
        description: "Control height and padding.",
      },
      {
        name: "sentiment",
        type: '"brand" | "pink" | "success" | "error" | "warning" | "info" | "neutral"',
        default: '"brand"',
        description: "Semantic color theme and default icon.",
      },
      {
        name: "children",
        type: "ReactNode",
        description: "Inline message body.",
      },
      {
        name: "iconName",
        type: "FaIconName | false",
        description:
          "Leading icon. Omit for sentiment default; false hides the icon; string overrides.",
      },
      {
        name: "hasAction",
        type: "boolean",
        default: "false",
        description: "Show outlined secondary action button.",
      },
      {
        name: "actionLabel",
        type: "ReactNode",
        default: '"Button"',
        description: "Action button label.",
      },
      {
        name: "actionStartIconName",
        type: "FaIconName",
        description: "Leading icon on the action button.",
      },
      {
        name: "actionEndIconName",
        type: "FaIconName",
        description: "Trailing icon on the action button.",
      },
      {
        name: "onAction",
        type: "() => void",
        description: "Action button click handler.",
      },
      {
        name: "isDismissible",
        type: "boolean",
        default: "false",
        description: "Show dismiss control.",
      },
      {
        name: "onClose",
        type: "() => void",
        description: "Dismiss handler.",
      },
      {
        name: "fullWidth",
        type: "boolean",
        default: "true",
        description: "Stretch to container width.",
      },
    ],
  },
];

const TOAST_PROP_SHEETS: PropSheet[] = [
  {
    title: "Props — Toast",
    props: [
      {
        name: "sentiment",
        type: '"primary" | "pink" | "success" | "error" | "warning" | "info" | "neutral"',
        default: '"primary"',
        description: "Semantic color theme. primary = brand chrome.",
      },
      {
        name: "children",
        type: "ReactNode",
        description: "Brief notification message.",
      },
      {
        name: "iconName",
        type: "FaIconName | false",
        description:
          "Leading icon. Omit for sentiment default; false hides the icon; string overrides.",
      },
      {
        name: "hasAction",
        type: "boolean",
        default: "false",
        description: "Show outlined secondary action button.",
      },
      {
        name: "actionLabel",
        type: "ReactNode",
        default: '"Button"',
        description: "Action button label.",
      },
      {
        name: "actionStartIconName",
        type: "FaIconName",
        description: "Leading icon on the action button.",
      },
      {
        name: "actionEndIconName",
        type: "FaIconName",
        description: "Trailing icon on the action button.",
      },
      {
        name: "onAction",
        type: "() => void",
        description: "Action button click handler.",
      },
      {
        name: "isDismissible",
        type: "boolean",
        default: "true",
        description: "Show dismiss control.",
      },
      {
        name: "onClose",
        type: "() => void",
        description: "Dismiss handler.",
      },
      {
        name: "open",
        type: "boolean",
        description:
          "Controlled visibility for the snackbar host. Omit for inline/fixture surface-only render.",
      },
      {
        name: "placement",
        type: '"topLeft" | "topCenter" | "topRight" | "bottomLeft" | "bottomCenter" | "bottomRight"',
        default: '"bottomCenter"',
        description:
          "Viewport corner/edge when hosted (MUI Snackbar anchorOrigin).",
      },
      {
        name: "offset",
        type: "number",
        default: "64",
        description: "Distance in px from the pinned viewport edge(s).",
      },
      {
        name: "surfaceOnly",
        type: "boolean",
        description:
          "Render elevated chrome without the snackbar portal. Default when open is omitted.",
      },
    ],
  },
];

const NOTIFICATION_BANNER_PROP_SHEETS: PropSheet[] = [
  {
    title: "Props — NotificationBanner",
    props: [
      {
        name: "sentiment",
        type: '"brand" | "pink" | "success" | "error" | "warning" | "info" | "neutral"',
        default: '"brand"',
        description: "Semantic color theme and default icon.",
      },
      {
        name: "fillStyle",
        type: '"none" | "color"',
        default: '"none"',
        description: "none = white surface; color = tinted fill.",
      },
      {
        name: "title",
        type: "ReactNode",
        required: true,
        description: "Banner headline.",
      },
      {
        name: "description",
        type: "ReactNode",
        required: true,
        description: "Supporting detail text.",
      },
      {
        name: "iconName",
        type: "FaIconName",
        description: "Override default sentiment icon.",
      },
      {
        name: "hasPrimaryAction",
        type: "boolean",
        default: "true",
        description: "Show primary action button.",
      },
      {
        name: "hasSecondaryAction",
        type: "boolean",
        default: "true",
        description: "Show secondary action button.",
      },
      {
        name: "primaryActionLabel",
        type: "ReactNode",
        default: '"Button"',
        description: "Primary action button label.",
      },
      {
        name: "secondaryActionLabel",
        type: "ReactNode",
        default: '"Button"',
        description: "Secondary action button label.",
      },
      {
        name: "onPrimaryAction",
        type: "() => void",
        description: "Primary action click handler.",
      },
      {
        name: "onSecondaryAction",
        type: "() => void",
        description: "Secondary action click handler.",
      },
      {
        name: "isDismissible",
        type: "boolean",
        default: "false",
        description: "Show dismiss control.",
      },
      {
        name: "onClose",
        type: "() => void",
        description: "Dismiss handler.",
      },
      {
        name: "fullWidth",
        type: "boolean",
        default: "true",
        description: "Stretch to container width.",
      },
    ],
  },
];

const TAG_PROP_SHEETS: PropSheet[] = [
  {
    title: "Props — Tag",
    props: [
      {
        name: "color",
        type: '"neutral" | "brand" | "pink" | "orange" | "success" | "error" | "warning" | "info"',
        default: '"neutral"',
        description: "Semantic badge color.",
      },
      {
        name: "size",
        type: '"large" | "medium" | "small"',
        default: '"large"',
        description: "Badge height and type scale.",
      },
      {
        name: "label",
        type: "ReactNode",
        description: "Badge text.",
      },
      {
        name: "startIconName",
        type: "FaIconName",
        description: "Leading FA icon. Omit for no start icon.",
      },
      {
        name: "endIconName",
        type: "FaIconName",
        description: "Trailing FA icon. Omit for no end icon.",
      },
      {
        name: "isDismissible",
        type: "boolean",
        default: "false",
        description: "Show remove control for filters.",
      },
      {
        name: "onClose",
        type: "() => void",
        description: "Dismiss handler.",
      },
    ],
  },
];

const ICON_TOOLTIP_PROP_SHEETS: PropSheet[] = [
  {
    title: "Props — IconTooltip",
    props: [
      {
        name: "title",
        type: "ReactNode",
        required: true,
        description: "Brief contextual text shown in the tooltip bubble.",
      },
      {
        name: "iconName",
        type: "FaIconName | string",
        default: '"circle-info"',
        description: "FA icon rendered as the trigger affordance.",
      },
      {
        name: "color",
        type: '"primary" | "secondary" | "tertiary"',
        default: '"tertiary"',
        description:
          "primary → brand; secondary → neutral-primary; tertiary → neutral-quaternary.",
      },
      {
        name: "size",
        type: '"large" | "medium" | "small" | "extraSmall"',
        default: '"medium"',
        description: "Glyph size on the shared control size scale.",
      },
      {
        name: "placement",
        type: '"bottom-start" | "bottom" | "bottom-end" | "top-start" | "top" | "top-end" | "left-start" | "left" | "left-end" | "right-start" | "right" | "right-end"',
        default: '"top"',
        description: "MUI placement, passed through to Tooltip.",
      },
      {
        name: "hasCaret",
        type: "boolean",
        default: "true",
        description: "Show the pointing caret.",
      },
      {
        name: "aria-label",
        type: "string",
        description:
          "Accessible trigger name. Falls back to title when title is a plain string.",
      },
    ],
  },
];

/** Prop sheets for Messaging section components. */
export const MESSAGING_PROP_SHEETS: Record<string, PropSheet[]> = {
  Alert: ALERT_PROP_SHEETS,
  Toast: TOAST_PROP_SHEETS,
  NotificationBanner: NOTIFICATION_BANNER_PROP_SHEETS,
  Tag: TAG_PROP_SHEETS,
  IconTooltip: ICON_TOOLTIP_PROP_SHEETS,
};

export const MESSAGING_NESTED_TARGETS: Record<
  string,
  NestedPlaygroundTarget[]
> = {};
