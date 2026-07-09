# Kelly Bot

A Claude-powered chat SPA that answers in "Kelly's" voice. React + Vite front
end talking to a thin serverless proxy that holds the Anthropic API key.

## Stack

- **Front end:** React 18 + Vite. Nearly everything lives in one component,
  `src/KellyBot.jsx` (UI, persona system prompt, upload, gated web search).
- **API:** `api/chat.js` — a serverless function (Vercel-style) that injects
  `x-api-key` and forwards the request body **verbatim** to Anthropic's
  `/v1/messages`. The request shape (model, system, messages, tools) is built
  client-side in `KellyBot.jsx` and sent through this proxy.
- **Deploy:** Vercel (`vercel.json`); `/api/chat` is served automatically.
- ESM (`"type": "module"`).

## Run

```
npm install
cp .env.example .env      # add a real ANTHROPIC_API_KEY
vercel dev                # serves the front end AND the /api/chat function
```

- **Gotcha:** plain `npm run dev` (Vite alone) serves the front end but **not**
  the `/api/chat` route — the bot will not get replies. Use `vercel dev` for a
  working local API, or deploy. Do not conclude the bot is broken from a failed
  `curl /api/chat` under `npm run dev`; that route only exists under `vercel dev`
  or on the deployed platform.
- Other scripts: `npm run build`, `npm run preview`.

## Verify

There is **no test suite** and no lint/typecheck config. Proof of a change:

- `npm run build` must succeed (catches broken imports/JSX). This is the one
  check that runs anywhere, no key needed.
- Full request/response path needs `vercel dev` running **and** a real
  `ANTHROPIC_API_KEY`. Without both, you cannot verify generation end-to-end —
  say so rather than claiming it works.

## Environment

- `ANTHROPIC_API_KEY` — server-side only (Vercel env var, or `.env` locally).
- `.env` / `.env.local` / `.vercel` are gitignored; never commit them or the key.

## Gotchas

- **Model is pinned in `src/KellyBot.jsx`** (`model: "claude-sonnet-5"`), and
  named again in `README.md`. Those are the two places to update on a model
  change. `thinking: { type: "disabled" }` is set alongside it deliberately —
  Sonnet 5 runs adaptive thinking by default, which would add latency and
  consume the `max_tokens` reply budget; leave it disabled unless you also
  raise `max_tokens`.
- **Web search is gated:** the `web_search` tool is only attached when the
  user's message contains a URL (`hasURL(txt)`). No link → no web access.
- Each turn re-sends the full conversation, so long chats grow slower/pricier.
