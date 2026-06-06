# Poker App Deployment TODO / Verification Checklist

## Implementation Steps
- [ ] Add production-safe server settings in `server.js`
- [ ] Add health endpoint(s) for host uptime checks
- [ ] Add Socket.IO deployment-safe CORS config (env-driven)
- [ ] Add graceful shutdown handlers
- [ ] Run local verification tests
- [ ] Document shareable game URL format

## Verification Checklist (use after deploy)
- [ ] `npm install` completed successfully
- [ ] Server starts with `npm start` and binds to host-provided `PORT`
- [ ] `GET /health` returns JSON with `"ok": true`
- [ ] App root `/` loads the poker client page
- [ ] Open two browser windows and join with different names
- [ ] Players can see each other at the table
- [ ] Actions (check/call/raise/fold) sync in real time
- [ ] Chat and emoji events sync in real time
- [ ] Disconnect/reconnect behavior is stable
- [ ] No websocket/CORS errors in browser console

## Share Link Format
- Main table link:
  - `https://YOUR-DEPLOYED-DOMAIN/`
- Optional auto-name join link:
  - `https://YOUR-DEPLOYED-DOMAIN/?name=YourName`

Replace `YOUR-DEPLOYED-DOMAIN` with your actual host URL.
