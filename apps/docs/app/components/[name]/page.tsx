import { cadsManifest } from "@moshebaricdo/cads-react/manifest";
import type { Metadata } from "next";
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
  getComponentStatus,
  getComponentStorybookUrl,
} from "@/lib/componentExternalLinks";
import { docsMetadata } from "@/lib/docsMetadata";
import pageStyles from "@/components/DocsTemplatePage.module.scss";

const SOLO_ROUTE_EXCLUDES = new Set([
  "FaIcon",
  "TablePagination",
  // AI Chat atoms live on the custom /components/ai-chat page.
  "AiChatInput",
  "AiChatMessage",
  "AiChatFileChip",
  "ChatFileRemoveButton",
]);

function findComponent(name: string) {
  return cadsManifest.components.find(
    (c) => c.name.toLowerCase() === name.toLowerCase(),
  );
}

export function generateStaticParams() {
  return cadsManifest.components
    .filter((c) => !SOLO_ROUTE_EXCLUDES.has(c.exportName))
    .map((c) => ({ name: c.name.toLowerCase() }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}): Promise<Metadata> {
  const { name } = await params;
  const component = findComponent(name);
  if (!component) return {};
  const category = componentCategory(component.exportName);
  return docsMetadata(
    category?.itemLabel ?? component.name,
    component.description,
  );
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const component = findComponent(name);
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
  const status = getComponentStatus(component.exportName);
  const muiDocsUrl = getComponentMuiDocsUrl(component.exportName);

  return (
    <div className={pageStyles.page}>
      <ComponentOverview
        title={category?.itemLabel ?? component.name}
        description={component.description}
        figmaUrl={figmaUrl}
        storybookUrl={storybookUrl}
        status={status}
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
