---
name: verify-before-done
description: Run before claiming any task complete, before every commit, and before reporting success. Defines what counts as proof — commands executed this session with observed output. Use whenever about to say "done", "fixed", "works", or "implemented".
---

# Verify Before Done

"Done" means commands ran in this session, exited zero, and you observed the
output. Clean-looking code is not evidence. A successful compile is not
evidence of behavior.

## When NOT to use

- Pure research or question-answering with no code change.
- The user explicitly told you to skip verification (state in your report that it was skipped, and at whose request).

## Procedure

1. Identify the proof commands from recon: tests, lint, typecheck, build.
   If the repo has none, say so explicitly — do not invent a green light.
2. Run the narrowest test scope that exercises your change first, then the
   broader suite if it is cheap. If only the narrow scope ran, say so.
3. Where feasible, exercise the change directly — run the script, hit the
   endpoint, invoke the CLI — not only its tests.
4. If anything fails, report the failure with the actual output. Do not
   retry-until-green without understanding why it failed (see
   `debugging-discipline`).
5. New behavior with no covering test: add one, or state plainly that the
   behavior is untested and why.

## Commands to run

Whatever recon found as this repo's canonical check — typically one of:
manifest test script, `make test`/`make check`, or the command CI runs.
Never a command you guessed from the ecosystem's defaults.

## Quality bar

Every claim of success in your report maps to a command you ran and output
you saw. Anything else is labeled **unverified** — in those words.

## Verification checklist

- [ ] Tests run, or their absence stated.
- [ ] Lint/typecheck run, or their absence stated.
- [ ] Change exercised end-to-end where the repo makes that possible.
- [ ] Any failing output included verbatim in the report.
- [ ] No "should work" / "this will" phrasing for unexecuted paths.

## Common mistakes

- Declaring done because the diff looks right.
- Running only the new test and skipping the suite it might have broken.
- Treating skipped or filtered-out tests as passing.
- Narrowing the test scope until it goes green, then reporting green.
- Verifying with a weaker check than CI runs, then being surprised by CI.

## What to report back

The exact commands run and pass/fail per command. Anything unverified,
flagged as unverified. Failures quoted, not paraphrased.
