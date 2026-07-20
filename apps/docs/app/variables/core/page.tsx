import { controlHeights, elevation, motion } from "@codeai/cads-variables";
import { PageHeader, Section, VarChip } from "@/components/docs-ui";

const HEIGHTS = [
  { key: "large", varName: "--control-height-large", sizeProp: "large" },
  { key: "medium", varName: "--control-height-medium", sizeProp: "medium" },
  { key: "small", varName: "--control-height-small", sizeProp: "small" },
  {
    key: "extraSmall",
    varName: "--control-height-extra-small",
    sizeProp: "extraSmall",
  },
] as const;

const DURATIONS = [
  {
    varName: "--duration-instant",
    value: motion.durationInstant,
    usage: "State changes that must feel immediate (focus rings)",
  },
  {
    varName: "--duration-short",
    value: motion.durationShort,
    usage: "Hover / press fills, borders, most control chrome",
  },
  {
    varName: "--duration-medium",
    value: motion.durationMedium,
    usage: "Larger surface transitions (menus, panels)",
  },
];

const EASINGS = [
  {
    varName: "--easing-standard",
    value: motion.easingStandard,
    usage: "Default for color / opacity / transform transitions",
  },
  {
    varName: "--easing-emphasized",
    value: motion.easingEmphasized,
    usage: "Entrances and attention-drawing movement",
  },
];

export default function CoreStylesPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Foundations"
        title="Core styles"
        lead="Elevation, motion, and control sizing — the non-color, non-type variables that make CADS chrome feel consistent."
      />

      <Section
        title="Elevation"
        description="Three shadow levels. Cards and popovers sit at sm/md; overlays like dialogs and drawers use lg."
      >
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {Object.entries(elevation).map(([name, value]) => {
            const varName = `--shadow-${name.replace("shadow", "").toLowerCase()}`;
            return (
              <div key={name} style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: 150,
                    height: 96,
                    background: "var(--background-neutral-primary)",
                    border: "1px solid var(--border-neutral-primary)",
                    borderRadius: "var(--radius-lg)",
                    boxShadow: value,
                    marginBottom: 12,
                  }}
                />
                <VarChip name={varName} />
              </div>
            );
          })}
        </div>
      </Section>

      <Section
        title="Motion"
        description="Figma has no motion collection yet, so this is a deliberately small CADS set for control chrome. Hover the cards to feel each duration with the standard easing."
      >
        <div className="docs-table-wrap" style={{ marginBottom: 16 }}>
          <table className="docs-table">
            <thead>
              <tr>
                <th>Variable</th>
                <th>Value</th>
                <th>Usage</th>
              </tr>
            </thead>
            <tbody>
              {[...DURATIONS, ...EASINGS].map((row) => (
                <tr key={row.varName}>
                  <td>
                    <VarChip name={row.varName} />
                  </td>
                  <td>
                    <code>{row.value}</code>
                  </td>
                  <td
                    style={{
                      color: "var(--text-neutral-secondary)",
                      fontSize: "var(--text-body-sm)",
                    }}
                  >
                    {row.usage}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p
          style={{
            margin: 0,
            fontSize: "var(--text-body-sm)",
            color: "var(--text-neutral-secondary)",
            maxWidth: 640,
          }}
        >
          For color/border/shadow transitions, prefer the composite{" "}
          <code>--transition-colors</code> shorthand over hand-rolled
          transition lists.
        </p>
      </Section>

      <Section
        title="Control heights"
        description="Fixed heights driven by the size prop on every CADS control — never invent intermediate heights."
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 20,
            flexWrap: "wrap",
            border: "1px solid var(--border-neutral-primary)",
            borderRadius: "var(--radius-lg)",
            padding: 20,
          }}
        >
          {HEIGHTS.map((h) => (
            <div key={h.key} style={{ textAlign: "center" }}>
              <div
                style={{
                  height: controlHeights[h.key],
                  minWidth: 104,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border-brand-primary)",
                  background: "var(--background-brand-light)",
                  fontSize: "var(--text-body-xs)",
                  fontWeight: 500,
                  marginBottom: 10,
                }}
              >
                {controlHeights[h.key]}
              </div>
              <div style={{ marginBottom: 4 }}>
                <code>size=&quot;{h.sizeProp}&quot;</code>
              </div>
              <VarChip name={h.varName} />
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
