import { Router } from 'express'
import {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from '../controllers/skillController.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = Router()

router.get('/', asyncHandler(getSkills))
router.post('/', protect, adminOnly, asyncHandler(createSkill))
router.put('/:id', protect, adminOnly, asyncHandler(updateSkill))
router.delete('/:id', protect, adminOnly, asyncHandler(deleteSkill))

export default router