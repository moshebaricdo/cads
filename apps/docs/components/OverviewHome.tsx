"use client";

import Image from "next/image";
import NextLink from "next/link";
import { Button, Link } from "@codeai/cads-react";
import pageStyles from "@/components/DocsTemplatePage.module.css";
import overviewStyles from "@/components/ComponentOverview.module.css";
import styles from "./OverviewHome.module.css";

const FIGMA_URL =
  "https://www.figma.com/design/DGekOeToRVifvFAhfqpeC1/CodeAI-Design-System--CADS-";

const BRAND_GUIDELINES_URL =
  "https://www.figma.com/deck/TpRUWRX4SE00phZnQWMDRS/CodeAI_Brand-Guidelines?node-id=7-17457&t=0p6yzcdHTmoJS9yZ-1";

const STORYBOOK_URL =
  "https://code-dot-org.github.io/code-dot-org/component-library-storybook/?path=/story/designsystem-accordion--playground";

const DESTINATIONS = [
  {
    href: "/variables/color",
    title: "Core Styles",
    body: "The core styles everything else builds on: color, type, spacing, and shape.",
    graphic: "styles" as const,
  },
  {
    href: "/components/button",
    title: "Components",
    body: "Reusable UI building blocks designed to stay flexible, accessible, and on-brand.",
    graphic: "components" as const,
  },
] as const;

const RESOURCES = [
  { href: FIGMA_URL, label: "CADS Figma", external: true },
  { href: STORYBOOK_URL, label: "Storybook", external: true },
  { href: BRAND_GUIDELINES_URL, label: "Brand Guidelines", external: true },
] as const;

const GRAPHICS = {
  styles: {
    light: "/overview-styles-graphic-light.png",
    dark: "/overview-styles-graphic-dark.png",
  },
  components: {
    light: "/overview-components-graphic-light.png",
    dark: "/overview-components-graphic-dark.png",
  },
} as const;

function ThemeGraphic({ kind }: { kind: keyof typeof GRAPHICS }) {
  const sources = GRAPHICS[kind];
  return (
    <div className={styles.graphicFrame} aria-hidden>
      <Image
        className={`${styles.graphicImage} ${styles.graphicLight}`}
        src={sources.light}
        alt=""
        width={784}
        height={400}
      />
      <Image
        className={`${styles.graphicImage} ${styles.graphicDark}`}
        src={sources.dark}
        alt=""
        width={784}
        height={400}
      />
    </div>
  );
}

export function OverviewHome() {
  return (
    <div className={pageStyles.page}>
      <header className={overviewStyles.root}>
        <div className={overviewStyles.copy}>
          <h1 className={overviewStyles.title}>CodeAI Design System</h1>
          <p className={overviewStyles.lead}>
            The CodeAI Design System (CADS) is a collection of design primitives
            and components that power our signed-in product experience.
          </p>
        </div>
      </header>

      <div className={styles.destinations}>
        {DESTINATIONS.map((item) => (
          <NextLink key={item.href} href={item.href} className={styles.card}>
            <div className={styles.graphic}>
              <ThemeGraphic kind={item.graphic} />
            </div>
            <div className={styles.copy}>
              <h2 className={styles.cardTitle}>{item.title}</h2>
              <p className={styles.cardBody}>{item.body}</p>
            </div>
          </NextLink>
        ))}
      </div>

      <section className={styles.section} aria-labelledby="overview-prototyping">
        <h2 id="overview-prototyping" className={`docs-h2 ${styles.sectionTitle}`}>
          Prototyping with CADS
        </h2>
        <p className={`docs-section-desc ${styles.sectionBody}`}>
          Prototype outside the monorepo with a portable skill that embeds the
          real CADS runtime — no npm packages required.
        </p>
        <div className={styles.sectionAction}>
          <Button href="/ai" size="small" color="secondary">
            Learn more
          </Button>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="overview-resources">
        <h2 id="overview-resources" className={`docs-h2 ${styles.sectionTitle}`}>
          Additional Resources
        </h2>
        <div className={styles.resourceRow}>
          {RESOURCES.map((item, index) => (
            <span key={item.href} className={styles.resourceItem}>
              {index > 0 ? (
                <span className={styles.resourceDot} aria-hidden />
              ) : null}
              <Link
                href={item.href}
                size="small"
                type="primary"
                isExternal={item.external}
                {...(item.external
                  ? { target: "_blank", rel: "noreferrer" }
                  : {})}
              >
                {item.label}
              </Link>
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
