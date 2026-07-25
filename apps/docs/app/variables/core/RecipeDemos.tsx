"use client";

import { Button, CadsProvider, Toggle } from "@codeai/cads-react";
import { FaIcon } from "@codeai/cads-react/icons";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { CopyName } from "../spacing/CopyName";
import styles from "../FoundationPage.module.css";

const SURFACE_HOLD_MS = 2000;
/** Match `--motion-surface-duration` so exit can finish before unmount. */
const SURFACE_EXIT_MS = 180;

type Recipe = {
  id: "press" | "surface" | "indicator";
  name: string;
  transition: string;
  vars: string[];
};

const RECIPES: Recipe[] = [
  {
    id: "press",
    name: "Press",
    transition: "--transition-press",
    vars: [
      "--motion-press-scale",
      "--motion-press-duration",
      "--motion-press-easing",
      "--transition-press",
    ],
  },
  {
    id: "surface",
    name: "Surface",
    transition: "--transition-surface",
    vars: [
      "--motion-surface-from-scale",
      "--motion-surface-duration",
      "--motion-surface-easing",
      "--transition-surface",
    ],
  },
  {
    id: "indicator",
    name: "Indicator",
    transition: "--transition-indicator",
    vars: [
      "--motion-indicator-duration",
      "--motion-indicator-easing",
      "--transition-indicator",
    ],
  },
];

function PressSample() {
  return (
    <div className={`${styles.recipeSample} ${styles.pressSample}`}>
      <Button size="large" variant="contained" color="primary">
        Press me
      </Button>
    </div>
  );
}

function SurfaceSample() {
  const [phase, setPhase] = useState<"idle" | "open" | "exit">("idle");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(
    () => () => {
      for (const id of timers.current) clearTimeout(id);
    },
    [],
  );

  function clearTimers() {
    for (const id of timers.current) clearTimeout(id);
    timers.current = [];
  }

  function showSurface() {
    clearTimers();
    setPhase("open");
    timers.current.push(
      setTimeout(() => {
        setPhase("exit");
        timers.current.push(
          setTimeout(() => setPhase("idle"), SURFACE_EXIT_MS),
        );
      }, SURFACE_HOLD_MS),
    );
  }

  const surfaceVisible = phase === "open" || phase === "exit";

  return (
    <div className={`${styles.recipeSample} ${styles.surfaceSample}`}>
      <button
        type="button"
        className={styles.surfaceTrigger}
        onClick={showSurface}
        disabled={phase !== "idle"}
        aria-label="Show surface"
      >
        <FaIcon
          name="arrow-pointer"
          family="solid"
          fontSize="18px"
          aria-hidden
        />
        <span>Click</span>
      </button>
      {surfaceVisible ? (
        <div
          className={styles.surfacePanel}
          data-cads-surface=""
          {...(phase === "exit"
            ? { "data-cads-surface-state": "exit" }
            : {})}
          style={
            { "--cads-surface-origin": "center" } as CSSProperties
          }
        >
          <p className={styles.surfacePanelTitle}>Surface</p>
          <p className={styles.surfacePanelBody}>
            Menus, popovers, and toasts ease in from the trigger.
          </p>
        </div>
      ) : null}
    </div>
  );
}

function IndicatorSample() {
  const [on, setOn] = useState(false);

  return (
    <div className={`${styles.recipeSample} ${styles.indicatorSample}`}>
      <div className={styles.jumboToggle}>
        <Toggle
          size="large"
          checked={on}
          onChange={(_, next) => setOn(next)}
          aria-label="Indicator demo toggle"
        />
      </div>
    </div>
  );
}

function RecipeSample({ id }: { id: Recipe["id"] }) {
  if (id === "press") return <PressSample />;
  if (id === "surface") return <SurfaceSample />;
  return <IndicatorSample />;
}

/** Interactive Press / Surface / Indicator specimens for the Motion page. */
export function RecipeDemos() {
  return (
    <CadsProvider experimentalMotion baseline={false}>
      <div className={`${styles.shapeGrid} ${styles.recipeGrid}`}>
        {RECIPES.map((recipe) => (
          <div className={styles.shapeItem} key={recipe.id}>
            <RecipeSample id={recipe.id} />
            <div className={styles.shapeMeta}>
              <CopyName
                className={styles.copyName}
                copyValue={recipe.transition}
              >
                {recipe.name}
              </CopyName>
              <ul className={styles.recipeVars}>
                {recipe.vars.map((variable) => (
                  <li key={variable}>
                    <CopyName
                      className={styles.copyValue}
                      copyValue={variable}
                    >
                      {variable}
                    </CopyName>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </CadsProvider>
  );
}
