import {
  elevation,
  shape,
  spacing,
  zIndexLayers,
} from "@codeai/cads-variables";
import type { CSSProperties } from "react";
import { FoundationHeader } from "@/components/FoundationHeader";
import { ComponentPageNav } from "@/components/ComponentPageNav";
import pageStyles from "@/components/DocsTemplatePage.module.scss";
import ui from "@/components/docs-ui.module.scss";
import { docsMetadata } from "@/lib/docsMetadata";
import { adjacentFoundations } from "@/lib/nav";
import shared from "../FoundationPage.module.scss";
import local from "./spacing.module.scss";
import { CopyName } from "./CopyName";
import { ShapeExportButton } from "./ShapeExportButton";
import { ShapeSample } from "./ShapeSample";

const FIGMA_SHADOWS_URL =
  "https://www.figma.com/design/DGekOeToRVifvFAhfqpeC1/CodeAI-Design-System--CADS-?node-id=15817-32883";

const PROD_SHAPE_SPACING_URL =
  "https://github.com/code-dot-org/code-dot-org/blob/staging/frontend/packages/component-library-styles/shapeAndSpacingVariables.css";

const SHAPE_LEAD =
  "The CADS shape system is broken into four categories: border radius, elevation, spacing, and stacking. Radius handles corners, elevation handles depth, spacing is the shared ramp for layout gaps, and stacking is the overlay z-index ladder.";

export const metadata = docsMetadata("Shape", SHAPE_LEAD);

const RADII = Object.entries(shape).map(([name, value]) => {
  const token = `shape-${name.replace("radius", "").toLowerCase()}`;
  return {
    name,
    value,
    token,
    variable: `--${token}`,
  };
});

const SHADOWS = Object.entries(elevation).map(([name, value]) => {
  const token = `shadow-${name.replace("shadow", "").toLowerCase()}`;
  return {
    name,
    value,
    token,
    variable: `--${token}`,
  };
});

export default function ShapePage() {
  const { previous, next } = adjacentFoundations("/variables/spacing");

  return (
    <div className={pageStyles.page}>
      <FoundationHeader
        title="Shape"
        lead={SHAPE_LEAD}
        links={[
          { href: FIGMA_SHADOWS_URL, label: "Open in Figma", external: true },
          {
            href: PROD_SHAPE_SPACING_URL,
            label: "View in Github",
            external: true,
          },
        ]}
        action={<ShapeExportButton />}
      />

      <section className={shared.section} aria-labelledby="border-radius">
        <h2 id="border-radius" className={`${ui.h2} ${shared.sectionTitle}`}>
          Border radius
        </h2>
        <p className={`${ui.sectionDesc} ${shared.sectionBody}`}>
          Border radius is broken into five steps from sm to round. Use the
          smaller values on compact controls, the larger ones on cards and
          panels, and round for pills. When nesting rounded elements, step down
          the scale so the corners stay concentric.
        </p>
        <div className={shared.sectionContent}>
          <div className={shared.shapeGrid}>
            {RADII.map((radius) => (
              <div className={shared.shapeItem} key={radius.name}>
                <ShapeSample
                  className={local.radiusSample}
                  label={radius.variable}
                  copyValue={radius.variable}
                  style={
                    { "--sample-radius": radius.value } as CSSProperties
                  }
                />
                <div className={shared.rangeHeader}>
                  <span className={shared.rangeName}>{radius.token}</span>
                  <span className={shared.rangeCount}>{radius.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={shared.section} aria-labelledby="elevation">
        <h2 id="elevation" className={`${ui.h2} ${shared.sectionTitle}`}>
          Elevation
        </h2>
        <p className={`${ui.sectionDesc} ${shared.sectionBody}`}>
          Elevation is broken into three shadow levels: sm, md, and lg. Use sm
          for light lift on surfaces, md for menus and popovers, and lg when
          something needs to sit clearly above the page.
        </p>
        <div className={shared.sectionContent}>
          <div className={shared.shapeGrid}>
            {SHADOWS.map((shadow) => (
              <div className={shared.shapeItem} key={shadow.name}>
                <ShapeSample
                  className={local.shadowSample}
                  label={shadow.variable}
                  copyValue={shadow.variable}
                  style={
                    { "--sample-shadow": shadow.value } as CSSProperties
                  }
                />
                <div className={shared.shapeMeta}>
                  <span className={shared.rangeName}>{shadow.token}</span>
                  <CopyName
                    className={shared.copyValue}
                    copyValue={shadow.value}
                    placement="bottom-start"
                  >
                    {shadow.value.replace(/,\s*/g, ",\n")}
                  </CopyName>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={shared.section} aria-labelledby="spacing">
        <h2 id="spacing" className={`${ui.h2} ${shared.sectionTitle}`}>
          Spacing
        </h2>
        <p className={`${ui.sectionDesc} ${shared.sectionBody}`}>
          Spacing is an 8px-based ramp for gaps between sections and components.
          Prefer these over one-off values; component internals already handle
          their own spacing.
        </p>
        <div className={shared.sectionContent}>
          <div className={local.spacingStack}>
            {Object.entries(spacing).map(([name, value]) => {
              const token = `spacing-p-${name}`;
              const variable = `--${token}`;
              return (
                <div
                  className={local.spacingRow}
                  key={name}
                  style={{ "--sample-space": value } as CSSProperties}
                >
                  <div className={local.spacingLabel}>
                    <CopyName
                      className={`${shared.copyName} ${local.tightLine}`}
                      copyValue={variable}
                    >
                      {token}
                    </CopyName>
                    <span className={`${shared.rangeCount} ${local.tightLine}`}>{value}</span>
                  </div>
                  <ShapeSample
                    className={local.spacingSample}
                    label={variable}
                    copyValue={variable}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className={shared.section} aria-labelledby="stacking">
        <h2 id="stacking" className={`${ui.h2} ${shared.sectionTitle}`}>
          Stacking
        </h2>
        <p className={`${ui.sectionDesc} ${shared.sectionBody}`}>
          Stacking is a code-owned z-index ladder for portaled overlays — separate
          from elevation shadows. Menus and popovers share the modal layer so a
          Dropdown inside a Dialog or Popover paints above its host by mount
          order. Local in-component stacking (tabs, segmented controls) does not
          use these tokens.
        </p>
        <div className={shared.sectionContent}>
          <div className={ui.tableWrap}>
            <table className={`${ui.table} ${shared.table}`}>
              <thead>
                <tr>
                  <th scope="col">Variable</th>
                  <th scope="col">Value</th>
                  <th scope="col">Use</th>
                </tr>
              </thead>
              <tbody>
                {zIndexLayers.map((layer) => (
                  <tr key={layer.key}>
                    <td>
                      <CopyName
                        className={shared.copyName}
                        copyValue={layer.variable}
                      >
                        {layer.variable}
                      </CopyName>
                    </td>
                    <td>{layer.value}</td>
                    <td>{layer.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <ComponentPageNav
        previous={previous}
        next={next}
        aria-label="Foundation pagination"
      />
    </div>
  );
}
