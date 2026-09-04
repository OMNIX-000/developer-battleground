import { Router } from 'express'
import { getMessages, updateMessage, deleteMessage } from '../controllers/adminController.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = Router()

router.get('/messages', protect, adminOnly, asyncHandler(getMessages))
router.patch('/messages/:id', protect, adminOnly, asyncHandler(updateMessage))
router.delete('/messages/:id', protect, adminOnly, asyncHandler(deleteMessage))

export default router