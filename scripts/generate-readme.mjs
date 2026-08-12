/**
 * Regenerates the root README from docs nav + component status + experiments.
 *
 * Sources:
 * - apps/docs/lib/nav.ts (structure + component catalog)
 * - apps/docs/lib/componentExternalLinks.ts (in-production = has Storybook id)
 * - docs/experiments.json (curated experiment blurbs)
 *
 * Run: pnpm generate:readme
 * Also runs from apps/docs prebuild so docs builds keep README current.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const DOCS_URL = "https://moshebaricdo.github.io/cads/";
const FIGMA_URL =
  "https://www.figma.com/design/DGekOeToRVifvFAhfqpeC1/CodeAI-Design-System--CADS-";

const RESOURCE_BLURBS = {
  "/": "What CADS is and where to get started.",
  "/ai":
    "Info and download option for the portable skill that packages the CADS Docs runtime for fully standalone prototyping in any major AI tool.",
};

const FOUNDATION_BLURBS = {
  "/variables/color":
    "Primitives for core brand colors, semantics for how they apply in product.",
  "/variables/typography":
    "Space Grotesk for display, Geist for body, Google Sans Code for mono.",
  "/variables/spacing":
    "Radius, elevation, spacing, and z-index/stacking.",
  "/variables/core":
    "Micro-interaction recipes built on shared duration, easing, spring, and scale ladders.",
};

function read(relPath) {
  return readFileSync(join(root, relPath), "utf8");
}

/** Parse `{ href, label, … }` objects from a `export const NAME = [...]` array. */
function parseNavArray(source, exportName) {
  const start = source.indexOf(`export const ${exportName}`);
  if (start < 0) throw new Error(`Missing export ${exportName}`);
  const bracket = source.indexOf("[", start);
  const end = source.indexOf("] as const", bracket);
  if (bracket < 0 || end < 0) {
    throw new Error(`Could not find array body for ${exportName}`);
  }
  const body = source.slice(bracket, end + 1);
  const items = [];
  const re =
    /\{\s*href:\s*"([^"]+)",\s*label:\s*"([^"]+)"(?:,\s*iconName:\s*"[^"]+")?(?:,\s*experimental:\s*(true))?/g;
  let match;
  while ((match = re.exec(body))) {
    items.push({
      href: match[1],
      label: match[2],
      experimental: match[3] === "true",
    });
  }
  return items;
}

/** Parse COMPONENT_SECTIONS into { label, items: [{ exportName, label }] }[]. */
function parseComponentSections(source) {
  const start = source.indexOf("export const COMPONENT_SECTIONS");
  if (start < 0) throw new Error("Missing COMPONENT_SECTIONS");
  const end = source.indexOf("] as const", start);
  const body = source.slice(start, end);

  const sections = [];
  const sectionRe =
    /label:\s*"([^"]+)",\s*iconName:\s*"[^"]+",\s*items:\s*\[([\s\S]*?)\]/g;
  let sectionMatch;
  while ((sectionMatch = sectionRe.exec(body))) {
    const items = [];
    const itemRe =
      /\{\s*exportName:\s*"(\w+)",\s*label:\s*"([^"]+)"(?:,\s*href:\s*"[^"]+")?\s*\}/g;
    let itemMatch;
    while ((itemMatch = itemRe.exec(sectionMatch[2]))) {
      items.push({ exportName: itemMatch[1], label: itemMatch[2] });
    }
    sections.push({ label: sectionMatch[1], items });
  }
  return sections;
}

/**
 * Mirror getComponentStatus(): explicit status wins; otherwise Storybook id
 * means in production, missing id means not in production.
 */
function parseComponentStatus(source) {
  const start = source.indexOf("export const COMPONENT_EXTERNAL_LINKS");
  if (start < 0) throw new Error("Missing COMPONENT_EXTERNAL_LINKS");
  const end = source.indexOf("};\n\nexport function", start);
  const body = source.slice(start, end < 0 ? undefined : end);

  /** @type {Record<string, { inProduction: boolean, status?: string }>} */
  const map = {};
  const entryRe = /^\s{4}(\w+):\s*\{([\s\S]*?)^\s{4}\},?/gm;
  let match;
  while ((match = entryRe.exec(body))) {
    const name = match[1];
    const block = match[2];
    const statusMatch = block.match(/status:\s*"(\w+)"/);
    const hasStorybook = /storybookId:\s*"/.test(block);
    if (statusMatch) {
      map[name] = { inProduction: false, status: statusMatch[1] };
    } else if (hasStorybook) {
      map[name] = { inProduction: true };
    } else {
      map[name] = { inProduction: false, status: "notInProduction" };
    }
  }
  return map;
}

function statusLabel(info) {
  if (!info) return "Not in production";
  if (info.status === "experimental") return "Experimental";
  if (info.status === "deprecated") return "Deprecated";
  if (info.status === "notInProduction" || !info.inProduction) {
    return "Not in production";
  }
  return "In production";
}

function bulletList(items, blurbs) {
  return items
    .map((item) => {
      const blurb = blurbs[item.href] ?? "";
      const experimental = item.experimental ? " _(experimental)_" : "";
      return blurb
        ? `- **${item.label}**${experimental} — ${blurb}`
        : `- **${item.label}**${experimental}`;
    })
    .join("\n");
}

function buildReadme() {
  const navSource = read("apps/docs/lib/nav.ts");
  const linksSource = read("apps/docs/lib/componentExternalLinks.ts");
  const experiments = JSON.parse(read("docs/experiments.json"));

  const resources = parseNavArray(navSource, "RESOURCES_NAV");
  const foundations = parseNavArray(navSource, "FOUNDATIONS_NAV");
  const sections = parseComponentSections(navSource);
  const statusMap = parseComponentStatus(linksSource);

  const sectionNames = sections.map((s) => s.label).join(", ");

  const componentRows = sections
    .flatMap((section) =>
      section.items.map((item) => {
        const status = statusLabel(statusMap[item.exportName]);
        return `| ${item.label} | ${section.label} | ${status} |`;
      }),
    )
    .join("\n");

  const experimentBlocks = experiments
    .map((exp) => {
      const where = exp.docs
        ? `Docs: [\`${exp.docs}\`](${DOCS_URL.replace(/\/$/, "")}${exp.docs})`
        : exp.path
          ? `In repo: [\`${exp.path}\`](${exp.path})`
          : null;
      const parts = [`### ${exp.name}`, "", exp.summary];
      if (where) parts.push("", where);
      return parts.join("\n");
    })
    .join("\n\n");

  const version = JSON.parse(read("packages/react/package.json")).version;

  return `# CodeAI Design System

The CodeAI Design System (CADS) is a collection of design primitives and components that power our signed-in product experience.

Design lives in [Figma](${FIGMA_URL}). This repo is an interactive documentation and prototyping resource for the design system. It aims to maintain 1:1 parity with Figma as the source of truth. These components are built entirely on top of MUI React components. This is **not** the production component library used on the CodeAI platform and is not available for import as such.

**Docs:** [${DOCS_URL}](${DOCS_URL})

## Docs

### Getting started

${bulletList(resources, RESOURCE_BLURBS)}

### Foundations

${bulletList(foundations, FOUNDATION_BLURBS)}

### Components

Reusable UI building blocks, grouped by type (${sectionNames}), with a playground/inspector, props sheets, and usage notes.

## Components

Status reflects whether a matching component has shipped in the [production Storybook](https://code-dot-org.github.io/code-dot-org/component-library-storybook/). “Not in production” means it’s available here and in Figma but hasn’t landed in the production library yet. With the transition from DSCO to CADS, nearly every component here and in Figma differs in some way from what is currently in production.

| Component | Group | Status |
| --- | --- | --- |
${componentRows}

## Experiments

${experimentBlocks}

## Working in this repo

For contributors and agents, start with [\`AGENTS.md\`](AGENTS.md). Current priorities live in [\`docs/STATUS.md\`](docs/STATUS.md).

This README’s component table and experiments list are generated — run \`pnpm generate:readme\` after changing docs nav, component Storybook links, or [\`docs/experiments.json\`](docs/experiments.json). Docs builds regenerate it automatically.

## Using in a prototype

These packages are not on public npm. Install from GitHub Packages (scope matches this repo’s owner):

\`\`\`json
{
  "dependencies": {
    "@moshebaricdo/cads-react": "^${version}",
    "@moshebaricdo/cads-variables": "^${version}"
  }
}
\`\`\`

\`\`\`
@moshebaricdo:registry=https://npm.pkg.github.com
\`\`\`

GitHub Packages needs a token even for public packages (\`NODE_AUTH_TOKEN\` / PAT with \`read:packages\`). Imports stay \`from "@moshebaricdo/cads-react"\`. For local CADS development, a sibling \`file:../cads/packages/*\` install still works (don’t commit that rewrite on a repo whose CI has no sibling checkout).
`;
}

const outFile = join(root, "README.md");
writeFileSync(outFile, buildReadme(), "utf8");
console.log(`Wrote ${outFile}`);
