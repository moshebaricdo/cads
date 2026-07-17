"use client";

import { Link } from "@codeai/cads-react/components/Link";
import type { FaIconName } from "@codeai/cads-react/icons";

export default function LinkPreview({
  values,
}: {
  values: Record<string, unknown>;
}) {
  const v = values;
  return (
        <Link
          href="#link"
          size={
            v.size as
              | "large"
              | "medium"
              | "small"
              | "extraSmall"
              | "extraExtraSmall"
              | undefined
          }
          type={v.type as "primary" | "secondary" | undefined}
          isExternal={v.isExternal == null ? true : Boolean(v.isExternal)}
          disabled={Boolean(v.disabled)}
        >
          Link
        </Link>
      );
}
