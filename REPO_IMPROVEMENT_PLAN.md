# Games Repository Improvement Plan (Preserve Evolution History)

## Purpose
This document provides a practical, incremental path to improve the `Games` repository **without erasing the learning timeline** reflected in each project.  
We will improve structure, clarity, and maintainability while preserving each game's character and progression.

---

## Guiding Principles

1. **Preserve project history and style evolution**
   - Do not force all games into one coding style immediately.
   - Avoid refactors that erase “how the code evolved over time.”

2. **Improve in layers**
   - Start with safe, obvious fixes (spelling, file naming clarity, junk cleanup, documentation).
   - Then move to functional and structural improvements game-by-game.

3. **One game at a time**
   - Assess, plan, fix, verify for each game individually.
   - Track improvements and decisions in writing.

4. **Document every change**
   - Keep a changelog section per game in this document (or linked game docs).
   - Note why a change was made, not just what changed.

---

## Current Repository Snapshot (High-level)

Root contains:
- App shell files: `index.html`, `style.css`, `manifest.json`, `sw.js`
- Game folders:  
  `asteroids/`, `boxbreaker/`, `Breakout/`, `Centapeed/`, `conQuiz/`, `CORNHOLE/`, `HTMLLER/`, `monkeydo/`, `poker/`

Known inconsistency themes:
- Mixed naming conventions (case and style differences)
- Typos in file/folder names
- Possible legacy/duplicate files in some games
- Inconsistent docs (`README`, `TODO`, etc.)
- Some OS artifact files in tree (`.DS_Store`, `__MACOSX`, `._*` style content in places)

---

## Phased Improvement Strategy

## Phase 0 — Baseline & Safety (Repository-level)
**Goal:** Make cleanup safe and traceable before deeper edits.

Tasks:
- [x] Add/verify root `.gitignore` to block OS/editor/temp artifacts.
- [x] Create/maintain root improvement tracker docs (this file + root TODO).
- [x] Define naming and documentation conventions for *new* cleanup work.
- [ ] Record each game’s current run/start method before any changes.

Deliverables:
- [x] Baseline documentation complete
- [x] Agreed conventions written down
- [x] No risky code refactors yet

---

## Phase 1 — Safe Hygiene Pass (Repository-level)
**Goal:** Apply obvious, low-risk cleanup that improves clarity.

Tasks:
- [x] Fix obvious spelling/documentation filename issues where safe.
- [x] Remove junk/system artifacts that are clearly non-source.
- [x] Standardize documentation filenames (`README.md`, `TODO.md`) when appropriate.
- [x] Keep compatibility notes if rename could affect references.

Deliverables:
- [x] Cleaner tree without changing game behavior
- [x] Reduced noise for future debugging/refactoring

---

## Phase 2 — Root Folder Structure (Light-touch)
**Goal:** Improve base-folder organization without breaking game paths.

Tasks:
- [ ] Decide whether to keep games at root for now or introduce a `games/` container in a later phase.
- [ ] If restructuring, do it in controlled steps with path verification after each move.
- [ ] Keep a mapping table of old path → new path.

Deliverables:
- [ ] Clear, intentional root layout
- [ ] Verified game entry points after structure updates

---

## Phase 3 — Game-by-Game Improvement Loop
**Goal:** Improve each game incrementally while preserving historical progression.

For each game, repeat this workflow:

1. **Assessment**
   - Inventory files and dependencies
   - Identify typos, dead files, duplicate variants, asset layout issues
   - Identify run/start commands

2. **Plan**
   - Separate fixes into:
     - Safe hygiene fixes
     - Functional bug fixes
     - Optional improvements
   - Confirm scope before edits

3. **Implement**
   - Apply minimal-risk edits first
   - Keep compatibility in mind for paths/assets

4. **Verify**
   - Launch/run game
   - Validate core interactions
   - Confirm no broken asset references

5. **Document**
   - Add what changed + why + follow-up ideas

---

## Proposed Game Order (Initial)

1. [ ] Root/base files (`index.html`, `style.css`, `manifest.json`, `sw.js`)
2. [ ] `boxbreaker/`
3. [ ] `asteroids/`
4. [ ] `poker/`
5. [ ] `Centapeed/`
6. [ ] `conQuiz/`
7. [ ] `monkeydo/`
8. [ ] `Breakout/`
9. [ ] `CORNHOLE/`
10. [ ] `HTMLLER/`

> Order can be changed at any time based on your preference.

---

## Standards We Will Apply (Practical, Non-destructive)

### A) Naming & Spelling
- Prefer clear, consistent names for new edits.
- Fix obvious typos that reduce readability.
- Avoid large rename sweeps without verification.

### B) Documentation
Per game, target:
- `README.md` with:
  - What it is
  - How to run
  - Controls/gameplay notes
  - Known issues
- `TODO.md` optional for game-specific backlog

### C) File Hygiene
- Remove obvious non-source artifacts.
- Keep historical variants only when useful; otherwise archive/remove with notes.

### D) Code Etiquette (Light, gradual)
- Improve obvious readability issues:
  - inconsistent indentation
  - unclear variable names where safe
  - dead comments / stale notes
- Do not enforce heavy stylistic rewrites unless requested.

---

## Risk Management Rules

- Make small, reversible changes.
- Verify after each fix batch.
- If a rename might break imports/paths, either:
  - update references immediately, or
  - defer rename and note it in TODO.
- Preserve “learning timeline” by avoiding sweeping rewrites.

---

## Tracking Template (Use per game)

## Game: `<name>`
**Status:** Not Started / In Progress / Verified / Done  
**Entry point(s):**  
**Run method:**  
**Key assets/dependencies:**  

### Findings
- [ ]  
- [ ]  

### Planned Fixes
- [ ] Safe hygiene fixes
- [ ] Functional fixes
- [ ] Optional enhancements

### Implemented Changes
- [ ]  

### Verification Notes
- [ ] Launch success
- [ ] Core interactions checked
- [ ] Asset/path integrity checked

### Follow-ups
- [ ]  

---

## First Execution Scope (Agreed Next Step)

Based on your direction, we will start with:
1. Base `Games` folder organization and root docs/hygiene.
2. Then proceed **one game at a time** with the above loop.
3. Preserve each project’s historical evolution while applying obvious quality fixes.

---

## Decision Log

- **Decision:** Preserve historical progression and avoid standardization that erases timeline.
- **Decision:** Improve structure and etiquette incrementally.
- **Decision:** Proceed repo base first, then game-by-game.
- **Decision:** Phase 0/1 execution profile selected by user: `1A,2A,3A,4A,5A,6A`.

---

## Working Notes
Use this section for quick notes between sessions.

- Phase 0/1 progress: root `.gitignore` added.
- Phase 1 progress: removed known OS artifacts (`.DS_Store`, `._*`, `__MACOSX`) using PowerShell cleanup.
- Phase 1 progress: doc filename normalization completed:
  - `boxbreaker/stert.md` -> `boxbreaker/README.md`
  - `Centapeed/ReadMe.md` -> `Centapeed/README.md`
