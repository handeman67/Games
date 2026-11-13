// bots/brains/heuristic.js — no-API poker brain.
//
// Pure function: decide(state) -> { action, amount? }.
// No network, no cost, no state of its own. The manager guarantees the
// returned action is legal by sanitizing it against availableActions,
// but this brain only ever picks from availableActions itself.
//
// state shape (built by bots/manager.js — the same view a human client
// gets, plus the server's own hand evaluation for this bot's cards):
//   holeCards, communityCards, phase, pot, currentBet, minRaise,
//   toCall, myStack, myCurrentBet, mySeat, dealerSeat,
//   opponents (public player rows), availableActions,
//   handEval: { rank 1-10, rankName, score } | null (null preflop),
//   personality: { tightness, aggression, bluffFreq } (see PERSONALITIES)

const PERSONALITIES = {
    'tight-aggressive': { tightness: 0.68, aggression: 0.75, bluffFreq: 0.06 },
    'loose-passive':    { tightness: 0.42, aggression: 0.25, bluffFreq: 0.02 },
    'loose-aggressive': { tightness: 0.45, aggression: 0.80, bluffFreq: 0.18 },
    // Fallback for any roster entry without a personality.
    'balanced':         { tightness: 0.55, aggression: 0.50, bluffFreq: 0.08 }
};

function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
}

// Rough preflop strength, 0..1. Pairs and big cards score high,
// trash scores low. Deliberately simple — this is the free brain.
function preflopStrength(holeCards) {
    if (!holeCards || holeCards.length < 2) return 0.3;
    const [a, b] = [...holeCards].sort((x, y) => y.numericValue - x.numericValue);
    const hi = a.numericValue;
    const lo = b.numericValue;
    const suited = a.suit === b.suit;
    const gap = hi - lo;

    let score;
    if (hi === lo) {
        // Pair: 22 ~ 0.57, AA ~ 0.99.
        score = 50 + hi * 3.5;
    } else if (hi >= 11) {
        // At least one face card / ace.
        score = 55 + (hi - 11) * 5 + lo;
    } else {
        score = 30 + hi + lo;
    }
    if (suited) score += 4;
    if (gap === 1) score += 3;
    return clamp(score, 5, 99) / 100;
}

// Postflop strength, 0..1, from the server's own hand evaluation.
// Rank: 1 high card, 2 pair, 3 two pair, 4 trips, 5 straight,
// 6 flush, 7 full house, 8 quads, 9 straight flush, 10 royal.
function postflopStrength(handEval) {
    if (!handEval) return 0.3;
    const byRank = { 1: 0.22, 2: 0.55, 3: 0.70, 4: 0.78, 5: 0.85, 6: 0.88 };
    return byRank[handEval.rank] || 0.95;
}

function decide(state) {
    const p = PERSONALITIES[state.personality] || PERSONALITIES.balanced;
    const actions = state.availableActions || [];
    const can = (a) => actions.includes(a);
    const jitter = () => (Math.random() - 0.5) * 0.12;

    const strength = state.phase === 'preflop'
        ? preflopStrength(state.holeCards)
        : postflopStrength(state.handEval);

    const toCall = state.toCall || 0;
    const pot = state.pot || 0;
    const potOdds = toCall > 0 ? toCall / (pot + toCall) : 0;
    const stack = state.myStack || 0;

    // --- No bet to face: bet the good stuff, check the rest. ---
    if (toCall === 0) {
        const betThreshold = p.tightness + jitter();
        if (strength >= betThreshold && (can('bet') || can('raise'))) {
            const sizing = Math.max(
                state.minRaise || 2,
                Math.floor(pot / 2)
            );
            const amount = Math.min(sizing, stack);
            return { action: can('bet') ? 'bet' : 'raise', amount };
        }
        // Occasional bluff from loose-aggressive types.
        if (Math.random() < p.bluffFreq && can('bet') && stack > 0 &&
            (state.phase === 'flop' || state.phase === 'turn')) {
            return { action: 'bet', amount: Math.min(state.minRaise || 2, stack) };
        }
        if (can('check')) return { action: 'check' };
        return { action: 'fold' };
    }

    // --- Facing a bet: raise monsters, call on odds, fold the rest. ---
    const raiseThreshold = 0.78 + jitter();
    if (strength >= raiseThreshold && can('raise') && stack > toCall) {
        const amount = Math.min(
            state.currentBet + Math.max(state.minRaise || 2, Math.floor(pot / 2)),
            stack + (state.myCurrentBet || 0)
        );
        return { action: 'raise', amount };
    }

    // Short stack + decent hand: shove instead of bleeding out.
    if (strength >= 0.6 && stack > 0 && stack <= 10 * 2 && can('allin')) {
        return { action: 'allin' };
    }

    // Call when the price is right for the hand (looser personalities
    // stretch further). Tight players demand better odds than the raw
    // pot odds; loose players pay a premium to see cards.
    const callBar = potOdds * (p.tightness > 0.6 ? 0.9 : 1.3);
    if (can('call') && strength + jitter() >= callBar) {
        return { action: 'call' };
    }

    if (can('check')) return { action: 'check' };
    return { action: 'fold' };
}

module.exports = { decide, preflopStrength, postflopStrength, PERSONALITIES };
