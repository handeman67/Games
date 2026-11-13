// bots/manager.js — keeps the table filled with bot players.
//
// The bots live INSIDE the server process: they are plain player objects
// in the same `players` array as humans, with `isBot: true` and a fake
// socket id (`bot:<name>`). They act through the same handleAction()
// validation as humans, so an illegal bot action is impossible by
// construction. They never touch a socket, never trigger SMS alerts,
// and never get lifetime stats (the server guards those with isBot).
//
// The manager only changes seats while phase is 'waiting' — never
// mid-hand. Humans always get priority: the bot target is
// 6 - (humans seated), so one seat is always free for the next human.
//
// Usage from server.js:
//   const botManager = require('./bots/manager');
//   botManager.attach({ io, getPlayers, getPhase, ... }); // see attach()
//   botManager.start();

const roster = require('./roster');
const heuristic = require('./brains/heuristic');
const llm = require('./brains/llm');

const TICK_MS = 2000;
const THINK_MIN_MS = 1000;
const THINK_MAX_MS = 3000;
const LLM_TIMEOUT_MS = 10000;
const LLM_MAX_CALLS_PER_HAND = 4;
const CHAT_MIN_GAP_MS = 60000;
const DEBUG = process.env.BOTS_DEBUG === '1';
function dbg(...args) { if (DEBUG) console.log('[bots:dbg]', new Date().toISOString(), ...args); }

let ctx = null;
let timer = null;
let enabled = true;
let target = 6;
let lastPhase = 'waiting';
let llmCallsThisHand = {}; // botId -> count, reset every hand
let lastChatAt = {};       // botId -> timestamp
let pendingDecisions = new Set();

function attach(c) {
    ctx = c;
}

function start() {
    if (!ctx || timer) return;
    enabled = process.env.BOTS_ENABLED !== 'false';
    const parsed = parseInt(process.env.BOT_TARGET || '6', 10);
    target = Number.isFinite(parsed) ? Math.max(0, Math.min(6, parsed)) : 6;
    if (!enabled) {
        console.log('[bots] disabled (BOTS_ENABLED=false)');
        return;
    }
    console.log(`[bots] starting — target ${target} bot seats`);
    timer = setInterval(tick, TICK_MS);
    tick();
}

function stop() {
    if (timer) clearInterval(timer);
    timer = null;
}

function isBotName(name) {
    const key = String(name || '').trim().toLowerCase();
    return roster.some((b) => b.name.toLowerCase() === key);
}

function bots() {
    return ctx.getPlayers().filter((p) => p.isBot);
}

function humans() {
    return ctx.getPlayers().filter((p) => !p.isBot);
}

// One seat is always kept free for the next human.
function botTarget() {
    return Math.max(0, Math.min(target, 6 - humans().length));
}

function getStatus() {
    return {
        enabled,
        target,
        seated: bots().map((b) => ({ name: b.name, seat: b.seat, stack: b.stack }))
    };
}

// ---- Seat management (waiting phase only) ----

function tick() {
    if (!ctx || !enabled) return;
    const phase = ctx.getPhase();

    // New hand ended -> reset the per-hand LLM call budget.
    if (phase === 'waiting' && lastPhase !== 'waiting') {
        llmCallsThisHand = {};
    }
    lastPhase = phase;
    if (phase !== 'waiting') return;

    // 1. Rebuy busted bots (same rules as the human rebuy endpoint:
    //    between hands only, only at 0 chips).
    for (const bot of bots()) {
        if (bot.stack === 0) {
            bot.stack = ctx.constants.STARTING_STACK;
            bot.isActive = true;
            bot.folded = false;
            bot.allIn = false;
            bot.cards = [];
            bot.currentBet = 0;
            bot.totalBetThisHand = 0;
            bot.lastAction = null;
            ctx.broadcastGameState();
            ctx.broadcast('system_msg', `${bot.name} bought more chips! 🤖`);
        }
    }

    // 2. Yield seats so a human always has a free one.
    let excess = bots().length - botTarget();
    while (excess > 0) {
        const seated = bots().sort((a, b) => (a.joinedAt || 0) - (b.joinedAt || 0));
        const longest = seated[0];
        if (!longest) break;
        console.log(`[bots] ${longest.name} leaves to free a seat`);
        ctx.removePlayer(longest);
        excess--;
    }

    // 3. Fill empty seats from the roster, in roster order.
    while (bots().length < botTarget()) {
        const next = roster.find((r) => !bots().some((b) => b.name === r.name));
        if (!next) break;
        spawnBot(next);
    }

    // 4. If the table is now playable, start a hand.
    if (ctx.getPhase() === 'waiting' && ctx.canStartGame()) {
        ctx.maybeAutoStartFromWaiting(0);
    }
}

function spawnBot(def) {
    const seat = ctx.getFirstAvailableSeat();
    if (seat === -1) return;
    const player = {
        id: `bot:${def.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        name: def.name,
        stack: ctx.constants.STARTING_STACK,
        seat,
        cards: [],
        currentBet: 0,
        totalBetThisHand: 0,
        folded: false,
        allIn: false,
        isActive: true,
        lastAction: null,
        avatar: def.avatar || '🤖',
        isBot: true,
        botDef: def,
        joinedAt: Date.now()
    };
    ctx.getPlayers().push(player);
    ctx.getPlayers().sort((a, b) => a.seat - b.seat);
    ctx.broadcastGameState();
    ctx.broadcast('system_msg', `${def.name} joined the table! 🤖`);
    console.log(`[bots] ${def.name} seated at ${seat} (${def.brain}${def.model ? ':' + def.model : ''})`);
}

// ---- Turns ----

// Called by server.js from startActionTimer() when a turn begins.
function onTimerStart(player) {
    if (!ctx || !enabled || !player || !player.isBot) return;
    if (pendingDecisions.has(player.id)) {
        dbg(`SKIP ${player.name}: previous decision still pending`);
        return;
    }
    pendingDecisions.add(player.id);
    const startedAt = Date.now();

    const delay = THINK_MIN_MS + Math.random() * (THINK_MAX_MS - THINK_MIN_MS);
    dbg(`turn ${player.name}: decision in ${Math.round(delay)}ms`);
    setTimeout(() => {
        (async () => {
            try {
                dbg(`fired ${player.name}: +${Date.now() - startedAt}ms`);
                // The turn may have moved on while the bot was "thinking".
                const current = ctx.getCurrentPlayer();
                const phase = ctx.getPhase();
                if (!current || current.id !== player.id) { dbg(`early-return ${player.name}: turn moved on`); return; }
                if (phase === 'waiting' || phase === 'showdown') { dbg(`early-return ${player.name}: phase ${phase}`); return; }

                const state = buildBotState(player);
                const decision = await decideFor(player, state);
                const clean = sanitize(decision, state);

                // Re-check the turn right before acting.
                if (!ctx.getCurrentPlayer() || ctx.getCurrentPlayer().id !== player.id) { dbg(`early-return ${player.name}: turn moved on (2nd check)`); return; }
                // Clear the pending flag BEFORE acting: handleAction() can
                // synchronously start the next turn (new street, same bot
                // first to act), and that turn's onTimerStart must not be
                // skipped as a "duplicate" of this one. The finally below
                // stays as a backstop.
                pendingDecisions.delete(player.id);
                const result = ctx.handleAction(player.id, clean.action, clean.amount);
                dbg(`acted ${player.name}: ${clean.action}${clean.amount !== undefined ? ' ' + clean.amount : ''} -> ${result.success ? 'ok' : result.error} (+${Date.now() - startedAt}ms)`);
                if (!result.success) {
                    // Shouldn't happen after sanitize — one safe retry, then
                    // let the server's 30s timer fold the bot as a last resort.
                    console.warn(`[bots] ${player.name} action rejected (${result.error}), retrying safe action`);
                    const fallback = state.availableActions.includes('check')
                        ? { action: 'check' }
                        : state.availableActions.includes('call')
                            ? { action: 'call' }
                            : { action: 'fold' };
                    ctx.handleAction(player.id, fallback.action);
                } else if (decision.chat) {
                    maybeChat(player, decision.chat);
                }
            } catch (err) {
                console.warn(`[bots] ${player.name} decision failed:`, err.message || err);
            } finally {
                pendingDecisions.delete(player.id);
            }
        })();
    }, delay);
}

// The human-client view of the table, plus this bot's own cards and the
// server's evaluation of them. NEVER any other player's hole cards.
function buildBotState(player) {
    const pub = ctx.getPublicState();
    const me = pub.players.find((p) => p.seat === player.seat) || {};
    const opponents = pub.players
        .filter((p) => p.seat !== player.seat)
        .map((p) => ({
            name: p.name,
            stack: p.stack,
            currentBet: p.currentBet,
            folded: p.folded,
            allIn: p.allIn,
            lastAction: p.lastAction
        }));
    const handEval = (pub.phase !== 'preflop' && player.cards.length === 2)
        ? ctx.evaluateHand(player.cards, ctx.getCommunityCards())
        : null;
    return {
        holeCards: player.cards,
        communityCards: ctx.getCommunityCards(),
        phase: pub.phase,
        pot: pub.pot,
        currentBet: pub.currentBet,
        minRaise: pub.minRaise,
        toCall: pub.currentBet - player.currentBet,
        myStack: player.stack,
        myCurrentBet: player.currentBet,
        mySeat: player.seat,
        dealerSeat: pub.dealerSeat,
        opponents,
        availableActions: ctx.getAvailableActions(player),
        handEval,
        personality: player.botDef.personality || 'balanced',
        style: player.botDef.style || 'balanced',
        provider: player.botDef.provider,
        model: player.botDef.model
    };
}

async function decideFor(player, state) {
    const def = player.botDef;

    if (def.brain === 'llm') {
        const calls = llmCallsThisHand[player.id] || 0;
        const trivial = state.toCall === 0 && state.phase === 'preflop';
        if (!trivial && calls < LLM_MAX_CALLS_PER_HAND) {
            try {
                const decision = await llm.decide(state, { timeoutMs: LLM_TIMEOUT_MS });
                llmCallsThisHand[player.id] = calls + 1;
                return decision;
            } catch (err) {
                console.warn(`[bots] ${player.name} LLM (${def.provider}:${def.model}) failed, using heuristic:`, err.message || err);
            }
        }
    }

    return heuristic.decide(state);
}

// Force the decision into the legal set, with clamped amounts. The
// server would reject anything else — this just avoids burning the turn.
function sanitize(decision, state) {
    const actions = state.availableActions || [];
    let action = decision && decision.action;
    if (!actions.includes(action)) {
        if (actions.includes('check')) action = 'check';
        else if (actions.includes('call')) action = 'call';
        else action = 'fold';
    }
    let amount;
    if (action === 'bet') {
        amount = clampAmount(decision.amount, state.minRaise || 2, state.myStack || 0);
    } else if (action === 'raise') {
        amount = clampAmount(
            decision.amount,
            (state.currentBet || 0) + (state.minRaise || 2),
            (state.myStack || 0) + (state.myCurrentBet || 0)
        );
    }
    return { action, amount };
}

function clampAmount(value, lo, hi) {
    const n = Number(value);
    if (!Number.isFinite(n)) return lo;
    return Math.max(lo, Math.min(hi, Math.floor(n)));
}

function maybeChat(player, text) {
    const msg = String(text || '').trim().slice(0, 100);
    if (!msg) return;
    const now = Date.now();
    if (now - (lastChatAt[player.id] || 0) < CHAT_MIN_GAP_MS) return;
    lastChatAt[player.id] = now;
    ctx.io.emit('chat_message', {
        seat: player.seat,
        name: player.name,
        message: msg,
        timestamp: now
    });
}

module.exports = {
    attach, start, stop, tick, onTimerStart,
    isBotName, getStatus, buildBotState, sanitize, decideFor
};
