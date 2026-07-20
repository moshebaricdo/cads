/**
 * Writes public/llms.txt for static export (route handlers are unsupported).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = join(
  root,
  "../../packages/react/dist/manifest/cads.manifest.js",
);

const { cadsManifest } = await import(pathToFileURL(manifestPath).href);

const lines = [
  "# CADS — CodeAI Design System",
  "",
  `> Package: ${cadsManifest.package} v${cadsManifest.version}`,
  `> Figma: https://www.figma.com/design/${cadsManifest.figmaFileKey}/CodeAI-Design-System--CADS-`,
  "",
  "## Rules for AI agents",
  "",
  "- Import components only from @codeai/cads-react (icons from @codeai/cads-react/icons).",
  "- Import variables CSS: @codeai/cads-variables/variables.css",
  "- Wrap the app in <CadsProvider>.",
  "- Use semantic color CSS variables (e.g. --background-brand-primary) — never hard-coded hex, never --ds- prefix.",
  "- Use brand tokens for CTAs; selected tokens for filled selected chrome.",
  "- Control heights: large=48 medium=40 small=32 extraSmall=24 — use the size prop, do not invent heights.",
  "- Do not invent props or variants outside the manifest below.",
  "- Verify UI against Figma screenshots when implementing designer mocks.",
  "",
  "## UI patterns (how CodeAI screens compose)",
  "",
  "Territories — pick one before placing components:",
  "- Lab shell (student/creator tools): fixed 100vh app shell — 50px brand top bar (--background-brand-primary, white text), left icon rail + collapsible panel, workspace. Dense: compact panel headers, small/extraSmall controls.",
  "- Dashboard page (teacher/admin): brand bar + scrolling white page; optional 220px sidebar (--background-neutral-secondary) with small-caps overline group labels; active nav item = --background-neutral-tertiary fill + selected edge bar.",
  "- Marketing/public page: centered column — breadcrumbs, light-gray heading band with a --font-heading H1, two-column content + sidebar cards, near-black footer (--background-neutral-black-fixed).",
  "- Dialog/overlay: dimmed page + centered card (--radius-md, --shadow-lg); celebration variant = illustration + heading + one brand CTA.",
  "",
  "Composition:",
  "- Panel headers: 40px, white, bottom hairline (--border-neutral-primary), centered small-caps overline label in --text-neutral-quaternary.",
  "- Cards: white + 1px --border-neutral-primary + --radius-md by default; gray wells (--background-neutral-secondary) nest white sub-cards; --background-brand-light tint for promos only.",
  "- Group with overlines (semibold uppercase, --tracking-overline); chrome stays tight, content gets the whitespace.",
  "- Inspector/property panels: 226–280px card, 32px gray overline header, hairline-separated sections (semibold sentence-case titles), dense label-left / compact-control-right rows.",
  "",
  "Color language:",
  "- Brand = top bar, primary CTAs, links. One brand-filled CTA per region.",
  "- Selected trio (--background/-text/-border-selected-*) = active tabs, segmented buttons, selection chrome. Never brand fills for selected states; never split the trio.",
  "- Success = progress/saved (inline banner in the owning panel, not a toast); warning = stale/attention; error = destructive; accent orange = Run buttons + hover accents only.",
  "- Focus: 2px --border-focused-primary ring, never removed.",
  "",
  "## Components",
  "",
];

for (const c of cadsManifest.components) {
  lines.push(`### ${c.name}`, "");
  lines.push(c.description, "");
  lines.push(`Import: \`import { ${c.exportName} } from "${c.importFrom}"\``, "");
  lines.push("Props:");
  for (const p of c.props) {
    lines.push(
      `- \`${p.name}\`: ${p.type}${p.default ? ` (default ${p.default})` : ""}${p.required ? " [required]" : ""}${p.description ? ` — ${p.description}` : ""}`,
    );
  }
  lines.push("", "Usage rules:");
  for (const r of c.usageRules) lines.push(`- ${r}`);
  lines.push("", "Example:", "```tsx", c.example, "```", "");
}

const outDir = join(root, "public");
mkdirSync(outDir, { recursive: true });
const outFile = join(outDir, "llms.txt");
writeFileSync(outFile, lines.join("\n"), "utf8");
console.log(`Wrote ${outFile}`);
