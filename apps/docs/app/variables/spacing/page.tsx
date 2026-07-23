import { elevation, shape, spacing } from "@codeai/cads-variables";
import type { CSSProperties } from "react";
import { FoundationHeader } from "@/components/FoundationHeader";
import { ComponentPageNav } from "@/components/ComponentPageNav";
import pageStyles from "@/components/DocsTemplatePage.module.css";
import { adjacentFoundations } from "@/lib/nav";
import styles from "../FoundationPage.module.css";
import { CopyName } from "./CopyName";
import { ShapeSample } from "./ShapeSample";

const RADII = Object.entries(shape).map(([name, value]) => {
  const token = `radius-${name.replace("radius", "").toLowerCase()}`;
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
        lead="The CADS shape system is broken into three categories: border radius, elevation, and spacing. Radius handles corners, elevation handles depth, and spacing is the shared ramp for layout gaps."
      />

      <section className={styles.section} aria-labelledby="border-radius">
        <h2 id="border-radius" className={`docs-h2 ${styles.sectionTitle}`}>
          Border radius
        </h2>
        <p className={`docs-section-desc ${styles.sectionBody}`}>
          Border radius is broken into five steps from sm to round. Use the
          smaller values on compact controls, the larger ones on cards and
          panels, and round for pills. When nesting rounded elements, step down
          the scale so the corners stay concentric.
        </p>
        <div className={styles.sectionContent}>
          <div className={styles.shapeGrid}>
            {RADII.map((radius) => (
              <div className={styles.shapeItem} key={radius.name}>
                <ShapeSample
                  className={styles.radiusSample}
                  label={radius.variable}
                  copyValue={radius.variable}
                  style={
                    { "--sample-radius": radius.value } as CSSProperties
                  }
                />
                <div className={styles.rangeHeader}>
                  <span className={styles.rangeName}>{radius.token}</span>
                  <span className={styles.rangeCount}>{radius.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="elevation">
        <h2 id="elevation" className={`docs-h2 ${styles.sectionTitle}`}>
          Elevation
        </h2>
        <p className={`docs-section-desc ${styles.sectionBody}`}>
          Elevation is broken into three shadow levels: sm, md, and lg. Use sm
          for light lift on surfaces, md for menus and popovers, and lg when
          something needs to sit clearly above the page.
        </p>
        <div className={styles.sectionContent}>
          <div className={styles.shapeGrid}>
            {SHADOWS.map((shadow) => (
              <div className={styles.shapeItem} key={shadow.name}>
                <ShapeSample
                  className={styles.shadowSample}
                  label={shadow.variable}
                  copyValue={shadow.variable}
                  style={
                    { "--sample-shadow": shadow.value } as CSSProperties
                  }
                />
                <div className={styles.shapeMeta}>
                  <span className={styles.rangeName}>{shadow.token}</span>
                  <CopyName
                    className={styles.copyValue}
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

      <section className={styles.section} aria-labelledby="spacing">
        <h2 id="spacing" className={`docs-h2 ${styles.sectionTitle}`}>
          Spacing
        </h2>
        <p className={`docs-section-desc ${styles.sectionBody}`}>
          Spacing is an 8px-based ramp for gaps between sections and components.
          Prefer these over one-off values; component internals already handle
          their own spacing.
        </p>
        <div className={styles.sectionContent}>
          <div className={styles.spacingStack}>
            {Object.entries(spacing).map(([name, value]) => {
              const token = `space-${name}`;
              const variable = `--${token}`;
              return (
                <div
                  className={styles.spacingRow}
                  key={name}
                  style={{ "--sample-space": value } as CSSProperties}
                >
                  <div className={styles.spacingLabel}>
                    <CopyName
                      className={styles.copyName}
                      copyValue={variable}
                    >
                      {token}
                    </CopyName>
                    <span className={styles.rangeCount}>{value}</span>
                  </div>
                  <ShapeSample
                    className={styles.spacingSample}
                    label={variable}
                    copyValue={variable}
                  />
                </div>
              );
            })}
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
