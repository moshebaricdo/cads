"use client";

import { CadsProvider } from "@codeai/cads-react";
import {
  MOTION_FLAG_EVENT,
  MOTION_FLAG_PARAM,
  parseMotionFlagParam,
  readMotionFlagFromSession,
  writeMotionFlagToSession,
} from "@/lib/experimentalMotionFlag";
import { useSearchParams } from "next/navigation";
import {
  Suspense,
  useEffect,
  useState,
  type ReactNode,
} from "react";

function ProvidersWithMotionFlag({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const urlParam = searchParams.get(MOTION_FLAG_PARAM);
  const [experimentalMotion, setExperimentalMotion] = useState(false);

  useEffect(() => {
    const sync = () => setExperimentalMotion(readMotionFlagFromSession());
    sync();
    window.addEventListener(MOTION_FLAG_EVENT, sync);
    return () => window.removeEventListener(MOTION_FLAG_EVENT, sync);
  }, []);

  // `?motion=1|0` on any docs URL seeds session for the rest of the visit.
  useEffect(() => {
    const parsed = parseMotionFlagParam(urlParam);
    if (parsed == null) return;
    writeMotionFlagToSession(parsed);
  }, [urlParam]);

  return (
    <CadsProvider experimentalMotion={experimentalMotion}>
      {children}
    </CadsProvider>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<CadsProvider>{children}</CadsProvider>}>
      <ProvidersWithMotionFlag>{children}</ProvidersWithMotionFlag>
    </Suspense>
  );
}
