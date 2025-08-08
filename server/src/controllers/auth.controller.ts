import { deleteToken, generateToken, internalError } from "../lib/utils.js"
import { assertUserRequest } from "../middlewares/auth.middleware.js"
import User, { type IUser } from "../models/user.model.js"
import bcrypt from "bcryptjs"
import type { Request, Response } from "express"

const M = "auth controller"

export async function signup(req: Request, res: Response) {
    const { username, email, password } = req.body
    try {
        if (!username || !email || !password)
            return res.status(400).json({ message: "all fields are required" })
        if (password.length < 8)
            return res.status(400).json({ message: "password is too short" })
        const user = await User.findOne({ email })
        if (user)
            return res.status(400).json({ message: "email already exists" })
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt)
        const newUser: IUser = new User({
            username,
            email,
            password: hashedPassword,
        })
        if (!newUser) return res.status(400).json({ message: "invalid data" })
        await newUser.save()
        generateToken({ userID: String(newUser._id) }, res)
        return res.status(201).json({
            _id: newUser._id,
            email: newUser.email,
            username: newUser.username,
            avatar: newUser.avatar,
        })
    } catch (error) {
        console.log(`auth controller: signup: ${error}`)
        return internalError(res, error, M, "sign up")
    }
}

export async function login(req: Request, res: Response) {
    const { email, password } = req.body
    try {
        if (!email || !password)
            return res.status(400).json({ message: "all fields are required" })
        if (password.length < 8)
            return res.status(400).json({ message: "password is too short" })
        const user: IUser | null = await User.findOne({ email })
        if (!user) return res.status(400).json({ message: "email not found" })
        if (!(await bcrypt.compare(password, user.password)))
            return res.status(400).json({ message: "wrong password" })
        generateToken({ userID: String(user._id) }, res)
        return res.json({
            _id: user._id,
            email: user.email,
            username: user.username,
            avatar: user.avatar,
        })
    } catch (error) {
        console.log(`auth controller: login: ${error}`)
        return internalError(res, error, M, "login")
    }
}

export function logout(req: Request, res: Response) {
    try {
        deleteToken(res)
        return res.json({ message: "logout success" })
    } catch (error) {
        console.log(`auth controller: logout: ${error}`)
        return internalError(res, error, M, "logout")
    }
}

export function getMe(req: Request, res: Response) {
    try {
        assertUserRequest(req)
        return res.json(req.user)
    } catch (error) {
        return internalError(res, error, M, "get me")
    }
}
