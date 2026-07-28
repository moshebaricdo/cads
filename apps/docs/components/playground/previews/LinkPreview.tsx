"use client";

import { Link } from "@codeai/cads-react";

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
      isExternal={v.isExternal === false ? false : true}
      disabled={Boolean(v.disabled)}
    >
      {String(v.children ?? "Link")}
    </Link>
  );
}
