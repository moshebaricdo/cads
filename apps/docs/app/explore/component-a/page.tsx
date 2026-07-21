import { InteractivePlayground } from "@/components/InteractivePlayground";
import { PropsTable } from "@/components/PropsTable";
import { CodeBlock, VarChip } from "@/components/docs-ui";
import { buttonMeta } from "@/components/explore/button-data";
import {
  ExploreBanner,
  ExploreHeader,
  ExploreSurface,
} from "@/components/explore/ExploreChrome";

export const metadata = {
  title: "Explore Component A — Button — CADS",
  description: "Playground-first Button docs option.",
};

export default function ExploreComponentAPage() {
  const { component, category, importCode, figmaUrl } = buttonMeta();
  const categoryLabel = category?.sectionLabel ?? "Actions";

  return (
    <ExploreSurface>
      <ExploreBanner option="Component A" title="Playground-first · Button" />

      <ExploreHeader
        eyebrow={`Components · ${categoryLabel}`}
        title="Button"
        lead={component.description}
      >
        <div className="docs-explore-meta-row">
          <CodeBlock code={importCode} />
          <a
            href={figmaUrl}
            target="_blank"
            rel="noreferrer"
            className="docs-explore-figma-btn"
          >
            Open in Figma
            <span aria-hidden>↗</span>
          </a>
        </div>
      </ExploreHeader>

      <div className="docs-explore-playground-hero">
        <InteractivePlayground
          key={component.exportName}
          component={component}
        />
      </div>

      <div className="docs-explore-quiet-block">
        <p className="docs-explore-quiet-title">Reference</p>
        <div className="docs-explore-ref-stack">
          <section>
            <h2 className="docs-explore-ref-section-title">Props</h2>
            <PropsTable props={component.props} />
          </section>

          <section>
            <h2 className="docs-explore-ref-section-title">Usage</h2>
            <ul className="docs-explore-usage-list">
              {component.usageRules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="docs-explore-ref-section-title">Variables</h2>
            <div className="docs-explore-chip-row">
              {component.variableDependencies.map((v) => (
                <VarChip key={v} name={v} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="docs-explore-ref-section-title">Example</h2>
            <CodeBlock code={component.example} />
          </section>
        </div>
      </div>
    </ExploreSurface>
  );
}
