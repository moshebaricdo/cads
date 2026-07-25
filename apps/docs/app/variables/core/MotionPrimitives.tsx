"use client";

import { motion } from "@codeai/cads-variables";
import { Tabs } from "@codeai/cads-react";
import { useState, type CSSProperties } from "react";
import { CopyName } from "../spacing/CopyName";
import styles from "../FoundationPage.module.css";
import { EasingChart } from "./EasingChart";

const CHROME_DURATIONS = [
  {
    token: "duration-instant",
    variable: "--duration-instant",
    value: motion.durationInstant,
  },
  {
    token: "duration-short",
    variable: "--duration-short",
    value: motion.durationShort,
  },
  {
    token: "duration-medium",
    variable: "--duration-medium",
    value: motion.durationMedium,
  },
] as const;

const RECIPE_DURATIONS = [
  {
    token: "motion-press-duration",
    variable: "--motion-press-duration",
    value: motion.press.duration,
  },
  {
    token: "motion-surface-duration",
    variable: "--motion-surface-duration",
    value: motion.surface.duration,
  },
  {
    token: "motion-indicator-duration",
    variable: "--motion-indicator-duration",
    value: motion.indicator.duration,
  },
] as const;

const EASINGS = [
  {
    token: "easing-standard",
    variable: "--easing-standard",
    value: motion.easingStandard,
    use: "Everyday chrome (color, focus)",
  },
  {
    token: "easing-out",
    variable: "--easing-out",
    value: motion.easingOut,
    use: "User-initiated feedback (Press, Surface)",
  },
  {
    token: "easing-emphasized",
    variable: "--easing-emphasized",
    value: motion.easingEmphasized,
    use: "Committed selection travel (Indicator)",
  },
] as const;

const TABS = [
  { value: "duration", label: "Duration" },
  { value: "easing", label: "Easing" },
] as const;

type TabValue = (typeof TABS)[number]["value"];

function DurationTracks({
  items,
}: {
  items: readonly {
    token: string;
    variable: string;
    value: string;
  }[];
}) {
  return (
    <div className={`${styles.shapeGrid} ${styles.recipeGrid}`}>
      {items.map((item) => (
        <div
          className={styles.shapeItem}
          key={item.token}
          style={{ "--demo-duration": item.value } as CSSProperties}
        >
          <div className={styles.durationSample} tabIndex={0}>
            <div className={styles.motionDot} />
          </div>
          <div className={styles.rangeHeader}>
            <CopyName className={styles.copyName} copyValue={item.variable}>
              {item.token}
            </CopyName>
            <span className={styles.rangeCount}>{item.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function DurationPanel() {
  return (
    <div className={styles.rangeList}>
      <div>
        <DurationTracks items={CHROME_DURATIONS} />
      </div>
      <div>
        <DurationTracks items={RECIPE_DURATIONS} />
      </div>
    </div>
  );
}

function EasingPanel() {
  return (
    <div className={`${styles.shapeGrid} ${styles.recipeGrid}`}>
      {EASINGS.map((item) => (
        <div className={styles.shapeItem} key={item.token}>
          <EasingChart value={item.value} variable={item.variable} />
          <div className={styles.shapeMeta}>
            <CopyName className={styles.copyName} copyValue={item.variable}>
              {item.token}
            </CopyName>
            <p className={styles.recipeBody}>{item.use}</p>
            <CopyName
              className={styles.copyValue}
              copyValue={item.value}
              placement="bottom-start"
            >
              {item.value}
            </CopyName>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Tabbed Duration / Easing specimens — same pattern as Color / Typography. */
export function MotionPrimitives() {
  const [tab, setTab] = useState<TabValue>("duration");

  return (
    <div className={styles.tabbedContent}>
      <Tabs
        type="primary"
        size="small"
        aria-label="Motion primitives"
        value={tab}
        onChange={(value) => setTab(value as TabValue)}
        items={[...TABS]}
      />
      <div className={styles.primitivePanel}>
        {tab === "duration" ? <DurationPanel /> : <EasingPanel />}
      </div>
    </div>
  );
}
