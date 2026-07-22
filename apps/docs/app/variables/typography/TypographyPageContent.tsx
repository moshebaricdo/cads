"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { typography } from "@codeai/cads-variables";
import { SegmentedButton, Tabs } from "@codeai/cads-react";
import styles from "../FoundationPage.module.css";

type WeightOption = {
  value: string;
  label: string;
  weight: string;
};

type StyleGroup = {
  label: string;
  family: string;
  familyLabel: string;
  size: string;
  lineHeight: string;
  letterSpacing?: string;
  letterSpacingLabel?: string;
  uppercase?: boolean;
  underline?: boolean;
  /** Fixed weight when the collection has no weight control. */
  weight?: string;
  weightLabel?: string;
};

type StyleTab = {
  value: string;
  label: string;
  styles: StyleGroup[];
  /** Seeded editable sample text for every style in this collection. */
  sample: string;
  weightOptions?: WeightOption[];
  defaultWeight?: string;
};

const WEIGHTS = {
  bold: typography.fontWeight.bold,
  semibold: typography.fontWeight.semibold,
  regular: typography.fontWeight.normal,
} as const;

const WEIGHT_OPTIONS: WeightOption[] = [
  { value: "regular", label: "Regular", weight: WEIGHTS.regular },
  { value: "semibold", label: "Semi Bold", weight: WEIGHTS.semibold },
  { value: "bold", label: "Bold", weight: WEIGHTS.bold },
];

const MONO_WEIGHT_OPTIONS: WeightOption[] = [
  { value: "regular", label: "Regular", weight: WEIGHTS.regular },
  { value: "strong", label: "Strong", weight: WEIGHTS.semibold },
];

/** Use loaded next/font CSS variables — bare "Geist" / "Space Grotesk" names won't hit the VF files. */
const FONT_HEADING = "var(--font-heading)";
const FONT_BODY = "var(--font-body)";
const FONT_MONO = "var(--font-mono)";

const HEADING_SIZES = [
  {
    level: "H1",
    size: typography.fontSize.headingXxl,
    lineHeight: typography.lineHeight.headingXxl,
    family: FONT_HEADING,
    familyLabel: "Space Grotesk",
    letterSpacing: typography.letterSpacing.headingDisplay,
    letterSpacingLabel: "-1%",
  },
  {
    level: "H2",
    size: typography.fontSize.headingXl,
    lineHeight: typography.lineHeight.headingXl,
    family: FONT_HEADING,
    familyLabel: "Space Grotesk",
    letterSpacing: typography.letterSpacing.headingDisplay,
    letterSpacingLabel: "-1%",
  },
  {
    level: "H3",
    size: typography.fontSize.headingLg,
    lineHeight: typography.lineHeight.headingLg,
    family: FONT_BODY,
    familyLabel: "Geist",
  },
  {
    level: "H4",
    size: typography.fontSize.headingMd,
    lineHeight: typography.lineHeight.headingMd,
    family: FONT_BODY,
    familyLabel: "Geist",
  },
  {
    level: "H5",
    size: typography.fontSize.headingSm,
    lineHeight: typography.lineHeight.headingSm,
    family: FONT_BODY,
    familyLabel: "Geist",
  },
  {
    level: "H6",
    size: typography.fontSize.headingXs,
    lineHeight: typography.lineHeight.headingXs,
    family: FONT_BODY,
    familyLabel: "Geist",
  },
] as const;

const BODY_SIZES = [
  {
    level: "Body 1",
    size: typography.fontSize.bodyLg,
    lineHeight: typography.lineHeight.bodyLg,
  },
  {
    level: "Body 2",
    size: typography.fontSize.bodyMd,
    lineHeight: typography.lineHeight.bodyMd,
  },
  {
    level: "Body 3",
    size: typography.fontSize.bodySm,
    lineHeight: typography.lineHeight.bodySm,
  },
  {
    level: "Body 4",
    size: typography.fontSize.bodyXs,
    lineHeight: typography.lineHeight.bodyXs,
  },
  {
    level: "Body 5",
    size: typography.fontSize.bodyXxs,
    lineHeight: typography.lineHeight.bodyXxs,
  },
] as const;

/** Figma uses 6% tracking on overlines (closer than `--tracking-overline`). */
const OVERLINE_TRACKING = "0.06em";

const HEADING_STYLES: StyleGroup[] = HEADING_SIZES.map((heading) => ({
  label: heading.level,
  family: heading.family,
  familyLabel: heading.familyLabel,
  size: heading.size,
  lineHeight: heading.lineHeight,
  letterSpacing:
    "letterSpacing" in heading ? heading.letterSpacing : undefined,
  letterSpacingLabel:
    "letterSpacingLabel" in heading ? heading.letterSpacingLabel : "0%",
}));

const BODY_STYLES: StyleGroup[] = BODY_SIZES.map((body) => ({
  label: body.level,
  family: FONT_BODY,
  familyLabel: "Geist",
  size: body.size,
  lineHeight: body.lineHeight,
  letterSpacingLabel: "0%",
}));

const OVERLINE_STYLES: StyleGroup[] = [
  {
    label: "Overline 1",
    family: FONT_BODY,
    familyLabel: "Geist",
    weight: WEIGHTS.semibold,
    weightLabel: "Semi Bold",
    size: typography.fontSize.bodySm,
    lineHeight: typography.lineHeight.bodySm,
    letterSpacing: OVERLINE_TRACKING,
    letterSpacingLabel: "6%",
    uppercase: true,
  },
  {
    label: "Overline 2",
    family: FONT_BODY,
    familyLabel: "Geist",
    weight: WEIGHTS.semibold,
    weightLabel: "Semi Bold",
    size: typography.fontSize.bodyXs,
    lineHeight: typography.lineHeight.bodyXs,
    letterSpacing: OVERLINE_TRACKING,
    letterSpacingLabel: "6%",
    uppercase: true,
  },
  {
    label: "Overline 3",
    family: FONT_BODY,
    familyLabel: "Geist",
    weight: WEIGHTS.semibold,
    weightLabel: "Semi Bold",
    size: typography.fontSize.bodyXxs,
    lineHeight: typography.lineHeight.bodyXxs,
    letterSpacing: OVERLINE_TRACKING,
    letterSpacingLabel: "6%",
    uppercase: true,
  },
];

const LABEL_STYLES: StyleGroup[] = [
  {
    label: "Label 1",
    family: FONT_BODY,
    familyLabel: "Geist",
    weight: WEIGHTS.semibold,
    weightLabel: "Semi Bold",
    size: typography.fontSize.bodyMd,
    lineHeight: typography.lineHeight.bodyMd,
    letterSpacingLabel: "0%",
  },
  {
    label: "Label 2",
    family: FONT_BODY,
    familyLabel: "Geist",
    weight: WEIGHTS.semibold,
    weightLabel: "Semi Bold",
    size: typography.fontSize.bodySm,
    lineHeight: typography.lineHeight.bodySm,
    letterSpacingLabel: "0%",
  },
  {
    label: "Label 3",
    family: FONT_BODY,
    familyLabel: "Geist",
    weight: WEIGHTS.semibold,
    weightLabel: "Semi Bold",
    size: typography.fontSize.bodyXs,
    lineHeight: typography.lineHeight.bodyXs,
    letterSpacingLabel: "0%",
  },
  {
    label: "Label 4",
    family: FONT_BODY,
    familyLabel: "Geist",
    weight: WEIGHTS.semibold,
    weightLabel: "Semi Bold",
    size: typography.fontSize.bodyXxs,
    lineHeight: typography.lineHeight.bodyXxs,
    letterSpacingLabel: "0%",
  },
];

const LINK_STYLES: StyleGroup[] = BODY_SIZES.map((body, index) => ({
  label: `Link Body ${index + 1}`,
  family: FONT_BODY,
  familyLabel: "Geist",
  weight: WEIGHTS.semibold,
  weightLabel: "Semi Bold",
  size: body.size,
  lineHeight: body.lineHeight,
  letterSpacingLabel: "0%",
  underline: true,
}));

const MONO_STYLES: StyleGroup[] = BODY_SIZES.map((body, index) => ({
  label: `Mono Body ${index + 1}`,
  family: FONT_MONO,
  familyLabel: "Google Sans Code",
  size: body.size,
  lineHeight: body.lineHeight,
  letterSpacingLabel: "0%",
}));

const STYLE_TABS: StyleTab[] = [
  {
    value: "heading",
    label: "Heading",
    styles: HEADING_STYLES,
    sample: "Build learning experiences that feel inevitable",
    weightOptions: WEIGHT_OPTIONS,
    defaultWeight: "semibold",
  },
  {
    value: "body",
    label: "Body",
    styles: BODY_STYLES,
    sample:
      "The quick brown fox jumps over the lazy dog. How vexingly quick daft zebras jump when bright students read every page aloud.",
    weightOptions: WEIGHT_OPTIONS,
    defaultWeight: "regular",
  },
  {
    value: "overline",
    label: "Overline",
    styles: OVERLINE_STYLES,
    sample: "Getting started",
  },
  {
    value: "label",
    label: "Label",
    styles: LABEL_STYLES,
    sample: "Email address",
  },
  {
    value: "link",
    label: "Link",
    styles: LINK_STYLES,
    sample: "View typography guidelines",
  },
  {
    value: "mono",
    label: "Mono",
    styles: MONO_STYLES,
    sample: 'const theme = createCadsTheme({ mode: "light" });',
    weightOptions: MONO_WEIGHT_OPTIONS,
    defaultWeight: "regular",
  },
];

function StyleRow({
  style,
  sample,
  weightValue,
  weightLabel,
  measure,
}: {
  style: StyleGroup;
  sample: string;
  weightValue: string;
  weightLabel: string;
  /** Narrower reading measure for body / mono samples. */
  measure?: boolean;
}) {
  const sampleRef = useRef<HTMLDivElement>(null);
  const seeded = useRef(false);

  useLayoutEffect(() => {
    if (seeded.current || !sampleRef.current) return;
    sampleRef.current.textContent = sample;
    seeded.current = true;
  }, [sample]);

  const metrics = [
    style.familyLabel,
    weightLabel,
    `${style.size} / ${style.lineHeight}`,
    style.letterSpacingLabel ?? "0%",
  ].join(" · ");

  return (
    <div className={styles.specimen}>
      <div
        ref={sampleRef}
        className={[
          styles.specimenSample,
          measure ? styles.specimenSampleMeasure : null,
          style.underline ? styles.specimenSampleLink : null,
        ]
          .filter(Boolean)
          .join(" ")}
        contentEditable
        suppressContentEditableWarning
        spellCheck={false}
        role="textbox"
        aria-label={`${style.label} sample`}
        style={{
          fontFamily: style.family,
          fontSize: style.size,
          fontWeight: Number(weightValue),
          lineHeight: style.lineHeight,
          letterSpacing: style.letterSpacing,
          textTransform: style.uppercase ? "uppercase" : undefined,
          textDecoration: style.underline ? "underline" : undefined,
        }}
      />
      <div className={styles.specimenMeta}>
        <span className={styles.specimenValue}>{metrics}</span>
      </div>
    </div>
  );
}

function defaultWeightsByTab() {
  return Object.fromEntries(
    STYLE_TABS.filter((tab) => tab.defaultWeight).map((tab) => [
      tab.value,
      tab.defaultWeight!,
    ]),
  );
}

export function TypographyPageContent() {
  const [tab, setTab] = useState(STYLE_TABS[0]!.value);
  const [weightsByTab, setWeightsByTab] = useState(defaultWeightsByTab);

  const activeTab = STYLE_TABS.find((item) => item.value === tab) ?? STYLE_TABS[0]!;
  const weightOptions = activeTab.weightOptions;
  const weightKey =
    weightsByTab[tab] ??
    activeTab.defaultWeight ??
    weightOptions?.[0]?.value ??
    "";
  const activeWeight = weightOptions?.find((option) => option.value === weightKey);
  const weightValue =
    activeWeight?.weight ?? activeTab.styles[0]?.weight ?? WEIGHTS.regular;
  const weightLabel =
    activeWeight?.label ?? activeTab.styles[0]?.weightLabel ?? "Regular";

  return (
    <section className={styles.section} aria-labelledby="type-styles">
      <h2 id="type-styles" className={`docs-h2 ${styles.sectionTitle}`}>
        Text styles
      </h2>
      <p className={`docs-section-desc ${styles.sectionBody}`}>
        Every published Figma text style from the Typography page — headings,
        body, overline, label, link, and mono. Semi Bold is the default heading
        weight (page titles and section titles across this site).
      </p>
      <div className={styles.sectionContent}>
        <div className={styles.tabbedContent}>
          <div className={styles.tabRow}>
            <Tabs
              type="primary"
              size="small"
              className={styles.tabsFlush}
              aria-label="Typography style groups"
              value={tab}
              onChange={setTab}
              items={STYLE_TABS.map(({ value, label }) => ({ value, label }))}
            />
            {weightOptions ? (
              <div className={styles.tabWeight}>
                <SegmentedButton
                  size="extraSmall"
                  value={weightKey}
                  onChange={(value) =>
                    setWeightsByTab((current) => ({
                      ...current,
                      [tab]: value,
                    }))
                  }
                  aria-label={`${activeTab.label} weight`}
                  options={weightOptions.map((option) => ({
                    value: option.value,
                    label: option.label,
                  }))}
                />
              </div>
            ) : null}
          </div>
          <div className={styles.dividedList}>
            {activeTab.styles.map((style) => (
              <StyleRow
                key={style.label}
                style={style}
                sample={activeTab.sample}
                measure={tab === "body" || tab === "mono"}
                weightValue={
                  weightOptions
                    ? weightValue
                    : (style.weight ?? WEIGHTS.regular)
                }
                weightLabel={
                  weightOptions
                    ? weightLabel
                    : (style.weightLabel ?? "Regular")
                }
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
