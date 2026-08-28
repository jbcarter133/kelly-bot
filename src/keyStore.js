// BYOK storage. Each provider's key lives only in this browser and is sent only
// to that provider's API — there is no backend. "local" persists across
// sessions; "session" forgets the keys when the tab closes. Each provider's
// chosen model persists in localStorage regardless of mode (it's a
// preference, not a secret).
import { PROVIDER_IDS } from "./providers.js";

const keyName = (provider) => `kellybot.key.${provider}`;
const modelName = (provider) => `kellybot.model.${provider}`;
const workspaceIdName = (provider) => `kellybot.workspaceId.${provider}`;
const MODE_KEY = "kellybot.keymode";

export function getStorageMode() {
  return localStorage.getItem(MODE_KEY) === "session" ? "session" : "local";
}

function store(mode = getStorageMode()) {
  return mode === "session" ? sessionStorage : localStorage;
}

export function setStorageMode(mode) {
  const previous = getStorageMode();
  if (previous === mode) return;
  // Migrate every provider's key to the new store and remove it from the old
  // one so switching modes never silently drops a key or leaves a stray copy.
  for (const p of PROVIDER_IDS) {
    const value = store(previous).getItem(keyName(p));
    if (value) store(mode).setItem(keyName(p), value);
    store(previous).removeItem(keyName(p));
  }
  localStorage.setItem(MODE_KEY, mode);
}

export function getKey(provider) {
  return store().getItem(keyName(provider)) ?? "";
}

export function setKey(provider, key) {
  const trimmed = (key || "").trim();
  if (trimmed) store().setItem(keyName(provider), trimmed);
  else store().removeItem(keyName(provider));
}

export function clearKey(provider) {
  localStorage.removeItem(keyName(provider));
  sessionStorage.removeItem(keyName(provider));
}

// Per-provider model override (preference); "" means use the provider default.
export function getModel(provider) {
  return localStorage.getItem(modelName(provider)) ?? "";
}

export function setModel(provider, model) {
  const trimmed = (model || "").trim();
  if (trimmed) localStorage.setItem(modelName(provider), trimmed);
  else localStorage.removeItem(modelName(provider));
}

// Per-provider workspace ID (preference, not a secret) — required by some
// Anthropic keys that are linked to a person's identity across multiple
// workspaces rather than scoped to one; sent as anthropic-workspace-id.
export function getWorkspaceId(provider) {
  return localStorage.getItem(workspaceIdName(provider)) ?? "";
}

export function setWorkspaceId(provider, workspaceId) {
  const trimmed = (workspaceId || "").trim();
  if (trimmed) localStorage.setItem(workspaceIdName(provider), trimmed);
  else localStorage.removeItem(workspaceIdName(provider));
}
