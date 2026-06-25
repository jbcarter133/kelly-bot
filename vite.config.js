import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// During `npm run dev`, Vite serves the front-end. The /api/chat route is
// handled by your platform's dev tooling (e.g. `vercel dev`) or by deploying.
// If you run a custom local API on another port, set up a proxy here.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
