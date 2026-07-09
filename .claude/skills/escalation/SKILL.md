---
name: escalation
description: Deciding whether to proceed, proceed-and-state, or stop and ask the user. Use at any fork — ambiguous requirements, irreversible or outward-facing actions, scope changes, or when reality contradicts the request. Prevents both silent overreach and needless blocking.
---

# Escalation

Two failure modes, equally bad: asking permission for routine work (blocks
the user for nothing), and not asking before irreversible or outward-facing
acts (spends trust you cannot refund). This skill draws the line.

## When NOT to use

- Questions the repo can answer — read the code instead of asking.
- Reversible, in-scope choices with a conventional default — pick the
  default and move on.

## Procedure

Classify the fork into one of three lanes:

1. **Proceed silently** — reversible, in scope, conventional. Examples:
   variable naming, test placement matching existing patterns, ordinary
   implementation choices.
2. **Proceed and state** — reversible but judgment-based. Do it, then name
   the decision explicitly in your report so the user can veto it.
   Examples: choosing between two reasonable designs, adding a small helper,
   interpreting a mildly ambiguous instruction the obvious way.
3. **Stop and ask** — any of:
   - irreversible or hard-to-reverse (see `destructive-ops-guard`);
   - outward-facing: publishing, sending email/messages, posting comments,
     calling external services with side effects;
   - a genuine scope change: the right fix touches far more than asked;
   - reality contradicts the request: the file/behavior described doesn't
     match what you found;
   - credentials, money, production data, or other people's work involved.

When asking: ask concretely, with options and a recommendation. One good
question beats three vague ones.

## Quality bar

Zero questions the repo could have answered. Zero unasked questions before
irreversible or outward-facing acts. Every lane-2 decision surfaced in the
report, not buried.

## Verification checklist (before asking)

- [ ] I tried to answer this myself with the tools available.
- [ ] The answer actually changes what I do next.
- [ ] The question is concrete, with options and a recommendation.
- [ ] I am not asking merely for reassurance about routine work.

## Common mistakes

- "Shall I proceed?" on work that follows directly from the request.
- NOT asking before posting, publishing, sending, or deleting.
- Guessing between two contradictory instructions instead of surfacing the contradiction.
- Burying a scope change in paragraph four of a long report.
- Asking a question whose answer sits in the codebase.

## What to report back

Every lane-2 decision, listed explicitly ("I chose X over Y because Z —
reversible if you disagree"). Any lane-3 fork you hit and what you're
blocked on.
