import Link from "next/link";
import { cadsManifest } from "@codeai/cads-react/manifest";
import { PageHeader, Section } from "@/components/docs-ui";

const CARDS = [
  {
    href: "/variables",
    title: "Variables",
    body: "Color, typography, spacing, shape, elevation, and motion — generated from Figma, exposed as semantic CSS custom properties.",
  },
  {
    href: "/components/button",
    title: "Components",
    body: "Live playgrounds, full prop tables, usage guidelines, and Figma deep links for every CADS component.",
  },
  {
    href: "/ai",
    title: "AI setup",
    body: "llms.txt, the typed manifest, and the Claude prototyping skill — everything an agent needs for pixel-true prototypes.",
  },
  {
    href: "/prototypes",
    title: "Prototype gallery",
    body: "Designer-built prototypes with inspectable component and prop usage.",
  },
];

export default function HomePage() {
  const componentCount = cadsManifest.components.filter(
    (c) => c.exportName !== "FaIcon",
  ).length;

  return (
    <div>
      <PageHeader
        eyebrow="CodeAI Design System"
        title="Design once, ship everywhere"
        lead="CADS is the Figma-anchored design system for CodeAI: design variables, MUI-wrapped React components, and AI tooling that keep designer prototypes, production code, and agents in parity with a single source of truth."
      />

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 24,
          padding: "16px 20px",
          border: "1px solid var(--border-neutral-primary)",
          borderRadius: "var(--radius-lg)",
          background: "var(--background-neutral-secondary)",
          marginBottom: "var(--space-s)",
        }}
      >
        {[
          { value: String(componentCount), label: "components" },
          { value: "146", label: "color variables" },
          { value: "1", label: "source of truth (Figma)" },
        ].map((stat) => (
          <div key={stat.label}>
            <div
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 500,
                fontSize: "var(--text-heading-md)",
                lineHeight: "var(--leading-heading-md)",
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontSize: "var(--text-body-xs)",
                color: "var(--text-neutral-secondary)",
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 16,
        }}
      >
        {CARDS.map((card) => (
          <Link key={card.href} href={card.href} className="docs-card">
            <div
              style={{
                fontWeight: 600,
                marginBottom: 6,
                color: "var(--text-brand-primary)",
              }}
            >
              {card.title}
            </div>
            <div
              style={{
                fontSize: "var(--text-body-sm)",
                lineHeight: "var(--leading-body-sm)",
                color: "var(--text-neutral-secondary)",
              }}
            >
              {card.body}
            </div>
          </Link>
        ))}
      </div>

      <Section
        title="Source of truth"
        description="Code syncs from Figma — components and variables are specced there first, then generated or implemented to parity here."
      >
        <a
          href="https://www.figma.com/design/DGekOeToRVifvFAhfqpeC1/CodeAI-Design-System--CADS-"
          target="_blank"
          rel="noreferrer"
          style={{ fontSize: "var(--text-body-sm)" }}
        >
          CodeAI Design System (CADS) in Figma ↗
        </a>
      </Section>
    </div>
  );
}
