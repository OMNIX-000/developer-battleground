import { Request, Response } from 'express'
import { Skill } from '../models/Skill.js'
import { HttpError } from '../utils/asyncHandler.js'

export async function getSkills(_req: Request, res: Response) {
  const skills = await Skill.find().sort({ level: -1 })
  res.json({ success: true, data: skills })
}

export async function createSkill(req: Request, res: Response) {
  const skill = await Skill.create(req.body)
  res.status(201).json({ success: true, data: skill })
}

export async function updateSkill(req: Request, res: Response) {
  const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  if (!skill) throw new HttpError(404, 'SKILL_NOT_FOUND')
  res.json({ success: true, data: skill })
}

export async function deleteSkill(req: Request, res: Response) {
  const skill = await Skill.findByIdAndDelete(req.params.id)
  if (!skill) throw new HttpError(404, 'SKILL_NOT_FOUND')
  res.json({ success: true, message: 'SKILL_DELETED' })
}