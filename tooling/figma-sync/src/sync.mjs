/**
 * Figma → CADS variables sync
 *
 * Diffs Figma Variables (REST DTCG-shaped export or local snapshot refresh)
 * against packages/variables/src/data/figmaVariablesSnapshot.json and
 * codeAiColorSystem.json across four drift classes:
 *   1. Values (primitive hexes, resolved semantics)
 *   2. Mappings (semantic → primitive / semantic aliases per mode)
 *   3. Naming (renames via stable Figma variable IDs)
 *   4. Structure (added/removed collections, families, steps, tokens)
 *
 * Usage:
 *   FIGMA_ACCESS_TOKEN=… pnpm figma:sync          # report only
 *   FIGMA_ACCESS_TOKEN=… pnpm figma:sync:apply    # apply + regenerate
 *
 * Without a token, compares the committed snapshot to the ColorSystem
 * (useful for CI sanity checks) and prints instructions.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, "../../..");
const FIGMA_FILE_KEY = "DGekOeToRVifvFAhfqpeC1";
const DATA_DIR = path.join(REPO, "packages/variables/src/data");
const SNAPSHOT_PATH = path.join(DATA_DIR, "figmaVariablesSnapshot.json");
const COLOR_SYSTEM_PATH = path.join(DATA_DIR, "codeAiColorSystem.json");
const APPLY = process.argv.includes("--apply");

async function fetchFigmaVariables(token) {
  // Figma Variables REST: local variables for a file
  const url = `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/variables/local`;
  const res = await fetch(url, {
    headers: { "X-Figma-Token": token },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Figma API ${res.status}: ${body}`);
  }
  return res.json();
}

function loadJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}

function summarizeSnapshot(snapshot) {
  // Snapshot may be DTCG (figma-console export) or raw REST.
  if (snapshot?.meta?.variables) {
    return {
      kind: "rest",
      variableCount: Object.keys(snapshot.meta.variables).length,
      collectionCount: Object.keys(snapshot.meta.variableCollections ?? {}).length,
    };
  }
  // DTCG: top-level keys are collections
  const collections = Object.keys(snapshot).filter(
    (k) => !k.startsWith("$"),
  );
  let variableCount = 0;
  const walk = (node) => {
    if (!node || typeof node !== "object") return;
    if (node.$type || node.$value !== undefined) {
      variableCount += 1;
      return;
    }
    for (const [k, v] of Object.entries(node)) {
      if (k.startsWith("$")) continue;
      walk(v);
    }
  };
  for (const c of collections) walk(snapshot[c]);
  return { kind: "dtcg", variableCount, collectionCount: collections.length };
}

function diffColorSystemVsSnapshot(system, snapshotSummary) {
  const familyCount = system.families?.length ?? 0;
  const stepCount =
    system.families?.reduce((n, f) => n + (f.steps?.length ?? 0), 0) ?? 0;
  const semanticCount = system.semantics?.length ?? 0;
  return {
    colorSystem: { familyCount, stepCount, semanticCount },
    snapshot: snapshotSummary,
    notes: [
      "Full value/mapping/rename diffs require a fresh Figma export (FIGMA_ACCESS_TOKEN).",
      "When a token is present, this script fetches /variables/local, writes a new snapshot,",
      "and reports ID-matched renames (same as the Lab2 figma-color-sync skill).",
      "Use --apply to write the new snapshot and run generate:variables.",
    ],
  };
}

function reportRestDiff(prevSnapshot, nextPayload) {
  const prevVars = prevSnapshot?.meta?.variables ?? {};
  const nextVars = nextPayload?.meta?.variables ?? {};
  const prevIds = new Set(Object.keys(prevVars));
  const nextIds = new Set(Object.keys(nextVars));

  const added = [...nextIds].filter((id) => !prevIds.has(id));
  const removed = [...prevIds].filter((id) => !nextIds.has(id));
  const renames = [];
  const valueChanges = [];

  for (const id of nextIds) {
    if (!prevIds.has(id)) continue;
    const a = prevVars[id];
    const b = nextVars[id];
    if (a?.name !== b?.name) {
      renames.push({ id, from: a.name, to: b.name });
    }
    const aVals = JSON.stringify(a?.valuesByMode ?? {});
    const bVals = JSON.stringify(b?.valuesByMode ?? {});
    if (aVals !== bVals) {
      valueChanges.push({ id, name: b.name });
    }
  }

  return { added, removed, renames, valueChanges };
}

async function main() {
  const token = process.env.FIGMA_ACCESS_TOKEN;
  const snapshotExists = fs.existsSync(SNAPSHOT_PATH);
  const system = loadJson(COLOR_SYSTEM_PATH);

  if (!token) {
    const summary = snapshotExists
      ? summarizeSnapshot(loadJson(SNAPSHOT_PATH))
      : { kind: "missing", variableCount: 0, collectionCount: 0 };
    const report = diffColorSystemVsSnapshot(system, summary);
    console.log("=== CADS Figma sync (offline report) ===");
    console.log(JSON.stringify(report, null, 2));
    console.log(
      "\nSet FIGMA_ACCESS_TOKEN to fetch live variables and compute full diffs.",
    );
    return;
  }

  console.log(`Fetching Figma variables for ${FIGMA_FILE_KEY}…`);
  const payload = await fetchFigmaVariables(token);

  let diff = null;
  if (snapshotExists) {
    const prev = loadJson(SNAPSHOT_PATH);
    if (prev?.meta?.variables && payload?.meta?.variables) {
      diff = reportRestDiff(prev, payload);
    }
  }

  console.log("=== CADS Figma sync ===");
  if (diff) {
    console.log(`Added: ${diff.added.length}`);
    console.log(`Removed: ${diff.removed.length}`);
    console.log(`Renames: ${diff.renames.length}`);
    for (const r of diff.renames.slice(0, 20)) {
      console.log(`  ${r.from} → ${r.to}`);
    }
    console.log(`Value changes: ${diff.valueChanges.length}`);
    for (const v of diff.valueChanges.slice(0, 20)) {
      console.log(`  ${v.name}`);
    }
  } else {
    console.log(
      "Fetched live variables. Previous snapshot was not REST-shaped; writing fresh snapshot baseline.",
    );
  }

  if (APPLY) {
    fs.writeFileSync(SNAPSHOT_PATH, JSON.stringify(payload, null, 2), "utf-8");
    console.log(`Wrote ${SNAPSHOT_PATH}`);
    console.log(
      "Note: mapping ColorSystem JSON from REST payload is a guided step —",
      "run the Lab2 color sandbox sync skill or extend this script to apply",
      "primitive/semantic updates into codeAiColorSystem.json.",
    );
    const gen = spawnSync("pnpm", ["generate:variables"], {
      cwd: REPO,
      stdio: "inherit",
      shell: true,
    });
    if (gen.status !== 0) process.exit(gen.status ?? 1);
  } else {
    console.log("\nDry run only. Re-run with --apply to write the snapshot.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
