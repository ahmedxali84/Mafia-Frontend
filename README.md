# Mafia — Frontend

Browser client for the multiplayer Mafia web game: **Next.js (App Router) + React + Socket.IO client**,
with real-time in-game voice chat (WebRTC, see [docs/VOICE.md](docs/VOICE.md)).

Backend repo: `mafia-backend` (must be running for the game to work).

## Requirements

- Node.js **20.9+** (`.nvmrc` pins 22)
- npm
- A running `mafia-backend`

## Run locally

```bash
npm install
cp .env.example .env.local     # points to http://localhost:4000
npm run dev                    # http://localhost:3000
```

Test alone: create a room and press **Fill with bots** in the lobby, then Start.

Voice: open the room in two different browsers (or a normal + an incognito window),
then **Players → Join voice**. Use headphones on one PC to avoid echo.

## Environment variables

| Name | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SERVER_URL` | yes | Public URL of `mafia-backend`, no trailing slash (e.g. `https://mafia-backend.onrender.com`) |

It is baked in at build time: after changing it on the host, **redeploy**.

## Deploy (Vercel)

1. Push this repo to GitHub.
2. Vercel → Add New → Project → import the repo (framework: Next.js, root: `/`).
3. Environment variable `NEXT_PUBLIC_SERVER_URL` = your backend URL.
4. Deploy. Then set the backend's `CLIENT_ORIGIN` to this site's URL.

Any Node host also works: `npm ci && npm run build && npm start`.

> The microphone only works on **https** (or `localhost`) — Vercel gives you https.

## Layout

```
app/          pages: home, play, room/[code], stats
components/   UI (VoicePanel, Chat, PlayerCard, Timer, …)
lib/          socket.js, useRoom.js, voice.js + useVoice.js (voice chat), sound, stats
public/       static assets
```

Stats are stored in each player's browser (localStorage), no database.
