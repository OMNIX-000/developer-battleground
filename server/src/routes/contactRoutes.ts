import { Router } from 'express'
import { createContactMessage } from '../controllers/contactController.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { validateContact } from '../middleware/validate.js'

const router = Router()

router.post('/', validateContact, asyncHandler(createContactMessage))

export default router