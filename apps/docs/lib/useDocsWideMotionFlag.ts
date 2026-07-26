"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  MOTION_FLAG_EVENT,
  MOTION_FLAG_PARAM,
  readMotionFlagFromSession,
  writeMotionFlagToSession,
} from "@/lib/experimentalMotionFlag";

/** Docs-wide motion experiment (`?motion=` + session). Shared by topbar + Motion page. */
export function useDocsWideMotionFlag() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const sync = () => setEnabled(readMotionFlagFromSession());
    sync();
    window.addEventListener(MOTION_FLAG_EVENT, sync);
    return () => window.removeEventListener(MOTION_FLAG_EVENT, sync);
  }, []);

  const setFlag = useCallback(
    (next: boolean) => {
      writeMotionFlagToSession(next);
      setEnabled(next);
      // Avoid Next soft-navigation (Suspense remount) — session + event already
      // drive CadsProvider; keep the URL shareable via history only.
      const params = new URLSearchParams(searchParams.toString());
      params.set(MOTION_FLAG_PARAM, next ? "1" : "0");
      const query = params.toString();
      const url = query ? `${pathname}?${query}` : pathname;
      window.history.replaceState(window.history.state, "", url);
    },
    [pathname, searchParams],
  );

  return { enabled, setFlag };
}
