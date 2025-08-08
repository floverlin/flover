import { Router } from "express"
import { authProtect } from "../middlewares/auth.middleware.js"
import { updateAvatar, updateProfile } from "../controllers/user.constroller.js"

const router = Router()

router.use(authProtect)

router.put("/update-avatar", updateAvatar)
router.put("/update-profile", updateProfile)

export default router
