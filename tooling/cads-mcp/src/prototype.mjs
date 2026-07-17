import {cadsManifest} from "@codeai/cads-react/manifest";

export const PROTOTYPE_SCHEMA = {
  title: "string",
  theme: '"light" | "dark"',
  root: {
    type: '"layout" | "text" | "component"',
    layout: '"stack" | "inline" | "surface" (layout nodes only)',
    text: "string (text nodes only)",
    variant:
      '"headingLarge" | "headingMedium" | "headingSmall" | "body" | "bodySmall" (text nodes only)',
    component: "CADS component export name (component nodes only)",
    props: "object containing only props declared in cadsManifest",
    children: "string or an array of nodes",
  },
};

const componentByName = new Map(
  cadsManifest.components.map(component => [component.exportName, component]),
);
const layouts = new Set(["stack", "inline", "surface"]);
const textVariants = new Set([
  "headingLarge",
  "headingMedium",
  "headingSmall",
  "body",
  "bodySmall",
]);
const spaceValues = new Set(["none", "xs", "s", "m", "l", "xl", "xxl"]);
const alignValues = new Set(["start", "center", "end", "stretch"]);

function quotedLiterals(type) {
  return [...type.matchAll(/"([^"]+)"/g)].map(match => match[1]);
}

function inspectRawValues(value, path, errors) {
  if (typeof value === "string") {
    if (/#[\da-f]{3,8}\b/i.test(value)) {
      errors.push(`${path}: hard-coded colors are not allowed`);
    }
    if (value.includes("--ds-")) {
      errors.push(`${path}: --ds-* variables are not valid CADS variables`);
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      inspectRawValues(item, `${path}[${index}]`, errors),
    );
    return;
  }

  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, item]) =>
      inspectRawValues(item, `${path}.${key}`, errors),
    );
  }
}

function validateLayout(node, path, errors) {
  if (!layouts.has(node.layout)) {
    errors.push(`${path}.layout: expected stack, inline, or surface`);
  }

  const props = node.props ?? {};
  const allowedProps = new Set(["gap", "padding", "align", "fullWidth"]);
  Object.keys(props).forEach(name => {
    if (!allowedProps.has(name)) {
      errors.push(`${path}.props.${name}: unsupported layout property`);
    }
  });

  if (props.gap !== undefined && !spaceValues.has(props.gap)) {
    errors.push(`${path}.props.gap: use a CADS space value`);
  }
  if (props.padding !== undefined && !spaceValues.has(props.padding)) {
    errors.push(`${path}.props.padding: use a CADS space value`);
  }
  if (props.align !== undefined && !alignValues.has(props.align)) {
    errors.push(`${path}.props.align: expected start, center, end, or stretch`);
  }
}

function validateText(node, path, errors) {
  if (typeof node.text !== "string" || !node.text.trim()) {
    errors.push(`${path}.text: non-empty text is required`);
  }
  if (node.variant !== undefined && !textVariants.has(node.variant)) {
    errors.push(`${path}.variant: unsupported typography variant`);
  }
}

function validateComponent(node, path, errors, warnings) {
  const component = componentByName.get(node.component);
  if (!component) {
    errors.push(`${path}.component: ${String(node.component)} is not in CADS`);
    return;
  }

  const props = node.props ?? {};
  if (!props || Array.isArray(props) || typeof props !== "object") {
    errors.push(`${path}.props: expected an object`);
    return;
  }

  const propByName = new Map(component.props.map(prop => [prop.name, prop]));
  Object.entries(props).forEach(([name, value]) => {
    const definition = propByName.get(name);
    if (!definition) {
      errors.push(
        `${path}.props.${name}: not declared for ${component.exportName}`,
      );
      return;
    }

    if (definition.type.includes("=>")) {
      errors.push(
        `${path}.props.${name}: functions cannot be serialized in a prototype spec`,
      );
      return;
    }

    const literals = quotedLiterals(definition.type);
    if (
      literals.length > 0 &&
      typeof value === "string" &&
      !literals.includes(value)
    ) {
      errors.push(
        `${path}.props.${name}: expected one of ${literals.join(", ")}`,
      );
    }
  });

  component.props
    .filter(prop => prop.required)
    .forEach(prop => {
      const suppliedAsChildren =
        prop.name === "children" && node.children !== undefined;
      if (props[prop.name] === undefined && !suppliedAsChildren) {
        errors.push(`${path}.props.${prop.name}: required by ${component.name}`);
      }
    });

  if (
    component.exportName === "FaIcon" &&
    props.title === undefined &&
    node.children === undefined
  ) {
    warnings.push(
      `${path}: decorative icon assumed; provide title when the icon conveys meaning`,
    );
  }
}

function validateNode(node, path, errors, warnings) {
  if (!node || Array.isArray(node) || typeof node !== "object") {
    errors.push(`${path}: expected a prototype node`);
    return;
  }

  if (node.type === "layout") {
    validateLayout(node, path, errors);
  } else if (node.type === "text") {
    validateText(node, path, errors);
  } else if (node.type === "component") {
    validateComponent(node, path, errors, warnings);
  } else {
    errors.push(`${path}.type: expected layout, text, or component`);
  }

  if (Array.isArray(node.children)) {
    node.children.forEach((child, index) =>
      validateNode(child, `${path}.children[${index}]`, errors, warnings),
    );
  } else if (
    node.children !== undefined &&
    typeof node.children !== "string"
  ) {
    errors.push(`${path}.children: expected a string or node array`);
  }
}

export function validatePrototype(spec) {
  const errors = [];
  const warnings = [];

  if (!spec || Array.isArray(spec) || typeof spec !== "object") {
    return {valid: false, errors: ["spec: expected an object"], warnings};
  }

  if (typeof spec.title !== "string" || !spec.title.trim()) {
    errors.push("title: non-empty title is required");
  }
  if (spec.theme !== undefined && !["light", "dark"].includes(spec.theme)) {
    errors.push("theme: expected light or dark");
  }
  validateNode(spec.root, "root", errors, warnings);
  inspectRawValues(spec, "spec", errors);

  return {valid: errors.length === 0, errors, warnings};
}

export function parsePrototype(specJson) {
  try {
    const spec = JSON.parse(specJson);
    return {spec, ...validatePrototype(spec)};
  } catch (error) {
    return {
      spec: undefined,
      valid: false,
      errors: [`specJson: ${error instanceof Error ? error.message : "invalid JSON"}`],
      warnings: [],
    };
  }
}

export function encodePrototype(spec) {
  return Buffer.from(JSON.stringify(spec)).toString("base64url");
}

export function prototypeUrl(spec, baseUrl = "http://localhost:3100") {
  const url = new URL("/prototype", baseUrl);
  url.searchParams.set("spec", encodePrototype(spec));
  return url.toString();
}

export function searchComponents(query = "") {
  const normalizedQuery = query.trim().toLowerCase();
  return cadsManifest.components
    .filter(component => {
      if (!normalizedQuery) return true;
      const haystack = [
        component.name,
        component.description,
        ...component.usageRules,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    })
    .map(component => ({
      name: component.name,
      exportName: component.exportName,
      description: component.description,
      props: component.props,
      usageRules: component.usageRules,
      example: component.example,
      figma: component.figma,
    }));
}
