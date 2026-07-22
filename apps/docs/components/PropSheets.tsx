import type { CadsPropDef } from "@codeai/cads-react/manifest";
import type { PropSheet } from "@/lib/propSheets";
import styles from "./PropSheets.module.css";

function TypeCell({ type }: { type: string }) {
  return <code className={styles.propType}>{type}</code>;
}

function PropSheetTable({ title, props }: PropSheet) {
  return (
    <div className={styles.sheet}>
      <h5 className={styles.heading}>{title}</h5>
      <div className={`docs-table-wrap ${styles.tableWrap}`}>
        <table className={`docs-table ${styles.table}`}>
          <thead>
            <tr>
              <th style={{ width: 140 }}>Prop</th>
              <th style={{ width: 280 }}>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {props.map((p) => (
              <PropSheetRow key={p.name} prop={p} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PropSheetRow({ prop }: { prop: CadsPropDef }) {
  return (
    <tr>
      <td>
        <code className={styles.propName}>{prop.name}</code>
      </td>
      <td>
        <TypeCell type={prop.type} />
      </td>
      <td className={styles.propDesc}>{prop.description ?? "—"}</td>
    </tr>
  );
}

export function PropSheets({ sheets }: { sheets: PropSheet[] }) {
  if (!sheets.length) return null;
  return (
    <div className={styles.root}>
      {sheets.map((sheet) => (
        <PropSheetTable key={sheet.title} {...sheet} />
      ))}
    </div>
  );
}
