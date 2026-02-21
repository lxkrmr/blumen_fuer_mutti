# knack! – Design

Game idea, design decisions, and learnings. Living document – updated as the project evolves.

→ See also: [CLAUDE.md](CLAUDE.md) (AI rules) · [README](README.md) (public)

---

## Idea

A fidget game. A colorful block appears, tap it – it breaks into shards. Sort the shards by color into bins. Bins fill up, a gem grows facet by facet.

**Inspiration:** Satisfying stone-breaking videos (TikTok/YouTube). The good part of mobile sorting games – without the dark patterns around them.

**Core question:** Does it feel good? Is sorting satisfying enough to be a podcast companion?

## Core loop

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

## Design principles

- **No timer, no punishment** – wrong sort: gentle shake, try again
- **No reset between rounds** – bins stay filled, game flows continuously
- **Fidget-first** – low cognitive load, podcast-compatible
- **Haptic + visual feedback** – combined on Android, visual only on iOS/desktop

## Scope

| In | Out |
|---|---|
| Block → break → shards | Harry / character |
| Sort into persistent bins | Sound |
| Gem grows per filled bin | World / scene |
| Haptic + animation feedback | Score / stats |
| DE + EN | Achievements |

## Current state

*(What is actually implemented right now – updated after each change)*

| What | Status |
|---|---|
| Block appears | ✅ |
| Tap → breaks into shards | ✅ |
| Select shard → sort into bin | ✅ |
| Wrong sort → shake feedback | ✅ |
| Bins persist across rounds | ✅ |
| Bin full → gem grows a facet | ✅ |
| Gem complete → new gem begins | ✅ |
| Haptic feedback (Android) | ✅ |
| i18n (DE + EN) | ✅ |
| PWA (installable, offline) | ✅ |

## Values

- **No dark patterns** – no manipulation, no fake urgency
- **Honest** – what you see is what you get
- **Simple** – as little as possible, as much as needed
- **Joyful** – if it's not fun, why bother?
- **Accessible** – colorblind-safe palette; before release: respect `prefers-reduced-motion`

## Open questions

- [ ] How many shards per block? (currently 3 per color)
- [ ] How many shards to fill a bin? (currently 4)
- [ ] How many facets per gem? (currently 6)
- [ ] What does the gem look like?

## Design decisions

*(Document decisions and their rationale here)*

## Ideas & parking lot

*(Things to explore later)*

## Learnings

*(Collected during development)*
