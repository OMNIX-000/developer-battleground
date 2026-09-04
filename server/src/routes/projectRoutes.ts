import { Router } from 'express'
import {
  getProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { protect, adminOnly } from '../middleware/auth.js'
import { validateProject } from '../middleware/validate.js'

const router = Router()

router.get('/', asyncHandler(getProjects))
router.get('/:slug', asyncHandler(getProjectBySlug))
router.post('/', protect, adminOnly, validateProject, asyncHandler(createProject))
router.put('/:id', protect, adminOnly, asyncHandler(updateProject))
router.delete('/:id', protect, adminOnly, asyncHandler(deleteProject))

export default router