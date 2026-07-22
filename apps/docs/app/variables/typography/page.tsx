import { typography } from "@codeai/cads-variables";
import { VarChip } from "@/components/docs-ui";
import { ComponentPageNav } from "@/components/ComponentPageNav";
import { FoundationHeader } from "@/components/FoundationHeader";
import pageStyles from "@/components/DocsTemplatePage.module.css";
import { adjacentFoundations } from "@/lib/nav";
import styles from "../FoundationPage.module.css";
import { TypographyPageContent } from "./TypographyPageContent";

const FIGMA_TYPOGRAPHY_URL =
  "https://www.figma.com/design/DGekOeToRVifvFAhfqpeC1/CodeAI-Design-System--CADS-?node-id=15722-18149";

const STORYBOOK_TYPOGRAPHY_URL =
  "https://code-dot-org.github.io/code-dot-org/component-library-storybook/?path=/docs/designsystem-typography--docs";

const FAMILIES = [
  {
    varName: "--font-heading",
    value: typography.fontFamily.heading,
    usage: "Display headings (H1–H2)",
  },
  {
    varName: "--font-body",
    value: typography.fontFamily.body,
    usage: "Body copy, UI labels, H3–H6",
  },
  {
    varName: "--font-mono",
    value: typography.fontFamily.mono,
    usage: "Code, variable names, technical values",
  },
];

export default function TypographyPage() {
  const { previous, next } = adjacentFoundations("/variables/typography");

  return (
    <div className={pageStyles.page}>
      <FoundationHeader
        title="Typography"
        lead="Space Grotesk carries display headings (H1–H2), Geist carries body copy and smaller headings, and Google Sans Code handles mono. Styles mirror the CADS Figma Typography page."
        links={[
          {
            href: FIGMA_TYPOGRAPHY_URL,
            label: "Open in Figma",
            external: true,
          },
          {
            href: STORYBOOK_TYPOGRAPHY_URL,
            label: "View in Storybook",
            external: true,
          },
        ]}
      />

      <TypographyPageContent />

      <section className={styles.section} aria-labelledby="families">
        <h2 id="families" className={`docs-h2 ${styles.sectionTitle}`}>
          Families
        </h2>
        <p className={`docs-section-desc ${styles.sectionBody}`}>
          Font stacks behind the styles. Prefer these variables over hard-coded
          family names.
        </p>
        <div className={styles.sectionContent}>
          <div className={`docs-table-wrap ${styles.table}`}>
            <table className="docs-table">
              <thead>
                <tr>
                  <th>Variable</th>
                  <th>Stack</th>
                  <th>Usage</th>
                </tr>
              </thead>
              <tbody>
                {FAMILIES.map((family) => (
                  <tr key={family.varName}>
                    <td>
                      <VarChip name={family.varName} />
                    </td>
                    <td style={{ fontFamily: family.value }}>{family.value}</td>
                    <td className={styles.note} style={{ maxWidth: "none" }}>
                      {family.usage}
                    </td>
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
