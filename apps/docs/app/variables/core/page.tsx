import { Tag } from "@codeai/cads-react";
import { ComponentPageNav } from "@/components/ComponentPageNav";
import { FoundationHeader } from "@/components/FoundationHeader";
import pageStyles from "@/components/DocsTemplatePage.module.css";
import { adjacentFoundations } from "@/lib/nav";

export default function MotionPage() {
  const { previous, next } = adjacentFoundations("/variables/core");

  return (
    <div className={pageStyles.page}>
      <FoundationHeader
        title="Motion"
        lead="CADS Motion is an experimental effort to define and standardize how interface changes and micro-interactions feel across the design system."
        action={<Tag size="large" color="brand" label="Coming soon" />}
      />

      <ComponentPageNav
        previous={previous}
        next={next}
        aria-label="Foundation pagination"
      />
    </div>
  );
}
