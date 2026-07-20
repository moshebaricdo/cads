import { colorVarsDark, colorVarsLight } from "@codeai/cads-variables";
import { PageHeader, Section, VarChip } from "@/components/docs-ui";

type Layer = "background" | "text" | "border";

const LAYERS: { id: Layer; label: string; description: string }[] = [
  {
    id: "background",
    label: "Background",
    description: "Surface and fill colors for pages, cards, and control chrome.",
  },
  {
    id: "text",
    label: "Text",
    description: "Foreground colors for copy, labels, and icon glyphs.",
  },
  {
    id: "border",
    label: "Border",
    description: "Stroke colors for dividers, control outlines, and focus rings.",
  },
];

const ROLE_ORDER = [
  "neutral",
  "brand",
  "selected",
  "focused",
  "accent-pink",
  "accent-orange",
  "error",
  "warning",
  "success",
  "info",
  "disabled",
] as const;

const ROLE_LABELS: Record<string, string> = {
  neutral: "Neutral",
  brand: "Brand",
  selected: "Selected",
  focused: "Focused",
  "accent-pink": "Accent · Pink",
  "accent-orange": "Accent · Orange",
  error: "Error",
  warning: "Warning",
  success: "Success",
  info: "Info",
  disabled: "Disabled",
};

/** Suffix rank so ramps read primary → strong instead of alphabetically. */
const SUFFIX_RANK = [
  "primary",
  "secondary",
  "tertiary",
  "quaternary",
  "quinary",
  "senary",
  "septenary",
  "octonary",
  "placeholder",
  "light",
  "mid",
  "strong",
  "solid",
];

function roleOf(name: string, layer: Layer): string | null {
  const rest = name.slice(layer.length + 1);
  for (const role of ROLE_ORDER) {
    if (rest === role || rest.startsWith(`${role}-`)) return role;
  }
  return null;
}

function suffixRank(name: string): number {
  const parts = name.split("-");
  for (let i = parts.length - 1; i >= 0; i -= 1) {
    const idx = SUFFIX_RANK.indexOf(parts[i]);
    if (idx !== -1) return idx;
  }
  return SUFFIX_RANK.length;
}

function Swatch({
  name,
  light,
  dark,
}: {
  name: string;
  light: string;
  dark: string;
}) {
  return (
    <div
      style={{
        border: "1px solid var(--border-neutral-primary)",
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
        background: "var(--background-neutral-primary)",
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", height: 52 }}>
        <div style={{ background: light }} title={`Light: ${light}`} />
        <div
          style={{ background: dark, borderLeft: "1px solid var(--border-neutral-primary)" }}
          title={`Dark: ${dark}`}
        />
      </div>
      <div
        style={{
          padding: "8px 10px",
          borderTop: "1px solid var(--border-neutral-primary)",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <VarChip name={name} />
        <div
          style={{
            fontSize: "var(--text-body-xxs)",
            fontFamily: "var(--font-mono)",
            color: "var(--text-neutral-tertiary)",
            display: "flex",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <span>{light}</span>
          <span>{dark}</span>
        </div>
      </div>
    </div>
  );
}

export default function ColorVariablesPage() {
  const names = Object.keys(colorVarsLight);

  return (
    <div>
      <PageHeader
        eyebrow="Foundations"
        title="Color"
        lead={
          <>
            {names.length} semantic color variables generated from{" "}
            <code>codeAiColorSystem.json</code>. Each swatch shows its light
            (left) and dark (right) value; dark values apply automatically
            under a <code>.dark</code> root class. Click a variable name to
            copy its <code>var()</code> expression.
          </>
        }
      />

      {LAYERS.map((layer) => {
        const layerNames = names.filter((n) => n.startsWith(`${layer.id}-`));
        return (
          <Section
            key={layer.id}
            title={layer.label}
            description={layer.description}
            id={layer.id}
          >
            {ROLE_ORDER.map((role) => {
              const roleNames = layerNames
                .filter((n) => roleOf(n, layer.id) === role)
                .sort(
                  (a, b) =>
                    suffixRank(a) - suffixRank(b) ||
                    a.localeCompare(b, undefined, { numeric: true }),
                );
              if (!roleNames.length) return null;
              return (
                <div key={role} style={{ marginBottom: 24 }}>
                  <div className="docs-overline" style={{ marginBottom: 10 }}>
                    {ROLE_LABELS[role]}
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(230px, 1fr))",
                      gap: 12,
                    }}
                  >
                    {roleNames.map((name) => (
                      <Swatch
                        key={name}
                        name={name}
                        light={colorVarsLight[name as keyof typeof colorVarsLight]}
                        dark={colorVarsDark[name as keyof typeof colorVarsDark]}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </Section>
        );
      })}
    </div>
  );
}
