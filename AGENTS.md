# Blumen für Mutti — AGENT Rules

This file defines how coding agents must work in this repository.

Related docs:
- Process + decisions: [DESIGN.md](DESIGN.md)
- Public statement: [README.md](README.md)

---

## 1) Project Context

**Blumen für Mutti** (B♥M) is a fidget sorting game.

Player loop: open Packs → sort Pieces into Bins → Harry builds flowers.  
Progression: **10 flowers = 1 bouquet = 1 ♥ from Mutti**.

Tech: Vanilla HTML/CSS/JS + Canvas, no framework, no build tools, installable PWA.

---

## 2) Documentation Contract

| File | Role |
|---|---|
| `AGENTS.md` | Agent operating rules |
| `DESIGN.md` | Living process (decisions, open questions, learnings) |
| `README.md` | Stable public statement |

Rule of thumb: **README states; DESIGN explains.**

---

## 3) Rule Priority

If rules conflict, follow this order:
1. Safety / platform / system constraints
2. Explicit user instruction
3. This `AGENTS.md`
4. Style preferences

---

## 4) Hard Constraints

### Git
The human handles Git. Agents must not commit, push, branch, merge, or rebase.

### Server
The human starts servers. Agents must not run local server commands.

### Language
- Code + code comments: English
- `AGENTS.md` + `README.md`: English
- In-game text: i18n only (DE + EN)

### Shareable content
Do not add machine-specific details (absolute paths, usernames, local IPs) to shareable files.

---

## 5) Ubiquitous Language (UL)

The UL glossary in `DESIGN.md` is the single source of truth.

Agents must:
- use UL terms exactly
- avoid synonyms/legacy terms
- define new concepts in `DESIGN.md` before usage
- fix terminology drift during cleanup

---

## 6) Architecture (strict)

Flow: **Data → Calculations → Side effects**

- **Data:** plain objects only (no logic, no I/O)
- **Calculations:** pure functions only (no I/O, no time, no canvas)
- **Side effects:** canvas, DOM events, localStorage, haptics, rAF

Randomness policy:
- Randomness is an input, not an internal call
- pass `rng` into pure functions
- caller selects source (`Math.random` production, seeded PRNG tests/trainers)

Prefer data-driven structures over mutable per-tick state.

---

## 7) Coding Style

- Simple > clever
- Readable > short
- Works > perfect
- Comments explain **why**, not **what**
- Never describe removed behavior in comments (Git history is the source)

---

## 8) Agent Behavior

- Answer questions directly before taking action
- Ask when unclear; do not silently assume
- Human decides priorities/navigation
- Number multi-question blocks: `(1)`, `(2)`, `(3)`

At completion:
- do not push next tasks
- end with: **"Ich bin bereit – Nächstes in DESIGN.md: [item]"**

---

## 9) Workflow (mandatory order)

1. **Plan** — capture decisions in `DESIGN.md`
2. **Implement** — only after explicit user go-ahead
3. **Review** — wait for technical/functional feedback
4. **Clean up** — sync docs, remove stale notes, refactor where useful
5. **Learnings** — note reusable patterns for skills/docs
6. **Agent rules** — update `AGENTS.md` / skills if needed
7. **Brain dump (optional)** — capture durable insights in `../braind_dump/`

### Fast path
For tiny non-behavioral changes (typos, wording, links, pure renames), use lightweight inline planning.

---

## 10) Screenshots (browser-tools)

- ask before screenshotting
- human drives interaction
- take one screenshot per explicit request, then discuss

Optional startup command if needed:
`node ~/.pi/agent/skills/pi-skills/browser-tools/browser-start.js`

---

## 11) Definition of Done

Before declaring done, verify:
- requested change is implemented
- related references are updated
- `DESIGN.md` is updated where relevant
- UL terms are consistent
- no rule violations were introduced

---

## 12) Standard Features

| Feature | Requirement |
|---|---|
| i18n | Auto-detect via `navigator.language`, manual toggle, persisted in `localStorage` |
| PWA | Installable, offline-capable, Service Worker strategy: network-first |
| Phone frame | Canvas 430×932, centered, `border-radius: 12px` |
| Colors | GitHub Dark Colorblind palette (blue/orange). Never green/red for gameplay feedback. Green only for decorative plant elements |
