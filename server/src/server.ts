import express from 'express'
import cors from 'cors'
import { config } from './config/index.js'
import { connectDb, isDbConnected } from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import projectRoutes from './routes/projectRoutes.js'
import skillRoutes from './routes/skillRoutes.js'
import achievementRoutes from './routes/achievementRoutes.js'
import contactRoutes from './routes/contactRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js'

const app = express()

app.use(
  cors({
    origin: config.clientUrl.split(',').map((s) => s.trim()),
    credentials: true,
  }),
)
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'SYSTEM ONLINE', db: isDbConnected() ? 'connected' : 'offline' })
})

// When MongoDB is not reachable, respond 503 instead of crashing the process.
app.use('/api', (req, res, next) => {
  if (req.path === '/health' || isDbConnected()) return next()
  res.status(503).json({
    success: false,
    message: 'DATABASE OFFLINE - start MongoDB or set MONGODB_URI in server/.env',
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/skills', skillRoutes)
app.use('/api/achievements', achievementRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/admin', adminRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

async function bootstrap() {
  await connectDb().catch(() => {
    /* non-fatal: serve fallback mode */
  })
  app.listen(config.port, () => {
    console.log(`[SERVER] Developer Battleground API running on port ${config.port}`)
    if (!isDbConnected()) {
      console.log('[SERVER] Running in FALLBACK MODE (no database). Frontend will use bundled data.')
    }
  })
}

bootstrap()