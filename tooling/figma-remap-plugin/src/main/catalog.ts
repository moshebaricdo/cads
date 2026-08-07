/**
 * Target catalog: prefers the baked CADS variable catalog (instant). Falls
 * back to teamLibrary enumeration + parallel importVariableByKeyAsync, then
 * caches the result in clientStorage for subsequent opens.
 *
 * Inside the CADS source file itself (library does not “import” itself),
 * build from local variables instead — see `buildLocalCatalog`.
 */
import type { TargetCatalog, TargetVariable } from "../shared/messages";
import { CADS_FILE_KEY } from "../data/cadsTextStyles";
import {
  bakedVariableCollections,
  bakedVariables,
  bakedVariablesFetchedAt,
} from "../data/cadsVariables";
import {
  getCollectionCached,
  resolveDisplayValues,
  safeVariableCollectionId,
} from "./values";

export interface CatalogBuildResult {
  catalog: TargetCatalog;
  /** target key -> imported Variable (for rebinding at apply time) */
  importedByKey: Map<string, Variable>;
}

/** Matches audit.ts LOCAL_LIBRARY — SoT attribution for in-file variables. */
export const LOCAL_SOT_LIBRARY_NAME = "This file";

const CACHE_KEY = "cads-variable-catalog-v1";
const IMPORT_CONCURRENCY = 24;

/** True when the plugin is running in the CADS library source file. */
export function isCadsSourceFile(): boolean {
  return figma.fileKey === CADS_FILE_KEY;
}

type CachedCatalog = {
  fetchedAt: string | null;
  libraryName: string;
  signature: string;
  catalog: TargetCatalog;
};

async function mapPool<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let next = 0;
  async function worker(): Promise<void> {
    while (next < items.length) {
      const index = next++;
      results[index] = await fn(items[index], index);
    }
  }
  const workers = Array.from(
    { length: Math.min(concurrency, Math.max(items.length, 1)) },
    () => worker(),
  );
  await Promise.all(workers);
  return results;
}

function collectionSignature(
  collections: { key: string; variableCount: number }[],
): string {
  return collections
    .map((c) => `${c.key}:${c.variableCount}`)
    .sort()
    .join("|");
}

function fromBaked(libraryName: string): CatalogBuildResult | null {
  if (bakedVariables.length === 0 || bakedVariableCollections.length === 0) {
    return null;
  }
  return {
    catalog: {
      libraryName,
      collections: bakedVariableCollections,
      variables: bakedVariables.map((entry) => ({
        key: entry.key,
        variableId: "",
        name: entry.name,
        resolvedType: entry.resolvedType,
        collectionKey: entry.collectionKey,
        collectionName: entry.collectionName,
        values: entry.values,
      })),
      textStyles: [],
      textStyleSource: "none",
    },
    importedByKey: new Map(),
  };
}

async function readCache(
  libraryName: string,
  signature: string,
): Promise<CatalogBuildResult | null> {
  try {
    const cached = (await figma.clientStorage.getAsync(
      CACHE_KEY,
    )) as CachedCatalog | null;
    if (
      !cached ||
      cached.libraryName !== libraryName ||
      cached.signature !== signature ||
      !cached.catalog?.variables?.length
    ) {
      return null;
    }
    // Prefer a newer bake over a stale cache.
    if (
      bakedVariablesFetchedAt &&
      cached.fetchedAt &&
      cached.fetchedAt < bakedVariablesFetchedAt
    ) {
      return null;
    }
    return {
      catalog: {
        ...cached.catalog,
        textStyles: [],
        textStyleSource: "none",
      },
      importedByKey: new Map(),
    };
  } catch {
    return null;
  }
}

async function writeCache(
  libraryName: string,
  signature: string,
  catalog: TargetCatalog,
): Promise<void> {
  try {
    const payload: CachedCatalog = {
      fetchedAt: bakedVariablesFetchedAt,
      libraryName,
      signature,
      catalog: {
        ...catalog,
        textStyles: [],
        textStyleSource: "none",
      },
    };
    await figma.clientStorage.setAsync(CACHE_KEY, payload);
  } catch {
    // non-fatal
  }
}

async function importCatalog(
  libraryName: string,
  collections: LibraryVariableCollection[],
  collectionVariables: LibraryVariable[][],
  onProgress: (done: number, total: number) => void,
): Promise<CatalogBuildResult> {
  type Job = {
    libVar: LibraryVariable;
    collection: LibraryVariableCollection;
  };
  const jobs: Job[] = [];
  for (let i = 0; i < collections.length; i++) {
    for (const libVar of collectionVariables[i]) {
      jobs.push({ libVar, collection: collections[i] });
    }
  }

  const total = jobs.length;
  const variables: TargetVariable[] = [];
  const importedByKey = new Map<string, Variable>();
  const modesByCollectionKey = new Map<string, string[]>();
  let done = 0;

  onProgress(0, total);
  await new Promise((resolve) => setTimeout(resolve, 0));

  await mapPool(jobs, IMPORT_CONCURRENCY, async (job) => {
    try {
      const imported = await figma.variables.importVariableByKeyAsync(
        job.libVar.key,
      );
      importedByKey.set(job.libVar.key, imported);
      const collectionId = safeVariableCollectionId(imported);
      const importedCollection = collectionId
        ? await getCollectionCached(collectionId)
        : null;
      if (importedCollection && !modesByCollectionKey.has(job.collection.key)) {
        modesByCollectionKey.set(
          job.collection.key,
          importedCollection.modes.map((m) => m.name),
        );
      }
      variables.push({
        key: job.libVar.key,
        variableId: imported.id,
        name: imported.name,
        resolvedType: imported.resolvedType,
        collectionKey: job.collection.key,
        collectionName: job.collection.name,
        values: importedCollection
          ? await resolveDisplayValues(imported, importedCollection)
          : {},
      });
    } catch {
      // Unimportable variable (e.g. deleted after publish) — skip it.
    } finally {
      done++;
      if (done % IMPORT_CONCURRENCY === 0 || done === total) {
        onProgress(done, total);
      }
    }
  });

  onProgress(total, total);

  const catalogCollections: TargetCatalog["collections"] = collections.map(
    (collection, i) => ({
      key: collection.key,
      name: collection.name,
      modes: modesByCollectionKey.get(collection.key) ?? [],
      variableCount: collectionVariables[i].length,
    }),
  );

  return {
    catalog: {
      libraryName,
      collections: catalogCollections,
      variables,
      textStyles: [],
      textStyleSource: "none",
    },
    importedByKey,
  };
}

/**
 * Build the CADS catalog from local variables (CADS source file only).
 * A library file cannot enable itself via Assets → Libraries.
 */
export async function buildLocalCatalog(
  onProgress: (done: number, total: number) => void,
): Promise<CatalogBuildResult> {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const locals = await figma.variables.getLocalVariablesAsync();
  if (collections.length === 0) {
    throw new Error(
      "This CADS file has no local variable collections to audit against.",
    );
  }

  const collectionById = new Map(
    collections.map((collection) => [collection.id, collection]),
  );
  const countByCollectionId = new Map<string, number>();
  const variables: TargetVariable[] = [];
  const importedByKey = new Map<string, Variable>();
  const total = locals.length;
  let done = 0;

  onProgress(0, Math.max(total, 1));
  await new Promise((resolve) => setTimeout(resolve, 0));

  for (const variable of locals) {
    const collectionId = safeVariableCollectionId(variable);
    const collection = collectionId
      ? collectionById.get(collectionId) ?? null
      : null;
    if (!collection) {
      done++;
      continue;
    }
    countByCollectionId.set(
      collection.id,
      (countByCollectionId.get(collection.id) ?? 0) + 1,
    );
    importedByKey.set(variable.key, variable);
    variables.push({
      key: variable.key,
      variableId: variable.id,
      name: variable.name,
      resolvedType: variable.resolvedType,
      collectionKey: collection.key,
      collectionName: collection.name,
      values: await resolveDisplayValues(variable, collection),
    });
    done++;
    if (done % IMPORT_CONCURRENCY === 0 || done === total) {
      onProgress(done, total);
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }

  onProgress(total, total);

  return {
    catalog: {
      libraryName: LOCAL_SOT_LIBRARY_NAME,
      collections: collections.map((collection) => ({
        key: collection.key,
        name: collection.name,
        modes: collection.modes.map((mode) => mode.name),
        variableCount: countByCollectionId.get(collection.id) ?? 0,
      })),
      variables,
      textStyles: [],
      textStyleSource: "none",
    },
    importedByKey,
  };
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
  const signature = collectionSignature(
    collections.map((c, i) => ({
      key: c.key,
      variableCount: collectionVariables[i].length,
    })),
  );

  // Fast path: committed bake (same approach as text styles).
  const baked = fromBaked(libraryName);
  if (baked) {
    const bakedCount = baked.catalog.variables.length;
    const liveCount = collectionVariables.reduce((sum, v) => sum + v.length, 0);
    // Use bake when it covers the live library (or is close — publish lag).
    if (bakedCount > 0 && bakedCount >= liveCount * 0.9) {
      onProgress(bakedCount, bakedCount);
      return baked;
    }
  }

  const cached = await readCache(libraryName, signature);
  if (cached) {
    onProgress(
      cached.catalog.variables.length,
      cached.catalog.variables.length,
    );
    return cached;
  }

  const imported = await importCatalog(
    libraryName,
    collections,
    collectionVariables,
    onProgress,
  );
  await writeCache(libraryName, signature, imported.catalog);
  return imported;
}
