import { cadsManifest } from "@codeai/cads-react/manifest";
import { notFound } from "next/navigation";
import { PropsTable } from "@/components/PropsTable";
import { InteractivePlayground } from "@/components/InteractivePlayground";

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

  return (
    <div>
      <h1
        style={{
          fontFamily: "var(--font-heading)",
          fontWeight: 500,
          fontSize: "var(--text-heading-lg)",
          margin: "0 0 8px",
        }}
      >
        {component.name}
      </h1>
      <p style={{ color: "var(--text-neutral-secondary)", marginTop: 0 }}>
        {component.description}
      </p>
      <p style={{ fontSize: "var(--text-body-sm)" }}>
        <a href={figmaUrl} target="_blank" rel="noreferrer">
          Open in Figma →
        </a>
        {" · "}
        <code>{`import { ${component.exportName} } from "${component.importFrom}"`}</code>
      </p>

      <h2 style={{ marginTop: 32, fontSize: "var(--text-heading-xs)" }}>
        Playground
      </h2>
      <InteractivePlayground key={component.exportName} component={component} />

      <h2 style={{ marginTop: 32, fontSize: "var(--text-heading-xs)" }}>
        Props
      </h2>
      <PropsTable props={component.props} />

      <h2 style={{ marginTop: 32, fontSize: "var(--text-heading-xs)" }}>
        Usage rules
      </h2>
      <ul>
        {component.usageRules.map((rule) => (
          <li key={rule} style={{ marginBottom: 6 }}>
            {rule}
          </li>
        ))}
      </ul>

      <h2 style={{ marginTop: 32, fontSize: "var(--text-heading-xs)" }}>
        Variable dependencies
      </h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {component.variableDependencies.map((v) => (
          <code
            key={v}
            style={{
              padding: "4px 8px",
              background: "var(--background-neutral-secondary)",
              borderRadius: "var(--radius-sm)",
            }}
          >
            {v}
          </code>
        ))}
      </div>
    </div>
  );
}
