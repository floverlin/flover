import { PUBLIC } from "../lib/const.js"
import { deleteImage, internalError, saveImage } from "../lib/utils.js"
import { assertUserRequest } from "../middlewares/auth.middleware.js"
import User from "../models/user.model.js"
import type { Request, Response } from "express"

const M = "user controller"

export async function updateAvatar(req: Request, res: Response) {
    try {
        assertUserRequest(req)
        const { avatar } = req.body
        if (!avatar)
            return res.status(400).json({ message: "picture is required" })
        const savedAvatar = await saveImage(avatar, PUBLIC)
        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                avatar: savedAvatar,
            },
            {
                new: true,
            }
        )
        if (!user) throw new Error("user not found")
        if (req.user.avatar) await deleteImage(req.user.avatar, PUBLIC)
        return res.status(200).json({
            _id: user._id,
            email: user.email,
            username: user.username,
            avatar: user.avatar,
        })
    } catch (error) {
        return internalError(res, error, M, "update avatar")
    }
}

export async function updateProfile(req: Request, res: Response) {
    const { username, email } = req.body
    try {
        assertUserRequest(req)
        if (!username || !email)
            return res.status(400).json({ message: "all field are required" })
        const user = await User.findOne({ email })
        if (!user) throw new Error("user not found")

        if (user && user.email !== req.user.email)
            return res.status(400).json({ message: "email already exists" })
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { username, email },
            { new: true }
        )
        if (!updatedUser) throw new Error("no updatedUser")
        return res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            avatar: updatedUser.avatar,
            email: updatedUser.email,
        })
    } catch (error) {
        return internalError(res, error, M, "update profile")
    }
}
