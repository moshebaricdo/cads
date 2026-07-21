import { cadsManifest } from "@codeai/cads-react/manifest";
import { componentCategory } from "@/lib/nav";

export function getButtonManifest() {
  const component = cadsManifest.components.find(
    (c) => c.exportName === "Button",
  );
  if (!component) {
    throw new Error("Button missing from cadsManifest");
  }
  return component;
}

export function buttonFigmaUrl(
  component: ReturnType<typeof getButtonManifest>,
): string {
  if (component.figma?.nodeId) {
    return `https://www.figma.com/design/${component.figma.fileKey}/CodeAI-Design-System--CADS-?node-id=${component.figma.nodeId.replace(":", "-")}`;
  }
  return `https://www.figma.com/design/${component.figma?.fileKey ?? cadsManifest.figmaFileKey}/CodeAI-Design-System--CADS-`;
}

export function buttonMeta() {
  const component = getButtonManifest();
  const category = componentCategory(component.exportName);
  return {
    component,
    category,
    importCode: `import { ${component.exportName} } from "${component.importFrom}";`,
    figmaUrl: buttonFigmaUrl(component),
  };
}
