# CADS MCP prototype

Lowest-lift proof of concept for using CADS from any MCP-capable LLM client.
It deliberately uses local stdio transport and URL-encoded prototype state so
the model/tool contract can be tested before adding infrastructure.

## What it proves

- An LLM can discover the current component catalog instead of memorizing it.
- Generated prototype JSON is checked against `cadsManifest`.
- Invented components, props, enum values, callbacks, hard-coded colors, and
  `--ds-*` variables are rejected.
- A valid specification renders through the real `@codeai/cads-react` package
  at `/prototype`.
- The resulting controls retain their CADS interactions and accessibility.

## Run locally

Build the React package if its committed `dist/` is not current, then start the
docs renderer:

```bash
pnpm build:react
pnpm dev:docs
```

An MCP client should launch the server with:

```json
{
  "mcpServers": {
    "cads": {
      "command": "pnpm",
      "args": [
        "--dir",
        "/absolute/path/to/cads",
        "--filter",
        "@codeai/cads-mcp",
        "start"
      ]
    }
  }
}
```

Then ask the client:

> Use CADS to make a teacher onboarding form with school name, role, and a
> primary Continue action. Create a prototype, not arbitrary React.

The server exposes:

- `search_cads`
- `get_prototype_schema`
- `validate_prototype`
- `create_prototype`

Run the protocol and validator tests with:

```bash
pnpm test:mcp
```

## Deliberate proof-of-concept limits

- Local stdio only; regular web chat products require Streamable HTTP hosting.
- Prototype state is encoded into the URL; there is no database or stable ID.
- No authentication or authorization.
- No multi-screen navigation or serializable interaction/action model.
- Layout primitives cover only stack, inline, surface, and CADS typography.
- Validation checks manifest contracts, not product usability or Figma pixel
  comparison.

The next meaningful test is remote hosting with one authenticated client. Do
not add a database or visual editor before that test shows designers can
successfully prompt, open, and iterate on the constrained result.
