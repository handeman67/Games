# Poker Active TODO (Memory + Avatar + Rebuy Resume)

## Deployment + Connectivity
- [x] Define plan for GitHub Pages frontend + hosted backend
- [x] Update `public/client.js` to use configurable backend URL and add connection error handling
- [x] Update `public/index.html` with runtime config placeholder and multiplayer backend notice
- [x] Add `DEPLOYMENT.md` with Render + GitHub Pages setup instructions
- [x] Run critical-path verification locally
- [x] Summarize deployment steps and test results

## Memory + Avatar + Gameplay Continuity
- [x] Add persistent backend memory store (stats + history endpoints)
- [x] Add browser-local chip memory
- [x] Add avatar selection/upload and seat rendering support
- [x] Fix avatar upload display issue in seat rendering flow
- [x] Fix local chip memory persistence visibility

## Current Critical Fix (in progress)
- [x] Fix rebuy/game-resume logic so table auto-resumes after a busted player rebuys
- [x] Verify one full hand completion persists memory (`/stats/:name`, `/leaderboard`, `/history`)
- [x] Re-test critical gameplay path after rebuy

## Table Bots — AI players (2026-11-12, branch `bots-v1`)

- [x] Server-side bot manager (`bots/manager.js`) — fills seats to a target (default 6), yields seats to humans between hands, auto-rebuys busted bots
- [x] Heuristic brain (`bots/brains/heuristic.js`) — no API, no cost; 3 personalities (tight-aggressive, loose-passive, loose-aggressive)
- [x] LLM brain (`bots/brains/llm.js`) — one model per seat, 10 s timeout, heuristic fallback on any failure; OpenAI / Anthropic / Google
- [x] Random roster draw 2026-11-12 (`bots/roster.js`): Claude (claude-3-5-haiku), Gemini (gemini-2.0-flash), Mini (gpt-4o-mini), Vegas Vic, Loose Lucy, Bluffin' Bob
- [x] Bots excluded from lifetime stats/leaderboard; roster names reserved; 🤖 badge on bot seats
- [ ] Live test after deploy: 6 bots seat themselves, hands run unattended, human join displaces a bot between hands
- [ ] Add LLM API keys in Render Environment when ready — until then LLM seats play heuristic

## New UI + Notification Work (in progress)
- [x] Add chat close/minimize button and left-side dock reopen control
- [x] Fix non-operable chat toggle behavior
- [x] Persist chat open/closed state in browser localStorage
- [x] Add optional SMS notifications (server start + player join) via env-configured provider
- [ ] Disable join/start SMS notifications when `handeman67` is already on table
- [ ] Add loading page with video placeholder and readiness polling
- [ ] Wire root Poker button to loading page route
- [ ] Run critical-path verification for loading flow + conditional SMS behavior
