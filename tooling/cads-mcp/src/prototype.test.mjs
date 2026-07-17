import assert from "node:assert/strict";
import test from "node:test";
import {
  parsePrototype,
  prototypeUrl,
  searchComponents,
  validatePrototype,
} from "./prototype.mjs";

const validSpec = {
  title: "Teacher onboarding",
  theme: "light",
  root: {
    type: "layout",
    layout: "surface",
    props: {padding: "l", gap: "m"},
    children: [
      {
        type: "text",
        variant: "headingLarge",
        text: "Tell us about your school",
      },
      {
        type: "component",
        component: "TextInput",
        props: {
          label: "School name",
          placeholder: "Enter a school",
          size: "large",
        },
      },
      {
        type: "component",
        component: "Button",
        props: {variant: "contained", color: "primary", size: "large"},
        children: "Continue",
      },
    ],
  },
};

test("accepts a constrained CADS prototype", () => {
  assert.deepEqual(validatePrototype(validSpec), {
    valid: true,
    errors: [],
    warnings: [],
  });
});

test("rejects invented components, props, enum values, and colors", () => {
  const result = validatePrototype({
    title: "Invalid",
    root: {
      type: "component",
      component: "Button",
      props: {
        intent: "hero",
        color: "purple",
        background: "#ff00ff",
      },
      children: "Continue",
    },
  });

  assert.equal(result.valid, false);
  assert.ok(result.errors.some(error => error.includes("props.intent")));
  assert.ok(result.errors.some(error => error.includes("props.color")));
  assert.ok(result.errors.some(error => error.includes("hard-coded colors")));
});

test("requires manifest-required component props", () => {
  const result = validatePrototype({
    title: "Invalid dropdown",
    root: {
      type: "component",
      component: "Dropdown",
      props: {role: "input"},
    },
  });

  assert.equal(result.valid, false);
  assert.ok(result.errors.some(error => error.includes("props.options")));
});

test("parses JSON and creates a portable preview URL", () => {
  const parsed = parsePrototype(JSON.stringify(validSpec));
  assert.equal(parsed.valid, true);

  const url = new URL(prototypeUrl(validSpec, "https://cads.example.test"));
  assert.equal(url.origin, "https://cads.example.test");
  assert.equal(url.pathname, "/prototype");
  assert.ok(url.searchParams.get("spec"));
});

test("searches the existing CADS manifest", () => {
  const results = searchComponents("form");
  assert.ok(results.some(component => component.exportName === "Dropdown"));
});
