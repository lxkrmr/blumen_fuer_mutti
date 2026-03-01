# Blumen für Mutti – Agent Rules

Rules and context for any coding agent working on this project.

→ Game idea, decisions, and learnings: [DESIGN.md](DESIGN.md)  
→ Public project statement: [README.md](README.md)

---

## Project Snapshot

**Blumen für Mutti** (logo: **B♥M**) is a fidget sorting game.

Harry the cat wants to build Klemmbaustein flowers for his Mutti, but he has no thumbs. The player opens Packs and sorts Pieces into Bins. Harry builds flowers in the background and ties bouquets. Mutti sends hearts.

Core loop: open Packs → sort Pieces by shape into Bins → Harry builds flowers.  
Progression: **10 flowers = 1 bouquet = 1 ♥ from Mutti**.

Started: February 20, 2026  
Tech: Vanilla HTML/CSS/JS + Canvas, no dependencies, installable PWA.

---

## Documentation

| File | Purpose |
|---|---|
| **AGENTS.md** | Agent operating rules and constraints |
| **DESIGN.md** | Process, decisions, open questions, learnings (living) |
| **README.md** | Public-facing project statement (stable) |

Rule of thumb: **README is a statement. DESIGN.md is a process.**

---

## Rule Priority

When rules conflict, use this order:
1. Safety and platform/system rules
2. Direct user request
3. Project rules in this file
4. Style preferences

---

## Hard Constraints

### Git
The human handles Git. Do not commit, push, branch, rebase, or merge.

### Server
The human starts servers. Do not run `python3 -m http.server` or similar.

### Language
- **Code and comments:** English
- **AGENTS.md and README:** English
- **In-game text:** via i18n (DE + EN)

### No system-specific content
Do not place absolute paths, usernames, or local IPs in shareable files.

---

## Ubiquitous Language (UL)

`DESIGN.md` contains the UL glossary and is the single source of truth.

- Use UL terms exactly in code, comments, docs, and conversation
- Do not introduce synonyms or legacy names
- If a new concept appears: define it in `DESIGN.md` first, then use it
- During cleanup: detect and fix terminology drift immediately

---

## Architecture Rules

Strict flow: **Data → Calculations → Side effects**

- **Data:** plain state/config objects only (no logic, no I/O)
- **Calculations:** pure functions only (no I/O, no clock, no canvas)
- **Side effects:** canvas, localStorage, haptics, rAF, DOM events

Randomness rule:
- Randomness is a parameter, not a direct call
- Pass `rng` into pure functions
- Caller chooses source (`Math.random` in production, seeded PRNG in tests/trainers)

Prefer data over mutable per-tick state (for example: shuffled Pack sequences over leaky buckets).

---

## Code Style

- Simple > clever
- Readable > short
- Works > perfect
- Comments explain **why**, not **what**
- Do not comment removed/old behavior (Git history is the place for that)

---

## Agent Behavior

- Answer questions directly before doing anything else
- Ask when uncertain; do not silently assume
- The human navigates priorities
- If asking multiple questions, number them `(1)`, `(2)`, `(3)`

Completion behavior:
- Do not push the next task
- End with: **"Ich bin bereit – Nächstes in DESIGN.md: [item]"** and wait

---

## Workflow (always in this order)

1. **Plan** → write decisions in `DESIGN.md` first
2. **Implement** → only after explicit user go-ahead
3. **Review** → wait for technical/functional feedback
4. **Clean up** → update `DESIGN.md`, remove stale notes, refactor if needed
5. **Learnings** → decide if reusable in skill docs
6. **Agent rules** → decide if `AGENTS.md` or skill rules should be updated
7. **Brain dump (optional)** → capture durable insights in `../braind_dump/`

### Fast path for tiny changes
For trivial non-behavioral edits (typos, wording, link fixes, pure renames), planning can be short and inline in chat.

---

## Screenshot Rules (browser-tools)

- Ask before taking screenshots
- Human drives interaction; agent captures only on request
- One screenshot per request; then discuss
- Setup note: if needed, start Chrome with  
  `node ~/.pi/agent/skills/pi-skills/browser-tools/browser-start.js`

---

## Definition of Done (DoD)

Before claiming completion:
- Requested change is implemented
- Related references/links are updated
- `DESIGN.md` is synced where relevant
- No stale terminology vs UL glossary
- No accidental rule violations

---

## Standard Features

| Feature | Details |
|---|---|
| **i18n** | Auto-detect via `navigator.language`, language toggle, persisted in `localStorage` |
| **PWA** | Installable, offline-capable via Service Worker (network-first) |
| **Phone frame** | Canvas 430×932px, centered, `border-radius: 12px` |
| **Colors** | GitHub Dark Colorblind palette (blue/orange). Never green/red for gameplay feedback/sorting. Green allowed for decorative plant elements only |
