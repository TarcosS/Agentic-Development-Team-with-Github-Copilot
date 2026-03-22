# Agentic Development Team with GitHub Copilot

A monorepo containing a Next.js web app (`apps/web`) and a Node.js/Express API (`apps/api`), managed with [pnpm workspaces](https://pnpm.io/workspaces).

---

## Runbook — local development setup

### Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 24 LTS |
| pnpm | 10+ |

```bash
npm install -g pnpm   # if pnpm is not installed
```

---

### 1. Install dependencies

```bash
pnpm install
```

---

### 2. Configure the web environment

```bash
cp apps/web/.env.local.example apps/web/.env.local
```

Edit `apps/web/.env.local` if the API runs on a port other than `4000`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

---

### 3. Start both apps in development mode

Open **two terminals** (or use a process manager):

**Terminal 1 — API** (port `4000` by default):

```bash
pnpm --filter @apps/api dev
# or: PORT=4000 node apps/api/index.js
```

**Terminal 2 — Web** (port `3000` by default):

```bash
pnpm --filter @apps/web dev
```

Or start both in parallel from the repo root:

```bash
pnpm dev
```

---

### 4. Verify

| What | URL |
|------|-----|
| Web app | <http://localhost:3000> |
| API health | <http://localhost:4000/health> |
| API message | <http://localhost:4000/api/message> |

Opening the web app should display the message returned by the API. If the API is offline, the page shows an error message instead.

---

### 5. Build for production

```bash
pnpm build
```

---

## Project structure

```
apps/
├── api/          # Express.js REST API
│   └── index.js  # Server entry-point (port 4000)
└── web/          # Next.js 16 App Router
    ├── app/      # Pages and layouts
    └── lib/api/  # Shared API client (Instance + endpoint helpers)
```

---

## Environment variables

### `apps/web`

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_BASE_URL` | `http://localhost:4000` | Base URL of the API server |

### `apps/api`

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `4000` | Port the Express server listens on |
| `WEB_ORIGIN` | `http://localhost:3000` | Allowed CORS origin |
