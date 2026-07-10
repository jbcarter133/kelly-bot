---
name: debugging-discipline
description: For any failing test, error, crash, or behavior that contradicts expectation. Use when a check fails or a bug is reported, BEFORE writing any fix. Enforces reproduce-first, one hypothesis at a time, root cause over symptom.
---

# Debugging Discipline

A fix written before the bug is understood is a guess wearing a fix's
clothes. Reproduce, explain, then change.

## When NOT to use

- The cause is already proven earlier in this session.
- Trivial mechanical errors the tool output pinpoints exactly (syntax error
  with line number, missing import).

## Procedure

1. **Reproduce first.** Run the failing thing yourself and see it fail. A bug
   you cannot reproduce is a bug you do not understand — say so rather than
   fixing blind.
2. Read the entire error output, not the first line. The real cause is often
   in the middle of the trace.
3. Form **one** hypothesis. Find the cheapest observation that would confirm
   or kill it — a log read, a targeted test, a print in the right place.
4. One change at a time. If an experiment didn't help, **revert it** before
   trying the next. Never stack speculative edits.
5. Fix the root cause. If circumstances force a symptom-level patch, label it
   as such in the report — never silently.
6. After the fix: re-run the original reproduction AND the surrounding test
   suite. A fix that breaks a neighbor is not a fix.
7. Remove all debug scaffolding — prints, temporary flags, commented-out
   experiments — before committing.

## Commands to run

The exact command that exhibits the failure (from the report, CI log, or
recon), before and after the change. Then the repo's canonical check.

## Quality bar

Before committing, you can explain the bug's mechanism in two sentences:
what happened, and why the code allowed it. If you can't, you're not done
debugging — you're done guessing.

## Verification checklist

- [ ] Reproduction ran and failed before the fix.
- [ ] Same reproduction passes after the fix.
- [ ] Surrounding suite still green.
- [ ] No debug prints, dead experiments, or loosened assertions left behind.
- [ ] Mechanism explained in the report.

## Common mistakes

- Shotgun-editing three hypotheses at once, then not knowing which one worked.
- "Fixing" by deleting the failing test, widening a try/except, or loosening
  the assertion until it passes.
- Declaring "flaky" after one failure without rerunning to check.
- Leaving experimental changes in the tree because the last one happened to work.
- Patching where the error *surfaced* instead of where it *originated*.

## What to report back

The mechanism (two sentences), the fix, and the proof: the failing output
before, the passing output after. If the fix is symptom-level, say so and
name the real fix you deferred.
