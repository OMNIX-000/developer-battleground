import { Request, Response } from 'express'
import { User } from '../models/User.js'
import { HttpError } from '../utils/asyncHandler.js'
import { signToken } from '../utils/helpers.js'

export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body

  if (!name || !email || !password || password.length < 6) {
    throw new HttpError(400, 'INVALID_REGISTRATION_PAYLOAD')
  }

  const existing = await User.findOne({ email: email.toLowerCase().trim() })
  if (existing) throw new HttpError(409, 'EMAIL_ALREADY_REGISTERED')

  const user = await User.create({ name, email, password })
  const token = signToken(user)

  res.status(201).json({
    success: true,
    data: {
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    },
  })
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body

  if (!email || !password) throw new HttpError(400, 'CREDENTIALS_REQUIRED')

  const user = await User.findOne({ email: email.toLowerCase().trim() })
  if (!user) throw new HttpError(401, 'INVALID_CREDENTIALS')

  const isValid = await user.comparePassword(password)
  if (!isValid) throw new HttpError(401, 'INVALID_CREDENTIALS')

  const token = signToken(user)

  res.json({
    success: true,
    data: {
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    },
  })
}