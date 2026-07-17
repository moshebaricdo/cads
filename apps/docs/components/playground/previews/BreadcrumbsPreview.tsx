"use client";

import { Breadcrumbs } from "@codeai/cads-react/components/Breadcrumbs";
import { buildDemoBreadcrumbItems } from "./shared";
import type { FaIconName } from "@codeai/cads-react/icons";

export default function BreadcrumbsPreview({
  values,
}: {
  values: Record<string, unknown>;
}) {
  const v = values;
  return (
        <Breadcrumbs
          size={
            v.size as
              | "large"
              | "medium"
              | "small"
              | "extraSmall"
              | undefined
          }
          maxItems={
            v.maxItems == null || v.maxItems === ""
              ? 4
              : Number(v.maxItems)
          }
          itemsBeforeCollapse={
            v.itemsBeforeCollapse == null || v.itemsBeforeCollapse === ""
              ? 1
              : Number(v.itemsBeforeCollapse)
          }
          itemsAfterCollapse={
            v.itemsAfterCollapse == null || v.itemsAfterCollapse === ""
              ? 2
              : Number(v.itemsAfterCollapse)
          }
          items={buildDemoBreadcrumbItems(v)}
        />
      );
}
