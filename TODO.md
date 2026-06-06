# Phase 0 & 1 Cleanup TODO (Games Repo)

## Selected Safety/Profile Options
- 1A: Docs/obvious typo files only (no code file renames yet)
- 2A: Remove OS artifacts (`.DS_Store`, `__MACOSX`, `._*`) automatically
- 3A: Standardize README/TODO naming where practical
- 4A: Create/update root `.gitignore` now
- 5A: Critical-path testing after each fix batch
- 6A: Proceed directly with small reversible edits

## Work Plan
- [x] Create this TODO tracker from approved plan
- [x] Inventory current Phase 0/1 targets (docs naming, artifacts, gitignore gaps)
- [x] Add/update root `.gitignore` with OS/editor/node ignores
- [x] Remove OS artifact files/folders across repo
- [x] Standardize obvious documentation names where safe (README/TODO and typo doc names)
- [ ] Update `REPO_IMPROVEMENT_PLAN.md` with progress notes
- [ ] Run critical-path verification for affected projects/files
- [ ] Summarize completed cleanup and next recommended batch

## Progress Log
- Created `TODO.md` for Phase 0/1 execution tracking.
- Inventoried Phase 0/1 targets from current repository tree.
- Added root `.gitignore` with OS/editor/Node/build/env ignore rules.
- Removed known OS artifacts (`.DS_Store`, `._*`, `__MACOSX`) via PowerShell cleanup command.
- Standardized obvious doc filenames:
  - `boxbreaker/stert.md` -> `boxbreaker/README.md`
  - `Centapeed/ReadMe.md` -> `Centapeed/README.md`
