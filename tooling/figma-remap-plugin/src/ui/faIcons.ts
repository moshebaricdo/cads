/**
 * Baked FA solid SVGs for the CADS Audit plugin UI.
 * Source files live in `./icons/*.svg` and are inlined as text by esbuild.
 */
import arrowLeftSvg from "./icons/arrow-left-solid-full.svg";
import arrowTurnDownRightSvg from "./icons/arrow-turn-down-right-solid-full.svg";
import arrowsFromDottedLineSvg from "./icons/arrows-from-dotted-line-solid-full.svg";
import arrowsToDottedLineSvg from "./icons/arrows-to-dotted-line-solid-full.svg";
import bezierCurveSvg from "./icons/bezier-curve-solid-full.svg";
import borderTopLeftSvg from "./icons/border-top-left-duotone-solid-full.svg";
import bullseyePointerSvg from "./icons/bullseye-pointer-solid-full.svg";
import caretDownSvg from "./icons/caret-down-solid-full.svg";
import caretUpSvg from "./icons/caret-up-solid-full.svg";
import crosshairsSvg from "./icons/crosshairs-solid-full.svg";
import diamonds4Svg from "./icons/diamonds-4-solid-full.svg";
import drawSquareSvg from "./icons/draw-square-solid-full.svg";
import fontSvg from "./icons/font-solid-full.svg";
import gearSvg from "./icons/gear-solid-full.svg";
import paletteSvg from "./icons/palette-solid-full.svg";
import rotateLeftSvg from "./icons/rotate-left-solid-full.svg";
import spinnerSvg from "./icons/spinner-solid-full.svg";
import squareSvg from "./icons/square-solid-full.svg";
import tableLayoutSvg from "./icons/table-layout-solid-full.svg";

export type IconName =
  | "arrow-left"
  | "arrow-turn-down-right"
  | "arrows-from-dotted-line"
  | "arrows-to-dotted-line"
  | "bezier-curve"
  | "border-top-left"
  | "bullseye-pointer"
  | "caret-down"
  | "caret-up"
  | "crosshairs"
  | "diamonds-4"
  | "draw-square"
  | "font"
  | "gear"
  | "palette"
  | "rotate-left"
  | "spinner"
  | "square"
  | "table-layout";

const RAW: Record<IconName, string> = {
  "arrow-left": arrowLeftSvg,
  "arrow-turn-down-right": arrowTurnDownRightSvg,
  "arrows-from-dotted-line": arrowsFromDottedLineSvg,
  "arrows-to-dotted-line": arrowsToDottedLineSvg,
  "bezier-curve": bezierCurveSvg,
  "border-top-left": borderTopLeftSvg,
  "bullseye-pointer": bullseyePointerSvg,
  "caret-down": caretDownSvg,
  "caret-up": caretUpSvg,
  crosshairs: crosshairsSvg,
  "diamonds-4": diamonds4Svg,
  "draw-square": drawSquareSvg,
  font: fontSvg,
  gear: gearSvg,
  palette: paletteSvg,
  "rotate-left": rotateLeftSvg,
  spinner: spinnerSvg,
  square: squareSvg,
  "table-layout": tableLayoutSvg,
};

/** Render a baked icon as an SVG string sized for the UI. */
export function icon(
  name: IconName,
  size = 14,
  className?: string,
): string {
  const raw = RAW[name];
  const classAttr = className ? ` class="${className}"` : "";
  // Keep the FA license comment inside the SVG (required for Free/Pro embeds).
  return raw
    .replace(
      /<svg\b([^>]*)>/,
      `<svg width="${size}" height="${size}" fill="currentColor" aria-hidden="true"${classAttr}$1>`,
    )
    .trim();
}
