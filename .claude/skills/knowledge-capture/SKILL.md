---
name: knowledge-capture
description: Recording durable facts before ending a session or task — commands that differ from the docs, unstated conventions, environment quirks, decisions with rationale. Use at wrap-up whenever something was learned that the repo's docs do not state. Keeps the next session from re-deriving it.
---

# Knowledge Capture

Anything you learned the hard way this session will be learned the hard way
again next session — unless you write it down in the place the next model
actually reads.

## When NOT to use

- Nothing non-obvious was learned; the docs already say everything you used.
- The learning is session-specific (a temporary workaround, a one-off state)
  and will be false next week.

## Procedure

1. Collect candidates: commands that differ from the documented ones,
   conventions the code follows but no doc states, environment quirks,
   decisions made and why.
2. Route each fact to its home:
   - **Durable operating facts** → `CLAUDE.md` at the repo root (create it if
     absent). One fact per line, imperative, terse.
   - **Decision rationale** → the commit body or PR description for the
     change it explains.
   - **Session narrative** → your final report only. Never into CLAUDE.md.
3. While editing CLAUDE.md, prune: remove lines this session *disproved*.
   Do not delete lines you merely didn't exercise.
4. Keep CLAUDE.md readable in one screen — roughly under 100 lines. If adding
   would push past that, tighten before appending.

## Commands to run

```
git diff CLAUDE.md    # review the delta before committing it
```

## Quality bar

Each line added is true next month, verified this session, and saves the next
model at least one wrong attempt. CLAUDE.md remains a checklist, not a diary.

## Verification checklist

- [ ] Every added fact was verified this session, not guessed.
- [ ] No duplication of what README/docs already say.
- [ ] No session-specific state recorded as durable truth.
- [ ] No secrets, tokens, or internal hostnames.
- [ ] File still readable in one screen.

## Common mistakes

- Dumping the session's story into CLAUDE.md ("first I tried X, then...").
- Recording a guess or a single observation as a rule.
- Duplicating the README, so the two drift apart later.
- Letting the file grow unbounded until no model reads it attentively.
- Capturing nothing because the session "went fine" — the absence of
  documented commands is itself a finding worth fixing.

## What to report back

What was recorded, where (CLAUDE.md line vs. commit body), and what was
deliberately left unrecorded as session-specific.
