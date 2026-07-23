"use client";

import { useState, type ReactNode } from "react";
import colorSystemJson from "@codeai/cads-variables/data/color-system.json";
import { Tabs } from "@codeai/cads-react";
import styles from "../FoundationPage.module.css";
import { ColorExportButton } from "./ColorExportButton";
import { ColorSwatch } from "./ColorSwatch";

type PrimitiveFamily = {
  id: string;
  collectionId: string;
  name: string;
  steps: { id: string; step: string; hex: string }[];
};

type Semantic = {
  id: string;
  surface: "background" | "text" | "borders";
  familyKey: string;
  role: string;
};

const colorSystem = colorSystemJson as {
  collections: { id: string; name: string }[];
  families: PrimitiveFamily[];
  primitiveFamilyOrders: Record<string, string[]>;
  semanticCollections: { id: Semantic["surface"]; name: string }[];
  semanticFamilies: { id: string; name: string }[];
  semanticSubGroups: { id: string; name: string }[];
  semanticFamilySubGroups: Record<string, string>;
  semanticFamilyOrders: Record<string, string[]>;
  semanticTokenOrders: Record<string, string[]>;
  semantics: Semantic[];
};

/** Matches `semanticExportVarName` in `@codeai/cads-variables`. */
const FLAT_SUBGROUPS = new Set(["sentiment", "state"]);
const SINGLE_FAMILY_SUBGROUPS = new Set(["brand"]);

function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-") || "family"
  );
}

function cssName(semantic: Semantic) {
  const surface =
    slugify(semantic.surface) === "borders"
      ? "border"
      : slugify(semantic.surface);
  const subGroupId =
    colorSystem.semanticFamilySubGroups[semantic.familyKey] ?? "accent";
  const subGroup = colorSystem.semanticSubGroups.find(
    (item) => item.id === subGroupId,
  );
  const subName = slugify(subGroup?.name ?? subGroupId);
  const familySegment = slugify(
    colorSystem.semanticFamilies.find((item) => item.id === semantic.familyKey)
      ?.name ?? semantic.familyKey,
  );

  const parts = [surface];
  if (!FLAT_SUBGROUPS.has(subName)) parts.push(subName);
  if (
    !SINGLE_FAMILY_SUBGROUPS.has(subName) &&
    familySegment !== subName &&
    familySegment !== parts[parts.length - 1]
  ) {
    parts.push(familySegment);
  }
  parts.push(slugify(semantic.role));
  return parts.join("-");
}

function Range({
  name,
  swatches,
}: {
  name: string;
  swatches: {
    id: string;
    color: string;
    tooltip: string;
    copyValue: string;
  }[];
}) {
  return (
    <div className={styles.range}>
      <div className={styles.rangeHeader}>
        <h3 className={styles.rangeName}>{name}</h3>
        <span className={styles.rangeCount}>{swatches.length}</span>
      </div>
      <div className={styles.swatchRange}>
        {swatches.map((swatch) => (
          <ColorSwatch
            key={swatch.id}
            color={swatch.color}
            label={swatch.tooltip}
            copyValue={swatch.copyValue}
          />
        ))}
      </div>
    </div>
  );
}

function CollectionTabs({
  ariaLabel,
  items,
  panels,
}: {
  ariaLabel: string;
  items: { value: string; label: string }[];
  panels: Record<string, ReactNode>;
}) {
  const [value, setValue] = useState(items[0]?.value ?? "");

  return (
    <div className={styles.tabbedContent}>
      <Tabs
        type="primary"
        size="small"
        aria-label={ariaLabel}
        value={value}
        onChange={setValue}
        items={items}
      />
      <div className={styles.rangeList}>{panels[value]}</div>
    </div>
  );
}

export function ColorPageContent() {
  const primitiveItems = colorSystem.collections
    .map((collection) => {
      const familyOrder =
        colorSystem.primitiveFamilyOrders[collection.id] ?? [];
      const families = familyOrder
        .map((id) => colorSystem.families.find((family) => family.id === id))
        .filter((family): family is PrimitiveFamily => Boolean(family));
      if (!families.length) return null;
      return { collection, families };
    })
    .filter(
      (
        item,
      ): item is {
        collection: (typeof colorSystem.collections)[number];
        families: PrimitiveFamily[];
      } => Boolean(item),
    );

  const semanticItems = colorSystem.semanticCollections.map((collection) => {
    const orderEntries = Object.entries(
      colorSystem.semanticFamilyOrders,
    ).filter(([key]) => key.startsWith(`${collection.id}::`));
    const familyKeys = orderEntries.flatMap(([, keys]) => keys);
    return { collection, familyKeys };
  });

  return (
    <>
      <section className={styles.section} aria-labelledby="primitive-colors">
        <h2 id="primitive-colors" className={`docs-h2 ${styles.sectionTitle}`}>
          Primitive colors
        </h2>
        <p className={`docs-section-desc ${styles.sectionBody}`}>
          Our core colors and their ramps, broken down into brand, sentiment, and neutral families.
          Primitives are used to build the semantic colors and are not light/dark theme aware, they should not
          be used directly in the product.
        </p>
        <div className={styles.sectionAction}>
          <ColorExportButton kind="primitive" />
        </div>
        <div className={styles.sectionContent}>
          <CollectionTabs
            ariaLabel="Primitive color collections"
            items={primitiveItems.map(({ collection }) => ({
              value: collection.id,
              label:
                collection.name.charAt(0).toUpperCase() +
                collection.name.slice(1),
            }))}
            panels={Object.fromEntries(
              primitiveItems.map(({ collection, families }) => [
                collection.id,
                families.map((family) => (
                  <Range
                    key={family.id}
                    name={family.name}
                    swatches={family.steps.map((step) => ({
                      id: step.id,
                      color: step.hex,
                      tooltip: `${step.step} · ${step.hex}`,
                      copyValue: step.hex,
                    }))}
                  />
                )),
              ]),
            )}
          />
        </div>
      </section>

      <section className={styles.section} aria-labelledby="semantic-colors">
        <h2 id="semantic-colors" className={`docs-h2 ${styles.sectionTitle}`}>
          Semantic colors
        </h2>
        <p className={`docs-section-desc ${styles.sectionBody}`}>
          Semantic colors are broken into three primary families: backgrounds, text, and borders.
          They assign primitives to specific contexts and are carefully crafted to ensure 
          proper contrast, support consistent usage of colors in the UI, and are theme aware.
        </p>
        <div className={styles.sectionAction}>
          <ColorExportButton kind="semantic" />
        </div>
        <div className={styles.sectionContent}>
          <CollectionTabs
            ariaLabel="Semantic color collections"
            items={semanticItems.map(({ collection }) => ({
              value: collection.id,
              label: collection.name,
            }))}
            panels={Object.fromEntries(
              semanticItems.map(({ collection, familyKeys }) => [
                collection.id,
                familyKeys.map((familyKey) => {
                  const familyName =
                    colorSystem.semanticFamilies.find(
                      (family) => family.id === familyKey,
                    )?.name ?? familyKey;
                  const roleOrder =
                    colorSystem.semanticTokenOrders[
                      `${collection.id}::${familyKey}`
                    ] ?? [];
                  const semantics = roleOrder
                    .map((role) =>
                      colorSystem.semantics.find(
                        (semantic) =>
                          semantic.surface === collection.id &&
                          semantic.familyKey === familyKey &&
                          semantic.role === role,
                      ),
                    )
                    .filter((semantic): semantic is Semantic =>
                      Boolean(semantic),
                    );
                  if (!semantics.length) return null;

                  return (
                    <Range
                      key={`${collection.id}-${familyKey}`}
                      name={familyName}
                      swatches={semantics.map((semantic) => {
                        const name = cssName(semantic);
                        const varName = `--${name}`;
                        return {
                          id: semantic.id,
                          color: `var(${varName})`,
                          tooltip: varName,
                          copyValue: varName,
                        };
                      })}
                    />
                  );
                }),
              ]),
            )}
          />
        </div>
      </section>
    </>
  );
}
