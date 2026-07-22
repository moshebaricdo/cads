"use client";

import { Link } from "@codeai/cads-react/components/Link";

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
      {String(v.children ?? "Link")}
    </Link>
  );
}
