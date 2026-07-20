import Link from "next/link";
import { CodeBlock, PageHeader, Section } from "@/components/docs-ui";

const FOUNDATION_CARDS = [
  {
    href: "/variables/color",
    title: "Color",
    body: "146 semantic roles — backgrounds, text, and borders across neutral, brand, selected, accent, and status ramps, with light and dark values.",
  },
  {
    href: "/variables/typography",
    title: "Typography",
    body: "Space Grotesk display headings, Geist body, Google Sans Code mono — the full size, line-height, and weight scale.",
  },
  {
    href: "/variables/spacing",
    title: "Spacing & shape",
    body: "The 8px-based spacing scale and corner radius ramp used across all component chrome.",
  },
  {
    href: "/variables/core",
    title: "Core styles",
    body: "Elevation shadows, motion durations and easings, and the fixed control-height scale.",
  },
];

export default function VariablesIndexPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Foundations"
        title="Variables"
        lead={
          <>
            CADS design variables are generated from the Figma file into{" "}
            <code>@codeai/cads-variables</code> and exposed as CSS custom
            properties with semantic names — no <code>--ds-</code> prefix, no
            raw hex in consuming code.
          </>
        }
      />

      <Section title="Setup" description="Import the stylesheet once at your app root. Every variable on the following pages is then available globally, with dark values applied under a `.dark` class on the root element.">
        <CodeBlock code={`import "@codeai/cads-variables/variables.css";`} />
      </Section>

      <Section title="Explore the foundations">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {FOUNDATION_CARDS.map((card) => (
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
      </Section>

      <Section
        title="Brand vs selected"
        description="The most common misuse in prototypes — these two ramps look similar but mean different things."
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          <div className="docs-card">
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 8,
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 4,
                  background: "var(--background-brand-primary)",
                }}
              />
              <strong>Brand</strong>
            </div>
            <p
              style={{
                margin: 0,
                fontSize: "var(--text-body-sm)",
                lineHeight: "var(--leading-body-sm)",
                color: "var(--text-neutral-secondary)",
              }}
            >
              Primary actions, CTAs, and links. Use{" "}
              <code>--background-brand-primary</code> and friends for the
              things a user is invited to do.
            </p>
          </div>
          <div className="docs-card">
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 8,
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 4,
                  background: "var(--background-selected-primary)",
                }}
              />
              <strong>Selected</strong>
            </div>
            <p
              style={{
                margin: 0,
                fontSize: "var(--text-body-sm)",
                lineHeight: "var(--leading-body-sm)",
                color: "var(--text-neutral-secondary)",
              }}
            >
              Filled selected chrome — segmented controls, checked checkboxes,
              selected menu items, active nav. Never paint selected surfaces
              with brand fills.
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}
