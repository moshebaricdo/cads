"use client";

import { Button, Popover, Toggle, Tooltip } from "@moshebaricdo/cads-react";
import Link from "next/link";
import {
  Suspense,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { DOCS_EXPERIMENTS, type DocsExperiment } from "@/lib/experiments";
import { useDocsWideMotionFlag } from "@/lib/useDocsWideMotionFlag";
import s from "./ExperimentsControl.module.scss";

function ExperimentRow({
  experiment,
  motionEnabled,
  onMotionChange,
  onNavigate,
}: {
  experiment: DocsExperiment;
  motionEnabled: boolean;
  onMotionChange: (next: boolean) => void;
  onNavigate?: () => void;
}) {
  const isControllable = Boolean(experiment.controllable);
  const checked = experiment.id === "motion" ? motionEnabled : false;
  const href = experiment.docs;

  const copy = (
    <div className={s.rowCopy}>
      <p className={s.rowName}>{experiment.name}</p>
      <p className={s.rowSummary}>{experiment.description}</p>
    </div>
  );

  if (isControllable) {
    const toggle = () => onMotionChange(!checked);
    const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggle();
      }
    };

    return (
      <li>
        <div
          className={s.row}
          role="switch"
          tabIndex={0}
          aria-checked={checked}
          aria-label={`${experiment.name} experiment`}
          onClick={toggle}
          onKeyDown={onKeyDown}
        >
          {copy}
          <div className={s.rowToggle} aria-hidden>
            <Toggle
              size="extraSmall"
              hasIcons={false}
              checked={checked}
              tabIndex={-1}
              onChange={() => {
                /* Row owns the interaction; Toggle is visual. */
              }}
            />
          </div>
        </div>
      </li>
    );
  }

  if (href) {
    return (
      <li>
        <Link href={href} className={s.row} onClick={onNavigate}>
          {copy}
        </Link>
      </li>
    );
  }

  return <li className={s.row}>{copy}</li>;
}

function ExperimentsControlInner() {
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const { enabled: motionEnabled, setFlag: setMotionFlag } =
    useDocsWideMotionFlag();

  const setPopoverOpen = (next: boolean) => {
    openRef.current = next;
    setOpen(next);
    // Click focuses the trigger; close tooltip before that focus can reopen it.
    if (next) setTooltipOpen(false);
  };

  return (
    <Popover
      content="custom"
      caretPlacement="topRight"
      hasCaret={false}
      isDismissible={false}
      open={open}
      onOpenChange={setPopoverOpen}
      className={s.popover}
      customContent={
        <div className={s.panel} aria-labelledby={titleId}>
          <h2 id={titleId} className={s.srOnly}>
            Experiments
          </h2>
          <ul className={s.list}>
            {DOCS_EXPERIMENTS.map((experiment) => (
              <ExperimentRow
                key={experiment.id}
                experiment={experiment}
                motionEnabled={motionEnabled}
                onMotionChange={setMotionFlag}
                onNavigate={() => setPopoverOpen(false)}
              />
            ))}
          </ul>
        </div>
      }
    >
      <Tooltip
        title="Experiments"
        placement="bottom"
        open={tooltipOpen}
        onOpen={() => {
          if (!openRef.current) setTooltipOpen(true);
        }}
        onClose={() => setTooltipOpen(false)}
      >
        <Button
          variant="outlined"
          color="secondary"
          size="extraSmall"
          iconOnly
          startIconName="flask"
          aria-label="Experiments"
          aria-haspopup="dialog"
        />
      </Tooltip>
    </Popover>
  );
}

/** Topbar Experiments control center (Popover + custom content). */
export function ExperimentsControl() {
  return (
    <Suspense
      fallback={
        <Button
          variant="outlined"
          color="secondary"
          size="extraSmall"
          iconOnly
          startIconName="flask"
          aria-label="Experiments"
          disabled
        />
      }
    >
      <ExperimentsControlInner />
    </Suspense>
  );
}
