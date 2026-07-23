import { cadsManifest } from "@codeai/cads-react/manifest";
import { notFound } from "next/navigation";
import { TemplatePlayground } from "@/components/TemplatePlayground";
import { ComponentOverview } from "@/components/ComponentOverview";
import { ComponentPageNav } from "@/components/ComponentPageNav";
import { PropSheets } from "@/components/PropSheets";
import {
  adjacentComponents,
  componentCategory,
} from "@/lib/nav";
import {
  COMPONENT_PROP_SHEETS,
  defaultPropSheets,
} from "@/lib/propSheets";
import {
  getComponentMuiDocsUrl,
  getComponentStorybookUrl,
} from "@/lib/componentExternalLinks";
import pageStyles from "@/components/DocsTemplatePage.module.css";

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
  const { previous, next } = adjacentComponents(component.exportName);
  const propSheets =
    COMPONENT_PROP_SHEETS[component.exportName] ??
    defaultPropSheets(component);
  const storybookUrl = getComponentStorybookUrl(component.exportName);
  const muiDocsUrl = getComponentMuiDocsUrl(component.exportName);

  return (
    <div className={pageStyles.page}>
      <ComponentOverview
        title={category?.itemLabel ?? component.name}
        description={component.description}
        figmaUrl={figmaUrl}
        storybookUrl={storybookUrl}
      />

      <TemplatePlayground
        key={component.exportName}
        component={component}
      />

      <PropSheets sheets={propSheets} muiDocsUrl={muiDocsUrl} />

      <ComponentPageNav previous={previous} next={next} />
    </div>
  );
}
