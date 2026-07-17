/**
 * Audit cadsManifest props against committed Figma component-prop snapshot.
 *
 * Snapshot: packages/react/src/manifest/figmaComponentPropsSnapshot.json
 * (populated via Figma MCP get_metadata variant-axis parse, or later REST refresh)
 *
 * Usage:
 *   pnpm figma:audit-props
 *   pnpm figma:audit-props -- --strict   # exit 1 on any finding
 *
 * Does not invent APIs. Design-only axes (state, position, …) must not become
 * React props unless explicitly mapped. Code-only props (children, onChange, …)
 * are allowed without a Figma axis.
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, "../../..");
const SNAPSHOT_PATH = path.join(
  REPO,
  "packages/react/src/manifest/figmaComponentPropsSnapshot.json",
);
const MANIFEST_DIST = path.join(
  REPO,
  "packages/react/dist/manifest/cads.manifest.js",
);
const MANIFEST_SOURCE = path.join(
  REPO,
  "packages/react/src/manifest/cads.manifest.ts",
);
const STRICT = process.argv.includes("--strict");
const CODE_ONLY_CATEGORIES = new Set([
  "accessibility",
  "composition",
  "content",
  "controlled-state",
  "event",
  "layout",
]);

function loadJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}

/** Parse `"a" | "b" | boolean` style types from the manifest. */
function parseEnumValues(typeStr) {
  if (!typeStr || typeof typeStr !== "string") return null;
  const literals = [...typeStr.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
  if (literals.length === 0) {
    if (/\bboolean\b/.test(typeStr)) return ["true", "false"];
    return null;
  }
  return literals;
}

function normalizeFigmaValue(v) {
  const s = String(v).trim();
  const lower = s.toLowerCase();
  if (lower === "yes" || lower === "on" || lower === "true") return "true";
  if (lower === "no" || lower === "off" || lower === "false") return "false";
  if (lower === "press") return "pressed";
  return lower;
}

function findManifestComponent(manifest, name) {
  return manifest.components.find((c) => c.name === name);
}

function parseCodeOnlyProps(entry, findings) {
  const names = new Set();
  for (const item of entry.codeOnlyProps ?? []) {
    if (typeof item === "string") {
      findings.push({
        severity: "error",
        code: "unstructured-code-only-prop",
        message: `${entry.cadsName}.${item}: codeOnlyProps entries require name, category, and reason`,
      });
      names.add(item);
      continue;
    }

    const { name, category, reason } = item ?? {};
    if (
      typeof name !== "string" ||
      !name ||
      !CODE_ONLY_CATEGORIES.has(category) ||
      typeof reason !== "string" ||
      !reason.trim()
    ) {
      findings.push({
        severity: "error",
        code: "invalid-code-only-prop",
        message: `${entry.cadsName}: invalid codeOnlyProps entry ${JSON.stringify(item)}; category must be one of ${[...CODE_ONLY_CATEGORIES].join(", ")}`,
      });
      if (typeof name === "string" && name) names.add(name);
      continue;
    }
    if (names.has(name)) {
      findings.push({
        severity: "error",
        code: "duplicate-code-only-prop",
        message: `${entry.cadsName}.${name}: duplicate codeOnlyProps entry`,
      });
    }
    names.add(name);
  }
  return names;
}

function auditComponent(entry, manifestComp) {
  const findings = [];
  if (!manifestComp) {
    findings.push({
      severity: "error",
      code: "missing-manifest",
      message: `${entry.cadsName}: present in Figma snapshot but missing from cadsManifest`,
    });
    return findings;
  }

  if (entry.nodeId !== manifestComp.figma?.nodeId) {
    findings.push({
      severity: "error",
      code: "figma-node-mismatch",
      message: `${entry.cadsName}: snapshot node ${entry.nodeId ?? "(missing)"} differs from manifest node ${manifestComp.figma?.nodeId ?? "(missing)"}`,
    });
  }
  if (
    entry.componentKey &&
    manifestComp.figma?.componentKey &&
    entry.componentKey !== manifestComp.figma.componentKey
  ) {
    findings.push({
      severity: "error",
      code: "figma-component-key-mismatch",
      message: `${entry.cadsName}: snapshot componentKey differs from manifest`,
    });
  }

  const manifestPropNames = new Set(manifestComp.props.map((p) => p.name));
  const propByName = Object.fromEntries(
    manifestComp.props.map((p) => [p.name, p]),
  );

  const mappedCodeProps = new Set();
  for (const [axis, codeProp] of Object.entries(entry.axisToCodeProp ?? {})) {
    if (codeProp == null) continue;
    mappedCodeProps.add(codeProp);
    if (!manifestPropNames.has(codeProp)) {
      findings.push({
        severity: "error",
        code: "missing-mapped-prop",
        message: `${entry.cadsName}: Figma axis "${axis}" maps to prop "${codeProp}" but manifest has no such prop`,
      });
      continue;
    }
    const figmaValues = (entry.variantProperties?.[axis] ?? []).map(
      normalizeFigmaValue,
    );
    const enumValues = parseEnumValues(propByName[codeProp].type);
    if (!enumValues || figmaValues.length === 0) continue;

    // Booleans: Figma Yes/No → boolean prop (no string enum required)
    if (
      enumValues.length === 2 &&
      enumValues.includes("true") &&
      enumValues.includes("false")
    ) {
      continue;
    }

    const missingInManifest = figmaValues.filter(
      (v) => !enumValues.map((e) => e.toLowerCase()).includes(v),
    );
    // Ignore interaction-state values if somehow compared on a non-state prop
    const meaningful = missingInManifest.filter(
      (v) =>
        !["default", "hover", "focus", "pressed", "press", "disabled"].includes(
          v,
        ) || axis !== "state",
    );
    if (axis === "state") continue;

    if (meaningful.length > 0) {
      findings.push({
        severity: "warn",
        code: "enum-gap",
        message: `${entry.cadsName}.${codeProp}: Figma values missing from manifest type — ${meaningful.join(", ")} (manifest: ${enumValues.join(" | ")})`,
      });
    }

    const extraInManifest = enumValues
      .map((e) => e.toLowerCase())
      .filter((v) => !figmaValues.includes(v) && v !== "true" && v !== "false");
    if (extraInManifest.length > 0) {
      findings.push({
        severity: "warn",
        code: "enum-extra",
        message: `${entry.cadsName}.${codeProp}: manifest values not in Figma axis "${axis}" — ${extraInManifest.join(", ")}`,
      });
    }
  }

  const designOnly = new Set(entry.designOnlyAxes ?? []);
  for (const axis of Object.keys(entry.variantProperties ?? {})) {
    const mapped = entry.axisToCodeProp?.[axis];
    if (mapped == null && !designOnly.has(axis)) {
      findings.push({
        severity: "error",
        code: "unaccounted-figma-axis",
        message: `${entry.cadsName}: Figma axis "${axis}" is neither mapped to a code prop nor listed in designOnlyAxes`,
      });
    }
  }

  const codeOnly = parseCodeOnlyProps(entry, findings);
  const knownUnmapped = new Set(entry.unmappedManifestProps ?? []);

  for (const prop of manifestComp.props) {
    if (mappedCodeProps.has(prop.name)) continue;
    if (codeOnly.has(prop.name)) continue;
    if (knownUnmapped.has(prop.name)) {
      findings.push({
        severity: "escalate",
        code: "unmapped-prop",
        message: `${entry.cadsName}.${prop.name}: in manifest but not a Figma variant axis — human decision (design-tool-only vs code-idiomatic)`,
      });
      continue;
    }
    findings.push({
      severity: "error",
      code: "invented-prop",
      message: `${entry.cadsName}.${prop.name}: in manifest, not mapped from Figma, not in codeOnlyProps — likely invented`,
    });
  }

  for (const axis of designOnly) {
    const leaked = entry.axisToCodeProp?.[axis];
    if (leaked) {
      findings.push({
        severity: "error",
        code: "design-axis-leaked",
        message: `${entry.cadsName}: design-only axis "${axis}" incorrectly mapped to prop "${leaked}"`,
      });
    }
  }

  if (entry.stateRecipes?.length) {
    findings.push({
      severity: "info",
      code: "state-recipes",
      message: `${entry.cadsName}: verify CSS recipes for states [${entry.stateRecipes.join(", ")}] per color/variant (not a React prop)`,
    });
  }

  for (const note of entry.escalate ?? []) {
    findings.push({
      severity: "escalate",
      code: "snapshot-escalate",
      message: `${entry.cadsName}: ${note}`,
    });
  }

  return findings;
}

async function loadManifest() {
  if (!fs.existsSync(MANIFEST_DIST)) {
    throw new Error(
      `Missing ${MANIFEST_DIST}. Run pnpm build:react first (dist is the audit source).`,
    );
  }
  if (
    fs.existsSync(MANIFEST_SOURCE) &&
    fs.statSync(MANIFEST_SOURCE).mtimeMs > fs.statSync(MANIFEST_DIST).mtimeMs
  ) {
    throw new Error(
      `Manifest dist is older than ${MANIFEST_SOURCE}. Run pnpm build:react before auditing.`,
    );
  }
  const mod = await import(pathToFileURL(MANIFEST_DIST).href);
  return mod.cadsManifest;
}

async function main() {
  if (!fs.existsSync(SNAPSHOT_PATH)) {
    console.error(`Snapshot not found: ${SNAPSHOT_PATH}`);
    process.exit(1);
  }

  const snapshot = loadJson(SNAPSHOT_PATH);
  const manifest = await loadManifest();
  const all = [];

  console.log("CADS Figma ↔ manifest prop audit");
  console.log(`  snapshot: ${path.relative(REPO, SNAPSHOT_PATH)}`);
  console.log(`  fetched:  ${snapshot.fetchedAt} (${snapshot.source})`);
  console.log(`  manifest: v${manifest.version} (${manifest.components.length} components)`);
  console.log("");

  for (const entry of snapshot.components) {
    const comp = findManifestComponent(manifest, entry.cadsName);
    const findings = auditComponent(entry, comp);
    all.push(...findings);

    const errors = findings.filter((f) => f.severity === "error");
    const warns = findings.filter((f) => f.severity === "warn");
    const escalates = findings.filter((f) => f.severity === "escalate");
    const infos = findings.filter((f) => f.severity === "info");

    console.log(`## ${entry.cadsName} (${entry.figmaName})`);
    if (findings.length === 0) {
      console.log("  ok — no findings");
    } else {
      for (const f of [...errors, ...warns, ...escalates, ...infos]) {
        console.log(`  [${f.severity}] ${f.code}: ${f.message}`);
      }
    }
    console.log("");
  }

  const counts = {
    error: all.filter((f) => f.severity === "error").length,
    warn: all.filter((f) => f.severity === "warn").length,
    escalate: all.filter((f) => f.severity === "escalate").length,
    info: all.filter((f) => f.severity === "info").length,
  };

  console.log(
    `Summary: ${counts.error} error, ${counts.warn} warn, ${counts.escalate} escalate, ${counts.info} info`,
  );
  console.log(
    "Escalate findings need a human (API shape / ambiguous Figma). Fix errors and warnings before saying done.",
  );

  if (
    STRICT &&
    (counts.error > 0 || counts.warn > 0 || counts.escalate > 0)
  ) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
