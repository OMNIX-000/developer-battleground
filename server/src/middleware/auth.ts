import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config/index.js'
import { User, type IUser } from '../models/User.js'

export interface AuthRequest extends Request {
  user?: IUser
}

export async function protect(req: AuthRequest, res: Response, next: NextFunction) {
  let token: string | undefined

  const header = req.headers.authorization
  if (header && header.startsWith('Bearer ')) {
    token = header.split(' ')[1]
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'NOT_AUTHORIZED' })
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as { id: string }
    const user = await User.findById(decoded.id)
    if (!user) {
      return res.status(401).json({ success: false, message: 'USER_NOT_FOUND' })
    }
    req.user = user
    next()
  } catch {
    return res.status(401).json({ success: false, message: 'INVALID_TOKEN' })
  }
}

export async function adminOnly(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'ADMIN_ACCESS_REQUIRED' })
  }
  next()
}