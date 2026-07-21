import Link from "next/link";
import type { ReactNode } from "react";

const FIGMA_URL =
  "https://www.figma.com/design/DGekOeToRVifvFAhfqpeC1/CodeAI-Design-System--CADS-";

export function ExploreSurface({ children }: { children: ReactNode }) {
  return <div className="docs-explore-surface">{children}</div>;
}

export function ExploreBanner({
  option,
  title,
}: {
  option: string;
  title: string;
}) {
  return (
    <div className="docs-explore-banner">
      <div className="docs-explore-banner-meta">
        <span className="docs-explore-banner-label">Explore</span>
        <span className="docs-explore-banner-title">
          {option} · {title}
        </span>
      </div>
      <div className="docs-explore-banner-links">
        <Link href="/explore">All options</Link>
        <a href={FIGMA_URL} target="_blank" rel="noreferrer">
          Figma ↗
        </a>
      </div>
    </div>
  );
}

export function ExploreHeader({
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
    <header className="docs-explore-header">
      {eyebrow ? <p className="docs-eyebrow">{eyebrow}</p> : null}
      <h1 className="docs-h1">{title}</h1>
      {lead ? <p className="docs-lead">{lead}</p> : null}
      {children}
    </header>
  );
}

export { FIGMA_URL };
