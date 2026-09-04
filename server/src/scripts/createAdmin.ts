import { connectDb, disconnectDb } from '../config/db.js'
import { User } from '../models/User.js'
import { config } from '../config/index.js'

async function createAdmin() {
  if (!config.adminEmail || !config.adminPassword) {
    console.error('[ADMIN] ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env')
    process.exit(1)
  }

  await connectDb()

  const existing = await User.findOne({ email: config.adminEmail })
  if (existing) {
    existing.role = 'admin'
    if (config.adminPassword) existing.password = config.adminPassword
    await existing.save()
    console.log(`[ADMIN] ${config.adminEmail} updated (role + password).`)
  } else {
    await User.create({
      name: 'Administrator',
      email: config.adminEmail,
      password: config.adminPassword,
      role: 'admin',
    })
    console.log(`[ADMIN] Created admin user ${config.adminEmail}`)
  }

  await disconnectDb()
}

createAdmin()