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
│   ├── keyStore.js       # stores the user's key in their browser (local/session)
│   └── KellyBot.jsx      # the whole bot (UI + persona + features)
└── .github/workflows/
    └── deploy.yml         # builds and deploys to GitHub Pages
```

## Features

- **Kelly persona** — every reply comes through her structural style (system model → levers → examples), with a dual-track literal/symbolic mode.
- **Upload** — images and PDFs via drag-drop, paste, or the paperclip. Kelly reads them.
- **Copy** — one tap copies any of Kelly's responses (with a clipboard fallback for locked-down browsers).
- **Gated web access** — Kelly can only look something up when *you* include a URL in your message. No link, no browsing.
- **Bring your own key** — paste your Anthropic key in Settings (the gear, top right). It's stored only in your browser.

---

## How the security model works

- This is a **static single-page app**. There is no server anywhere in this project.
- You paste **your own** Anthropic key into Settings. It's stored only in your browser — `localStorage` by default, or "session only" mode which forgets it when the tab closes.
- Requests go **directly from your browser to Anthropic** (`api.anthropic.com`). No key ever transits or rests on infrastructure we own, so there's nothing for us to leak.
- Hardening: no third-party scripts, and a strict Content-Security-Policy (injected at build time) that only permits network calls to `api.anthropic.com` and font loads from Google Fonts.
- Residual risk (accepted, standard for BYOK apps): anything with JavaScript access to this page could read `localStorage`. Use "session only" mode on shared machines, and set a **spend limit** on your Anthropic account regardless.

---

## Run it locally

You need [Node.js](https://nodejs.org/) 18+ and an Anthropic API key from <https://console.anthropic.com/>.

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
- Output is capped per reply (`max_tokens`); raise it in `KellyBot.jsx` if you want longer answers.
- Model is set to `claude-sonnet-4-20250514` in `KellyBot.jsx` — a deprecated snapshot Kelly's persona is tuned to. It works today but will eventually stop being served; validate her output against any replacement before changing it.
- `.env*` is gitignored as a guard — the app never asks you to put a key in a file.
