"use client";

import { colorVarsLight } from "@codeai/cads-variables";

export default function ColorVariablesPage() {
  const entries = Object.entries(colorVarsLight).sort(([a], [b]) =>
    a.localeCompare(b),
  );

  return (
    <div>
      <h1
        style={{
          fontFamily: "var(--font-heading)",
          fontWeight: 500,
          fontSize: "var(--text-heading-lg)",
        }}
      >
        Color variables
      </h1>
      <p style={{ color: "var(--ds-text-neutral-secondary)" }}>
        Generated from <code>codeAiColorSystem.json</code>. Dark mode values
        apply under <code>.dark</code>. Showing light-mode resolved hexes.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 12,
          marginTop: 24,
        }}
      >
        {entries.map(([name, hex]) => (
          <div
            key={name}
            style={{
              border: "1px solid var(--ds-border-neutral-primary)",
              borderRadius: "var(--radius-sm)",
              overflow: "hidden",
            }}
          >
            <div style={{ height: 48, background: hex }} />
            <div style={{ padding: 8, fontSize: "var(--text-body-xxs)" }}>
              <div>
                <code>--ds-{name}</code>
              </div>
              <div style={{ color: "var(--ds-text-neutral-secondary)" }}>
                {hex}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
