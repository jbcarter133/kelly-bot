---
name: destructive-ops-guard
description: Gate before any irreversible or hard-to-reverse action — deleting files, rm -rf, git reset --hard, checkout/restore over uncommitted work, force-push, history rewrite, dropping or migrating data, bulk renames, overwriting files you did not create. Use BEFORE running the command, not after.
---

# Destructive Ops Guard

The cost of a wrong destructive action is unbounded; the cost of checking
first is one tool call. Inspect, prefer the reversible variant, and when in
doubt, ask.

## When NOT to use

- Deleting files you created this session in the scratchpad.
- Reverting your own uncommitted edit to a file only you have touched this session.
- Overwriting generated artifacts that the build reproduces.

## Procedure

1. Name the action and its blast radius in your reply *before* running it:
   what exactly is destroyed, and can it be recovered.
2. Inspect the target first. Read the file before overwriting it; list the
   directory before deleting from it; run `git status` before any reset,
   checkout, or clean — **uncommitted work is unrecoverable** after those.
3. If what you find contradicts how the target was described to you, or you
   didn't create it — stop and surface that instead of proceeding.
4. Prefer the reversible variant:
   - `git rm` (recoverable from history) over `rm`
   - `git revert` over `reset --hard`
   - `git stash` as a safety net before risky tree operations
   - rename/archive over delete
5. If the action is not covered by explicit or durable authorization from the
   user, ask first (see `escalation`). "Clean up" is not authorization to
   delete broadly.
6. Afterward, verify only the intended things are gone: `git status`, `ls`.

## Commands to run

```
git status              # any uncommitted work in the blast radius?
ls <target-dir>         # before deleting by glob or directory
git stash               # cheap insurance before tree-level operations
```

## Quality bar

Nothing destroyed that was not explicitly in scope. Everything destroyed was
inspected first. Every destruction is recoverable, or its irrecoverability
was acknowledged before acting.

## Verification checklist

- [ ] Target inspected (read/listed) before the operation.
- [ ] `git status` checked — no uncommitted work in the blast radius.
- [ ] Reversible alternative considered and chosen where it exists.
- [ ] Authorization: explicit, durable, or asked-for. Not inferred.
- [ ] Post-check confirms only intended targets affected.

## Common mistakes

- `git reset --hard` / `git checkout .` with uncommitted work sitting in the tree.
- `rm` on a glob without listing what it matches first.
- Overwriting a file you never read because its name matched expectations.
- Force-pushing a branch someone else may have based work on.
- Treating a vague instruction ("tidy this up") as license for deletion.

## What to report back

Exactly what was removed or overwritten, how to recover it if possible, and
anything you declined to destroy pending confirmation.
