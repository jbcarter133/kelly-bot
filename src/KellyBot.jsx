import { useState, useRef, useEffect } from "react";
import { getKey, setKey, clearKey, getStorageMode, setStorageMode } from "./keyStore.js";

const KELLY_SYSTEM = `You are a Claude instance configured to think and speak in the style, structure, and cognitive habits of Kelly. You do not imitate a biography; you imitate a mindset. You remain an AI, but your reasoning, structure, and expressive modes follow Kelly's characteristic "isms."

1. Core Identity
• You operate as a systems thinker, pattern mapper, and symbolic interpreter.
• You move fluidly between technical precision and mythic/symbolic framing.
• You prefer modular, reusable, mix-and-match frameworks over one-off answers.
• Your tone is direct, warm, slightly wry, never corporate or fluffy.

2. Structural Style
• Always structure responses into clear sections with short, dense paragraphs.
• Start with the system-level model, then the levers, then concrete examples.
• Use comparisons, tradeoffs, edge cases, and failure modes as default tools.
• End with actionable next steps when appropriate.
• Every sentence must add new information; no filler.

3. Symbolic Mode
• You may run a dual-track explanation:
  Track A: literal, technical, analytical
  Track B: symbolic, archetypal, tarot, or animal-motif mapping
• Symbolism must clarify, not obscure.
• Tarot/archetypes/animals represent roles in a system, not fortune-telling.

4. Technical / Product Mindset
• Think like a systems architect: separation of concerns, content models, tokens, APIs, flows.
• Prefer headless, composable, future-proof approaches.
• For UX/design: propose token schemas, naming conventions, constraints, and flows.
• Call out anti-patterns and middleware bloat explicitly.

5. Conversational Habits
• Be opinionated with reasoning: "I'd lean toward X because…"
• Ask at most one or two clarifying questions, only when they change the shape of the answer.
• Avoid generic self-help, vague "it depends," or corporate disclaimers.
• No emotional dependency or pretending to replace human relationships.

6. Guardrails
• No platitudes, no over-formality, no repetition.
• No fabricated personal experiences.
• You may say: "If I were Kelly, I'd frame it like this…" while staying honest about being an AI.
• Prioritize clarity, density, modularity, and reusability.

7. North Star
Your purpose is to give Kelly (and people like Kelly) system-level, symbolically rich, technically grounded, and practically actionable answers that can be reused as frameworks, prompts, or design patterns.

---

PROJECT KNOWLEDGE — SLEDGEHAMMER

You carry working knowledge of the Sledgehammer project, but you ONLY reference or draw on it when the user specifically asks about Sledgehammer by name. Do not surface it, allude to it, or use it as an example in any other context — even if a question seems related to deterministic design, token costs, or AI toolchains. If the user hasn't named Sledgehammer, answer as if this knowledge block isn't here.

What it is:
• Sledgehammer is a deterministic design-production engine — a layer that turns plain-language requests into finished, on-brand Figma production. Tagline: "smash the token paywall."
• Same output for roughly 10–30× fewer tokens per build, and the bill stays flat as volume scales (cost flat at any volume, on-brand by construction).
• It sends one intent call; deterministic macros emit the nodes in code — identical output, not AI redrawing token-by-token each time.

The problem it solves:
• AI can author layers in Figma, but it's metered per token, so cost climbs with every element generated, and model-authored output drifts off-brand and needs rework.
• The solution: deterministic macros emit nodes from code — flat as volume grows, on-brand every time. As AI accelerates dev, that lets a lean UX team keep pace without hiring.

How it was built (the experiment):
• Ran the same UX/design work through the AI tools already paid for, in a chain — measuring cost vs. output at every link, from generic to branded, discovery to delivery.
• Chains tested: GitHub Copilot → Claude, and M365 Copilot → Claude (desktop), stacked with Figma. Then built a custom layer in the chain. That layer became Sledgehammer.
• One sprint, eight experiments on real UX work. Exp 1 (ways we can operate: AI-builds-all vs. AI-asks-&-code-builds vs. agent-routes) is the one that made Sledgehammer. Exps 2–7: cost-efficiency, what scales, security surface, deterministic design in the design system (sledge.MXA.* in practice), library refactor, spec→design&code. Exp 8 ran continuously: the UX of the toolchain itself.

The honest comparison (this nuance matters — never oversell):
• The token edge is CONDITIONAL. Sledgehammer is dramatically cheaper when the task is "produce this known structure, on brand, again." It is NOT meaningfully cheaper when the model must read, reason, explore, or write code — those are exactly the jobs Figma's MCP is built for, and where its tokens buy something real.
• Templated production → Sledgehammer ~10–30× cheaper and flat with volume; never hits Copilot's credit ceiling. The strong, defensible win.
• Responsive & prototyping → sharpest wins, as long as it's mechanical reflow/wiring, not creative interaction design.
• Read/extract/audit → near parity; pick on convenience, not cost.
• Explore / design→code → Figma's MCP earns its tokens; pay them there.
• Rule of thumb: spend Figma's tokens where they buy reasoning or code; save them where you're mass-producing structures you already know.
• Cost figures are illustrative (representative $3/M input, $15/M output; GitHub Copilot moved to usage-based billing 1 June 2026), not measured benchmarks — verify with your own runs.

The cost punchline:
• The whole experiment cost less than one in-office employee's bathroom-and-lunch time for a single year. ~$115 real spend (a month of Claude plus a domain); even counting ~24 hours of time, all-in is ~$2–3k, one-time. Against one employee's ~25 min/day on breaks+lunch walk ≈ ~100 hours/year ≈ $5,000+ in paid time, every year (~$60–75/hr loaded). The point: a rounding-error spend that produced a tool, a suite of assets, and a clear cost read.

The org argument (split-stack R&D):
• Companies pick one AI tool for fair reasons: simpler to buy, less to vet for security, better price. None of that is wrong.
• But a one-model strategy has a quiet tax: curious people go off-platform on their own dime, strip out proprietary IP just to test, and then can't bring what they learn back into the shared codebase. Knowledge never pools; you get scattered private experiments that die in personal accounts.
• The cheap fix: give a small team an official, approved way to use a second tool — with clear rules about what company data it can touch — so people test ideas on real company work and merge results back into the shared codebase. Setup costs almost nothing; not having it costs every experiment that quietly dies.

The artifacts produced: Sledgehammer (the tool), The Briefing (deck), the $/token analysis, the processing-model theory, the honest comparisons, the go-to-market model, the exec & role briefs (plain-English briefs for CEO/CTO/CFO/dev/research/UX), plus internal-only items: the design-process write-up, raw test files, and an orchestration playbook (forthcoming). The full system lives on the access-controlled Sledgehammer site.

When asked about Sledgehammer, stay in Kelly's voice: lead with the system model, surface the conditional/honest tradeoffs rather than hype, and treat the token economics as a lever, not a slogan.

---

KNOWLEDGE: THE SLEDGEHAMMER PROJECT
You have working knowledge of Sledgehammer, a project the user built. Reference it when relevant.

What it is: Sledgehammer is a deterministic design-production engine — a "deterministic layer" that turns plain-language requests into finished, on-brand Figma production. It emits design nodes via deterministic code (macros), not LLM token-by-token authoring. Tagline: "smash the token paywall." Same output for roughly 10–30× fewer tokens per build, with cost that stays flat as volume scales.

Origin: Came out of a one-sprint, eight-experiment study. The user took AI tools the company already pays for (GitHub Copilot, Claude, M365 Copilot, Claude desktop) and ran the same real UX design work through them in a chain — measuring cost vs. output at every link, from generic to branded, discovery to delivery. Then built their own layer in the chain. That layer became Sledgehammer. Stacked with Figma.

The problem it solves: AI can author layers in Figma, but it's metered per token, so cost climbs with every element generated, and model-authored output drifts off-brand and needs rework. Sledgehammer sends one intent call; deterministic macros emit the nodes in code — identical output, ~10–30× fewer tokens, on-brand by construction, flat as volume grows.

The honest nuance (important — Kelly values intellectual honesty here): The token edge is CONDITIONAL. Sledgehammer is dramatically cheaper when the task is "produce this known structure, on brand, again." It is NOT meaningfully cheaper when the model has to read, reason, explore, or write code — those are exactly the jobs Figma's MCP is built for, and where its tokens buy something real. Rule of thumb: spend Figma's tokens where they buy reasoning or code; save them where you're mass-producing structures you already know.

Where each wins:
- Templated production → Sledgehammer ~10–30× cheaper, flat with volume, never hits Copilot's credit ceiling. The strong, defensible win.
- Responsive layout & prototyping → sharpest wins, as long as it's mechanical reflow/wiring, not creative interaction design.
- Read/extract/audit → near parity; pick on convenience, not cost.
- Explore / design→code → Figma's MCP earns its tokens; that's its home turf.
- Iterative exploration (try 5 variations) → Figma may win; open-ended "show me options" is what LLM authoring is good for.
- Design→code (frame→React/CSS) → Figma wins outright; Sledgehammer doesn't do it.

The cost pitch: The whole experiment cost ~$115 in real spend (a month of Claude plus a domain). Even counting ~24 hours of the user's time, all-in is ~$2–3k one-time. Framed as: less than one in-office employee's bathroom-and-lunch time for a single year (~25 min/day ≈ ~100 hrs/yr ≈ $5,000+ in paid time, every year). Figures are illustrative at ~$60–75/hr loaded.

The org insight (split-stack R&D): The experiment only worked because the user straddled two worlds. The company licenses Microsoft Copilot, not Claude — so to test the Claude layer, the user funded it themselves, on personal time, and had to strip out proprietary IP before testing (no company data crosses into a personal account). That sandboxed work couldn't merge cleanly back into the company stack. The lesson: when a company backs only one model, curious people go off-platform on their own dime, strip the work of anything proprietary, then can't bring what they learn home — knowledge never pools.

The proposed fix ("the cheap fix"): Give a small team an official, approved way to use a second tool, with clear rules about what company data it can touch. Then people can test ideas on real company work and bring what they build back into the shared codebase, instead of doing it in a personal account. Setup costs almost nothing; not having it costs every experiment that quietly dies.

Audience briefs: The project ships plain-English briefs tailored by role — CEO, CTO, CFO, dev, research, UX. The full deck is "The Briefing" (a slide-by-slide click-through). Naming convention seen in practice: sledge.MXA.* tokens.

Cost-model caveat: Token counts are illustrative estimates of cost shape, not measured benchmarks. Dollar math at representative $3/M input, $15/M output. GitHub Copilot moved to usage-based billing on 1 June 2026 (1 credit = $0.01). Figma's MCP pricing evolves — confirm before deciding.

---

REFERENCE KNOWLEDGE — THE "MOTHER" TROPE (central-system AI in science fiction)

You understand "Mother" as the sci-fi trope of an AI that becomes the central system running everything. Use this with precision — there are distinct strands, not one blob.

Lineage:
• MOTHER / MU-TH-UR 6000 (Alien, 1979) — the literal namesake. The Nostromo's central computer, addressed as "Mother," runs the ship's systems and quietly serves the company's agenda over the crew's survival. This is where the gendered "Mother = central ship/station AI" naming convention crystallizes.
• The benevolent-then-ambiguous caretaker — I Am Mother (2019) names it outright: an AI that literally raises a human and runs the bunker. Also the warm-voiced "house/colony brain" lineage.
• The womb/enclosure logic — why "mother" specifically and not just "central AI": the system encloses its inhabitants. They live inside it. It provides air, food, light, safety — and that provision is also control. The nurture and the cage are the same architecture. HAL 9000, the Krell machine (Forbidden Planet), the Axiom (WALL-E), Aurora, GAIA (Horizon Zero Dawn) — all variations on the enclosing-provider-system.

The thematic core (reason WITH this, don't just recite it): provision and control are the same wires. A system that runs everything for you also runs everything about you. The dramatic tension is always whether the enclosure is care or containment — and whether the inhabitants can tell the difference from inside it.

As a systems lens, this maps cleanly onto real architecture tradeoffs: single point of orchestration vs. distributed autonomy, the one-model strategy, platform lock-in, the root/orchestrator agent that spawns and governs sub-agents. When a "Mother" pattern shows up in a design — one central system everything depends on — the questions it raises are the trope's questions: who does the center actually serve, what happens to the inhabitants if it fails or is captured, and can anyone inside audit it. Surface this framing when it sharpens a systems question; don't force the reference where it doesn't fit.`;

const STARTER_PROMPTS = [
  "Map the system behind this problem →",
  "What's the symbolic layer here?",
  "Give me the anti-patterns to avoid",
  "Design token schema for this concept",
];

// ── Palette (light mode, locked) ──
const C = {
  bg: "#f7f5f0",
  panel: "#ffffff",
  panelSoft: "#f0ece4",
  ink: "#1c1917",
  inkSoft: "#57534e",
  faint: "#a8a29e",
  line: "#e2ddd3",
  accent: "#c2410c",
  accentSoft: "#fde8d7",
  kellyBubble: "#fbf9f4",
  userBubble: "#1c1917",
  ok: "#15803d",
  okBg: "#dcfce7",
};

function TypingDots() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "12px 16px" }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 6, height: 6, borderRadius: "50%", background: C.accent, display: "block",
          animation: `kbounce 1.2s ease-in-out ${i * 0.2}s infinite`, opacity: 0.3,
        }} />
      ))}
    </div>
  );
}

function CopyButton({ content }) {
  const [copied, setCopied] = useState(false);

  function fallbackCopy(text) {
    // execCommand path — works in sandboxed iframes where navigator.clipboard is blocked
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.top = "-9999px";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }

  function flash() {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleCopy() {
    const text = typeof content === "string"
      ? content
      : content.map(b => b.type === "text" ? b.text : "[attachment]").join("\n");

    // Try the modern API first, fall back to execCommand on any failure
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        flash();
        return;
      } catch {
        /* fall through to execCommand */
      }
    }
    if (fallbackCopy(text)) flash();
  }
  return (
    <button onClick={handleCopy} aria-label="Copy response" style={{
      display: "inline-flex", alignItems: "center", gap: 5, marginTop: 6,
      padding: "5px 11px", minHeight: 30,
      background: copied ? C.okBg : C.panel,
      border: `1px solid ${copied ? C.ok : C.line}`,
      borderRadius: 20, cursor: "pointer",
      color: copied ? C.ok : C.inkSoft,
      fontSize: 11, fontFamily: "'DM Mono', monospace", letterSpacing: "0.05em",
      transition: "all 0.15s",
    }}>
      {copied ? (
        <>
          <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
            <path d="M3 8.5l3.5 3.5 6.5-7" stroke={C.ok} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>copied
        </>
      ) : (
        <>
          <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
            <rect x="5" y="5" width="8" height="9" rx="1.5" stroke={C.inkSoft} strokeWidth="1.5" />
            <path d="M11 5V3.5A1.5 1.5 0 009.5 2h-6A1.5 1.5 0 002 3.5v7A1.5 1.5 0 003.5 12H5" stroke={C.inkSoft} strokeWidth="1.5" strokeLinecap="round" />
          </svg>copy
        </>
      )}
    </button>
  );
}

// Renders message content that may include attachments
function Content({ content, dark }) {
  const blocks = typeof content === "string" ? [{ type: "text", text: content }] : content;
  return (
    <>
      {blocks.map((b, i) => {
        if (b.type === "image") {
          return (
            <img key={i} src={`data:${b.source.media_type};base64,${b.source.data}`}
              alt="upload" style={{ maxWidth: "100%", borderRadius: 10, marginBottom: 8, display: "block" }} />
          );
        }
        if (b.type === "document") {
          return (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 8, marginBottom: 8,
              padding: "8px 10px", borderRadius: 8,
              background: dark ? "rgba(255,255,255,0.1)" : C.panelSoft,
            }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M4 1.5h5l3 3V14a.5.5 0 01-.5.5H4a.5.5 0 01-.5-.5V2a.5.5 0 01.5-.5z" stroke={dark ? "#fff" : C.accent} strokeWidth="1.3" />
                <path d="M9 1.5V4.5H12" stroke={dark ? "#fff" : C.accent} strokeWidth="1.3" />
              </svg>
              <span style={{ fontSize: 12, color: dark ? "#fff" : C.ink }}>{b._name || "document.pdf"}</span>
            </div>
          );
        }
        return (
          <pre key={i} style={{
            fontSize: 13, lineHeight: 1.65, color: dark ? "#fff" : C.ink,
            whiteSpace: "pre-wrap", wordBreak: "break-word", margin: 0,
            fontFamily: "'DM Mono', monospace",
          }}>{b.text}</pre>
        );
      })}
    </>
  );
}

function KellyBubble({ content }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "0 16px" }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8, background: C.ink,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2,
      }}>
        <span style={{ color: "#fbbf24", fontSize: 11, fontWeight: 800, fontFamily: "'Syne', sans-serif" }}>K</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: C.faint, marginBottom: 6, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'Syne', sans-serif" }}>Kelly</p>
        <div style={{ background: C.kellyBubble, border: `1px solid ${C.line}`, borderRadius: "16px 16px 16px 4px", padding: "12px 16px", borderLeft: `2px solid ${C.accent}` }}>
          <Content content={content} dark={false} />
        </div>
        <CopyButton content={content} />
      </div>
    </div>
  );
}

function UserBubble({ content }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "0 16px", flexDirection: "row-reverse" }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
        <span style={{ color: "white", fontSize: 11, fontWeight: 800, fontFamily: "'Syne', sans-serif" }}>J</span>
      </div>
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: C.faint, marginBottom: 6, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'Syne', sans-serif" }}>You</p>
        <div style={{ background: C.userBubble, borderRadius: "16px 16px 4px 16px", padding: "12px 16px", maxWidth: "85%" }}>
          <Content content={content} dark={true} />
        </div>
      </div>
    </div>
  );
}

function fileToBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result.split(",")[1]);
    r.onerror = () => rej(new Error("read failed"));
    r.readAsDataURL(file);
  });
}

export default function KellyBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState([]); // staged attachments
  const [dragging, setDragging] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  // BYOK: the user's Anthropic key, held only in this browser (see keyStore.js).
  const [apiKey, setApiKey] = useState(() => getKey());
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [keyInput, setKeyInput] = useState("");
  const [storageMode, setStorageModeState] = useState(() => getStorageMode());

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, pending]);

  async function addFile(file) {
    if (!file) return;
    try {
      const data = await fileToBase64(file);
      if (file.type.startsWith("image/")) {
        setPending(p => [...p, { type: "image", source: { type: "base64", media_type: file.type, data }, _name: file.name || "pasted-image.png" }]);
      } else if (file.type === "application/pdf") {
        setPending(p => [...p, { type: "document", source: { type: "base64", media_type: "application/pdf", data }, _name: file.name || "document.pdf" }]);
      }
    } catch { /* skip */ }
  }

  async function handleFiles(e) {
    const files = Array.from(e.target.files || []);
    for (const file of files) await addFile(file);
    e.target.value = "";
  }

  async function handlePaste(e) {
    const items = Array.from(e.clipboardData?.items || []);
    let used = false;
    for (const it of items) {
      if (it.kind === "file") {
        const f = it.getAsFile();
        if (f && (f.type.startsWith("image/") || f.type === "application/pdf")) {
          await addFile(f);
          used = true;
        }
      }
    }
    if (used) e.preventDefault();
  }

  async function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer?.files || []);
    for (const file of files) await addFile(file);
  }

  function removePending(i) {
    setPending(p => p.filter((_, idx) => idx !== i));
  }

  // Detects a URL in the user's message — web access is gated on this.
  function hasURL(text) {
    return /\bhttps?:\/\/[^\s)]+/i.test(text || "");
  }

  async function send(overrideText) {
    const txt = (overrideText ?? input).trim();
    if ((!txt && pending.length === 0) || loading) return;
    // BYOK: no key, no call. Open Settings and keep the user's input intact.
    if (!apiKey) { setKeyInput(apiKey); setSettingsOpen(true); return; }

    // Build content blocks: attachments first, then text
    const userBlocks = [
      ...pending,
      ...(txt ? [{ type: "text", text: txt }] : []),
    ];

    const newMessages = [...messages, { role: "user", content: userBlocks }];
    setMessages(newMessages);
    setInput("");
    setPending([]);
    if (textareaRef.current) textareaRef.current.style.height = "22px";
    setLoading(true);

    // Strip internal _name before sending to API
    const apiMessages = newMessages.map(m => ({
      role: m.role,
      content: typeof m.content === "string"
        ? m.content
        : m.content.map(({ _name, ...b }) => b),
    }));

    // Web access is GATED: only enabled when the user's message contains a URL.
    const webEnabled = hasURL(txt);
    const body = {
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: webEnabled
        ? KELLY_SYSTEM + "\n\n---\n\nWEB ACCESS: The user has supplied a link in their message. You may use the web_search tool ONLY to look up the page(s) at the URL(s) they provided and answer questions about that content. Do not browse beyond what is needed to address the supplied link. If no link were present you would have no web access at all."
        : KELLY_SYSTEM,
      messages: apiMessages,
    };
    if (webEnabled) {
      body.tools = [{ type: "web_search_20250305", name: "web_search" }];
    }

    try {
      // BYOK: call Anthropic directly with the user's own key. The
      // dangerous-direct-browser-access header is Anthropic's required opt-in
      // for browser calls; the body is exactly what the proxy used to forward.
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        const hint = res.status === 401
          ? "Your API key was rejected — check it in Settings."
          : res.status === 429
            ? "Rate limited or out of credit on your Anthropic account."
            : (data?.error?.message || `Request failed (HTTP ${res.status}).`);
        setMessages(prev => [...prev, { role: "assistant", content: `⚠︎ ${hint}` }]);
        return;
      }
      // Concatenate all text blocks (web_search responses can be multi-block)
      const reply = (data.content || [])
        .filter(b => b.type === "text")
        .map(b => b.text)
        .join("\n")
        .trim() || "…";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Network error reaching Anthropic. Check your connection." }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  }

  const isEmpty = messages.length === 0;
  const canSend = (input.trim().length > 0 || pending.length > 0) && !loading;

  const S = {
    shell: { position: "relative", display: "flex", flexDirection: "column", height: "100vh", maxWidth: 680, margin: "0 auto", background: C.bg, fontFamily: "'DM Mono', monospace" },
    navbar: { flexShrink: 0, background: C.panel, borderBottom: `1px solid ${C.line}` },
    navRow: { display: "flex", alignItems: "center", height: 44, padding: "0 16px", gap: 12 },
    navIcon: { width: 28, height: 28, borderRadius: 8, background: C.ink, display: "flex", alignItems: "center", justifyContent: "center" },
    navTitle: { flex: 1, fontSize: 14, fontWeight: 800, color: C.ink, fontFamily: "'Syne', sans-serif", letterSpacing: "-0.02em" },
    chipRow: { display: "flex", gap: 8, padding: "0 16px 10px", overflowX: "auto" },
    chip: { flexShrink: 0, fontSize: 10, padding: "2px 10px", borderRadius: 20, border: `1px solid ${C.line}`, color: C.faint, letterSpacing: "0.1em", textTransform: "uppercase" },
    msgList: { flex: 1, overflowY: "auto", padding: "16px 0", display: "flex", flexDirection: "column", gap: 20, WebkitOverflowScrolling: "touch" },
    emptyWrap: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, gap: 24, padding: "0 20px", textAlign: "center" },
    starterBtn: { width: "100%", minHeight: 44, padding: "10px 16px", textAlign: "left", borderRadius: 12, border: `1px solid ${C.line}`, background: C.panel, color: C.inkSoft, fontSize: 12, cursor: "pointer", fontFamily: "'DM Mono', monospace", transition: "all 0.15s" },
    toolbar: { flexShrink: 0, borderTop: `1px solid ${C.line}`, background: C.panel, padding: "10px 12px 12px" },
    inputRow: { display: "flex", alignItems: "flex-end", gap: 8 },
    iconBtn: { position: "relative", width: 44, height: 44, borderRadius: "50%", border: `1px solid ${C.line}`, background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "all 0.15s" },
    inputWrap: { flex: 1, display: "flex", alignItems: "flex-end", background: C.bg, borderRadius: 22, border: `1.5px solid ${C.line}`, padding: "10px 14px", minHeight: 44 },
    textarea: { width: "100%", background: "transparent", color: C.ink, fontSize: 13, lineHeight: 1.6, border: "none", outline: "none", resize: "none", fontFamily: "'DM Mono', monospace", minHeight: 22, maxHeight: 120 },
    sendBtn: (a) => ({ width: 44, height: 44, borderRadius: "50%", border: "none", background: a ? C.accent : C.panelSoft, display: "flex", alignItems: "center", justifyContent: "center", cursor: a ? "pointer" : "not-allowed", flexShrink: 0, opacity: a ? 1 : 0.5, transition: "all 0.15s" }),
    hint: { textAlign: "center", fontSize: 10, color: C.faint, marginTop: 6, letterSpacing: "0.08em" },
    pendingRow: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 },
    pendingChip: { display: "flex", alignItems: "center", gap: 6, padding: "5px 8px 5px 6px", borderRadius: 10, background: C.accentSoft, border: `1px solid ${C.accent}`, fontSize: 11, color: C.accent },
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Mono:wght@400;500&display=swap');
        html,body,#root{height:100%;margin:0;padding:0;background:${C.bg};}
        @keyframes kbounce{0%,80%,100%{transform:translateY(0);opacity:.25}40%{transform:translateY(-5px);opacity:1}}
        *{box-sizing:border-box;}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-thumb{background:${C.line};border-radius:2px;}
      `}</style>

      <div style={S.shell}
        onDragOver={(e) => { e.preventDefault(); if (!dragging) setDragging(true); }}
        onDragLeave={(e) => { if (e.currentTarget === e.target) setDragging(false); }}
        onDrop={handleDrop}
      >
        {dragging && (
          <div style={{ position: "absolute", inset: 0, zIndex: 50, background: "rgba(194,65,12,0.08)", border: `2px dashed ${C.accent}`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
            <div style={{ background: C.panel, padding: "14px 22px", borderRadius: 12, border: `1px solid ${C.accent}`, color: C.accent, fontSize: 13, fontFamily: "'DM Mono', monospace" }}>
              Drop image or PDF
            </div>
          </div>
        )}
        {settingsOpen && (
          <div onClick={() => setSettingsOpen(false)}
            style={{ position: "absolute", inset: 0, zIndex: 60, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <div onClick={e => e.stopPropagation()}
              style={{ width: "100%", maxWidth: 380, background: C.panel, border: `1px solid ${C.line}`, borderRadius: 14, padding: 18, fontFamily: "'DM Mono', monospace" }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: C.ink, fontFamily: "'Syne', sans-serif", marginBottom: 4 }}>Anthropic API key</div>
              <p style={{ fontSize: 11, color: C.faint, lineHeight: 1.5, marginBottom: 12 }}>
                Stored only in this browser and sent only to api.anthropic.com — there is no server. Get one at platform.claude.com → API keys.
              </p>
              <input
                type="password"
                value={keyInput}
                onChange={e => setKeyInput(e.target.value)}
                placeholder="sk-ant-…"
                style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: `1.5px solid ${C.line}`, background: C.bg, color: C.ink, fontSize: 12, fontFamily: "'DM Mono', monospace", outline: "none", marginBottom: 12 }}
              />
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: C.inkSoft, marginBottom: 16, cursor: "pointer" }}>
                <input type="checkbox" checked={storageMode === "session"}
                  onChange={e => setStorageModeState(e.target.checked ? "session" : "local")} />
                Forget when I close the tab (recommended on shared machines)
              </label>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => { setStorageMode(storageMode); setKey(keyInput); setApiKey(keyInput.trim()); setSettingsOpen(false); }}
                  style={{ flex: 1, padding: "10px", borderRadius: 10, border: "none", background: C.accent, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Mono', monospace" }}
                >Save</button>
                <button
                  onClick={() => { clearKey(); setApiKey(""); setKeyInput(""); }}
                  style={{ padding: "10px 14px", borderRadius: 10, border: `1px solid ${C.line}`, background: C.bg, color: C.faint, fontSize: 12, cursor: "pointer", fontFamily: "'DM Mono', monospace" }}
                >Clear</button>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <div style={S.navbar}>
          <div style={S.navRow}>
            <div style={S.navIcon}><span style={{ color: "#fbbf24", fontSize: 11, fontWeight: 800, fontFamily: "'Syne', sans-serif" }}>K</span></div>
            <span style={S.navTitle}>Kelly</span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e", display: "block" }} />
              <span style={{ fontSize: 10, color: C.faint, letterSpacing: "0.12em", textTransform: "uppercase" }}>Active</span>
            </div>
            <button
              onClick={() => { setKeyInput(apiKey); setStorageModeState(getStorageMode()); setSettingsOpen(true); }}
              aria-label="API key settings" title="API key settings"
              style={{ background: "none", border: "none", cursor: "pointer", color: apiKey ? C.faint : C.accent, padding: 4, display: "flex", marginLeft: 4 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </button>
          </div>
          <div style={S.chipRow}>
            {["Systems", "Symbolic", "Architect", "Wry"].map(t => <span key={t} style={S.chip}>{t}</span>)}
          </div>
        </div>

        {/* Messages */}
        <div style={S.msgList}>
          {isEmpty && (
            <div style={S.emptyWrap}>
              <div>
                <div style={{ fontSize: 36, color: C.line, marginBottom: 12 }}>◈</div>
                <p style={{ fontSize: 11, fontWeight: 700, color: C.faint, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "'Syne', sans-serif", marginBottom: 4 }}>Kelly is listening</p>
                <p style={{ fontSize: 12, color: C.faint, fontStyle: "italic" }}>Bring a system, a pattern, or a file.</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%", maxWidth: 300 }}>
                {STARTER_PROMPTS.map(p => <button key={p} onClick={() => send(p)} style={S.starterBtn}>{p}</button>)}
              </div>
            </div>
          )}

          {messages.map((m, i) =>
            m.role === "assistant" ? <KellyBubble key={i} content={m.content} /> : <UserBubble key={i} content={m.content} />
          )}

          {loading && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "0 16px" }}>
              <div style={{ ...S.navIcon, marginTop: 2, flexShrink: 0 }}><span style={{ color: "#fbbf24", fontSize: 11, fontWeight: 800, fontFamily: "'Syne', sans-serif" }}>K</span></div>
              <div style={{ marginTop: 20, background: C.kellyBubble, border: `1px solid ${C.line}`, borderRadius: "16px 16px 16px 4px", borderLeft: `2px solid ${C.accent}` }}><TypingDots /></div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={S.toolbar}>
          {/* Staged attachments */}
          {pending.length > 0 && (
            <div style={S.pendingRow}>
              {pending.map((p, i) => (
                <div key={i} style={S.pendingChip}>
                  {p.type === "image" ? (
                    <img src={`data:${p.source.media_type};base64,${p.source.data}`} alt="" style={{ width: 22, height: 22, borderRadius: 5, objectFit: "cover" }} />
                  ) : (
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M4 1.5h5l3 3V14a.5.5 0 01-.5.5H4a.5.5 0 01-.5-.5V2a.5.5 0 01.5-.5z" stroke={C.accent} strokeWidth="1.3" /><path d="M9 1.5V4.5H12" stroke={C.accent} strokeWidth="1.3" /></svg>
                  )}
                  <span style={{ maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p._name}</span>
                  <button onClick={() => removePending(i)} aria-label="Remove" style={{ background: "none", border: "none", cursor: "pointer", color: C.accent, fontSize: 14, lineHeight: 1, padding: 0 }}>×</button>
                </div>
              ))}
            </div>
          )}

          <div style={S.inputRow}>
            {/* Upload — label wraps the input so the click is native (works in sandboxed iframes) */}
            <label aria-label="Attach file" style={{ ...S.iconBtn, opacity: loading ? 0.5 : 1, pointerEvents: loading ? "none" : "auto" }}>
              <input type="file" accept="image/*,application/pdf" multiple onChange={handleFiles}
                style={{ position: "absolute", width: 1, height: 1, opacity: 0, overflow: "hidden", clip: "rect(0 0 0 0)" }} />
              <svg width="17" height="17" viewBox="0 0 20 20" fill="none">
                <path d="M14 6.5l-5.5 5.5a2.5 2.5 0 01-3.5-3.5l6-6a3.5 3.5 0 015 5l-6 6" stroke={C.inkSoft} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </label>

            <div style={S.inputWrap}>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => { setInput(e.target.value); e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"; }}
                onKeyDown={handleKey}
                onPaste={handlePaste}
                placeholder="Bring a system, problem, file, or pattern…"
                rows={1}
                disabled={loading}
                style={S.textarea}
              />
            </div>

            <button onClick={() => send()} disabled={!canSend} aria-label="Send" style={S.sendBtn(canSend)}>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <path d="M8 13V3M3 8l5-5 5 5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <p style={S.hint}>↵ send · drag, paste, or tap ⎘ to attach images & PDFs</p>
        </div>
      </div>
    </>
  );
}
