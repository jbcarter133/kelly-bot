# Kelly

A Claude-powered chat interface that thinks and speaks in Kelly's voice — a systems thinker, pattern mapper, and symbolic interpreter. Built with React + Vite.

**No backend. Bring your own API key. The key never leaves your browser.**

---

## What's inside

```
kelly-bot/
├── index.html            # entry HTML
├── package.json
├── vite.config.js        # build config + Content-Security-Policy injection
├── src/
│   ├── main.jsx          # mounts the app
│   ├── providers.js      # provider registry (Anthropic, Groq) — request/response shapes
│   ├── keyStore.js       # per-provider keys + model in the browser (local/session)
│   └── KellyBot.jsx      # the whole bot (UI + persona + features)
└── .github/workflows/
    └── deploy.yml         # builds and deploys to GitHub Pages
```

## Features

- **Kelly persona** — every reply comes through her structural style (system model → levers → examples), with a dual-track literal/symbolic mode.
- **Upload** — images and PDFs via drag-drop, paste, or the paperclip. Kelly reads them.
- **Copy** — one tap copies any of Kelly's responses (with a clipboard fallback for locked-down browsers).
- **Gated web access** — Kelly can only look something up when *you* include a URL in your message. No link, no browsing. *(Anthropic only.)*
- **Bring your own key** — pick a provider and paste your key in Settings (the gear, top right). It's stored only in your browser, per provider.
- **Providers** — **Anthropic (Claude)** is the default and the full experience (images, PDFs, gated web search). **Groq (Llama)** is also supported for fast, free-tier text chat — but it's **text only** (no attachments, no web search), and Kelly's persona is Claude-tuned, so her output on a Llama model will read differently.
- **Model picker** — Settings shows a **dropdown of the models your key can access** (fetched live from the provider; ↻ to refresh). Leave it on **Default** to use Kelly's tuned model.

---

## How the security model works

- This is a **static single-page app**. There is no server anywhere in this project.
- You paste **your own** provider key into Settings. It's stored only in your browser — `localStorage` by default, or "session only" mode which forgets it when the tab closes.
- Requests go **directly from your browser to the provider** (`api.anthropic.com` or `api.groq.com`). No key ever transits or rests on infrastructure we own, so there's nothing for us to leak.
- Hardening: no third-party scripts, and a strict Content-Security-Policy (injected at build time) that only permits network calls to the provider APIs and font loads from Google Fonts. *(Adding a provider means adding its host to `connect-src` in `vite.config.js`, or its requests are blocked.)*
- Residual risk (accepted, standard for BYOK apps): anything with JavaScript access to this page could read `localStorage`. Use "session only" mode on shared machines, and set a **spend limit** on your provider account regardless.

---

## Run it locally

You need [Node.js](https://nodejs.org/) 18+ and a provider key — Anthropic (<https://console.anthropic.com/>) or Groq (<https://console.groq.com/>, free tier).

```bash
npm install
npm run dev
```

Open the local URL, click the **gear** (top right), paste your key, and chat. Because the browser calls Anthropic directly, `npm run dev` is fully functional on its own — no serverless tooling required.

---

## Deploy

Pushing to `main` builds and publishes to **GitHub Pages** automatically (`.github/workflows/deploy.yml`). Enable Pages once under the repo's **Settings → Pages → Source: GitHub Actions**.

- The Vite `base` is set to `/kelly-bot/` — change it in `vite.config.js` if the repo is renamed.
- **Private repo note:** GitHub Pages on a private repository requires a paid GitHub plan. Since there's no backend, the built `dist/` folder is a plain static site — you can host it on any static host (Netlify, Cloudflare Pages, S3, etc.) instead; those also let you set the CSP as a real HTTP header rather than a `<meta>` tag.

---

## Notes & limits

- Each message re-sends the full conversation, so very long chats grow slower and pricier. Trimming old turns is a good future addition.
- Output is capped per reply (`max_tokens`, set in `src/providers.js`, currently 4096). It needs headroom because models that run "thinking" (e.g. Sonnet 5, Opus) spend part of the budget reasoning before any visible text — too small and they return an empty reply.
- Default models live in `src/providers.js` (Anthropic: `claude-sonnet-4-20250514`; Groq: `llama-3.3-70b-versatile`) and can be overridden from the Settings dropdown (populated live from the provider's `/models` endpoint). The Anthropic default is a deprecated snapshot Kelly's persona is tuned to — it works today but will eventually stop being served; her output on any other model reads differently, so leave it on **Default** unless you mean to change her.
- Adding another OpenAI-compatible provider (OpenAI, OpenRouter, …) is a small entry in `src/providers.js` plus its host in the `connect-src` CSP.
- `.env*` is gitignored as a guard — the app never asks you to put a key in a file.
