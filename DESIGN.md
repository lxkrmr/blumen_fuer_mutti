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
| Mutti's car | Bobby | Bobby | `bobby` |

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

## Philosophy

**BfM is an interactive book, not a service game.**

The game has a beginning, a middle, and an end. It accompanies you for a while – then it says goodbye. Anyone who wants to experience it again can start over. No daily logins, no FOMO, no manipulation. The game respects that the player has a life.

**Core principle: Action-gated, never time-gated.**

Progress comes from actions (opening packs, selling flowers, buying upgrades), never from time passing. A player who takes a week off is not at a disadvantage. The game waits. Always.

**BfM is a fidget tool with a progress layer.**

The basis: a simple motor task with low cognitive load keeps the Default Mode Network – the brain's "mind-wandering mode" – occupied without competing with listening. Doodling research (Andrade, 2009) shows +29% recall during listening when paired with a simple hand task. Sorting as interactive fidgeting.

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
buildQueue = [
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

**Shop:** Accessible via a shop icon on the main game screen. Opens as a separate screen. Shopkeeper: Harry with a mustache 🥸

#### Economy calibration

Measured playtest session (Feb 23, relaxed pace):

| Metric | Value |
|---|---|
| Packs opened | 50 |
| Time | 5:08 min (~5.13 min) |
| Flowers built | 8 |
| **Packs per minute** | **~9.7** |
| **Packs per flower** | **~6.25** (theoretical min: 14/3 = 4.67 – ~34% waste from probability variance) |
| **Flowers per minute** | **~1.56** |

Derived at `BAG_COST = 1`, `FLOWER_COIN_VALUE = 10`:

| | Per 5 min session |
|---|---|
| Coins spent on packs | 50 × 1 = **50** |
| Coins earned from flowers | 8 × 10 = **80** |
| Net profit | **+30 coins (~5.8/min)** |

Economy verdict: **net positive by design** ✓. Pack cost never exceeds flower yield.
`STARTING_COINS = 50` covers ~50 packs – enough for the full bootstrap period before the first flowers arrive.

The shop is a **linear skill tree** – upgrades unlock sequentially. The player always sees what comes next. Early upgrades are cheap and feel like gifts. Later upgrades are expensive but plannable. Each upgrade has flavor text: a small story beat in the game world, a reason to smile.

---

#### Bags

Harry automatically orders the next surprise bag as soon as the play area is empty. Cost is deducted automatically. Player never has to manage ordering.

**Bag type: Surprise bag (standard)**
- Visually opaque (Option C – foil pouch). Contents unknown until opened.
- Randomly sized (small → jackpot), weighted toward small/medium early game.
- Cheap. Always affordable given the economy design.

No targeted/transparent bags in the base game – upgrades improve quantity and quality instead.

---

#### Upgrade structure

Three actors, three upgrades each. Interlaced in a single linear skill tree. All upgrades are **passive and permanent** – buy once, improved forever. Early upgrades feel like gifts. The farm arc begins after all 9 upgrades.

---

#### Full progression order

**Block 1 – Getting started**

| # | Actor | Upgrade | Effect |
|---|---|---|---|
| 1 | Player | **Schere** | Fewer taps to open a pack. Baseline: 5 → 1. One tier. |
| 2 | Harry | **Gummi-Daumen** | Harry builds faster. *Cats don't rule the world only because they lack thumbs. Problem solved.* |
| 3 | Mutti | **Großhändler** | Bigger packs – more parts, more bang per buck. *A wholesaler noticed you. Harry is nervous around contracts.* |

→ **Milestone 1: Land kaufen (auf Kredit) 🌍**
Player chooses: Berge or Meer. This choice determines Bobby-Zuwachs later.
**Bruno beschließt einzuziehen.** He wasn't bought – he chose the family. He senses a good home.

---

**Block 2 – Building momentum**

| # | Actor | Upgrade | Effect |
|---|---|---|---|
| 4 | Player | **Staubsauger** | Bins attract nearby parts. Not fully automatic – just pull. |
| 5 | Harry | **Harry goes TikTok** | Coin value per flower increases. *1k followers. Comments ask about his supplement stack. He has none.* |
| 6 | Mutti | **Bobby-Tuning** | Heck-Spoiler + Rallye-Streifen in one. Bobby delivers significantly faster. *The stripes make it faster. Everyone knows this.* |

→ **Milestone 2: Haus kaufen (auf Kredit) 🏡**
Player chooses: romantic or modern. Cosmetic – taste and replayability.
**Hildegard zieht ein.** She already acts like she owns the place.

---

**Block 3 – Full speed**

| # | Actor | Upgrade | Effect |
|---|---|---|---|
| 7 | Player | **Dino-Sparschwein** | Horizontally rotating dino piggy bank (Brainrot reference). Per flower sold, a share goes in. After X payments → absurdly high interest payout. *It spins. Nobody understands why it yields so much. Brainrot.* |
| 8 | Harry | **Harry's eigenes Label** | Coin value per flower increases further. *Who needs a brand deal when you are the brand.* |
| 9 | Mutti | **Bobby-Zuwachs** | Second vehicle, determined by land choice. Berge → Unimog. Meer → Speedboat. Maximum delivery speed. |

→ **Finale: Schlüssel zum Herzen 🔑**
The credits are paid off. The land, the house – it all belongs to the three of them now.
**Theodor zieht ein.** He gives the closing speech. He is very happy. He eyes the flower garden.
Closing screen. The game says goodbye. The player can start over.

---

**Progression arc – exponential, not additive:**

Each block multiplies what was already there. Upgrades hit different axes (pack speed, build speed, coin value, sell speed) – the compound of `a × b × c` is what creates the exponential feel, not any single upgrade.

```
Block 1:  ~6 coins/min    "nice, this helps"
Block 2:  ~40 coins/min   "wait, this is getting fast"
Block 3:  ~200 coins/min  "I can barely keep up"
```

*(Exact values need calibration after bag economy is implemented. The ratios matter more than the absolutes.)*

**The credit framing amplifies the arc emotionally:**
- Block 1: coins flow but you *owe* something → tension
- Block 2: flow accelerates, second debt → brief tension, then relief  
- Block 3: explosion of coins → debts paid → catharsis

**The Dino-Sparschwein is the exponential wildcard.** Players who have played a lot have paid in a lot. The absurd interest rate then catapults the coin pile at exactly the right moment.

### Alpaka farm – Win condition

The farm unfolds across the full game as three milestones and a finale. It is not a single purchase – the family buys on credit and works toward paying it off.

**Milestone 1: Land kaufen (auf Kredit) 🌍** *(after upgrade 3)*

Player chooses the land. This is personal and has a late gameplay consequence.

| Option | Late consequence (Bobby-Zuwachs, upgrade 9) |
|---|---|
| 🏔 Berge | Unimog |
| 🌊 Meer | Speedboat |

Bruno decides to move in. He wasn't bought – he chose the family.

**Milestone 2: Haus kaufen (auf Kredit) 🏡** *(after upgrade 6)*

Player chooses the house. Romantic or modern. Purely cosmetic – taste and replayability.
Hildegard moves in. She already acts like she owns the place.

**Upgrade 9: Bobby-Zuwachs 🚗**

The second vehicle arrives. Determined by Milestone 1 land choice.

**Finale: Schlüssel zum Herzen 🔑** *(after upgrade 9)*

The credits are paid off. Everything belongs to the three of them.
Theodor moves in and gives the closing speech. He is very happy. He eyes the flower garden.
Closing screen. The game says goodbye.

---

### Alpacas

Three alpacas, three story milestones. Each unlocks individually with a Bruno-format intro card.

| # | Name | Personality | Intro (DE, in-game text) |
|---|---|---|---|
| 1 | **Bruno** | Philosopher. Does nothing. Inspires everyone. | *Das ist Bruno. Bruno grast den ganzen Tag und denkt über nichts nach. Harry beneidet ihn.* |
| 2 | **Hildegard** | Runs the place. Doesn't know Mutti also thinks she runs the place. | *Das ist Hildegard. Hildegard ist die Chefin. Mutti auch, aber das weiß Hildegard nicht.* |
| 3 | **Theodor** | Has eaten a flower once. Regrets nothing. Eyeing the next one. | *Das ist Theodor. Theodor hat einmal eine Blume gefressen. Er bereut nichts. Er schaut schon zur nächsten.* |

*Alpaca intro text is in-game content (i18n DE+EN), not documentation.*

---

### Intro sequence

Shown on first launch and after reset (no save state exists). Harry introduces the business idea and the roles.

**Trigger:** `currentScreen = 'intro'` when `localStorage` has no save data.

**Navigation:** Tap anywhere to advance. Skip button top right jumps straight to the game.

**Format:** One line per slide (Bruno format). Harry avatar + text, centered. Progress dots at bottom.

**Slides (DE · EN):**

| # | DE | EN |
|---|---|---|
| 1 | Ihr seid also zusammen. Harry beobachtet das. | So you're together. Harry is watching. |
| 2 | Andauernd: „Wenn wir auf der Alpaka-Farm leben …" Wo Alpaka-Farm? Wo? | Always: "When we live on the alpaca farm …" Where alpaca farm? Where? |
| 3 | Jemand muss handeln. Ich bin dieser Jemand. | Someone must act. I am that someone. |
| 4 | Die Blumen. Ihr habt euch gefreut. Das ist die Idee. | The flowers. You were both so happy. That's the idea. |
| 5 | Du sortierst. Ich baue. Mutti verkauft. Familiengeschäft. | You sort. I build. Mutti sells. Family business. |
| 6 | Hier ist dein erstes Pack. Von mir. Alle Teile für eine Blume. | Here is your first pack. From me. Every part for one flower. |

**After last tap:** Harry Pack spawns. Game begins.

**Harry Pack:** Special first pack. Contains exactly the parts for one complete flower: 1 Circle, 8 Hearts, 3 Stems, 2 Leaves. No coin deduction. Implemented as `spawnHarryPack()`.

---

### Screen

**Three screens: intro · game · shop.**

| Screen | Content |
|---|---|
| **Intro screen** | Harry's onboarding slides · tap to advance · skip button top right |
| **Game screen** | Indicator (top) · shop icon (top right, same height as indicator center) · current pack / pieces (middle) · 4 bins (bottom) |
| **Shop screen** | Linear upgrade tree · 9 upgrades · locked items show ??? · "Spiel den selben Song nochmal" reset at bottom |

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
| Pack counter (mini pack icon + N) + flower sold counter (🌸 N) in header center | ✅ |
| Pack economy (Harry auto-orders, starting capital, coin cost) | ✅ |
| Shop screen (icon → own screen, linear skill tree, locked items show ???) | ✅ |
| Shop icon top right (next to indicator, same vertical center) | ✅ |
| Reset as "Spiel den selben Song nochmal" (👽🎷) at shop bottom – red confirmation line, whole item tappable | ✅ |
| Intro sequence (Harry · 6 slides · skip button · Harry Pack) | ✅ |
| Harry Pack – warm rose visual, 🐱 on pack, mini preview on last intro slide | ✅ |
| Purchased upgrades show name + description (not just "Gekauft ✓") | ✅ |
| `'mine'` → `'main'` screen name (UL cleanup) | ✅ |
| Upgrade 1 – Player: Schere | ❌ future |
| Upgrade 2 – Harry: Gummi-Daumen | ❌ future |
| Upgrade 3 – Mutti: Großhändler | ❌ future |
| Milestone 1: Land kaufen (auf Kredit) + Bruno zieht ein | ❌ future |
| Upgrade 4 – Player: Staubsauger | ❌ future |
| Upgrade 5 – Harry: Harry goes TikTok | ❌ future |
| Upgrade 6 – Mutti: Bobby-Tuning | ❌ future |
| Milestone 2: Haus kaufen (auf Kredit) + Hildegard zieht ein | ❌ future |
| Upgrade 7 – Player: Dino-Sparschwein (horizontal rotating) | ❌ future |
| Upgrade 8 – Harry: Harry's eigenes Label | ❌ future |
| Upgrade 9 – Mutti: Bobby-Zuwachs (Unimog or Speedboat) | ❌ future |
| Finale: Schlüssel zum Herzen + Theodor zieht ein + closing screen | ❌ future |

---

## Next steps

1. **Feel tuning** – tap ranges, build time, sell time, upgrade prices *(ongoing)*
2. **Milestone screens** – Land kaufen (Berge/Meer choice), Haus wählen, Bruno intro card
3. **Dino-Sparschwein visual** – horizontally rotating dino animation in shop + coin badge

---

## Open questions

- [ ] `FLOWER_COIN_VALUE` = 10 – needs playtesting to calibrate against bag cost
- [ ] `SELL_BASE_MS` = 8000ms – needs playtesting (shorter than build time feels right so far)
- [ ] Starting capital = 100 (placeholder) – real value after bag cost is defined
- [ ] Surprise bag cost – must be clearly less than coins earned per flower cycle (playtesting)
- [ ] Upgrade prices and order in skill tree – need balancing once base economy loop is playable
- [ ] Dino-Sparschwein: what % per flower goes into the piggy bank? After how many payments → interest? How much interest?
- [ ] Staubsauger: what radius feels right? How strong is the pull?
- [ ] Großhändler: how many parts per big pack? How much more expensive vs. standard pack?
- [ ] Alpaca farm phase prices – all 5 phases TBD (after economy calibration)
- [x] Alpaca names and personalities – Bruno, Hildegard, Theodor ✓
- [ ] Harry's eigenes Label flavor text – final wording TBD
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
| **Two screens: game + shop** | Garden screen removed – sorting takes long enough that players rarely switched. Bouquet-in-circle keeps reward visible. Shop is a separate screen, not an overlay – cleaner separation. |
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
| **Persist `buildQueue`** | Parts are consumed when a build starts. Timer restarted on load. |
| **BfM as interactive book** | Not a service game. Clear beginning, middle, end. Says goodbye gracefully. Player can restart if they want. The game respects the player's life. |
| **Action-gated, never time-gated** | Progress only through actions. A week away = no disadvantage. No daily login pressure. |
| **Shop as linear skill tree** | Upgrades = buyable achievements. Next item always visible. Early upgrades are cheap and feel like gifts. |
| **Sparschwein action-gated** | Fixed share per flower sold goes into the piggy bank → after X payments, interest payout. No time ticker. Only fills when playing. |
| **Upgrade flavor text as story beat** | Each upgrade has one sentence that comments on the game world. No tutorial, no explaining – just a smile. |
| **Hype-Train dropped in favour of Harry goes TikTok** | A consumable counter felt like a separate system without narrative. Harry goes TikTok tells the same story (demand up = better prices) permanently, with better flavour. |
| **Alpaka farm in 4 phases** | Instead of one big price: Land → House → Animals → Move in. Four emotional milestones. Progress feels tangible. |
| **Land choice with charming effect** | Forest / Lake / Sea / Mountains – each option has a small gameplay bonus. Encourages replayability and emotional attachment. |
| **Alpacas with names and Bruno format** | Each alpaca unlocks individually with a name and personality in the TikTok Bruno format. Micro-storytelling without explanation. |
| **Three actors, three upgrades each** | Player / Harry / Mutti each get exactly 3 upgrades. Clean, symmetrical, easy to communicate. |
| **Staubsauger not Magnetischer Bin** | Staubsauger is funnier, more domestic, more Mutti-world. Same mechanic, much better name. |
| **Harry goes TikTok replaces Tüten-Qualität and Hype-Train** | One narrative arc instead of two abstract systems. Coin value increase is the same mechanic – the storytelling is better. Wink at supplement influencer culture. |
| **Bobby is a named character** | Mutti's car has a name. Bobby. This makes upgrade flavor text ("the stripes make it faster") land better. |
| **Bobby-Zuwachs as farm phase, not shop upgrade** | The second vehicle is a consequence of the land choice. Connecting early decision to late reward makes the world feel coherent. |
| **Land choice: Berge or Meer only** | Two clear options, each with a distinct personality and a different Bobby-Zuwachs. Simpler than four options, more replayable. |
| **Dino-Sparschwein as player upgrade** | Brainrot aesthetic fits the TikTok/meme tone. Horizontally rotating dino = recognisable, silly, warm. Belongs to the player not Harry or Mutti. Absurdly high interest rate is the joke. |
| **Farm bought on credit, not saved up** | More realistic and more emotionally satisfying. The goal shifts from "accumulate X" to "pay off what we dared to dream". The finale is debt freedom, not purchase. |
| **Alpacas choose the family, not the other way around** | The family doesn't buy the alpacas – Bruno, Hildegard, Theodor each decide to move in because they sense a good home. Warmer, less transactional. Mirrors how it actually feels with animals. |
| **One alpaca per milestone** | Bruno at land purchase, Hildegard at house purchase, Theodor at finale. Each milestone has an animal witness. Theodor gives the closing speech. |
| **Bobby-Tuning combines spoiler + stripes** | Two separate upgrades felt like padding. Combined as one with better flavor: the stripes make it faster. Everyone knows this. |
| **Land choice (Milestone 1) has consequence at Upgrade 9** | Early decision, late reward. Berge → Unimog, Meer → Speedboat. Player might not realise the connection on first playthrough. Discoverable on replay. |
| **Exponential growth, not additive** | Upgrades hit different axes (pack speed, build speed, coin value, sell speed). Compound of a × b × c creates exponential feel. Each block should feel qualitatively faster than the last – not just a little better. Target: ~6 → ~40 → ~200 coins/min across the three blocks. |
| **Credit framing creates emotional arc** | Early: flow but debt = tension. Mid: faster flow + second debt = tension/relief. Late: coin explosion + debts paid = catharsis. The "auf Kredit" mechanic turns economy into drama. |
| **Reset as shop item, not header button** | The ↺ dev button felt out of place in the UI. Reframed as "Spiel den selben Song nochmal" (Family Guy / Cantina Band reference) at the bottom of the shop – honest, funny, and in the right place. |
| **Red confirmation line instead of button** | A separate "Neu starten" button overlapped the description and added visual noise. A red question ("Du willst wirklich das Spiel neu starten?") as part of the item is cleaner – the whole item is the tap target. Red is appropriate here: destructive action, not game feedback or sorting. |
| **Shop icon next to indicator, not next to bins** | The bins area is already dense. The indicator area has unused space to the right. Shop icon at same vertical center as the indicator feels visually anchored and leaves the bins uncluttered. |
| **Mini pack icon as canvas drawing, not emoji** | 🛍 is used for the shop button – using it also in the header created symbol collision. A tiny canvas-drawn pack (same gradient + heat seal as the full pack) is consistent and unambiguous. |
| **Header shows packs opened + flowers sold** | Regular game UI, not a dev tool. `packsOpened` shows how much you've done; `flowersSold` shows what Mutti has achieved. Together they tell the session story at a glance. |
| **`spawnPack(charge)` separates spawn from payment** | Boot needs a pack but shouldn't charge – it's a continuation of the last session. Auto-order charges because it's a new purchase. A `charge = true` default parameter keeps the distinction explicit without duplicating the function. |
| **Harry Pack as special first pack** | Warm rose gradient, pink glow, 🐱 on the face. Distinct from all other packs. The visual difference signals "this is a gift" before the player even opens it. |
| **Mini Harry Pack on last intro slide** | Shows the player what's coming before they tap. The pack already pulses on the slide – the transition into the game feels like a continuation, not a jump. |
| **Purchased upgrades show full text** | The flavor text is part of the game's personality. Hiding it after purchase would lose the story. Dimmed but readable – you bought it, you can still enjoy what it says. |
| **`'mine'` → `'main'`** | `'mine'` was a knack! leftover with no meaning in BfM. `'main'` is neutral and correct. UL stays clean. |
| **Harry introduces the game, not a UI tutorial** | No tooltips, no arrows, no highlights. Harry tells the story and hands over the first pack. The player learns by doing – one complete flower's worth of parts, all shapes present. |
| **Harry Pack as tutorial vehicle** | Exactly 14 parts (1+8+3+2) = one complete flower. Player sees all four shapes in one session, Harry builds immediately after, Mutti starts selling. The full loop plays out before the second pack arrives. |
| **Skip button for returning players** | After a reset, the player knows the game. Forcing the intro again would feel patronising. Skip respects their time. |

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
- *Feb 22:* Hearts renamed to Coins.
- *Feb 22:* UL refactor pitfall: renaming a JS property requires updating both the *definition site* (`const flowers = { building: [] }`) and all *call sites*. The refactor renamed all usages to `buildQueue` but left the object definition and the `saveState` key as `building` – causing a silent `undefined` at runtime. JS never throws on a missing property read. `toLocaleString('de-DE'/'en-US')` handles thousand separators cleanly per language. Gold `#e3b341` reads well on dark bg as currency color.
- *Feb 23:* Economy designed from playtime backward: 50 packs in ~5 min, 8 flowers/50 packs, ~5.8 coins/min net (at 10 coins/flower, 1 coin/pack). Target arc: 2–4 weeks of accompaniment, fully action-gated. BfM defined as interactive book: clear end, not a service game, no FOMO. Alpaka farm split into 5 phases. Alpacas with Bruno-format micro-storytelling. Sparschwein rethought from time-ticker to action-gated savings mechanism.
- *Feb 23:* Full upgrade tree settled: 3 actors (Player, Harry, Mutti) × 3 upgrades each + farm arc. Naming matters: Staubsauger beats Magnetischer Bin, Bobby beats "Mutti's car", Gummi-Daumen beats Plastik-Daumen. Harry goes TikTok consolidates Tüten-Qualität and Hype-Train into one narrative arc. Land choice (Berge/Meer) has a late consequence (Bobby-Zuwachs) – early decision, late reward.
- *Feb 23:* Code review + refactor: (1) render/update separated – `update(now)` mutates state, draw functions are now read-only/pure; (2) OCP applied to upgrade system – each upgrade carries its own `effect` function, `getEffects()` is now generic and never needs to change; (3) DRY: `binX/binCX/binCY` helpers, `fillRRect/strokeRRect` helpers; (4) ctx removed from path functions and `drawFlower` – consistent with all other draw functions; (5) timers grouped as objects; (6) dead `shards` property removed from state.
- *Feb 23:* Final progression order locked. "Auf Kredit" reframes the win condition – not saving up, but paying off a dream. Alpacas choose the family, not vice versa – warmer and less transactional. Three milestones each anchored by an alpaca arrival. Theodor closes the game. Bobby-Tuning collapses two upgrades into one cleaner beat. Exponential growth principle: upgrades multiply across different axes (speed, value, volume) – the compound feel is what matters, not individual upgrade magnitude.
- *Feb 24:* Symbol collision: 🛍 can't do double duty as shop icon and pack counter. Replaced counter with a mini canvas-drawn pack – consistent with the game's visual language and unambiguous. Dev counters (packs opened + flowers sold) show both sides of the economy ratio in the header.
- *Feb 24:* Reframing a dev tool as in-game content: the ↺ reset button became "Spiel den selben Song nochmal" with a Cantina Band / Family Guy reference. Same function, but now it's a deliberate moment. Red confirmation text replaces a separate button – cleaner layout, honest about consequence.
- *Feb 24:* Shop icon placement: top-right next to the indicator is less crowded than bottom-right next to the bins. The indicator area has natural breathing room; the bin row does not.
- *Feb 24:* PIECE_ZONES had only 12 entries; Harry Pack has 14 pieces. `zones[i]` was silently undefined for i≥12. Fix: `i % zones.length`. Always wrap zone/pool indices when piece count can exceed pool size.
- *Feb 24:* "Dev tool" framing is temporary by definition. Once a UI element earns its place in the game, remove the dev label – both in code comments and in DESIGN.md. The header counters graduated from calibration aid to game UI.
- *Feb 24:* Stale screen names accumulate technical debt and confuse new readers. `'mine'` had no meaning in BfM – one sed pass cleaned all 7 occurrences including i18n keys and comments.
- *Feb 24:* Boot bug: `spawnPack()` was deducting coins unconditionally, including on reload. Root cause: one function doing two things (spawn + charge). Fix: `charge = true` default parameter – boot calls `spawnPack(false)`, auto-order uses the default. When a function has side effects that shouldn't always apply, a parameter is cleaner than splitting into two functions.
