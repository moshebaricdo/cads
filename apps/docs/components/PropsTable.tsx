import type { CadsPropDef } from "@codeai/cads-react";

export function PropsTable({ props }: { props: CadsPropDef[] }) {
  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "var(--text-body-sm)",
      }}
    >
      <thead>
        <tr>
          {["Name", "Type", "Default", "Description"].map((h) => (
            <th
              key={h}
              style={{
                textAlign: "left",
                borderBottom: "1px solid var(--ds-border-neutral-primary)",
                padding: "8px 12px",
                color: "var(--ds-text-neutral-secondary)",
                fontWeight: 600,
              }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {props.map((p) => (
          <tr key={p.name}>
            <td style={{ padding: "8px 12px", borderBottom: "1px solid var(--ds-border-neutral-primary)" }}>
              <code>{p.name}</code>
              {p.required ? " *" : ""}
            </td>
            <td style={{ padding: "8px 12px", borderBottom: "1px solid var(--ds-border-neutral-primary)" }}>
              <code>{p.type}</code>
            </td>
            <td style={{ padding: "8px 12px", borderBottom: "1px solid var(--ds-border-neutral-primary)" }}>
              {p.default ? <code>{p.default}</code> : "—"}
            </td>
            <td style={{ padding: "8px 12px", borderBottom: "1px solid var(--ds-border-neutral-primary)" }}>
              {p.description ?? "—"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
