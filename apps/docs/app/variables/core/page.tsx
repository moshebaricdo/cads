import { ComponentPageNav } from "@/components/ComponentPageNav";
import { FoundationHeader } from "@/components/FoundationHeader";
import pageStyles from "@/components/DocsTemplatePage.module.scss";
import ui from "@/components/docs-ui.module.scss";
import { adjacentFoundations } from "@/lib/nav";
import shared from "../FoundationPage.module.scss";
import { MotionExample } from "./MotionExample";
import { MotionExperimentToggle } from "./MotionExperimentToggle";
import { MotionExportButton } from "./MotionExportButton";
import { MotionPrimitives } from "./MotionPrimitives";
import { RecipeDemos } from "./RecipeDemos";

export default function MotionPage() {
  const { previous, next } = adjacentFoundations("/variables/core");

  return (
    <div className={pageStyles.page}>
      <FoundationHeader
        title="Motion"
        status="experimental"
        lead="CADS Motion is an experiment exploring how subtle micro-interactions can enhance the 
        tactile experience of the product. It carefully applies motion to each component
        with careful consideration of its context and usage while defining standard motion patterns."
        action={<MotionExportButton />}
      />

      <section className={shared.section} aria-labelledby="motion-recipes">
        <h2 id="motion-recipes" className={`${ui.h2} ${shared.sectionTitle}`}>
          Recipes
        </h2>
        <p className={`${ui.sectionDesc} ${shared.sectionBody}`}>
          Recipes are a predefined set of motion patterns based on interaction type that can be applied
          to components. They combine primitive variable properties like duration and easing to create a 
          consistent and predictable motion experience.
        </p>
        <div className={shared.sectionContent}>
          <RecipeDemos />
        </div>
      </section>

      <section className={shared.section} aria-labelledby="motion-primitives">
        <h2 id="motion-primitives" className={`${ui.h2} ${shared.sectionTitle}`}>
          Primitives
        </h2>
        <p className={`${ui.sectionDesc} ${shared.sectionBody}`}>
          Duration ladder (0 / 100 / 150 / 200), easings, and spring presets
          (fast / moderate / slow). Recipes pick from these — springs are for
          interruptible Indicator travel and pointer chase only.
        </p>
        <div className={shared.sectionContent}>
          <MotionPrimitives />
        </div>
      </section>

      <section className={shared.section} aria-labelledby="motion-in-use">
        <h2 id="motion-in-use" className={`${ui.h2} ${shared.sectionTitle}`}>
          In action
        </h2>
        <p className={`${ui.sectionDesc} ${shared.sectionBody}`}>
          Interact with the components in this mini-UI to see how Motion feels
          in context.
        </p>
        <div className={shared.sectionContent}>
          <MotionExample />
        </div>
      </section>

      <section className={shared.section} aria-labelledby="motion-enable">
        <h2 id="motion-enable" className={`${ui.h2} ${shared.sectionTitle}`}>
          Enable experiment
        </h2>
        <div className={shared.sectionAction}>
          <MotionExperimentToggle />
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
