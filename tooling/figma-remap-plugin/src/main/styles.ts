/**
 * Text-style support: capture the CADS library's styles (run inside the
 * library file), and build the target style catalog from baked metrics
 * (fast path) or by importing known keys (fallback).
 */
import type {
  CapturedStyleCatalog,
  TargetTextStyle,
} from "../shared/messages";
import { bakedTextStyles } from "../data/cadsTextStyles";

export function textStyleValues(style: TextStyle): Record<string, string> {
  const values: Record<string, string> = {
    family: style.fontName.family,
    weight: style.fontName.style,
    size: String(style.fontSize),
    textCase: style.textCase,
    textDecoration: style.textDecoration,
  };
  const lh = style.lineHeight;
  if (lh.unit === "PIXELS") values.lineHeight = `${lh.value}px`;
  else if (lh.unit === "PERCENT") values.lineHeight = `${Math.round(lh.value)}%`;
  else values.lineHeight = "auto";
  return values;
}

/** Run inside the library file: harvest its local text styles (names + keys + metrics). */
export async function captureLocalTextStyles(): Promise<CapturedStyleCatalog> {
  const styles = await figma.getLocalTextStylesAsync();
  if (styles.length === 0) {
    throw new Error(
      "This file has no local text styles. Open the CADS library file itself, then capture.",
    );
  }
  return {
    fileName: figma.root.name,
    capturedAt: new Date().toISOString(),
    styles: styles
      .map((style) => ({
        key: style.key,
        name: style.name,
        values: textStyleValues(style),
      }))
      .sort((a, b) => a.name.localeCompare(b.name)),
  };
}

export interface StyleCatalogResult {
  textStyles: TargetTextStyle[];
  importedByKey: Map<string, TextStyle>;
  source: "captured" | "baked" | "none";
}

type KnownStyle = {
  key: string;
  name: string;
  values?: Record<string, string>;
};

/**
 * Build the target text-style catalog.
 *
 * Fast path: when entries already carry font metrics (baked / captured), skip
 * importStyleByKeyAsync entirely — apply imports lazily on remap. Fallback:
 * import missing metrics by key (sequential, with progress yields).
 */
export async function buildStyleCatalog(
  captured: CapturedStyleCatalog | null,
  onProgress: (done: number, total: number) => void,
): Promise<StyleCatalogResult> {
  const source: StyleCatalogResult["source"] = captured
    ? "captured"
    : bakedTextStyles.length > 0
      ? "baked"
      : "none";
  const known: KnownStyle[] = captured?.styles ?? bakedTextStyles;
  const textStyles: TargetTextStyle[] = [];
  const importedByKey = new Map<string, TextStyle>();

  const withValues = known.filter(
    (entry): entry is KnownStyle & { values: Record<string, string> } =>
      Boolean(entry.values && Object.keys(entry.values).length > 0),
  );
  const needsImport = known.filter(
    (entry) => !(entry.values && Object.keys(entry.values).length > 0),
  );

  for (const entry of withValues) {
    textStyles.push({
      key: entry.key,
      name: entry.name,
      values: entry.values,
    });
  }

  if (needsImport.length === 0) {
    onProgress(known.length, known.length);
    return { textStyles, importedByKey, source };
  }

  let done = withValues.length;
  const total = known.length;
  onProgress(done, total);
  await new Promise((resolve) => setTimeout(resolve, 0));

  for (const entry of needsImport) {
    try {
      const style = (await figma.importStyleByKeyAsync(entry.key)) as TextStyle;
      if (style.type === "TEXT") {
        importedByKey.set(entry.key, style);
        textStyles.push({
          key: entry.key,
          name: style.name,
          values: textStyleValues(style),
        });
      }
    } catch {
      // Deleted/unpublished style — skip.
    }
    done++;
    if (done % 5 === 0 || done === total) {
      onProgress(done, total);
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }
  onProgress(total, total);
  // Keep ramp order when mixing baked + imported.
  textStyles.sort((a, b) => a.name.localeCompare(b.name));
  return { textStyles, importedByKey, source };
}
