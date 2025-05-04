import express from 'express'
import { scheduleEmail } from '../controllers/email.controller.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

router.post("/schedule",authMiddleware,scheduleEmail)

export default router