#!/usr/bin/env node
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { cadsManifest } from "@codeai/cads-react/manifest";

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = join(__dirname, "../skill/references/manifest-summary.md");
mkdirSync(dirname(out), { recursive: true });

const lines = [
  `# CADS component catalog (v${cadsManifest.version})`,
  "",
  `Package: \`${cadsManifest.package}\`. Figma file: \`${cadsManifest.figmaFileKey}\`.`,
  "",
  "Only use these components and props. Do not invent APIs.",
  "",
];

for (const component of cadsManifest.components) {
  lines.push(`## ${component.exportName}`);
  lines.push("");
  lines.push(component.description);
  lines.push("");
  lines.push("Props:");
  lines.push("");
  for (const prop of component.props) {
    const req = prop.required ? " **(required)**" : "";
    const def =
      prop.default !== undefined ? ` — default \`${prop.default}\`` : "";
    const desc = prop.description ? ` — ${prop.description}` : "";
    lines.push(`- \`${prop.name}\`: \`${prop.type}\`${req}${def}${desc}`);
  }
  lines.push("");
  if (component.usageRules?.length) {
    lines.push("Rules:");
    lines.push("");
    for (const rule of component.usageRules) {
      lines.push(`- ${rule}`);
    }
    lines.push("");
  }
  lines.push("Example:");
  lines.push("");
  lines.push("```tsx");
  lines.push(component.example);
  lines.push("```");
  lines.push("");
}

writeFileSync(out, lines.join("\n"));
console.log(`Wrote ${out}`);
