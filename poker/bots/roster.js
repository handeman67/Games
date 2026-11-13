// bots/roster.js — the table's bot lineup.
//
// Drawn at random 2026-11-12 (SystemRandom shuffle, no weighting).
// Full draw record: ~/workspace/your_files/poker-ai-players/roster-draw-2026-11-12.json
// To change a seat's model, change one line here. No other file cares
// which model a seat runs — every brain speaks the same decide() contract.
//
// brain: 'heuristic' = no API, no cost, plays from the built-in engine.
// brain: 'llm'       = one LLM call per non-trivial decision (see brains/llm.js).
//                      A seat whose API key is missing falls back to the
//                      heuristic automatically, so the table still fills.

module.exports = [
    {
        name: 'Claude',
        avatar: '🕶️',
        brain: 'llm',
        provider: 'anthropic',
        model: 'claude-3-5-haiku',
        style: 'Cautious, pot-odds driven.'
    },
    {
        name: 'Gemini',
        avatar: '🐼',
        brain: 'llm',
        provider: 'google',
        model: 'gemini-2.0-flash',
        style: 'Aggressive on strong draws.'
    },
    {
        name: 'Mini',
        avatar: '👤',
        brain: 'llm',
        provider: 'openai',
        model: 'gpt-4o-mini',
        style: 'Balanced, by the book.'
    },
    {
        name: 'Vegas Vic',
        avatar: '🐵',
        brain: 'heuristic',
        personality: 'tight-aggressive',
        style: 'Tight-aggressive. The solid baseline.'
    },
    {
        name: 'Loose Lucy',
        avatar: '🤠',
        brain: 'heuristic',
        personality: 'loose-passive',
        style: 'Loose-passive. Calls too much.'
    },
    {
        name: "Bluffin' Bob",
        avatar: '🎭',
        brain: 'heuristic',
        personality: 'loose-aggressive',
        style: 'Loose-aggressive. Bluffs, over-bets.'
    }
];
