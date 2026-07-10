// BYOK key storage. The user's Anthropic key lives only in this browser and is
// sent only to api.anthropic.com — there is no backend. "local" persists across
// sessions; "session" forgets the key when the tab closes.
const KEY = "kellybot.key.anthropic";
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
  // Migrate the key to the new store and remove it from the old one so
  // switching modes never silently drops it or leaves a stray copy behind.
  const value = store(previous).getItem(KEY);
  if (value) store(mode).setItem(KEY, value);
  store(previous).removeItem(KEY);
  localStorage.setItem(MODE_KEY, mode);
}

export function getKey() {
  return store().getItem(KEY) ?? "";
}

export function setKey(key) {
  const trimmed = (key || "").trim();
  if (trimmed) store().setItem(KEY, trimmed);
  else store().removeItem(KEY);
}

export function clearKey() {
  localStorage.removeItem(KEY);
  sessionStorage.removeItem(KEY);
}
