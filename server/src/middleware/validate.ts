import { NextFunction, Request, Response } from 'express'

export function validateContact(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { name, email, message } = req.body ?? {}

  const errors: string[] = []

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('NAME_REQUIRED')
  }
  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('VALID_EMAIL_REQUIRED')
  }
  if (!message || typeof message !== 'string' || message.trim().length < 10) {
    errors.push('MESSAGE_TOO_SHORT')
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join(', ') })
  }

  req.body = { name: name.trim(), email: email.trim().toLowerCase(), message: message.trim() }
  next()
}

export function validateProject(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { title, slug } = req.body ?? {}
  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ success: false, message: 'TITLE_REQUIRED' })
  }
  if (!slug || typeof slug !== 'string' || !slug.trim()) {
    return res.status(400).json({ success: false, message: 'SLUG_REQUIRED' })
  }
  next()
}