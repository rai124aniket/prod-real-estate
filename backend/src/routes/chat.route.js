import express from "express"
import { sendMessage, getChats } from "../controllers/chat.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"

const router = express.Router()


router.post("/:receiverId", authMiddleware, sendMessage)


router.get("/:userId", authMiddleware, getChats)

export default router
