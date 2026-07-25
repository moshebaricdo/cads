import Link from "next/link";
import type { CSSProperties } from "react";
import { CodeBlock } from "@/components/docs-ui";
import { FoundationHeader } from "@/components/FoundationHeader";
import pageStyles from "@/components/DocsTemplatePage.module.scss";
import ui from "@/components/docs-ui.module.scss";
import styles from "./FoundationPage.module.scss";

const FOUNDATION_CARDS = [
  {
    href: "/variables/color",
    title: "Color",
    body: "Primitives for the core palette, semantics for how color gets applied — backgrounds, text, borders, and theme-aware roles.",
  },
  {
    href: "/variables/typography",
    title: "Typography",
    body: "Three families and a shared size scale — Space Grotesk for display, Geist for body and UI, Google Sans Code for mono.",
  },
  {
    href: "/variables/spacing",
    title: "Shape",
    body: "Border radius, elevation, spacing, and stacking — corners, depth, gaps, and overlay z-index.",
  },
  {
    href: "/variables/core",
    title: "Motion",
    body: "An experimental shared vocabulary for consistent durations, easing, and interaction feedback.",
  },
];

export default function VariablesIndexPage() {
  return (
    <div className={pageStyles.page}>
      <FoundationHeader
        title="Variables"
        lead={
          <>
            CADS design variables are generated from the Figma file into{" "}
            <code>@codeai/cads-variables</code> and exposed as CSS custom
            properties with semantic names — no <code>--ds-</code> prefix, no
            raw hex in consuming code.
          </>
        }
      />

      <section className={styles.section} aria-labelledby="setup">
        <h2 id="setup" className={`${ui.h2} ${styles.sectionTitle}`}>
          Setup
        </h2>
        <p className={`${ui.sectionDesc} ${styles.sectionBody}`}>
          Import the barrel once at your app root — it pulls in the prod-shaped
          split files (<code>primitiveColors.css</code>, <code>colors.css</code>,{" "}
          <code>fontVariables.css</code>, <code>shapeAndSpacingVariables.css</code>,{" "}
          <code>motionVariables.css</code>, plus CADS runtime{" "}
          <code>typographyVariables.css</code>). Dark values apply under a{" "}
          <code>.dark</code> class or <code>data-theme=&quot;Dark&quot;</code>.
          Foundation pages export prod-ready files; Typography also exports{" "}
          <code>typography.module.scss</code> (uses prod&apos;s existing{" "}
          <code>font.scss</code>).
        </p>
        <div style={{ width: "100%" }}>
          <CodeBlock code={`import "@codeai/cads-variables/variables.css";`} />
        </div>
      </section>

      <section className={styles.section} aria-labelledby="explore">
        <h2 id="explore" className={`${ui.h2} ${styles.sectionTitle}`}>
          Explore the foundations
        </h2>
        <div className={styles.cardGrid}>
          {FOUNDATION_CARDS.map((card) => (
            <Link key={card.href} href={card.href} className={ui.card}>
              <div className={styles.cardTitle}>{card.title}</div>
              <p className={styles.cardBody}>{card.body}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="brand-vs-selected">
        <h2 id="brand-vs-selected" className={`${ui.h2} ${styles.sectionTitle}`}>
          Brand vs selected
        </h2>
        <p className={`${ui.sectionDesc} ${styles.sectionBody}`}>
          The most common misuse in prototypes — these two ramps look similar
          but mean different things.
        </p>
        <div className={styles.cardGrid}>
          <div className={ui.card}>
            <div className={styles.ruleTitle}>
              <span
                aria-hidden
                className={styles.ruleSwatch}
                style={
                  {
                    "--rule-swatch": "var(--background-brand-primary)",
                  } as CSSProperties
                }
              />
              Brand
            </div>
            <p className={styles.cardBody}>
              Primary actions, CTAs, and links. Use{" "}
              <code>--background-brand-primary</code> and friends for the things
              a user is invited to do.
            </p>
          </div>
          <div className={ui.card}>
            <div className={styles.ruleTitle}>
              <span
                aria-hidden
                className={styles.ruleSwatch}
                style={
                  {
                    "--rule-swatch": "var(--background-selected-primary)",
                  } as CSSProperties
                }
              />
              Selected
            </div>
            <p className={styles.cardBody}>
              Filled selected chrome — segmented controls, checked checkboxes,
              selected menu items, active nav. Never paint selected surfaces with
              brand fills.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
