import { assertUserRequest } from "../middlewares/auth.middleware.js"
import User from "../models/user.model.js"
import type { Request, Response } from "express"

export function getVapidPublicKey(req: Request, res: Response) {
    return res.json({ publicKey: process.env.VAPID_PUBLIC_KEY })
}

export async function subscribe(req: Request, res: Response) {
    assertUserRequest(req)
    const subscription = req.body
    const userID = req.user._id
    await User.findByIdAndUpdate(userID, {
        $push: { pushSubscriptions: subscription },
    })
    return res.status(201).json()
}

export async function unsubscribe(req: Request, res: Response) {
    assertUserRequest(req)
    const subscription = req.body
    const userID = req.user._id
    await User.findByIdAndUpdate(userID, {
        $pull: {
            pushSubscriptions: {
                endpoint: subscription.endpoint,
            },
        },
    })
    return res.status(200).json()
}
