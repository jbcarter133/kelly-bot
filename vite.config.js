import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// BYOK static build — no backend. `npm run dev` fully works: the browser calls
// Anthropic directly with the user's own key (entered in Settings).
//
// Strict-ish CSP injected at build time only (the dev server needs its HMR
// websocket): scripts only from self, network egress only to the LLM
// providers (Anthropic, Groq). Inline styles + Google Fonts are permitted
// because the UI is styled inline and loads its typefaces from Google Fonts.
// NOTE: keep connect-src in sync with the providers in src/providers.js —
// adding a provider host here is required or its requests fail under CSP.
const csp = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data:",
  "connect-src 'self' https://api.anthropic.com https://api.groq.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

export default defineConfig({
  // Served from https://<user>.github.io/kelly-bot/ — change if the repo is renamed.
  base: "/kelly-bot/",
  plugins: [
    react(),
    {
      name: "inject-csp",
      apply: "build",
      transformIndexHtml(html) {
        return html.replace(
          "<head>",
          `<head>\n    <meta http-equiv="Content-Security-Policy" content="${csp}" />`,
        );
      },
    },
  ],
  server: {
    port: 5173,
  },
});
