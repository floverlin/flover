import { internalError } from "../lib/utils.js"
import User, { type IUser } from "../models/user.model.js"
import { AUTH_TOKEN } from "../lib/const.js"
import jwt from "jsonwebtoken"
import type { NextFunction, Response, Request } from "express"
import config from "../lib/config.js"
import type { jwtPayload } from "../lib/types.js"

export interface IUserRequest extends Request {
    user: IUser
}

export function assertUserRequest(req: Request): asserts req is IUserRequest {
    if (!("user" in req)) throw new Error("no user in request")
}

export async function authProtect(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const token = req.cookies[AUTH_TOKEN]
        if (!token) return res.status(401).json({ message: "no auth cookie" })
        const decodedToken = jwt.verify(token, config.env.secret) as jwtPayload
        if (!decodedToken)
            return res.status(401).json({ message: "invalid token" })
        const user = await User.findById(decodedToken.userID).select(
            "-password"
        )
        if (!user) return res.status(404).json({ message: "user not found" })
        ;(req as IUserRequest).user = user
        next()
    } catch (error) {
        return internalError(res, error, "auth middleware", "auth protect")
    }
}
