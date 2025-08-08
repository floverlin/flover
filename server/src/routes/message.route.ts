import { Router } from "express"
import { authProtect } from "../middlewares/auth.middleware.js"
import {
    getChats,
    getFilteredChats,
    getMessages,
    getOneChat,
    markMessageReaded,
    sendMessage,
} from "../controllers/message.controller.js"

const router = Router()

router.get("/chats", authProtect, getChats)
router.get("/chat/:chatID", authProtect, getOneChat)
router.get("/chats-global", authProtect, getFilteredChats)
router.get("/:chatID", authProtect, getMessages)
router.post("/send/:chatID", authProtect, sendMessage)
router.put("/mark-readed", authProtect, markMessageReaded)

export default router
