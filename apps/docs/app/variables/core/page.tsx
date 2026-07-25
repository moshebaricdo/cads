import { ComponentPageNav } from "@/components/ComponentPageNav";
import { FoundationHeader } from "@/components/FoundationHeader";
import pageStyles from "@/components/DocsTemplatePage.module.css";
import { adjacentFoundations } from "@/lib/nav";
import styles from "../FoundationPage.module.css";
import { MotionExample, MotionExperimentOptions } from "./MotionExample";
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
      />

      <section className={styles.section} aria-labelledby="motion-recipes">
        <h2 id="motion-recipes" className={`docs-h2 ${styles.sectionTitle}`}>
          Recipes
        </h2>
        <p className={`docs-section-desc ${styles.sectionBody}`}>
          Recipes are a predefined set of motion patterns based on interaction type that can be applied
          to components. They combine primitive variable properties like duration and easing to create a 
          consistent and predictable motion experience.
        </p>
        <div className={styles.sectionContent}>
          <RecipeDemos />
        </div>
      </section>

      <section className={styles.section} aria-labelledby="motion-primitives">
        <h2 id="motion-primitives" className={`docs-h2 ${styles.sectionTitle}`}>
          Primitives
        </h2>
        <p className={`docs-section-desc ${styles.sectionBody}`}>
          Duration, easing, and scale values recipes and chrome build from —
          including recipe-owned timings and scales alongside the shared chrome
          steps.
        </p>
        <div className={styles.sectionContent}>
          <MotionPrimitives />
        </div>
      </section>

      <section className={styles.section} aria-labelledby="motion-in-use">
        <h2 id="motion-in-use" className={`docs-h2 ${styles.sectionTitle}`}>
          In action
        </h2>
        <p className={`docs-section-desc ${styles.sectionBody}`}>
          Interact with the components in this mini-UI to see how Motion feels
          in context.
        </p>
        <div className={styles.sectionContent}>
          <MotionExample />
        </div>
      </section>

      <section
        className={styles.section}
        aria-labelledby="motion-experiment-options"
      >
        <h2
          id="motion-experiment-options"
          className={`docs-h2 ${styles.sectionTitle}`}
        >
          Experiment options
        </h2>
        <div className={styles.sectionContent}>
          <MotionExperimentOptions />
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
