"use client";

import * as CadsReact from "@codeai/cads-react";
import { FaIcon } from "@codeai/cads-react/icons";
import type { CSSProperties, ElementType, ReactNode } from "react";
import { createElement } from "react";

type PrototypeNode = {
  type: "layout" | "text" | "component";
  layout?: "stack" | "inline" | "surface";
  text?: string;
  variant?:
    | "headingLarge"
    | "headingMedium"
    | "headingSmall"
    | "body"
    | "bodySmall";
  component?: string;
  props?: Record<string, unknown>;
  children?: string | PrototypeNode[];
};

export type PrototypeSpec = {
  title: string;
  theme?: "light" | "dark";
  root: PrototypeNode;
};

const registry: Record<string, ElementType> = {
  ...(CadsReact as unknown as Record<string, ElementType>),
  FaIcon,
};

const textStyles: Record<
  NonNullable<PrototypeNode["variant"]>,
  CSSProperties
> = {
  headingLarge: {
    fontFamily: "var(--font-heading)",
    fontSize: "var(--text-heading-xl)",
    fontWeight: 500,
    lineHeight: "var(--line-height-heading)",
  },
  headingMedium: {
    fontFamily: "var(--font-heading)",
    fontSize: "var(--text-heading-lg)",
    fontWeight: 500,
    lineHeight: "var(--line-height-heading)",
  },
  headingSmall: {
    fontFamily: "var(--font-heading)",
    fontSize: "var(--text-heading-sm)",
    fontWeight: 500,
    lineHeight: "var(--line-height-heading)",
  },
  body: {
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-body-md)",
    lineHeight: "var(--line-height-body)",
  },
  bodySmall: {
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-body-sm)",
    lineHeight: "var(--line-height-body)",
  },
};

function space(value: unknown): string | undefined {
  if (value === "none") return "0";
  if (
    typeof value === "string" &&
    ["xs", "s", "m", "l", "xl", "xxl"].includes(value)
  ) {
    return `var(--space-${value})`;
  }
  return undefined;
}

function align(value: unknown): CSSProperties["alignItems"] {
  if (value === "start") return "flex-start";
  if (value === "end") return "flex-end";
  if (value === "center" || value === "stretch") return value;
  return undefined;
}

function renderChildren(children: PrototypeNode["children"]): ReactNode {
  if (typeof children === "string") return children;
  return children?.map((child, index) => renderNode(child, `node-${index}`));
}

function renderLayout(node: PrototypeNode, key: string): ReactNode {
  const props = node.props ?? {};
  const style: CSSProperties = {
    display: "flex",
    flexDirection: node.layout === "inline" ? "row" : "column",
    flexWrap: node.layout === "inline" ? "wrap" : undefined,
    gap: space(props.gap),
    padding: space(props.padding),
    alignItems: align(props.align),
    width: props.fullWidth === true ? "100%" : undefined,
  };

  if (node.layout === "surface") {
    Object.assign(style, {
      background: "var(--background-neutral-primary)",
      border: "1px solid var(--border-neutral-primary)",
      borderRadius: "var(--radius-lg)",
      boxShadow: "var(--shadow-sm)",
    });
  }

  return (
    <div key={key} style={style}>
      {renderChildren(node.children)}
    </div>
  );
}

function renderNode(node: PrototypeNode, key: string): ReactNode {
  if (node.type === "layout") return renderLayout(node, key);

  if (node.type === "text") {
    return (
      <div key={key} style={textStyles[node.variant ?? "body"]}>
        {node.text}
      </div>
    );
  }

  const Component = node.component ? registry[node.component] : undefined;
  if (!Component) {
    return (
      <div key={key} role="alert">
        Unknown CADS component: {node.component ?? "(missing)"}
      </div>
    );
  }

  const props = Object.fromEntries(
    Object.entries(node.props ?? {}).filter(
      ([name]) => !name.startsWith("on") && name !== "style" && name !== "sx",
    ),
  );
  return createElement(
    Component,
    {...props, key},
    renderChildren(node.children),
  );
}

export function PrototypeCanvas({ spec }: { spec: PrototypeSpec }) {
  return (
    <div
      className={spec.theme === "dark" ? "dark" : undefined}
      style={{
        minHeight: "100vh",
        padding: "var(--space-l)",
        background: "var(--background-neutral-secondary)",
        color: "var(--text-neutral-primary)",
      }}
    >
      <div
        style={{
          width: "min(100%, 800px)",
          margin: "0 auto",
        }}
      >
        {renderNode(spec.root, "root")}
      </div>
    </div>
  );
}
