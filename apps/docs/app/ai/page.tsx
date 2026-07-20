import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { CodeBlock, PageHeader, Section } from "@/components/docs-ui";

export const metadata = {
  title: "AI setup — CADS",
  description:
    "How AI agents and Claude build high-fidelity CADS prototypes: llms.txt, the component manifest, and the cads-prototyping Claude skill.",
};

const SKILL_ZIP_ROUTE = "/downloads/cads-prototyping.zip";

function skillZipAvailable(): boolean {
  try {
    return fs.existsSync(
      path.join(process.cwd(), "public", "downloads", "cads-prototyping.zip"),
    );
  } catch {
    return false;
  }
}

const WORKFLOW_STEPS = [
  {
    title: "Prompt Claude",
    body: "Ask for a CADS prototype in plain language — “Create a CADS teacher onboarding form with school name, role, and Continue.”",
  },
  {
    title: "Constrained spec",
    body: "The skill translates the request into a prototype JSON limited to manifest components, real props, and layout primitives (stack, inline, surface). No invented APIs, no raw hex.",
  },
  {
    title: "Self-contained artifact",
    body: "Claude emits a single HTML artifact that inlines the real CADS runtime (components, variables, icon fonts) and mounts the spec. It renders pixel-true with zero hosting or npm install.",
  },
  {
    title: "Iterate & share",
    body: "Edits regenerate the artifact from the updated JSON. Publish organization-only and any org member can view or remix it.",
  },
];

const UI_TERRITORIES = [
  {
    name: "Lab shell",
    model: "Fixed full-viewport app shell — 50px brand bar, icon rail, collapsible panel, workspace.",
    density: "Dense: compact panel headers with small-caps labels, small/extraSmall controls.",
  },
  {
    name: "Dashboard page",
    model: "Brand bar + scrolling page, optional 220px sidebar with overline group labels.",
    density: "Medium: bordered white cards, gray inner wells, 16–24px gaps.",
  },
  {
    name: "Marketing page",
    model: "Centered column — breadcrumbs, light-gray heading band, sidebar cards, dark footer.",
    density: "Airy: large headings, 24–64px spacing, medium/large controls.",
  },
  {
    name: "Dialog / overlay",
    model: "Dimmed page + centered card; celebration variant adds an illustration and one brand CTA.",
    density: "Medium: hairline header/footer, inline success banners — never toasts for saves.",
  },
];

const UI_PATTERN_RULES = [
  "Brand tokens (--background-brand-primary) mark global chrome, CTAs, and links — nothing else.",
  "The selected trio (--background/-text/-border-selected-*) marks active tabs, segmented buttons, and selection chrome; never brand fills for selected states.",
  "Group with small-caps overlines; chrome stays tight, content gets the whitespace.",
  "One brand-filled CTA per region; success feedback is an inline banner in the owning panel.",
];

const SKILL_RULES = [
  "Only CADS components from the manifest — never invented props, colors, or APIs.",
  "No hard-coded hex colors and no --ds-* variables; semantic variables only.",
  "Brand tokens for CTAs and links; selected tokens for selected chrome.",
  "Control heights via size: large / medium / small / extraSmall.",
  "Layout only via stack, inline, and surface nodes; typography via approved text variants.",
  "No callbacks in the JSON spec — interactions stay declarative.",
];

export default function AiSetupPage() {
  const zipReady = skillZipAvailable();

  return (
    <div>
      <PageHeader
        eyebrow="Getting started"
        title="AI setup"
        lead="CADS is built to be consumed by AI agents at full fidelity. Three entry points cover every workflow: a plain-text catalog for any LLM, a typed manifest for code, and a Claude skill that renders real components inside artifacts."
      />

      <Section title="Entry points">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          <div className="docs-card">
            <div
              style={{
                fontWeight: 600,
                marginBottom: 6,
                color: "var(--text-brand-primary)",
              }}
            >
              llms.txt
            </div>
            <p
              style={{
                margin: "0 0 10px",
                fontSize: "var(--text-body-sm)",
                lineHeight: "var(--leading-body-sm)",
                color: "var(--text-neutral-secondary)",
              }}
            >
              A plain-text catalog of every component: description, import,
              props, usage rules, and an example. Paste it into any model’s
              context or point a crawler at it.
            </p>
            <Link href="/llms.txt" style={{ fontSize: "var(--text-body-sm)" }}>
              Open /llms.txt
            </Link>
          </div>
          <div className="docs-card">
            <div
              style={{
                fontWeight: 600,
                marginBottom: 6,
                color: "var(--text-brand-primary)",
              }}
            >
              cadsManifest
            </div>
            <p
              style={{
                margin: "0 0 10px",
                fontSize: "var(--text-body-sm)",
                lineHeight: "var(--leading-body-sm)",
                color: "var(--text-neutral-secondary)",
              }}
            >
              The same catalog as typed data — ideal for tooling, codegen, and
              agents working inside a repo. This docs site (including every
              props table and playground) is generated from it.
            </p>
            <code style={{ fontSize: "var(--text-body-xxs)" }}>
              import {"{ cadsManifest }"} from &quot;@codeai/cads-react/manifest&quot;
            </code>
          </div>
          <div className="docs-card">
            <div
              style={{
                fontWeight: 600,
                marginBottom: 6,
                color: "var(--text-brand-primary)",
              }}
            >
              Claude skill
            </div>
            <p
              style={{
                margin: 0,
                fontSize: "var(--text-body-sm)",
                lineHeight: "var(--leading-body-sm)",
                color: "var(--text-neutral-secondary)",
              }}
            >
              <strong>cads-prototyping</strong> — an uploadable skill that lets
              Claude build shareable artifacts embedding the real CADS runtime.
              Details and download below.
            </p>
          </div>
        </div>
      </Section>

      <Section
        title="How the Claude skill works"
        description="The skill ships Claude everything it needs — instructions, a prototype JSON schema, a manifest summary, and the compiled CADS runtime — so prototypes are real CADS, not lookalikes."
      >
        <ol
          style={{
            margin: 0,
            padding: 0,
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {WORKFLOW_STEPS.map((step, i) => (
            <li
              key={step.title}
              style={{
                display: "flex",
                gap: 14,
                padding: "14px 16px",
                border: "1px solid var(--border-neutral-primary)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 26,
                  height: 26,
                  flexShrink: 0,
                  borderRadius: "var(--radius-round)",
                  background: "var(--background-selected-primary)",
                  color: "var(--text-selected-primary)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "var(--text-body-xs)",
                  fontWeight: 600,
                }}
              >
                {i + 1}
              </span>
              <span>
                <strong style={{ display: "block", marginBottom: 2 }}>
                  {step.title}
                </strong>
                <span
                  style={{
                    fontSize: "var(--text-body-sm)",
                    lineHeight: "var(--leading-body-sm)",
                    color: "var(--text-neutral-secondary)",
                  }}
                >
                  {step.body}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        title="Guardrails baked into the skill"
        description="The same rules this docs site and the parity-QA workflow enforce."
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
          {SKILL_RULES.map((rule) => (
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
        title="UI patterns the skill composes with"
        description="Beyond component APIs, the skill ships a ui-patterns reference (references/ui-patterns.md) distilled from the shipping CodeAI surfaces — pick a territory, use its scaffold, and apply the color language."
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16,
            marginBottom: 16,
          }}
        >
          {UI_TERRITORIES.map((territory) => (
            <div key={territory.name} className="docs-card">
              <div
                className="docs-overline"
                style={{ marginBottom: 8, color: "var(--text-neutral-quaternary)" }}
              >
                {territory.name}
              </div>
              <p
                style={{
                  margin: "0 0 6px",
                  fontSize: "var(--text-body-sm)",
                  lineHeight: "var(--leading-body-sm)",
                }}
              >
                {territory.model}
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "var(--text-body-xs)",
                  lineHeight: "var(--leading-body-xs)",
                  color: "var(--text-neutral-secondary)",
                }}
              >
                {territory.density}
              </p>
            </div>
          ))}
        </div>
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
          {UI_PATTERN_RULES.map((rule) => (
            <li
              key={rule}
              style={{
                display: "flex",
                gap: 10,
                alignItems: "baseline",
                padding: "10px 14px",
                border: "1px solid var(--border-neutral-primary)",
                borderRadius: "var(--radius-md)",
                fontSize: "var(--text-body-sm)",
                lineHeight: "var(--leading-body-sm)",
              }}
            >
              <span
                aria-hidden
                style={{
                  color: "var(--text-brand-primary)",
                  flexShrink: 0,
                }}
              >
                →
              </span>
              {rule}
            </li>
          ))}
        </ul>
      </Section>

      <Section
        title="Get the skill"
        description="Upload the ZIP to Claude under Customize → Skills, enable cads-prototyping, then prompt for a CADS prototype. Publish artifacts organization-only."
      >
        {zipReady ? (
          <p style={{ margin: "0 0 16px" }}>
            <Link
              href={SKILL_ZIP_ROUTE}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                height: "var(--control-height-medium)",
                padding: "0 20px",
                borderRadius: "var(--radius-sm)",
                background: "var(--background-brand-primary)",
                color: "var(--text-neutral-white-fixed)",
                fontWeight: 600,
                fontSize: "var(--text-body-sm)",
                textDecoration: "none",
              }}
            >
              Download cads-prototyping.zip
            </Link>
          </p>
        ) : (
          <>
            <p
              style={{
                margin: "0 0 10px",
                fontSize: "var(--text-body-sm)",
                color: "var(--text-neutral-secondary)",
                maxWidth: 640,
              }}
            >
              The skill ZIP isn’t bundled with this build. Generate it from the
              repo — it lands in{" "}
              <code>tooling/cads-artifact/dist/cads-prototyping.zip</code> and
              is picked up by the next docs build:
            </p>
            <CodeBlock code={`pnpm artifact:build`} />
          </>
        )}
        <p
          style={{
            marginTop: 16,
            marginBottom: 0,
            fontSize: "var(--text-body-sm)",
            lineHeight: "var(--leading-body-sm)",
            color: "var(--text-neutral-secondary)",
            maxWidth: 640,
          }}
        >
          <strong>License note:</strong> the runtime inlines Font Awesome Pro
          fonts under CodeAI’s internal license. Keep the skill and any
          artifacts it produces organization-only — never publish them
          publicly or to npm.
        </p>
      </Section>

      <Section
        title="Working in this repo?"
        description="Cursor and other repo-based agents don’t need the ZIP — the cads-prototyping skill at .cursor/skills/cads-prototyping/SKILL.md wires them to the real packages, the manifest, and the Figma source of truth automatically."
      >
        <CodeBlock
          code={`pnpm install
pnpm generate:variables && pnpm build
pnpm dev:docs   # this site at http://localhost:3100`}
        />
      </Section>
    </div>
  );
}
