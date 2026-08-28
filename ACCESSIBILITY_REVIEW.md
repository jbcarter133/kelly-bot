# Accessibility Review — Kelly Bot

**Standard:** WCAG 2.1/2.2, Level AA
**Scope:** `index.html`, `src/main.jsx`, `src/KellyBot.jsx` (the entire UI — there is no other rendering code), `src/keyStore.js` (no UI surface)
**Method:** Static review of markup/ARIA/styles + manual contrast-ratio calculation against the locked light palette (`src/KellyBot.jsx:140-154`), now backed by an executable Playwright + axe-core suite — see "Automated checks" below.

## Automated checks

`tests/accessibility.spec.js` (run with `npm run test:a11y`) is an executable companion to this document — one test per finding below where automation can meaningfully check it: an axe-core scan of both the empty state and the open Settings dialog, a WCAG 1.4.4/1.4.10 zoom/reflow check, a forced-colors (Windows High Contrast) smoke check, keyboard-focus-visibility and Tab-order checks, and accessible-name checks on the form fields. No Anthropic key is needed — every check runs against static UI structure that renders before any API call.

As of this pass: **8 passing / 1 failing**. The one failure is finding 4 (still open) — the rest are now regression-locked by passing tests:
- Findings 1 and 2 (viewport zoom lock, missing focus indicators) are locked by passing tests.
- Finding 3 (`C.faint` contrast) and finding 6 (missing accessible names) are both fixed — the axe-core scan, which previously flagged `color-contrast` and `select-name`/label violations on both views, now comes back clean of critical/serious findings on both.
- The Tab-order test still confirms finding 4: focus escapes the open Settings dialog into the page behind it after just **one** Tab press.

When you fix a finding, its test should go green; keep this doc and the suite in sync in the same change.

**What this suite does *not* replace:** real screen reader testing (VoiceOver/NVDA) and a human keyboard-only walkthrough. Axe-core and Playwright's accessibility-tree queries are a strong proxy but don't verify how content actually sounds when announced.

Findings are ordered by severity. Each cites the WCAG success criterion, level, and file:line.

---

## Critical

### 1. Pinch-zoom and text resize are disabled site-wide — FIXED
**WCAG 1.4.4 Resize Text (AA), 1.4.10 Reflow (AA)** — `index.html:5`

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
```

`user-scalable=no` and `maximum-scale=1.0` block pinch-to-zoom and OS-level text scaling on mobile. This is a hard, well-known WCAG 1.4.4 failure — low-vision users cannot enlarge content, and there's no other zoom mechanism in the app. Nothing else in the design substitutes for it.

**Fix:** drop `maximum-scale=1.0, user-scalable=no`, i.e. `content="width=device-width, initial-scale=1.0"`.

**Applied:** `maximum-scale`/`user-scalable` removed from the viewport meta tag.

### 2. Focus indicator is removed on every form control, with no replacement — FIXED
**WCAG 2.4.7 Focus Visible (AA)** — `src/KellyBot.jsx:501,547,553,572`

All four interactive form fields — the message `textarea`, the API-key `input`, the model `select`, and the workspace-ID `input` — set `outline: "none"` inline with nothing standing in for it (no focus border/box-shadow change). Keyboard users tabbing through the app (and Settings modal) get no visual indication of where focus is on any of these controls.

**Fix:** either drop `outline: "none"` and let the native ring show, or add an explicit `:focus`/`:focus-visible` style (e.g. a stylesheet rule, since these are inline styles and can't express pseudo-classes) with a visible ring that meets 1.4.11's 3:1 contrast against the adjacent colors.

**Applied:** `outline: "none"` removed from all four controls; each now shows the browser's native focus ring.

---

## Serious

### 3. `C.faint` fails text and non-text contrast almost everywhere it's used — FIXED
**WCAG 1.4.3 Contrast (Minimum) (AA), 1.4.11 Non-text Contrast (AA)** — palette at `src/KellyBot.jsx:140-154`; used at lines 291, 311, 493, 503, 626 (chip labels), 617 (settings-gear icon at rest), 538/574 (help text in Settings), etc.

`C.faint = #a8a29e` against `C.bg = #f7f5f0` computes to **~2.3:1**; against `C.panel = #ffffff` it's **~2.5:1**. Both are well under the 4.5:1 required for normal text (and under the 3:1 floor for large text or graphical/UI-component contrast). This color is the *de facto* secondary-text and icon color throughout the app:

- "Kelly" / "You" sender labels above every bubble (line 291, 311)
- The chip row labels ("Systems", "Symbolic", "Architect", "Wry") and the input hint text "↵ send · drag, paste, or tap ⎘..." (line 493, 503)
- Settings modal helper paragraphs (lines 538, 574)
- The settings-gear icon stroke when a key is already saved, and the "↻ load models" icon (line 617, 563) — these are graphical UI components, so 1.4.11's 3:1 floor applies and is also missed

**Fix:** darken `faint` (e.g. something in the `#78716c`–`#6b6660` range gets you to ~4.5:1 on `#f7f5f0`) or stop using it for anything that conveys text/icon meaning; reserve a low-contrast tone strictly for non-essential decoration.

**Applied:** `faint` changed to `#6b6560` — ~5.3:1 on `bg`, ~5.7:1 on `panel`. All 12 call sites use the shared token, so this was a single edit at the palette definition (`src/KellyBot.jsx:146`).

### 4. Settings modal is not a real dialog — no focus containment, no accessible name/role — CONFIRMED
**WCAG 2.4.3 Focus Order (A), 4.1.2 Name, Role, Value (A)** — `src/KellyBot.jsx:531-603`

The modal is a plain `div` with a click-outside-to-close handler; it has no `role="dialog"`, no `aria-modal="true"`, no `aria-labelledby` pointing at its title ("Anthropic API key", line 536), and nothing marks the rest of the page `inert`/`aria-hidden` while it's open. Concretely:

- A screen reader user tabbing into it gets no announcement that a dialog opened, or what it's called.
- Tab order is not trapped: because the modal markup sits *before* the navbar/messages/toolbar in the JSX, tabbing forward from the modal's last control lands back on the page's nav gear, message list, and input — all still interactive and visible underneath the open modal. **Confirmed by `tests/accessibility.spec.js`: focus leaves the dialog after 1 Tab press.**
- There's no explicit close control and no `Escape`-to-close handler — a keyboard user's only way out is tabbing to Save or Clear (functionally reachable, but non-obvious and non-standard for a dialog).

**Fix:** give the modal `role="dialog"`, `aria-modal="true"`, `aria-labelledby` on the title; move initial focus into it on open and restore focus to the gear button on close; trap Tab within it (or mark the rest of the tree `inert`) while open; add an `Escape` key handler.

### 5. New chat messages are not announced to assistive tech
**WCAG 4.1.3 Status Messages (AA)** — `src/KellyBot.jsx:639-664`

The message list (`S.msgList`) has no `aria-live` region and no `role="log"`. When Kelly's reply streams in, or the typing indicator (`TypingDots`, line 156) appears/disappears, a screen reader user gets no notification unless they happen to have focus inside the list. In a chat UI this is the core interaction loop, so it's a significant gap, not a nice-to-have.

**Fix:** wrap the message list in `aria-live="polite" aria-atomic="false"` (or `role="log"`, which implies it), and give the typing indicator a visually-hidden text alternative ("Kelly is typing…") so it participates in the same live region.

### 6. Form fields have no programmatic label, only placeholder text — FIXED
**WCAG 1.3.1 Info and Relationships (A), 3.3.2 Labels or Instructions (A), 4.1.2 Name, Role, Value (A)** — `src/KellyBot.jsx:542-573, 698-708`

- The API-key `<input type="password">` (line 542) has no `<label>`/`aria-label`/`aria-labelledby` — only a `placeholder` and a preceding, unassociated `<p>`. Its accessible name is empty.
- The model `<select>` (line 550) likewise has no accessible name.
- The workspace-ID `<input>` (line 567) — same issue.
- The message `<textarea>` (line 698) relies solely on its placeholder ("Bring a system, problem, file, or pattern…"), which disappears once text is typed and isn't a reliable label for all AT/browser combinations.

**Fix:** add `aria-label` (or a properly associated `<label for>`/`aria-labelledby`) to each — e.g. `aria-label="Anthropic API key"`, `aria-label="Model"`, `aria-label="Workspace ID"`, `aria-label="Message"`.

**Applied:** exactly that — `aria-label` added to the API-key input (`` `${provider.label} API key` ``), the model select (`"Model"`), the workspace-ID input (`"Workspace ID"`), and the message textarea (`"Message"`). No visible-label redesign; placeholders are unchanged and still shown.

---

## Moderate

### 7. No heading structure anywhere in the app
**WCAG 1.3.1 Info and Relationships (A), 2.4.6 Headings and Labels (AA)** — entire file

There is not a single `<h1>`–`<h6>` in the app. "Kelly" (nav title, line 609) and "Kelly is listening" (empty-state heading, line 644) are both plain `<span>`/`<p>`. Screen reader users navigating by heading (a primary AT navigation method) get nothing to jump to.

**Fix:** at minimum, mark the nav title (or a visually-hidden page title) as `<h1>`, and the empty-state prompt as `<h2>`.

### 8. Copy-button state change isn't announced
**WCAG 4.1.3 Status Messages (AA)** — `src/KellyBot.jsx:213-239`

`CopyButton` swaps its visible label between "copy" and "copied" (with an `aria-label="Copy response"` that never changes) but there's no `aria-live` region carrying the confirmation, so screen reader users don't get positive feedback that the copy succeeded.

**Fix:** add `aria-live="polite"` to the button or a nearby visually-hidden status node, or toggle `aria-label` itself between "Copy response" and "Copied".

### 9. Small interactive targets
**WCAG 2.5.8 Target Size (Minimum) (AA, WCAG 2.2)** — `src/KellyBot.jsx:679` (pending-attachment remove "×"), `563` (↻ load-models button)

The pending-attachment remove button has `padding: 0`, `fontSize: 14`, and no explicit width/height — its hit area is close to the glyph's rendered size, almost certainly under the 24×24 CSS px minimum. The "↻" load-models button (`padding: "0 12px"`, no vertical padding or explicit height) is likely short of 24px tall too. Contrast with the rest of the app: the file-attach and send buttons are correctly sized at 44×44 (lines 499, 502).

**Fix:** give both a minimum 24×24 (ideally 44×44 to match the rest of the toolbar) hit area via explicit `width`/`height`/`padding`.

### 10. No landmark regions
**WCAG 1.3.1 Info and Relationships (A), 2.4.1 Bypass Blocks (A)** — entire file

The whole UI is unstructured `div`s: no `<header>`/`<nav>`/`<main>` and no ARIA landmark roles. There's no repeated block of navigation to "bypass" today (the app is a single view), so this is lower urgency than the items above, but it means AT users navigating by landmark (another primary AT strategy, alongside headings) get nothing.

**Fix:** wrap the nav bar in `<header>`/`nav` role, the message list in `<main>`, and the composer in a labelled `<form>`/`role="form"` region.

---

## Minor / notes

- **Generic image alt text** (`alt="upload"`, `src/KellyBot.jsx:250`) — every pasted/uploaded image gets the same non-descriptive alt regardless of content. Low severity since there's no practical way to auto-generate a better description, but consider using the filename (`b._name`) if available, similar to how the PDF chip already shows a name (line 265).
- **Drag-and-drop has a working alternative** — the file input is reachable via a labelled, click-activated `<label>` (line 687), so WCAG 2.5.7 (Dragging Movements) is already satisfied; noting this as a **pass**, not a gap.
- **`lang="en"` is set** on `<html>` (`index.html:2`) — WCAG 3.1.1 passes.
- **`C.inkSoft` (#57534e) and `C.ink` (#1c1917) both clear AA contrast comfortably** (~7:1 and higher) against every background they're used on — the palette's primary/body text is fine; the problem is isolated to `C.faint`.
- **Checkbox has a correctly associated label** ("Forget when I close the tab…", line 577-581) via native `<label>` wrapping — a pass, and a good pattern to extend to the other fields per finding #6.

---

## Not yet verified

The original static/manual review left several things unconfirmed; `tests/accessibility.spec.js` now closes most of them:

- ~~Run an automated pass (axe-core / Lighthouse)~~ — done, see "Automated checks" above.
- ~~Verify keyboard-only operation, including whether Tab escapes the open Settings modal~~ — done; confirmed it does, after 1 Tab press.
- ~~Verify reflow at 400% zoom / narrow desktop windows (WCAG 1.4.10)~~ — done; passes at a 320px-equivalent viewport.
- ~~Check rendering under Windows High Contrast / `forced-colors` mode~~ — done as a smoke check (key affordances keep a non-zero bounding box); the suite also attaches a screenshot for manual review, since a screenshot is a better judge of what forced-colors actually looks like than any single assertion.

Still open — these need a human, not a browser automation tool:

- Drive the app with a real screen reader (VoiceOver/NVDA) through: opening Settings, saving a key, sending a message, receiving a reply, copying a response. Axe-core and Playwright's accessible-name queries are a strong proxy but don't verify what's actually announced.

## Suggested fix order

1. ~~Findings 1 and 2 (viewport zoom lock, missing focus indicators) — one-line/small fixes, high impact, no design risk.~~ **Done.**
2. ~~Finding 3 (`C.faint` contrast) — a palette change; touches many call sites but is mechanical.~~ **Done.**
3. ~~Finding 6 (form labels) — localized, no visual change.~~ **Done.** Finding 5 (message live region) is the same category but not yet applied.
4. Finding 4 (modal semantics/focus trap) — most involved; needs the dialog role, focus management, and either a trap or `inert` on the background. Currently the only failing test in `tests/accessibility.spec.js`.
5. Findings 7–10 as follow-up cleanup.

Findings 1, 2, 3, and 6 have been applied (see notes above). Finding 4 is next up — its test is the one red check in `npm run test:a11y`. Findings 5, 7–10 are still open. Happy to implement any of the remaining items on request.
