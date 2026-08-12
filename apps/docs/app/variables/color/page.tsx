import { ComponentPageNav } from "@/components/ComponentPageNav";
import { FoundationHeader } from "@/components/FoundationHeader";
import pageStyles from "@/components/DocsTemplatePage.module.scss";
import { docsMetadata } from "@/lib/docsMetadata";
import { adjacentFoundations } from "@/lib/nav";
import { ColorPageContent } from "./ColorPageContent";

const FIGMA_COLOR_URL =
  "https://www.figma.com/design/DGekOeToRVifvFAhfqpeC1/CodeAI-Design-System--CADS-?node-id=15751-24105";

const PROD_COLORS_URL =
  "https://github.com/code-dot-org/code-dot-org/tree/staging/frontend/packages/component-library-styles";

const COLOR_LEAD =
  "The CADS color system is broken into two categories: primitives and semantics. Primitives define core brand colors while semantics define how they should be applied in the product.";

export const metadata = docsMetadata("Color", COLOR_LEAD);

export default function ColorVariablesPage() {
  const { previous, next } = adjacentFoundations("/variables/color");

  return (
    <div className={pageStyles.page}>
      <FoundationHeader
        title="Color"
        lead={COLOR_LEAD}
        links={[
          { href: FIGMA_COLOR_URL, label: "Open in Figma", external: true },
          {
            href: PROD_COLORS_URL,
            label: "View in Github",
            external: true,
          },
        ]}
      />
      <ColorPageContent />
      <ComponentPageNav
        previous={previous}
        next={next}
        aria-label="Foundation pagination"
      />
    </div>
  );
}
