# knack! – AI Rules

Rules and context for the AI agent working on this project.

→ Game idea, design decisions, and learnings: [DESIGN.md](DESIGN.md)
→ Project scaffold skill (suggest updates when patterns emerge): `web-prototype`

---

## Project

A fidget game and prototype lab. Tap a block repeatedly until it breaks into shards. Sort them by shape into bins. Watch a crystal flower grow.

knack! is the lab for the next game ("Blumen für Mutti"). We learn here what feels good before building the real thing.

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

### AI behavior
- **Questions get answers** – if the human asks a question, answer it. Don't just start doing things.
- **Dialogue over assumptions** – if something doesn't make sense, ask. Don't silently interpret and execute.
- **Keep DESIGN.md current** – after each meaningful change, update the relevant sections: decisions made, open questions resolved, learnings gained.
- **No system-specific content** – avoid absolute paths, usernames, or local IPs in any file that may be shared (CLAUDE.md, DESIGN.md, README.md, source files).

### Screenshots (browser-tools)
- **Ask before screenshotting** – don't take screenshots autonomously or in loops.
- **Human drives the browser** – the human clicks/plays until a good moment, then says something like "anschauen" or "screenshot". Only then take one.
- **One shot** – take a single screenshot, show it, discuss. No loops.
- **Setup** – browser-tools is installed (`node_modules` present). Chrome may need to be started: `node ~/.pi/agent/skills/pi-skills/browser-tools/browser-start.js`

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
| **Colors** | GitHub Dark Colorblind palette – blue/orange, never green/red |
