import jwt from "jsonwebtoken";
import { AUTH_TOKEN } from "./const.js";
import fsp from "node:fs/promises";
import { v4 as uuid } from "uuid";
import { createHash } from "node:crypto";
import process from "node:process";
import { Buffer } from "node:buffer";
import { tryCatcher } from "@flover/jsutils";

/** @return {string} */
export function generateToken(userID, res) {
  const token = jwt.sign({ userID }, process.env.SECRET, {
    expiresIn: "7d",
    algorithm: "HS256",
  });
  res.cookie(AUTH_TOKEN, token, {
    maxAge: 7 * (24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.ENV === "prod",
  });
  return token;
}

export function deleteToken(res) {
  res.cookie(AUTH_TOKEN, "", { maxAge: 0 });
}

export function internalError(res, error, ...traceback) {
  console.log(`${traceback.join(": ")}: ${error}`);
  return res.status(500).json({ message: "internal server error" });
}

export async function saveImage(base64Image, folder, ...keys) {
  try {
    await tryCatcher(fsp.access, folder).onErrorAwait(async () => {
      await fsp.mkdir(folder, { recursive: true });
    });

    const matches = base64Image.match(/^data:([A-Za-z-+\\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error("invalid base64 image format");
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const extension = mimeType.split("/")[1];

    let imageName = uuid();
    if (keys.length > 0) imageName = signKeys(imageName, ...keys);
    const fileName = `${imageName}.${extension}`;
    const filePath = `${folder}/${fileName}`;

    const buffer = Buffer.from(base64Data, "base64");
    await fsp.writeFile(filePath, buffer);

    return fileName;
  } catch (error) {
    throw new Error(`save image: ${error}`);
  }
}

export async function deleteImage(fileName, folder) {
  const filePath = `${folder}/${fileName}`;
  const [_, error] = await tryCatcher(async () => {
    await fsp.access(filePath);
    await fsp.unlink(filePath);
  });
  if (error) {
    throw new Error(`delete image: ${error}`);
  }
}

function signKeys(name, ...keys) {
  keys = keys.map((key) => {
    key = createHash("sha256")
      .update(key + process.env.SECRET)
      .digest("hex")
      .slice(0, 6);
    return key;
  });
  return keys.join("-") + ";" + name;
}

export function verifyKey(name, key) {
  key = createHash("sha256")
    .update(key + process.env.SECRET)
    .digest("hex")
    .slice(0, 6);
  const signedKeys = name.split(";")[0].split("-");
  if (!signedKeys.includes(key)) return false;
  return true;
}
