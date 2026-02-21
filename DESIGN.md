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
Block appears (size = hardness + yield, color = follows shape / Pfingstrose palette)
        ↓
Tap repeatedly until it breaks
(block rattles, rotates, pieces drift apart, glow intensifies)
        ↓
Shards fly out – each has a SHAPE (circle, heart, stem, leaf) and matching color
        ↓
Drag shard to matching bin
        ↓
Bins persist across rounds – next block appears immediately
        ↓
Enough parts for a flower → building starts automatically in background (20–40s)
        ↓
Flower complete → placed on the Garden with fixed random coords
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

The block is not a rectangle – it's a **cluster of its own pieces**, overlapping and merged into an organic shape. The player can already see what shapes are inside before breaking – including their colors.

| Property | Meaning |
|---|---|
| **Size** | Hardness + yield – bigger = more taps + more shards |
| **Color** | Follows shape – each shape has its Pfingstrose color (see below) |

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

A weighted random draw per piece ensures the right mix over time.

Sorting via **drag & drop** – drag shard directly to bin. Wrong bin: snap back + shake.

### Crystal flower (reward)

Built organically from sorted shapes.

![Flower reference sketch](flower-reference.png)

**Recipe – one complete flower:**

| Shape | Flower part | Count |
|---|---|---|
| Circle | Bloom center | 1 |
| Heart | Petals (overlapping, full bloom) | 8 |
| Stem | Stem segments (3 visible kinks) | 3 |
| Leaf | Leaves on stem (one left, one right) | 2 |

Total: **14 parts** per flower.

The stem curves gently (not straight up). The right leaf sits slightly behind the stem, lower than the left.

**Pfingstrose color system:**

| Part | Color |
|---|---|
| Bloom center | Creme `#fff176` ±variation |
| Petals (8) | Each random from Pfingstrose pool (7 shades, `#fce4ec` → `#880e4f`) |
| Stem segments (3) | Mittelgrün `#52b788` ±variation |
| Leaves (2) | Dunkelgrün `#1e4d2b` ±variation |

Colors are assigned fresh per flower via `shapeToColor()`. Every flower is unique (petal mix).

**Data model:**
```javascript
// Bins: queues of consumed shards (colors stored but not used for flower rendering)
bins = {
  circle: [{ color: '...' }],
  heart:  [{ color: '...' }, ...],  // up to N*8
  stem:   [{ color: '...' }],
  leaf:   [{ color: '...' }, { color: '...' }],
}

// How many complete flowers can currently be built?
flowersReady = Math.min(
  bins.circle.length,
  Math.floor(bins.heart.length / 8),
  Math.floor(bins.stem.length / 3),
  Math.floor(bins.leaf.length / 2)
)

// Building queue – flowers currently growing
building = [
  { id, startedAt, completesAt, parts: { circle, heart[], stem[], leaf[] } },
]

// Done – completed flowers, placed in the Garden
done = [ ...flower objects with fixed layout coords ... ]
```

**Build time:** `BASE_MS * (0.85–1.15)` random range for organic feel. `BASE_MS = 20000ms`.

**Building trigger:** When `flowersReady > 0` → consume shards from bins → push to `building` (max 3 simultaneous). When `completesAt` passed → move to `done`.

**Bin visual – saturation indicator:**
Bin background fills with color based on how many multiples of the recipe are available. 0 = neutral/dark. 1× = subtle tint. 2× = more opacity. 3×+ = fully saturated. Shows abundance at a glance without numbers.

**Game screen indicator (top):**
Ring glows and animates when a flower is currently building. Gray/inactive when `building` is empty.

### Screens

| Screen | Name | Description |
|---|---|---|
| Start / Zen | **Garden** | Meadow of finished flowers, building indicator, button to Mine |
| Game | **Mine** | Break blocks, sort shards into bins, building indicator (compact) |

Navigation: Garden → Mine via button. Mine → Garden via back button.

### Garden screen

Start screen. Shows all finished flowers from the `done` array.

**Navigation:**
- Garden → Mine: button at bottom
- Mine → Garden: back button top left

**Future home for:** tutorial, settings, other screens.

---

## Current state

| What | Status |
|---|---|
| Block appears (size = hardness + yield) | ✅ |
| Block is a cluster of its pieces (organic shape) | ✅ |
| Multi-tap break (N taps by size) | ✅ |
| Damage feedback: wobble + rattle + drift + glow | ✅ |
| Breaks into shards with defined shapes | ✅ |
| Shape spawn probability weighted by recipe | ✅ |
| Drag & drop sorting by shape | ✅ |
| Wrong sort → snap back + shake | ✅ |
| 4 bins as color queues (recipe-based capacity) | ✅ |
| Bin saturation indicator (tint scales with multiples) | ✅ |
| Building system (queue + done array) | ✅ |
| Building indicator (glowing ring) | ✅ |
| Haptic feedback (Android) | ✅ |
| i18n (DE + EN) | ✅ |
| PWA (installable, offline) | ✅ |
| Garden screen (navigation, indicator, mine button) | ✅ |
| Mine screen (back button, screen switching) | ✅ |
| Crystal flower render | ✅ |
| Garden screen – flower meadow render | ✅ |
| Blumen-Farbsystem (Pfingstrose) | ✅ |
| Shape-to-color mapping (Block mehrfarbig) | ✅ |
| Garden – Reihen-System mit Perspektive | ✅ |
| Garden – Wolkenhimmel als Start | ✅ (Feinschliff offen) |
| Garden – Wachstums-Animation | ❌ future |
| Sound | ❌ out of scope for now |

---

## Next steps (future / when ready)

- **Wolkenhimmel Feinschliff** – sieht noch komisch aus, braucht Überarbeitung
- **Wachstums-Animation** – neue Blume wächst von unten ins Bild (Stiel zuerst, dann Blüte)
- **Feel tuning** – tap ranges, drift speed, glow intensity, shard sizes *(ongoing)*
- **Max flowers** – DONE_MAX = 30 braucht playtesting

---

## Open questions

- [x] How organic is the flower build? → Fixed structure, curved stem, overlapping petals
- [x] How many shards fill a bin? → Bin capacity = flower recipe (1/8/3/2)
- [x] Shape-to-color: fixed per shape or random? → Fixed per shape (Pfingstrose palette). Color = intuitive sorting hint.
- [x] Garden screen separate from Mine? → Yes. Garden = start screen, Mine = game screen.
- [x] Flower placement → row-based perspective system (5 rows, front→back)
- [x] Stem recipe count → 3 (matches 3 visible segments in reference sketch)
- [x] Build time BASE_MS → 20s base, ±15% random variance
- [x] Crack/damage visuals → solved: wobble + rattle + drift + glow (no lines needed)
- [ ] Max flowers in `done` array – needs playtesting (DONE_MAX = 30 to start)

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

## Garden – Vision & Layout

### Perspektive

Wir sind nah am Feld und schauen hinein – nicht von außen drauf. Die Blumen füllen den gesamten Screen. Vorne riesig, hinten klein. Blumen dürfen über alle Kanten rausgehen (angeschnitten ist gewollt). Der dunkle Hintergrund schaut oben zwischen den Blumen durch – wie Himmel.

### Wolkenhimmel

**Gradient:**
- Oben (Zenith): `#0a0817` – fast schwarz, leichter Lila-Stich
- Unten (Horizont): `#2a1854` – warmes Sommerabend-Lila

**Wolken:** 5 Puffs, je 3–4 überlappende Kreise, weiß bei ~0.055 Opacity, feste hardcoded Positionen, obere 55% des Screens. Keine Animation. Braucht noch Feinschliff.

**Blenden:** Keine extra Logik. Blumen wachsen davor, verdecken den Himmel natürlich.

### Reihen-System

Koordinatenursprung Blume = Stieluntergrund. 5 Reihen von vorne nach hinten:

| Reihe | y-Range | Scale | Opacity |
|---|---|---|---|
| 0 (vorne) | 830–870 | 2.0–2.5 | 1.00 |
| 1 | 710–750 | 1.4–1.8 | 0.95 |
| 2 | 590–630 | 1.0–1.3 | 0.88 |
| 3 | 470–510 | 0.6–0.9 | 0.80 |
| 4 (hinten) | 340–380 | 0.3–0.55 | 0.70 |

x: −60 bis 490 (Blumen dürfen angeschnitten werden). zIndex = Reihe + 0–0.5 random.

### Wachstums-Animation (future)

Wenn eine neue Blume fertig ist, wächst sie von unten in den Frame – Stiel zuerst, dann Blüte.

---

## Design decisions

| Decision | Rationale |
|---|---|
| **Sort by shape, not color** | Shape = sorting key. Color = visual hint. No extra cognitive load. |
| **Size = hardness + yield** | Bigger block = more taps + more shards. Natural, physical feel. |
| **Color follows shape (Pfingstrose)** | Farbe verrät Form schon im Block. Konsistentes Bild von Block über Scherbe bis Blume. |
| **Block is a cluster of its pieces** | Player sees what's inside before breaking. Visual language is consistent. |
| **Drag & drop, not tap-select-tap** | More intuitive, direct manipulation |
| **No tap counter shown** | Player feels the block through wobble/drift/glow – more tactile |
| **Rattle accumulates (no spring-back)** | Stone rolls when hit – doesn't bounce back. More physical. |
| **Glow as two-pass render** | Pass 1: shadowBlur for halo. Pass 2: sharp shapes on top. Crisp edges + glow. |
| **Per-piece glow color** | Each piece glows in its own shape-color. Multi-color halo = more alive. |
| **Jackpot size (12 shards)** | Rare, worth it. More sorting = more reward. Visible from block size. |
| **knack! = lab only** | Learnings flow into "Blumen für Mutti", not into feature creep here |
| **Garden + Mine as two screens** | Mine stays focused on breaking/sorting. Garden is the reward space. |
| **Flowers get fixed coords at birth** | Placed once when done, never move. Stable, no layout recalculation. |
| **Build time ±15% variance** | Organic feel. No two flowers take exactly the same time. |
| **Spawn probability = recipe ratio** | Supply matches demand. Hearts spawn most (57%) because 8 are needed. No frustrating shortages. |
| **Row-based perspective** | 5 Reihen von vorne (groß) nach hinten (klein). Tiefenwirkung ohne 3D. |

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
- *Feb 21:* Crystal flower recipe settled: 1 Circle (center), 8 Hearts (overlapping petals), 3 Stem segments, 2 Leaves = 14 parts total.
- *Feb 21:* Full system design: bins as queues, building queue, done array with cap, meadow as separate zen/start screen. Fixed coords at flower birth = stable meadow layout.
- *Feb 21:* Garden + Mine screens implemented. Screen switching via state variable. Indicator shared, labels context-aware. Drag only active in Mine. Idle label on Garden invites action, not shows status.
- *Feb 21:* `ctx.beginPath()` vor jeder Shape-Path zwingend – fehlt es, akkumulieren sich alle Pfade und der letzte `fill()` übermalt alles mit einer Farbe. Klassischer Canvas-Bug.
- *Feb 21:* Canvas-Rotation: y zeigt nach unten → Blatt-Rotation war spiegelverkehrt.
- *Feb 21:* Stiel als `lineTo`-Segmente statt rotierter Rounded-Rects → garantiert verbunden, per-Segment-Farbe, sauberer Look.
- *Feb 21:* Flower-Ursprung am Stieluntergrund (`ctx.translate(0, -58)`) macht Row-Placement trivial: y = Bodenlinie, Blume wächst nach oben.
- *Feb 21:* Opaker Basiskreis vor den Petals verhindert Durchscheinen von Hintergrundblumen durch Petal-Lücken.
- *Feb 21:* Reihen-System: 5 Reihen mit scale + opacity von vorne nach hinten. zIndex = Reihen-Index + random → Tiefensortierung automatisch. x mit ±60px Bleed über Screenrand.
- *Feb 21:* Wolkenhimmel: Gradient `#0a0817` → `#2a1854` (Sommerabend-Lila). Wolken als statische Puff-Cluster. Keine Blende-Logik nötig – Blumen verdecken den Himmel natürlich.
- *Feb 21:* Shape-to-color: Farbe folgt Form (Pfingstrose-Palette). Block mehrfarbig – man sieht schon vor dem Brechen was drin ist. Konsistentes Bild von Block bis Blume.
- *Feb 21:* `shapeToColor()` als zentrales System: eine Funktion für Blocks, Scherben und Blumen. Kein Duplikat-Code. Fallbacks in `drawFlower` ebenfalls auf Pfingstrose-Farben gesetzt.
- *Feb 21:* Dead code konsequent entfernen: `COLORS`-Array, `selectShard()` (tap-select war durch drag-only ersetzt), doppelte Farbzuweisung in `startBuildingFlower()`.
