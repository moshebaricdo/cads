#!/usr/bin/env node

import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio.js";
import {z} from "zod";
import {
  PROTOTYPE_SCHEMA,
  parsePrototype,
  prototypeUrl,
  searchComponents,
} from "./prototype.mjs";

const server = new McpServer({
  name: "cads",
  version: "0.1.0",
});

function textResult(value, isError = false) {
  return {
    content: [{type: "text", text: JSON.stringify(value, null, 2)}],
    ...(isError ? {isError: true} : {}),
  };
}

server.registerTool(
  "search_cads",
  {
    description:
      "Search the authoritative CADS component catalog. Call this before composing a CodeAI UI; never invent components or props.",
    inputSchema: {
      query: z
        .string()
        .optional()
        .describe("Capability or component name, such as form, alert, or Button"),
    },
  },
  async ({query}) => {
    const components = searchComponents(query);
    return textResult({
      count: components.length,
      components,
    });
  },
);

server.registerTool(
  "get_prototype_schema",
  {
    description:
      "Get the constrained JSON format accepted by CADS prototype validation and rendering.",
    inputSchema: {},
  },
  async () =>
    textResult({
      schema: PROTOTYPE_SCHEMA,
      guidance: [
        "Use layout nodes only for composition; use CADS components for controls.",
        "Use text nodes for headings and body copy.",
        "Only pass props returned by search_cads.",
        "Do not include callbacks, style, sx, hard-coded colors, or --ds-* variables.",
      ],
    }),
);

server.registerTool(
  "validate_prototype",
  {
    description:
      "Validate a constrained prototype against the current CADS manifest without creating a preview.",
    inputSchema: {
      specJson: z
        .string()
        .describe("A JSON-encoded prototype following get_prototype_schema"),
    },
  },
  async ({specJson}) => {
    const result = parsePrototype(specJson);
    return textResult(
      {
        valid: result.valid,
        errors: result.errors,
        warnings: result.warnings,
      },
      !result.valid,
    );
  },
);

server.registerTool(
  "create_prototype",
  {
    description:
      "Validate a CADS prototype and return a URL rendered by the local CADS docs site. Use this instead of emitting arbitrary React when a designer asks for a CADS prototype.",
    inputSchema: {
      specJson: z
        .string()
        .describe("A JSON-encoded prototype following get_prototype_schema"),
      baseUrl: z
        .string()
        .url()
        .optional()
        .describe("CADS docs origin; defaults to http://localhost:3100"),
    },
  },
  async ({specJson, baseUrl}) => {
    const result = parsePrototype(specJson);
    if (!result.valid || !result.spec) {
      return textResult(
        {
          created: false,
          errors: result.errors,
          warnings: result.warnings,
        },
        true,
      );
    }

    const url = prototypeUrl(result.spec, baseUrl);
    return textResult({
      created: true,
      prototypeUrl: url,
      warnings: [
        ...result.warnings,
        ...(url.length > 6000
          ? [
              "This proof of concept stores the spec in the URL; larger prototypes need server-side persistence.",
            ]
          : []),
      ],
      prototypeId: null,
      persistence: "URL-encoded proof of concept",
    });
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);
