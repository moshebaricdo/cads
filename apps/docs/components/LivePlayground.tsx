"use client";

import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import {
  Button,
  TextField,
  Checkbox,
  Radio,
  Tag,
  Tooltip,
} from "@codeai/cads-react";
import { FaIcon } from "@codeai/cads-react/icons";

const scope = {
  Button,
  TextField,
  Checkbox,
  Radio,
  Tag,
  Tooltip,
  FaIcon,
};

export function LivePlayground({ code }: { code: string }) {
  return (
    <LiveProvider code={code} scope={scope} noInline={false}>
      <div
        style={{
          border: "1px solid var(--ds-border-neutral-primary)",
          borderRadius: "var(--radius-md)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: 24,
            background: "var(--ds-background-neutral-primary)",
            minHeight: 80,
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <LivePreview />
        </div>
        <div
          style={{
            borderTop: "1px solid var(--ds-border-neutral-primary)",
            background: "var(--ds-background-neutral-secondary)",
          }}
        >
          <LiveEditor
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 13,
              minHeight: 100,
              padding: 12,
            }}
          />
        </div>
        <LiveError
          style={{
            color: "var(--ds-text-error-primary)",
            padding: 12,
            fontSize: 13,
            margin: 0,
            background: "var(--ds-background-error-light)",
          }}
        />
      </div>
    </LiveProvider>
  );
}
