import { internalError } from "../lib/utils.js";
import User from "../models/user.model.js";
import { AUTH_TOKEN } from "../lib/const.js";
import jwt from "jsonwebtoken";
import process from "node:process";

export async function authProtect(req, res, next) {
  try {
    const token = req.cookies[AUTH_TOKEN];
    if (!token) return res.status(401).json({ message: "no auth cookie" });
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!decodedToken)
      return res.status(401).json({ message: "invalid token" });
    const user = await User.findById(decodedToken.userID).select("-password");
    if (!user) return res.status(404).json({ message: "user not found" });
    req.user = user;
    next();
  } catch (error) {
    return internalError(res, error, "auth middleware", "auth protect");
  }
}
