// engine.js – pure game logic
// No I/O, no canvas, no real clock, no Math.random calls.
// All randomness via `rng` parameter. All time via virtual clock.
//
// Public API:
//   createConfig(overrides?)            → Config
//   createState(config)                 → GameState
//   applyAction(state, config, action, rng) → { state, events }
//   tick(state, config, dt, rng)            → { state, events }

// ── Seeded PRNG (exported so trainer can use it) ──────────────────────────
export function mulberry32(seed) {
  return () => {
    seed |= 0; seed = seed + 0x6d2b79f5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// ── Config ────────────────────────────────────────────────────────────────
// Config is the full set of tunable constants.
// The trainer varies config to find good values.

export function createConfig(overrides = {}) {
  const base = {
    // Economy
    BAG_COST:       1,
    STARTING_COINS: 50,

    // Flower recipe
    FLOWER_RECIPE: { circle: 1, heart: 8, stem: 3, leaf: 2 },

    // Timings (ms)
    BUILD_BASE_MS: 20000,
    SELL_BASE_MS:   8000,
    TIMER_VARIANCE: 0.30,   // ±15% → (1 - v/2) to (1 - v/2 + v)

    // Bag
    BAG_SHARDS_DEFAULT: 3,
    BAG_TAPS_DEFAULT:   5,

    // Pieces
    SHAPES: [
      { id: 'circle', label: '◯' },
      { id: 'heart',  label: '♥' },
      { id: 'stem',   label: '|' },
      { id: 'leaf',   label: '❧' },
    ],
    SHAPE_WEIGHTS: [
      { id: 'circle', w:  1 },
      { id: 'heart',  w:  8 },
      { id: 'stem',   w:  3 },
      { id: 'leaf',   w:  2 },
    ],

    // Sparschein
    SPARSCHWEIN_SHARE:       0.10,  // fraction of coin value saved per flower
    SPARSCHWEIN_THRESHOLD:   20,    // payments before payout
    SPARSCHWEIN_MULTIPLIER:   3,    // interest multiplier on balance

    // Upgrade tree – ids, costs, and effects.
    // The shell augments each entry with name/desc for rendering (engine ignores those fields).
    // Effects mutate the fx object in order – multiplicative upgrades build on earlier ones.
    UPGRADE_TREE: [
      { id: 'schere',          actor: 'player', cost:   15, effect: fx => { fx.bagTaps = 1; } },
      { id: 'gummiDaumen',    actor: 'harry',  cost:   40, effect: fx => { fx.buildBaseMs = 12000; } },
      { id: 'grosshaendler',  actor: 'mutti',  cost:   80, effect: fx => { fx.bagShards = 5; } },
      { id: 'staubsauger',    actor: 'player', cost:  150, effect: fx => { fx.staubsauger = true; } },
      { id: 'harryTikTok',    actor: 'harry',  cost:  300, effect: fx => { fx.coinValue = Math.round(fx.coinValue * 1.8); } },
      { id: 'bobbyTuning',    actor: 'mutti',  cost:  500, effect: fx => { fx.sellBaseMs = 4000; } },
      { id: 'dinoSparschwein',actor: 'player', cost:  800, effect: fx => { fx.dinoSparschwein = true; } },
      { id: 'harryLabel',     actor: 'harry',  cost: 1500, effect: fx => { fx.coinValue = Math.round(fx.coinValue * 2.0); } },
      { id: 'bobbyZuwachs',   actor: 'mutti',  cost: 2500, effect: fx => { fx.sellBaseMs = 2000; } },
    ],
  };

  return { ...base, ...overrides };
}

// ── Effects ───────────────────────────────────────────────────────────────
// Computes the cumulative effect of all purchased upgrades.
// Applies each upgrade's effect(fx) in order – later upgrades may build on earlier ones.
export function getEffects(config, purchasedIds) {
  const fx = {
    bagTaps:         config.BAG_TAPS_DEFAULT,
    bagShards:       config.BAG_SHARDS_DEFAULT,
    buildBaseMs:     config.BUILD_BASE_MS,
    sellBaseMs:      config.SELL_BASE_MS,
    coinValue:       10,
    staubsauger:     false,
    dinoSparschwein: false,
  };

  for (const id of purchasedIds) {
    config.UPGRADE_TREE.find(u => u.id === id)?.effect(fx);
  }

  return fx;
}

// ── Colors ────────────────────────────────────────────────────────────────
const PEONY_PETAL_POOL = [
  '#fce4ec', '#f8bbd9', '#f48fb1', '#f06292',
  '#e91e8c', '#c2185b', '#880e4f',
];

function varyColor(hex, range = 12, rng) {
  const n  = parseInt(hex.slice(1), 16);
  const v  = Math.round((rng() - 0.5) * range);
  const r  = Math.min(255, Math.max(0, (n >> 16) + v));
  const g  = Math.min(255, Math.max(0, ((n >> 8) & 0xff) + v));
  const b  = Math.min(255, Math.max(0, (n & 0xff) + v));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

export function shapeToColor(shapeId, rng) {
  switch (shapeId) {
    case 'circle': return varyColor('#fff176', 10, rng);
    case 'heart':  return PEONY_PETAL_POOL[Math.floor(rng() * PEONY_PETAL_POOL.length)];
    case 'stem':   return varyColor('#52b788', 12, rng);
    case 'leaf':   return varyColor('#1e4d2b', 10, rng);
    default:       return '#888888';
  }
}

// ── Weighted random shape ─────────────────────────────────────────────────
function randomShape(config, rng) {
  const total = config.SHAPE_WEIGHTS.reduce((s, e) => s + e.w, 0);
  let roll    = rng() * total;
  for (const sw of config.SHAPE_WEIGHTS) {
    roll -= sw.w;
    if (roll <= 0) return config.SHAPES.find(s => s.id === sw.id);
  }
  return config.SHAPES[config.SHAPES.length - 1];
}

// ── Piece generation ──────────────────────────────────────────────────────
// pieceIdCounter lives in state so parallel trainer simulations don't interfere.
function genPieces(config, state, rng, count) {
  return Array.from({ length: count }, () => {
    const shape = randomShape(config, rng);
    return {
      id:    state.pieceIdCounter++,
      shape: shape,
      color: shapeToColor(shape.id, rng),
    };
  });
}

// ── State ─────────────────────────────────────────────────────────────────
export function createState(config) {
  return {
    virtualNow:    0,
    phase:         'pack',       // 'pack' | 'pieces'

    pack: {
      tapsRequired: config.BAG_TAPS_DEFAULT,
      tapsLeft:     config.BAG_TAPS_DEFAULT,
      generatedPieces: [],       // pieces inside the pack, not yet in play
      harryPack:    false,
    },

    pendingPieces: [],           // pieces in play, awaiting sort

    bins: config.SHAPES.map(s => ({
      shape:  s,
      pieces: [],                // { color: hex }
    })),

    buildQueue:  [],             // { id, parts } – flowers being built
    stock:       [],             // { id, parts } – finished, waiting for Mutti
    coins:       config.STARTING_COINS,

    buildTimer: { active: false, endsAt: 0, durationMs: 0 },
    sellTimer:  { active: false, endsAt: 0, durationMs: 0 },

    upgrades: { purchased: [] },

    sparschein: { balance: 0, paymentCount: 0 },

    flowerIdCounter: 0,
    pieceIdCounter:  0,
    packsOpened:     0,
    flowersSold:     0,
  };
}

// ── Internal helpers ──────────────────────────────────────────────────────
function timedDuration(base, variance, rng) {
  return base * (1 - variance / 2 + rng() * variance);
}

function flowersReady(state, config) {
  return Math.min(...config.SHAPES.map(s => {
    const bin = state.bins.find(b => b.shape.id === s.id);
    return Math.floor(bin.pieces.length / config.FLOWER_RECIPE[s.id]);
  }));
}

function buildFlower(state, config, rng) {
  const events = [];

  // Consume parts from bins
  for (const s of config.SHAPES) {
    const bin   = state.bins.find(b => b.shape.id === s.id);
    bin.pieces.splice(0, config.FLOWER_RECIPE[s.id]);
  }

  // Generate Pfingstrose colors
  const parts = {
    circle: [{ color: shapeToColor('circle', rng) }],
    heart:  Array.from({ length: 8 }, () => ({ color: shapeToColor('heart', rng) })),
    stem:   Array.from({ length: 3 }, () => ({ color: shapeToColor('stem',  rng) })),
    leaf:   Array.from({ length: 2 }, () => ({ color: shapeToColor('leaf',  rng) })),
  };

  const flower = { id: state.flowerIdCounter++, parts };
  state.buildQueue.push(flower);
  events.push({ type: 'build_queued', flower });

  return events;
}

function checkBuildTrigger(state, config, rng) {
  const events = [];
  while (flowersReady(state, config) > 0) {
    events.push(...buildFlower(state, config, rng));
  }
  if (state.buildQueue.length > 0 && !state.buildTimer.active) {
    events.push(...startBuild(state, config, rng));
  }
  return events;
}

function startBuild(state, config, rng) {
  if (state.buildTimer.active || state.buildQueue.length === 0) return [];
  const fx  = getEffects(config, state.upgrades.purchased);
  const dur = timedDuration(fx.buildBaseMs, config.TIMER_VARIANCE, rng);
  state.buildTimer = { active: true, endsAt: state.virtualNow + dur, durationMs: dur };
  return [{ type: 'build_started', durationMs: dur }];
}

function completeBuild(state, config, rng) {
  const events = [];
  const flower  = state.buildQueue.shift();
  if (!flower) return events;

  state.stock.push({ id: flower.id, parts: flower.parts });
  state.buildTimer.active = false;
  events.push({ type: 'build_complete', flower });

  // Continue queue
  if (state.buildQueue.length > 0) {
    events.push(...startBuild(state, config, rng));
  }

  // Kick off sell if Mutti was idle
  if (!state.sellTimer.active) {
    events.push(...startSell(state, config, rng));
  }

  return events;
}

function startSell(state, config, rng) {
  if (state.sellTimer.active || state.stock.length === 0) return [];
  const fx  = getEffects(config, state.upgrades.purchased);
  const dur = timedDuration(fx.sellBaseMs, config.TIMER_VARIANCE, rng);
  state.sellTimer = { active: true, endsAt: state.virtualNow + dur, durationMs: dur };
  return [{ type: 'sell_started', durationMs: dur }];
}

function completeSell(state, config, rng) {
  const events = [];
  state.stock.shift();
  state.flowersSold++;
  state.sellTimer.active = false;

  const fx = getEffects(config, state.upgrades.purchased);
  state.coins += fx.coinValue;
  events.push({ type: 'sell_complete', coins: state.coins, coinValue: fx.coinValue });

  // Dino-Sparschwein
  if (fx.dinoSparschwein) {
    state.sparschein.balance      += fx.coinValue * config.SPARSCHWEIN_SHARE;
    state.sparschein.paymentCount += 1;
    if (state.sparschein.paymentCount >= config.SPARSCHWEIN_THRESHOLD) {
      const payout = Math.round(state.sparschein.balance * config.SPARSCHWEIN_MULTIPLIER);
      state.coins                  += payout;
      state.sparschein.balance      = 0;
      state.sparschein.paymentCount = 0;
      events.push({ type: 'sparschwein_payout', payout, coins: state.coins });
    }
  }

  // Continue selling
  if (state.stock.length > 0) {
    events.push(...startSell(state, config, rng));
  }

  return events;
}

function spawnPackInternal(state, config, rng, charge, fromSort = false) {
  const events = [];
  const fx     = getEffects(config, state.upgrades.purchased);

  if (charge) {
    state.coins = Math.max(0, state.coins - config.BAG_COST);
    events.push({ type: 'coins_changed', coins: state.coins });
  }

  const count = fx.bagShards;
  const taps  = fx.bagTaps;

  state.pack = {
    tapsRequired:    taps,
    tapsLeft:        taps,
    generatedPieces: genPieces(config, state, rng, count),
    harryPack:       false,
  };
  state.phase = 'pack';
  // fromSort: shell should delay the pack enter animation to let piece sort-out finish
  events.push({ type: 'pack_spawned', count, taps, harryPack: false, fromSort });

  return events;
}

// ── applyAction ───────────────────────────────────────────────────────────
export function applyAction(state, config, action, rng) {
  const events = [];

  switch (action.type) {

    case 'tap_pack': {
      if (state.phase !== 'pack') break;
      state.pack.tapsLeft--;
      events.push({ type: 'pack_tapped', tapsLeft: state.pack.tapsLeft });

      if (state.pack.tapsLeft <= 0) {
        // Open: move generated pieces into play
        state.pendingPieces = state.pack.generatedPieces.map(p => ({ ...p }));
        state.phase         = 'pieces';
        state.packsOpened++;
        events.push({ type: 'pack_opened', pieces: state.pendingPieces });
      }
      break;
    }

    case 'sort_piece': {
      const { pieceId, binIndex } = action;
      const piece = state.pendingPieces.find(p => p.id === pieceId);
      if (!piece) break;

      const bin = state.bins[binIndex];
      if (!bin) break;

      if (piece.shape.id !== bin.shape.id) {
        events.push({ type: 'piece_wrong_bin', pieceId, binIndex });
        break;
      }

      // Correct sort
      state.pendingPieces = state.pendingPieces.filter(p => p.id !== pieceId);
      const recipe        = config.FLOWER_RECIPE[bin.shape.id];
      bin.pieces.push({ color: piece.color });
      events.push({ type: 'piece_sorted', pieceId, binIndex,
                    binTotal: bin.pieces.length, recipe });

      // Flash event when crossing a recipe threshold
      if (bin.pieces.length % recipe === 0) {
        events.push({ type: 'bin_threshold', binIndex });
      }

      // Check if a flower can be built
      events.push(...checkBuildTrigger(state, config, rng));

      // Spawn next pack when all pieces are gone
      if (state.pendingPieces.length === 0) {
        events.push(...spawnPackInternal(state, config, rng, true, true));
      }
      break;
    }

    case 'spawn_pack': {
      events.push(...spawnPackInternal(state, config, rng, action.charge ?? true));
      break;
    }

    case 'spawn_harry_pack': {
      // Harry's special first pack – exact recipe, no cost
      const recipe = config.FLOWER_RECIPE;
      const pieces = [
        ...Array.from({ length: recipe.circle }, () =>
          ({ id: state.pieceIdCounter++, shape: config.SHAPES.find(s => s.id === 'circle'), color: shapeToColor('circle', rng) })),
        ...Array.from({ length: recipe.heart  }, () =>
          ({ id: state.pieceIdCounter++, shape: config.SHAPES.find(s => s.id === 'heart'),  color: shapeToColor('heart',  rng) })),
        ...Array.from({ length: recipe.stem   }, () =>
          ({ id: state.pieceIdCounter++, shape: config.SHAPES.find(s => s.id === 'stem'),   color: shapeToColor('stem',   rng) })),
        ...Array.from({ length: recipe.leaf   }, () =>
          ({ id: state.pieceIdCounter++, shape: config.SHAPES.find(s => s.id === 'leaf'),   color: shapeToColor('leaf',   rng) })),
      ];
      state.pack = {
        tapsRequired:    1,
        tapsLeft:        1,
        generatedPieces: pieces,
        harryPack:       true,
      };
      state.phase = 'pack';
      events.push({ type: 'pack_spawned', count: pieces.length, taps: 1, harryPack: true });
      break;
    }

    case 'buy_upgrade': {
      const { id } = action;
      const idx    = config.UPGRADE_TREE.findIndex(u => u.id === id);
      if (idx < 0) break;
      if (idx !== state.upgrades.purchased.length) break;  // must buy in order
      const upg = config.UPGRADE_TREE[idx];
      if (state.coins < upg.cost) break;

      state.coins -= upg.cost;
      state.upgrades.purchased.push(id);
      events.push({ type: 'upgrade_bought', id, coins: state.coins });
      events.push({ type: 'coins_changed', coins: state.coins });
      break;
    }

    case 'finish_intro': {
      events.push({ type: 'intro_finished' });
      break;
    }
  }

  return { state, events };
}

// ── tick ─────────────────────────────────────────────────────────────────
// Advances virtual time by dt ms. Fires due timers. Returns { state, events }.
// Also auto-starts idle timers when a queue/stock is non-empty – handles
// the boot case (timers are inactive after loadState but queue may be non-empty).
export function tick(state, config, dt, rng) {
  const events = [];
  state.virtualNow += dt;

  // Auto-start build timer if Harry has work but timer is idle (e.g. after load)
  if (!state.buildTimer.active && state.buildQueue.length > 0) {
    events.push(...startBuild(state, config, rng));
  }

  // Auto-start sell timer if Mutti has stock but timer is idle (e.g. after load)
  if (!state.sellTimer.active && state.stock.length > 0) {
    events.push(...startSell(state, config, rng));
  }

  // Fire build timer if due
  if (state.buildTimer.active && state.virtualNow >= state.buildTimer.endsAt) {
    events.push(...completeBuild(state, config, rng));
  }

  // Fire sell timer if due
  if (state.sellTimer.active && state.virtualNow >= state.sellTimer.endsAt) {
    events.push(...completeSell(state, config, rng));
  }

  return { state, events };
}
