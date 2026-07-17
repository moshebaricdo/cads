import assert from "node:assert/strict";
import test from "node:test";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

test("advertises and executes the CADS tools over MCP", async () => {
  const client = new Client({ name: "cads-test", version: "0.1.0" });
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: ["src/server.mjs"],
    cwd: new URL("..", import.meta.url).pathname,
  });

  try {
    await client.connect(transport);
    const { tools } = await client.listTools();
    assert.deepEqual(
      tools.map(tool => tool.name).sort(),
      [
        "create_prototype",
        "get_prototype_schema",
        "search_cads",
        "validate_prototype",
      ],
    );

    const result = await client.callTool({
      name: "search_cads",
      arguments: { query: "Button" },
    });
    assert.equal(result.isError, undefined);
    assert.match(result.content[0].text, /"exportName": "Button"/);
  } finally {
    await client.close();
  }
});
