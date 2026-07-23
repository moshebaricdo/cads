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
            The CADS portable skill packages the CADS Docs runtime (components and styles) along 
            with general guidance for LLMs on how to best use it. It also provides context on our 
            UI/UX practices, different surfaces of our platform, and more. It works in any AI tool
            that supports agent skills.
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
          Upload the ZIP under Customize <Arrow /> Skills, and make sure to enable{" "}
          <code>cads-prototyping</code>. When you next ask Claude to create a prototype and 
          reference the skill, it will return self-contained HTML with the CADS components 
          and styles inlined. 
        </p>
      </section>

      <section className={styles.section} aria-labelledby="chatgpt">
        <h2 id="chatgpt" className={`docs-h2 ${styles.sectionTitle}`}>
          ChatGPT
        </h2>
        <p className={`docs-section-desc ${styles.sectionBody}`}>
          Skills have been buried a bit in ChatGPT, the easiest way is to navigate to  
          <a href="https://chatgpt.com/skills" target="_blank" rel="noopener noreferrer"> chatgpt.com/skills</a> directly. 
          There you can upload the zip and add it as a reusable skill. ChatGPT will prompt you to test it out.
       </p>
      </section>

      <section className={styles.section} aria-labelledby="gemini">
        <h2 id="gemini" className={`docs-h2 ${styles.sectionTitle}`}>
          Gemini
        </h2>
        <p className={`docs-section-desc ${styles.sectionBody}`}>
          There is no dedicated skill support in Gemini that I could find. 
          There is potentially a way to upload skills through Gemini Spark (?)
          but I haven't bothered to explore it, it's Gemini.
        </p>
      </section>

      <section className={styles.section} aria-labelledby="cursor">
        <h2 id="cursor" className={`docs-h2 ${styles.sectionTitle}`}>
          Cursor
        </h2>
        <p className={`docs-section-desc ${styles.sectionBody}`}>
          Inside of your project, just drop the ZIP into any agent thread and request
          that it install the skill. You can then reference the skill when building prototypes.
        </p>
      </section>
    </div>
  );
}
