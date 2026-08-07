"use client";

import { useEffect, useState } from "react";
import { AiChatInput } from "@codeai/cads-react";

export default function AiChatInputPreview({
  values,
}: {
  values: Record<string, unknown>;
}) {
  const seed = String(values.defaultValue ?? values.value ?? "");
  const [value, setValue] = useState(seed);

  useEffect(() => {
    setValue(seed);
  }, [seed]);

  return (
    <div style={{ width: "100%", maxWidth: 360 }}>
      <AiChatInput
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={String(values.placeholder || "Type something")}
        addFileLabel={String(values.addFileLabel || "Add file")}
        disabled={Boolean(values.disabled)}
      />
    </div>
  );
}
