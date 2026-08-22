# Poker Deployment Guide (GitHub Pages Frontend + Hosted Backend)

This poker game is multiplayer and requires a live Socket.IO backend.

## Architecture
- Frontend: static files (`poker/public`) can be hosted on GitHub Pages.
- Backend: `poker/server.js` must run on a Node host (Render recommended).

---

## 1) Deploy Backend (Render)

1. Push repo to GitHub (already done).
2. In Render:
   - New + -> Web Service
   - Connect your `Games` repository
   - Root Directory: `poker`
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
3. Environment variables:
   - `CLIENT_URL=https://<your-github-pages-domain>`
     - Example: `https://handeman67.github.io`
   - Optional:
     - `PORT` (Render sets automatically)
     - `HOST=0.0.0.0`
4. Deploy and copy backend URL:
   - Example: `https://your-poker-backend.onrender.com`
5. Verify backend health:
   - `GET https://your-poker-backend.onrender.com/health`
   - Should return JSON with `ok: true`

---

## 2) Configure Frontend for Hosted Backend

In `poker/public/index.html`, set:

```html
<script>
  window.POKER_SERVER_URL = 'https://your-poker-backend.onrender.com';
</script>
```

Current file includes a placeholder. Replace with your real backend URL before publishing static poker frontend.

---

## 3) GitHub Pages Notes

If poker is linked from root GitHub Pages:
- Static hosting alone cannot provide `/socket.io/socket.io.js` from same origin.
- Multiplayer works only when client points to the hosted backend URL.

If you keep poker under GitHub Pages path, ensure links are correct and not forcing same-origin socket endpoints unintentionally.

---

## 4) Local Verification (Critical-path)

### Backend local run
From repo root:

```bash
cd poker
npm install
npm start
```

Server starts at `http://0.0.0.0:3000` (or configured `PORT`).

### Frontend verification
- Open `http://localhost:3000` for same-origin mode.
- Enter nickname and click Join.
- You should transition from login to table view.

### Static-style verification
- Serve static files (or GitHub Pages).
- Set `window.POKER_SERVER_URL` to deployed backend URL.
- Join should work and no longer fail silently.

---

## 5) Common Failure Cause (Your Report)

Symptom:
- Login page opens, nickname entered, Join clicked, but not seated.

Cause:
- Socket.IO backend not reachable from static page (`/socket.io/socket.io.js` 404 or connection error).

Fix:
- Deploy backend and set `window.POKER_SERVER_URL` to backend URL.

---

## 6) Optional Hardening

- Add reconnection UI state badges.
- Add backend warmup notice for free-tier hosts.
- Add CORS allow-list for production domain + localhost dev.
