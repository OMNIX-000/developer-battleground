# SUPRIT PANDA — DEVELOPER BATTLEGROUND

An original, cinematic, full-stack developer portfolio themed as a tactical battle system. Every section of the site is reimagined as a game interface — missions, inventory, loadout, achievements, journey map and a communication terminal.

> This is not a portfolio with a game skin. It is a game-style system that delivers a professional developer portfolio.

---

## Features

- **Cinematic boot sequence** — animated loading screen with live init log lines
- **Game Lobby (Home)** — futuristic tactical operations base with atmosphere layers
- **Player Dossier (About)** — classified tactical profile with animated skill statistics
- **Mission Control (Projects)** — projects rendered as missions with difficulty, status and full briefing screens
- **Inventory (Skills)** — grid of equipment with level + rarity system (Common / Rare / Epic / Legendary)
- **Developer Loadout** — primary / secondary / special / tools equipment slots
- **Achievements** — locked/unlocked commendations with XP rewards
- **Journey Map** — interactive tactical map with radar sweep, route path and fog of war
- **Communication Terminal (Contact)** — validated contact form wired to the backend via `POST /api/contact`
- **Admin Command Center** — JWT-protected dashboard to manage projects, skills, achievements and contact messages
- **Three.js scene** — lazy-loaded futuristic night operations base (WebGL detection with 2D fallback)
- **Graphics settings** — Low / Medium / High with automatic device detection
- **Optional sound system** — synthesized Web Audio SFX, off by default, persisted preference
- **Responsive** — bottom game navigation, full-screen panels, touch-friendly targets

## Technology Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS, React Router 6 |
| Animation | Framer Motion, GSAP |
| Icons | Lucide React |
| 3D | Three.js, React Three Fiber, React Three Drei |
| Backend | Node.js, Express, TypeScript, tsx |
| Database | MongoDB + Mongoose |
| Auth | JWT, bcrypt |

## Architecture

```
developer-battleground/
├── client/                 # React SPA (Vite)
│   ├── public/
│   └── src/
│       ├── assets/         # images / icons / sounds / models
│       ├── components/     # common / hud / missions / inventory / achievements / ui
│       ├── layouts/        # MainLayout (HUD shell)
│       ├── pages/          # one page per game section + admin
│       ├── scenes/         # Three.js BattleScene + environment parts
│       ├── hooks/
│       ├── services/       # axios API services
│       ├── store/          # settings + notifications context
│       ├── types/          # shared TS interfaces
│       ├── utils/          # helpers, sound system, webgl detection
│       ├── data/           # seeded static fallback data
│       ├── App.tsx
│       └── main.tsx
│
├── server/                 # Express REST API
│   └── src/
│       ├── config/         # env config + db connection
│       ├── controllers/
│       ├── middleware/     # auth, validation, error handlers
│       ├── models/         # User, Project, Skill, Achievement, ContactMessage
│       ├── routes/
│       ├── services/
│       ├── utils/
│       ├── types/
│       ├── scripts/        # seed + create-admin
│       └── server.ts
│
├── README.md
├── .gitignore
└── .env.example
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or MongoDB Atlas) — **optional**: without it the API runs in fallback mode and the site uses bundled data

### 1. Install dependencies (one command)

```bash
npm run install:all
```

### 2. Configure environment variables

Copy the `.env.example` files to `.env` (defaults work out of the box):

```bash
# @project root → .env.example  (runner config)
# client/.env  → VITE_API_URL
# server/.env  → PORT, MONGODB_URI, JWT_SECRET, CLIENT_URL, ADMIN_EMAIL, ADMIN_PASSWORD
```

Example `server/.env`:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/developer-battleground   # or your Atlas URI
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change_this_please_123
```

### 3. Run everything (one command)

From the project root:

```bash
npm run dev
```

- Frontend → http://localhost:5173
- Backend  → http://localhost:5000/api/health

**No MongoDB?** No problem. The site runs with static fallback data; the API stays up and every data route responds `503 DATABASE OFFLINE`. Add a `MONGODB_URI` (local or Atlas) to `server/.env`, restart, and run the seeds below.

### 4. Seed the database (optional, requires MongoDB)

```bash
npm run seed
```

This inserts the stock-market-prediction project, the full skill inventory, and all achievements.

### 5. Create the admin user (optional, requires MongoDB)

```bash
npm run create-admin
```

> Passwords are never stored in source code. They come only from environment variables.

To test the admin flow (requires MongoDB): visit `/admin/login` and sign in with the credentials you set.

## API Reference

All endpoints return `{ success, data | message }`.

### Public

| Method | Route | Description |
|---|---|---|
| GET | `/api/health` | Server status |
| GET | `/api/projects` | List projects (`?featured=true`, `?status=`) |
| GET | `/api/projects/:slug` | Single project |
| GET | `/api/skills` | List skills |
| GET | `/api/achievements` | List achievements |
| POST | `/api/contact` | Submit contact message `{ name, email, message }` |

### Auth

| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Register `{ name, email, password }` → token + user |
| POST | `/api/auth/login` | Login `{ email, password }` → token + user |

### Protected (admin token required: `Authorization: Bearer <token>`)

| Method | Route | Description |
|---|---|---|
| POST | `/api/projects` | Create project |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |
| POST | `/api/skills` | Create skill |
| PUT | `/api/skills/:id` | Update skill |
| DELETE | `/api/skills/:id` | Delete skill |
| POST | `/api/achievements` | Create achievement |
| PUT | `/api/achievements/:id` | Update achievement |
| DELETE | `/api/achievements/:id` | Delete achievement |
| GET | `/api/admin/messages` | List contact messages |
| PATCH | `/api/admin/messages/:id` | Set status `new` / `read` / `archived` |
| DELETE | `/api/admin/messages/:id` | Delete message |

## Database Models

- **User** — name, email, password (hashed), role (`user`/`admin`)
- **Project** — title, slug, descriptions, objective/problem/solution, architecture, keyFeatures, technologies, images, githubUrl, liveUrl, status, featured, difficulty, missionNumber
- **Skill** — name, category, level (1–10), description, icon, rarity
- **Achievement** — title, description, icon, xpReward, unlocked
- **ContactMessage** — name, email, message, status

## Frontend Behavior When Backend Is Offline

Every data-driven page falls back to bundled seed data so the site remains fully navigable if the API is unreachable. Errors show `CONNECTION LOST` panels with a retry action — the application never crashes.

## Deployment

### Frontend — Vercel

1. Push `client/` to a repo (or set root to `client`).
2. Build command: `npm run build`, output: `dist`.
3. Set env var `VITE_API_URL` to the production API URL.

### Backend — Render

1. New Web Service pointing at `server/`.
2. Build: `npm install && npm run build`, start: `npm start`.
3. Set env vars: `PORT`, `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`.

### Database — MongoDB Atlas

1. Create a free cluster, allow network access.
2. Copy the connection string into `MONGODB_URI`.
3. Run `npm run seed` and `npm run create-admin` against the Atlas URI.

### CORS

The backend reads `CLIENT_URL` (comma-separated allowed origins) from the environment, so production requests from Vercel are automatically permitted.

## Performance Notes

- All pages, the Three.js scene and the animation libs are code-split via `React.lazy`
- Three.js scene reduces particles / shadows on LOW and MEDIUM presets
- WebGL-unsupported devices automatically receive the animated 2D background
- `prefers-reduced-motion` is respected in CSS

## License

Personal portfolio project. All visual assets and the tactical theme are original creations — no copyrighted game assets are used.