"use client";

import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import {
  Button,
  SegmentedButton,
  IconToggle,
  FieldWrapper,
  TextInput,
  TextField,
  Dropdown,
  Checkbox,
  Radio,
  Tag,
  Tooltip,
} from "@codeai/cads-react";
import { FaIcon } from "@codeai/cads-react/icons";

const scope = {
  Button,
  SegmentedButton,
  IconToggle,
  FieldWrapper,
  TextInput,
  TextField,
  Dropdown,
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
          border: "1px solid var(--border-neutral-primary)",
          borderRadius: "var(--radius-md)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: 24,
            background: "var(--background-neutral-primary)",
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
            borderTop: "1px solid var(--border-neutral-primary)",
            background: "var(--background-neutral-secondary)",
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
            color: "var(--text-error-primary)",
            padding: 12,
            fontSize: 13,
            margin: 0,
            background: "var(--background-error-light)",
          }}
        />
      </div>
    </LiveProvider>
  );
}
