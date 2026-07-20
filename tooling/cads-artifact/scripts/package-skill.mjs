#!/usr/bin/env node
/**
 * Zip the Claude skill folder for upload to Customize → Skills.
 * Correct structure: cads-prototyping.zip → cads-prototyping/SKILL.md …
 */
import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  rmSync,
  writeFileSync,
  readFileSync,
  cpSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const skillSrc = join(root, "skill");
const distDir = join(root, "dist");
const staging = join(distDir, "skill-staging/cads-prototyping");
const zipPath = join(distDir, "cads-prototyping.zip");

if (!existsSync(join(skillSrc, "runtime/cads-runtime.js"))) {
  console.error("Missing skill/runtime — run build first.");
  process.exit(1);
}

// References that must ship in the ZIP (cpSync copies skill/ wholesale, but
// fail loudly if one goes missing rather than shipping a broken skill).
for (const ref of [
  "references/schema.md",
  "references/manifest-summary.md",
  "references/ui-patterns.md",
]) {
  if (!existsSync(join(skillSrc, ref))) {
    console.error(`Missing skill/${ref} — refusing to package.`);
    process.exit(1);
  }
}

rmSync(join(distDir, "skill-staging"), { recursive: true, force: true });
mkdirSync(staging, { recursive: true });
cpSync(skillSrc, staging, { recursive: true });

// Claude help center documents skill.md; keep SKILL.md and a lowercase alias.
if (existsSync(join(staging, "SKILL.md"))) {
  copyFileSync(join(staging, "SKILL.md"), join(staging, "skill.md"));
}

// Ensure example lands in the skill for Claude to reference
mkdirSync(join(staging, "examples"), { recursive: true });
copyFileSync(
  join(root, "examples/teacher-onboarding.json"),
  join(staging, "examples/teacher-onboarding.json"),
);

// Copy a freshly generated sample artifact if present
const sampleHtml = join(distDir, "artifacts/teacher-onboarding.html");
if (existsSync(sampleHtml)) {
  mkdirSync(join(staging, "examples"), { recursive: true });
  copyFileSync(sampleHtml, join(staging, "examples/teacher-onboarding.html"));
}

rmSync(zipPath, { force: true });
const result = spawnSync(
  "zip",
  ["-r", zipPath, "cads-prototyping"],
  {
    cwd: join(distDir, "skill-staging"),
    stdio: "inherit",
  },
);

if (result.status !== 0) {
  console.error("zip failed — is the `zip` CLI available?");
  process.exit(result.status ?? 1);
}

const size = readFileSync(zipPath).byteLength;
console.log(`Packaged skill: ${zipPath}`);
console.log(`  size: ${(size / (1024 * 1024)).toFixed(2)} MB`);
console.log(`
Upload steps:
  1. Claude → Customize → Skills → Upload a skill
  2. Choose dist/cads-prototyping.zip
  3. Enable the skill
  4. Ask: "Create a CADS teacher onboarding form as an artifact"
  5. Publish organization-only, open as another member, customize + edit
`);
