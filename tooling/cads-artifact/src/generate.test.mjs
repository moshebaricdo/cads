import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { validatePrototype } from "../../cads-mcp/src/prototype.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const example = JSON.parse(
  readFileSync(join(root, "examples/teacher-onboarding.json"), "utf8"),
);

test("teacher-onboarding example validates against CADS manifest", () => {
  const result = validatePrototype(example);
  assert.equal(result.valid, true, result.errors.join("; "));
});

test("rejects invented props in artifact specs", () => {
  const result = validatePrototype({
    title: "Bad",
    root: {
      type: "component",
      component: "Button",
      props: { intent: "hero", color: "purple" },
      children: "Go",
    },
  });
  assert.equal(result.valid, false);
});

test("runtime build + HTML generation succeeds", async (t) => {
  if (!existsSync(join(root, "dist/cads-runtime.js"))) {
    const build = spawnSync("pnpm", ["run", "build"], {
      cwd: root,
      encoding: "utf8",
    });
    assert.equal(build.status, 0, build.stderr || build.stdout);
  }

  const out = join(root, "dist/artifacts/test-teacher.html");
  const gen = spawnSync(
    process.execPath,
    [
      join(root, "scripts/generate-artifact.mjs"),
      "--example",
      "teacher-onboarding",
      "--out",
      out,
    ],
    { cwd: root, encoding: "utf8" },
  );
  assert.equal(gen.status, 0, gen.stderr || gen.stdout);
  assert.ok(existsSync(out));

  const html = readFileSync(out, "utf8");
  assert.match(html, /cads-runtime|Font Awesome|CADS\.mountFromScriptTag/);
  assert.match(html, /Tell us about your school/);
  assert.match(html, /TextInput|School name/);

  const size = JSON.parse(readFileSync(join(root, "dist/SIZE.json"), "utf8"));
  assert.ok(size.total > 0);
  t.diagnostic(`runtime total ${size.human.total}; artifact ${(Buffer.byteLength(html) / 1024).toFixed(1)} KB`);
});
