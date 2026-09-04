import { Request, Response } from 'express'
import { Project } from '../models/Project.js'
import { HttpError } from '../utils/asyncHandler.js'
import { slugify } from '../utils/helpers.js'

export async function getProjects(req: Request, res: Response) {
  const { featured, status } = req.query
  const filter: Record<string, unknown> = {}
  if (featured === 'true') filter.featured = true
  if (status && typeof status === 'string') filter.status = status

  const projects = await Project.find(filter).sort({ featured: -1, createdAt: -1 })
  res.json({ success: true, data: projects })
}

export async function getProjectBySlug(req: Request, res: Response) {
  const project = await Project.findOne({ slug: req.params.slug })
  if (!project) throw new HttpError(404, 'PROJECT_NOT_FOUND')
  res.json({ success: true, data: project })
}

export async function createProject(req: Request, res: Response) {
  const payload = req.body
  const project = await Project.create({
    ...payload,
    slug: payload.slug ? slugify(payload.slug) : slugify(payload.title),
  })
  res.status(201).json({ success: true, data: project })
}

export async function updateProject(req: Request, res: Response) {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  if (!project) throw new HttpError(404, 'PROJECT_NOT_FOUND')
  res.json({ success: true, data: project })
}

export async function deleteProject(req: Request, res: Response) {
  const project = await Project.findByIdAndDelete(req.params.id)
  if (!project) throw new HttpError(404, 'PROJECT_NOT_FOUND')
  res.json({ success: true, message: 'PROJECT_DELETED' })
}