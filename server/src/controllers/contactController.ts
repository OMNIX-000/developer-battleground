import { Request, Response } from 'express'
import { ContactMessage } from '../models/ContactMessage.js'

export async function createContactMessage(req: Request, res: Response) {
  const { name, email, message } = req.body
  const doc = await ContactMessage.create({ name, email, message })
  res.status(201).json({
    success: true,
    message: 'MESSAGE_RECEIVED',
    data: { id: doc._id },
  })
}