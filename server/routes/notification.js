import express from 'express'
import { verifyToken } from '../middleware/verifyUser.js'
import { DeleteNotificationHandler, GetNotificationHandler } from '../controller/notification.js'

const router = express.Router()

router.get("/",verifyToken,GetNotificationHandler)
router.delete("/",verifyToken,DeleteNotificationHandler)

export default router