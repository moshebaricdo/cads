import { createRoot } from "react-dom/client";
import { createElement, type CSSProperties, type ElementType, type ReactNode } from "react";
import * as CadsReact from "@codeai/cads-react";
import { FaIcon } from "@codeai/cads-react/icons";
import { CadsProvider } from "@codeai/cads-react/theme/CadsProvider";
import { cadsManifest } from "@codeai/cads-react/manifest";
import "@codeai/cads-variables/variables.css";
import "@codeai/cads-react/icons/fonts.css";

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
    lineHeight: "var(--leading-heading-xl)",
    letterSpacing: "var(--tracking-heading-display)",
  },
  headingMedium: {
    fontFamily: "var(--font-heading)",
    fontSize: "var(--text-heading-lg)",
    fontWeight: 500,
    lineHeight: "var(--leading-heading-lg)",
  },
  headingSmall: {
    fontFamily: "var(--font-heading)",
    fontSize: "var(--text-heading-sm)",
    fontWeight: 500,
    lineHeight: "var(--leading-heading-sm)",
  },
  body: {
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-body-md)",
    lineHeight: "var(--leading-body-md)",
  },
  bodySmall: {
    fontFamily: "var(--font-body)",
    fontSize: "var(--text-body-sm)",
    lineHeight: "var(--leading-body-sm)",
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

  return createElement("div", { key, style }, renderChildren(node.children));
}

function renderNode(node: PrototypeNode, key: string): ReactNode {
  if (node.type === "layout") return renderLayout(node, key);

  if (node.type === "text") {
    return createElement(
      "div",
      { key, style: textStyles[node.variant ?? "body"] },
      node.text,
    );
  }

  const Component = node.component ? registry[node.component] : undefined;
  if (!Component) {
    return createElement(
      "div",
      { key, role: "alert" },
      `Unknown CADS component: ${node.component ?? "(missing)"}`,
    );
  }

  const props = Object.fromEntries(
    Object.entries(node.props ?? {}).filter(
      ([name]) => !name.startsWith("on") && name !== "style" && name !== "sx",
    ),
  );
  return createElement(
    Component,
    { ...props, key },
    renderChildren(node.children),
  );
}

function PrototypeCanvas({ spec }: { spec: PrototypeSpec }) {
  return createElement(
    "div",
    {
      className: spec.theme === "dark" ? "dark" : undefined,
      style: {
        minHeight: "100vh",
        padding: "var(--space-l)",
        background: "var(--background-neutral-secondary)",
        color: "var(--text-neutral-primary)",
        boxSizing: "border-box",
      },
    },
    createElement(
      "div",
      {
        style: {
          width: "min(100%, 800px)",
          margin: "0 auto",
        },
      },
      renderNode(spec.root, "root"),
    ),
  );
}

export function renderPrototype(
  container: HTMLElement | string,
  spec: PrototypeSpec,
) {
  const el =
    typeof container === "string"
      ? document.querySelector(container)
      : container;
  if (!el) {
    throw new Error("CADS renderPrototype: container not found");
  }
  const root = createRoot(el as HTMLElement);
  root.render(
    createElement(
      CadsProvider,
      null,
      createElement(PrototypeCanvas, { spec }),
    ),
  );
  return root;
}

export function mountFromScriptTag(scriptId = "cads-prototype-spec") {
  const script = document.getElementById(scriptId);
  if (!script?.textContent) {
    throw new Error(`Missing #${scriptId} JSON script tag`);
  }
  const spec = JSON.parse(script.textContent) as PrototypeSpec;
  const mount = document.getElementById("cads-root") ?? document.body;
  return renderPrototype(mount, spec);
}

export {
  CadsProvider,
  FaIcon,
  cadsManifest,
  registry as components,
  PrototypeCanvas,
};

if (typeof document !== "undefined") {
  const auto = document.currentScript?.getAttribute("data-cads-auto");
  if (auto === "true") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => mountFromScriptTag());
    } else {
      mountFromScriptTag();
    }
  }
}
