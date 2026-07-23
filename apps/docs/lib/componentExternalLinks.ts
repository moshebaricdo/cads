/**
 * External docs for each CADS component page:
 * - MUI API (underlying / closest Material UI surface for additional props)
 * - production Storybook (code-dot-org component library)
 */

export const STORYBOOK_BASE =
  "https://code-dot-org.github.io/code-dot-org/component-library-storybook";

export type ComponentExternalLinks = {
  /** Material UI API or component docs URL. */
  muiDocsUrl?: string;
  /** Storybook entry id, e.g. `designsystem-tooltip--docs`. */
  storybookId?: string;
};

export const COMPONENT_EXTERNAL_LINKS: Record<string, ComponentExternalLinks> =
  {
    Button: {
      muiDocsUrl: "https://mui.com/material-ui/api/button/",
      storybookId: "designsystem-button-button--docs",
    },
    CloseIconButton: {
      muiDocsUrl: "https://mui.com/material-ui/api/icon-button/",
      storybookId: "designsystem-closebutton--docs",
    },
    SegmentedButton: {
      muiDocsUrl: "https://mui.com/material-ui/api/toggle-button-group/",
      storybookId: "designsystem-segmented-buttons--docs",
    },
    IconToggle: {
      muiDocsUrl: "https://mui.com/material-ui/api/icon-button/",
      // No dedicated Storybook story yet.
    },
    FieldWrapper: {
      muiDocsUrl: "https://mui.com/material-ui/api/form-control/",
      storybookId: "designsystem-formfieldwrapper--docs",
    },
    TextInput: {
      muiDocsUrl: "https://mui.com/material-ui/api/text-field/",
      storybookId: "designsystem-textfield--docs",
    },
    Dropdown: {
      muiDocsUrl: "https://mui.com/material-ui/api/select/",
      storybookId: "designsystem-dropdown-simple-dropdown--docs",
    },
    Checkbox: {
      muiDocsUrl: "https://mui.com/material-ui/api/checkbox/",
      storybookId: "designsystem-checkbox--docs",
    },
    Radio: {
      muiDocsUrl: "https://mui.com/material-ui/api/radio/",
      storybookId: "designsystem-radio-button--docs",
    },
    Toggle: {
      muiDocsUrl: "https://mui.com/material-ui/api/switch/",
      storybookId: "designsystem-toggle--docs",
    },
    Slider: {
      muiDocsUrl: "https://mui.com/material-ui/api/slider/",
      storybookId: "designsystem-slider--docs",
    },
    Chip: {
      muiDocsUrl: "https://mui.com/material-ui/api/chip/",
      storybookId: "designsystem-chips--docs",
    },
    ChipGroup: {
      muiDocsUrl: "https://mui.com/material-ui/api/chip/",
      storybookId: "designsystem-chips--docs",
    },
    Alert: {
      muiDocsUrl: "https://mui.com/material-ui/api/alert/",
      storybookId: "designsystem-alert--docs",
    },
    Toast: {
      muiDocsUrl: "https://mui.com/material-ui/api/snackbar/",
      storybookId: "designsystem-toast--docs",
    },
    NotificationBanner: {
      muiDocsUrl: "https://mui.com/material-ui/api/alert/",
      storybookId: "designsystem-notificationbanner--docs",
    },
    Tag: {
      muiDocsUrl: "https://mui.com/material-ui/api/chip/",
      storybookId: "designsystem-tags--docs",
    },
    Link: {
      muiDocsUrl: "https://mui.com/material-ui/api/link/",
      storybookId: "designsystem-link--docs",
    },
    Breadcrumbs: {
      muiDocsUrl: "https://mui.com/material-ui/api/breadcrumbs/",
      storybookId: "designsystem-breadcrumbs--docs",
    },
    Tabs: {
      muiDocsUrl: "https://mui.com/material-ui/api/tabs/",
      storybookId: "designsystem-tabs--docs",
    },
    Tooltip: {
      muiDocsUrl: "https://mui.com/material-ui/api/tooltip/",
      storybookId: "designsystem-tooltip--docs",
    },
    Popover: {
      muiDocsUrl: "https://mui.com/material-ui/api/popover/",
      storybookId: "designsystem-popover--docs",
    },
    Drawer: {
      muiDocsUrl: "https://mui.com/material-ui/api/drawer/",
      // No dedicated Storybook story yet.
    },
    Dialog: {
      muiDocsUrl: "https://mui.com/material-ui/api/dialog/",
      storybookId: "designsystem-dialog-dialog--docs",
    },
    Modal: {
      muiDocsUrl: "https://mui.com/material-ui/api/dialog/",
      storybookId: "designsystem-modal--docs",
    },
  };

export function getComponentMuiDocsUrl(
  exportName: string,
): string | undefined {
  return COMPONENT_EXTERNAL_LINKS[exportName]?.muiDocsUrl;
}

export function getComponentStorybookUrl(
  exportName: string,
): string | undefined {
  const id = COMPONENT_EXTERNAL_LINKS[exportName]?.storybookId;
  if (!id) return undefined;
  return `${STORYBOOK_BASE}/?path=/docs/${id}`;
}
