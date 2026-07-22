#!/usr/bin/env node
/**
 * Zip the portable CADS skill for upload to Agent Skills hosts
 * (Claude, ChatGPT/OpenAI Skills, Gemini Spark, Cursor).
 *
 * Correct structure:
 *   cads-prototyping.zip
 *   └── cads-prototyping/
 *       ├── SKILL.md
 *       ├── references/
 *       ├── runtime/
 *       ├── scripts/generate_artifact.py
 *       └── examples/*.json
 *
 * Internal-only: embeds FA Pro fonts. Do not publish publicly.
 */
import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const skillSrc = join(root, "skill");
const distDir = join(root, "dist");
const stagingRoot = join(distDir, "skill-staging");
const staging = join(stagingRoot, "cads-prototyping");
const zipPath = join(distDir, "cads-prototyping.zip");
const reportPath = join(distDir, "package-report.json");

/** Claude.ai description limit (stricter than OpenAI/Cursor 1024). */
const MAX_DESCRIPTION_CHARS = 200;
/** OpenAI Agent Skills documented caps. */
const MAX_ZIP_BYTES = 50 * 1024 * 1024;
const MAX_UNCOMPRESSED_FILE_BYTES = 25 * 1024 * 1024;
const MAX_FILE_COUNT = 500;
/** Claude custom skill file-count guidance. */
const MAX_CLAUDE_FILE_COUNT = 200;
/** Gemini Spark documented total size. */
const MAX_SPARK_BYTES = 100 * 1024 * 1024;

const REQUIRED_FILES = [
  "SKILL.md",
  "references/schema.md",
  "references/manifest-summary.md",
  "references/ui-patterns.md",
  "references/components.json",
  "runtime/cads-runtime.js",
  "runtime/cads-runtime.css",
  "runtime/VERSION.json",
  "scripts/generate_artifact.py",
  "examples/teacher-onboarding.json",
];

const EXCLUDE_NAMES = new Set([
  ".DS_Store",
  ".gitkeep",
  "SIZE.json",
  "metafile.json",
  "skill.md",
  "generate-artifact.mjs",
  "cads-runtime.module.js",
]);

const EXCLUDE_EXTENSIONS = new Set([".html", ".map"]);

if (!existsSync(join(skillSrc, "runtime/cads-runtime.js"))) {
  console.error("Missing skill/runtime — run build first.");
  process.exit(1);
}

for (const ref of [
  "references/schema.md",
  "references/manifest-summary.md",
  "references/ui-patterns.md",
  "references/components.json",
  "scripts/generate_artifact.py",
]) {
  if (!existsSync(join(skillSrc, ref))) {
    console.error(`Missing skill/${ref} — refusing to package.`);
    process.exit(1);
  }
}

rmSync(stagingRoot, { recursive: true, force: true });
mkdirSync(staging, { recursive: true });
copyTree(skillSrc, staging);

mkdirSync(join(staging, "examples"), { recursive: true });
copyFileSync(
  join(root, "examples/teacher-onboarding.json"),
  join(staging, "examples/teacher-onboarding.json"),
);

const preflight = validateStaging(staging);
writeFileSync(reportPath, JSON.stringify(preflight, null, 2));
if (!preflight.ok) {
  console.error("Skill package preflight failed:");
  for (const error of preflight.errors) console.error(`  - ${error}`);
  process.exit(1);
}

rmSync(zipPath, { force: true });
const result = spawnSync("zip", ["-r", "-X", zipPath, "cads-prototyping"], {
  cwd: stagingRoot,
  stdio: "inherit",
});

if (result.status !== 0) {
  console.error("zip failed — is the `zip` CLI available?");
  process.exit(result.status ?? 1);
}

const zipBytes = statSync(zipPath).size;
if (zipBytes > MAX_ZIP_BYTES) {
  console.error(
    `ZIP too large: ${human(zipBytes)} (OpenAI limit ${human(MAX_ZIP_BYTES)})`,
  );
  process.exit(1);
}
if (zipBytes > MAX_SPARK_BYTES) {
  console.error(
    `ZIP too large: ${human(zipBytes)} (Gemini Spark limit ${human(MAX_SPARK_BYTES)})`,
  );
  process.exit(1);
}

const report = {
  ...preflight,
  zipPath,
  zipBytes,
  zipHuman: human(zipBytes),
};
writeFileSync(reportPath, JSON.stringify(report, null, 2));

console.log(`Packaged skill: ${zipPath}`);
console.log(`  size: ${human(zipBytes)}`);
console.log(`  files: ${preflight.fileCount}`);
console.log(`  description: ${preflight.descriptionLength} chars`);
console.log(`
Upload (internal only — FA Pro fonts):
  Claude:   Customize → Skills → Upload
  ChatGPT:  Skills / Work mode (Agent Skills ZIP)
  Gemini:   Spark → Skills → Upload
  Cursor:   drop ZIP into Agent chat → ask to install the skill
`);

function copyTree(from, to) {
  mkdirSync(to, { recursive: true });
  for (const entry of readdirSync(from, { withFileTypes: true })) {
    if (EXCLUDE_NAMES.has(entry.name)) continue;
    if (entry.name.startsWith(".")) continue;
    const src = join(from, entry.name);
    const dest = join(to, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "output") continue;
      copyTree(src, dest);
      continue;
    }
    const ext = entry.name.includes(".")
      ? `.${entry.name.split(".").pop()}`
      : "";
    if (EXCLUDE_EXTENSIONS.has(ext)) continue;
    copyFileSync(src, dest);
  }
}

function validateStaging(dir) {
  const errors = [];
  const files = listFiles(dir);
  const relativePaths = files.map((abs) => relative(dir, abs).split("\\").join("/"));

  for (const required of REQUIRED_FILES) {
    if (!relativePaths.includes(required)) {
      errors.push(`missing required file: ${required}`);
    }
  }

  const manifests = relativePaths.filter(
    (path) => path === "SKILL.md" || path === "skill.md",
  );
  if (manifests.length !== 1 || manifests[0] !== "SKILL.md") {
    errors.push(
      `expected exactly one SKILL.md (found: ${manifests.join(", ") || "none"})`,
    );
  }

  if (relativePaths.some((path) => path.endsWith(".html"))) {
    errors.push("sample HTML must not be packaged (bloat / host limits)");
  }
  if (relativePaths.some((path) => path.endsWith(".gitkeep"))) {
    errors.push(".gitkeep must not be packaged");
  }
  if (relativePaths.some((path) => path === "scripts/generate-artifact.mjs")) {
    errors.push("Node skill helper must not be packaged; use generate_artifact.py");
  }

  let descriptionLength = 0;
  const skillMd = join(dir, "SKILL.md");
  if (existsSync(skillMd)) {
    const text = readFileSync(skillMd, "utf8");
    const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) {
      errors.push("SKILL.md missing YAML frontmatter");
    } else {
      const front = match[1];
      const nameMatch = front.match(/^name:\s*(.+)$/m);
      const descMatch = front.match(/^description:\s*(.+)$/m);
      const name = nameMatch?.[1]?.trim();
      const description = descMatch?.[1]?.trim() ?? "";
      descriptionLength = description.length;
      if (name !== "cads-prototyping") {
        errors.push(`frontmatter name must be cads-prototyping (got ${name})`);
      }
      if (!description) {
        errors.push("frontmatter description is required");
      } else if (descriptionLength > MAX_DESCRIPTION_CHARS) {
        errors.push(
          `description is ${descriptionLength} chars (Claude.ai limit ${MAX_DESCRIPTION_CHARS})`,
        );
      }
    }
  }

  if (relativePaths.length > MAX_FILE_COUNT) {
    errors.push(`file count ${relativePaths.length} exceeds OpenAI limit ${MAX_FILE_COUNT}`);
  }
  if (relativePaths.length > MAX_CLAUDE_FILE_COUNT) {
    errors.push(
      `file count ${relativePaths.length} exceeds Claude guidance ${MAX_CLAUDE_FILE_COUNT}`,
    );
  }

  let uncompressedBytes = 0;
  for (const abs of files) {
    const size = statSync(abs).size;
    uncompressedBytes += size;
    if (size > MAX_UNCOMPRESSED_FILE_BYTES) {
      errors.push(
        `${relative(dir, abs)} is ${human(size)} (OpenAI file limit ${human(MAX_UNCOMPRESSED_FILE_BYTES)})`,
      );
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    fileCount: relativePaths.length,
    files: relativePaths.sort(),
    descriptionLength,
    uncompressedBytes,
    uncompressedHuman: human(uncompressedBytes),
  };
}

function listFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const abs = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listFiles(abs));
    else out.push(abs);
  }
  return out;
}

function human(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
