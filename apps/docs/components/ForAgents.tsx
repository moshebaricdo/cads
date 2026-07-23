"use client";

import { Button } from "@codeai/cads-react";
import pageStyles from "@/components/DocsTemplatePage.module.css";
import overviewStyles from "@/components/ComponentOverview.module.css";
import { withBasePath } from "@/lib/basePath";
import styles from "./ForAgents.module.css";

const SKILL_ZIP_ROUTE = withBasePath("/downloads/cads-prototyping.zip");

/** Geist’s rightwards arrow (text presentation, not emoji). */
function Arrow() {
  return (
    <span className={styles.arrow} aria-hidden>
      {"\u2192\uFE0E"}
    </span>
  );
}

type ForAgentsProps = {
  zipReady: boolean;
};

export function ForAgents({ zipReady }: ForAgentsProps) {
  return (
    <div className={`${pageStyles.page} ${styles.page}`}>
      <header className={overviewStyles.root}>
        <div className={overviewStyles.copy}>
          <h1 className={overviewStyles.title}>Using CADS with AI</h1>
          <p className={overviewStyles.lead}>
            One portable skill carries the real CADS runtime. Install it in a
            supported AI tool, ask for a prototype, and get self-contained HTML —
            no npm packages and no monorepo checkout. Intended for CodeAI
            internal use (embeds Font Awesome 7 Pro).
          </p>
        </div>
        {zipReady ? (
          <div className={overviewStyles.links}>
            <Button
              href={SKILL_ZIP_ROUTE}
              size="small"
              color="secondary"
              startIconName="download"
            >
              Download skill
            </Button>
          </div>
        ) : (
          <p className={styles.fallback}>
            Skill ZIP not in this build. Run{" "}
            <code>pnpm artifact:package</code> then rebuild docs, or download
            from the deployed docs site.
          </p>
        )}
      </header>

      <section className={styles.section} aria-labelledby="claude">
        <h2 id="claude" className={`docs-h2 ${styles.sectionTitle}`}>
          Claude
        </h2>
        <p className={`docs-section-desc ${styles.sectionBody}`}>
          Upload the ZIP under Customize <Arrow /> Skills, enable{" "}
          <code>cads-prototyping</code>, then ask for a CADS prototype. Claude
          returns self-contained HTML with the real components inlined. Keep
          shares organization-only.
        </p>
      </section>

      <section className={styles.section} aria-labelledby="chatgpt">
        <h2 id="chatgpt" className={`docs-h2 ${styles.sectionTitle}`}>
          ChatGPT
        </h2>
        <p className={`docs-section-desc ${styles.sectionBody}`}>
          Upload the same ZIP as an Agent Skill (Skills / Work mode, depending
          on your plan). Ask for a CADS prototype — expect either an inline
          preview or a downloadable HTML file. Do not ask ChatGPT to import a
          public npm package; CADS is not published that way.
        </p>
      </section>

      <section className={styles.section} aria-labelledby="gemini">
        <h2 id="gemini" className={`docs-h2 ${styles.sectionTitle}`}>
          Gemini
        </h2>
        <p className={`docs-section-desc ${styles.sectionBody}`}>
          In Gemini Spark, open Skills <Arrow /> Upload and choose the ZIP (or
          its <code>SKILL.md</code> folder). Skills are Spark-only and may
          require a qualifying subscription. Once installed, ask for a CADS HTML
          prototype the same way.
        </p>
      </section>

      <section className={styles.section} aria-labelledby="cursor">
        <h2 id="cursor" className={`docs-h2 ${styles.sectionTitle}`}>
          Cursor
        </h2>
        <p className={`docs-section-desc ${styles.sectionBody}`}>
          Drop the ZIP into an Agent chat and ask Cursor to install the skill.
          Then ask for a CADS prototype — it should write self-contained HTML
          from the bundled runtime.
        </p>
      </section>
    </div>
  );
}
