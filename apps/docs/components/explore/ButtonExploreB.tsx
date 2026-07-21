"use client";

import { useState } from "react";
import { Link as CadsLink, SegmentedButton } from "@codeai/cads-react";
import type { CadsComponentManifest } from "@codeai/cads-react/manifest";
import { InteractivePlayground } from "@/components/InteractivePlayground";
import { PropsTable } from "@/components/PropsTable";
import { CodeBlock, VarChip } from "@/components/docs-ui";
import { ExploreHeader } from "./ExploreChrome";

type Props = {
  component: CadsComponentManifest;
  categoryLabel: string;
  importCode: string;
  figmaUrl: string;
};

const DOC_SECTIONS = [
  { id: "props", label: "Props" },
  { id: "usage", label: "Usage" },
  { id: "variables", label: "Variables" },
  { id: "example", label: "Example" },
] as const;

export function ButtonExploreB({
  component,
  categoryLabel,
  importCode,
  figmaUrl,
}: Props) {
  const [mode, setMode] = useState("preview");

  return (
    <>
      <ExploreHeader
        eyebrow={`Components · ${categoryLabel}`}
        title="Button"
        lead={component.description}
      >
        <div className="docs-explore-meta-row">
          <CodeBlock code={importCode} />
          <CadsLink href={figmaUrl} size="small" target="_blank" rel="noreferrer">
            Open in Figma
          </CadsLink>
        </div>
      </ExploreHeader>

      <div className="docs-explore-mode-bar">
        <SegmentedButton
          size="small"
          aria-label="Page mode"
          value={mode}
          onChange={setMode}
          options={[
            { value: "preview", label: "Preview" },
            { value: "docs", label: "Docs" },
          ]}
        />
        <span
          style={{
            fontSize: "var(--text-body-xs)",
            color: "var(--text-neutral-secondary)",
          }}
        >
          {mode === "preview"
            ? "Interactive playground"
            : "Reference — props, usage, variables"}
        </span>
      </div>

      {mode === "preview" ? (
        <div className="docs-explore-playground-hero">
          <InteractivePlayground
            key={`${component.exportName}-preview`}
            component={component}
          />
        </div>
      ) : (
        <div className="docs-explore-doc-layout">
          <nav className="docs-explore-doc-nav" aria-label="On this page">
            {DOC_SECTIONS.map((section) => (
              <a key={section.id} href={`#${section.id}`}>
                {section.label}
              </a>
            ))}
          </nav>

          <div className="docs-explore-doc-body">
            <section id="props">
              <h2 className="docs-explore-ref-section-title">Props</h2>
              <PropsTable props={component.props} />
            </section>

            <section id="usage">
              <h2 className="docs-explore-ref-section-title">Usage</h2>
              <ul className="docs-explore-usage-list">
                {component.usageRules.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ul>
            </section>

            <section id="variables">
              <h2 className="docs-explore-ref-section-title">Variables</h2>
              <div className="docs-explore-chip-row">
                {component.variableDependencies.map((v) => (
                  <VarChip key={v} name={v} />
                ))}
              </div>
            </section>

            <section id="example">
              <h2 className="docs-explore-ref-section-title">Example</h2>
              <CodeBlock code={component.example} />
            </section>
          </div>
        </div>
      )}
    </>
  );
}
