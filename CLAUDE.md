# Kelly Bot

A Claude-powered chat SPA that answers in "Kelly's" voice. React + Vite,
**BYOK, no backend** — the browser calls Anthropic directly with the user's key.

## Stack

- **Front end:** React 18 + Vite. Nearly everything lives in one component,
  `src/KellyBot.jsx` (UI, persona system prompt, upload, gated web search).
- **API:** no server. The browser POSTs directly to
  `https://api.anthropic.com/v1/messages` with the user's own key and the
  `anthropic-dangerous-direct-browser-access: true` header. The request body
  (model, system, messages, tools) is built in `KellyBot.jsx`.
- **Key storage:** `src/keyStore.js` — the user's Anthropic key, held only in
  the browser (`localStorage`, or `sessionStorage` in "session only" mode).
- **Deploy:** static site to GitHub Pages (`.github/workflows/deploy.yml`).
  Vite `base` is `/kelly-bot/`.
- ESM (`"type": "module"`).

## Run

```
npm install
npm run dev      # fully functional on its own — paste a key via the gear (Settings)
```

- No `vercel dev` / serverless tooling needed anymore: because the browser
  calls Anthropic directly, `npm run dev` is the whole app. Enter an Anthropic
  key in Settings to get replies.
- Other scripts: `npm run build`, `npm run preview`.

## Verify

There is **no test suite** and no lint config. Proof of a change:

- `npm run build` must succeed (this is the deploy/CI check, no key needed).
- The full request/response path needs a **real Anthropic key** pasted in
  Settings. Without a key the app just opens Settings and sends nothing — so
  you cannot verify generation end-to-end without one; say so rather than
  claiming it works.

## Environment

- **No server env vars.** The key is user-supplied at runtime and lives only in
  the browser (`keyStore.js`); it is never read from a file or a server.
- `.env*` is gitignored as a guard but is unused.

## Gotchas

- **Model is pinned in `src/KellyBot.jsx`** (`model: "claude-sonnet-4-20250514"`),
  and named again in `README.md`. It's a deprecated snapshot Kelly's persona is
  tuned to — works today, will eventually stop being served. Do NOT bump it
  casually; a model swap changes how she responds, so validate her output
  (voice, structure, density) against any replacement before shipping.
- **CSP is injected at build time in `vite.config.js`** and locks `connect-src`
  to `api.anthropic.com`. If you ever add another provider or host, you must
  widen `connect-src` there or the requests fail silently under CSP.
- **Web search is gated:** the `web_search` tool is only attached when the
  user's message contains a URL (`hasURL(txt)`). It runs server-side on
  Anthropic, so it needs no extra CSP domains.
- The request body is unchanged from the earlier serverless-proxy version —
  Kelly's behavior is identical; only the transport changed (proxy → direct BYOK).
