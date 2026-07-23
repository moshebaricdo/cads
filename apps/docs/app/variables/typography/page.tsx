import { ComponentPageNav } from "@/components/ComponentPageNav";
import { FoundationHeader } from "@/components/FoundationHeader";
import pageStyles from "@/components/DocsTemplatePage.module.css";
import { STORYBOOK_BASE } from "@/lib/componentExternalLinks";
import { adjacentFoundations } from "@/lib/nav";
import { TypographyPageContent } from "./TypographyPageContent";

const FIGMA_TYPOGRAPHY_URL =
  "https://www.figma.com/design/DGekOeToRVifvFAhfqpeC1/CodeAI-Design-System--CADS-?node-id=15722-18149";

const STORYBOOK_TYPOGRAPHY_URL = `${STORYBOOK_BASE}/?path=/docs/designsystem-typography--docs`;

export default function TypographyPage() {
  const { previous, next } = adjacentFoundations("/variables/typography");

  return (
    <div className={pageStyles.page}>
      <FoundationHeader
        title="Typography"
        lead="The CADS type system is broken into three font families and a shared size scale. Space Grotesk handles display headings (H1–H2), Geist covers body copy and smaller headings, and Google Sans Code is reserved for mono."
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

      <ComponentPageNav
        previous={previous}
        next={next}
        aria-label="Foundation pagination"
      />
    </div>
  );
}
