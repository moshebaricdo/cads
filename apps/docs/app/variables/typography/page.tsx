import { typography } from "@codeai/cads-variables";

const SPECIMENS = [
  { label: "Heading XXL", size: typography.fontSize.headingXxl, family: typography.fontFamily.heading, weight: typography.fontWeight.medium },
  { label: "Heading XL", size: typography.fontSize.headingXl, family: typography.fontFamily.heading, weight: typography.fontWeight.medium },
  { label: "Heading LG", size: typography.fontSize.headingLg, family: typography.fontFamily.body, weight: typography.fontWeight.semibold },
  { label: "Body MD", size: typography.fontSize.bodyMd, family: typography.fontFamily.body, weight: typography.fontWeight.normal },
  { label: "Body SM", size: typography.fontSize.bodySm, family: typography.fontFamily.body, weight: typography.fontWeight.normal },
  { label: "Body XS", size: typography.fontSize.bodyXs, family: typography.fontFamily.body, weight: typography.fontWeight.normal },
  { label: "Mono", size: typography.fontSize.bodySm, family: typography.fontFamily.mono, weight: typography.fontWeight.normal },
];

export default function TypographyPage() {
  return (
    <div>
      <h1
        style={{
          fontFamily: "var(--font-heading)",
          fontWeight: 500,
          fontSize: "var(--text-heading-lg)",
        }}
      >
        Typography
      </h1>
      <p style={{ color: "var(--text-neutral-secondary)" }}>
        Space Grotesk (H1–H2), Geist (body + H3–H6), Google Sans Code (mono).
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 24 }}>
        {SPECIMENS.map((s) => (
          <div key={s.label}>
            <div
              style={{
                fontSize: "var(--text-body-xxs)",
                color: "var(--text-neutral-secondary)",
                marginBottom: 4,
              }}
            >
              {s.label} · {s.size}
            </div>
            <div
              style={{
                fontFamily: s.family,
                fontSize: s.size,
                fontWeight: Number(s.weight),
              }}
            >
              The quick brown fox jumps over the lazy dog
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
