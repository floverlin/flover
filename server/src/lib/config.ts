import dotenv from "dotenv"

dotenv.config()

if (!process.env.ENV) throw new Error("No ENV in env")
if (!process.env.PORT) throw new Error("No PORT in env")
if (!process.env.SECRET) throw new Error("No SECRET in env")
if (!process.env.DATABASE_URI) throw new Error("No DATABASE_URI in env")
if (!process.env.VAPID_PUBLIC_KEY) throw new Error("No VAPID_PUBLIC_KEY in env")
if (!process.env.VAPID_PRIVATE_KEY)
    throw new Error("No VAPID_PRIVATE_KEY in env")

const config = {
    env: {
        env: process.env.ENV,
        port: process.env.PORT,
        secret: process.env.SECRET,
        databaseURI: process.env.DATABASE_URI,
        vapidPublicKey: process.env.VAPID_PUBLIC_KEY,
        vapidPrivateKey: process.env.VAPID_PRIVATE_KEY,
    },
}

export default config
