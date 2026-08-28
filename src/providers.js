// Provider registry. The provider knows how to turn Kelly's shared inputs
// (system prompt + message history) into a request for its API and return
// the reply text. Raw fetch, no SDK, to match the rest of the app.
//
// This is byte-identical to the original single-provider version — same
// endpoint, body, and web-search gating — so Kelly is unchanged here.

// Headroom for models that run "thinking" (e.g. Sonnet 5): with a tiny budget
// the thinking can consume everything and leave no visible reply text.
const MAX_TOKENS = 4096;

function errText(status, msg) {
  if (status === 401) return "Your API key was rejected — check it in Settings.";
  if (status === 404) return "That model isn't available on your key — pick another in Settings.";
  if (status === 429) return "Rate limited or out of credit on this provider.";
  return msg || `Request failed (HTTP ${status}).`;
}

const WEB_ADDENDUM =
  "\n\n---\n\nWEB ACCESS: The user has supplied a link in their message. You may use the web_search tool ONLY to look up the page(s) at the URL(s) they provided and answer questions about that content. Do not browse beyond what is needed to address the supplied link. If no link were present you would have no web access at all.";

// Anthropic (Claude) — content blocks, top-level system, gated web search.
async function anthropicChat({ apiKey, model, system, messages, webEnabled, workspaceId, signal }) {
  const body = {
    model,
    max_tokens: MAX_TOKENS,
    system: webEnabled ? system + WEB_ADDENDUM : system,
    messages,
  };
  if (webEnabled) body.tools = [{ type: "web_search_20250305", name: "web_search" }];

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
      ...(workspaceId ? { "anthropic-workspace-id": workspaceId } : {}),
    },
    body: JSON.stringify(body),
    signal,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return { error: errText(res.status, data?.error?.message) };
  // Concatenate all text blocks (web_search responses can be multi-block).
  const reply = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
  if (!reply) {
    // Models that run "thinking" (Sonnet 5, Opus, …) can spend the whole
    // max_tokens budget reasoning and return no visible text.
    return {
      error: data.stop_reason === "max_tokens"
        ? "The model hit its length limit before writing a reply — try again, or a shorter prompt."
        : "The model returned no text — try again, or pick a different model in Settings.",
    };
  }
  return { reply };
}

// List the model IDs the given key can access, for the Settings dropdown.
async function anthropicListModels(apiKey, workspaceId) {
  const res = await fetch("https://api.anthropic.com/v1/models?limit=1000", {
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
      ...(workspaceId ? { "anthropic-workspace-id": workspaceId } : {}),
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return (data.data || []).map((m) => m.id);
}

export const PROVIDERS = {
  anthropic: {
    id: "anthropic",
    label: "Anthropic (Claude)",
    keyHint: "sk-ant-… (platform.claude.com → API keys)",
    defaultModel: "claude-sonnet-5",
    chat: anthropicChat,
    listModels: anthropicListModels,
  },
};

export const PROVIDER_IDS = ["anthropic"];
