import { ACTIONS_NESTED_TARGETS, ACTIONS_PROP_SHEETS } from "./actions";
import { INPUTS_NESTED_TARGETS, INPUTS_PROP_SHEETS } from "./inputs";
import {
  MESSAGING_NESTED_TARGETS,
  MESSAGING_PROP_SHEETS,
} from "./messaging";
import {
  NAVIGATION_NESTED_TARGETS,
  NAVIGATION_PROP_SHEETS,
} from "./navigation";
import { OVERLAYS_NESTED_TARGETS, OVERLAYS_PROP_SHEETS } from "./overlays";
import type { NestedPlaygroundTarget, PropSheet } from "./types";

export type { NestedPlaygroundTarget, PropSheet } from "./types";
export { defaultPropSheets } from "./types";

/** Building-block prop sheets for components that compose nested parts. */
export const COMPONENT_PROP_SHEETS: Record<string, PropSheet[]> = {
  ...ACTIONS_PROP_SHEETS,
  ...INPUTS_PROP_SHEETS,
  ...NAVIGATION_PROP_SHEETS,
  ...MESSAGING_PROP_SHEETS,
  ...OVERLAYS_PROP_SHEETS,
};

export const NESTED_PLAYGROUND_TARGETS: Record<
  string,
  NestedPlaygroundTarget[]
> = {
  ...ACTIONS_NESTED_TARGETS,
  ...INPUTS_NESTED_TARGETS,
  ...NAVIGATION_NESTED_TARGETS,
  ...MESSAGING_NESTED_TARGETS,
  ...OVERLAYS_NESTED_TARGETS,
};
