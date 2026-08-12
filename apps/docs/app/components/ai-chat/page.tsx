import { cadsManifest } from "@codeai/cads-react/manifest";
import { ComponentOverview } from "@/components/ComponentOverview";
import { ComponentPageNav } from "@/components/ComponentPageNav";
import { adjacentComponents, componentCategory } from "@/lib/nav";
import { getComponentStatus } from "@/lib/componentExternalLinks";
import { docsMetadata } from "@/lib/docsMetadata";
import pageStyles from "@/components/DocsTemplatePage.module.scss";
import { AiChatPageContent } from "./AiChatPageContent";

const AI_CHAT_DESCRIPTION =
  "This set of components assembles to form our AI chat experiences. Note that differences between chat message styles differentiate the TA (Teacher) experience from the Tutor (student) experience.";

export const metadata = docsMetadata("AI Chat", AI_CHAT_DESCRIPTION);

export default function AiChatPage() {
  const component = cadsManifest.components.find(
    (entry) => entry.exportName === "AiChatInput",
  );
  if (!component) return null;

  const figmaUrl = component.figma?.nodeId
    ? `https://www.figma.com/design/${component.figma.fileKey}/CodeAI-Design-System--CADS-?node-id=${component.figma.nodeId.replace(":", "-")}`
    : `https://www.figma.com/design/${cadsManifest.figmaFileKey}/CodeAI-Design-System--CADS-?node-id=17246-23801`;

  const category = componentCategory(component.exportName);
  const { previous, next } = adjacentComponents(component.exportName);
  const status = getComponentStatus(component.exportName);

  return (
    <div className={pageStyles.page}>
      <ComponentOverview
        title={category?.itemLabel ?? "AI Chat"}
        description={AI_CHAT_DESCRIPTION}
        figmaUrl={figmaUrl}
        status={status}
      />

      <AiChatPageContent />

      <ComponentPageNav previous={previous} next={next} />
    </div>
  );
}
