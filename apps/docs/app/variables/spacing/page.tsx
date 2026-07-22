import { elevation, shape, spacing } from "@codeai/cads-variables";
import type { CSSProperties } from "react";
import { VarChip } from "@/components/docs-ui";
import { FoundationHeader } from "@/components/FoundationHeader";
import pageStyles from "@/components/DocsTemplatePage.module.css";
import styles from "../FoundationPage.module.css";

const RADII = Object.entries(shape).map(([name, value]) => ({
  name,
  value,
  variable: `--radius-${name.replace("radius", "").toLowerCase()}`,
}));

const SHADOWS = Object.entries(elevation).map(([name, value]) => ({
  name,
  value,
  variable: `--shadow-${name.replace("shadow", "").toLowerCase()}`,
}));

export default function ShapePage() {
  return (
    <div className={pageStyles.page}>
      <FoundationHeader
        title="Shape"
        lead="Corner radii and elevation define the silhouette and depth of CADS surfaces. The spacing ramp is available for larger layout rhythm."
      />

      <section className={styles.section} aria-labelledby="border-radius">
        <h2 id="border-radius" className={`docs-h2 ${styles.sectionTitle}`}>
          Border radius
        </h2>
        <p className={`docs-section-desc ${styles.sectionBody}`}>
          Use smaller radii for compact controls, larger radii for surfaces, and
          round for pills or circular controls.
        </p>
        <div className={`${styles.surface} ${styles.shapeGrid}`}>
          {RADII.map((radius) => (
            <div className={styles.shapeItem} key={radius.name}>
              <div
                className={styles.radiusSample}
                role="img"
                aria-label={`${radius.value} radius preview`}
                style={
                  { "--sample-radius": radius.value } as CSSProperties
                }
              />
              <VarChip name={radius.variable} />
              <span className={styles.itemValue}>{radius.value}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="elevation">
        <h2 id="elevation" className={`docs-h2 ${styles.sectionTitle}`}>
          Elevation
        </h2>
        <p className={`docs-section-desc ${styles.sectionBody}`}>
          Three shadow levels communicate depth without changing a surface&apos;s
          shape. Use stronger elevation only as content moves closer to the
          user.
        </p>
        <div className={`${styles.surface} ${styles.shapeGrid}`}>
          {SHADOWS.map((shadow) => (
            <div className={styles.shapeItem} key={shadow.name}>
              <div
                className={styles.shadowSample}
                role="img"
                aria-label={`${shadow.name} shadow preview`}
                style={
                  { "--sample-shadow": shadow.value } as CSSProperties
                }
              />
              <VarChip name={shadow.variable} />
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="spacing">
        <h2 id="spacing" className={`docs-h2 ${styles.sectionTitle}`}>
          Spacing
        </h2>
        <p className={`docs-section-desc ${styles.sectionBody}`}>
          An 8px-based ramp for page layout and larger composition gaps.
          Component internals should use their documented construction rather
          than ad hoc spacing.
        </p>
        <div className={`${styles.surface} ${styles.spacingList}`}>
          {Object.entries(spacing).map(([name, value]) => (
            <div className={styles.spacingRow} key={name}>
              <VarChip name={`--space-${name}`} />
              <div
                className={styles.spacingBar}
                style={{ "--sample-space": value } as CSSProperties}
              />
              <span className={styles.itemValue}>{value}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
