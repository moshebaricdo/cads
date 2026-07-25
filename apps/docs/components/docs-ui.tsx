import type { ReactNode } from "react";
import { CopyButton, VarChip } from "./CopyControls";
import ui from "./docs-ui.module.scss";

export function PageHeader({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow?: string;
  title: string;
  lead?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header style={{ marginBottom: "var(--spacing-p-m)" }}>
      {eyebrow ? <p className={ui.eyebrow}>{eyebrow}</p> : null}
      <h1 className={ui.h1}>{title}</h1>
      {lead ? <p className={ui.lead}>{lead}</p> : null}
      {children}
    </header>
  );
}

export function Section({
  title,
  description,
  id,
  children,
}: {
  title: string;
  description?: ReactNode;
  id?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={ui.section}>
      <h2 className={ui.h2}>{title}</h2>
      {description ? <p className={ui.sectionDesc}>{description}</p> : null}
      {!description ? <div style={{ height: 12 }} /> : null}
      {children}
    </section>
  );
}

export function CodeBlock({ code }: { code: string }) {
  return (
    <figure className={ui.codeblock}>
      <pre>
        <code>{code}</code>
      </pre>
      <CopyButton text={code} />
    </figure>
  );
}

export { CopyButton, VarChip };
