import { config } from '../config/index.js'
import { type IUser } from '../models/User.js'
import jwt from 'jsonwebtoken'

export function signToken(user: IUser): string {
  return jwt.sign({ id: user._id }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn as jwt.SignOptions['expiresIn'],
  })
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function ok<T>(res: import('express').Response, data: T, status = 200) {
  return res.status(status).json({ success: true, data })
}

export function fail(res: import('express').Response, message: string, status = 400) {
  return res.status(status).json({ success: false, message })
}