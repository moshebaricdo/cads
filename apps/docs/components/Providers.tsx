"use client";

import { CadsProvider } from "@codeai/cads-react/theme/CadsProvider";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return <CadsProvider>{children}</CadsProvider>;
}
