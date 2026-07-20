import { cadsManifest } from "@codeai/cads-react/manifest";
import { notFound } from "next/navigation";
import { PropsTable } from "@/components/PropsTable";
import { InteractivePlayground } from "@/components/InteractivePlayground";
import { CodeBlock, PageHeader, Section, VarChip } from "@/components/docs-ui";
import { componentCategory } from "@/lib/nav";

export function generateStaticParams() {
  return cadsManifest.components
    .filter((c) => c.exportName !== "FaIcon")
    .map((c) => ({ name: c.name.toLowerCase() }));
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const component = cadsManifest.components.find(
    (c) => c.name.toLowerCase() === name.toLowerCase(),
  );
  if (!component) notFound();

  const figmaUrl = component.figma?.nodeId
    ? `https://www.figma.com/design/${component.figma.fileKey}/CodeAI-Design-System--CADS-?node-id=${component.figma.nodeId.replace(":", "-")}`
    : `https://www.figma.com/design/${component.figma?.fileKey ?? cadsManifest.figmaFileKey}/CodeAI-Design-System--CADS-`;

  const category = componentCategory(component.exportName);
  const importCode = `import { ${component.exportName} } from "${component.importFrom}";`;

  return (
    <div>
      <PageHeader
        eyebrow={category ? `Components · ${category.sectionLabel}` : "Components"}
        title={category?.itemLabel ?? component.name}
        lead={component.description}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 12,
            marginTop: 16,
          }}
        >
          <div style={{ flex: "1 1 380px", minWidth: 0 }}>
            <CodeBlock code={importCode} />
          </div>
          <a
            href={figmaUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              height: "var(--control-height-small)",
              padding: "0 14px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border-neutral-primary)",
              background: "var(--background-neutral-primary)",
              color: "var(--text-neutral-primary)",
              fontSize: "var(--text-body-sm)",
              fontWeight: 500,
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            Open in Figma
            <span aria-hidden style={{ color: "var(--text-neutral-tertiary)" }}>
              ↗
            </span>
          </a>
        </div>
      </PageHeader>

      <Section
        title="Playground"
        description="Adjust props to explore every variant. The snippet below the preview stays in sync — copy it straight into your app."
      >
        <InteractivePlayground
          key={component.exportName}
          component={component}
        />
      </Section>

      <Section
        title="Props"
        description="Full prop API from the CADS manifest — the same source AI agents consume."
      >
        <PropsTable props={component.props} />
      </Section>

      <Section
        title="Usage guidelines"
        description="Rules that keep usage aligned with the Figma spec."
      >
        <ul
          style={{
            margin: 0,
            padding: 0,
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {component.usageRules.map((rule) => (
            <li
              key={rule}
              style={{
                display: "flex",
                gap: 10,
                alignItems: "baseline",
                padding: "10px 14px",
                border: "1px solid var(--border-neutral-primary)",
                borderRadius: "var(--radius-md)",
                background: "var(--background-neutral-secondary)",
                fontSize: "var(--text-body-sm)",
                lineHeight: "var(--leading-body-sm)",
              }}
            >
              <span
                aria-hidden
                style={{ color: "var(--text-success-primary)", flexShrink: 0 }}
              >
                ✓
              </span>
              {rule}
            </li>
          ))}
        </ul>
      </Section>

      <Section
        title="Design variables"
        description="Semantic variables this component depends on. Click a chip to copy its var() expression."
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {component.variableDependencies.map((v) => (
            <VarChip key={v} name={v} />
          ))}
        </div>
      </Section>

      <Section
        title="Example"
        description="Reference composition from the manifest."
      >
        <CodeBlock code={component.example} />
      </Section>
    </div>
  );
}
