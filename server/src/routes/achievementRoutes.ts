import { Router } from 'express'
import {
  getAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
} from '../controllers/achievementController.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = Router()

router.get('/', asyncHandler(getAchievements))
router.post('/', protect, adminOnly, asyncHandler(createAchievement))
router.put('/:id', protect, adminOnly, asyncHandler(updateAchievement))
router.delete('/:id', protect, adminOnly, asyncHandler(deleteAchievement))

export default router