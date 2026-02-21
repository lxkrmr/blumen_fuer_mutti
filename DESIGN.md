# knack! – Design

Game idea, design decisions, and learnings. Living document – updated as the project evolves.

→ See also: [CLAUDE.md](CLAUDE.md) (AI rules) · [README](README.md) (public)
→ knack! is the lab for: [../braind_dump/blumen-fuer-mutti.md](../braind_dump/blumen-fuer-mutti.md)

---

## Idea

A fidget game. A block appears – tap it until it breaks into shards. Sort the shards by **shape** into bins. Bins fill up, a crystal flower grows.

knack! is a prototype lab. We learn here what feels good – mechanics, animations, haptics, visual language – before building the actual game ("Blumen für Mutti").

**Inspiration:** Satisfying stone-breaking videos (TikTok/YouTube). Montessori shape sorters. The good part of mobile sorting games – without the dark patterns.

**Core question:** Does it feel good? Is sorting satisfying enough to be a podcast companion?

---

## Core loop

```
Block appears (color = hardness, size = yield)
        ↓
Tap repeatedly until it breaks (harder blocks need more taps)
        ↓
Shards fly out – each has a SHAPE (circle, heart, stem, leaf)
        ↓
Tap shard to select → tap matching bin to sort
        ↓
Bins persist across rounds – next block appears immediately
        ↓
Bin full → crystal flower grows a part
        ↓
Flower complete → new flower begins
```

---

## Design principles

- **No timer, no punishment** – wrong sort: gentle shake, try again
- **No reset between rounds** – bins stay filled, game flows continuously
- **Fidget-first** – low cognitive load, podcast-compatible
- **Haptic + visual feedback** – combined on Android, visual only on iOS/desktop
- **Discover, don't explain** – hidden patterns (color → shape tendency) reward attention, no tutorial needed

---

## Mechanics (new direction)

### Blocks

| Property | Meaning |
|---|---|
| **Color** | Hardness – how many taps to break |
| **Size** | Yield – how many shards come out |
| **Color → shape tendency** | Subtle probability bias toward certain shapes (no UI, player discovers) |

**Hardness by color (example – tune by feel):**
| Color | Tap range |
|---|---|
| Blue | 1–2 (soft) |
| Orange | 2–4 (medium) |
| Purple | 4–7 (hard) |

Block shows damage visually as it's tapped (cracks, wobble). The player feels when it's close to breaking – no counter shown.

### Shards / Shapes

Sorting is by **shape**, not color. Shapes are recognizable (Montessori-style), not random polygons.

| Shape | Bin |
|---|---|
| ◯ Circle | Circle bin |
| ♥ Heart | Heart bin |
| \| Stem | Stem bin |
| ❧ Leaf | Leaf bin |

Shard **colors are wild** – they inherit from the block, but color carries no sorting meaning. This keeps colors beautiful without creating "I need blue now" pressure.

### Crystal flower (reward)

Replaces the hexagon gem. Built organically from sorted shapes:

| Shape | Flower part |
|---|---|
| Circle | Bloom center |
| Hearts | Petals |
| Stem | Stem |
| Leaf | Leaves on stem |

- Build is **organic** – not always identical. Sometimes more petals, sometimes more leaves.
- Colors come from the shards → every flower is a unique color combination.
- When complete: brief celebration, then new flower begins.

---

## Scope

| In | Out |
|---|---|
| Block → multi-tap break | Harry / character |
| Sort by shape (4 shapes) | Sound |
| Crystal flower grows | World / scene |
| Color = hardness | Score / stats |
| Size = yield | Achievements |
| Haptic + animation feedback | |
| DE + EN | |

---

## Current state (prototype v1 – baseline)

*What is actually implemented right now. The new direction above is NOT yet built.*

| What | Status |
|---|---|
| Block appears (random color) | ✅ |
| Tap once → breaks into shards | ✅ |
| Select shard → sort by **color** | ✅ |
| Wrong sort → shake feedback | ✅ |
| Bins persist across rounds | ✅ |
| Bin full → hexagon gem grows a facet | ✅ |
| Gem complete → new gem begins | ✅ |
| Haptic feedback (Android) | ✅ |
| i18n (DE + EN) | ✅ |
| PWA (installable, offline) | ✅ |

---

## Next steps

Build these in order – each should be independently testable and feel-able:

1. **Multi-tap block breaking** – block needs N taps (random range by color) to break. Visual damage on each tap (cracks, scale wobble). No counter shown.
2. **Shape shards** – replace random polygons with defined shapes (circle, heart, stem, leaf). Sort by shape instead of color.
3. **Block size variation** – small/medium/large blocks with different shard yields.
4. **Crystal flower** – replace hexagon gem with organic flower built from sorted shapes.
5. **Color → shape tendency** – subtle probability bias per block color.

---

## Open questions

- [ ] How many taps per hardness level feels right? (tune by feel)
- [ ] How many bins? Currently 3 (colors). New plan: 4 (shapes) – does that fit the screen?
- [ ] How to draw the 4 shapes cleanly on canvas? (circle = easy, heart/leaf/stem = needs care)
- [ ] How organic is the flower build? (random within a range? or fully procedural?)
- [ ] How many shards per block (small/medium/large)?
- [ ] How many shards fill a bin?

---

## Design decisions

| Decision | Rationale |
|---|---|
| **Sort by shape, not color** | Color stays visual/emotional, no cognitive load of "I need X color now" |
| **Color = hardness** | Color gains meaning without becoming a sorting rule |
| **Wild shard colors** | Every crystal flower unique, no color pressure |
| **No tap counter shown** | Player feels the block through cracks/wobble – more tactile |
| **Variable hardness range** | e.g. 1–2 not exactly 1 – prevents predictability, keeps it alive |
| **Organic flower build** | Not always identical – gives each flower personality |
| **knack! = lab only** | Learnings flow into "Blumen für Mutti", not into feature creep here |

---

## Values

- **No dark patterns** – no manipulation, no fake urgency
- **Honest** – what you see is what you get
- **Simple** – as little as possible, as much as needed
- **Joyful** – if it's not fun, why bother?
- **Accessible** – colorblind-safe palette; before release: respect `prefers-reduced-motion`

---

## Learnings

- *Feb 20:* Prototype v1 built. Core loop works. Color sorting functional. Hexagon gem functional.
- *Feb 21:* New direction decided. Color = hardness. Shape sorting. Crystal flower. knack! is lab for "Blumen für Mutti".
