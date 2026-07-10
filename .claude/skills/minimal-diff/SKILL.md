---
name: minimal-diff
description: Editing discipline for any change to existing code. Use whenever editing files you did not create this session — especially when tempted to refactor, reformat, rename, or "improve" code adjacent to the task. Keeps the diff to exactly what the task requires.
---

# Minimal Diff

Every line in the diff must be traceable to the task. Unrelated improvements
are noise for the reviewer and risk for the change.

## When NOT to use

- Greenfield files you are creating from scratch.
- An explicitly requested refactor — there, the refactor *is* the scope
  (but its boundary still is).

## Procedure

1. Read the code you are about to change, plus enough surroundings to match
   its style. Never edit a file you haven't read.
2. Match the existing style — naming, comment density, idiom — even where you
   disagree with it. Consistency beats preference.
3. Change only the lines the task requires. Do not reformat untouched
   regions, do not rename things outside scope, do not add comments narrating
   your change.
4. If you notice unrelated problems — bugs, dead code, bad names — write them
   down for your report. Do not fix them.
5. If the correct fix requires touching a public interface or more than a
   handful of files, stop and surface the scope change before proceeding
   (see `escalation`).

## Commands to run

```
git diff --stat     # every listed file must be justified by the task
git diff            # every hunk must be explainable in one sentence
```

## Quality bar

A reviewer reading the diff sees only the task. No hunk makes them ask
"why is this here?"

## Verification checklist

- [ ] Each file in `git diff --stat` is required by the task.
- [ ] No whitespace-only or reformat-only hunks.
- [ ] No renamed public identifiers beyond what the task demands.
- [ ] No defensive code, logging, or comments nobody asked for.

## Common mistakes

- "While I'm here" fixes that double the diff.
- Running a formatter over the whole file and shipping the churn.
- Rewriting a function wholesale when a two-line fix suffices.
- Deleting code you didn't understand because it "looked unused."
- Adding try/except or null checks around things the task never mentioned.

## What to report back

What changed and why, plus a **"noticed but not touched"** list of the
unrelated problems you deliberately left alone.
