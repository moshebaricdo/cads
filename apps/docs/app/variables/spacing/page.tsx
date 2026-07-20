import { shape, spacing } from "@codeai/cads-variables";
import Link from "next/link";
import { PageHeader, Section, VarChip } from "@/components/docs-ui";

export default function SpacingPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Foundations"
        title="Spacing & shape"
        lead={
          <>
            The 8px-based spacing scale and corner radius ramp from the Figma
            spacing-shape collection. Elevation shadows and motion now live on
            the <Link href="/variables/core">Core styles</Link> page.
          </>
        }
      />

      <Section
        title="Spacing"
        description="Use spacing variables for layout gaps, padding, and stack rhythm — not raw pixel values."
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            border: "1px solid var(--border-neutral-primary)",
            borderRadius: "var(--radius-lg)",
            padding: "16px 20px",
          }}
        >
          {Object.entries(spacing).map(([name, value]) => (
            <div
              key={name}
              style={{ display: "flex", alignItems: "center", gap: 14 }}
            >
              <span style={{ width: 130, flexShrink: 0 }}>
                <VarChip name={`--space-${name}`} />
              </span>
              <div
                style={{
                  height: 14,
                  width: value,
                  background: "var(--background-brand-primary)",
                  borderRadius: 3,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  color: "var(--text-neutral-secondary)",
                  fontSize: "var(--text-body-xs)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Corner radius"
        description="Small radii for compact controls, larger for surfaces; round for pills and circular chrome."
      >
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {Object.entries(shape).map(([name, value]) => {
            const varName = `--radius-${name.replace("radius", "").toLowerCase()}`;
            return (
              <div key={name} style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: 80,
                    height: 80,
                    background: "var(--background-brand-light)",
                    border: "1px solid var(--border-brand-primary)",
                    borderRadius: value,
                    marginBottom: 10,
                  }}
                />
                <div style={{ marginBottom: 4 }}>
                  <VarChip name={varName} />
                </div>
                <div
                  style={{
                    fontSize: "var(--text-body-xxs)",
                    fontFamily: "var(--font-mono)",
                    color: "var(--text-neutral-tertiary)",
                  }}
                >
                  {value}
                </div>
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  );
}
