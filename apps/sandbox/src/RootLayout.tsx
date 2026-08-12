import { DialRoot } from "dialkit";
import type { ReactNode } from "react";
import "dialkit/styles.css";

/**
 * Root shell: page content + DialKit panel as siblings (not wrapping).
 */
export function RootLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <DialRoot position="top-right" theme="dark" productionEnabled defaultOpen />
    </>
  );
}
