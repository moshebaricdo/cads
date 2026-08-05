/**
 * Variable value resolution helpers (main thread).
 * Aliases are followed by mode-name affinity: when a variable aliases another
 * collection, we prefer the mode with the same name, falling back to the
 * aliased collection's first mode. Good enough for display + value matching.
 */

export function rgbaToHex(value: RGB | RGBA): string {
  const to2 = (n: number) =>
    Math.round(Math.max(0, Math.min(1, n)) * 255)
      .toString(16)
      .padStart(2, "0");
  const base = `#${to2(value.r)}${to2(value.g)}${to2(value.b)}`;
  const a = "a" in value ? (value as RGBA).a : 1;
  return a >= 1 ? base : `${base}${to2(a)}`;
}

function isAlias(value: VariableValue): value is VariableAlias {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    (value as VariableAlias).type === "VARIABLE_ALIAS"
  );
}

function isColor(value: VariableValue): value is RGB | RGBA {
  return (
    typeof value === "object" && value !== null && "r" in value && "g" in value
  );
}

const variableCache = new Map<string, Variable | null>();
const collectionCache = new Map<string, VariableCollection | null>();

export async function getVariableCached(id: string): Promise<Variable | null> {
  if (!variableCache.has(id)) {
    try {
      variableCache.set(id, await figma.variables.getVariableByIdAsync(id));
    } catch {
      variableCache.set(id, null);
    }
  }
  return variableCache.get(id) ?? null;
}

export async function getCollectionCached(
  id: string,
): Promise<VariableCollection | null> {
  if (!collectionCache.has(id)) {
    try {
      collectionCache.set(
        id,
        await figma.variables.getVariableCollectionByIdAsync(id),
      );
    } catch {
      collectionCache.set(id, null);
    }
  }
  return collectionCache.get(id) ?? null;
}

async function resolveRaw(
  variable: Variable,
  modeId: string,
  modeName: string,
  depth: number,
): Promise<VariableValue | null> {
  if (depth > 8) return null;
  const value = variable.valuesByMode[modeId];
  if (value === undefined) return null;
  if (!isAlias(value)) return value;

  const target = await getVariableCached(value.id);
  if (!target) return null;
  const targetCollection = await getCollectionCached(target.variableCollectionId);
  if (!targetCollection) return null;
  const preferred =
    targetCollection.modes.find(
      (m) => m.name.toLowerCase() === modeName.toLowerCase(),
    ) ?? targetCollection.modes[0];
  if (!preferred) return null;
  return resolveRaw(target, preferred.modeId, preferred.name, depth + 1);
}

/** Resolve a variable's value per mode into display strings (hex for colors). */
export async function resolveDisplayValues(
  variable: Variable,
  collection: VariableCollection,
): Promise<Record<string, string>> {
  const out: Record<string, string> = {};
  for (const mode of collection.modes) {
    const value = await resolveRaw(variable, mode.modeId, mode.name, 0);
    if (value === null) continue;
    if (isColor(value)) out[mode.name] = rgbaToHex(value);
    else out[mode.name] = String(value);
  }
  return out;
}
