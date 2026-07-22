import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, readFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const zipPath = join(root, "dist/cads-prototyping.zip");
const reportPath = join(root, "dist/package-report.json");

function ensurePackaged() {
  if (!existsSync(join(root, "skill/runtime/cads-runtime.js"))) {
    const build = spawnSync("pnpm", ["run", "build"], {
      cwd: root,
      encoding: "utf8",
    });
    assert.equal(build.status, 0, build.stderr || build.stdout);
  }
  const pack = spawnSync("pnpm", ["run", "package-skill"], {
    cwd: root,
    encoding: "utf8",
  });
  assert.equal(pack.status, 0, pack.stderr || pack.stdout);
  assert.ok(existsSync(zipPath), "expected dist/cads-prototyping.zip");
  assert.ok(existsSync(reportPath), "expected dist/package-report.json");
}

test("portable skill ZIP passes open-standard preflight", () => {
  ensurePackaged();
  const report = JSON.parse(readFileSync(reportPath, "utf8"));
  assert.equal(report.ok, true, (report.errors || []).join("; "));
  assert.ok(report.fileCount > 0);
  assert.ok(report.descriptionLength > 0);
  assert.ok(report.descriptionLength <= 200);
  assert.ok(report.files.includes("SKILL.md"));
  assert.ok(report.files.includes("scripts/generate_artifact.py"));
  assert.ok(report.files.includes("examples/teacher-onboarding.json"));
  assert.ok(!report.files.includes("skill.md"));
  assert.ok(!report.files.some((f) => f.endsWith(".html")));
  assert.ok(!report.files.some((f) => f.endsWith(".gitkeep")));
});

test("ZIP root is a single cads-prototyping folder with one SKILL.md", () => {
  ensurePackaged();
  const listing = spawnSync("unzip", ["-Z1", zipPath], { encoding: "utf8" });
  assert.equal(listing.status, 0, listing.stderr || listing.stdout);
  const names = listing.stdout
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  assert.ok(names.length > 0);
  assert.ok(names.includes("cads-prototyping/SKILL.md"));
  assert.ok(!names.includes("cads-prototyping/skill.md"));
  assert.ok(!names.some((name) => name.endsWith("cads-runtime.module.js")));
  for (const name of names) {
    assert.match(name, /^cads-prototyping(\/|$)/);
  }
});

test("Python generator produces self-contained CADS HTML", () => {
  ensurePackaged();
  const tmp = mkdtempSync(join(tmpdir(), "cads-skill-"));
  const out = join(tmp, "teacher.html");
  try {
    const gen = spawnSync(
      "python3",
      [
        join(root, "skill/scripts/generate_artifact.py"),
        "--spec",
        join(root, "examples/teacher-onboarding.json"),
        "--out",
        out,
      ],
      { cwd: root, encoding: "utf8" },
    );
    assert.equal(gen.status, 0, gen.stderr || gen.stdout);
    assert.ok(existsSync(out));
    const html = readFileSync(out, "utf8");
    assert.match(html, /CADS\.mountFromScriptTag/);
    assert.match(html, /Tell us about your school/);
    assert.match(html, /TextInput|School name/);
    assert.match(html, /Font Awesome|cads-runtime|fa-/);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});
