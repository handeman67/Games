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
- [ ] Fix rebuy/game-resume logic so table auto-resumes after a busted player rebuys
- [ ] Verify one full hand completion persists memory (`/stats/:name`, `/leaderboard`, `/history`)
- [ ] Re-test critical gameplay path after rebuy
