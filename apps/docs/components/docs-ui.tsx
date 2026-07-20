import type { ReactNode } from "react";
import { CopyButton, VarChip } from "./CopyControls";

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
    <header style={{ marginBottom: "var(--space-m)" }}>
      {eyebrow ? <p className="docs-eyebrow">{eyebrow}</p> : null}
      <h1 className="docs-h1">{title}</h1>
      {lead ? <p className="docs-lead">{lead}</p> : null}
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
    <section id={id} className="docs-section">
      <h2 className="docs-h2">{title}</h2>
      {description ? <p className="docs-section-desc">{description}</p> : null}
      {!description ? <div style={{ height: 12 }} /> : null}
      {children}
    </section>
  );
}

export function CodeBlock({ code }: { code: string }) {
  return (
    <figure className="docs-codeblock">
      <pre>
        <code>{code}</code>
      </pre>
      <CopyButton text={code} />
    </figure>
  );
}

export { CopyButton, VarChip };
