import Link from "next/link";
import type { CSSProperties } from "react";
import { CodeBlock } from "@/components/docs-ui";
import { FoundationHeader } from "@/components/FoundationHeader";
import pageStyles from "@/components/DocsTemplatePage.module.css";
import styles from "./FoundationPage.module.css";

const FOUNDATION_CARDS = [
  {
    href: "/variables/color",
    title: "Color",
    body: "Primitive ramps and semantic roles for backgrounds, text, borders, state, and feedback across light and dark themes.",
  },
  {
    href: "/variables/typography",
    title: "Typography",
    body: "Space Grotesk display headings, Geist body, Google Sans Code mono — the full size, line-height, and weight scale.",
  },
  {
    href: "/variables/spacing",
    title: "Shape",
    body: "Border radii, elevation shadows, and the spacing ramp used to build consistent surfaces and layouts.",
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
        <h2 id="setup" className={`docs-h2 ${styles.sectionTitle}`}>
          Setup
        </h2>
        <p className={`docs-section-desc ${styles.sectionBody}`}>
          Import the stylesheet once at your app root. Every variable on the
          following pages is then available globally, with dark values applied
          under a <code>.dark</code> class on the root element.
        </p>
        <div style={{ width: "100%" }}>
          <CodeBlock code={`import "@codeai/cads-variables/variables.css";`} />
        </div>
      </section>

      <section className={styles.section} aria-labelledby="explore">
        <h2 id="explore" className={`docs-h2 ${styles.sectionTitle}`}>
          Explore the foundations
        </h2>
        <div className={styles.cardGrid}>
          {FOUNDATION_CARDS.map((card) => (
            <Link key={card.href} href={card.href} className="docs-card">
              <div className={styles.cardTitle}>{card.title}</div>
              <p className={styles.cardBody}>{card.body}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="brand-vs-selected">
        <h2 id="brand-vs-selected" className={`docs-h2 ${styles.sectionTitle}`}>
          Brand vs selected
        </h2>
        <p className={`docs-section-desc ${styles.sectionBody}`}>
          The most common misuse in prototypes — these two ramps look similar
          but mean different things.
        </p>
        <div className={styles.cardGrid}>
          <div className="docs-card">
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
          <div className="docs-card">
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
