# Wazheefa API — Coolify + Cloudflare Deploy

Self-hosted backend for Google login and cloud sync (Better Auth + Hono + PostgreSQL).

## Coolify setup

### 1. PostgreSQL

1. Coolify → your project → **New Resource → Database → PostgreSQL**
2. Start the database and copy the internal connection string
3. Enable scheduled backups (recommended)

### 2. API service

1. **New Resource → Git Repository** → same repo, set **Base Directory** to `server`
2. Domain: `api.yourdomain.com`
3. Build pack: **Dockerfile** (uses `server/Dockerfile`)
4. Environment variables:

```bash
DATABASE_URL=postgresql://user:pass@postgres-xxxx:5432/postgres
BETTER_AUTH_SECRET=<openssl rand -base64 32>
BETTER_AUTH_URL=https://api.yourdomain.com
GOOGLE_CLIENT_ID=<from Google Cloud Console>
GOOGLE_CLIENT_SECRET=<from Google Cloud Console>
TRUSTED_ORIGINS=https://wazheefa.yourdomain.com,http://localhost:5173
PORT=3000
```

5. After first deploy, run migrations from the API container or locally:

```bash
cd server && npm run db:push
npx auth@latest migrate
```

### 3. Google OAuth

In Google Cloud Console → OAuth 2.0 Client:

- **Authorized JavaScript origins**: `https://wazheefa.yourdomain.com`, `http://localhost:5173`
- **Authorized redirect URIs**: `https://api.yourdomain.com/api/auth/callback/google`

## Cloudflare Pages (frontend)

1. Connect the repo to Cloudflare Pages (or use `wrangler pages deploy dist`)
2. Build command: `npm run build`
3. Output directory: `dist`
4. Environment variables:

```bash
VITE_API_URL=https://api.yourdomain.com
```

## Local development

```bash
# Terminal 1 — API
cd server
cp .env.example .env
# Edit .env with local Postgres + Google credentials
npm install
npm run db:push
npx auth@latest migrate
npm run dev

# Terminal 2 — frontend
cp .env.example .env.local
# VITE_API_URL=http://localhost:3000
npm install
npm run dev
```

## Health check

`GET https://api.yourdomain.com/health` → `{ "ok": true }`
