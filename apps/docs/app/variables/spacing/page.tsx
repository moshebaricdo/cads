import { elevation, shape, spacing } from "@codeai/cads-variables";

export default function SpacingPage() {
  return (
    <div>
      <h1
        style={{
          fontFamily: "var(--font-heading)",
          fontWeight: 500,
          fontSize: "var(--text-heading-lg)",
        }}
      >
        Spacing &amp; shape
      </h1>

      <h2 style={{ fontSize: "var(--text-heading-xs)" }}>Spacing</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {Object.entries(spacing).map(([name, value]) => (
          <div key={name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <code style={{ width: 80 }}>--space-{name}</code>
            <div
              style={{
                height: 12,
                width: value,
                background: "var(--background-brand-primary)",
                borderRadius: 2,
              }}
            />
            <span style={{ color: "var(--text-neutral-secondary)", fontSize: "var(--text-body-xs)" }}>
              {value}
            </span>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: "var(--text-heading-xs)", marginTop: 32 }}>Radii</h2>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {Object.entries(shape).map(([name, value]) => (
          <div key={name} style={{ textAlign: "center" }}>
            <div
              style={{
                width: 64,
                height: 64,
                background: "var(--background-brand-light)",
                border: "1px solid var(--border-brand-primary)",
                borderRadius: value,
              }}
            />
            <div style={{ fontSize: "var(--text-body-xxs)", marginTop: 6 }}>
              {name}
              <br />
              {value}
            </div>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: "var(--text-heading-xs)", marginTop: 32 }}>Elevation</h2>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        {Object.entries(elevation).map(([name, value]) => (
          <div
            key={name}
            style={{
              width: 120,
              height: 80,
              background: "var(--background-neutral-primary)",
              borderRadius: "var(--radius-md)",
              boxShadow: value,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "var(--text-body-xs)",
            }}
          >
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}
