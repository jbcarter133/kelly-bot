// BYOK storage. Each provider's key lives only in this browser and is sent only
// to that provider's API — there is no backend. "local" persists across
// sessions; "session" forgets the keys when the tab closes. The selected
// provider and each provider's chosen model persist in localStorage regardless
// of mode (they're preferences, not secrets).
import { PROVIDER_IDS } from "./providers.js";

const keyName = (provider) => `kellybot.key.${provider}`;
const modelName = (provider) => `kellybot.model.${provider}`;
const PROVIDER_KEY = "kellybot.provider";
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

// Selected provider (preference).
export function getProvider() {
  const p = localStorage.getItem(PROVIDER_KEY);
  return PROVIDER_IDS.includes(p) ? p : PROVIDER_IDS[0];
}

export function setProvider(provider) {
  if (PROVIDER_IDS.includes(provider)) localStorage.setItem(PROVIDER_KEY, provider);
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
