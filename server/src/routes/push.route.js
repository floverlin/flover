import { Router } from "express";
import {
  getVapidPublicKey,
  subscribe,
  unsubscribe,
} from "../controllers/push.controller.js";
import { authProtect } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authProtect);

router.get("/vapid", getVapidPublicKey);
router.post("/subscribe", subscribe);
router.post("/unsubscribe", unsubscribe);

export default router;
