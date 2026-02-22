# Blumen für Mutti – AI Rules

Rules and context for the AI agent working on this project.

→ Game idea, design decisions, and learnings: [DESIGN.md](DESIGN.md)
→ Project scaffold skill (suggest updates when patterns emerge): `web-prototype`

---

## Project

**Blumen für Mutti** (Logo: B♥M) – A fidget sorting game. Harry the cat wants to build Klemmbaustein flowers for his Mutti, but he has no thumbs. The player opens the bags and sorts the parts. Harry builds the flowers and ties bouquets. Mutti sends hearts.

Tap a bag open, sort parts by shape into bins. Harry builds flowers in the background. 10 flowers = 1 bouquet = 1 ♥ from Mutti.

*Evolved from knack! (Feb 2026), which served as the prototype lab for this game.*

**Started:** February 20, 2026

## Tech

- **Stack:** Vanilla HTML + CSS + JS, Canvas
- **No dependencies:** No framework, no build tools
- **Files:** `index.html` (game), `manifest.json` + `sw.js` + `icon.svg` (PWA)
- **Target:** Browser, touch + mouse, installable as PWA

## Documentation

| File | Purpose |
|---|---|
| **CLAUDE.md** | My operating instructions – rules, constraints, how to behave. Directed at the AI. |
| **DESIGN.md** | The process – why decisions were made, what's implemented, what's open. Living document. |
| **README.md** | The statement – what this project is, for anyone visiting the repo. Stable, public. |

**Faustregel:** README is a statement. DESIGN.md is a process.

## Rules

### Git
The human does Git. No commits, pushes, or branch operations by the AI.

### Server
The human starts the server. The AI does not run `python3 -m http.server` or similar.

### Language
- **Code & comments:** English
- **CLAUDE.md & README:** English
- **In-game text:** Via i18n (DE + EN)

### Code style
- Simple > clever
- Readable > short
- Works > perfect
- **Comments explain why, not what** – mark sections or describe non-obvious intent. Never describe what old code used to do or what was removed. That belongs in git history, not in comments.

### AI behavior
- **Questions get answers** – if the human asks a question, answer it. Don't just start doing things.
- **Dialogue over assumptions** – if something doesn't make sense, ask. Don't silently interpret and execute.
- **Human navigates** – never prompt "ready for X?" or push the next step. After finishing, say "Ich bin bereit – Nächstes in DESIGN.md: [item]" and wait.
- **Structure review questions** – when asking multiple questions (e.g. during cleanup), number them: (1) … (2) … (3) … so the human can answer (1) yes (2) ok etc.
- **Plan before code** – design decisions go into DESIGN.md first. Only write code after the human explicitly says to build it. This applies during Fachabnahme too – feedback triggers discussion, not immediate coding.
- **Plan step by step** – when planning, think in numbered steps. Start with just a few, continue when done. Don't plan everything at once.
- **Clean up before starting** – before every new feature: check if DESIGN.md is current, mark done items, remove stale notes.
- **Best practices always** – clean code, SOLID principles, readable over clever. No shortcuts.
- **Keep DESIGN.md current** – after each meaningful change, update the relevant sections: decisions made, open questions resolved, learnings gained.
- **No system-specific content** – avoid absolute paths, usernames, or local IPs in any file that may be shared (CLAUDE.md, DESIGN.md, README.md, source files).

### Screenshots (browser-tools)
- **Ask before screenshotting** – don't take screenshots autonomously or in loops.
- **Human drives the browser** – the human clicks/plays until a good moment, then says something like "anschauen" or "screenshot". Only then take one.
- **One shot** – take a single screenshot, show it, discuss. No loops.
- **Setup** – browser-tools is installed (`node_modules` present). Chrome may need to be started: `node ~/.pi/agent/skills/pi-skills/browser-tools/browser-start.js`

### Workflow – always in this order

1. **Plan** → DESIGN.md first. No code without explicit go-ahead.
2. **Implement** → write the code.
3. **Review** → human reviews technically and functionally (Fachabnahme). Wait for feedback before proceeding.
4. **Clean up** → update DESIGN.md, mark done items, remove stale notes, refactor if needed.
5. **Learnings** → anything worth adding to the skill for future projects?
6. **Agent rules** → any new rules discovered that should go into CLAUDE.md or the skill?
7. **Brain dump** *(optional)* → anything worth capturing in `../braind_dump/`?

### Iteration
- Small steps, each committable independently
- Test, feel, adjust
- "Done" is when it feels right

## Standard features

| Feature | Details |
|---|---|
| **i18n** | Language auto-detected via `navigator.language`, toggle button, persisted in `localStorage` |
| **PWA** | Installable, offline-capable via Service Worker (network-first) |
| **Phone frame** | Canvas 430×932px, centered, `border-radius: 12px` – see pling as reference |
| **Colors** | GitHub Dark Colorblind palette – blue/orange, never green/red for game feedback/sorting. Green is allowed for decorative plant elements (stems, leaves). |
