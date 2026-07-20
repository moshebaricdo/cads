import { typography } from "@codeai/cads-variables";
import { PageHeader, Section, VarChip } from "@/components/docs-ui";

type Specimen = {
  label: string;
  sizeVar: string;
  leadingVar: string;
  size: string;
  lineHeight: string;
  letterSpacing?: string;
  family: string;
  weight: string;
  sample?: string;
};

const HEADING_SPECIMENS: Specimen[] = [
  {
    label: "Heading XXL",
    sizeVar: "--text-heading-xxl",
    leadingVar: "--leading-heading-xxl",
    size: typography.fontSize.headingXxl,
    lineHeight: typography.lineHeight.headingXxl,
    letterSpacing: typography.letterSpacing.headingDisplay,
    family: typography.fontFamily.heading,
    weight: typography.fontWeight.medium,
  },
  {
    label: "Heading XL",
    sizeVar: "--text-heading-xl",
    leadingVar: "--leading-heading-xl",
    size: typography.fontSize.headingXl,
    lineHeight: typography.lineHeight.headingXl,
    letterSpacing: typography.letterSpacing.headingDisplay,
    family: typography.fontFamily.heading,
    weight: typography.fontWeight.medium,
  },
  {
    label: "Heading LG",
    sizeVar: "--text-heading-lg",
    leadingVar: "--leading-heading-lg",
    size: typography.fontSize.headingLg,
    lineHeight: typography.lineHeight.headingLg,
    family: typography.fontFamily.body,
    weight: typography.fontWeight.semibold,
  },
  {
    label: "Heading MD",
    sizeVar: "--text-heading-md",
    leadingVar: "--leading-heading-md",
    size: typography.fontSize.headingMd,
    lineHeight: typography.lineHeight.headingMd,
    family: typography.fontFamily.body,
    weight: typography.fontWeight.semibold,
  },
  {
    label: "Heading SM",
    sizeVar: "--text-heading-sm",
    leadingVar: "--leading-heading-sm",
    size: typography.fontSize.headingSm,
    lineHeight: typography.lineHeight.headingSm,
    family: typography.fontFamily.body,
    weight: typography.fontWeight.semibold,
  },
  {
    label: "Heading XS",
    sizeVar: "--text-heading-xs",
    leadingVar: "--leading-heading-xs",
    size: typography.fontSize.headingXs,
    lineHeight: typography.lineHeight.headingXs,
    family: typography.fontFamily.body,
    weight: typography.fontWeight.semibold,
  },
];

const BODY_SPECIMENS: Specimen[] = [
  {
    label: "Body LG",
    sizeVar: "--text-body-lg",
    leadingVar: "--leading-body-lg",
    size: typography.fontSize.bodyLg,
    lineHeight: typography.lineHeight.bodyLg,
    family: typography.fontFamily.body,
    weight: typography.fontWeight.normal,
  },
  {
    label: "Body MD",
    sizeVar: "--text-body-md",
    leadingVar: "--leading-body-md",
    size: typography.fontSize.bodyMd,
    lineHeight: typography.lineHeight.bodyMd,
    family: typography.fontFamily.body,
    weight: typography.fontWeight.normal,
  },
  {
    label: "Body SM",
    sizeVar: "--text-body-sm",
    leadingVar: "--leading-body-sm",
    size: typography.fontSize.bodySm,
    lineHeight: typography.lineHeight.bodySm,
    family: typography.fontFamily.body,
    weight: typography.fontWeight.normal,
  },
  {
    label: "Body XS",
    sizeVar: "--text-body-xs",
    leadingVar: "--leading-body-xs",
    size: typography.fontSize.bodyXs,
    lineHeight: typography.lineHeight.bodyXs,
    family: typography.fontFamily.body,
    weight: typography.fontWeight.normal,
  },
  {
    label: "Body XXS",
    sizeVar: "--text-body-xxs",
    leadingVar: "--leading-body-xxs",
    size: typography.fontSize.bodyXxs,
    lineHeight: typography.lineHeight.bodyXxs,
    family: typography.fontFamily.body,
    weight: typography.fontWeight.normal,
  },
  {
    label: "Mono",
    sizeVar: "--text-body-sm",
    leadingVar: "--leading-body-sm",
    size: typography.fontSize.bodySm,
    lineHeight: typography.lineHeight.bodySm,
    family: typography.fontFamily.mono,
    weight: typography.fontWeight.normal,
    sample: "const theme = createCadsTheme({ mode: \"light\" });",
  },
];

const FAMILIES = [
  {
    varName: "--font-heading",
    value: typography.fontFamily.heading,
    usage: "Display headings (H1–H2)",
  },
  {
    varName: "--font-body",
    value: typography.fontFamily.body,
    usage: "Body copy, UI labels, H3–H6",
  },
  {
    varName: "--font-mono",
    value: typography.fontFamily.mono,
    usage: "Code, variable names, technical values",
  },
];

function SpecimenRow({ specimen }: { specimen: Specimen }) {
  return (
    <div
      style={{
        padding: "16px 0",
        borderBottom: "1px solid var(--border-neutral-primary)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "baseline",
          gap: 10,
          marginBottom: 8,
        }}
      >
        <span
          style={{
            fontSize: "var(--text-body-xs)",
            fontWeight: 600,
            color: "var(--text-neutral-primary)",
            minWidth: 110,
          }}
        >
          {specimen.label}
        </span>
        <span
          style={{
            fontSize: "var(--text-body-xxs)",
            fontFamily: "var(--font-mono)",
            color: "var(--text-neutral-tertiary)",
          }}
        >
          {specimen.size} / {specimen.lineHeight} · weight {specimen.weight}
          {specimen.letterSpacing
            ? ` · tracking ${specimen.letterSpacing}`
            : ""}
        </span>
        <span style={{ display: "inline-flex", gap: 6, marginLeft: "auto" }}>
          <VarChip name={specimen.sizeVar} />
          <VarChip name={specimen.leadingVar} />
        </span>
      </div>
      <div
        style={{
          fontFamily: specimen.family,
          fontSize: specimen.size,
          fontWeight: Number(specimen.weight),
          lineHeight: specimen.lineHeight,
          letterSpacing: specimen.letterSpacing,
          overflowWrap: "anywhere",
        }}
      >
        {specimen.sample ?? "The quick brown fox jumps over the lazy dog"}
      </div>
    </div>
  );
}

export default function TypographyPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Foundations"
        title="Typography"
        lead="Space Grotesk carries display headings (H1–H2), Geist carries body copy and smaller headings, and Google Sans Code handles mono. Sizes and line heights come straight from the Figma typography collection."
      />

      <Section title="Families">
        <div className="docs-table-wrap">
          <table className="docs-table">
            <thead>
              <tr>
                <th>Variable</th>
                <th>Stack</th>
                <th>Usage</th>
              </tr>
            </thead>
            <tbody>
              {FAMILIES.map((f) => (
                <tr key={f.varName}>
                  <td>
                    <VarChip name={f.varName} />
                  </td>
                  <td style={{ fontFamily: f.value }}>{f.value}</td>
                  <td
                    style={{
                      color: "var(--text-neutral-secondary)",
                      fontSize: "var(--text-body-sm)",
                    }}
                  >
                    {f.usage}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section
        title="Headings"
        description="XXL and XL are display sizes set in Space Grotesk with tightened tracking; LG and below switch to Geist semibold."
      >
        <div>
          {HEADING_SPECIMENS.map((s) => (
            <SpecimenRow key={s.label} specimen={s} />
          ))}
        </div>
      </Section>

      <Section
        title="Body & mono"
        description="Geist at normal weight for running copy and UI labels; Google Sans Code for code."
      >
        <div>
          {BODY_SPECIMENS.map((s) => (
            <SpecimenRow key={s.label} specimen={s} />
          ))}
        </div>
      </Section>

      <Section
        title="Weights & tracking"
        description="Weight and letter-spacing variables available alongside the size scale."
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {Object.entries(typography.fontWeight).map(([name, value]) => (
            <span
              key={name}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <VarChip name={`--font-weight-${name}`} />
              <span
                style={{
                  fontWeight: Number(value),
                  fontSize: "var(--text-body-sm)",
                  marginRight: 12,
                }}
              >
                {value}
              </span>
            </span>
          ))}
        </div>
        <div
          style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}
        >
          <VarChip name="--tracking-heading-display" />
          <VarChip name="--tracking-overline" />
          <VarChip name="--tracking-none" />
        </div>
      </Section>
    </div>
  );
}
