# Blumen für Mutti – Design

Game idea, design decisions, and learnings. Living document – updated as the project evolves.

→ See also: [CLAUDE.md](CLAUDE.md) (AI rules) · [README](README.md) (public)

---

## Branding

| | |
|---|---|
| **Full name** | Blumen für Mutti |
| **Logo** | B♥M |
| **Short** | BfM |

---

## Backstory

Harry the cat knows his Mutti loves flowers made from building bricks. He can build them – somehow, only he knows how. **But** he's a cat, and as everyone knows, cats have no thumbs. So he can't open those stupid bags with the parts, and sorting them drives him crazy.

That's where the player comes in. **Our job:** open the bags, sort the parts. Harry builds the flowers and ties them into bouquets. Mutti gets flowers. Everyone's happy. 🐱

---

## Idea

A fidget game. A bag of parts appears – tap it open, sort the pieces by shape into bins. Harry builds Klemmbaustein flowers from the sorted parts. Flowers accumulate into a bouquet. Finish a bouquet → Mutti sends a heart.

**Inspiration:** Satisfying sorting videos (TikTok/YouTube). Montessori shape sorters. The good part of mobile sorting games – without the dark patterns.

**Core question:** Does it feel good? Is sorting satisfying enough to be a podcast companion?

---

## Core loop

```
Bag appears (size = how many parts inside)
        ↓
Tap repeatedly until it opens
(bag rattles, rotates, pieces drift apart, glow intensifies)
        ↓
Parts fly out – each has a SHAPE (circle, heart, stem, leaf) and matching color
        ↓
Drag part to matching bin
        ↓
Bins persist across rounds – next bag appears immediately
        ↓
Enough parts for a flower → Harry starts building (20–40s in background)
        ↓
Flower complete → added to bouquet (visible in indicator circle)
        ↓
Bouquet reaches 10 flowers → Mutti sends a heart (+1 ♥) → bouquet resets
```

---

## Design principles

- **No timer, no punishment** – wrong sort: gentle shake, try again
- **No reset between rounds** – bins stay filled, game flows continuously
- **Fidget-first** – low cognitive load, podcast-compatible
- **Haptic + visual feedback** – combined on Android, visual only on iOS/desktop
- **Discover, don't explain** – no tutorial needed (Harry explains later)

---

## Mechanics

### Bags (formerly: blocks)

The bag is not a rectangle – it's a **cluster of its own pieces**, overlapping and merged into an organic shape. The player can already see what shapes are inside before opening – including their colors.

Visually: a bag silhouette over the piece-cluster (future visual detail – mechanics unchanged).

| Property | Meaning |
|---|---|
| **Size** | How many parts inside – bigger = more taps + more shards |
| **Color** | Follows shape – each shape has its Pfingstrose color |

**Sizes:**
| Size | Taps | Shards | Feel |
|---|---|---|---|
| small | 1–2 | 3 | quick, easy |
| medium | 2–4 | 5 | comfortable |
| large | 4–7 | 7 | satisfying |
| jackpot | 7–12 | 12 | rare, worth it |

**Damage feedback:**
- **Wobble** – scale punch on each tap
- **Rattle** – rotates slightly, accumulates (never springs back)
- **Drift** – pieces slowly spread apart
- **Glow** – starts after first tap, pulses faster as damage increases

### Parts / Shapes

Sorting is by **shape**. Color follows shape – the same shape always has the same color family, making sorting intuitive. 4 shapes, each has its own bin.

| Shape | Description | Color |
|---|---|---|
| ◯ Circle | round | Creme `#fff176` ±variation |
| ♥ Heart | heart | Rosa – random from Pfingstrose pool |
| \| Stem | tall rounded rectangle, vertical | Mittelgrün `#52b788` ±variation |
| ❧ Leaf | pointed oval, horizontal | Dunkelgrün `#1e4d2b` ±variation |

**Shape spawn probability** matches the flower recipe ratios so supply meets demand:

| Shape | Recipe | Probability |
|---|---|---|
| Circle | 1 / 14 | 7.1% |
| Heart | 8 / 14 | 57.1% |
| Stem | 3 / 14 | 21.4% |
| Leaf | 2 / 14 | 14.3% |

### Flower (built by Harry)

**Recipe – one complete flower:**

| Shape | Flower part | Count |
|---|---|---|
| Circle | Bloom center | 1 |
| Heart | Petals (overlapping, full bloom) | 8 |
| Stem | Stem segments (3 visible kinks) | 3 |
| Leaf | Leaves on stem (one left, one right) | 2 |

Total: **14 parts** per flower.

**Pfingstrose color system:**

| Part | Color |
|---|---|
| Bloom center | Creme `#fff176` ±variation |
| Petals (8) | Each random from Pfingstrose pool (7 shades, `#fce4ec` → `#880e4f`) |
| Stem segments (3) | Mittelgrün `#52b788` ±variation |
| Leaves (2) | Dunkelgrün `#1e4d2b` ±variation |

**Build time:** `BASE_MS * (0.85–1.15)` random range. `BASE_MS = 20000ms`.

### Bouquet & Heart counter

Finished flowers accumulate in the **indicator circle** as a bouquet:

- All flowers share a common **anchor point** at `cy + 38` – blooms sit in upper portion of circle, stems visible below
- Each flower fans out with **±35° rotation** (70° total), evenly distributed
- Draw order: left to right → newest flower on top
- **Max 10 flowers** per bouquet

When the bouquet reaches **10 flowers:**
1. Mutti sends a heart → **+1 ♥**
2. Bouquet resets (flowers cleared)
3. Harry starts fresh with flower 1

**Badge:** Pill at the bottom of the indicator ring showing `♥ N  n / 10`. Overlaps ring slightly for a "badge attached to ring" look.

**Label below badge:** `Harry baut X Blumen …` while building, `teile sortieren …` when idle. Plain language, no symbols.

### Indicator circle

The single indicator at the top of the Mine screen. Radius 80px, centered at top of screen.

- **Glows / pulses** when Harry is building (`building` queue not empty)
- **Contains the bouquet** – flowers rendered with anchor at cy+38
- **Badge at ring bottom** – ♥ counter + bouquet progress (n/10)
- **Label below badge** – Harry's current activity in plain language

### Data model

```javascript
// Bins: queues of consumed parts (colors stored)
bins = {
  circle: [{ color: '...' }],
  heart:  [{ color: '...' }, ...],
  stem:   [{ color: '...' }],
  leaf:   [{ color: '...' }, { color: '...' }],
}

// Building queue – flowers currently growing
building = [
  { id, parts: { circle, heart[], stem[], leaf[] } },
]

// Bouquet – finished flowers, up to 10
bouquet = [ ...flower objects (max 10) ]

// Hearts earned from completed bouquets
hearts = 0
```

**Build queue:** Unlimited. All flowers that can be built are queued immediately. Harry builds them **sequentially**, one at a time. `building.length` shows how many are waiting.

**Bouquet trigger:** When flower completes → push to `bouquet`. If `bouquet.length >= 10` → hearts++ → bouquet = [].

### Screen

**One screen only: the Mine.**

| Area | Content |
|---|---|
| Top | Indicator circle (bouquet + glow + heart counter) |
| Middle | Current bag / piece cluster |
| Bottom | 4 bins |

---

## Current state

| What | Status |
|---|---|
| Bag appears (size = hardness + yield) | ✅ (visual: still looks like block cluster) |
| Bag is a cluster of its pieces (organic shape) | ✅ |
| Multi-tap open (N taps by size) | ✅ |
| Damage feedback: wobble + rattle + drift + glow | ✅ |
| Opens into parts with defined shapes | ✅ |
| Shape spawn probability weighted by recipe | ✅ |
| Drag & drop sorting by shape | ✅ |
| Wrong sort → snap back + shake | ✅ |
| 4 bins as color queues (recipe-based capacity) | ✅ |
| Bin saturation indicator (tint scales with multiples) | ✅ |
| Building system – sequential queue, unlimited depth | ✅ |
| Haptic feedback (Android) | ✅ |
| i18n (DE + EN) | ✅ |
| PWA (installable, offline) | ✅ |
| State persistence (localStorage) | ✅ |
| Flower render | ✅ |
| Blumen-Farbsystem (Pfingstrose) | ✅ |
| Shape-to-color mapping | ✅ |
| Rename & rebrand (BfM, Harry, B♥M logo) | ✅ |
| Garden screen removed | ✅ |
| Bouquet-in-circle (indicator redesign, R=80) | ✅ |
| Bouquet fan (±35°, anchor cy+38) | ✅ |
| Heart counter + badge (♥ N  n/10) | ✅ |
| "Harry baut X Blumen" label | ✅ |
| Bag visual (silhouette over cluster) | ❌ future |
| Harry (tutorial character) | ❌ future |

---

## Next steps

- **Feel tuning** – tap ranges, build time, shard sizes, fan spread *(ongoing)*
- **Bag visual** – silhouette over piece-cluster when tapping
- **Harry** – appears as tutorial character (help screen)

---

## Open questions

- [ ] Harry reactions to completed bouquets (future)
- [ ] Bag visual (silhouette, future)
- [ ] Max hearts – is there a cap, or does the counter just grow forever?
- [ ] Feel tuning – build time 20s right? Fan spread 70° right? Needs playtesting.

---

## Design decisions

| Decision | Rationale |
|---|---|
| **Sort by shape, not color** | Shape = sorting key. Color = visual hint. No extra cognitive load. |
| **Size = hardness + yield** | Bigger bag = more taps + more parts. Natural, physical feel. |
| **Color follows shape (Pfingstrose)** | Farbe verrät Form schon in der Tüte. Konsistentes Bild von Tüte über Teil bis Blume. |
| **Bag is a cluster of its pieces** | Player sees what's inside before opening. Visual language is consistent. |
| **Drag & drop, not tap-select-tap** | More intuitive, direct manipulation |
| **No tap counter shown** | Player feels the bag through wobble/drift/glow – more tactile |
| **Rattle accumulates (no spring-back)** | Feels physical – like shaking a real bag |
| **Glow as two-pass render** | Pass 1: shadowBlur for halo. Pass 2: sharp shapes on top. Crisp edges + glow. |
| **One screen only (Mine)** | Garden felt useless – sorting takes long enough that players rarely switched. Bouquet-in-circle keeps reward visible without context switch. |
| **Bouquet in indicator circle** | Reward visible at all times. Common anchor + rotation = natural bouquet shape. |
| **Bouquet reset at 10 → heart** | Cleaner loop than a growing-forever done-array. Hearts are the persistent score. |
| **B♥M logo** | Short, warm, the heart doubles as game symbol and reward icon. |
| **Bouquet anchor at cy+38** | Blooms in upper circle, stems visible below. Feels like a hand holding the bouquet. |
| **Fan spread ±35° (70° total)** | Enough spread to see individual flowers without losing the bouquet silhouette. |
| **Sequential build queue, unlimited depth** | Simpler than parallel building. More honest – shows true queue size. Harry is one cat. |
| **"Harry baut X Blumen" not "✦ X"** | Plain language beats symbols. Player shouldn't need to learn what ✦ means. |
| **Badge at ring bottom for hearts/progress** | Pill overlapping ring = compact, attached to the indicator. No extra screen space needed. |
| **Build time ±15% variance** | Organic feel. No two flowers take exactly the same time. |
| **Spawn probability = recipe ratio** | Supply matches demand. Hearts spawn most (57%) because 8 are needed. |
| **Persist `building` queue** | Parts are consumed when a build starts. Timer restarted on load. |

---

## Values

- **No dark patterns** – no manipulation, no fake urgency
- **Honest** – what you see is what you get
- **Simple** – as little as possible, as much as needed
- **Joyful** – if it's not fun, why bother?
- **Accessible** – colorblind-safe palette; before release: respect `prefers-reduced-motion`

---

## Blumen-Farbsystem – Pfingstrose

**Fix (kleine Variation via `varyColor()`):**

| Teil | Hex |
|---|---|
| Blatt | `#1e4d2b` ±10 |
| Stiel | `#52b788` ±12 |
| Blütenkopf | `#fff176` ±10 |

**Blütenblatt-Pool (8 Petals, zufällig gemischt):**

| Ton | Hex |
|---|---|
| Sehr hell | `#fce4ec` |
| Hell | `#f8bbd9` |
| Rosa | `#f48fb1` |
| Mittel | `#f06292` |
| Kräftig | `#e91e8c` |
| Dunkel | `#c2185b` |
| Sehr dunkel | `#880e4f` |

---

## Learnings

- *Feb 20:* Prototype v1 (knack!) built. Core loop works. Color sorting functional. Hexagon gem functional.
- *Feb 21:* New direction: shape sorting, crystal flower, knack! as lab for "Blumen für Mutti".
- *Feb 21:* Hardness moved from color to size – feels more natural. Color is purely aesthetic.
- *Feb 21:* Block as piece-cluster: more interesting than a rectangle, communicates content visually.
- *Feb 21:* Drag & drop replaces tap-select-tap. Much more intuitive, immediately obvious.
- *Feb 21:* Crack lines removed – all attempts looked bad. Replaced by wobble + rattle + drift + glow.
- *Feb 21:* Glow without sound/vibration feels noticeably gentler. Haptic + sound amplify visual feedback significantly.
- *Feb 21:* Two-pass glow render (blur pass + sharp pass) solves the "blurry shapes" problem.
- *Feb 21:* Crystal flower recipe settled: 1 Circle, 8 Hearts, 3 Stem, 2 Leaf = 14 parts total.
- *Feb 21:* Full system design: bins as queues, building queue, bouquet array, hearts as score.
- *Feb 21:* `ctx.beginPath()` vor jeder Shape-Path zwingend – fehlt es, akkumulieren sich alle Pfade.
- *Feb 21:* Canvas-Rotation: y zeigt nach unten → Blatt-Rotation war spiegelverkehrt.
- *Feb 21:* Stiel als `lineTo`-Segmente statt rotierter Rounded-Rects → garantiert verbunden.
- *Feb 21:* Flower-Ursprung am Stieluntergrund macht Row-Placement trivial.
- *Feb 21:* Opaker Basiskreis vor den Petals verhindert Durchscheinen von Hintergrundblumen.
- *Feb 21:* Shape-to-color als zentrales System: eine Funktion für Tüten, Teile und Blumen.
- *Feb 21:* Dead code konsequent entfernen: COLORS-Array, selectShard(), doppelte Farbzuweisung.
- *Feb 21:* Persistence via localStorage (bins, building, done) implemented.
- *Feb 21:* Garden screen removed – sorting takes long enough that players rarely switched screens. The reward (bouquet) stays visible in the indicator circle instead.
- *Feb 21:* knack! was the lab. BfM (Blumen für Mutti) is the real game. The lab has served its purpose.
- *Feb 21:* MAX_BUILDING=3 (parallel builds) was over-engineering from the start. Sequential queue is simpler, more honest, and narratively correct. One cat, one task.
- *Feb 21:* Cryptic symbols (✦) are worse than plain language. "Harry baut 3 Blumen" is immediately clear; "✦ 3" requires the player to learn the symbol.
- *Feb 21:* Bouquet anchor tuning is iterative – start too high/low, adjust by feel. cy+38 feels right: blooms in the upper half, stems visible as "hands holding the bouquet".
- *Feb 21:* Badge overlapping the ring bottom is a compact way to attach info to the circle without needing extra layout space.
