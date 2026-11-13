// bots/brains/llm.js — one LLM call per non-trivial decision.
//
// Same decide() contract as the heuristic brain, but the "thinking" is
// done by a real model: OpenAI, Anthropic, or Google, per roster entry.
// The manager calls this only for non-trivial spots and falls back to
// the heuristic on ANY failure (missing key, timeout, garbage reply),
// so a dead provider can never stall a hand.
//
// Keys come from environment variables only — never from the repo:
//   OPENAI_API_KEY, ANTHROPIC_API_KEY, GOOGLE_API_KEY
// Base URLs are overridable for tests:
//   OPENAI_BASE_URL, ANTHROPIC_BASE_URL, GOOGLE_BASE_URL
//
// Node 18+ has a global fetch; if it is missing this module throws and
// the manager falls back to the heuristic.

const DEFAULT_TIMEOUT_MS = 10000;

function cardShort(c) {
    return `${c.value}${({ hearts: 'h', diamonds: 'd', clubs: 'c', spades: 's' })[c.suit] || '?'}`;
}

function buildPrompt(state) {
    const hand = state.handEval
        ? `${state.handEval.rankName} (rank ${state.handEval.rank}/10)`
        : 'preflop';
    const opp = (state.opponents || []).map((o) => (
        `${o.name}: ${o.stack} chips, bet ${o.currentBet}` +
        `${o.folded ? ', folded' : ''}${o.allIn ? ', all-in' : ''}` +
        (o.lastAction ? `, last: ${o.lastAction}` : '')
    )).join(' | ');
    return [
        'You are a Texas Hold\'em poker player. Reply with JSON ONLY, no other text.',
        'Format: {"action": "fold"|"check"|"call"|"bet"|"raise"|"allin", "amount": <number, only for bet/raise>, "chat": "<optional short table line, max 8 words>"}',
        `Phase: ${state.phase}. Pot: ${state.pot}. Current bet: ${state.currentBet}. Minimum raise: ${state.minRaise}.`,
        `Your cards: ${(state.holeCards || []).map(cardShort).join(' ') || 'none'}. Board: ${(state.communityCards || []).map(cardShort).join(' ') || 'none'}. Your made hand: ${hand}.`,
        `Your stack: ${state.myStack}. You have bet ${state.myCurrentBet} this round. To call: ${state.toCall}.`,
        `Legal actions: ${(state.availableActions || []).join(', ')}.`,
        `Opponents: ${opp || 'none'}.`,
        `Your style: ${state.style || 'balanced'}.`,
        'Keep the amount sensible: a bet is usually half the pot; a raise is the current bet plus at least the minimum raise.'
    ].join('\n');
}

// Pull the first {...} object out of model output (models love to add
// fences or a sentence around the JSON). Throws on unparseable text.
function extractJson(text) {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end === -1 || end <= start) {
        throw new Error('No JSON object in model reply');
    }
    return JSON.parse(text.slice(start, end + 1));
}

async function callOpenAI(state, model, opts) {
    const key = process.env.OPENAI_API_KEY || '';
    if (!key) throw new Error('OPENAI_API_KEY is not set');
    const base = (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
    const res = await opts.fetchImpl(`${base}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
        body: JSON.stringify({
            model,
            messages: [
                { role: 'system', content: 'You play Texas Hold\'em. Reply with JSON only.' },
                { role: 'user', content: buildPrompt(state) }
            ],
            temperature: 0.7,
            max_tokens: 120
        }),
        signal: AbortSignal.timeout(opts.timeoutMs)
    });
    if (!res.ok) throw new Error(`OpenAI HTTP ${res.status}`);
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content || '';
    return extractJson(text);
}

async function callAnthropic(state, model, opts) {
    const key = process.env.ANTHROPIC_API_KEY || '';
    if (!key) throw new Error('ANTHROPIC_API_KEY is not set');
    const base = (process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com/v1').replace(/\/$/, '');
    const res = await opts.fetchImpl(`${base}/messages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': key,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model,
            max_tokens: 120,
            messages: [{ role: 'user', content: buildPrompt(state) }]
        }),
        signal: AbortSignal.timeout(opts.timeoutMs)
    });
    if (!res.ok) throw new Error(`Anthropic HTTP ${res.status}`);
    const data = await res.json();
    const text = (data?.content || []).map((c) => c.text || '').join('');
    return extractJson(text);
}

async function callGoogle(state, model, opts) {
    const key = process.env.GOOGLE_API_KEY || '';
    if (!key) throw new Error('GOOGLE_API_KEY is not set');
    const base = (process.env.GOOGLE_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta').replace(/\/$/, '');
    const res = await opts.fetchImpl(
        `${base}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: buildPrompt(state) }] }],
                generationConfig: { maxOutputTokens: 120, temperature: 0.7 }
            }),
            signal: AbortSignal.timeout(opts.timeoutMs)
        }
    );
    if (!res.ok) throw new Error(`Google HTTP ${res.status}`);
    const data = await res.json();
    const text = (data?.candidates?.[0]?.content?.parts || []).map((p) => p.text || '').join('');
    return extractJson(text);
}

const CALLERS = { openai: callOpenAI, anthropic: callAnthropic, google: callGoogle };

// decide(state, opts) -> Promise<{ action, amount?, chat? }>
// opts: { timeoutMs, fetchImpl }. Throws on any failure — the caller
// (bots/manager.js) treats a throw as "use the heuristic instead".
async function decide(state, opts = {}) {
    const fetchImpl = opts.fetchImpl || globalThis.fetch;
    if (typeof fetchImpl !== 'function') {
        throw new Error('No fetch available in this Node runtime');
    }
    const timeoutMs = opts.timeoutMs || DEFAULT_TIMEOUT_MS;
    const caller = CALLERS[state.provider];
    if (!caller) throw new Error(`Unknown LLM provider: ${state.provider}`);
    const decision = await caller(state, state.model, { fetchImpl, timeoutMs });
    if (!decision || typeof decision.action !== 'string') {
        throw new Error('Model reply had no action');
    }
    return decision;
}

module.exports = { decide, buildPrompt, extractJson, DEFAULT_TIMEOUT_MS };
