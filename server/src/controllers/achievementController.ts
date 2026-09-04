import { Request, Response } from 'express'
import { Achievement } from '../models/Achievement.js'
import { HttpError } from '../utils/asyncHandler.js'

export async function getAchievements(_req: Request, res: Response) {
  const achievements = await Achievement.find().sort({ unlocked: -1, xpReward: -1 })
  res.json({ success: true, data: achievements })
}

export async function createAchievement(req: Request, res: Response) {
  const achievement = await Achievement.create(req.body)
  res.status(201).json({ success: true, data: achievement })
}

export async function updateAchievement(req: Request, res: Response) {
  const achievement = await Achievement.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  if (!achievement) throw new HttpError(404, 'ACHIEVEMENT_NOT_FOUND')
  res.json({ success: true, data: achievement })
}

export async function deleteAchievement(req: Request, res: Response) {
  const achievement = await Achievement.findByIdAndDelete(req.params.id)
  if (!achievement) throw new HttpError(404, 'ACHIEVEMENT_NOT_FOUND')
  res.json({ success: true, message: 'ACHIEVEMENT_DELETED' })
}