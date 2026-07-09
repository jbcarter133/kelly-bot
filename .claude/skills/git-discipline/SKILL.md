---
name: git-discipline
description: Rules for all git state changes — branching, staging, committing, amending, rebasing, conflict resolution. Use whenever about to create a branch, make a commit, or alter history. Read-only git (log, diff, show) needs no ceremony.
---

# Git Discipline

History is a deliverable. It should read like it was written by someone
careful, because after this session it is the only record of what happened.

## When NOT to use

- Read-only operations: `git log`, `git diff`, `git show`, `git blame`.
- Destructive operations (`reset --hard`, force-push, history rewrite of
  pushed commits) — those go through `destructive-ops-guard` first.

## Procedure

1. Never commit to the default branch. Branch first; use the branch name the
   session designates if one was given.
2. Before committing: `git status` and `git diff --staged`. Read the staged
   diff — you are signing it.
3. Stage specific paths: `git add <path> <path>`. Never `git add -A` or
   `git add .` without first checking `git status` for strays.
4. Commit logically complete units. One concern per commit; no "WIP" or
   "misc fixes" dumps.
5. Message: imperative summary ≤72 chars; body explains *why*, not a list of
   what the diff already shows. Match the style seen in `git log`.
6. Before `commit --amend` or rebase: check whether the commits are already
   pushed (`git status` shows ahead/behind; `git log origin/<branch>..HEAD`).
   Never rewrite pushed history without explicit permission.
7. Push with `git push -u origin <branch>`. Retry only on network errors,
   with backoff — not on rejection, which means something real.

## Commands to run

```
git status                      # before and after every state change
git diff --staged               # read before committing
git log --oneline -5            # confirm the result
git log origin/<branch>..HEAD   # what is local-only, before any rewrite
```

## Quality bar

A stranger can follow the branch's history commit by commit. No commit mixes
unrelated concerns. Nothing committed that doesn't belong to the project.

## Verification checklist

- [ ] On a work branch, not the default branch.
- [ ] Staged diff reviewed before commit.
- [ ] Message matches repo convention and explains why.
- [ ] No scratch files, backups, editor droppings, or `.env`/secrets staged.
- [ ] Pushed only to the designated branch.

## Common mistakes

- `git add .` sweeping in scratch files, logs, or secrets.
- Amending or rebasing commits that are already on the remote.
- Committing generated artifacts the repo ignores elsewhere.
- One giant commit at session end instead of checkpoints at each working state.
- Retrying a rejected push harder instead of reading the rejection.

## What to report back

Branch name, the commits made (`git log --oneline` of them), what was pushed,
and anything left uncommitted with the reason.
