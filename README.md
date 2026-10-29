# appside-mcp

Read-only public docs search, SDK examples (including test/verification status), published pricing, and `https://appside.build/llms.txt` as an MCP resource. No credentials, network calls, account mutation or sandbox store creation.

## Connect to the live remote server

Endpoint: `https://appside.build/mcp` (Streamable HTTP, no credentials).

For clients supporting MCP URL configuration:
```json
{"mcpServers":{"appside":{"url":"https://appside.build/mcp"}}}
```

The four public tools are `search_docs`, `get_sdk_snippet`, `get_sdk_status`, and `get_pricing`. `get_sdk_status` accepts an optional `platform` (omit it for all eight SDKs) and returns status, verification scope, test mode, download URLs and install instructions. `get_sdk_snippet` includes the same facts alongside the README example. The server cannot create a store, publish a site, or charge a payment.

## Run it locally (stdio)

```sh
npx appside-mcp
```
or from a checkout of this repository: `node stdio.mjs`. MCP client config:
```json
{"mcpServers":{"appside":{"command":"npx","args":["-y","appside-mcp"]}}}
```

Docs: https://appside.build/docs/mcp/?utm_source=mcp-dir&utm_medium=listing&utm_campaign=w45-preview&utm_content=github-readme · Try Appside on your game (no signup): https://appside.build/?utm_source=mcp-dir&utm_medium=listing&utm_campaign=w45-preview&utm_content=github-readme#preview

`node --test packages/mcp/*.test.mjs` runs local tests. Run `cd packages/mcp && npm pack` to create a self-contained artifact. `prepack` refreshes `data.json` from public docs/SDK READMEs/llms.txt in this repository. No private app data is included. Installed artifacts use that snapshot; repository execution reads current files at startup. Snippets intentionally retain caveats and backend delivery requirements.

The gateway mounts `/mcp` only on site hosts. Stateless Streamable HTTP, protocol 2025-03-26, JSON POST responses; notification POSTs get empty 202. GET returns 405 (no optional SSE stream). Set `Content-Type: application/json` and `Accept: application/json, text/event-stream`. Origin, when present, must be an exact HTTPS site origin. No cross-origin CORS access. 64 KiB messages, 20-message batches, 10s body deadline, 60 requests/minute per socket IP and 600/minute globally, expired buckets removed. Behind the edge proxy a socket bucket may be shared by clients; forwarded IP headers are not trusted. All responses use no-store. No session state or server-initiated messages.

`server.json` is a remote-only registry submission manifest. `smithery.yaml` is a legacy local template; prefer remote URL submission. Package **not published**; remote endpoint verified live on 2026-10-25. No directory publication has been confirmed. Registry namespace ownership and manifest validation are review/submission prerequisites. After approval and publication, clients can use `npx appside-mcp`; do not run this against npm before publication because the name is not yet owned there.
