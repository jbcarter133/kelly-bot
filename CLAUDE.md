# Kelly Bot

A Claude-powered chat SPA that answers in "Kelly's" voice. React + Vite,
**BYOK, no backend** — the browser calls Anthropic directly with the user's key.

## Stack

- **Front end:** React 18 + Vite. Nearly everything lives in one component,
  `src/KellyBot.jsx` (UI, persona system prompt, upload, gated web search).
- **API:** no server. `src/providers.js` is a registry — each provider builds
  its own request from Kelly's shared system prompt + message history and
  returns the reply text (raw `fetch`, no SDK):
  - **anthropic** — POSTs to `api.anthropic.com/v1/messages` (`x-api-key` +
    `anthropic-dangerous-direct-browser-access: true`); content blocks; gated
    web search. This path is byte-identical to the original — Kelly unchanged.
  - **groq** — POSTs to `api.groq.com/openai/v1/chat/completions` (OpenAI
    shape, `Bearer` auth); **text only** (attachments/web dropped). Llama
    models, so Kelly reads differently there.
- **Key storage:** `src/keyStore.js` — **per-provider** key + model, plus the
  selected provider, held only in the browser (`localStorage`, or
  `sessionStorage` in "session only" mode).
- **Deploy:** static site to GitHub Pages (`.github/workflows/deploy.yml`).
  Vite `base` is `/kelly-bot/`.
- ESM (`"type": "module"`).

## Run

```
npm install
npm run dev      # fully functional on its own — paste a key via the gear (Settings)
```

- No `vercel dev` / serverless tooling needed anymore: because the browser
  calls the provider directly, `npm run dev` is the whole app. Pick a provider
  and enter a key in Settings to get replies.
- Other scripts: `npm run build`, `npm run preview`.

## Verify

There is **no test suite** and no lint config. Proof of a change:

- `npm run build` must succeed (this is the deploy/CI check, no key needed).
- The full request/response path needs a **real provider key** pasted in
  Settings. Without a key the app just opens Settings and sends nothing — so
  you cannot verify generation end-to-end without one; say so rather than
  claiming it works. (A headless browser drive with mocked provider endpoints
  is how the provider wiring was verified without a live key.)

## Environment

- **No server env vars.** The key is user-supplied at runtime and lives only in
  the browser (`keyStore.js`); it is never read from a file or a server.
- `.env*` is gitignored as a guard but is unused.

## Gotchas

- **Default models live in `src/providers.js`** (`defaultModel` per provider;
  Anthropic `claude-sonnet-4-20250514`, Groq `llama-3.3-70b-versatile`),
  overridable per provider in Settings. The Anthropic default is a deprecated
  snapshot Kelly's persona is tuned to — works today, will eventually stop
  being served. Do NOT bump it casually; a model swap changes how she responds,
  so validate her output (voice, structure, density) against any replacement.
- **CSP ↔ providers must stay in sync.** The build-time CSP in `vite.config.js`
  locks `connect-src` to the provider hosts (`api.anthropic.com`,
  `api.groq.com`). Adding a provider to `providers.js` **requires** adding its
  host there too, or its requests fail silently under CSP.
- **Attachments and web search are Anthropic-only.** Groq is text-only:
  `providers.js` marks it `textOnly`, the paperclip is disabled on it, and
  `send()` only enables web search for Anthropic. Non-text message blocks are
  dropped when flattening to the OpenAI shape.
- The Anthropic request body is unchanged from the original — Kelly's behavior
  on Anthropic is identical; only the transport changed (proxy → direct BYOK).
