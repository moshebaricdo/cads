"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
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

function boxStyle(box: Box): CSSProperties {
  return {
    transform: `translate(${box.x}px, ${box.y}px)`,
    width: box.width,
    height: box.height,
  };
}

/**
 * Docs-only floating nav highlights — not a CADS catalog pattern.
 * Highlights snap instantly (no spring / chase / fade).
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
  const clearHoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const [activeBox, setActiveBox] = useState<Box | null>(null);
  /** Pointer over the active row — darkens fill to tertiary. */
  const [activeHovered, setActiveHovered] = useState(false);
  const [hoverBox, setHoverBox] = useState<Box | null>(null);

  const syncHover = useCallback(() => {
    const root = rootRef.current;
    const el = hoverElRef.current;
    if (!root || !el || !root.contains(el)) {
      hoverElRef.current = null;
      setHoverBox(null);
      setActiveHovered(false);
      return;
    }
    const active = findActiveItem(root);
    if (active === el) {
      setHoverBox(null);
      setActiveHovered(true);
      return;
    }
    setActiveHovered(false);
    setHoverBox(measureBox(root, el));
  }, []);

  const syncActive = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    const active = findActiveItem(root);
    if (!active) {
      setActiveBox(null);
      return;
    }
    setActiveBox(measureBox(root, active));
  }, []);

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
    setHoverBox(null);
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
      setHoverBox(null);
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
      setHoverBox(null);
      setActiveHovered(true);
      return;
    }

    setActiveHovered(false);
    setHoverBox(measureBox(root, item));
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

  return (
    <div
      ref={rootRef}
      className={className}
      onPointerOver={onPointerOver}
      onPointerLeave={onPointerLeave}
    >
      {activeBox ? (
        <div
          className="docs-nav-highlight docs-nav-highlight--active"
          aria-hidden
          data-hover={activeHovered || undefined}
          style={boxStyle(activeBox)}
        />
      ) : null}

      {hoverBox ? (
        <div
          className="docs-nav-highlight docs-nav-highlight--hover"
          aria-hidden
          style={boxStyle(hoverBox)}
        />
      ) : null}

      {children}
    </div>
  );
}
