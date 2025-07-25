import { internalError, verifyKey } from "../lib/utils.js";

export async function privateProtect(req, res, next) {
  try {
    const url = req.url;
    if (!verifyKey(url.slice(1), req.user._id))
      return res.status(403).send("forbidden");
    next();
  } catch (error) {
    return internalError(res, error, "private middleware", "private protect");
  }
}
