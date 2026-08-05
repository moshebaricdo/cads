/**
 * Color usage surface helpers — split remaps by layer role so a primitive
 * used as text + fill does not share one target.
 */
import type { UsageRef } from "./messages";

export type ColorSurface = "background" | "text" | "border";

const SURFACE_SUFFIX = /^(.*)::(text|background|border)$/;

/** Role of a single paint/effect usage for semantic color targeting. */
export function colorSurfaceOfUsage(usage: UsageRef): ColorSurface {
  if (usage.prop.kind === "paint") {
    if (usage.prop.property === "strokes") return "border";
    if (usage.nodeType === "TEXT") return "text";
    return "background";
  }
  // Effects and other bindings → background bucket.
  return "background";
}

/** Majority surface across usages (same rules as historical inferColorSurface). */
export function inferColorSurface(usages: UsageRef[]): ColorSurface {
  let background = 0;
  let text = 0;
  let border = 0;
  for (const usage of usages) {
    const surface = colorSurfaceOfUsage(usage);
    if (surface === "border") border++;
    else if (surface === "text") text++;
    else background++;
  }
  if (text >= background && text >= border && text > 0) return "text";
  if (border >= background && border >= text && border > 0) return "border";
  return "background";
}

/** Map surface → indexes into the original usages array. */
export function splitUsageIndexesBySurface(
  usages: UsageRef[],
): Map<ColorSurface, number[]> {
  const map = new Map<ColorSurface, number[]>();
  for (let index = 0; index < usages.length; index++) {
    const surface = colorSurfaceOfUsage(usages[index]);
    const list = map.get(surface) ?? [];
    list.push(index);
    map.set(surface, list);
  }
  return map;
}

export function composeSurfaceSourceId(
  baseId: string,
  surface: ColorSurface,
): string {
  return `${baseId}::${surface}`;
}

export function parseSurfaceSourceId(sourceId: string): {
  baseId: string;
  surface: ColorSurface | null;
} {
  const match = sourceId.match(SURFACE_SUFFIX);
  if (!match) return { baseId: sourceId, surface: null };
  return { baseId: match[1], surface: match[2] as ColorSurface };
}

/** Semantic token name → surface prefix, when present. */
export function surfaceFromTokenName(name: string): ColorSurface | null {
  const n = name.trim().toLowerCase();
  if (n.startsWith("text/")) return "text";
  if (n.startsWith("border/")) return "border";
  if (n.startsWith("background/")) return "background";
  return null;
}

export function surfaceLabel(surface: ColorSurface): string {
  if (surface === "text") return "text";
  if (surface === "border") return "stroke";
  return "fill";
}
