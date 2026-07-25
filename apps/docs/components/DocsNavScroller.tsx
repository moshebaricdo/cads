"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

type Box = { x: number; y: number; width: number; height: number };

function measureBox(root: HTMLElement, el: HTMLElement): Box {
  const rootRect = root.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  return {
    x: r.left - rootRect.left + root.scrollLeft,
    y: r.top - rootRect.top + root.scrollTop,
    width: r.width,
    height: r.height,
  };
}

function sectionKey(el: HTMLElement): string {
  return (
    el.closest("[data-nav-section]")?.getAttribute("data-nav-section") ??
    "__root"
  );
}

/**
 * Fill goes on the group folder / top-level leaf. Active children are
 * text-only (bold + primary) — same as the pre-highlight docs pattern.
 */
function findActiveItem(root: HTMLElement): HTMLElement | null {
  return (
    root.querySelector<HTMLElement>(
      '.docs-nav-item[data-active="true"]:not(.docs-nav-item--child)',
    ) ??
    root.querySelector<HTMLElement>(
      '.docs-nav-item--child[data-active="true"]',
    )
  );
}

/**
 * Snappier than `spring.fast` so the fill keeps up with CSS
 * `duration-medium` submenu expand/collapse.
 */
const CHASE_SPRING = { type: "spring" as const, duration: 0.08, bounce: 0 };

/**
 * Docs-only floating nav highlights — not a CADS catalog pattern.
 *
 * Hover is keyed by top-level nav section (Resources / Foundations /
 * Components). Within Components it springs continuously across group
 * folders and subitems. Crossing Resources ↔ Foundations ↔ Components
 * remounts (fade) instead of sliding. Active fill springs when the same
 * row is displaced by a submenu; snaps when the active row changes.
 */
export function DocsNavScroller({
  children,
  className,
  activeKey,
}: {
  children: ReactNode;
  className?: string;
  activeKey?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const hoverElRef = useRef<HTMLElement | null>(null);
  const activeElRef = useRef<HTMLElement | null>(null);
  const clearHoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const reduceMotion = useReducedMotion();

  const [activeBox, setActiveBox] = useState<Box | null>(null);
  const [activeVisible, setActiveVisible] = useState(false);
  /** Snap when switching active rows; spring when the same row is displaced. */
  const [activeSnap, setActiveSnap] = useState(true);
  /** Pointer over the active row — darkens fill to tertiary. */
  const [activeHovered, setActiveHovered] = useState(false);

  const [hover, setHover] = useState<{
    section: string;
    box: Box;
  } | null>(null);

  const syncHover = useCallback(() => {
    const root = rootRef.current;
    const el = hoverElRef.current;
    if (!root || !el || !root.contains(el)) {
      hoverElRef.current = null;
      setHover(null);
      setActiveHovered(false);
      return;
    }
    const active = findActiveItem(root);
    if (active === el) {
      setHover(null);
      setActiveHovered(true);
      return;
    }
    setActiveHovered(false);
    setHover({
      section: sectionKey(el),
      box: measureBox(root, el),
    });
  }, []);

  const syncActive = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    const active = findActiveItem(root);
    if (!active) {
      activeElRef.current = null;
      setActiveVisible(false);
      return;
    }
    const sameRow = activeElRef.current === active;
    activeElRef.current = active;
    setActiveSnap(!sameRow || Boolean(reduceMotion));
    setActiveBox(measureBox(root, active));
    setActiveVisible(true);
  }, [reduceMotion]);

  const syncHighlights = useCallback(() => {
    syncActive();
    syncHover();
  }, [syncActive, syncHover]);

  useLayoutEffect(() => {
    syncHighlights();
  }, [activeKey, syncHighlights]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof ResizeObserver === "undefined") return;

    const ro = new ResizeObserver(() => {
      syncHighlights();
    });
    ro.observe(root);
    /* Submenu open/close changes these boxes, not the scrollport’s border box. */
    for (const el of root.querySelectorAll(
      ".docs-nav-children, .docs-nav-section, .docs-nav-group",
    )) {
      ro.observe(el);
    }

    return () => ro.disconnect();
  }, [activeKey, syncHighlights]);

  function clearHover() {
    if (clearHoverTimerRef.current) {
      clearTimeout(clearHoverTimerRef.current);
      clearHoverTimerRef.current = null;
    }
    hoverElRef.current = null;
    setHover(null);
    setActiveHovered(false);
  }

  function cancelScheduledClear() {
    if (clearHoverTimerRef.current) {
      clearTimeout(clearHoverTimerRef.current);
      clearHoverTimerRef.current = null;
    }
  }

  /**
   * Debounced clear for non-item gaps. Tiny flex gaps between rows (~4px)
   * get cancelled when the next item is entered; larger section-label gaps
   * settle long enough for the fill to disappear.
   */
  function scheduleClearHover() {
    if (clearHoverTimerRef.current) return;
    clearHoverTimerRef.current = setTimeout(() => {
      clearHoverTimerRef.current = null;
      hoverElRef.current = null;
      setHover(null);
      setActiveHovered(false);
    }, 40);
  }

  function onPointerOver(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    const root = rootRef.current;
    if (!root) return;

    const item = (event.target as Element | null)?.closest?.(
      ".docs-nav-item",
    );
    if (!(item instanceof HTMLElement) || !root.contains(item)) {
      /* Section labels are large intentional gaps — clear immediately. */
      if (
        (event.target as Element | null)?.closest?.(
          ".docs-nav-section-label",
        )
      ) {
        clearHover();
      } else {
        scheduleClearHover();
      }
      return;
    }

    cancelScheduledClear();
    hoverElRef.current = item;
    const active = findActiveItem(root);
    if (active === item) {
      setHover(null);
      setActiveHovered(true);
      return;
    }

    setActiveHovered(false);
    setHover({
      section: sectionKey(item),
      box: measureBox(root, item),
    });
  }

  function onPointerLeave() {
    clearHover();
  }

  useEffect(
    () => () => {
      if (clearHoverTimerRef.current) clearTimeout(clearHoverTimerRef.current);
    },
    [],
  );

  const fade = reduceMotion
    ? { duration: 0 }
    : { duration: 0.08, ease: "easeOut" as const };
  const travel = reduceMotion ? { duration: 0 } : CHASE_SPRING;
  const activeTravel = activeSnap ? { duration: 0 } : travel;

  return (
    <div
      ref={rootRef}
      className={className}
      onPointerOver={onPointerOver}
      onPointerLeave={onPointerLeave}
    >
      <motion.div
        className="docs-nav-highlight docs-nav-highlight--active"
        aria-hidden
        data-hover={activeHovered || undefined}
        initial={false}
        animate={{
          x: activeBox?.x ?? 0,
          y: activeBox?.y ?? 0,
          width: activeBox?.width ?? 0,
          height: activeBox?.height ?? 0,
          opacity: activeVisible && activeBox ? 1 : 0,
        }}
        transition={{
          x: activeTravel,
          y: activeTravel,
          width: activeTravel,
          height: activeTravel,
          opacity: fade,
        }}
      />

      {/*
        key=section remounts when crossing Resources / Foundations / Components.
        Within Components, one key → continuous spring across groups + subitems.
      */}
      <AnimatePresence>
        {hover ? (
          <motion.div
            key={hover.section}
            className="docs-nav-highlight docs-nav-highlight--hover"
            aria-hidden
            initial={{
              opacity: 0,
              x: hover.box.x,
              y: hover.box.y,
              width: hover.box.width,
              height: hover.box.height,
            }}
            animate={{
              opacity: 1,
              x: hover.box.x,
              y: hover.box.y,
              width: hover.box.width,
              height: hover.box.height,
            }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: fade,
              x: travel,
              y: travel,
              width: travel,
              height: travel,
            }}
          />
        ) : null}
      </AnimatePresence>

      {children}
    </div>
  );
}
