"use client";

import { useRouter } from "next/navigation";
import { Button, Link as CadsLink } from "@codeai/cads-react";

export function OverviewStartActions() {
  const router = useRouter();

  return (
    <div className="docs-explore-start-actions">
      <Button
        variant="contained"
        color="primary"
        size="medium"
        endIconName="arrow-right"
        onClick={() => router.push("/variables/color")}
      >
        Browse color
      </Button>
      <CadsLink href="/components/button" size="small" isExternal={false}>
        Open Button docs
      </CadsLink>
    </div>
  );
}
