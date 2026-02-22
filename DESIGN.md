# Blumen für Mutti – Design

Game idea, design decisions, and learnings. Living document – updated as the project evolves.

→ See also: [CLAUDE.md](CLAUDE.md) (AI rules) · [README](README.md) (public)

---

## Ubiquitous Language

Shared vocabulary – used consistently in code, DESIGN.md, and conversation.

| Concept | EN | DE | Code |
|---|---|---|---|
| The thing the player opens | Pack | Pack | `pack` |
| What comes out of a Pack | Piece | Teil | `piece` |
| The sorting containers | Bin | Fach | `bin` |
| What Harry builds | Flower | Blume | `flower` |
| Harry's build queue | Build queue | Bauschleife | `buildQueue` |
| Finished flowers waiting for Mutti | Stock | Lager | `stock` |
| Currency | Coins | Münzen | `coins` |
| The seller | Mutti | Mutti | `mutti` |

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

A fidget game. A bag of parts appears – tap it open, sort the pieces by shape into bins. Harry builds Klemmbaustein flowers. Mutti sells them one by one and sends coins.

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
Flower complete → added to Lager (visible in Harry's indicator)
        ↓
Mutti takes flower from Lager → sell timer → +coins per flower
        ↓
Coins accumulate → spend in shop (upgrades)
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

The bag is an **opaque foil pouch** (metallic, dark – Option C visual). Contents are unknown until opened. Surprise is part of the fun – no dark pattern because only in-game coins are at stake and the economy never lets you lose.

| Property | Meaning |
|---|---|
| **Size** | Visual size of the bag – currently always small (upgrades will scale this) |
| **Parts** | 3 parts per bag currently (Tüten-Quantität upgrade increases this) |
| **Taps** | 5 taps to open baseline – Schere upgrade: Basic 3 taps, Profi 1 tap |

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

### Lager & Mutti

Harry builds flowers into the **Lager** (stock). Mutti sells them one by one, earning coins per flower.

**No bouquet concept.** Each flower sells individually. Faster feedback loop.

**Lager:** All flowers Harry has finished, waiting for Mutti. No maximum – they accumulate until Mutti sells them.

**Mutti sells sequentially:** one flower at a time. When she finishes, she takes the next from the Lager. She's idle when the Lager is empty.

**Sell time:** `SELL_BASE_MS * (0.85–1.15)` random range. `SELL_BASE_MS` TBD – shorter than Harry's build time feels right. Upgradeable via shop.

**Coins per flower:** `FLOWER_COIN_VALUE` (TBD, replaces per-bouquet value).

**Badge:** Pill at the bottom of the Harry indicator showing coin total only (`💰 1.250`). No progress counter.

**Labels:**
- Harry indicator: `Harry baut X Blumen …` / `teile sortieren …`
- Mutti indicator: `Mutti verkauft …` / hidden when idle

### Indicators

**One indicator, two rings (Option A – chosen):**

One circle at center top. Always visible.

- **Inner ring R=80 (Harry):** blue arc traces build progress. Glows and pulses while active.
- **Outer ring R=88 (Mutti):** gold arc traces sell progress. Track ring always visible (faint) to prevent layout jump. Gold arc lights up when she is selling.
- **Inside:** flower stock (Lager) – flowers fanning from anchor cy+38. Up to 7 flowers rendered, rest implied.
- **Badge:** pill at outer ring bottom – `💰 1.250` (coins only, no progress counter).
- **Labels below:** Harry's current activity. Mutti's label (`Mutti verkauft …`, gold) added below when selling or stock > 0.

*Option B (alternative, not built): single ring + gold fill from bottom. Calmer but less readable.*

### Data model

```javascript
// Bins: queues of consumed parts (colors stored)
bins = {
  circle: [{ color: '...' }],
  heart:  [{ color: '...' }, ...],
  stem:   [{ color: '...' }],
  leaf:   [{ color: '...' }, { color: '...' }],
}

// Harry's build queue – flowers currently growing (sequential)
building = [
  { id, parts: { circle, heart[], stem[], leaf[] } },
]

// Lager – finished flowers waiting for Mutti to sell
stock = [ ...flower objects ]

// Coins earned from Mutti's sales
coins = 0
```

**Build queue:** Unlimited depth. Harry builds sequentially. When a flower completes → pushed to `stock`.

**Mutti's sell queue:** Mutti takes one flower from `stock` at a time. Sell timer runs. On complete → `coins += FLOWER_COIN_VALUE`, next flower taken. Mutti is idle when `stock` is empty.

### Economy & Shop

**Currency:** Coins. Earned when Mutti sells a flower (per flower, not per bouquet).

**Economy principle:** Always net positive. The player can never go broke. Coins earned per flower always exceed the amortised bag cost. Upgrades increase the magnitude – early game: small profit per flower, late game: large profit per flower.

**Starting capital:** Player starts with enough coins to buy the first several bags without sorting a single flower. Bootstrap problem doesn't exist.

**Win condition:** Buy the alpaca farm 🦙. Price is absurdly high. Buying it ends the game happily – no bad game over exists.

**Shop:** Accessible via a shop icon on the Mine screen. Opens as an overlay. Shopkeeper: Harry with a mustache 🥸

---

#### Bags

Harry automatically orders the next surprise bag as soon as the play area is empty. Cost is deducted automatically. Player never has to manage ordering.

**Bag type: Surprise bag (standard)**
- Visually opaque (Option C – foil pouch). Contents unknown until opened.
- Randomly sized (small → jackpot), weighted toward small/medium early game.
- Cheap. Always affordable given the economy design.

No targeted/transparent bags in the base game – upgrades improve quantity and quality instead.

---

#### Upgrade categories

| Upgrade | Type | Effect |
|---|---|---|
| **Schere** (Basic / Pro / Profi) | Passive, permanent | Reduces taps to open a bag. Baseline: 5. Basic: 3. Profi: 1. Game flows faster. |
| **Tüten-Quantität** (Stufen) | Passive, permanent | More parts per bag → one bag fills more bin slots → fewer bags to open per flower cycle. |
| **Tüten-Qualität** (Stufen) | Passive, permanent | Higher coin value per flower + visual color shift of parts. All flowers sold from this point earn the new rate. |
| **Harry Snackies** | Consumable (counter) | Harry builds next X flowers at 2× speed. Counter decrements per flower started. |
| **Magnetischer Bin** | Passive, permanent | A bin attracts nearby matching parts automatically within radius X. Enabled by free placement mechanic. |
| **Sparschwein** | Passive, permanent | Idle interest – small coin trickle over time while not actively playing. |
| **Alpakafarm 🦙** | Goal / Win | Absurdly expensive. Buying it ends the game. |

**Progression arc:**
```
Early:  small bags  +  5 taps  +  low value   →  slow, satisfying grind
Mid:    medium bags +  3 taps  +  mid value   →  flowing
Late:   large bags  +  1 tap   +  high value  →  smooth, fast, everything flows
```

### Screen

**One screen only: the Mine.**

| Area | Content |
|---|---|
| Top | Indicator: two rings (Harry inner blue + Mutti outer gold), flower stock inside, coin badge |
| Middle | Current bag / piece cluster |
| Bottom | 4 bins + shop icon |

---

## Current state

| What | Status |
|---|---|
| Bag appears (always small for now, upgrades scale later) | ✅ |
| Multi-tap open (N taps by size) | ✅ |
| Damage feedback: wobble + rattle + drift + glow | ✅ |
| Opens into parts with defined shapes | ✅ |
| Shape spawn probability weighted by recipe | ✅ |
| Drag & drop sorting by shape | ✅ |
| Wrong sort → stays at drop position + shake | ✅ |
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
| Harry indicator (inner R=80 blue arc) + Mutti outer ring (R=88 gold arc) | ✅ |
| Coin badge (💰 N) at outer ring bottom | ✅ |
| "Harry baut X Blumen" + "Mutti verkauft …" labels | ✅ |
| Bag visual (opaque surprise bag, Option C) | ✅ |
| Bag counter (`🛍 N`) + reset button (`↺`) in header center – dev aids for economy calibration | ✅ |
| Bag economy (Harry auto-orders, starting capital, coin cost) | ❌ next |
| Shop skeleton (icon, overlay, Harry with mustache) | ❌ future |
| Upgrade: Schere (tap reduction) | ❌ future |
| Upgrade: Tüten-Quantität (more parts per bag) | ❌ future |
| Upgrade: Tüten-Qualität (higher flower value + visual shift) | ❌ future |
| Upgrade: Harry Snackies (build speed boost) | ❌ future |
| Upgrade: Magnetischer Bin | ❌ future |
| Upgrade: Sparschwein (idle interest) | ❌ future |
| Alpaka farm (win condition, happy end) | ❌ future |
| Harry (tutorial / shopkeeper character) | ❌ future |

---

## Next steps

1. **Bag economy** – starting capital, Harry auto-orders at coin cost, economy always net positive
2. **Feel tuning** – tap ranges, build time, sell time *(ongoing)*
3. **Shop skeleton** – icon, overlay, Harry-with-mustache placeholder
4. **First upgrades** – Schere (reduces tapsRequired), then Tüten-Quantität

---

## Open questions

- [ ] `FLOWER_COIN_VALUE` = 10 – needs playtesting to calibrate against bag cost
- [ ] `SELL_BASE_MS` = 8000ms – needs playtesting (shorter than build time feels right so far)
- [ ] Starting capital = 100 (placeholder) – real value after bag cost is defined
- [ ] Surprise bag cost – must be clearly less than coins earned per flower cycle (playtesting)
- [ ] Upgrade prices – need balancing once base economy loop is playable
- [ ] Alpaka farm price – absurdly high, exact number TBD
- [ ] Tüten-Qualität visual shift – which color palette for upgraded parts? (needs design pass)
- [ ] Sparschwein mechanic – idle interest rate TBD
- [ ] Magnetischer Bin radius and feel (future)
- [ ] Feel tuning – build time 20s right? Fan spread 70° right? Needs playtesting.

---

## Design decisions

| Decision | Rationale |
|---|---|
| **Sort by shape, not color** | Shape = sorting key. Color = visual hint. No extra cognitive load. |
| **Size = hardness + yield** | Bigger bag = more taps + more parts. Natural, physical feel. |
| **Color follows shape (Pfingstrose)** | Farbe verrät Form schon in der Tüte. Konsistentes Bild von Tüte über Teil bis Blume. |
| **Drag & drop, not tap-select-tap** | More intuitive, direct manipulation |
| **Free placement on drop** | Elements stay where dropped (no snap-back). Feels natural. Prerequisite for future "magnetic bin" upgrade. |
| **Drop position fixes sort flash** | Correct sort animates from drag.x/y, not targetX/Y – prevents 1-frame flash at origin. |
| **No tap counter shown** | Player feels the bag through wobble/drift/glow – more tactile |
| **Rattle accumulates (no spring-back)** | Feels physical – like shaking a real bag |
| **Glow as two-pass render** | Pass 1: shadowBlur for halo. Pass 2: sharp shapes on top. Crisp edges + glow. |
| **One screen only (Mine)** | Garden felt useless – sorting takes long enough that players rarely switched. Bouquet-in-circle keeps reward visible without context switch. |
| **Flower stock in Harry's indicator** | Lager visible at all times in the indicator. Shows how many flowers are waiting for Mutti. |
| **No bouquet, per-flower sales** | Cleaner loop. Hearts/bouquets were slow feedback. Per-flower coins are immediate and honest. |
| **B♥M logo** | Short, warm, the heart doubles as game symbol and reward icon. |
| **Flower anchor at cy+38 in indicator** | Blooms in upper circle, stems visible below. Feels like a hand holding the flowers. |
| **Fan spread ±35° (70° total)** | Enough spread to see individual flowers in the Lager without losing the overall shape. |
| **Sequential build queue, unlimited depth** | Simpler than parallel building. More honest – shows true queue size. Harry is one cat. |
| **"Harry baut X Blumen" not "✦ X"** | Plain language beats symbols. Player shouldn't need to learn what ✦ means. |
| **Badge at ring bottom for coins/progress** | Pill overlapping ring = compact, attached to the indicator. No extra screen space needed. |
| **Coins not hearts** | Hearts were confusing – already used in flower petals. Coins are unambiguous and fit the business theme. |
| **Alpaka farm as win condition** | Gives the game a clear endpoint and emotional goal. Absurd price = long idle progression without feeling like a grind. |
| **Harry speed bonus as counter not timer** | "Next X flowers at 2×" avoids timestamp complexity and feels more concrete than "2 minutes". |
| **Pack opening = Surprise bags only** | No targeted bags – upgrades improve the bag pool instead. Surprise feel without manipulation. |
| **Idle layer via Mutti upgrades** | Mutti handles the "away" progression (interest, better prices). Harry handles the "active" progression (faster builds). Clear separation of concerns. |
| **Per-flower sales, no bouquet** | Bouquet of 10 was too slow. Per-flower sales give faster feedback. Simpler state, shorter wait, more Mutti upgrades possible. |
| **Mutti as a separate actor with sell timer** | Creates a second progression axis. Mutti upgrades (sell speed, sell value) are now meaningful and distinct from Harry upgrades. |
| **Lager as stock between Harry and Mutti** | Decouples Harry's build pace from Mutti's sell pace. If Harry is fast, stock builds up – a visible queue the player can see. |
| **Outer ring always visible (faint track)** | Prevents layout jump when Mutti's arc lights up. The ring is always there – the gold arc is the reward signal, not the ring itself. |
| **Surprise bags only, no targeted bags** | Transparency comes from upgrades (you know what you paid for), not from bag contents. Simpler shop, cleaner progression. |
| **Bag visual: opaque foil pouch (Option C)** | Fits pack-opening feel. Mystery element without dark-pattern mechanics (in-game coins only, can't lose). |
| **Harry auto-orders bags, no manual trigger** | Removes friction from the core loop. Player never waits for a new bag – Harry just handles it. |
| **Starting capital solves bootstrap** | Player starts with enough coins. Economy is always self-sustaining by design – not by luck. |
| **Progression via 3 orthogonal axes** | Schere (open speed), Quantität (parts per bag), Qualität (value per flower). Each feels different, all compound. |
| **Qualität-Upgrade applies immediately** | No per-flower value tracking. All flowers sold after the upgrade earn the new rate. Clean and fair. |
| **Schere as passive permanent upgrade** | Tap reduction is a flow improvement, not a consumable. You buy it once and the game permanently feels better. |
| **Game ends happily with alpaca farm** | Clear win condition. No soft resets, no prestige loops (for now). The game has a destination. |
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
- *Feb 22:* Free placement (no snap-back) feels more natural and enables future magnetic bin mechanic. Snap-back was solving a problem that doesn't need solving. Emergent bonus: players can pre-sort by forming small piles before sorting into bins.
- *Feb 22:* Two-ring indicator (Option A): inner R=80 blue arc for Harry, outer R=88 gold arc for Mutti. Single center, no second circle. Option B (gold fill from bottom) noted as calmer alternative, not built.
- *Feb 22:* Outer track ring must always render to prevent layout jump. The "empty" faint ring is the stable shape; the gold arc appearing on top is the signal.
- *Feb 22:* Lager & Mutti: bouquet replaced by stock array + separate sell timer. Two indicators (Harry builds, Mutti sells). Faster feedback loop – coins per flower instead of per 10-flower bouquet.
- *Feb 22:* Simplified to one bag size (small). `SIZES` array and `PIECE_LAYOUTS` object removed – replaced with `BAG_PX`, `BAG_SHARDS`, `BAG_TAPS_MIN/MAX` constants. Upgrades will scale these later, possibly differently than the old size system.
- *Feb 22:* Foil bag replaces piece cluster. `drawFoilBag` drawn centered at (0,0) in transformed space – caller applies translate/rotate/scale, keeps concerns separated. Deformation via bezier curves on the bag path itself (not transforms) gives natural crumple feel.
- *Feb 22:* Sort flash caused by animating from targetX/Y instead of drag position. Fix: set targetX/Y = drag.x/y before switching to 'sorting' phase.
- *Feb 22:* Bin fill cycling was misleading – adding a 9th heart to an 8-slot bin looked like the bin emptied. Fill-bar now clamps at 100% and counter below (`n / recipe`) makes stock readable at a glance. Side effect: devs can now spot probability imbalances in real-time.
- *Feb 22:* Ubiquitous Language refactor: `block`→`pack`, `shard`→`piece`, `bin.shards`→`bin.pieces`, `flowers.building`→`flowers.buildQueue`, `trySortShard`→`trySortPiece`, `drawShards`→`drawPieces`. One pass, no functionality changed – code now matches domain language throughout.
- *Feb 22:* Hearts renamed to Coins. `toLocaleString('de-DE'/'en-US')` handles thousand separators cleanly per language. Gold `#e3b341` reads well on dark bg as currency color.
