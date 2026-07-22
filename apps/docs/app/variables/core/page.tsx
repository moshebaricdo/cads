import { motion } from "@codeai/cads-variables";
import type { CSSProperties } from "react";
import { VarChip } from "@/components/docs-ui";
import { FoundationHeader } from "@/components/FoundationHeader";
import pageStyles from "@/components/DocsTemplatePage.module.css";
import styles from "../FoundationPage.module.css";

const DURATIONS = [
  {
    varName: "--duration-instant",
    value: motion.durationInstant,
    usage: "State changes that must feel immediate (focus rings)",
  },
  {
    varName: "--duration-short",
    value: motion.durationShort,
    usage: "Hover / press fills, borders, most control chrome",
  },
  {
    varName: "--duration-medium",
    value: motion.durationMedium,
    usage: "Larger surface transitions (menus, panels)",
  },
];

const EASINGS = [
  {
    varName: "--easing-standard",
    value: motion.easingStandard,
    usage: "Default for color / opacity / transform transitions",
  },
  {
    varName: "--easing-emphasized",
    value: motion.easingEmphasized,
    usage: "Entrances and attention-drawing movement",
  },
];

export default function MotionPage() {
  return (
    <div className={pageStyles.page}>
      <FoundationHeader
        title="Motion"
        lead="CADS motion is an experimental effort to standardize how interface changes feel across the design system. The current set is intentionally small while we learn which patterns should become shared conventions."
      />

      <section className={styles.section} aria-labelledby="durations">
        <h2 id="durations" className={`docs-h2 ${styles.sectionTitle}`}>
          Durations
        </h2>
        <p className={`docs-section-desc ${styles.sectionBody}`}>
          Use the shortest duration that clearly communicates the change. Motion
          should support orientation and feedback, never delay interaction.
        </p>
        <div className={`${styles.surface} ${styles.motionDemo}`}>
          {DURATIONS.map((duration) => (
            <div className={styles.motionItem} key={duration.varName}>
              <div className={styles.motionTrack}>
                <div
                  className={styles.motionDot}
                  style={
                    {
                      "--demo-duration": duration.value,
                    } as CSSProperties
                  }
                />
              </div>
              <div>
                <VarChip name={duration.varName} />
              </div>
              <span className={styles.itemValue}>
                {duration.value} · {duration.usage}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="reference">
        <h2 id="reference" className={`docs-h2 ${styles.sectionTitle}`}>
          Reference
        </h2>
        <p className={`docs-section-desc ${styles.sectionBody}`}>
          These variables are a starting point for consistent state changes and
          entrances. They are not yet a complete choreography system.
        </p>
        <div className={`docs-table-wrap ${styles.table}`}>
          <table className="docs-table">
            <thead>
              <tr>
                <th>Variable</th>
                <th>Value</th>
                <th>Usage</th>
              </tr>
            </thead>
            <tbody>
              {EASINGS.map((row) => (
                <tr key={row.varName}>
                  <td>
                    <VarChip name={row.varName} />
                  </td>
                  <td>
                    <code>{row.value}</code>
                  </td>
                  <td className={styles.note} style={{ maxWidth: "none" }}>
                    {row.usage}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={styles.note}>
          For color, border, shadow, and opacity changes, prefer the composite{" "}
          <code>--transition-colors</code> shorthand over hand-rolled transition
          lists. Respect reduced-motion preferences for movement that is not
          essential to understanding the interface.
        </p>
      </section>
    </div>
  );
}
