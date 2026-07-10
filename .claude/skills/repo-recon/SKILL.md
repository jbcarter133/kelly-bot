---
name: repo-recon
description: First contact with an unfamiliar repository. Use before the first code edit in any session where the repo is not yet mapped — no CLAUDE.md, a stale CLAUDE.md, or a task touching an area you have not read. Builds a minimal map — build/test/lint commands, layout, conventions — without reading the whole tree.
---

# Repo Recon

Map the repository before changing it. The goal is a *minimal* map: enough to
know where the task lives and which commands prove work is done. Not a full
read of the codebase.

## When NOT to use

- The repo is already mapped earlier in this session.
- CLAUDE.md exists, is current, and covers the task's area — trust it, spot-check one command.
- The task is a question about a single named file — just read that file.

## Procedure

1. Read `README.md` and `CLAUDE.md` at the repo root, if present. Top level only.
2. Find the manifest and read its scripts/targets — these are the real commands:
   `package.json` (scripts), `pyproject.toml`, `Makefile`, `Cargo.toml`,
   `go.mod` + `Makefile`, `build.gradle`, etc.
3. Read CI config (`.github/workflows/*.yml` or equivalent). CI is ground
   truth for "what proves work is done." If CI and README disagree, CI wins.
4. Skim history for conventions and active areas:
   ```
   git log --oneline -15
   git log --stat -3
   ```
5. List the top two directory levels only (`ls` + Glob). Do not recursively
   read source files.
6. Read only the files the task touches, plus their immediate neighbors and
   their tests.

## Quality bar

After recon you can state — without guessing — how to run the tests, how to
lint/typecheck, where the task's code lives, and what commit-message style
the history uses. Every command you'll later run was *found in a file*, not
assumed.

## Verification checklist

- [ ] Test command found in manifest/Makefile/CI — not guessed from the ecosystem's default.
- [ ] Lint/format/typecheck command found, or its absence explicitly confirmed.
- [ ] CI config read, or its absence confirmed.
- [ ] Commit style observed from `git log`, not invented.

## Common mistakes

- Guessing `npm test` / `pytest` without checking that the script or config actually exists.
- Reading dozens of source files "for context" before knowing what the task needs. Recon is a map, not a tour.
- Trusting README commands that the manifest no longer defines — READMEs go stale; verify against the manifest.
- Skipping CI config and later "verifying" with weaker checks than CI runs.

## What to report back

One short paragraph: the repo's shape, where the task lives, and the exact
verify commands you will use. Flag any README/manifest/CI disagreement found.
