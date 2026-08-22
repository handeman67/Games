# Texas Hold'em Poker App - Evaluation & Roadmap

## Overview

This repository contains a real-time multiplayer Texas Hold'em Poker web application built with Node.js, Express, Socket.IO, and vanilla JavaScript/CSS on the frontend.

---

## 1. Architecture & Evaluated Files

The application consists of a backend Node.js server and a static frontend client.

### Backend Files
- **`server.js`**: Core backend server running Express and Socket.IO. Handles Texas Hold'em game state, deck creation, hand evaluation, side-pot calculations, persistent JSON storage, and optional Twilio SMS alerts.
- **`data/poker-memory.json`**: File-based persistence store for lifetime player statistics (`handsPlayed`, `handsWon`, `chipsWon`, `chipsLost`, `netChips`) and hand history (up to 100 recent hands).
- **`package.json`**: Application metadata and dependencies (`express`, `socket.io`, `twilio`).
- **`.env`**: Local environment configuration (`JWT_SECRET`, `PORT`, Twilio API keys, SMS toggles).

### Frontend Files
- **`public/index.html`**: Primary poker UI containing the login screen, poker table layout, community cards, seat slots, action controls, bet slider, chat overlay, and modal dialogs.
- **`public/client.js`**: Client-side logic for Socket.IO event listeners, game state rendering, local chip/avatar persistence in `localStorage`, sound/animation triggers, and chat state management.
- **`public/loading.html`**: Standalone loading screen that polls the backend `/ready` endpoint and transitions to the main table upon server readiness.
- **`public/style.css`**: Styling for the poker table, cards, chip animations, responsive layouts, chat overlay, and loading screen.
- **`public/game/SoundManager.js`**: Web Audio API audio synthesizer providing sound effects for card dealing, chips betting, folding, checking, flips, wins, and errors.
- **`public/game/AnimationManager.js`**: DOM-based animation controller handling smooth card dealing, chip movements into the pot, action floating labels, and dealer button pulses.

---

## 2. Missing Functionality

Based on an evaluation of the codebase against feature completeness and `TODO.md` entries:

### 1. Loading Page Integration & Route Wiring
- **Route Handler Missing**: `server.js` serves static files from `public/`, but lacks a designated `/loading` route or a redirect strategy to present `loading.html` when a client first connects.
- **Root Poker Button Wiring**: `index.html` has no navigation button back to `loading.html` or table server status page.
- **Missing Loading Media Assets**: `public/loading.html` attempts to render `./QQxf.gif` and `./ALVv.gif`, but neither file exists in the repository.

### 2. Client-Side Action Timer UI
- **Missing Timer Countdown Ring/Bar**: The server emits a `timer_start` event with `{ seat, duration }` whenever a player's turn begins (`ACTION_TIMEOUT = 30000ms`). However, `public/client.js` lacks an event handler for `timer_start`. As a result, players receive no visual countdown or audible warning before auto-folding on timeout.

### 3. Frontend Views for Stats, Leaderboard & Hand History
- **Unused REST Endpoints**: `server.js` exposes `/stats/:name`, `/leaderboard`, and `/history` endpoints backed by `data/poker-memory.json`.
- **Missing UI Modals**: `public/index.html` and `public/client.js` do not provide UI buttons or modal views to view leaderboards, lifetime stats, or hand replay history.

### 4. Smart SMS Notification Rules
- **Server Startup SMS Logic**: When `SMS_ENABLED=true`, `server.js` sends an SMS alert on server boot. Because the `players` array is empty on startup, `isHandemanPresent()` always returns `false`, firing SMS alerts unconditionally during server restarts or cold starts.
- **Conditional Player Join SMS**: SMS alerts need to be suppressed when designated active players (e.g. `handeman67`) are already seated at the table.

---

## 3. Critical Bugs & Code Errors Identified

### 1. Rebuy Active-Hand State Corruption (Server-Side)
- **File**: `server.js` (`socket.on('request_rebuy')`)
- **Issue**: The server checks if `player.stack === 0`, but fails to verify `gamePhase === 'waiting'`.
- **Impact**: If a player who busted mid-hand emits `request_rebuy` via socket during an active hand (`flop`, `turn`, `river`, `showdown`), their stack is reset to 1,500 chips and `isActive` is set to `true`. This can corrupt active pot equity calculations, turn progression, or prematurely force auto-start routines.

### 2. Disconnect Turn Pointer Shift Bug
- **File**: `server.js` (`socket.on('disconnect')`)
- **Issue**: When a player disconnects during an active hand (`players.splice(playerIndex, 1)`), if `playerIndex < currentPlayerIndex`, `currentPlayerIndex` is not decremented.
- **Impact**: Splicing the array shifts all remaining player indices down by 1. The turn index points to the incorrect player, effectively skipping a player's turn on disconnect.

### 3. Missing Media Assets in Loading Screen
- **File**: `public/loading.html` (Lines 99-100)
- **Issue**: Images `<img src="./QQxf.gif">` and `<img src="./ALVv.gif">` are referenced but missing from `public/`.
- **Impact**: Causes 404 image load errors on the loading screen and broken visual layouts.

### 4. Avatar Upload Payload Normalization Edge Case
- **File**: `public/client.js` (`normalizeAvatar()`)
- **Issue**: When an avatar is uploaded as a base64 Data URL, string coercion or socket payload wrapping can occasionally transmit as `"[object Object]"` if wrapped in an object payload without proper string extraction.
- **Impact**: Avatars render as fallback text instead of uploaded custom images.

### 5. Instant Local Memory Sync on Rebuy
- **File**: `public/client.js`
- **Issue**: Local chip memory stored in `localStorage` under `poker_chip_memory_<name>` is only updated when a hand state broadcast finishes, but not immediately when the client receives `rebuy_success`.
- **Impact**: The UI display for `localChipMemoryLogin` / `localChipMemoryGame` shows outdated chip counts immediately after a rebuy.

---

## 4. Prioritized Fix Roadmap

| Priority | Issue / Task | File(s) | Description |
|---|---|---|---|
| **P0 (Critical)** | Rebuy Phase Guard | `server.js` | Enforce `gamePhase === 'waiting'` inside `socket.on('request_rebuy')`. |
| **P0 (Critical)** | Disconnect Turn Index Shift | `server.js` | Decrement `currentPlayerIndex` when `playerIndex < currentPlayerIndex` on disconnect. |
| **P1 (High)** | Action Timer UI | `public/client.js`, `public/index.html` | Listen for `timer_start` and render a 30s visual progress bar/ring. |
| **P1 (High)** | Missing GIF Assets & Route Wiring | `public/loading.html`, `server.js` | Supply missing GIF/video assets or fallback CSS animation; wire `/loading` route. |
| **P2 (Medium)** | Stats & Leaderboard Modals | `public/index.html`, `public/client.js` | Add UI buttons/modals connecting to `/leaderboard` and `/history` REST endpoints. |
| **P2 (Medium)** | SMS Startup Logic | `server.js` | Refine startup SMS alert behavior and check stored memory / seated players. |
| **P3 (Low)** | Instant Rebuy Local Memory Sync | `public/client.js` | Trigger `refreshLocalMemoryUI()` immediately upon `rebuy_success`. |

---

## 5. Verification Steps

1. **Local Server Start**: Run `node server.js` and verify endpoint health via `GET http://localhost:3000/ready`.
2. **Rebuy Test**: Join 2 players, bust 1 player stack, verify rebuy button appears only in `waiting` phase and succeeds cleanly.
3. **Disconnect Test**: Join 3 players, start a hand, disconnect player in seat 1, verify player in seat 2 receives turn cleanly.
4. **Loading Flow Test**: Open `http://localhost:3000/loading.html` and verify polling succeeds and redirects to `/`.
