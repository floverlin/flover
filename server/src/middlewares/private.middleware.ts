import type { Request, Response, NextFunction } from "express"
import { internalError, verifyKey } from "../lib/utils.js"
import { assertUserRequest } from "./auth.middleware.js"

export async function privateProtect(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        assertUserRequest(req)
        const url = req.url
        if (!verifyKey(url.slice(1), String(req.user._id)))
            return res.status(403).send("forbidden")
        next()
    } catch (error) {
        return internalError(
            res,
            error,
            "private middleware",
            "private protect"
        )
    }
}
