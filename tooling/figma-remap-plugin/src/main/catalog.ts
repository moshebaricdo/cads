/**
 * Target catalog: enumerates the chosen source-of-truth library's variable
 * collections via figma.teamLibrary and imports each variable to read its
 * per-mode values (needed for value matching and swatches).
 */
import type { TargetCatalog, TargetVariable } from "../shared/messages";
import { getCollectionCached, resolveDisplayValues } from "./values";

export interface CatalogBuildResult {
  catalog: TargetCatalog;
  /** target key -> imported Variable (for rebinding at apply time) */
  importedByKey: Map<string, Variable>;
}

export async function buildCatalog(
  libraryName: string,
  onProgress: (done: number, total: number) => void,
): Promise<CatalogBuildResult> {
  const allCollections =
    await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
  const collections = allCollections.filter(
    (c) => c.libraryName === libraryName,
  );
  if (collections.length === 0) {
    throw new Error(
      `No variable collections found for library "${libraryName}". Make sure it is enabled in this file.`,
    );
  }

  const collectionVariables = await Promise.all(
    collections.map((c) =>
      figma.teamLibrary.getVariablesInLibraryCollectionAsync(c.key),
    ),
  );
  const total = collectionVariables.reduce((sum, v) => sum + v.length, 0);

  const variables: TargetVariable[] = [];
  const importedByKey = new Map<string, Variable>();
  const catalogCollections: TargetCatalog["collections"] = [];
  let done = 0;

  // Emit immediately so the UI never sits on a silent "Starting…" state while
  // the first imports are in flight.
  onProgress(0, total);
  await new Promise((resolve) => setTimeout(resolve, 0));

  for (let i = 0; i < collections.length; i++) {
    const collection = collections[i];
    let modes: string[] = [];
    for (const libVar of collectionVariables[i]) {
      try {
        const imported = await figma.variables.importVariableByKeyAsync(
          libVar.key,
        );
        importedByKey.set(libVar.key, imported);
        const importedCollection = await getCollectionCached(
          imported.variableCollectionId,
        );
        if (importedCollection && modes.length === 0) {
          modes = importedCollection.modes.map((m) => m.name);
        }
        variables.push({
          key: libVar.key,
          variableId: imported.id,
          name: imported.name,
          resolvedType: imported.resolvedType,
          collectionKey: collection.key,
          collectionName: collection.name,
          values: importedCollection
            ? await resolveDisplayValues(imported, importedCollection)
            : {},
        });
      } catch {
        // Unimportable variable (e.g. deleted after publish) — skip it.
      }
      done++;
      if (done % 5 === 0 || done === total) {
        onProgress(done, total);
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }
    catalogCollections.push({
      key: collection.key,
      name: collection.name,
      modes,
      variableCount: collectionVariables[i].length,
    });
  }
  onProgress(total, total);

  return {
    catalog: {
      libraryName,
      collections: catalogCollections,
      variables,
      // Text styles are merged in by code.ts from the style catalog.
      textStyles: [],
      textStyleSource: "none",
    },
    importedByKey,
  };
}
