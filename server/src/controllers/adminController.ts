import { Request, Response } from 'express'
import { ContactMessage } from '../models/ContactMessage.js'
import { HttpError } from '../utils/asyncHandler.js'

export async function getMessages(_req: Request, res: Response) {
  const messages = await ContactMessage.find().sort({ createdAt: -1 })
  res.json({ success: true, data: messages })
}

export async function updateMessage(req: Request, res: Response) {
  const { status } = req.body
  if (!['new', 'read', 'archived'].includes(status)) {
    throw new HttpError(400, 'INVALID_STATUS')
  }
  const message = await ContactMessage.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true },
  )
  if (!message) throw new HttpError(404, 'MESSAGE_NOT_FOUND')
  res.json({ success: true, data: message })
}

export async function deleteMessage(req: Request, res: Response) {
  const message = await ContactMessage.findByIdAndDelete(req.params.id)
  if (!message) throw new HttpError(404, 'MESSAGE_NOT_FOUND')
  res.json({ success: true, message: 'MESSAGE_DELETED' })
}