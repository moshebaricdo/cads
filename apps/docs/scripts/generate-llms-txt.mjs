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
