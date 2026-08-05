/**
 * Baked CADS variable catalog (keys + resolved mode values).
 *
 * When populated, plugin startup skips importVariableByKeyAsync for every
 * variable — apply still imports lazily when remapping. Refresh via Figma MCP
 * harvest from the open CADS file (see README).
 *
 * Empty on purpose until a full harvest is committed; catalog.ts falls back to
 * parallel import + clientStorage cache.
 */
export interface BakedVariable {
  key: string;
  name: string;
  resolvedType: "COLOR" | "FLOAT" | "STRING" | "BOOLEAN";
  collectionKey: string;
  collectionName: string;
  values: Record<string, string>;
}

export interface BakedVariableCollection {
  key: string;
  name: string;
  modes: string[];
  variableCount: number;
}

export const bakedVariablesFetchedAt: string | null = null;

export const bakedVariableCollections: BakedVariableCollection[] = [];

export const bakedVariables: BakedVariable[] = [];
