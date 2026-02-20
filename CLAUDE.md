# knack!

A web prototype. Minimal, exploratory, honest.

## Purpose

A fidget game. A colorful block appears, tap it – it breaks into shards. Sort the shards by color into bins. Bins fill up, a gem grows facet by facet.

**Inspiration:** Satisfying stone-breaking videos (TikTok/YouTube). The good part of mobile sorting games – without the dark patterns around them.

**Core question:** Does it feel good? Is sorting satisfying enough to be a podcast companion?

## Status

**Started:** February 20, 2026
**Phase:** Prototype

## Tech

- **Stack:** Vanilla HTML + CSS + JS
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

### Iteration
- Small steps, each committable independently
- Test, feel, adjust
- "Done" is when it feels right

## Game design

### Core loop

```
Colored block appears
        ↓
Tap it → breaks into shards (the satisfying moment)
        ↓
Tap shard to select → tap bin to sort
        ↓
Bins persist across rounds – next block appears immediately
        ↓
Bin full → shards compact → gem grows a facet
        ↓
Gem complete → new gem begins
```

### Design principles

- **No timer, no punishment** – wrong sort: gentle shake, try again
- **No reset between rounds** – bins stay filled, game flows continuously
- **Fidget-first** – low cognitive load, podcast-compatible
- **Haptic + visual feedback** – combined on Android, visual only on iOS/desktop

### MVP scope

| In | Out |
|---|---|
| Block → break → shards | Harry / character |
| Sort into persistent bins | Sound |
| Gem grows per filled bin | World / scene |
| Haptic + animation feedback | Score / stats |
| DE + EN | Achievements |

## Standard features

| Feature | Details |
|---|---|
| **i18n** | Auto-detected via `navigator.language`, toggle button, `localStorage` |
| **PWA** | Installable, offline-capable, network-first service worker |
| **Phone frame** | 430px max-width on desktop |
| **Colors** | GitHub Dark Colorblind palette – blue/orange, never green/red |

## Values

- **No dark patterns** – no manipulation, no fake urgency
- **Honest** – what you see is what you get
- **Simple** – as little as possible, as much as needed
- **Joyful** – if it's not fun, why bother?
- **Accessible** – colorblind-safe palette; before release: respect `prefers-reduced-motion`

## Open questions

- [ ] How many shards per block? (currently 3 per color)
- [ ] How many shards to fill a bin?
- [ ] How many facets per gem?
- [ ] What does the gem look like?

## Learnings

*(Collected during development)*
