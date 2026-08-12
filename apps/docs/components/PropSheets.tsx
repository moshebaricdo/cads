"use client";

import { Link } from "@moshebaricdo/cads-react";
import type { CadsPropDef } from "@moshebaricdo/cads-react/manifest";
import type { PropSheet } from "@/lib/propSheets";
import ui from "./docs-ui.module.scss";
import styles from "./PropSheets.module.scss";

function TypeCell({ type }: { type: string }) {
  return <code className={styles.propType}>{type}</code>;
}

function PropSheetTable({
  title,
  props,
  muiDocsUrl,
}: PropSheet & { muiDocsUrl?: string }) {
  return (
    <div className={styles.sheet}>
      <div className={styles.headingRow}>
        <h5 className={styles.heading}>{title}</h5>
        {muiDocsUrl ? (
          <Link
            href={muiDocsUrl}
            size="small"
            type="primary"
            target="_blank"
            rel="noreferrer"
          >
            View MUI docs
          </Link>
        ) : null}
      </div>
      <div className={`${ui.tableWrap} ${styles.tableWrap}`}>
        <table className={`${ui.table} ${styles.table}`}>
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

export function PropSheets({
  sheets,
  muiDocsUrl,
}: {
  sheets: PropSheet[];
  /** Shown on the first sheet heading when the sheet has no muiDocsUrl. */
  muiDocsUrl?: string;
}) {
  if (!sheets.length) return null;
  return (
    <div className={styles.root}>
      {sheets.map((sheet, index) => (
        <PropSheetTable
          key={sheet.title}
          {...sheet}
          muiDocsUrl={
            sheet.muiDocsUrl ?? (index === 0 ? muiDocsUrl : undefined)
          }
        />
      ))}
    </div>
  );
}
