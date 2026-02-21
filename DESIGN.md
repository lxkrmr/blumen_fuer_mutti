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

Total: **12 parts** per flower.

The stem curves gently (not straight up). The right leaf sits slightly behind the stem, lower than the left.

**Color variation:** Each flower's parts carry the actual colors of the sorted shards. Bins are color queues – when a flower is built, the oldest shard colors are consumed. This makes every player's meadow unique.

**Data model:**
```javascript
// Bins: queues of colored shards
bins = {
  circle: [{ color: '#f0883e' }],
  heart:  [{ color: '#58a6ff' }, { color: '#bc8cff' }, ...],  // up to N*8
  stem:   [{ color: '#bc8cff' }],
  leaf:   [{ color: '#58a6ff' }, { color: '#f0883e' }],
}

// How many complete flowers can currently be built?
flowersReady = Math.min(
  bins.circle.length,
  Math.floor(bins.heart.length / 8),
  bins.stem.length,
  Math.floor(bins.leaf.length / 2)
)

// Building queue – flowers currently growing
building = [
  { id, startedAt, completesAt, parts: { circle, hearts[], stem, leaves[] } },
]

// Done – completed flowers, capped (exact max TBD, feel-based)
done = [ ...flower objects with fixed layout coords ... ]
```

**Build time:** `scale * BASE_MS` with a small random range for organic feel. Larger flowers take slightly longer. BASE_MS TBD (likely 20–40s range).

**Building trigger:** When `flowersReady > 0` and no flower is currently building → consume parts from bins → push to `building`. When `completesAt` passed → move to `done`.

**Bin visual – saturation indicator:**
Bin background fills with color based on how many multiples of the recipe are available. 0 = neutral/dark. 1× = subtle tint. 2× = more opacity. 3×+ = fully saturated. Shows abundance at a glance without numbers.

**Game screen indicator (top – replaces hex gem):**
Crystal glows and animates when a flower is currently building. Gray/inactive when `building` is empty. Shows at most a count if multiple are queued.

### Meadow / Zen screen – planned, separate feature

A dedicated start screen – the "zen garden". Shows the full meadow of finished flowers from the `done` array. Also displays the building indicator (same state as game screen, possibly more detail).

**Layout:**
- Flowers placed at random fixed `{ x, y, rotation, scale, zIndex }` assigned at creation – they never move after placed
- Flowers can extend beyond screen edges (natural meadow feel)
- Drawing order = sorted by `zIndex` (random) → natural depth, no strict foreground/background rule
- `scale` varies slightly → subtle depth illusion

**Max flowers:** TBD by feel – enough to make a lush meadow, not so many it becomes chaotic. Start testing around 20–30.

**Future home for:** tutorial, settings, other screens.

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
| Crystal flower | ❌ (next) – recipe + data model defined, sketch done |
| Bin saturation indicator | ❌ (next) |
| Building indicator (crystal → game screen) | ❌ (next) |
| Meadow / Zen screen | ❌ planned, separate feature |
| Sound | ❌ (out of scope for now) |

---

## Next steps

1. **Bins → color queues** – bins store colored shard objects instead of a count
2. **Building system** – `flowersReady` calculation, `building` queue, `done` array with cap
3. **Bin saturation indicator** – background tint scales with multiples of recipe
4. **Building indicator** – replace hex gem with crystal that glows when a flower is building
5. **Crystal flower render** – draw the actual flower (for done array + eventually zen screen)
6. **Meadow / Zen screen** – separate start screen, full meadow, building status *(separate feature)*
7. **Crack visuals** – damage feedback without lines *(later)*
8. **Feel tuning** – tap ranges, drift speed, glow intensity, shard sizes *(ongoing)*

---

## Open questions

- [x] How organic is the flower build? → Fixed structure, curved stem, overlapping petals
- [x] How many shards fill a bin? → Bin capacity = flower recipe (1/8/1/2)
- [x] Fixed color per shape vs. per-flower variation? → Per-flower (bins are color queues, cheap, more unique)
- [x] Meadow on same screen or separate? → Separate zen/start screen
- [x] Flower placement → random fixed coords, can go off-screen, random z-order
- [ ] Build time BASE_MS – needs a felt value (likely 20–40s, scale * base)
- [ ] Max flowers in `done` array – needs playtesting (~20–30 to start)
- [ ] Crack/damage visuals – how to communicate progress without lines?
- [ ] Does color → shape tendency add enough to be worth the complexity?
- [ ] **Shape-to-color mapping:** Each shape gets its own fixed color → block becomes multicolor. Potentially beautiful, more intuitive sorting. Needs a 4th color or one shared. Parked for later.

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
| **Per-flower color variation** | Bins are color queues → each flower gets the actual shard colors. Unique per player, cheap to store. |
| **Meadow as separate screen** | Sorting screen stays focused. Zen screen is the reward space + future home for tutorial/settings. |
| **Flowers get fixed coords at birth** | Placed once when done, never move. Stable, no layout recalculation. |
| **Build time = scale × BASE_MS** | Larger flowers feel more earned. Range adds organic feel. |

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
- *Feb 21:* Full system design: bins as color queues, building queue, done array with cap, meadow as separate zen/start screen. Per-flower color variation is free (600 strings max). Fixed coords at flower birth = stable meadow layout.
