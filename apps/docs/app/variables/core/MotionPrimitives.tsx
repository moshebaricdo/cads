"use client";

import { motion } from "@codeai/cads-variables";
import { Tabs, Tooltip } from "@codeai/cads-react";
import { motion as m, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { CopyName } from "../spacing/CopyName";
import shared from "../FoundationPage.module.scss";
import local from "./motion.module.scss";
import { EasingChart } from "./EasingChart";

const DURATIONS = [
  {
    token: "duration-instant",
    variable: "--duration-instant",
    value: motion.durationInstant,
    use: "Hard cut / reduced-motion press",
  },
  {
    token: "duration-fast",
    variable: "--duration-fast",
    value: motion.durationFast,
    use: "High-frequency tint (Fade, Highlight chase)",
  },
  {
    token: "duration-short",
    variable: "--duration-short",
    value: motion.durationShort,
    use: "Chrome color + Press feedback",
  },
  {
    token: "duration-medium",
    variable: "--duration-medium",
    value: motion.durationMedium,
    use: "Travel + overlay enter (Surface); Indicator uses spring.moderate",
  },
] as const;

const SPRINGS = [
  {
    token: "spring.fast",
    copyValue: "motion.spring.fast",
    preset: motion.spring.fast,
    use: "Pointer chase / docs nav highlight",
  },
  {
    token: "spring.moderate",
    copyValue: "motion.spring.moderate",
    preset: motion.spring.moderate,
    use: "Indicator (Toggle handle, Tabs underline)",
  },
  {
    token: "spring.slow",
    copyValue: "motion.spring.slow",
    preset: motion.spring.slow,
    use: "Drag release / drawer settle only",
  },
] as const;

const SCALES = [
  {
    token: "motion-press-scale",
    variable: "--motion-press-scale",
    value: motion.press.scale,
    use: "Active feedback on pressable controls",
  },
  {
    token: "motion-surface-from-scale",
    variable: "--motion-surface-from-scale",
    value: motion.surface.fromScale,
    use: "Overlay / menu enter start scale",
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
    use: "CSS Indicator fallback (non-spring / reduced-motion)",
  },
] as const;

const TABS = [
  { value: "duration", label: "Duration" },
  { value: "easing", label: "Easing" },
  { value: "spring", label: "Spring" },
  { value: "scale", label: "Scale" },
] as const;

type TabValue = (typeof TABS)[number]["value"];

function DurationPanel() {
  return (
    <div className={local.durationGrid}>
      {DURATIONS.map((item) => (
        <div
          className={shared.shapeItem}
          key={item.token}
          style={{ "--demo-duration": item.value } as CSSProperties}
        >
          <div className={local.durationSample} tabIndex={0}>
            <div className={local.motionDot} />
          </div>
          <div className={shared.shapeMeta}>
            <div className={shared.rangeHeader}>
              <CopyName className={shared.copyName} copyValue={item.variable}>
                {item.token}
              </CopyName>
              <span className={shared.rangeCount}>{item.value}</span>
            </div>
            <p className={local.recipeBody}>{item.use}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ScaleSample({
  variable,
  value,
}: {
  variable: string;
  value: string;
}) {
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    },
    [],
  );

  function handleCopy() {
    void navigator.clipboard?.writeText(variable).then(() => {
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 1200);
    });
  }

  return (
    <Tooltip
      title={copied ? "Copied" : variable}
      hasCaret={false}
      placement="top"
      iconName={copied ? "check" : undefined}
    >
      <button
        type="button"
        className={local.scaleSample}
        style={{ "--demo-scale": value } as CSSProperties}
        aria-label={`Copy ${variable}`}
        onClick={handleCopy}
      >
        <div className={local.scaleStage}>
          <div className={local.scaleGhost} aria-hidden />
          <div className={local.scaleShape} />
        </div>
      </button>
    </Tooltip>
  );
}

function ScalePanel() {
  return (
    <div className={`${shared.shapeGrid} ${local.recipeGrid}`}>
      {SCALES.map((item) => (
        <div className={shared.shapeItem} key={item.token}>
          <ScaleSample variable={item.variable} value={item.value} />
          <div className={shared.shapeMeta}>
            <div className={shared.rangeHeader}>
              <CopyName className={shared.copyName} copyValue={item.variable}>
                {item.token}
              </CopyName>
              <span className={shared.rangeCount}>{item.value}</span>
            </div>
            <p className={local.recipeBody}>{item.use}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function EasingPanel() {
  return (
    <div className={`${shared.shapeGrid} ${local.recipeGrid}`}>
      {EASINGS.map((item) => (
        <div className={shared.shapeItem} key={item.token}>
          <EasingChart value={item.value} variable={item.variable} />
          <div className={shared.shapeMeta}>
            <CopyName className={shared.copyName} copyValue={item.variable}>
              {item.token}
            </CopyName>
            <p className={local.recipeBody}>{item.use}</p>
            <CopyName
              className={shared.copyValue}
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

const SPRING_HANDLE_PX = 30;
const SPRING_INSET_PX = 4;

function SpringSample({
  preset,
  label,
}: {
  preset: (typeof SPRINGS)[number]["preset"];
  label: string;
}) {
  const trackRef = useRef<HTMLButtonElement>(null);
  const [on, setOn] = useState(false);
  const [travel, setTravel] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const el = trackRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const measure = () => {
      setTravel(
        Math.max(0, el.clientWidth - SPRING_HANDLE_PX - SPRING_INSET_PX * 2),
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <button
      ref={trackRef}
      type="button"
      className={local.springSample}
      aria-label={`Toggle ${label} spring demo`}
      aria-pressed={on}
      onClick={() => setOn((v) => !v)}
    >
      <m.div
        className={local.springThumb}
        initial={false}
        animate={{ x: on ? travel : 0 }}
        transition={reduceMotion ? { duration: 0 } : preset}
      />
    </button>
  );
}

function SpringPanel() {
  return (
    <div className={`${shared.shapeGrid} ${local.recipeGrid}`}>
      {SPRINGS.map((item) => (
        <div className={shared.shapeItem} key={item.token}>
          <SpringSample preset={item.preset} label={item.token} />
          <div className={shared.shapeMeta}>
            <div className={shared.rangeHeader}>
              <CopyName className={shared.copyName} copyValue={item.copyValue}>
                {item.token}
              </CopyName>
              <span className={shared.rangeCount}>
                {item.preset.duration * 1000}ms · b{item.preset.bounce}
              </span>
            </div>
            <p className={local.recipeBody}>{item.use}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Tabbed Duration / Easing / Spring / Scale specimens. */
export function MotionPrimitives() {
  const [tab, setTab] = useState<TabValue>("duration");

  return (
    <div className={shared.tabbedContent}>
      <Tabs
        type="primary"
        size="small"
        aria-label="Motion primitives"
        value={tab}
        onChange={(value) => setTab(value as TabValue)}
        items={[...TABS]}
      />
      <div className={local.primitivePanel}>
        {tab === "duration" ? (
          <DurationPanel />
        ) : tab === "easing" ? (
          <EasingPanel />
        ) : tab === "spring" ? (
          <SpringPanel />
        ) : (
          <ScalePanel />
        )}
      </div>
    </div>
  );
}
