import { Router } from "express"
import { login, logout, signup, getMe } from "../controllers/auth.controller.js"
import { authProtect } from "../middlewares/auth.middleware.js"

const router = Router()

router.post("/signup", signup)
router.post("/login", login)
router.get("/logout", logout)

router.get("/me", authProtect, getMe)

export default router
