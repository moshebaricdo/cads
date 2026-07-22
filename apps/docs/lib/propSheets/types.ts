import type {
  CadsComponentManifest,
  CadsPropDef,
} from "@codeai/cads-react/manifest";

export type PropSheet = {
  title: string;
  props: CadsPropDef[];
};

/** Nested playground targets that can replace the top-level props panel. */
export type NestedPlaygroundTarget = {
  id: string;
  label: string;
  props: CadsPropDef[];
};

/** Fallback single sheet from the manifest when no custom sheets exist. */
export function defaultPropSheets(
  component: CadsComponentManifest,
): PropSheet[] {
  return [
    {
      title: `Props — ${component.name}`,
      props: component.props,
    },
  ];
}
