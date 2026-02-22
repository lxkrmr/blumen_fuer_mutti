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

Mutti and the player share a dream: owning an alpaca farm. But alpaca farms are expensive. So the three of them – Mutti, Harry, and the player – decide to start a family business.

It turns out Klemmbaustein flower bouquets are in high demand. Nobody wants to assemble them themselves, but everyone wants to buy them. Harry learns to build the flowers. Mutti has great contacts and sells the finished bouquets. And someone has to do the unglamorous work – opening the bags, sorting the parts. That's us.

**Harry:** builds flowers (somehow, despite no thumbs – don't ask). Loves snacks.
**Mutti:** sells bouquets, has business instincts, can be upgraded.
**Player:** opens bags, sorts parts. The unsung hero.

The family saves up coins until they can finally afford the alpaca farm. That's the win condition.

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
Enough parts for a flower → Harry starts building (20–40s, sequential queue)
        ↓
Flower complete → added to bouquet (visible in indicator circle)
        ↓
Bouquet reaches 10 flowers → Mutti sells it → +coins → bouquet resets
        ↓
Coins accumulate → spend in shop (upgrades, special bags)
        ↓
Enough coins → buy the alpaca farm → 🦙 win
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

### Bouquet & Coin counter

Finished flowers accumulate in the **indicator circle** as a bouquet:

- All flowers share a common **anchor point** at `cy + 38` – blooms sit in upper portion of circle, stems visible below
- Each flower fans out with **±35° rotation** (70° total), evenly distributed
- Draw order: left to right → newest flower on top
- **Max 10 flowers** per bouquet

When the bouquet reaches **10 flowers:**
1. Mutti sells it → **+100 coins** (base value, upgradeable via shop)
2. Bouquet resets (flowers cleared)
3. Harry starts fresh with flower 1

**Badge:** Pill at the bottom of the indicator ring showing coin total + bouquet progress (`💰 1.250  n / 10`). Overlaps ring slightly for a "badge attached to ring" look.

**Label below badge:** `Harry baut X Blumen …` while building, `teile sortieren …` when idle. Plain language, no symbols.

### Indicator circle

The single indicator at the top of the Mine screen. Radius 80px, centered at top of screen.

- **Glows / pulses** when Harry is building (`building` queue not empty)
- **Contains the bouquet** – flowers rendered with anchor at cy+38
- **Badge at ring bottom** – coin counter + bouquet progress (n/10)
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

### Economy & Shop

**Currency:** Coins. Earned when Mutti sells a completed bouquet.

**Base value:** TBD – needs playtesting against alpaca farm price.

**Win condition:** Buy the alpaca farm. Price is absurdly high (think: 1 trillion coins) to make the idle progression feel meaningful.

**Shop:** Accessible via a shop icon on the Mine screen. Opens as an overlay. Shopkeeper: Harry with a mustache 🥸

**Upgrade categories:**

| Category | Example | Effect |
|---|---|---|
| **Harry upgrades** | Snackies | Harry builds the next X flowers at 2× speed. X consumed per flower, no timestamps. |
| **Mutti upgrades** | Schulung | Sell bouquets for more coins (permanent multiplier) |
| | Schrumpf-flation | Smaller bouquet (8 flowers?) for nearly the same price |
| | Sparschwein | Idle interest – coins slowly accumulate over time |
| **Special bags** | Herz-Packung | Next bag contains only heart-shaped parts |
| | Große Packung | More parts per bag, better value than small bags |
| **Goal** | Alpakafarm 🦙 | Win condition. Absurdly expensive. |

**Harry speed bonus (Snackies):**
- Bought in the shop as "X snackies"
- Each snacky consumed when Harry starts a flower: build time halved
- No timer, no timestamps – just a counter that decrements
- Shows remaining snackies somewhere near the indicator

**Special bags:**
- Bought in shop, queued as the next bag to open
- Player still taps to open and sorts – same mechanic, guaranteed contents
- Small bags cheaper, large bags more bang for buck

### Screen

**One screen only: the Mine.**

| Area | Content |
|---|---|
| Top | Indicator circle (bouquet + glow + coin/progress badge) |
| Middle | Current bag / piece cluster |
| Bottom | 4 bins + shop icon |

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
| Bin fill bar (fills once, stays full) + counter below (n/recipe) | ✅ |
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
| Coin counter + badge (💰 N  n/10) | ✅ |
| "Harry baut X Blumen" label | ✅ |
| Shop (overlay, Harry with mustache) | ❌ future |
| Harry speed bonus (Snackies) | ❌ future |
| Mutti upgrades (Schulung, Schrumpf-flation, Sparschwein) | ❌ future |
| Special bags (shop-bought, guaranteed parts) | ❌ future |
| Alpaka farm (win condition) | ❌ future |
| Bag visual (silhouette over cluster) | ❌ future |
| Harry (tutorial / shopkeeper character) | ❌ future |

---

## Next steps

1. **Feel tuning** – tap ranges, build time, fan spread *(ongoing)*
2. **Shop skeleton** – icon, overlay, Harry-with-mustache placeholder
3. **First shop item** – probably Harry Snackies (simplest mechanic, big fun)

---

## Open questions

- [ ] Base coin value per bouquet – needs playtesting against farm price
- [ ] Alpaka farm price – absurdly high, exact number TBD (1 trillion placeholder)
- [ ] Shop upgrade prices – need balancing once base loop is playable
- [ ] Sparschwein mechanic – time-based interest rate, how much per interval?
- [ ] Harry reactions to completed bouquets (future)
- [ ] Bag visual (silhouette, future)
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
| **Badge at ring bottom for coins/progress** | Pill overlapping ring = compact, attached to the indicator. No extra screen space needed. |
| **Coins not hearts** | Hearts were confusing – already used in flower petals. Coins are unambiguous and fit the business theme. |
| **Alpaka farm as win condition** | Gives the game a clear endpoint and emotional goal. Absurd price = long idle progression without feeling like a grind. |
| **Harry speed bonus as counter not timer** | "Next X flowers at 2×" avoids timestamp complexity and feels more concrete than "2 minutes". |
| **Special bags = same mechanic, different contents** | Player still opens and sorts. No new mechanics to learn. Reward is time savings, not different gameplay. |
| **Idle layer via Mutti upgrades** | Mutti handles the "away" progression (interest, better prices). Harry handles the "active" progression (faster builds). Clear separation of concerns. |
| **Bin counter `n / recipe` instead of cycling fill** | Cycling fill looked like the bin emptied when overfull. Counter makes stock immediately readable: 0/8 → 8/8 → 9/8. Fill bar now clamps at full and stays there. |
| **💰 money bag, not 🪙 coin** | Money bag fits the business theme better visually. Coin felt too flat at small badge size. |
| **Coin color `#e3b341`** | GitHub Dark's warning yellow – warm gold, readable on dark bg, unambiguous as currency. |
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
- *Feb 22:* Bin fill cycling was misleading – adding a 9th heart to an 8-slot bin looked like the bin emptied. Fill-bar now clamps at 100% and counter below (`n / recipe`) makes stock readable at a glance. Side effect: devs can now spot probability imbalances in real-time.
- *Feb 22:* Hearts renamed to Coins. `toLocaleString('de-DE'/'en-US')` handles thousand separators cleanly per language. Gold `#e3b341` reads well on dark bg as currency color.
