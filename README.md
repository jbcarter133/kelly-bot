# Kelly

A Claude-powered chat interface that thinks and speaks in Kelly's voice — a systems thinker, pattern mapper, and symbolic interpreter. Built with React + Vite, with a small serverless proxy so the API key never touches the browser.

---

## What's inside

```
kelly-bot/
├── index.html            # entry HTML
├── package.json
├── vite.config.js
├── .env.example          # copy to .env and add your key
├── api/
│   └── chat.js           # serverless proxy — holds the API key, forwards to Anthropic
└── src/
    ├── main.jsx          # mounts the app
    └── KellyBot.jsx       # the whole bot (UI + persona + features)
```

## Features

- **Kelly persona** — every reply comes through her structural style (system model → levers → examples), with a dual-track literal/symbolic mode.
- **Upload** — images and PDFs via drag-drop, paste, or the paperclip. Kelly reads them.
- **Copy** — one tap copies any of Kelly's responses (with a clipboard fallback for locked-down browsers).
- **Gated web access** — Kelly can only look something up when *you* include a URL in your message. No link, no browsing.
- **Embedded knowledge** — she carries the Sledgehammer project (only referenced when asked by name) and the sci-fi "Mother" trope (used as a systems lens when relevant).

---

## Run it locally

You need [Node.js](https://nodejs.org/) 18+ and an Anthropic API key from <https://console.anthropic.com/>.

```bash
# 1. install dependencies
npm install

# 2. add your key
cp .env.example .env
#    then open .env and paste your real key

# 3a. simplest: deploy to Vercel (the /api route just works there) — see below
# 3b. local with the API route working, using Vercel's dev tool:
npm i -g vercel
vercel dev
```

> Plain `npm run dev` serves the front-end but **not** the `/api/chat` route — Kelly won't get replies. Use `vercel dev` locally, or just deploy. (Vite alone has no server for the function.)

---

## Deploy (recommended — easiest path)

### Vercel
1. Push this folder to a GitHub repo.
2. Import it at <https://vercel.com/new>.
3. In the project's **Settings → Environment Variables**, add `ANTHROPIC_API_KEY` with your key.
4. Deploy. The `api/chat.js` file is automatically served as a serverless function at `/api/chat`.

### Netlify
Same idea, with one tweak: move `api/chat.js` to `netlify/functions/chat.js` and either rename the front-end call to `/.netlify/functions/chat` or add a redirect in `netlify.toml`:

```toml
[[redirects]]
  from = "/api/chat"
  to = "/.netlify/functions/chat"
  status = 200
```

Add `ANTHROPIC_API_KEY` under **Site settings → Environment variables**.

---

## Why a proxy?

In the browser, an API key shipped in client code is visible to anyone who opens dev tools. The serverless function in `api/chat.js` keeps the key on the server; the browser only ever talks to your own `/api/chat` endpoint. This is the standard, safe pattern.

---

## Notes & limits

- Each message re-sends the full conversation, so very long chats grow slower and pricier. Trimming old turns is a good future addition.
- Output is capped per reply (`max_tokens`); raise it in `KellyBot.jsx` if you want longer answers.
- Model is set to `claude-sonnet-4-20250514` in `KellyBot.jsx` — change there if needed.
- The Anthropic API version header is set in `api/chat.js`.
