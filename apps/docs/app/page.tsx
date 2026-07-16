import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <h1
        style={{
          fontFamily: "var(--font-heading)",
          fontWeight: 500,
          fontSize: "var(--text-heading-xl)",
          lineHeight: "var(--leading-heading-xl)",
          margin: "0 0 12px",
        }}
      >
        CodeAI Design System
      </h1>
      <p
        style={{
          fontSize: "var(--text-body-md)",
          lineHeight: "var(--leading-body-md)",
          color: "var(--ds-text-neutral-secondary)",
          maxWidth: 640,
        }}
      >
        CADS is the Figma-anchored design system for CodeAI: design variables,
        MUI-wrapped React components, and tooling so designer prototypes and AI
        agents stay in parity with the source of truth.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginTop: 32,
        }}
      >
        {[
          {
            href: "/variables",
            title: "Variables",
            body: "Color, typography, spacing, shape, and elevation — generated from Figma.",
          },
          {
            href: "/components/button",
            title: "Components",
            body: "Live playgrounds, props tables, and Figma deep links for each CADS component.",
          },
          {
            href: "/prototypes",
            title: "Prototype gallery",
            body: "Designer-built prototypes with inspectable component and prop usage.",
          },
          {
            href: "/llms.txt",
            title: "For AI agents",
            body: "llms.txt + machine-readable manifest for high-fidelity prototyping.",
          },
        ].map((card) => (
          <Link
            key={card.href}
            href={card.href}
            style={{
              display: "block",
              padding: 20,
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--ds-border-neutral-primary)",
              background: "var(--ds-background-neutral-secondary)",
              textDecoration: "none",
              color: "inherit",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div
              style={{
                fontWeight: 600,
                marginBottom: 6,
                color: "var(--ds-text-brand-primary)",
              }}
            >
              {card.title}
            </div>
            <div
              style={{
                fontSize: "var(--text-body-sm)",
                color: "var(--ds-text-neutral-secondary)",
              }}
            >
              {card.body}
            </div>
          </Link>
        ))}
      </div>

      <p style={{ marginTop: 40, fontSize: "var(--text-body-sm)" }}>
        Figma source of truth:{" "}
        <a
          href="https://www.figma.com/design/DGekOeToRVifvFAhfqpeC1/CodeAI-Design-System--CADS-"
          target="_blank"
          rel="noreferrer"
        >
          CodeAI Design System (CADS)
        </a>
      </p>
    </div>
  );
}
