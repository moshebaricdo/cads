import type { CadsPropDef } from "@codeai/cads-react/manifest";

function TypeCell({ type }: { type: string }) {
  const parts = type.split("|").map((p) => p.trim());
  const isEnum =
    parts.length > 1 && parts.every((p) => /^["'].*["']$/.test(p));
  if (isEnum) {
    return (
      <span style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        {parts.map((p) => (
          <code key={p}>{p.replace(/["']/g, "")}</code>
        ))}
      </span>
    );
  }
  return <code>{type}</code>;
}

export function PropsTable({ props }: { props: CadsPropDef[] }) {
  return (
    <div className="docs-table-wrap">
      <table className="docs-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {props.map((p) => (
            <tr key={p.name}>
              <td style={{ whiteSpace: "nowrap" }}>
                <code>{p.name}</code>
                {p.required ? (
                  <span
                    style={{
                      marginLeft: 6,
                      fontSize: "var(--text-body-xxs)",
                      fontWeight: 600,
                      color: "var(--text-error-primary)",
                    }}
                  >
                    required
                  </span>
                ) : null}
              </td>
              <td>
                <TypeCell type={p.type} />
              </td>
              <td style={{ whiteSpace: "nowrap" }}>
                {p.default ? <code>{p.default}</code> : "—"}
              </td>
              <td
                style={{
                  color: "var(--text-neutral-secondary)",
                  fontSize: "var(--text-body-sm)",
                }}
              >
                {p.description ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
