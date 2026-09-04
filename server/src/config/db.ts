import mongoose from 'mongoose'
import { config } from './index.js'

export async function connectDb(): Promise<void> {
  try {
    await mongoose.connect(config.mongodbUri, {
      serverSelectionTimeoutMS: 4000,
      connectTimeoutMS: 4000,
    })
    console.log('[DB] Connected to MongoDB')
  } catch (err) {
    console.error(
      '[DB] MongoDB is not reachable. Starting in FALLBACK MODE - all data endpoints will return "database offline".',
    )
    console.error('[DB] Reason:', err instanceof Error ? err.message : err)
  }
}

export function isDbConnected(): boolean {
  return mongoose.connection.readyState === 1
}

export async function disconnectDb(): Promise<void> {
  await mongoose.disconnect()
}