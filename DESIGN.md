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
Block appears (size = hardness + yield, color = aesthetic only)
        ↓
Tap repeatedly until it breaks
(block rattles, rotates, pieces drift apart, glow intensifies)
        ↓
Shards fly out – each has a SHAPE (circle, heart, stem, leaf)
        ↓
Drag shard to matching bin
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
- **Discover, don't explain** – no tutorial needed

---

## Mechanics

### Blocks

The block is not a rectangle – it's a **cluster of its own pieces**, overlapping and merged into an organic shape. The player can already see what shapes are inside before breaking.

| Property | Meaning |
|---|---|
| **Size** | Hardness + yield – bigger = more taps + more shards |
| **Color** | Purely aesthetic – blue, orange, purple. No game meaning. |

**Sizes:**
| Size | Taps | Shards | Feel |
|---|---|---|---|
| small | 1–2 | 3 | quick, easy |
| medium | 2–4 | 5 | comfortable |
| large | 4–7 | 7 | satisfying |
| jackpot | 7–12 | 12 | rare, worth it |

**Damage feedback (no cracks – replaced by feel):**
- **Wobble** – scale punch on each tap
- **Rattle** – block rotates slightly, accumulates (never springs back – like hitting a stone)
- **Drift** – pieces slowly spread apart, block "comes undone"
- **Glow** – starts after first tap, pulses faster as damage increases. Crisp shapes, glow is a separate halo pass.

### Shards / Shapes

Sorting is by **shape**, not color. 4 shapes, each has its own bin.

| Shape | Description |
|---|---|
| ◯ Circle | round |
| ♥ Heart | heart |
| \| Stem | tall rounded rectangle, vertical |
| ❧ Leaf | pointed oval, horizontal |

Shard **colors are wild** – inherited from the block, no sorting meaning. Keeps colors beautiful without pressure.

Sorting via **drag & drop** – drag shard directly to bin. Wrong bin: snap back + shake.

### Crystal flower (reward) – not yet built

Replaces the hexagon gem. Built organically from sorted shapes.

![Flower reference sketch](flower-reference.png)

**Recipe – one complete flower:**

| Shape | Flower part | Count |
|---|---|---|
| Circle | Bloom center | 1 |
| Heart | Petals (overlapping, full bloom) | 8 |
| Stem | Stem (curved, 3–4 segments) | 1 |
| Leaf | Leaves on stem (one left, one right) | 2 |

Total: **12 parts** per flower. Bin capacity matches the recipe – bin full = flower part complete.

The stem curves gently (not straight up). The right leaf sits slightly behind the stem, lower than the left.

---

## Current state

| What | Status |
|---|---|
| Block appears (random color + size) | ✅ |
| Block is a cluster of its pieces (organic shape) | ✅ |
| Multi-tap break (N taps by size) | ✅ |
| Damage feedback: wobble + rattle + drift + glow | ✅ |
| Breaks into shards with defined shapes | ✅ |
| Drag & drop sorting by shape | ✅ |
| Wrong sort → snap back + shake | ✅ |
| 4 bins with shape icons | ✅ |
| Bins persist across rounds | ✅ |
| Bin full → hexagon gem grows (placeholder) | ✅ |
| Gem complete → new gem begins | ✅ |
| Haptic feedback (Android) | ✅ |
| i18n (DE + EN) | ✅ |
| PWA (installable, offline) | ✅ |
| Crystal flower | ❌ (next) – recipe defined, sketch done |
| Sound | ❌ (out of scope for now) |

---

## Next steps

1. **Crystal flower** – replace hexagon gem with organic flower (recipe: 1 Circle, 8 Hearts, 1 Stem, 2 Leaves)
2. **Crack visuals** – damage feedback without lines. Ideas: per-piece opacity fade, piece-level micro-rotation as they drift
3. **Color → shape tendency** – subtle probability bias per block color (optional, discoverable)
4. **Feel tuning** – tap ranges, drift speed, glow intensity, shard sizes. Ongoing.

---

## Open questions

- [x] How organic is the flower build? → Fixed structure, curved stem, overlapping petals
- [x] How many shards fill a bin? → Bin capacity = flower recipe (1/8/1/2)
- [ ] Crack/damage visuals – how to communicate progress without lines?
- [ ] Does color → shape tendency add enough to be worth the complexity?
- [ ] **Shape-to-color mapping:** Each shape gets its own fixed color → block becomes multicolor from the start. Looks potentially beautiful, makes sorting more intuitive. Tension: color would no longer be purely aesthetic. 4 shapes, 3 current colors – needs a 4th color or one shared.

---

## Design decisions

| Decision | Rationale |
|---|---|
| **Sort by shape, not color** | Color stays visual/emotional, no cognitive load of "I need X color now" |
| **Size = hardness + yield** | Bigger block = more taps + more shards. Natural, physical feel. |
| **Color = purely aesthetic** | No game meaning – every block/shard color is just beautiful |
| **Block is a cluster of its pieces** | Player sees what's inside before breaking. Visual language is consistent. |
| **Drag & drop, not tap-select-tap** | More intuitive, direct manipulation |
| **No tap counter shown** | Player feels the block through wobble/drift/glow – more tactile |
| **Rattle accumulates (no spring-back)** | Stone rolls when hit – doesn't bounce back. More physical. |
| **Glow as two-pass render** | Pass 1: shadowBlur for halo. Pass 2: sharp shapes on top. Crisp edges + glow. |
| **Jackpot size (12 shards)** | Rare, worth it. More sorting = more reward. Visible from block size. |
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
- *Feb 21:* New direction: shape sorting, crystal flower, knack! as lab for "Blumen für Mutti".
- *Feb 21:* Hardness moved from color to size – feels more natural. Color is purely aesthetic.
- *Feb 21:* Block as piece-cluster: more interesting than a rectangle, communicates content visually.
- *Feb 21:* Drag & drop replaces tap-select-tap. Much more intuitive, immediately obvious.
- *Feb 21:* Crack lines removed – all attempts looked bad (asterisk pattern, straight lines). Replaced by wobble + rattle + drift + glow.
- *Feb 21:* Glow without sound/vibration feels noticeably gentler. Haptic + sound amplify visual feedback significantly – visuals alone carry more weight on silent devices.
- *Feb 21:* Two-pass glow render (blur pass + sharp pass) solves the "blurry shapes" problem. Halo outside, crisp fill inside.
- *Feb 21:* Crystal flower recipe settled: 1 Circle (center), 8 Hearts (overlapping petals), 1 Stem (curved), 2 Leaves. Bin capacity = recipe count.
