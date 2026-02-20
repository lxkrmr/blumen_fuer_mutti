# knack! – AI Rules

Rules and context for the AI agent working on this project.

→ Game idea, design decisions, and learnings: [DESIGN.md](DESIGN.md)

---

## Project

A fidget game. Tap a block – it breaks into shards. Sort them by color. Watch a gem grow.

**Started:** February 20, 2026

## Tech

- **Stack:** Vanilla HTML + CSS + JS, Canvas
- **No dependencies:** No framework, no build tools
- **Files:** `index.html` (game), `manifest.json` + `sw.js` + `icon.svg` (PWA)
- **Target:** Browser, touch + mouse, installable as PWA

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
