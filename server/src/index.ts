import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { auth } from './auth.js'
import { sync } from './routes/sync.js'

function getTrustedOrigins(): string[] {
  const raw = process.env.TRUSTED_ORIGINS ?? 'http://localhost:5173'
  return raw.split(',').map((o) => o.trim()).filter(Boolean)
}

const app = new Hono()

app.get('/health', (c) => c.json({ ok: true }))

app.use(
  '/api/*',
  cors({
    origin: (origin) => {
      const allowed = getTrustedOrigins()
      if (!origin) return allowed[0] ?? '*'
      return allowed.includes(origin) ? origin : allowed[0]
    },
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'OPTIONS'],
    credentials: true,
    maxAge: 600,
  })
)

app.on(['POST', 'GET'], '/api/auth/*', (c) => auth.handler(c.req.raw))

app.route('/api/sync', sync)

const port = Number(process.env.PORT ?? 3000)

serve({ fetch: app.fetch, port }, () => {
  console.log(`Wazheefa API listening on http://localhost:${port}`)
})
