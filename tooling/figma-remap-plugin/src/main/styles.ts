/**
 * Text-style support: capture the CADS library's styles (run inside the
 * library file), and build the target style catalog by importing known keys.
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
  };
  const lh = style.lineHeight;
  if (lh.unit === "PIXELS") values.lineHeight = `${lh.value}px`;
  else if (lh.unit === "PERCENT") values.lineHeight = `${Math.round(lh.value)}%`;
  else values.lineHeight = "auto";
  return values;
}

/** Run inside the library file: harvest its local text styles (names + keys). */
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
      .map((style) => ({ key: style.key, name: style.name }))
      .sort((a, b) => a.name.localeCompare(b.name)),
  };
}

export interface StyleCatalogResult {
  textStyles: TargetTextStyle[];
  importedByKey: Map<string, TextStyle>;
  source: "captured" | "baked" | "none";
}

/**
 * Import every known style key (captured catalog wins over the baked one) to
 * validate it and read font properties for matching/display.
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
  const known = captured?.styles ?? bakedTextStyles;
  const textStyles: TargetTextStyle[] = [];
  const importedByKey = new Map<string, TextStyle>();
  let done = 0;
  onProgress(0, known.length);
  await new Promise((resolve) => setTimeout(resolve, 0));
  for (const entry of known) {
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
    if (done % 5 === 0 || done === known.length) {
      onProgress(done, known.length);
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }
  onProgress(known.length, known.length);
  return { textStyles, importedByKey, source };
}
